// 初始化html 入口文件
const app_html =`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>web-toolkit</title>
</head>
<body>
  <div id="app">
    <h1>web-ToolKit from index.html!</h1>
  </div>
</body>
<script type="module" src="./src/app.ts"></script>
</html>`

await Deno.writeTextFile("./index.html", app_html);

// 初始化src目录
await Deno.mkdir("src", { recursive: true });

const app_info = `
  console.log("this web-kit is info");
  const app_doc = document.getElementById("app") as HTMLElement;
  app_doc.innerHTML = "<h1>web-ToolKit from index.html!</h1>";
  `
await Deno.writeTextFile("./src/app.ts", app_info);

// 初始化assets
await Deno.mkdir("assets", { recursive: true });

// 初始化css
await Deno.mkdir("assets/css", { recursive: true });
const base_css_info = `
  @import "tailwindcss";
  .my-button {
    @apply p-4 bg-blue-500 text-white rounded-lg;
  }
  `
await Deno.writeTextFile("./assets/css/base.css", app_html);
// 初始化deno
const deno_cfg = `
{
    "version": "0.0.1",
    "tasks": {
        "view": "deno run --allow-net --allow-read  --allow-run  --allow-env --allow-ffi --allow-sys jsr:@funxdata/toolkit/view",
        "pack":"deno run --allow-net --allow-read --allow-env --allow-ffi --allow-sys jsr:@funxdata/toolkit/pack",
        "screen": "deno run --allow-net --allow-read --allow-run --allow-env --allow-ffi --allow-sys jsr:@funxdata/toolkit/screen"
    },
    "imports": {
        "@funxdata/toolkit": "jsr:@funxdata/funxdata@^0.1.34"
    },
    "compilerOptions": {
      "lib": ["dom", "dom.iterable", "esnext","deno.ns"]
    },
    "nodeModulesDir": "auto",
}
`

// 写入 deno.json（存在则覆盖）
await Deno.writeTextFile("./deno.json", JSON.stringify(deno_cfg, null, 2));

// 更新到最新的deno 包
const cmd = new Deno.Command("deno", {
  args: ["update", "--latest"],
  stdout: "piped",
  stderr: "piped",
});
const child = cmd.spawn();
const status = await child.status;
console.log("code:", status.code);

// 安装相关的插件
const cmd2 = new Deno.Command("deno", {
  args: ["run", "--allow-read", "--allow-write", "npm:@tailwindcss/oxide"],
  stdout: "piped",
  stderr: "piped",
});

const child2= cmd2.spawn();
const status2 = await child2.status;
console.log("code:", status2.code);
