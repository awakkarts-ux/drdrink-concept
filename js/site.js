// Dr. Drink — концепт: активный пункт меню по скроллу + проверка формы заявки (без отправки)
(() => {
  // активный раздел в шапке
  const links = [...document.querySelectorAll('.hd-nav a')];
  const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach((s) => io.observe(s));
  }

  // форма: ошибки у полей, успех — в той же карточке
  const form = document.getElementById('req-form');
  if (!form) return;
  const rules = {
    name: (v) => v.trim().length > 1,
    phone: (v) => v.replace(/\D/g, '').length >= 10,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  };
  const check = (input) => {
    const ok = rules[input.name] ? rules[input.name](input.value) : true;
    const fld = input.closest('.fld');
    fld.classList.toggle('is-err', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    const err = fld.querySelector('.err');
    if (err) input.setAttribute('aria-describedby', err.id);
    return ok;
  };
  form.querySelectorAll('input[name="name"], input[name="phone"], input[name="email"]').forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => { if (input.closest('.fld').classList.contains('is-err')) check(input); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input[name="name"], input[name="phone"], input[name="email"]')];
    const okFields = fields.map(check).every(Boolean);
    const consent = form.querySelector('input[name="ok"]');
    consent.closest('.consent').classList.toggle('is-err', !consent.checked);
    if (!okFields || !consent.checked) {
      (fields.find((f) => f.getAttribute('aria-invalid') === 'true') || consent).focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    setTimeout(() => {
      form.querySelector('.form-ok').hidden = false;
      btn.disabled = false;
      form.reset();
    }, 600);
  });
})();
