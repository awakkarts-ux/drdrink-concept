// Страница товара: позиция из ?p=<slug> (по умолчанию T48), данные — js/products.js
(() => {
  const list = window.DR_PRODUCTS || [];
  const slug = new URLSearchParams(location.search).get('p') || 't48';
  const p = list.find((x) => x.slug === slug);
  // нет такой позиции — честное состояние «не найдено» вместо подмены на T48
  if (!p) {
    document.title = 'Позиция не найдена — Dr. Drink';
    const pd = document.getElementById('pd');
    pd.style.setProperty('--pk', '#17140f');
    pd.querySelector('.pd-in').innerHTML = `<div class="pd-404"><h1 class="pd-h1">Позиция не&nbsp;найдена</h1><p class="pd-lead">Такой позиции нет в&nbsp;линейке Dr.&nbsp;Drink. Все девять — на&nbsp;главной.</p><div class="pd-buy"><a class="btn btn-gold btn-lg" href="index.html#lineup">Вся линейка</a></div></div>`;
    pd.querySelector('.crumbs b').textContent = 'Не найдено';
    document.getElementById('about-product').remove();
    document.querySelector('#other .h2').textContent = 'Линейка Dr. Drink';
    document.getElementById('other-cards').innerHTML = list.map(card).join('');
    return;
  }
  const b = p.back;

  document.title = `Dr. Drink ${p.name} — турбо-дрожжи`;
  const desc = `Турбо-дрожжи Dr. Drink ${p.name}: ${p.kind.toLowerCase()}, пакет ${p.mass}. Характеристики, документы, оптовые поставки.`;
  document.querySelector('meta[name="description"]').setAttribute('content', desc);
  const ogt = document.querySelector('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', document.title);
  const pd = document.getElementById('pd');
  pd.style.setProperty('--pk', p.color);
  pd.classList.toggle('lt', p.light);
  if (p.pat) pd.classList.add('pat', `pat-${p.pat}`);

  const lead = b
    ? `Спиртовые турбо-дрожжи Dr. Drink ${p.name}. Один пакет — на ${b.water} воды и ${b.sugar} сахара, крепость браги ${b.abv}.`
    : `Спиртовые турбо-дрожжи Dr. Drink ${p.name}. ${p.kind}, пакет ${p.mass}.`;

  document.querySelectorAll('[data-f]').forEach((el) => {
    const f = el.dataset.f;
    if (f === 'img') { el.src = `img/${p.slug}.webp`; el.alt = `Пачка Dr. Drink ${p.name}`; return; }
    el.textContent = f === 'lead' ? lead : p[f];
  });

  // параметры: масса — у всех; остальное — только где есть данные с оборота
  const spec = [['Масса пакета', p.mass]];
  if (b) spec.push(['Крепость браги', b.abv], ['Сахар на пакет', b.sugar], ['Вода', b.water]);
  document.getElementById('pd-spec').innerHTML = spec.map(([k, v]) => `<div><dt class="lbl">${k}</dt><dd>${v}</dd></div>`).join('');

  const specs = [['Назначение', p.kind], ['Масса пакета', p.mass]];
  if (b) specs.push(['Сахар на пакет', b.sugar], ['Вода', b.water], ['Крепость браги', b.abv], ['Температура брожения', b.temp], ['Состав', b.comp]);
  specs.push(['Изготовитель', 'ООО «Русс-маркет»'], ['Документы', 'Декларация о соответствии ЕАЭС']);
  document.getElementById('pd-specs').innerHTML = specs.map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join('');

  document.getElementById('pd-desc').innerHTML = b
    ? `<p>${p.name} — спиртовые турбо-дрожжи Dr. Drink для домашней дистилляции. В пакете уже есть всё для брожения: дрожжи, витамины, микроэлементы и питательные вещества.</p><p>Один пакет рассчитан на ${b.water} воды и ${b.sugar} сахара. При 6 кг сахара крепость браги — 15%, при 7 кг — 17%. Рекомендуемая температура брожения — ${b.temp}.</p>`
    : `<p>${p.name} — спиртовые турбо-дрожжи Dr. Drink для домашней дистилляции. ${p.kind}, масса пакета — ${p.mass}.</p><p>Режимы брожения указаны на обороте пакета. Прайс и условия опта пришлём по запросу на почту.</p>`;

  // «Как поставить брагу» — только для позиций с оборотом
  const tUse = document.getElementById('t-use');
  if (b) {
    document.getElementById('pd-steps').innerHTML = b.steps.map(([k, v]) => `<li><b>${k}</b> — ${v}</li>`).join('');
    document.getElementById('pd-modes').innerHTML = b.modes.map(([s, a]) => `<tr><td>${s}</td><td>${a}</td></tr>`).join('');
  } else {
    tUse.remove();
    document.getElementById('p-use').remove();
  }

  // вкладки: клик и стрелки
  const tabs = [...document.querySelectorAll('.seg [role="tab"]')];
  const select = (t) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });

  // другие позиции — карточки как в линейке на главной
  document.getElementById('other-cards').innerHTML = list.filter((x) => x.slug !== p.slug).map(card).join('');
})();

function card(x) {
  return `
    <article class="card${x.light ? ' lt' : ''}${x.pat ? ` pat pat-${x.pat}` : ''}"${x.pat ? '' : ` style="--pk:${x.color}"`}>
      <img src="img/${x.slug}.webp" alt="" loading="lazy" width="${(window.DR_DIM[x.slug] || [])[0] || 675}" height="${(window.DR_DIM[x.slug] || [])[1] || 900}">
      <span class="card-k">${x.kind}</span>
      <h3 class="card-n"><a href="product.html?p=${x.slug}">${x.name}</a></h3>
      <p class="card-m"><b>${x.mass}</b><span>Подробнее →</span></p>
    </article>`;
}
