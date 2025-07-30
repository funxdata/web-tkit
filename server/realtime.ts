import { bundle } from "@deno/emit";
const importMapText = await Deno.readTextFile("./deno.json");
const importMap = JSON.parse(importMapText);
console.log(importMap.imports);
// deno-lint-ignore ban-types
export const  real_time_info =async (file_src:string):Promise<String>=>{
    const result = await bundle(file_src, {
    importMap,  // 传整个importMap对象
  });
  return result.code; // ✅ 直接取 result.code 即可
}


