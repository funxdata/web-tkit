import { extname } from "@std/path";
import { real_time_info, real_time_sass_info, real_time_scss_info } from "./realtime.ts";
import { contentType } from "@std/media-types";

// 主请求处理器
export const ReqHandler = (
  clients: Set<WebSocket>,
  LOCAL_IP: string
) => {
  return async function req_Handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const filePath = "." + pathname;
    // console.log(url);

    // 🔁 WebSocket live reload
    if (pathname === "/live") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.onopen = () => clients.add(socket);
      socket.onclose = () => clients.delete(socket);
      socket.onerror = () => clients.delete(socket);
      return response;
    }

    // 特别处理 .ts 文件
    if (pathname.endsWith(".ts")) {
      try {
        const content = await real_time_info(filePath);
        return new Response(content, {
          headers: { "Content-Type": "application/javascript" },
        });
      } catch (err) {
        console.error(err);
        return new Response("TS file not found", { status: 404 });
      }
    }
    // 特别处理.sass 文件
    if (pathname.endsWith(".sass")) {
      try {
        const content = await real_time_sass_info(filePath);
        return new Response(content, {
          headers: { "Content-Type": "text/css" },
        });
      } catch (err) {
        console.error(err);
        return new Response("sass file not found", { status: 404 });
      }
    }
    // 特别处理.sass 文件
    if (pathname.endsWith(".scss")) {
      try {
        const content = await real_time_scss_info(filePath);
        return new Response(content, {
          headers: { "Content-Type": "text/css" },
        });
      } catch (err) {
        console.error(err);
        return new Response("sass file not found", { status: 404 });
      }
    }
    // 📦 通用静态文件处理
    try {
      const stat = await Deno.stat(filePath);
      if (stat.isFile) {
        const ext = extname(pathname); // 这里将得到 ".css"
        const mime = contentType(ext) || "application/octet-stream";
        const content = await Deno.readFile(filePath);
        return new Response(content, {
          headers: { "Content-Type": mime },
        });
      }
    } catch (_err) {
      // 继续 fallback 到 index.html
    }

    // 🧩 默认返回 index.html + LiveReload 注入脚本
    try {
      let html = await Deno.readTextFile("index.html");
      const reloadScript = `
            <script defer>
              const ws = new WebSocket("ws://${LOCAL_IP}:8864/live");
              ws.onmessage = (event) => {
                if (event.data === "reload") {
                  console.log("Reloading page...");
                  location.reload();
                }
              };
            </script>
            </body>`;
      html = html.replace("</body>", reloadScript);
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    } catch (err) {
      console.error("index.html missing:", err);
      return new Response("index.html not found", { status: 500 });
    }
  };
};
