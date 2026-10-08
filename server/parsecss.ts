// server/parsecss.ts
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import tailwindPostcss from "@tailwindcss/postcss";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";
import cssnano from "cssnano";

const buildPlugins = (minify: boolean) => {
  const plugins = [
    postcssImport(),
    postcssNested(),
    tailwindPostcss(),
    autoprefixer(),
  ];
  if (minify) plugins.push(cssnano());
  return plugins;
};

interface CacheEntry {
  mtime: number;
  css: string;
}
const viewCache = new Map<string, CacheEntry>();

const compile = async (inputFile: string, minify: boolean): Promise<string> => {
  const css = await Deno.readTextFile(inputFile);
  const result = await postcss(buildPlugins(minify)).process(css, {
    from: inputFile,
  });
  return result.css;
};

/** 开发时实时编译（带 mtime 缓存） */
export const view_tailwindcss = async (inputFile: string): Promise<string> => {
  const stat = await Deno.stat(inputFile).catch(() => null);
  if (!stat?.isFile) throw new Error(`CSS file not found: ${inputFile}`);

  const mtime = stat.mtime?.getTime() ?? 0;
  const cached = viewCache.get(inputFile);
  if (cached && cached.mtime === mtime) return cached.css;

  const css = await compile(inputFile, false);
  viewCache.set(inputFile, { mtime, css });
  return css;
};

/** 打包时压缩 */
export const pack_tailwindcss = async (
  inputFile: string,
  outFile: string,
): Promise<void> => {
  const css = await compile(inputFile, true);
  await Deno.writeTextFile(outFile, css);
};

