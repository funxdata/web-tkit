const IGNORED_DIRS = ["node_modules", "dist", ".git", ".vscode", ".cache"];

const shouldIgnore=(path: string): boolean=> {
  // 判断路径是否包含任何忽略目录
  return IGNORED_DIRS.some(dir => path.includes(`/${dir}/`) || path.includes(`\\${dir}\\`));
}

export const Watch_Files = async (WebSocket:Set<WebSocket>) => {

  const watcher = Deno.watchFs(["./src"]);
  console.log("Watching for file changes...");
  for await (const event of watcher) {
    if (["modify", "create", "remove"].includes(event.kind)) {
      // event.paths 是本次变更的所有路径数组
      const allIgnored = event.paths.every(shouldIgnore);
      if (allIgnored) {
        // 如果所有路径都在忽略目录中，跳过
        console.log("...")
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