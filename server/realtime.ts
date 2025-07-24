import * as esbuild from "esbuild";
import { sassPlugin } from 'esbuild-sass-plugin';

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export const  real_time_info =async (file_src:string)=>{
    const file_src_md5 = await sha256(file_src)
    const pack_src = './.cache/ts_to_js_cache_'+file_src_md5+'.js';
    await esbuild.build({
      entryPoints: [file_src],  // 你的入口文件
      outfile: pack_src,    // 输出文件
      bundle: true,             // 打包所有依赖
      target: "es2022",             // 目标环境
    });
    return await Deno.readTextFile(pack_src);
}

export const  real_time_scss_info =async (file_src:string)=>{
    const file_src_md5 = await sha256(file_src)
    const pack_src = './.cache/scss_to_css_cache_'+file_src_md5+'.css';
    await esbuild.build({
      entryPoints: [file_src],
      bundle: true,
      outfile: pack_src,
      plugins: [sassPlugin({ type: 'css' })],
      loader: {
        '.scss': 'css'
      },
      sourcemap: false,                 // 可选，开启 sourcemap
      minify: false,                   // 可选，是否压缩
    });
    return await Deno.readTextFile(pack_src);
}

export const  real_time_sass_info =async (file_src:string)=>{
    const file_src_md5 = await sha256(file_src)
    const pack_src = './.cache/sass_to_css_cache_'+file_src_md5+'.css';
    await esbuild.build({
      entryPoints: [file_src],
      bundle: true,
      outfile: pack_src,
      plugins: [sassPlugin({ type: 'css' })],
      loader: {
        '.sass': 'css',
      },
      sourcemap: false,                 // 可选，开启 sourcemap
      minify: false,                   // 可选，是否压缩
    });
    return await Deno.readTextFile(pack_src);
}


