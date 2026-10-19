// Dr. Drink — концепт: компактная шапка при скролле + активный пункт меню
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

// анимация лого (видео клиента без звука): один раз при загрузке и заново при наведении; без автозапуска при «уменьшить движение»
(() => {
  const v = document.querySelector('.logo-anim');
  if (!v) return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const play = () => { v.currentTime = 0; v.play().catch(() => {}); };
  if (!still) { if (v.readyState >= 3) play(); else v.addEventListener('canplay', play, { once: true }); }
  v.closest('a').addEventListener('mouseenter', () => { if (v.paused || v.ended) play(); });
})();

// всплывающие окна (как на даблснейк.рф): data-contact — «Связаться», data-soon — «Сайт в разработке»; закрытие крестиком, кликом по фону и Esc
[['data-contact', 'contact-dlg'], ['data-soon', 'soon-dlg']].forEach(([attr, id]) => {
  const dlg = document.getElementById(id);
  if (!dlg || !dlg.showModal) return;
  document.querySelectorAll(`[${attr}]`).forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); dlg.showModal(); }));
  dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
});
