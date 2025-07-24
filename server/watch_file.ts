import { normalize, SEPARATOR } from "@std/path";

const IGNORED_DIRS = ["node_modules","plugin","dist", ".git", ".vscode", ".cache","screen.exe.WebView2"];

export const shouldIgnore = (filePath: string): boolean => {
  const parts = normalize(filePath).split(SEPARATOR);
  return IGNORED_DIRS.some(dir => parts.includes(dir));
};

export const Watch_Files = async (WebSocket:Set<WebSocket>) => {
  const watcher = Deno.watchFs(["./"]);
  for await (const event of watcher) {
    if (["modify", "create", "remove"].includes(event.kind)) {
      // event.paths 是本次变更的所有路径数组
      const allIgnored = event.paths.every(shouldIgnore);
      if (allIgnored) {
        // 如果所有路径都在忽略目录中，跳过
        continue;
      }
      console.log("Files changed, sending reload signal...");
      for (const client of WebSocket) {
        try {
            client.send("reload");
        } catch (err){
            console.log(err);
        }
      }
    }
  }
}