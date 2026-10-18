// Линейка Dr. Drink — один источник данных для главной и страницы товара.
// Масса — с лицевой стороны пачки, цвет — пипетка, pat — узор с пачки (есть только у Fruit, Rum, Vodka).
window.DR_PRODUCTS = [
  { slug: 'fruit',   name: 'Fruit',    kind: 'Для фруктовой браги',       mass: '60 г',  color: '#730c44', light: false, pat: 'fruit' },
  { slug: 'whiskey', name: 'Whiskey',  kind: 'Для зернового дистиллята',  mass: '73 г',  color: '#5b3f2e', light: false },
  { slug: 'rum',     name: 'Rum',      kind: 'Для ромовой браги',         mass: '73 г',  color: '#282830', light: false, pat: 'rum' },
  { slug: 'vodka',   name: 'Vodka',    kind: 'Для чистого спирта',        mass: '66 г',  color: '#52d2f2', light: true,  pat: 'vodka' },
  { slug: 't3',      name: 'T3',       kind: 'Сахарная брага',            mass: '120 г', color: '#5fa297', light: true },
  { slug: 't24',     name: 'T24',      kind: 'Сахарная брага',            mass: '175 г', color: '#e5ad3b', light: true },
  { slug: 't48',     name: 'T48',      kind: 'Сахарная брага',            mass: '135 г', color: '#cd5e50', light: false },
  { slug: 'carbon',  name: 'Carbon',   kind: 'Турбо-дрожжи Carbon',       mass: '106 г', color: '#1b6779', light: false },
  { slug: 'bigpack', name: 'Big Pack', kind: 'На 100 литров браги',       mass: '360 г', color: '#2d2f79', light: false },
];
