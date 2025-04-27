// server.ts
const clients = new Set<WebSocket>();

function isImage(file:string) {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(file);
}

function isVideo(file:string) {
  return /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(file);
}
  
const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const regex_ts = /\.ts$/i;
    const regex_css = /\.css$/i;
   
    // 加载ts文件
    if(regex_ts.test(url.pathname)){
      try {
        const content = await Deno.readTextFile("."+url.pathname);
        return new Response(content, {
          headers: { "Content-Type": "application/javascript" },
        });
      } catch (err) {
        return new Response("File not found", { status: 404 });
      }
    }

    // 加载css
    if(regex_css.test(url.pathname)){
      try {
        const content = await Deno.readTextFile("./assets/base.css");
        return new Response(content, {
          headers: { "Content-Type": "text/css" },
        });
      } catch (err) {
        return new Response("File not found", { status: 404 });
      }
    }
    // 加载video文件
  if(isVideo(url.pathname)){
    try {
      const content = await Deno.readTextFile("."+url.pathname);
      return new Response(content, {
        headers: { "Content-Type": "video/mp4" },
      });
    } catch (err) {
      return new Response("File not found", { status: 404 });
    }
  }

  // 加载图片文件
  if(isImage(url.pathname)){
    try {
      const content = await Deno.readTextFile("."+url.pathname);
      return new Response(content, {
        headers: { "Content-Type": "image/png" },
      });
    } catch (err) {
      return new Response("File not found", { status: 404 });
    }
  }
  
  // 页面自动刷新
  if (url.pathname === "/live") {
    // 处理 WebSocket 请求
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.onopen = () => clients.add(socket);
    socket.onclose = () => clients.delete(socket);
    return response;
  }

  // 加载主页面
  const content = await Deno.readTextFile("index.html");
  return new Response(content, {
      headers: { "Content-Type": "text/html" },
    });
  };

  Deno.serve({ port: 8864 }, handler);

  // 开始监听当前目录下的所有文件变化
  const watcher = Deno.watchFs(["./"]);
  console.log("Watching for file changes...");

  for await (const event of watcher) {
    if (event.kind === "modify" || event.kind === "create" || event.kind === "remove") {
      console.log("Files changed, sending reload signal...");
      for (const client of clients) {
        client.send("reload");
      }
    }
  }