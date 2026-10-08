import { layout } from "../components/layout.ts";

export function socketPage() {
  const content = `
    <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="font-semibold text-slate-800">WebSocket 回声</h2>
          <p class="text-sm text-slate-500 mt-1">发送什么就返回什么</p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span id="dot" class="w-2 h-2 rounded-full bg-slate-300"></span>
          <span id="status" class="text-slate-400">连接中</span>
        </div>
      </div>

      <div class="flex gap-3 mb-5">
        <input id="in-msg" value="hello deno"
          class="flex-1 px-4 py-2.5 rounded-full border border-slate-200 bg-white/80
                 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                 transition" />
        <button id="btn-send"
          class="px-6 py-2.5 rounded-full text-white text-sm font-medium
                 bg-gradient-to-r from-indigo-500 to-violet-500
                 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          发送
        </button>
      </div>

      <pre id="out-ws"
        class="p-4 rounded-xl bg-slate-900/95 text-emerald-300 text-xs font-mono
               overflow-auto h-72 border border-slate-800"></pre>
    </div>

    <script>
      const out = (msg) => {
        const el = document.getElementById("out-ws");
        el.textContent += msg + "\\n";
        el.scrollTop = el.scrollHeight;
      };
      const ws = new WebSocket("ws://" + location.host + "/ws");
      ws.onopen    = () => {
        document.getElementById("status").textContent = "已连接";
        document.getElementById("dot").className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
        out("[已连接]");
      };
      ws.onmessage = (e) => out("[收到] " + e.data);
      ws.onclose   = () => {
        document.getElementById("status").textContent = "已断开";
        document.getElementById("dot").className = "w-2 h-2 rounded-full bg-rose-400";
        out("[已断开]");
      };
      ws.onerror   = () => out("[错误]");

      document.getElementById("btn-send").onclick = () => {
        const v = document.getElementById("in-msg").value;
        ws.send(v);
        out("[发送] " + v);
      };
      document.getElementById("in-msg").addEventListener("keydown", (e) => {
        if (e.key === "Enter") document.getElementById("btn-send").click();
      });
    </script>
  `;

  return layout("WebSocket", "双向通信测试，发送什么就收到什么。", content);
}

