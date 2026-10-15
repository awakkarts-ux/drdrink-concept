// Линейка Dr. Drink — один источник данных для главной и страницы товара.
// Известно: название, масса (лицевая сторона пачки), цвет пачки (пипетка). Остальное — null = «уточняем».
window.DR_PRODUCTS = [
  { slug: 'fruit',   name: 'Fruit',    kind: 'Для фруктовой браги',                     mass: '60 г',  color: '#760d42', light: false, volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 'whiskey', name: 'Whiskey',  kind: 'Для зернового дистиллята',                mass: '73 г',  color: '#5b3f2e', light: false, volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 'rum',     name: 'Rum',      kind: 'Для мелассы и тростникового сахара',      mass: '73 г',  color: '#2a2723', light: false, volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 'vodka',   name: 'Vodka',    kind: 'Для чистого спирта',                      mass: '66 г',  color: '#85c5f0', light: true,  volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 't3',      name: 'T3',       kind: 'Сахарная брага',                          mass: '120 г', color: '#5fa297', light: true,  volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 't24',     name: 'T24',      kind: 'Сахарная брага',                          mass: '175 г', color: '#e5ad3b', light: true,  volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 't48',     name: 'T48',      kind: 'Сахарная брага',                          mass: '135 г', color: '#cd5e50', light: false, volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 'carbon',  name: 'Carbon',   kind: 'С активированным углём',                  mass: '106 г', color: '#1b6779', light: false, volume: null, sugar: null, days: null, abv: null, temp: null },
  { slug: 'bigpack', name: 'Big Pack', kind: 'На 100 литров браги',                     mass: '360 г', color: '#2d2f79', light: false, volume: '100 л', sugar: null, days: null, abv: null, temp: null },
];
