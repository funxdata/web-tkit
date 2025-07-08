import { real_time_info } from "./realtime.ts";
import { sass_view } from "../plugin/plugin.ts";

const isImage=(file:string)=> {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(file);
}

const isVideo=(file:string)=> {
  return /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(file);
}

export const ReqHandler = (
    clients: Set<WebSocket>,
    LOCAL_IP: string
  ) => {
    return async function req_Handler(req: Request): Promise<Response> {
      const url = new URL(req.url);
      const regex_ts = /\.ts$/i;
      const regex_css = /\.css$/i;
      const regex_js = /\.js$/i;
      const regex_sass = /\.sass$/i;
  
      if (regex_ts.test(url.pathname)) {
        try {
          const content = await real_time_info("." + url.pathname);
          return new Response(content, {
            headers: { "Content-Type": "application/javascript" },
          });
        } catch (err) {
          console.log(err);
          return new Response("File not found", { status: 404 });
        }
      }
  
      if (regex_js.test(url.pathname)) {
        try {
          const content = await Deno.readTextFile("." + url.pathname);
          return new Response(content, {
            headers: { "Content-Type": "application/javascript" },
          });
        } catch (err) {
          console.log(err);
          return new Response("File not found", { status: 404 });
        }
      }
      // if (regex_sass.test(url.pathname)) {
      //   try {
      //     const content = await sass_view("." + url.pathname);
      //     return new Response(content, {
      //       headers: { "Content-Type": "text/css" },
      //     });
      //   } catch (err) {
      //     console.log(err);
      //     return new Response("File not found", { status: 404 });
      //   }
      // }
      if (regex_css.test(url.pathname)) {
        try {
          const content = await Deno.readTextFile("." + url.pathname);
          return new Response(content, {
            headers: { "Content-Type": "text/css" },
          });
        } catch (err) {
          console.log(err);
          return new Response("File not found", { status: 404 });
        }
      }
  
      if (isVideo(url.pathname)) {
        try {
          const video_file = await Deno.open("." + url.pathname, { read: true });
          return new Response(video_file.readable, {
            status: 200,
            headers: {
              "Content-Type": "video/mp4",
            },
          });
        } catch (err) {
          console.log(err);
          return new Response("File not found", { status: 404 });
        }
      }
  
      if (isImage(url.pathname)) {
        try {
          const content = await Deno.readFile("." + url.pathname);
          return new Response(content, {
            headers: { "Content-Type": "image/png" },
          });
        } catch (err) {
          console.log(err);
          return new Response("File not found", { status: 404 });
        }
      }
  
      if (url.pathname === "/live") {
        const { socket, response } = Deno.upgradeWebSocket(req);
        socket.onopen = () => clients.add(socket);
        socket.onclose = () => clients.delete(socket);
        socket.onerror = () => clients.delete(socket);
        return response;
      }
  
      // default: return HTML page
      const content = await Deno.readTextFile("index.html");
      const script = `
      <script defer>
        const ws = new WebSocket("ws://${LOCAL_IP}:8864/live");
        ws.onmessage = (event) => {
          if (event.data === "reload") {
            console.log("Reloading page...");
            location.reload();
          }
        };
      </script>
      `;
  
      const html = content.replace("</body>", `${script}\n</body>`);
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    };
  };
  