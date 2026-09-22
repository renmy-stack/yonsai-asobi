/* ゲームの一覧（メニューと親向けページで共通）
   cat: メニューのタブ（kazu=かず, atama=あたま, kotoba=ことば, ugoki=うごき, tsukuru=つくる） */
window.CATEGORIES = [
  { id: 'kazu',    icon: '🔢', name: 'かず' },
  { id: 'atama',   icon: '🧠', name: 'あたま' },
  { id: 'kotoba',  icon: 'あ', name: 'ことば' },
  { id: 'ugoki',   icon: '🏃', name: 'うごき' },
  { id: 'tsukuru', icon: '🎨', name: 'つくる' },
];
window.GAMES = [
  // かず
  { id: 'count',    icon: '🔢', name: 'かぞえよう',     cat: 'kazu' },
  { id: 'add',      icon: '➕', name: 'たしざん',       cat: 'kazu' },
  { id: 'number',   icon: '7️⃣', name: 'すうじあて',     cat: 'kazu' },
  { id: 'compare',  icon: '⚖️', name: 'くらべよう',     cat: 'kazu' },
  { id: 'sort',     icon: '📶', name: 'ならべかえ',     cat: 'kazu' },
  { id: 'clock',    icon: '🕒', name: 'とけい',         cat: 'kazu' },
  // あたま
  { id: 'quiz',     icon: '🔍', name: 'どこかな？',     cat: 'atama' },
  { id: 'color',    icon: '🎨', name: 'いろあて',       cat: 'atama' },
  { id: 'shape',    icon: '🔷', name: 'かたち',         cat: 'atama' },
  { id: 'oddone',   icon: '🧐', name: 'なかまはずれ',   cat: 'atama' },
  { id: 'pattern',  icon: '🔁', name: 'つぎはどれ？',   cat: 'atama' },
  { id: 'gone',     icon: '🫥', name: 'なくなったの',   cat: 'atama' },
  { id: 'sound',    icon: '🔊', name: 'おとあて',       cat: 'atama' },
  { id: 'hide',     icon: '🌳', name: 'かくれんぼ',     cat: 'atama' },
  { id: 'shadow',   icon: '🌙', name: 'かげあて',       cat: 'atama' },
  { id: 'diff',     icon: '👓', name: 'まちがいさがし', cat: 'atama' },
  { id: 'memory',   icon: '🃏', name: 'おなじカード',   cat: 'atama' },
  { id: 'sequence', icon: '👀', name: 'じゅんばん',     cat: 'atama' },
  // ことば
  { id: 'hiragana', icon: 'あ', name: 'ひらがな',       cat: 'kotoba' },
  { id: 'trace',    icon: '✍️', name: 'なぞりがき',     cat: 'kotoba' },
  { id: 'shiritori',icon: '🔗', name: 'しりとり',       cat: 'kotoba' },
  { id: 'opposite', icon: '↔️', name: 'はんたいことば', cat: 'kotoba' },
  { id: 'spell',    icon: '🧩', name: 'ことばづくり',   cat: 'kotoba' },
  // うごき
  { id: 'mole',     icon: '🐹', name: 'もぐらたたき',   cat: 'ugoki' },
  { id: 'balloon',  icon: '🎈', name: 'ふうせんわり',   cat: 'ugoki' },
  { id: 'catch',    icon: '🧺', name: 'くだものキャッチ', cat: 'ugoki' },
  { id: 'signal',   icon: '🚦', name: 'しんごう',       cat: 'ugoki' },
  { id: 'maze',     icon: '🌀', name: 'めいろ',         cat: 'ugoki' },
  { id: 'sugoroku', icon: '🎲', name: 'すごろく',       cat: 'ugoki' },
  { id: 'janken',   icon: '✊', name: 'じゃんけん',     cat: 'ugoki' },
  // つくる
  { id: 'coloring', icon: '🖍️', name: 'ぬりえ',         cat: 'tsukuru' },
  { id: 'draw',     icon: '✏️', name: 'おえかき',       cat: 'tsukuru' },
  { id: 'piano',    icon: '🎹', name: 'ピアノ',         cat: 'tsukuru' },
  { id: 'puzzle',   icon: '🧩', name: 'パズル',         cat: 'tsukuru' },
  { id: 'tangram',  icon: '🔺', name: 'かたちはめ',     cat: 'tsukuru' },
  { id: 'tidy',     icon: '📦', name: 'かたづけ',       cat: 'tsukuru' },
  { id: 'road',     icon: '🛣️', name: 'みちつなぎ',     cat: 'tsukuru' },
];
