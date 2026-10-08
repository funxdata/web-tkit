import { layout } from "../components/layout.ts";

export function ssePage() {
  const content = `
    <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="font-semibold text-slate-800">SSE 实时消息</h2>
          <p class="text-sm text-slate-500 mt-1">服务器每秒推送一条消息</p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span id="dot" class="w-2 h-2 rounded-full bg-slate-300 transition"></span>
          <span id="status" class="text-slate-400">未连接</span>
        </div>
      </div>

      <div class="flex gap-3 mb-5">
        <button id="btn-connect"
          class="px-5 py-2.5 rounded-full text-white text-sm font-medium
                 bg-gradient-to-r from-indigo-500 to-violet-500
                 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          连接
        </button>
        <button id="btn-close"
          class="px-5 py-2.5 rounded-full text-sm font-medium
                 border border-slate-200 hover:bg-slate-50 transition">
          断开
        </button>
        <button id="btn-clear"
          class="px-5 py-2.5 rounded-full text-sm font-medium
                 border border-slate-200 hover:bg-slate-50 transition ml-auto">
          清空
        </button>
      </div>

      <pre id="out-sse"
        class="p-4 rounded-xl bg-slate-900/95 text-emerald-300 text-xs font-mono
               overflow-auto h-72 border border-slate-800"></pre>
    </div>

    <script>
      let es = null;
      const out = (msg) => {
        const el = document.getElementById("out-sse");
        el.textContent += msg + "\\n";
        el.scrollTop = el.scrollHeight;
      };
      const setStatus = (text, color) => {
        document.getElementById("status").textContent = text;
        document.getElementById("dot").className = "w-2 h-2 rounded-full transition " + color;
      };

      document.getElementById("btn-connect").onclick = () => {
        if (es) return out("[已连接]");
        out("[连接中...]");
        es = new EventSource("/api/sse");
        es.onopen    = () => { setStatus("已连接", "bg-emerald-400 animate-pulse"); out("[已连接]"); };
        es.onmessage = (e) => out("[消息] " + e.data);
        es.onerror   = () => { setStatus("已断开", "bg-rose-400"); out("[错误] 连接中断"); };
      };
      document.getElementById("btn-close").onclick = () => {
        if (es) { es.close(); es = null; setStatus("未连接", "bg-slate-300"); out("[已断开]"); }
      };
      document.getElementById("btn-clear").onclick = () => {
        document.getElementById("out-sse").textContent = "";
      };
    </script>
  `;

  return layout("SSE 推送", "Server-Sent Events 单向实时消息流。", content);
}

