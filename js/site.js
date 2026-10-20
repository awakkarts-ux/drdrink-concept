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

// бургер (≤1099): меню открывается панелью под шапкой; Esc, клик по пункту и клик вне панели закрывают, фокус возвращается на кнопку
(() => {
  const btn = document.querySelector(".hd-burger"), nav = document.getElementById("hd-nav");
  if (!btn || !nav) return;
  const set = (open) => { nav.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); btn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню"); };
  btn.addEventListener("click", () => set(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { set(false); btn.focus(); } });
  document.addEventListener("click", (e) => { if (nav.classList.contains("is-open") && !e.target.closest(".hd")) set(false); });
  window.matchMedia("(min-width: 1300px)").addEventListener("change", (m) => { if (m.matches) set(false); });
})();

// анимированный логотип (видео клиента без звука) — первый экран и «О бренде»: бесконечный цикл, пока виден на экране;
// кнопка паузы (WCAG 2.2.2); при «уменьшить движение» — первый кадр
document.querySelectorAll(".logo-anim").forEach((v) => {
  const btn = v.parentElement.querySelector(".logo-toggle") || v.closest(".hero-logo-wrap, .about-logo-wrap")?.querySelector(".logo-toggle");
  let userPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches, onScreen = true;
  const setBtn = () => { if (!btn) return; btn.setAttribute("aria-pressed", String(userPaused)); btn.setAttribute("aria-label", userPaused ? "Запустить анимацию логотипа" : "Остановить анимацию логотипа"); };
  const sync = () => { if (userPaused || document.hidden || !onScreen) v.pause(); else v.play().catch(() => {}); };
  v.loop = true; v.muted = true; v.removeAttribute("autoplay");
  setBtn();
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; sync(); }, { threshold: 0.2 }).observe(v);
  if (v.readyState >= 2) sync(); else v.addEventListener("canplay", sync, { once: true });
  document.addEventListener("visibilitychange", sync);
  if (btn) btn.addEventListener("click", () => { userPaused = !userPaused; setBtn(); sync(); });
});

// «разрыв буквы O» логотипа Double Distill в баннере «Другие бренды» — перенос анимации с сайта Double Distill (mcsnmapk.bget.ru):
// разрыв обегает букву за 4 с по контуру, буква слегка пульсирует. Один раз, когда баннер виден, и при наведении/фокусе
(() => {
  const logo = document.querySelector(".pb-dd-logo");
  if (!logo) return;
  const card = logo.closest(".pb-card"), reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const letter = logo.querySelector("[data-letter=\"O\"]"), rest = logo.querySelector("[data-rest-letter]"), active = logo.querySelector("[data-active-letter]"),
    gap = logo.querySelector("[data-moving-gap]"), route = logo.querySelector("path[id$=\"gap-route\"]");
  const length = route.getTotalLength(); let busy = false;
  const position = (t) => { const s = t * length, p = route.getPointAtLength(s), a = route.getPointAtLength((s - 0.08 + length) % length), b = route.getPointAtLength((s + 0.08) % length),
    dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1, nx = -dy / n * 12, ny = dx / n * 12; gap.setAttribute("d", `M${p.x - nx} ${p.y - ny} L${p.x + nx} ${p.y + ny}`); };
  const spin = () => {
    if (busy || reduced.matches || document.hidden) return; busy = true;
    position(0); rest.style.display = "none"; active.style.display = "";
    const start = performance.now();
    const frame = (now) => { const t = Math.min(1, (now - start) / 4000); position(t * t * (3 - 2 * t)); letter.style.transform = `scale(${1 + 0.12 * Math.sin(Math.PI * t)})`;
      if (t < 1) requestAnimationFrame(frame); else { active.style.display = "none"; rest.style.display = ""; letter.style.transform = ""; busy = false; } };
    requestAnimationFrame(frame);
  };
  if ("IntersectionObserver" in window) { const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); setTimeout(spin, 650); } }, { threshold: 0.5 }); io.observe(card); }
  card.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") spin(); });
  card.addEventListener("focus", spin);
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

// волна букв логотипа Double Snake в баннере «Другие бренды» — механика и тайминги header-logo-wave.js с даблснейк.рф
// (кривая перенесена в CSS @keyframes pb-wave): один раз, когда баннер виден, и при наведении/фокусе; полный проход — 4 с
(() => {
  const logo = document.querySelector(".pb-wave");
  if (!logo) return;
  const card = logo.closest(".pb-card");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer = 0;
  const play = () => {
    if (logo.classList.contains("is-waving") || reduced.matches || document.hidden) return;
    logo.classList.add("is-waving");
    timer = setTimeout(() => logo.classList.remove("is-waving"), 4000);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); setTimeout(play, 650); } }, { threshold: 0.5 });
    io.observe(card);
  }
  card.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") play(); });
  card.addEventListener("focus", play);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { clearTimeout(timer); logo.classList.remove("is-waving"); } });
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
    ['.sec-head', 'up'], ['.about-logo', 'zoom'], ['.prod-pic', 'left'], ['.prod-text', 'right'], ['.about > div:last-child', 'up'],
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
