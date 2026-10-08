import { layout } from "../components/layout.ts";

function section(title: string, body: string) {
  return `
    <section class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow-sm">
      <h2 class="font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <span class="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500"></span>
        ${title}
      </h2>
      ${body}
    </section>
  `;
}

export function uiPage() {
  const content = `
    <div class="space-y-5">

      ${section("按钮", `
        <div class="flex flex-wrap gap-3">
          <button class="px-5 py-2.5 rounded-full text-white text-sm font-medium
                         bg-gradient-to-r from-indigo-500 to-violet-500
                         shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            主按钮
          </button>
          <button class="px-5 py-2.5 rounded-full text-sm font-medium
                         border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 transition-all">
            次按钮
          </button>
          <button class="px-5 py-2.5 rounded-full text-sm font-medium
                         text-rose-500 border border-rose-200 hover:bg-rose-50 hover:-translate-y-0.5 transition-all">
            危险
          </button>
          <button class="px-5 py-2.5 rounded-full text-sm font-medium
                         text-slate-400 cursor-not-allowed" disabled>
            禁用
          </button>
        </div>
      `)}

      ${section("表单", `
        <div class="grid sm:grid-cols-2 gap-4">
          <input placeholder="用户名"
            class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80
                   focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition" />
          <input type="email" placeholder="邮箱"
            class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80
                   focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition" />
          <select class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80
                         focus:outline-none focus:ring-2 focus:ring-indigo-200 transition">
            <option>选项 A</option><option>选项 B</option>
          </select>
          <label class="flex items-center gap-2 text-sm text-slate-600 px-1">
            <input type="checkbox" class="rounded accent-indigo-500" /> 记住我
          </label>
        </div>
      `)}

      ${section("徽章", `
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 rounded-full text-xs bg-indigo-50 text-indigo-600 border border-indigo-100">默认</span>
          <span class="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-600 border border-emerald-100">成功</span>
          <span class="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-600 border border-amber-100">警告</span>
          <span class="px-3 py-1 rounded-full text-xs bg-rose-50 text-rose-600 border border-rose-100">错误</span>
          <span class="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">中性</span>
        </div>
      `)}

      ${section("提示条", `
        <div class="space-y-2">
          <div class="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-700">信息提示条</div>
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">成功提示条</div>
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-700">警告提示条</div>
          <div class="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-700">错误提示条</div>
        </div>
      `)}

      ${section("骨架屏", `
        <div class="space-y-3">
          <div class="h-4 w-2/3 rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse"></div>
          <div class="h-4 w-1/2 rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse"></div>
          <div class="h-4 w-3/4 rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse"></div>
        </div>
      `)}

      ${section("渐变卡片", `
        <div class="grid sm:grid-cols-3 gap-4">
          ${["from-sky-400 to-blue-500", "from-emerald-400 to-teal-500", "from-violet-400 to-purple-500"]
            .map(c => `
              <div class="p-5 rounded-2xl bg-gradient-to-br ${c} text-white
                          shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
                <div class="text-2xl font-bold">Aa</div>
                <div class="text-xs text-white/80 mt-1">渐变卡片</div>
              </div>
            `).join("")}
        </div>
      `)}

    </div>
  `;

  return layout("UI 组件", "Tailwind 样式系统与交互动效演示。", content);
}

