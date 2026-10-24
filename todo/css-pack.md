# web-tkit CSS 编译与打包

## 背景

JSR `@funxdata/toolkit@0.1.36` 已支持 Tailwind CSS v4 的 CSS 打包；本地仓库版本为 `0.1.30`，`server/pack.ts` 只处理 TS/JS，且没有 `server/parsecss.ts`。

## 任务

- [ ] CP-01 将 0.1.36 的 `server/pack.ts` 同步回仓库：增加 `.css` 分支、`project`/`version` 命名逻辑。
- [ ] CP-02 新增 `server/parsecss.ts`：PostCSS + `postcss-import` + `postcss-nested` + `@tailwindcss/postcss` + `autoprefixer` + `cssnano`；导出 `view_tailwindcss` / `pack_tailwindcss`。
- [ ] CP-03 更新 `deno.json` 依赖：`@tailwindcss/postcss@^4.1.13`、`postcss@^8.5.6`、`postcss-import`、`postcss-nested`、`autoprefixer`、`cssnano`。
- [ ] CP-04 将 `content` 从 `./src/*.{html,js,ts,css}` 扩展为 `./src/**/*.{html,js,ts,css}`，覆盖子目录。
- [ ] CP-05 版本升到 `0.1.37` 并发布；`deno task pack` 用 `assets/css/base.css` 做一次冒烟测试。
- [ ] CP-06 补充 `README.md`：CSS 入口、产物命名、Tailwind v4 注意事项。

## 验收

```bash
cd <ui-package>
deno task pack assets/css/base.css
# assets/<project>_base_<version>.css 生成，且包含 Tailwind 工具类
```
