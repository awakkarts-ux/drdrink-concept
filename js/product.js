// Страница товара: позиция из ?p=<slug> (по умолчанию T48), данные — js/products.js
(() => {
  const list = window.DR_PRODUCTS || [];
  const slug = new URLSearchParams(location.search).get('p') || 't48';
  const p = list.find((x) => x.slug === slug) || list.find((x) => x.slug === 't48');
  if (!p) return;

  document.title = `Dr. Drink ${p.name} — турбо-дрожжи`;
  const pd = document.getElementById('pd');
  pd.style.setProperty('--pk', p.color);
  pd.classList.toggle('lt', p.light);

  const val = (v) => v || '—';
  document.querySelectorAll('[data-f]').forEach((el) => {
    const f = el.dataset.f;
    if (f === 'img') { el.src = `img/${p.slug}.webp`; el.alt = `Пачка Dr. Drink ${p.name}`; return; }
    const v = f === 'name' || f === 'kind' || f === 'mass' ? p[f] : val(p[f]);
    el.textContent = v;
    if (v === '—') el.classList.add('tbd');
  });

  // лента «Другие позиции»: все, кроме текущей
  const row = document.getElementById('other-row');
  row.innerHTML = list.filter((x) => x.slug !== p.slug).map((x) => `
    <li style="--pk:${x.color}"${x.light ? ' class="lt"' : ''}>
      <a href="product.html?p=${x.slug}"><img src="img/${x.slug}.webp" alt="Dr. Drink ${x.name}" loading="lazy"><b>${x.name}</b></a>
    </li>`).join('');
})();
