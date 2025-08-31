// build.ts
import { bundle } from "@deno/emit";
import { basename, extname } from "@std/path";
import { ensureDir } from "@std/fs";
import * as esbuild from "esbuild";

// 1. 获取入口文件
const pack_src = Deno.args[0];
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

// 4. bundle
const result = await bundle(pack_src, { importMap });
if (!result.code) {
  console.error("❌ 打包失败：无输出结果");
  Deno.exit(1);
}
let project_name = importMap.project
if(project_name==undefined||project_name==""){
  project_name = importMap.name
}
let project_version = importMap.version
if(project_version==undefined||project_version==""){
  project_version = "0.0.1"
}

const project_name_str = project_name.replace(/^@[^/]+\//, "");
const version_str = project_version.replace(/\./g, "_");
// 5. 用 esbuild 压缩和去 console/debugger
const outputPath = `assets/${project_name_str}_${name}_${version_str}.js`;
await ensureDir("assets");

const transformed = await esbuild.transform(result.code, {
  minify: true,
  target: "es2022",
  drop: ["console", "debugger"], // 去除 console/debugger
  format: "esm",
});

// 6. 写入输出文件
await Deno.writeTextFile(outputPath, transformed.code);
esbuild.stop();

console.log(`✅ 构建完成：${outputPath}`);