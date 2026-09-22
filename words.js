/* ことば系ゲーム用の単語帳（絵文字で表示。iPhone の絵文字がかわいいのでそのまま使う）
   kana: ひらがな表記（読み上げにも使う）。3つ目は画像 id（assets/words/<id>.png、無ければ絵文字）。「ー」「っ」「ゃゅょ」は最後の文字判定で処理する */
window.WORDS = [
  ['🍎', 'りんご', 'ringo'], ['🍇', 'ぶどう', 'budou'], ['🍊', 'みかん', 'mikan'], ['🍉', 'すいか', 'suika'], ['🍌', 'ばなな', 'banana'], ['🍓', 'いちご', 'ichigo'],
  ['🍑', 'もも', 'momo'], ['🍐', 'なし', 'nashi'], ['🍋', 'れもん', 'remon'], ['🥝', 'きうい', 'kiui'], ['🍅', 'とまと', 'tomato'], ['🥕', 'にんじん', 'ninjin'],
  ['🌽', 'とうもろこし', 'toumorokoshi'], ['🍆', 'なす', 'nasu'], ['🥒', 'きゅうり', 'kyuuri'], ['🍄', 'きのこ', 'kinoko'], ['🍙', 'おにぎり', 'onigiri'], ['🍞', 'ぱん', 'pan'],
  ['🍰', 'けーき', 'keeki'], ['🍬', 'あめ', 'ame'], ['🍩', 'どーなつ', 'doonatsu'], ['🍦', 'あいす', 'aisu'], ['🍜', 'らーめん', 'raamen'], ['🍣', 'すし', 'sushi'],
  ['🥚', 'たまご', 'tamago'], ['🧀', 'ちーず', 'chiizu'], ['🍪', 'くっきー', 'kukkii'], ['🧃', 'じゅーす', 'juusu'],
  ['🐘', 'ぞう', 'zou'], ['🦒', 'きりん', 'kirin'], ['🐢', 'かめ', 'kame'], ['🐟', 'さかな', 'sakana'], ['🐤', 'ひよこ', 'hiyoko'], ['🐧', 'ぺんぎん', 'pengin'],
  ['🦀', 'かに', 'kani'], ['🐙', 'たこ', 'tako'], ['🐰', 'うさぎ', 'usagi'], ['🐴', 'うま', 'uma'], ['🐮', 'うし', 'ushi'], ['🐱', 'ねこ', 'neko'], ['🐶', 'いぬ', 'inu'],
  ['🐭', 'ねずみ', 'nezumi'], ['🦁', 'らいおん', 'raion'], ['🐸', 'かえる', 'kaeru'], ['🐼', 'ぱんだ', 'panda'], ['🐨', 'こあら', 'koara'], ['🦊', 'きつね', 'kitsune'],
  ['🐻', 'くま', 'kuma'], ['🐷', 'ぶた', 'buta'], ['🐔', 'にわとり', 'niwatori'], ['🦆', 'あひる', 'ahiru'], ['🐝', 'はち', 'hachi'], ['🦋', 'ちょうちょ', 'choucho'],
  ['🐞', 'てんとうむし', 'tentoumushi'], ['🐜', 'あり', 'ari'], ['🐌', 'かたつむり', 'katatsumuri'], ['🦍', 'ごりら', 'gorira'], ['🐑', 'ひつじ', 'hitsuji'], ['🐐', 'やぎ', 'yagi'],
  ['🦌', 'しか', 'shika'], ['🐬', 'いるか', 'iruka'], ['🐳', 'くじら', 'kujira'], ['🦈', 'さめ', 'same'], ['🐍', 'へび', 'hebi'], ['🦉', 'ふくろう', 'fukurou'],
  ['🌂', 'かさ', 'kasa'], ['👒', 'ぼうし', 'boushi'], ['🧦', 'くつした', 'kutsushita'], ['👟', 'くつ', 'kutsu'], ['👓', 'めがね', 'megane'], ['🎒', 'らんどせる', 'randoseru'],
  ['🚗', 'くるま', 'kuruma'], ['🚌', 'ばす', 'basu'], ['🚃', 'でんしゃ', 'densha'], ['✈️', 'ひこうき', 'hikouki'], ['🚀', 'ろけっと', 'roketto'], ['⛵', 'ふね', 'fune'],
  ['🚲', 'じてんしゃ', 'jitensha'], ['🚁', 'へりこぷたー', 'herikoputaa'], ['🚒', 'しょうぼうしゃ', 'shoubousha'], ['🚑', 'きゅうきゅうしゃ', 'kyuukyuusha'],
  ['🌸', 'さくら', 'sakura'], ['🌻', 'ひまわり', 'himawari'], ['🌷', 'ちゅーりっぷ', 'chuurippu'], ['🌳', 'き', 'ki'], ['🌙', 'つき', 'tsuki'], ['⭐', 'ほし', 'hoshi'],
  ['☀️', 'たいよう', 'taiyou'], ['☁️', 'くも', 'kumo'], ['🌈', 'にじ', 'niji'], ['⛄', 'ゆきだるま', 'yukidaruma'], ['🔥', 'ひ', 'hi'],
  ['🏠', 'いえ', 'ie'], ['🚪', 'どあ', 'doa'], ['🪑', 'いす', 'isu'], ['🛏️', 'べっど', 'beddo'], ['⏰', 'とけい', 'tokei'], ['📺', 'てれび', 'terebi'],
  ['🎹', 'ぴあの', 'piano'], ['🥁', 'たいこ', 'taiko'], ['🎸', 'ぎたー', 'gitaa'], ['🎈', 'ふうせん', 'fuusen'], ['⚽', 'ぼーる', 'booru'], ['📕', 'ほん', 'hon'],
  ['🎁', 'ぷれぜんと', 'purezento'], ['🔑', 'かぎ', 'kagi'], ['🔔', 'すず', 'suzu'], ['🪥', 'はぶらし', 'haburashi'],
  ['🧼', 'せっけん', 'sekken'], ['🪣', 'ばけつ', 'baketsu'], ['✂️', 'はさみ', 'hasami'], ['✏️', 'えんぴつ', 'enpitsu'], ['🖍️', 'くれよん', 'kureyon'], ['📷', 'かめら', 'kamera'], ['🥄', 'すぷーん', 'supuun'], ['🍴', 'ふぉーく', 'fooku'], ['🥛', 'ぎゅうにゅう', 'gyuunyuu']
];

/* しりとり用: 単語の最後の音（「ー」「っ」「ゃゅょ」を処理し、濁点は外す） */
window.lastKana = function (kana) {
  const SMALL = { 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お' };
  let i = kana.length - 1;
  let ch = kana[i];
  if (ch === 'ー') { i--; ch = kana[i]; }
  if (SMALL[ch]) ch = SMALL[ch];
  return window.baseKana(ch);
};
window.baseKana = function (ch) {
  const DAKU = { 'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ', 'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
    'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と', 'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
    'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ' };
  return DAKU[ch] || ch;
};
window.firstKana = (kana) => window.baseKana(kana[0]);
/* 単語の絵（assets/words/<id>.png があればそれ、無ければ絵文字） */
window.wordPic = function (w, cls = 'wpic') {
  const span = document.createElement('span'); span.className = cls;
  if (w[2]) {
    const img = document.createElement('img'); img.src = `assets/words/${w[2]}.png`; img.alt = w[1]; img.draggable = false;
    img.onerror = () => { span.textContent = w[0]; span.classList.add('emoji'); };
    span.appendChild(img);
  } else { span.textContent = w[0]; span.classList.add('emoji'); }
  return span;
};
