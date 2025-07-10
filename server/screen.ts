import { getLocalIP } from "./localip.ts";
import { Watch_Files } from "./watch_file.ts";
import { ReqHandler } from "./handler.ts"
const LOCAL_IP = getLocalIP();
const SocketConns = new Set<WebSocket>();
const handler = ReqHandler(SocketConns, LOCAL_IP);

// 异步启动文件监听，不阻塞主线程
Watch_Files(SocketConns);


// 获取当前screen.exe 所在位置
const screen_src = Deno.args[0];
// 启动大屏服务
const cmd = new Deno.Command(screen_src, {
    args: ["debug"],
    stdin: "null",
    stdout: "null",
    stderr: "null",
  });
  
  cmd.spawn(); // 后台执行，不等待
  const controller = new AbortController();
  const signal = controller.signal;
  
  signal.addEventListener("abort", () => {
    console.log("Server was closed");
    // 启动大屏服务
    const cmd = new Deno.Command(screen_src, {
        args: ["stop"],
        stdin: "null",
        stdout: "null",
        stderr: "null",
    });
    
    cmd.spawn(); // 后台执行，不等待
  });

// 阻塞启动 HTTP 服务，保持进程存活
Deno.serve({ hostname: LOCAL_IP, port: 8864,signal: signal }, handler);

