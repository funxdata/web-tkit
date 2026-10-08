import { layout } from "../components/layout.ts";

export function storagePage() {
  const content = `
    <div class="grid lg:grid-cols-2 gap-5">
      <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-sm">
        <h2 class="font-semibold text-slate-800 mb-4">localStorage 读写</h2>
        <div class="space-y-3">
          <input id="in-key" placeholder="key" value="demo"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80
                   focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition" />
          <input id="in-val" placeholder="value" value="hello"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80
                   focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition" />
          <div class="flex flex-wrap gap-2 pt-1">
            <button id="btn-set"
              class="px-5 py-2 rounded-full text-white text-sm bg-indigo-500
                     hover:bg-indigo-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">保存</button>
            <button id="btn-get"
              class="px-5 py-2 rounded-full text-sm border border-slate-200 hover:bg-slate-50 transition">读取</button>
            <button id="btn-del"
              class="px-5 py-2 rounded-full text-sm border border-rose-200 text-rose-500 hover:bg-rose-50 transition">删除</button>
          </div>
        </div>
        <pre id="out-ls"
          class="mt-4 p-4 rounded-xl bg-slate-900/95 text-emerald-300 text-xs font-mono
                 overflow-auto min-h-[60px] border border-slate-800"></pre>
      </div>

      <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-sm">
        <h2 class="font-semibold text-slate-800 mb-4">工具函数</h2>
        <p class="text-sm text-slate-500 mb-4">
          来自 <code class="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono">@/tools</code>
        </p>
        <button id="btn-tools"
          class="px-5 py-2 rounded-full text-white text-sm
                 bg-gradient-to-r from-violet-500 to-purple-500
                 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          运行示例
        </button>
        <pre id="out-tools"
          class="mt-4 p-4 rounded-xl bg-slate-900/95 text-emerald-300 text-xs font-mono
                 overflow-auto min-h-[60px] border border-slate-800"></pre>
      </div>
    </div>

    <script>
      const out = (id, d) =>
        document.getElementById(id).textContent =
          typeof d === "string" ? d : JSON.stringify(d, null, 2);

      document.getElementById("btn-set").onclick = () => {
        localStorage.setItem(
          document.getElementById("in-key").value,
          document.getElementById("in-val").value
        );
        out("out-ls", "已保存 ✓");
      };
      document.getElementById("btn-get").onclick = () => {
        out("out-ls", localStorage.getItem(document.getElementById("in-key").value) ?? "(空)");
      };
      document.getElementById("btn-del").onclick = () => {
        localStorage.removeItem(document.getElementById("in-key").value);
        out("out-ls", "已删除");
      };
      document.getElementById("btn-tools").onclick = async () => {
        try {
          const r = await fetch("/api/tools-demo");
          out("out-tools", await r.json());
        } catch (e) { out("out-tools", "错误: " + e.message); }
      };
    </script>
  `;

  return layout("Storage & 工具", "浏览器本地存储与工具函数演示。", content);
}

