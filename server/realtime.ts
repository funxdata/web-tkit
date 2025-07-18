import * as esbuild from "esbuild";

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
