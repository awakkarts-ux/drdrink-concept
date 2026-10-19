// Линейка Dr. Drink — один источник данных для главной и страницы товара.
// Масса — с лицевой стороны пачки, цвет — пипетка, pat — узор с пачки (есть у Fruit, Whiskey, Rum, Vodka).
// back — данные с оборота пачки (pac_all готово 2.ai, 16.10): есть только у Rum, Vodka, T3, обороты одинаковые.
// Срок брожения не выводим: на обороте текст «5–6 дней», а таблица — «3 дня» при 6 кг (вопрос клиенту).
const DR_BACK = {
  sugar: '6–7 кг', water: '21 л', abv: '15–17%', temp: '22–25 °C',
  modes: [['6 кг', '15%'], ['7 кг', '17%']],
  steps: [
    ['21 л воды', 'тёплой, 25 °C — налейте в ёмкость для брожения'],
    ['6 кг сахара', 'добавьте и размешайте до полного растворения'],
    ['Пакет дрожжей', 'высыпьте и хорошо перемешайте'],
    ['22–25 °C', 'держите рекомендуемую температуру брожения'],
  ],
  comp: 'Спиртовые дрожжи, витамины, микроэлементы, питательные вещества.',
};
window.DR_PRODUCTS = [
  { slug: 'fruit',   name: 'Fruit',    kind: 'Для фруктовой браги',       mass: '60 г',  color: '#730c44', light: false, pat: 'fruit' },
  { slug: 'whiskey', name: 'Whiskey',  kind: 'Для зернового дистиллята',  mass: '73 г',  color: '#2a1d14', light: false, pat: 'whiskey' },
  { slug: 'rum',     name: 'Rum',      kind: 'Для ромовой браги',         mass: '73 г',  color: '#282830', light: false, pat: 'rum', back: DR_BACK },
  { slug: 'vodka',   name: 'Vodka',    kind: 'Для чистого спирта',        mass: '66 г',  color: '#52d2f2', light: true,  pat: 'vodka', back: DR_BACK },
  { slug: 't3',      name: 'T3',       kind: 'Сахарная брага',            mass: '120 г', color: '#5fa297', light: true,  back: DR_BACK },
  { slug: 't24',     name: 'T24',      kind: 'Сахарная брага',            mass: '175 г', color: '#e5ad3b', light: true },
  { slug: 't48',     name: 'T48',      kind: 'Сахарная брага',            mass: '135 г', color: '#cd5e50', light: true },
  { slug: 'carbon',  name: 'Carbon',   kind: 'Турбо-дрожжи Carbon',       mass: '106 г', color: '#1b6779', light: false },
  { slug: 'bigpack', name: 'Big Pack', kind: 'На 100 литров браги',       mass: '360 г', color: '#2d2f79', light: false },
];
// размеры вырезок (для width/height у <img>)
window.DR_DIM = {"fruit":[680,900],"whiskey":[677,900],"rum":[609,770],"vodka":[620,822],"t3":[551,784],"t24":[678,900],"t48":[678,900],"carbon":[676,900],"bigpack":[678,900]};
