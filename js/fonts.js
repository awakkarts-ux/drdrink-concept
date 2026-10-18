// Панель сравнения шрифтов (только концепт, клиент 18.10: «подобрать шрифты и сравнить для выбора»).
// Один заголовочный шрифт на все заголовки/кнопки/меню + текстовый. Выбор — в localStorage и в адресе (?h=…&b=…),
// чтобы ссылку с выбранной парой можно было отправить клиенту.
(() => {
  const HEAD = {
    oswald:   { name: 'Oswald — узкий капс (как «TURBO YEAST»)', css: '"Oswald", "Arial Narrow", sans-serif', q: 'Oswald:wght@500;600', w: 600, ls: '0', tt: 'uppercase' },
    robslab:  { name: 'Roboto Slab — брусковый (как «T24», «CARBON»)', css: '"Roboto Slab", Georgia, serif', q: 'Roboto+Slab:wght@700;800', w: 800, ls: '-.01em', tt: 'uppercase' },
    bitter:   { name: 'Bitter — брусковый, мягче', css: '"Bitter", Georgia, serif', q: 'Bitter:wght@700;800', w: 800, ls: '-.01em', tt: 'uppercase' },
    prosto:   { name: 'Prosto One — как «ТУРБО ДРОЖЖИ» на пачке', css: '"Prosto One", sans-serif', q: 'Prosto+One', w: 400, ls: '0', tt: 'uppercase' },
    alice:    { name: 'Alice — антиква без капса', css: '"Alice", Georgia, serif', q: 'Alice', w: 400, ls: '0', tt: 'none' },
  };
  const BODY = {
    golos:   { name: 'Golos Text', css: '"Golos Text", system-ui, sans-serif', q: 'Golos+Text:wght@400;500;600' },
    ptsans:  { name: 'PT Sans', css: '"PT Sans", system-ui, sans-serif', q: 'PT+Sans:wght@400;700' },
    onest:   { name: 'Onest', css: '"Onest", system-ui, sans-serif', q: 'Onest:wght@400;500;600' },
    rubik:   { name: 'Rubik', css: '"Rubik", system-ui, sans-serif', q: 'Rubik:wght@400;500;600' },
  };
  const url = new URL(location.href);
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  let h = url.searchParams.get('h') || store('dd-h') || 'oswald';
  let b = url.searchParams.get('b') || store('dd-b') || 'golos';
  if (!HEAD[h]) h = 'oswald';
  if (!BODY[b]) b = 'golos';

  const apply = () => {
    const H = HEAD[h], B = BODY[b], r = document.documentElement.style;
    document.getElementById('font-link').href = `https://fonts.googleapis.com/css2?family=${H.q}&family=${B.q}&display=swap`;
    r.setProperty('--f-head', H.css); r.setProperty('--head-w', H.w); r.setProperty('--head-ls', H.ls); r.setProperty('--head-tt', H.tt);
    r.setProperty('--f-body', B.css);
    store('dd-h', h); store('dd-b', b);
  };
  apply();

  document.addEventListener('DOMContentLoaded', () => {
    const box = document.createElement('div');
    box.className = 'fontpick';
    const opts = (o, cur) => Object.entries(o).map(([k, v]) => `<option value="${k}"${k === cur ? ' selected' : ''}>${v.name}</option>`).join('');
    box.innerHTML = `<div class="fp-top"><b>Шрифты — выбор</b><button type="button" aria-expanded="true">Свернуть</button></div>
      <div class="fp-body">
        <label>Заголовки, меню, кнопки<select data-k="h">${opts(HEAD, h)}</select></label>
        <label>Текст<select data-k="b">${opts(BODY, b)}</select></label>
        <p class="fp-note">Панель только для выбора, на сайте её не будет.</p>
      </div>`;
    document.body.appendChild(box);
    const btn = box.querySelector('button');
    const setMin = (m) => { box.dataset.min = m ? '1' : '0'; btn.textContent = m ? 'Развернуть' : 'Свернуть'; btn.setAttribute('aria-expanded', String(!m)); store('dd-min', m ? '1' : '0'); };
    setMin(store('dd-min') === '1');
    btn.addEventListener('click', () => setMin(box.dataset.min !== '1'));
    box.querySelectorAll('select').forEach((s) => s.addEventListener('change', () => {
      if (s.dataset.k === 'h') h = s.value; else b = s.value;
      apply();
      const u = new URL(location.href); u.searchParams.set('h', h); u.searchParams.set('b', b); history.replaceState(null, '', u);
    }));
  });
})();
