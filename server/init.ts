// 初始化项目

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
await Deno.mkdir("src");

const app_info = `
  console.log("this web-kit is info");
  const app_doc = document.getElementById("app") as HTMLElement;
  app_doc.innerHTML = "<h1>web-ToolKit from index.html!</h1>";
  `
await Deno.writeTextFile("./src/app.ts", app_info);

// 初始化assets
await Deno.mkdir("assets");

// 初始化deno
const deno_cfg = `
{
    "version": "0.0.1",
    "nodeModulesDir": "auto",
    "tasks": {
        "view": "deno run --allow-net --allow-read  --allow-run  --allow-env --allow-ffi jsr:@dowell/toolkit/view",
        "pack":"deno run --allow-net --allow-read --allow-env --allow-ffi jsr:@dowell/toolkit/pack"
    },
    "imports": {
        "@dowell/toolkit": "jsr:@dowell/toolkit@^0.1.17"
    },
    "compilerOptions": {
      "lib": ["dom", "dom.iterable", "esnext","deno.ns"]
    }
}
`
await Deno.writeTextFile("./deno.json", deno_cfg);
