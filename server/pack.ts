// build.ts
import { bundle } from "@deno/emit";
import { basename, extname } from "@std/path";
import { ensureDir } from "@std/fs";
import * as esbuild from "esbuild";
import { pack_tailwindcss } from "./parsecss.ts";

// 1. 获取入口文件
const pack_src = Deno.args[0];
if (!pack_src) {
  console.error("Usage: deno task pack <entry.ts|entry.js|entry.css>");
  Deno.exit(1);
}
const stat = await Deno.stat(pack_src).catch(() => null);
if (!stat?.isFile) {
  console.error(`${pack_src} not found`);
  Deno.exit(1);
}

// 2. 获取文件名信息
const nameWithExt = basename(pack_src);
const ext = extname(pack_src);
const name = nameWithExt.replace(ext, "");

// 3. 加载 import map
let importMap: any = {};
try {
  const text = await Deno.readTextFile("deno.json");
  const json = JSON.parse(text);
  if (json.imports || json.importMap) {
    importMap = json;
  }
} catch {
  console.warn("⚠️ 未找到 deno.json 或导入映射为空");
}

// deno-lint-ignore prefer-const
let project_name = importMap.project ?? importMap.name ?? "project";
// deno-lint-ignore prefer-const
let project_version = importMap.version ?? "0.0.1";

const project_name_str = project_name.replace(/^@[^/]+\//, "");
const version_str = project_version.replace(/\./g, "_");

// ====== 分支处理 ======
if (ext === ".ts" || ext === ".js") {
  // --- 打包 TS/JS ---
  const result = await bundle(pack_src, { importMap });
  if (!result.code) {
    console.error("❌ 打包失败：无输出结果");
    Deno.exit(1);
  }

  const outputPath = `assets/${project_name_str}_${name}_${version_str}.js`;
  await ensureDir("assets");

  const transformed = await esbuild.transform(result.code, {
    minify: true,
    target: "es2022",
    drop: ["console", "debugger"],
    format: "esm",
  });

  await Deno.writeTextFile(outputPath, transformed.code);
  esbuild.stop();
  console.log(`✅ 构建完成：${outputPath}`);
} else if (ext === ".css") {
  // --- 编译 TailwindCSS ---
  const outputPath = `assets/${project_name_str}_${name}_${version_str}.css`;
  await ensureDir("assets");
  await pack_tailwindcss(pack_src, outputPath);
  console.log(`🎨 CSS 构建完成：${outputPath}`);
} else {
  console.error(`❌ 不支持的文件类型: ${ext}`);
  Deno.exit(1);
}
