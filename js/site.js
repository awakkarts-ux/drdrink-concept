// Dr. Drink — концепт: компактная шапка при скролле, активный пункт меню, лого-анимация, появление элементов, всплывающие окна
(() => {
  const hd = document.querySelector('.hd');
  const onScroll = () => hd.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = [...document.querySelectorAll('.hd-nav a')].filter((a) => a.getAttribute('href').startsWith('#'));
  const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => io.observe(s));
})();

// анимация лого (видео клиента без звука) — бесконечный цикл; кнопка паузы (WCAG 2.2.2); при «уменьшить движение» — стоит на первом кадре
(() => {
  const v = document.querySelector(".logo-anim");
  if (!v) return;
  const btn = document.querySelector(".logo-toggle");
  const setBtn = (paused) => {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(paused));
    btn.setAttribute("aria-label", paused ? "Запустить анимацию логотипа" : "Остановить анимацию логотипа");
  };
  let userPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const play = () => { if (!userPaused && !document.hidden) v.play().catch(() => {}); };
  v.loop = true;
  if (userPaused) { v.removeAttribute("autoplay"); v.pause(); }
  setBtn(userPaused);
  if (v.readyState >= 2) play(); else v.addEventListener("canplay", play, { once: true });
  document.addEventListener("visibilitychange", play);
  if (btn) btn.addEventListener("click", () => { userPaused = !userPaused; if (userPaused) v.pause(); else play(); setBtn(userPaused); });
})();

// мини-анимация лого в шапке (механика header-logo-wave.js с даблснейк.рф): один проход через 0,65 с после загрузки
// и заново при наведении мышью или фокусе; на тач и при «уменьшить движение» — статичный кадр
(() => {
  const link = document.querySelector(".hd-logo"), v = link && link.querySelector(".hd-logo-anim");
  if (!v) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const play = () => { if (reduced.matches || document.hidden || !v.paused) return; v.currentTime = 0; v.play().catch(() => {}); };
  v.addEventListener("ended", () => { v.currentTime = 0; });
  setTimeout(play, 650);
  link.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") play(); });
  link.addEventListener("focus", play);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { v.pause(); v.currentTime = 0; } });
})();

// появление элементов при скролле (как .rv на даблснейк.рф, но с каскадом по группам).
// Включается только с классом html.anim-on (его ставит скрипт в <head>, если не выбрано «уменьшить движение») —
// без JS или при отключённых анимациях всё видно сразу.
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('anim-on') || !('IntersectionObserver' in window)) { root.classList.remove('anim-on'); return; }

  // заголовок первого экрана: каждая строка выезжает из-под маски
  document.querySelectorAll('.h1, .pd-h1').forEach((h) => {
    const parts = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = parts.map((p, i) => `<span class="ln"><span style="--i:${i}">${p}</span></span>`).join('');
  });

  // что и как появляется: [селектор, тип]. Группы (data-stagger) — дети появляются по очереди
  const singles = [
    ['.sec-head', 'up'], ['.about-logo', 'zoom'], ['.about > div:last-child', 'up'],
    ['.still-text', 'up'], ['.decl-pic', 'left'], ['.decl > div:last-child', 'right'],
    ['.ccard', 'zoom'], ['.pd-tabs', 'up'], ['.ft-in', 'up'], ['.ft-bot', 'fade'],
  ];
  const groups = ['.cards', '.ben-grid', '.pb-grid', '.faq', '.facts', '.still-list', '.pd-spec', '.specs'];

  singles.forEach(([sel, type]) => document.querySelectorAll(sel).forEach((el) => { el.dataset.rv = type; }));
  groups.forEach((sel) => document.querySelectorAll(sel).forEach((g) => {
    g.dataset.stagger = '';
    [...g.children].forEach((c, i) => { c.dataset.rv = c.dataset.rv || 'up'; c.style.setProperty('--d', `${Math.min(i, 8) * 80}ms`); });
  }));
  // блок с картинкой: фото слегка «наезжает»
  document.querySelectorAll('.still').forEach((el) => { el.dataset.rv = 'still'; });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      // после появления — вернуть элементу его собственные переходы (наведение и т. п.)
      const d = parseInt(el.style.getPropertyValue('--d'), 10) || 0;
      setTimeout(() => { el.removeAttribute('data-rv'); el.classList.remove('in'); el.style.removeProperty('--d'); }, 1800 + d);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  document.querySelectorAll('[data-rv]').forEach((el) => io.observe(el));

  // первый экран и страница товара — сразу после загрузки
  setTimeout(() => root.classList.add('loaded'), 60);
})();

// всплывающие окна (как на даблснейк.рф): data-contact — «Связаться», data-soon — «Сайт в разработке»; закрытие крестиком, кликом по фону и Esc
[['data-contact', 'contact-dlg'], ['data-soon', 'soon-dlg']].forEach(([attr, id]) => {
  const dlg = document.getElementById(id);
  if (!dlg || !dlg.showModal) return;
  document.querySelectorAll(`[${attr}]`).forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); dlg.showModal(); }));
  dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
});
