// src/app.ts

const router = (globalThis as any)["GlobalPagesRouter"];

import { homePage }    from "./pages/home.ts";
import { httpPage }    from "./pages/http.ts";
import { ssePage }     from "./pages/sse.ts";
import { socketPage }  from "./pages/socket.ts";
import { storagePage } from "./pages/storage.ts";
import { uiPage }      from "./pages/ui.ts";

console.log("[app] router =", router);

if (!router) {
  console.error("[app] ❌ GlobalPagesRouter 未挂载");
} else {
  const render = (html: string) => {
    const el = document.getElementById("app");
    if (!el) return console.error("[app] ❌ 找不到 #app");
    el.innerHTML = html;
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("[app] 渲染完成，长度 =", html.length);
  };

  const bind = (path: string, title: string, hook: () => void) => {
    const node = router.on(path, title);
    if (node) {
      node.title = title;
      node.hook  = hook;
      console.log(`[app] ✔ ${path} (${title})`);
    } else {
      console.warn(`[app] ⚠ ${path} 返回 null`);
    }
  };

  // 注册 6 个真实路径
  bind("/home",    "首页",    () => { console.log("[app] 命中 /home");    render(homePage());    });
  bind("/http",    "HTTP",    () => { console.log("[app] 命中 /http");    render(httpPage());    });
  bind("/sse",     "SSE",     () => { console.log("[app] 命中 /sse");     render(ssePage());     });
  bind("/socket",  "Socket",  () => { console.log("[app] 命中 /socket");  render(socketPage());  });
  bind("/storage", "Storage", () => { console.log("[app] 命中 /storage"); render(storagePage()); });
  bind("/ui",      "UI",      () => { console.log("[app] 命中 /ui");      render(uiPage());      });

  // ── 首屏：/ 手动渲染，其它走路由 ─────────
  const path = location.pathname || "/";
  console.log("[app] 首屏 path =", path);

  if (path === "/" || path === "") {
    // 根路径：直接渲染首页，绕过被占用的 /
    console.log("[app] 根路径 → 手动渲染首页");
    render(homePage());
  } else {
    router.replace(path);
  }

  // ── 导航拦截：用 replace 切换 ────────────
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#")) return;
    e.preventDefault();
    console.log("[app] 导航 →", href);
    if (href === "/") {
      render(homePage());
    } else {
      router.replace(href);
    }
    history.pushState({}, "", href);
  });
}


