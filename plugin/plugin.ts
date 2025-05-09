// 动态库路径（根据平台设置）
const libPath =
  Deno.build.os === "windows"
    ? "./plugin/lib/plugin.dll"  // "./plugin/lib/plugin.dll"
    : Deno.build.os === "darwin"
    ? "./plugin/lib/plugin.dylib"
    : "./plugin/lib/plugin.so";
  console.log(libPath)
  const absolutePath = await Deno.realPath(libPath);
  console.log(absolutePath);

// 定义函数签名
const dylib = Deno.dlopen(absolutePath, {
  sass_to_css_view: { parameters: ["pointer"], result: "pointer" },
});

const encoder = new TextEncoder();

// 预览sass文件
/**
 * 预览sass文件
 * @param file_src 源文件路径
 * @returns 编译后的css info文件
 *
 *
 */

export const sass_view = async (file_src: string): Promise<string> => {
  const inputBytes = encoder.encode(file_src + "\0");
  const inputBuf = new Uint8Array(inputBytes.length);
  inputBuf.set(inputBytes);

  const ptr = Deno.UnsafePointer.of(inputBuf.buffer);
  if (!ptr) {
    throw new Error("input is error");
  }

  const resultPtr = dylib.symbols.sass_to_css_view(ptr) as Deno.PointerValue;

  if (resultPtr === null) {
    throw new Error("sass pack error.");
  }
  const view = new Deno.UnsafePointerView(resultPtr as Deno.PointerObject);
  const resultStr = view.getCString();
  dylib.close();

  return resultStr;
};

// export const pack_sass = async (file_src: Request): Promise<string> => {
//   return "";
// };
