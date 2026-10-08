export function layout(title: string, subtitle: string, content: string) {
  return `
    <div class="min-h-screen relative overflow-x-hidden
                bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                from-indigo-50 via-white to-violet-50 text-slate-800">

      <!-- 背景装饰光斑 -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full
                    bg-indigo-200/40 blur-3xl"></div>
        <div class="absolute top-1/3 -right-40 w-[420px] h-[420px] rounded-full
                    bg-violet-200/40 blur-3xl"></div>
        <div class="absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full
                    bg-sky-200/30 blur-3xl"></div>
      </div>

      <!-- 顶部导航（玻璃拟态） -->
      <header class="sticky top-0 z-30 backdrop-blur-xl bg-white/60
                     border-b border-white/40 shadow-sm shadow-indigo-100/40">
        <nav class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="/home" data-nav class="flex items-center gap-3 group">
            <div class="relative w-9 h-9 rounded-xl
                        bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500
                        shadow-lg shadow-indigo-300/50
                        group-hover:scale-105 transition-transform">
              <div class="absolute inset-0 rounded-xl bg-white/20 opacity-0
                          group-hover:opacity-100 transition"></div>
            </div>
            <div class="leading-tight">
              <div class="font-semibold tracking-tight">Web Toolkit</div>
              <div class="text-[10px] uppercase tracking-widest text-slate-400">v0.1</div>
            </div>
          </a>

          <ul class="hidden md:flex items-center gap-1 text-sm">
            ${[
              ["/home",    "首页"],
              ["/http",    "HTTP"],
              ["/sse",     "SSE"],
              ["/socket",  "Socket"],
              ["/storage", "Storage"],
              ["/ui",      "UI"],
            ].map(([href, label]) => `
              <li>
                <a href="${href}" data-nav
                   class="relative px-4 py-2 rounded-full text-slate-600
                          hover:text-indigo-600 hover:bg-white/70
                          transition-all duration-200">
                  ${label}
                </a>
              </li>
            `).join("")}
          </ul>

          <a href="https://github.com/funxdata/web-tkit" target="_blank"
             class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full
                    text-sm font-medium text-white
                    bg-gradient-to-r from-indigo-500 to-violet-500
                    shadow-lg shadow-indigo-300/50
                    hover:shadow-xl hover:shadow-indigo-400/50 hover:-translate-y-0.5
                    transition-all duration-200">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
            </svg>
            GitHub
          </a>
        </nav>
      </header>

      <!-- 页面标题 -->
      <section class="relative max-w-6xl mx-auto px-6 pt-12 pb-6">
        <div class="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>开发预览 · 功能测试</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight
                   bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900
                   bg-clip-text text-transparent">
          ${title}
        </h1>
        <p class="mt-3 text-slate-500 max-w-2xl leading-relaxed">${subtitle}</p>
      </section>

      <!-- 主内容 -->
      <main class="relative max-w-6xl mx-auto px-6 pb-24">
        ${content}
      </main>

      <!-- 页脚 -->
      <footer class="relative border-t border-white/60 bg-white/40 backdrop-blur">
        <div class="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row
                    items-center justify-between gap-3 text-sm text-slate-400">
          <span>© ${new Date().getFullYear()} Web Toolkit · MIT</span>
          <span class="flex items-center gap-2">
            Crafted with
            <span class="font-semibold bg-gradient-to-r from-indigo-500 to-violet-500
                         bg-clip-text text-transparent">Deno + Tailwind</span>
          </span>
        </div>
      </footer>
    </div>
  `;
}

