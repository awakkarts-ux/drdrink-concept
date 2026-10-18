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
  if (p.pat) pd.classList.add('pat', `pat-${p.pat}`);

  document.querySelectorAll('[data-f]').forEach((el) => {
    const f = el.dataset.f;
    if (f === 'img') { el.src = `img/${p.slug}.webp`; el.alt = `Пачка Dr. Drink ${p.name}`; return; }
    el.textContent = p[f];
  });

  // лента «Другие позиции»: все, кроме текущей; узор — там, где он есть на пачке
  const row = document.getElementById('other-row');
  row.innerHTML = list.filter((x) => x.slug !== p.slug).map((x) => `
    <li${x.light ? ' class="lt"' : ''}>
      <a${x.pat ? ` class="pat pat-${x.pat}" style="--pat-o:.5"` : ` style="--pk:${x.color}"`} href="product.html?p=${x.slug}"><img src="img/${x.slug}.webp" alt="Dr. Drink ${x.name}" loading="lazy"><b>${x.name}</b></a>
    </li>`).join('');
})();
