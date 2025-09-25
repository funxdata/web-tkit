// 针对tailwindcss的实时编译
import postcss from "postcss"; // css编译工具
import autoprefixer from "autoprefixer";  // 针对不同的浏览器的一些兼容
import tailwindPostcss from "@tailwindcss/postcss"; // tailwindcss的插件使用
import postcssImport from "postcss-import";        // postcss文件兼容导入
import postcssNested from "postcss-nested"; // 代码一些规范化转义
import cssnano from "cssnano";  // 代码压缩工具

// deno-lint-ignore no-explicit-any
const tailwindConfig: any = {
  content: ["./src/*.{html,js,ts,css}"],
  theme: { extend: {} },
  corePlugins: {},
};

// 编译样式
const view_tailwindcss = async (inputFile:string):Promise<string>=>{
    const css = Deno.readTextFileSync(inputFile);
    const result = await postcss([
        postcssImport(), 
        postcssNested(),
        tailwindPostcss(tailwindConfig), 
        autoprefixer()
    ]).process(css, {
        from: inputFile,
    });
    return result.css;
}

// 打包
const pack_tailwindcss = async (inputFile:string,outFile:string)=>{
    const css = Deno.readTextFileSync(inputFile);
    const result = await postcss([
        postcssImport(), 
        postcssNested(),
        tailwindPostcss(tailwindConfig), 
        autoprefixer(),
        cssnano()
    ]).process(css, {
        from: inputFile,
    });
    Deno.writeTextFile(outFile,result.css)
}

export {
    view_tailwindcss,
    pack_tailwindcss
}