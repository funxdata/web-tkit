import * as esbuild from "esbuild";
export const  real_time_info =async (file_src:string):Promise<String>=>{
    const result = await esbuild.build({
      entryPoints: [file_src],  // 你的入口文件
      bundle: true,             // 打包所有依赖
      write: false,          // 不写文件，获取结果
      target: "es2022",             // 目标环境
      format: "esm",         // 生成 esm 格式
    });
    // result.outputFiles 是数组，取第一个输出文件的内容（Uint8Array）
    const codeUint8Array = result.outputFiles[0].contents;
    const codeStr = new TextDecoder().decode(codeUint8Array);
    return codeStr;
}


