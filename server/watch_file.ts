// server/watch_file.ts
import { normalize, SEPARATOR } from "@std/path";

const IGNORED_DIRS = new Set([
  "node_modules",
  "plugin",
  "dist",
  ".git",
  ".vscode",
  ".cache",
  "screen.exe.WebView2",
]);

const isIgnored = (filePath: string): boolean => {
  const parts = normalize(filePath).split(SEPARATOR);
  for (const part of parts) {
    if (IGNORED_DIRS.has(part)) return true;
  }
  return false;
};

const DEBOUNCE_MS = 100;

export const Watch_Files = (
  clients: Set<WebSocket>,
  onReload?: (paths: string[]) => void,
) => {
  const watcher = Deno.watchFs(["./"]);

  let pending = new Set<string>();
  let timer: number | null = null;

  const flush = () => {
    timer = null;
    if (pending.size === 0) return;
    const paths = [...pending];
    pending.clear();

    console.log(`[watch] ${paths.length} file(s) changed, reload`);
    onReload?.(paths);

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send("reload");
        } catch (err) {
          console.error("[watch] send failed:", err);
          clients.delete(client);
        }
      }
    }
  };

  (async () => {
    for await (const event of watcher) {
      if (!["modify", "create", "remove"].includes(event.kind)) continue;

      const relevant = event.paths.filter((p) => !isIgnored(p));
      if (relevant.length === 0) continue;

      for (const p of relevant) pending.add(p);
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(flush, DEBOUNCE_MS);
    }
  })();

  return {
    stop: () => {
      if (timer !== null) clearTimeout(timer);
      watcher.close();
    },
  };
};

