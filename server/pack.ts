// build.ts
import * as esbuild from "https://deno.land/x/esbuild@v0.25.6/mod.js";

// build.ts
const pack_src = Deno.args[0];

await esbuild.build({
  entryPoints: [pack_src],  // 你的入口文件
  bundle: true,                 // 打包成一个文件
  minify: true,                 // 压缩代码
  outfile: "dist/release.js",    // 输出文件
  target: "es2022",             // 目标环境
  drop: ["console", "debugger"],// 去除console和debugger
});

esbuild.stop();
console.log("✅ 构建完成！");