// build.ts
import * as esbuild from "esbuild";
import { basename, extname } from "@std/path";
import { sassPlugin } from 'esbuild-sass-plugin';

// build.ts
const pack_src = Deno.args[0];
const stat = await Deno.stat(pack_src).catch(() => null);
if (!stat?.isFile) {
  console.log(`${pack_src} not found`);
  Deno.exit(1); // 可选
} 

const nameWithExt = basename(pack_src);     // "build.ts"
const ext = extname(pack_src);              // ".ts"
const name = nameWithExt.replace(ext, "");  // "build"
if(ext==".ts"){
  await esbuild.build({
    entryPoints: [pack_src],  // 你的入口文件
    bundle: true,                 // 打包成一个文件
    minify: true,                 // 压缩代码
    outfile: `assets/${name}.js`,    // 输出文件
    target: "es2022",             // 目标环境
    drop: ["console", "debugger"],// 去除console和debugger
  });
}

if(ext==".sass"){
  await esbuild.build({
    entryPoints: [pack_src],
      bundle: true,
      outfile: `assets/${name}.css`,
      plugins: [sassPlugin({ type: 'css' })],
      loader: {
        '.scss': 'css'
      },
      sourcemap: false,                 // 可选，开启 sourcemap
      minify: false,                   // 可选，是否压缩
  });
}
if(ext==".scss"){
  await esbuild.build({
   entryPoints: [pack_src],
      bundle: true,
      outfile: `assets/${name}.css`,
      plugins: [sassPlugin({ type: 'css' })],
      loader: {
        '.sass': 'css'
      },
      sourcemap: false,                 // 可选，开启 sourcemap
      minify: false,                   // 可选，是否压缩
  });
}


esbuild.stop();
console.log("✅ 构建完成！");