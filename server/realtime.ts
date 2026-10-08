// server/realtime.ts
import { bundle } from "@deno/emit";

type ImportMap = Record<string, unknown>;

const importMapUrl = new URL("../deno.json", import.meta.url);
let importMap: ImportMap = {};
let importMapMtime = 0;

const loadImportMap = async (): Promise<ImportMap> => {
  try {
    const stat = await Deno.stat(importMapUrl);
    const mtime = stat.mtime?.getTime() ?? 0;
    if (mtime !== importMapMtime) {
      const text = await Deno.readTextFile(importMapUrl);
      importMap = JSON.parse(text);
      importMapMtime = mtime;
    }
  } catch {
    // 用户项目里不一定有 deno.json，静默忽略
  }
  return importMap;
};

interface CacheEntry {
  mtime: number;
  code: string;
}
const cache = new Map<string, CacheEntry>();

/**
 * 实时编译 TS/JS。
 * - 命中 mtime 缓存则直接返回。
 * - 编译失败时返回带错误信息的 JS，让浏览器 console 能看到。
 */
export const real_time_info = async (file_src: string): Promise<string> => {
  const stat = await Deno.stat(file_src).catch(() => null);
  if (!stat?.isFile) {
    throw new Error(`TS file not found: ${file_src}`);
  }

  const mtime = stat.mtime?.getTime() ?? 0;
  const cached = cache.get(file_src);
  if (cached && cached.mtime === mtime) {
    return cached.code;
  }

  const map = await loadImportMap();

  try {
    const result = await bundle(file_src, { importMap: map });
    const code = result.code ?? "";
    cache.set(file_src, { mtime, code });
    return code;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack ?? "" : "";
    console.error(`[realtime] bundle failed: ${file_src}\n${stack}`);

    // 返回合法的 JS，让浏览器直接报错在 console
    const errorCode = `
      console.error(${JSON.stringify(`[web-tkit] compile error in ${file_src}\n${message}`)});
      throw new Error(${JSON.stringify(message)});
    `;
    cache.set(file_src, { mtime, code: errorCode });
    return errorCode;
  }
};

/** 供 watch 调用，文件变更时清掉对应缓存 */
export const invalidate_realtime = (filePath: string): void => {
  const normalized = filePath.replace(/^\.\//, "");
  cache.delete(normalized);
  cache.delete("./" + normalized);
};

