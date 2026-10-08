import { layout } from "../components/layout.ts";

function panel(id: string, title: string, desc: string, btnLabel: string, btnColor: string) {
  return `
    <div class="group p-6 rounded-2xl bg-white/80 backdrop-blur
                border border-white/60 shadow-sm hover:shadow-lg
                hover:shadow-indigo-100/60 transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="font-semibold text-slate-800">${title}</h2>
          <p class="text-sm text-slate-500 mt-1">${desc}</p>
        </div>
        <span class="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-400
                     transition"></span>
      </div>
      <button id="btn-${id}"
        class="px-5 py-2.5 rounded-full text-white text-sm font-medium
               bg-gradient-to-r ${btnColor}
               shadow-md hover:shadow-lg hover:-translate-y-0.5
               transition-all duration-200">
        ${btnLabel}
      </button>
      <pre id="out-${id}"
        class="mt-4 p-4 rounded-xl bg-slate-900/95 text-emerald-300 text-xs
               font-mono overflow-auto min-h-[80px] max-h-64
               border border-slate-800"></pre>
    </div>
  `;
}

export function httpPage() {
  const content = `
    <div class="grid lg:grid-cols-3 gap-5">
      ${panel("get", "GET 请求", "请求 /api/hello 获取 JSON", "发送 GET", "from-sky-500 to-blue-500")}
      ${panel("post", "POST JSON", "向 /api/echo 发送数据", "发送 POST", "from-emerald-500 to-teal-500")}
      ${panel("err", "错误处理", "请求一个 404 观察响应", "触发 404", "from-rose-500 to-pink-500")}
    </div>

    <script>
      const out = (id, d) =>
        document.getElementById("out-" + id).textContent =
          typeof d === "string" ? d : JSON.stringify(d, null, 2);

      document.getElementById("btn-get").onclick = async () => {
        out("get", "请求中...");
        try {
          const r = await fetch("/api/hello");
          out("get", { status: r.status, body: await r.text() });
        } catch (e) { out("get", "错误: " + e.message); }
      };

      document.getElementById("btn-post").onclick = async () => {
        out("post", "请求中...");
        try {
          const r = await fetch("/api/echo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "deno", ts: Date.now() }),
          });
          out("post", { status: r.status, body: await r.json() });
        } catch (e) { out("post", "错误: " + e.message); }
      };

      document.getElementById("btn-err").onclick = async () => {
        out("err", "请求中...");
        try {
          const r = await fetch("/api/not-found");
          out("err", { status: r.status, ok: r.ok, body: await r.text() });
        } catch (e) { out("err", "错误: " + e.message); }
      };
    </script>
  `;

  return layout("HTTP 请求", "验证客户端与服务端的基本通信能力。", content);
}

