// server/handler.ts
import { extname, normalize, resolve } from "@std/path";
import { contentType } from "@std/media-types";
import { real_time_info } from "./realtime.ts";
import { view_tailwindcss } from "./parsecss.ts";

const ROOT = resolve(".");
const PORT = 8864;

const isInsideRoot = (absPath: string): boolean =>
  absPath === ROOT || absPath.startsWith(ROOT + "/");

const text = (body: string, status = 200): Response =>
  new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

export const ReqHandler = (
  clients: Set<WebSocket>,
  LOCAL_IP: string,
): (req: Request) => Promise<Response> => {
  return async function req_Handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = decodeURIComponent(url.pathname);
    const absPath = normalize(resolve(ROOT, "." + pathname));

    if (!isInsideRoot(absPath)) {
      return text("Forbidden", 403);
    }

    // WebSocket live reload
    if (pathname === "/live") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.onopen = () => clients.add(socket);
      socket.onclose = () => clients.delete(socket);
      socket.onerror = () => clients.delete(socket);
      return response;
    }

    // .ts / .js
    if (pathname.endsWith(".ts") || pathname.endsWith(".js")) {
      try {
        const code = await real_time_info(absPath);
        return new Response(code, {
          headers: { "Content-Type": "application/javascript; charset=utf-8" },
        });
      } catch (err) {
        console.error("[handler] ts:", err);
        return text("TS file not found", 404);
      }
    }

    // .css
    if (pathname.endsWith(".css")) {
      try {
        const css = await view_tailwindcss(absPath);
        return new Response(css, {
          headers: { "Content-Type": "text/css; charset=utf-8" },
        });
      } catch (err) {
        console.error("[handler] css:", err);
        return text("CSS compile error", 500);
      }
    }

    // 静态文件
    try {
      const stat = await Deno.stat(absPath);
      if (stat.isFile) {
        const mime = contentType(extname(pathname)) ??
          "application/octet-stream";
        const content = await Deno.readFile(absPath);
        return new Response(content, {
          headers: { "Content-Type": mime },
        });
      }
    } catch {
      // fallthrough
    }

    // 兜底：index.html + LiveReload 注入
    try {
      let html = await Deno.readTextFile(resolve(ROOT, "index.html"));
      const reloadScript = `
<script defer>
(() => {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  const host = location.hostname;
  const ws = new WebSocket(proto + "//" + host + ":${PORT}/live");
  ws.onmessage = (e) => { if (e.data === "reload") location.reload(); };
})();
</script>
</body>`;
      html = html.replace("</body>", reloadScript);
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (err) {
      console.error("[handler] index.html:", err);
      return text("index.html not found", 500);
    }
  };
};

