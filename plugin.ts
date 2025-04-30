// 动态库路径（根据平台设置）
const libPath = Deno.build.os === "windows"
  ? "./plugin/target/release/plugin.dll"
  : Deno.build.os === "darwin"
  ? "./plugin/target/release/plugin.dylib"
  : "./plugin/target/release/plugin.so";

// 定义函数签名
const dylib = Deno.dlopen(libPath, {
  add: { parameters: ["i32", "i32"], result: "i32" },
});

// 调用 Rust 函数
const result = dylib.symbols.add(10, 20);
console.log("10 + 20 =", result); // 输出：30

dylib.close();