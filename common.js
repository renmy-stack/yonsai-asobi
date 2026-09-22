/* すべてのシーン共通: 音・声・粒・長押し・戻るボタン・iOS対策 */
window.Baby = (() => {
  'use strict';

  // ---------- 音（Web Audio で合成） ----------
  let audio = null;
  function ensureAudio() {
    if (!audio) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audio = new Ctx();
    }
    if (audio.state !== 'running') audio.resume();     // suspended / interrupted（電話・Siri の後）どちらも復帰
    return audio;
  }
  // アプリに戻ってきたら音を復帰し、画面が消えないようにする
  let wakeLock = null;
  async function keepAwake() {
    try { if (navigator.wakeLock && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (_) {}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { if (audio) ensureAudio(); keepAwake(); }
  });
  document.addEventListener('pointerdown', () => keepAwake(), { once: true });

  // 1音を鳴らす。f0→f1 に周波数が滑らかに変わる
  function tone({ type = 'sine', f0, f1 = f0, dur = 0.3, gain = 0.25, at = 0, lowpass = 0 }) {
    const ctx = ensureAudio();
    const t0 = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t0);
    osc.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node = osc;
    if (lowpass) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = lowpass;
      osc.connect(lp);
      node = lp;
    }
    node.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // ノイズ（汽車の蒸気、拍手など）
  function noise({ dur = 0.2, gain = 0.15, at = 0, lowpass = 3000 }) {
    const ctx = ensureAudio();
    const t0 = ctx.currentTime + at;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = lowpass;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(lp).connect(g).connect(ctx.destination);
    src.start(t0);
  }

  const SFX = {
    // どうぶつ
    dog() {
      tone({ type: 'square', f0: 520, f1: 300, dur: 0.12, gain: 0.18, lowpass: 1200 });
      tone({ type: 'square', f0: 520, f1: 300, dur: 0.12, gain: 0.18, lowpass: 1200, at: 0.18 });
    },
    cat() {
      tone({ type: 'sine', f0: 650, f1: 1100, dur: 0.25, gain: 0.22 });
      tone({ type: 'sine', f0: 1100, f1: 500, dur: 0.35, gain: 0.22, at: 0.25 });
    },
    elephant() {
      tone({ type: 'sawtooth', f0: 150, f1: 420, dur: 0.35, gain: 0.25, lowpass: 900 });
      tone({ type: 'sawtooth', f0: 420, f1: 180, dur: 0.45, gain: 0.25, lowpass: 900, at: 0.35 });
    },
    lion() {
      tone({ type: 'sawtooth', f0: 110, f1: 70, dur: 0.9, gain: 0.3, lowpass: 500 });
      tone({ type: 'square', f0: 95, f1: 60, dur: 0.9, gain: 0.12, lowpass: 400 });
    },
    cow() { tone({ type: 'sawtooth', f0: 210, f1: 150, dur: 0.8, gain: 0.25, lowpass: 700 }); },
    frog() {
      tone({ type: 'square', f0: 320, f1: 200, dur: 0.08, gain: 0.18, lowpass: 1500 });
      tone({ type: 'square', f0: 320, f1: 200, dur: 0.08, gain: 0.18, lowpass: 1500, at: 0.13 });
    },
    monkey() {
      [0, 0.15, 0.3].forEach(at => tone({ type: 'square', f0: 700, f1: 1100, dur: 0.12, gain: 0.15, lowpass: 2500, at }));
    },
    pig() { tone({ type: 'sawtooth', f0: 300, f1: 180, dur: 0.25, gain: 0.2, lowpass: 900 }); tone({ type: 'sawtooth', f0: 320, f1: 200, dur: 0.25, gain: 0.2, lowpass: 900, at: 0.3 }); },
    // のりもの
    train() {
      for (let i = 0; i < 6; i++) noise({ dur: 0.12, gain: 0.12, at: i * 0.16, lowpass: 1500 });
      tone({ type: 'triangle', f0: 880, dur: 0.6, gain: 0.15, at: 0.2 });
      tone({ type: 'triangle', f0: 1100, dur: 0.6, gain: 0.12, at: 0.2 });
    },
    car() {
      tone({ type: 'square', f0: 440, dur: 0.18, gain: 0.15, lowpass: 2000 });
      tone({ type: 'square', f0: 440, dur: 0.28, gain: 0.15, lowpass: 2000, at: 0.24 });
    },
    bus() {
      tone({ type: 'sawtooth', f0: 220, dur: 0.5, gain: 0.18, lowpass: 900 });
      tone({ type: 'sawtooth', f0: 277, dur: 0.5, gain: 0.14, lowpass: 900 });
    },
    firetruck() {
      for (let i = 0; i < 3; i++) {
        tone({ type: 'square', f0: 600, f1: 900, dur: 0.3, gain: 0.12, lowpass: 2500, at: i * 0.6 });
        tone({ type: 'square', f0: 900, f1: 600, dur: 0.3, gain: 0.12, lowpass: 2500, at: i * 0.6 + 0.3 });
      }
    },
    police() {
      for (let i = 0; i < 4; i++) {
        tone({ type: 'sawtooth', f0: 700, dur: 0.2, gain: 0.12, lowpass: 2500, at: i * 0.4 });
        tone({ type: 'sawtooth', f0: 1000, dur: 0.2, gain: 0.12, lowpass: 2500, at: i * 0.4 + 0.2 });
      }
    },
    plane() {
      noise({ dur: 1.2, gain: 0.2, lowpass: 800 });
      tone({ type: 'sawtooth', f0: 120, f1: 260, dur: 1.2, gain: 0.12, lowpass: 600 });
    },
    // 共通
    pop() { tone({ type: 'sine', f0: 600, f1: 900, dur: 0.12, gain: 0.2 }); },
    munch() {
      noise({ dur: 0.08, gain: 0.2, lowpass: 1200 });
      noise({ dur: 0.08, gain: 0.2, lowpass: 1200, at: 0.18 });
      noise({ dur: 0.08, gain: 0.2, lowpass: 1200, at: 0.36 });
    },
    flip() { tone({ type: 'triangle', f0: 500, f1: 800, dur: 0.1, gain: 0.15 }); },
    wrong() { tone({ type: 'triangle', f0: 300, f1: 200, dur: 0.35, gain: 0.15 }); },
    correct() {
      [523, 659, 784, 1047].forEach((f, i) => tone({ type: 'triangle', f0: f, dur: 0.25, gain: 0.2, at: i * 0.12 }));
    },
    fanfare() {
      [523, 523, 523, 659, 784, 1047].forEach((f, i) => tone({ type: 'square', f0: f, dur: 0.22, gain: 0.12, lowpass: 3000, at: i * 0.14 }));
      for (let i = 0; i < 10; i++) noise({ dur: 0.06, gain: 0.08, at: 0.9 + i * 0.09, lowpass: 4000 });
    },
    count(n) { tone({ type: 'triangle', f0: 500 + n * 80, f1: 700 + n * 80, dur: 0.15, gain: 0.2 }); },
  };

  // 正解・不正解の効果音を鳴らすたびに記録する（親向けページで見る）
  const _correct = SFX.correct, _wrong = SFX.wrong;
  SFX.correct = () => { track('correct'); _correct(); };
  SFX.wrong = () => { track('wrong'); _wrong(); };

  // ---------- 声（音声合成。iOS Safari は日本語の声が入っている） ----------
  let jaVoice = null;
  function pickVoice() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    jaVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ja')) || null;
  }
  if (window.speechSynthesis) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  // 音声合成で読む。読み終わったら resolve（終了イベントが来ない環境向けに長さから見積もった保険つき）
  function tts(text, rate, pitch) {
    return new Promise(resolve => {
      if (!window.speechSynthesis) return resolve();
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      if (jaVoice) u.voice = jaVoice;
      u.rate = rate;
      u.pitch = pitch;
      let done = false;
      const fin = () => { if (!done) { done = true; resolve(); } };
      u.onend = fin; u.onerror = fin;
      setTimeout(fin, 800 + text.length * 180);
      speechSynthesis.speak(u);
    });
  }

  // ---------- 録音済みの声（assets/voice/、VOICEVOX で生成） ----------
  // manifest.json: { "セリフ": "ファイル名.mp3" }。無いセリフは音声合成にフォールバック
  let VOICE = null;
  const bufCache = new Map();
  fetch('assets/voice/manifest.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).then(m => { VOICE = m; }).catch(() => {});
  async function loadBuf(file) {
    if (bufCache.has(file)) return bufCache.get(file);
    const p = fetch('assets/voice/' + file).then(r => r.arrayBuffer()).then(ab => ensureAudio().decodeAudioData(ab));
    bufCache.set(file, p);
    return p;
  }
  let sayToken = 0;            // 新しい say() が来たら前のを止める
  let current = null;          // 再生中の AudioBufferSourceNode
  async function playParts(parts, token) {
    const ctx = ensureAudio();
    for (const text of parts) {
      if (token !== sayToken) return;
      const buf = await loadBuf(VOICE[text]);
      if (token !== sayToken) return;
      await new Promise(res => {
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        let done = false;
        const fin = () => { if (!done) { done = true; res(); } };
        src.onended = fin;
        // 音が出せない状態（停止中の AudioContext など）でも止まらないよう、長さから見積もった保険
        setTimeout(fin, buf.duration * 1000 + 400);
        current = src;
        src.start();
      });
      await new Promise(res => setTimeout(res, 60));
    }
  }
  // text: 文字列 か 文字列の配列（配列は順番に続けて再生。録音済みの声を組み合わせるため）
  // 戻り値: 言い終わったら resolve する Promise。次の問題に進むタイミングに使う
  function say(text, { delay = 0, rate = 0.95, pitch = 1.2 } = {}) {
    const parts = Array.isArray(text) ? text : [text];
    const token = ++sayToken;
    return new Promise(resolve => {
      setTimeout(async () => {
        if (token !== sayToken) return resolve();
        hush(false);
        try {
          if (VOICE && parts.every(p => VOICE[p])) await playParts(parts, token);
          else {
            if (VOICE) console.warn('[voice missing]', parts.filter(p => !VOICE[p]));
            await tts(parts.join(' '), rate, pitch);
          }
        } catch (err) {
          console.warn('[voice error]', err);
          await tts(parts.join(' '), rate, pitch);
        }
        resolve();
      }, delay);
    });
  }
  // 言い終わってから ms 後に fn を呼ぶ（声が途中で切れないようにする）
  function sayThen(text, opts, fn, ms = 600) {
    return say(text, opts).then(() => setTimeout(fn, ms));
  }
  function hush(bump = true) {
    if (bump) sayToken++;
    if (window.speechSynthesis) speechSynthesis.cancel();
    if (current) { try { current.stop(); } catch (_) {} current = null; }
  }
  // 次に言いそうなセリフを先に取得・デコードしておく（初回の間を無くす）
  function prime(list) {
    const go = () => { if (!VOICE) return setTimeout(go, 200); list.flat().forEach(t => VOICE[t] && loadBuf(VOICE[t]).catch(() => {})); };
    go();
  }
  // よく使う声を先に読み込んでおく（最初の再生の遅れを減らす）
  function preloadVoice(list) {
    const go = () => { if (!VOICE) return setTimeout(go, 200); list.forEach(t => VOICE[t] && loadBuf(VOICE[t])); };
    go();
  }

  // ---------- 粒の演出 ----------
  const PARTICLES = ['✨', '⭐', '💖', '🌟', '💛'];
  function burst(x, y, n = 8, chars = PARTICLES) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.textContent = chars[Math.floor(Math.random() * chars.length)];
      const ang = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 80;
      p.style.setProperty('--x', `${x - 13}px`);
      p.style.setProperty('--y', `${y - 13}px`);
      p.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(ang) * dist}px`);
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  }
  function celebrate(x = innerWidth / 2, y = innerHeight / 2) {
    for (let i = 0; i < 4; i++) setTimeout(() => burst(x + (Math.random() - 0.5) * 200, y + (Math.random() - 0.5) * 200, 10), i * 150);
  }
  // 画面中央に大きく表示（🎉 など）
  function cheer(text) {
    let el = document.getElementById('cheer');
    if (!el) { el = document.createElement('div'); el.id = 'cheer'; document.body.appendChild(el); }
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    el.addEventListener('animationend', () => el.classList.remove('show'), { once: true });
  }

  // 画像（assets/...）を表示し、無ければ絵文字などの代わりを出す
  function pic(src, fallback, cls = 'pic') {
    const span = document.createElement('span'); span.className = cls;
    const img = document.createElement('img'); img.src = src; img.alt = ''; img.draggable = false;
    img.onerror = () => { span.textContent = fallback; span.classList.add('emoji'); };
    span.appendChild(img);
    return span;
  }

  // アニメーション用クラスを付け直す
  function animate(el, cls, ms = 900) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  // ---------- 長押しボタン（1歳が偶然押しても反応しない） ----------
  function holdButton(btn, onHold, ms = 1500) {
    let timer = null;
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      btn.classList.add('holding');
      timer = setTimeout(() => {
        timer = null;
        btn.classList.remove('holding');
        onHold();
      }, ms);
    });
    const cancel = () => {
      btn.classList.remove('holding');
      if (timer) { clearTimeout(timer); timer = null; }
    };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => btn.addEventListener(ev, cancel));
  }

  // ---------- 起動画面（最初のひとタッチで音を解放） ----------
  function setupStart(onStart) {
    const start = document.getElementById('start');
    if (!start) return;
    // 起動画面の絵は、そのゲームのアイコン（無ければ絵文字のまま）
    const big = start.querySelector('.big');
    if (big) { const im = new Image(); im.src = `assets/icons/${gameId}.png`; im.alt = ''; im.onload = () => { big.textContent = ''; big.appendChild(im); }; }
    start.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      ensureAudio();
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance('');
        u.lang = 'ja-JP';
        speechSynthesis.speak(u);
      }
      start.classList.add('hide');
      _correct();
      burst(e.clientX, e.clientY);
      preloadVoice([...PRAISE, 'ちがうよ。', 'シールを もらった！']);
      if (onStart) onStart();
    });
  }

  // ---------- メニューへ戻る（長押し） ----------
  function setupHome() {
    const btn = document.getElementById('homeBtn');
    if (!btn) return;
    holdButton(btn, () => { hush(); location.href = 'index.html'; });
  }

  // ---------- iOS のおせっかい操作を止める ----------
  document.addEventListener('touchmove', e => { if (!document.body.dataset.scroll) e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('dblclick', e => e.preventDefault());
  document.addEventListener('contextmenu', e => e.preventDefault());

  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 直前と同じ問題を出さない。gen() で候補を作り、sig() が前回と同じなら作り直す（最大12回）
  const lastSig = {};
  function fresh(key, gen, sig = JSON.stringify) {
    let v, s;
    for (let i = 0; i < 12; i++) {
      v = gen(); s = sig(v);
      if (s !== lastSig[key]) break;
    }
    lastSig[key] = s;
    return v;
  }

  // ---------- 保存データ（localStorage。シール・遊んだ記録・設定） ----------
  const KEY = 'asobi-v1';
  function load() {
    try { return Object.assign({ stickers: [], log: {}, settings: { timer: 0, disabled: [] }, timerEnd: 0 }, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (_) { return { stickers: [], log: {}, settings: { timer: 0, disabled: [] }, timerEnd: 0 }; }
  }
  function save(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {} }
  const gameId = location.pathname.split('/').pop().replace('.html', '') || 'index';

  // 遊んだ記録: track('play') はページを開いたとき、'correct' / 'wrong' は回答ごと
  function track(kind) {
    const d = load();
    const g = d.log[gameId] || (d.log[gameId] = { play: 0, correct: 0, wrong: 0, last: 0 });
    g[kind] = (g[kind] || 0) + 1;
    g.last = Date.now();
    save(d);
  }

  // ゲームごとの到達レベル（次に開いたとき続きから）
  function getLevel() { return (load().levels || {})[gameId] || 0; }
  function setLevel(n) { const d = load(); (d.levels = d.levels || {})[gameId] = n; save(d); }

  // 遊んだ時間: 表示中は10秒ごとに加算（ゲームごと・日ごと）
  const today = () => new Date().toISOString().slice(0, 10);
  function addTime(sec) {
    const d = load();
    const g = d.log[gameId] || (d.log[gameId] = { play: 0, correct: 0, wrong: 0, last: 0 });
    g.sec = (g.sec || 0) + sec;
    (d.days = d.days || {})[today()] = ((d.days || {})[today()] || 0) + sec;
    save(d);
  }
  if (!['index', 'parent', 'stickers'].includes(gameId)) {
    setInterval(() => { if (document.visibilityState === 'visible') addTime(10); }, 10000);
  }

  // ほめ言葉（毎回同じにならないように）
  const PRAISE = ['せいかい！', 'すごい！', 'やったね！', 'そのちょうし！', 'じょうずだね！'];
  let lastPraise = '';
  function praise() { let p; do { p = pick(PRAISE); } while (p === lastPraise); lastPraise = p; return p; }

  // シール: 5問正解などのごほうび。ランダムに1枚もらえる
  const STICKERS = [
    ...['dog', 'cat', 'elephant', 'lion', 'cow', 'frog', 'rabbit', 'panda', 'giraffe', 'penguin', 'monkey', 'pig'].map(id => `animals/${id}`),
    ...['train', 'car', 'bus', 'firetruck', 'police', 'plane'].map(id => `vehicles/${id}`),
    ...['apple', 'banana', 'onigiri', 'bread', 'strawberry', 'cake'].map(id => `foods/${id}`),
    'icons/trophy', 'icons/mascot',
  ];
  const RARE = ['icons/trophy', 'icons/mascot'];       // きらきらシール（出にくい）
  function reward() {
    const d = load();
    const id = Math.random() < 0.08 ? pick(RARE) : pick(STICKERS.filter(s => !RARE.includes(s)));
    d.stickers.push({ id, at: Date.now() });
    const complete = new Set(d.stickers.map(s => s.id)).size >= STICKERS.length && !d.completed;
    if (complete) d.completed = Date.now();
    save(d);
    let el = document.getElementById('rewardBox');
    if (!el) {
      el = document.createElement('div');
      el.id = 'rewardBox';
      el.innerHTML = '<div class="card"><div class="ttl">シールを もらった！</div><img alt=""><div class="cnt"></div></div>';
      document.body.appendChild(el);
    }
    const rare = RARE.includes(id);
    el.querySelector('.ttl').textContent = rare ? 'きらきらシール！' : 'シールを もらった！';
    el.querySelector('.card').classList.toggle('rare', rare);
    el.querySelector('img').src = `assets/${id}.png`;
    el.querySelector('.cnt').textContent = `シール ${d.stickers.length} まい`;
    el.classList.add('show');
    SFX.fanfare();
    celebrate();
    return say(rare ? 'きらきらシールを もらった！' : 'シールを もらった！', { delay: 600 })
      .then(() => complete ? say('ぜんぶ あつめた！ すごい！') : null)
      .then(() => new Promise(res => setTimeout(() => { el.classList.remove('show'); res(); }, 700)));
  }
  function stickerCount() { return load().stickers.length; }

  // おしまいタイマー: 親が設定した時間が来たら「おしまい」画面を出す（3秒長押しで閉じる）
  function checkTimer() {
    const d = load();
    if (!d.timerEnd || document.getElementById('timeUp')) return;
    if (Date.now() > d.timerEnd + 30 * 60000) { d.timerEnd = 0; save(d); return; }   // 昨日の分などは静かに解除
    if (Date.now() < d.timerEnd) return;
    const el = document.createElement('div');
    el.id = 'timeUp';
    el.innerHTML = '<div class="big">🌙</div><div>きょうは おしまい！</div><div class="sub">また あそぼうね</div><button class="topbtn" id="timeUpClose" type="button">とじる（ながおし）</button>';
    document.body.appendChild(el);
    hush();
    say('きょうは おしまい！ また あそぼうね', { delay: 300 });
    holdButton(document.getElementById('timeUpClose'), () => {
      const dd = load(); dd.timerEnd = 0; save(dd);
      el.remove();
    }, 3000);
  }
  setInterval(checkTimer, 5000);
  setTimeout(checkTimer, 1000);
  if (gameId !== 'index' && gameId !== 'parent' && gameId !== 'stickers') track('play');

  return { pic, fresh, load, save, track, reward, stickerCount, gameId, getLevel, setLevel, praise, prime, STICKERS, RARE, ensureAudio, tone, noise, SFX, say, sayThen, hush, preloadVoice, burst, celebrate, cheer, animate, holdButton, setupStart, setupHome, shuffle, pick };
})();
