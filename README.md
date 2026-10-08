# web-tkit

> 一个基于 [Deno](https://deno.com/) 的前端开发工具集，面向"在浏览器中独立运行"的代码开发场景。

[![JSR](https://jsr.io/badges/@funxdata/toolkit)](https://jsr.io/@funxdata/toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 特性

- ⚡ **零配置启动**：一条 `init` 命令生成完整可运行的项目骨架。
- 🔥 **实时热更新**：基于 `Deno.watchFs` + WebSocket 的 live reload。
- 📦 **TS/JS 打包**：基于 `@deno/emit` + `esbuild`，直接读取 `deno.json` 的 import map。
- 🎨 **TailwindCSS 实时编译**：PostCSS 链路（import / nested / autoprefixer），开发时免构建。
- 🖥️ **大屏模式**：内置 `screen` 任务，可驱动独立 WebView 大屏应用。
- 🚀 **一键发布**：`release` 任务将构建产物上传至又拍云（S3 兼容）。

---

## 环境要求

- Deno `>= 2.0`（`init` 会用 `Deno.networkInterfaces`、`@deno/emit` 等 API）。
- 首次运行会自动通过 `npm:@tailwindcss/oxide` 安装 Tailwind 原生依赖，需保证网络可用。

---

## 快速开始

### 1. 初始化项目

在空目录下执行：

```bash
deno run --allow-read --allow-write --allow-run --allow-net --allow-env \
  jsr:@funxdata/toolkit/init
```

该命令会生成：

```
.
├── deno.json            # 项目配置 + task + import map
├── index.html           # 入口页面（已注入 ./src/app.ts）
├── src/
│   └── app.ts           # 应用入口
└── assets/
    └── css/
        └── base.css     # TailwindCSS 入口
```

> ⚠️ `init` 会覆盖同名文件，请在空目录或新目录下执行。

### 2. 启动开发服务器

```bash
deno task view
```

- 默认监听本机第一个非回环 IPv4 地址的 `8864` 端口。
- 自动打开浏览器访问 `http://<local-ip>:8864`。
- 修改 `src/`、`assets/`、`index.html` 等文件后，页面会自动刷新。

### 3. 打包产物

```bash
deno task pack <入口文件>
```

示例：

```bash
deno task pack src/app.ts     # → assets/<name>_app_<version>.js
deno task pack assets/css/base.css  # → assets/<name>_base_<version>.css
```

- 产物文件名中的 `<name>` / `<version>` 取自 `deno.json` 的 `name` / `version`。
- `.ts` / `.js` 会经过 `esbuild` 压缩（drop `console` / `debugger`）。
- `.css` 会经过完整 PostCSS + `cssnano` 压缩。

### 4. 大屏模式（可选）

```bash
deno task screen <screen.exe 路径>
```

启动一个独立的 WebView 大屏，同时运行开发服务器。按 `Ctrl+C` 退出时会尝试关闭 `screen.exe`。

### 5. 发布到又拍云（可选）

先设置环境变量：

```bash
export AccessKey=<your-access-key>
export SecretAccessKey=<your-secret-key>
export UPX_SERVICENAME=<your-bucket>
```

然后：

```bash
deno task release <本地目录> <云端目录>
```

会将 `<本地目录>` 下所有文件递归上传到 `<云端目录>/<version>/`。

---

## 可用 Task

| Task      | 说明                       | 主要参数              |
| --------- | -------------------------- | --------------------- |
| `view`    | 启动开发服务器 + 热更新    | —                     |
| `pack`    | 打包 TS/JS 或编译 CSS      | `<入口文件>`          |
| `screen`  | 启动大屏 + 开发服务器      | `<screen 可执行文件>` |
| `release` | 上传构建产物到又拍云       | `<本地目录> <云端目录>` |

---

## 项目结构（本仓库）

```
.
├── server/          # 框架核心（对外发布）
│   ├── handler.ts   # HTTP 请求处理 + LiveReload 注入
│   ├── init.ts      # 项目脚手架
│   ├── localip.ts   # 本机 IP 探测
│   ├── pack.ts      # 打包入口
│   ├── parsecss.ts  # TailwindCSS / PostCSS 链路
│   ├── realtime.ts  # .ts 实时 bundle
│   ├── release.ts   # 又拍云发布
│   ├── screen.ts    # 大屏模式
│   ├── server.ts    # 开发服务器入口
│   ├── upfiles.ts   # 又拍云上传封装
│   └── watch_file.ts# 文件监听 + 广播
├── src/             # 示例源码
├── pages/           # （git submodule）
├── template/        # （git submodule）
├── webdx/           # （git submodule）
└── deno.json
```

---

## 子模块

本仓库通过 git submodule 关联以下项目，克隆时请使用：

```bash
git clone --recurse-submodules https://github.com/funxdata/web-tkit.git
```

- [template](https://github.com/funxdata/template)
- [pages](https://github.com/funxdata/pages)
- [webdx](https://github.com/funxdata/webdx)

---

## License

[MIT](./LICENSE)

