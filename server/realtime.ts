import { build } from "rolldown";

export const  real_time_info =async (file_src:string)=>{
    const pack_src = './.cache/ts_to_js_cache.js';
    await build({
        input: file_src,
        output: {
          file: pack_src,
        },
    });
    return await Deno.readTextFile(pack_src);
}
