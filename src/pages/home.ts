import { layout } from "../components/layout.ts";

export function homePage() {
  const cards = [
    { href: "/http",    t: "HTTP 请求",    d: "GET / POST / JSON / 错误处理",   i: "🌐", c: "from-sky-400 to-blue-500" },
    { href: "/sse",     t: "SSE 推送",     d: "Server-Sent Events 实时消息流",  i: "📡", c: "from-emerald-400 to-teal-500" },
    { href: "/socket",  t: "WebSocket",    d: "双向通信、回声、广播",           i: "🔌", c: "from-amber-400 to-orange-500" },
    { href: "/storage", t: "Storage/工具", d: "本地存储、日期、类型工具",       i: "🧰", c: "from-violet-400 to-purple-500" },
    { href: "/ui",      t: "UI 组件",      d: "按钮、表单、徽章、骨架屏",       i: "🎨", c: "from-pink-400 to-rose-500" },
    { href: "/ui",      t: "样式系统",     d: "Tailwind 渐变与动画演示",        i: "✨", c: "from-indigo-400 to-violet-500" },
  ];

  const content = `
    <!-- Hero -->
    <section class="relative rounded-[2rem] overflow-hidden
                    bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600
                    text-white p-10 sm:p-14 shadow-2xl shadow-indigo-300/50">
      <div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

      <div class="relative max-w-3xl">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
                     bg-white/15 border border-white/20 backdrop-blur">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          开发预览 · v0.1.36
        </span>
        <h2 class="mt-6 text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          用更优雅的方式<br/>
          <span class="bg-gradient-to-r from-white via-indigo-100 to-white
                       bg-clip-text text-transparent">
            构建现代 Web 应用
          </span>
        </h2>
        <p class="mt-5 text-white/80 leading-relaxed max-w-xl">
          基于 Deno 的轻量 Web 工具集。零配置、类型安全、热更新，
          把注意力留给真正重要的事情。
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#/http"
             class="inline-flex items-center gap-2 px-6 py-3 rounded-full
                    bg-white text-indigo-600 font-medium
                    shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5
                    transition-all duration-200">
            开始测试 →
          </a>
          <a href="#/ui"
             class="inline-flex items-center gap-2 px-6 py-3 rounded-full
                    border border-white/30 text-white font-medium
                    hover:bg-white/10 transition-all duration-200">
            查看样式
          </a>
        </div>

        <div class="mt-10 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl
                    bg-black/20 backdrop-blur border border-white/10 font-mono text-xs">
          <span class="text-white/50">$</span>
          <span>deno task view</span>
        </div>
      </div>
    </section>

    <!-- 统计条 -->
    <section class="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
      ${[
        ["6", "测试模块"],
        ["0", "外部依赖"],
        ["∞", "可扩展性"],
        ["100%", "TypeScript"],
      ].map(([n, l]) => `
        <div class="p-5 rounded-2xl bg-white/70 backdrop-blur border border-white/60
                    shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
          <div class="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500
                      bg-clip-text text-transparent">${n}</div>
          <div class="mt-1 text-xs text-slate-400 uppercase tracking-wider">${l}</div>
        </div>
      `).join("")}
    </section>

    <!-- 功能卡片 -->
    <section class="mt-12">
      <h3 class="text-lg font-semibold mb-5 text-slate-700">功能模块</h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${cards.map(c => `
          <a href="${c.href}"
             class="group relative p-6 rounded-2xl bg-white/80 backdrop-blur
                    border border-white/60 shadow-sm
                    hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1
                    transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100
                        bg-gradient-to-br ${c.c} transition-opacity duration-300"></div>
            <div class="relative">
              <div class="w-12 h-12 flex items-center justify-center rounded-xl
                          bg-gradient-to-br ${c.c} text-xl text-white
                          shadow-lg group-hover:scale-110 transition-transform duration-300">
                ${c.i}
              </div>
              <h4 class="mt-4 font-semibold text-slate-800 group-hover:text-white
                         transition-colors">${c.t}</h4>
              <p class="mt-2 text-sm text-slate-500 group-hover:text-white/90
                        leading-relaxed transition-colors">${c.d}</p>
              <span class="mt-4 inline-flex items-center gap-1 text-xs
                           text-indigo-500 group-hover:text-white
                           group-hover:translate-x-1 transition-all">
                进入
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </a>
        `).join("")}
      </div>
    </section>

    <!-- 特性条 -->
    <section class="mt-12 p-8 rounded-2xl bg-white/70 backdrop-blur
                    border border-white/60 shadow-sm">
      <div class="grid sm:grid-cols-3 gap-6">
        ${[
          ["⚡", "极速启动", "毫秒级冷启动"],
          ["🎯", "零配置", "开箱即用"],
          ["🛡️", "类型安全", "端到端 TS"],
        ].map(([i, t, d]) => `
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 flex items-center justify-center rounded-xl
                        bg-indigo-50 text-lg shrink-0">${i}</div>
            <div>
              <div class="font-medium text-slate-800">${t}</div>
              <div class="text-sm text-slate-500 mt-0.5">${d}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;

  return layout("欢迎回来", "选择一个模块开始测试，或直接查看样式系统。", content);
}

