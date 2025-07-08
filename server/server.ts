import { getLocalIP } from "./localip.ts";
import { Watch_Files } from "./watch_file.ts";
import { ReqHandler } from "./handler.ts"
const LOCAL_IP = getLocalIP();
const SocketConns = new Set<WebSocket>();
const handler = ReqHandler(SocketConns, LOCAL_IP);

// 异步启动文件监听，不阻塞主线程
Watch_Files(SocketConns);

// 自动打开浏览器
const url = `http://${LOCAL_IP}:8864`;
const openCmd = Deno.build.os === "windows"
  ? ["cmd", "/c", "start", url]
  : Deno.build.os === "darwin"
    ? ["open", url]
    : ["xdg-open", url];
new Deno.Command(openCmd[0], { args: openCmd.slice(1) }).spawn();
console.log("Visit local website:", url);

// 阻塞启动 HTTP 服务，保持进程存活
Deno.serve({ hostname: LOCAL_IP, port: 8864 }, handler);