/* 登場するキャラクターの一覧（全ゲーム共通）
   img が無い（まだ生成していない）ときは emoji で代用する
   color: いろクイズ用（null は色が曖昧なので出題しない） */
window.CATALOG = {
  animals: {
    key: 'animals', label: 'どうぶつ', emoji: '🐶', dir: 'assets/animals',
    items: [
      { id: 'dog',      name: 'いぬ',     emoji: '🐶', sfx: 'dog',      color: 'brown',  counter: 'hiki' },
      { id: 'cat',      name: 'ねこ',     emoji: '🐱', sfx: 'cat',      color: 'orange', counter: 'hiki' },
      { id: 'elephant', name: 'ぞう',     emoji: '🐘', sfx: 'elephant', color: 'gray',   counter: 'tou' },
      { id: 'lion',     name: 'らいおん', emoji: '🦁', sfx: 'lion',     color: 'yellow', counter: 'tou' },
      { id: 'cow',      name: 'うし',     emoji: '🐮', sfx: 'cow',      color: 'white',  counter: 'tou' },
      { id: 'frog',     name: 'かえる',   emoji: '🐸', sfx: 'frog',     color: 'green',  counter: 'hiki' },
      { id: 'rabbit',   name: 'うさぎ',   emoji: '🐰', sfx: 'pop',      color: 'white',  counter: 'wa' },
      { id: 'panda',    name: 'ぱんだ',   emoji: '🐼', sfx: 'pop',      color: null,     counter: 'tou' },
      { id: 'giraffe',  name: 'きりん',   emoji: '🦒', sfx: 'pop',      color: 'yellow', counter: 'tou' },
      { id: 'penguin',  name: 'ぺんぎん', emoji: '🐧', sfx: 'pop',      color: null,     counter: 'wa' },
      { id: 'monkey',   name: 'さる',     emoji: '🐵', sfx: 'monkey',   color: 'brown',  counter: 'hiki' },
      { id: 'pig',      name: 'ぶた',     emoji: '🐷', sfx: 'pig',      color: 'pink',   counter: 'tou' },
    ],
  },
  vehicles: {
    key: 'vehicles', label: 'のりもの', emoji: '🚃', dir: 'assets/vehicles',
    items: [
      { id: 'train',     name: 'でんしゃ',       emoji: '🚃', sfx: 'train',     color: 'green',  counter: 'dai' },
      { id: 'car',       name: 'くるま',         emoji: '🚗', sfx: 'car',       color: 'red',    counter: 'dai' },
      { id: 'bus',       name: 'バス',           emoji: '🚌', sfx: 'bus',       color: 'yellow', counter: 'dai' },
      { id: 'firetruck', name: 'しょうぼうしゃ', emoji: '🚒', sfx: 'firetruck', color: 'red',    counter: 'dai' },
      { id: 'police',    name: 'パトカー',       emoji: '🚓', sfx: 'police',    color: null,     counter: 'dai' },
      { id: 'plane',     name: 'ひこうき',       emoji: '✈️', sfx: 'plane',     color: 'blue',   counter: 'ki' },
    ],
  },
  foods: {
    key: 'foods', label: 'たべもの', emoji: '🍙', dir: 'assets/foods',
    items: [
      { id: 'apple',      name: 'りんご',   emoji: '🍎', sfx: 'munch', color: 'red',    counter: 'ko' },
      { id: 'banana',     name: 'バナナ',   emoji: '🍌', sfx: 'munch', color: 'yellow', counter: 'hon' },
      { id: 'onigiri',    name: 'おにぎり', emoji: '🍙', sfx: 'munch', color: 'white',  counter: 'ko' },
      { id: 'bread',      name: 'パン',     emoji: '🍞', sfx: 'munch', color: null,     counter: 'ko' },
      { id: 'strawberry', name: 'いちご',   emoji: '🍓', sfx: 'munch', color: 'red',    counter: 'ko' },
      { id: 'cake',       name: 'ケーキ',   emoji: '🍰', sfx: 'munch', color: null,     counter: 'ko' },
    ],
  },
};

/* 助数詞（1〜6 の読み と 「なん〜」） */
window.COUNTERS = {
  hiki: { q: 'なんびき', n: ['', 'いっぴき', 'にひき', 'さんびき', 'よんひき', 'ごひき', 'ろっぴき'] },
  tou:  { q: 'なんとう', n: ['', 'いっとう', 'にとう', 'さんとう', 'よんとう', 'ごとう', 'ろくとう'] },
  dai:  { q: 'なんだい', n: ['', 'いちだい', 'にだい', 'さんだい', 'よんだい', 'ごだい', 'ろくだい'] },
  ki:   { q: 'なんき',   n: ['', 'いっき', 'にき', 'さんき', 'よんき', 'ごき', 'ろっき'] },
  ko:   { q: 'なんこ',   n: ['', 'いっこ', 'にこ', 'さんこ', 'よんこ', 'ごこ', 'ろっこ'] },
  hon:  { q: 'なんぼん', n: ['', 'いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん'] },
  wa:   { q: 'なんわ',   n: ['', 'いちわ', 'にわ', 'さんわ', 'よんわ', 'ごわ', 'ろくわ'] },
};
window.countWord = (item, n) => COUNTERS[item.counter].n[n];

window.COLORS = {
  red:    { name: 'あか',     css: '#ff4d4d' },
  yellow: { name: 'きいろ',   css: '#ffd93d' },
  green:  { name: 'みどり',   css: '#5ad36b' },
  blue:   { name: 'あお',     css: '#4da3ff' },
  orange: { name: 'オレンジ', css: '#ff9f43' },
  brown:  { name: 'ちゃいろ', css: '#a0703c' },
  gray:   { name: 'はいいろ', css: '#9aa0a6' },
  white:  { name: 'しろ',     css: '#ffffff' },
  pink:   { name: 'ピンク',   css: '#f8a5c2' },
};

/* 全セットの全アイテムを {set, item} の配列で返す */
window.allItems = function () {
  const out = [];
  for (const set of Object.values(CATALOG)) for (const item of set.items) out.push({ set, item });
  return out;
};

/* キャラの絵を作る。画像が読めなければ絵文字に切り替える */
window.makeFace = function (set, item, cls = 'face') {
  const wrap = document.createElement('span');
  wrap.className = cls;
  const img = document.createElement('img');
  img.src = `${set.dir}/${item.id}.png`;
  img.alt = item.name;
  img.draggable = false;
  img.onerror = () => { wrap.textContent = item.emoji; wrap.classList.add('emoji'); };
  wrap.appendChild(img);
  return wrap;
};
