// つみき — 物理（かいて！つみあげタワー の sim.js をそのまま流用。DOM に依存しない）
// 描いた線は「太さ 10 の固い物」。線に沿って並べた点 と 線分（カプセル）でできた剛体。
// 当たりは 自分の点 × 相手の線分（両方向）。はしわたしの当たりを「動く物どうし」に広げたもの
(function (root) {
'use strict';

// ---------- 決定的な数学 ----------
// 友達の端末でも同じ積み上がりになるよう、物理では Math.sin/cos/hypot を使わない（+ - * / sqrt だけ）
const SIM_VERSION = 1;    // 物理の数値を変えたら上げる（古い記録・URL は捨てる）
const PI = Math.PI, TWO_PI = PI * 2, HALF_PI = PI / 2;
function wrapAngle(x) { if (x > PI || x < -PI) x -= TWO_PI * Math.floor((x + PI) / TWO_PI); return x; }
function dsin(x) {
  x = wrapAngle(x);
  if (x > HALF_PI) x = PI - x; else if (x < -HALF_PI) x = -PI - x;
  const x2 = x * x;
  return x * (1 + x2 * (-1 / 6 + x2 * (1 / 120 + x2 * (-1 / 5040 + x2 * (1 / 362880 + x2 * (-1 / 39916800 + x2 * (1 / 6227020800 + x2 * (-1 / 1307674368000 + x2 * (1 / 355687428096000)))))))));
}
function dcos(x) { return dsin(x + HALF_PI); }
function len2(x, y) { return Math.sqrt(x * x + y * y); }

// ---------- 定数 ----------
const W = 600;              // 世界の幅（x 0〜600）。y は 台の上面が 0、上が負
const PLAT_X0 = 180, PLAT_X1 = 420;   // 台（幅 240）
const N_PIECES = 10;        // 落とす数
const INK = 280;            // 1 こ の線の長さの上限
const DROP_GAP = 40;        // タワーのてっぺんから 落とす線 までの間
const DT = 1 / 240;         // 物理ステップ
const G = 1400;             // 重力
const LT = 5;               // 線の半径（見た目の太さ 10）
const M_PT = 1;             // 点 1 つの質量（重さは線の長さに比例）
const E = 0.02;             // 反発係数（ほぼ跳ねない）
const MU = 0.9;             // 摩擦係数
const SAMPLE = 6;           // 点の間隔
const SLEEP_T = 0.4;        // これだけの間 SLEEP_D / SLEEP_A より動かなければ眠る（止める）
const SLEEP_D = 1.2, SLEEP_A = 0.015;
const WAKE_V = 40;          // 眠っている物に これより速くぶつかったら起こす
const MOVE_D = 3, MOVE_A = 0.03;   // 起きた物が これだけ動いたら、触れている物も起こす（支えがなくなるので）
const SETTLE_MAX = 6;       // 落としてから これだけたっても止まらなければ 強制的に止める
const FALL_Y = 420;         // 台の上面より これだけ下に落ちたら「おちた」
const MIN_LEN = 20;         // これより短い線は 物にしない
let ITER = 12;              // 当たりを解く反復の回数（向きを交互にして 順番のかたよりを消す）
const SLOP = 0.6, BETA = 0.25, BIAS_MAX = 120;   // めり込みの許容・押し返しの強さ・押し返す速さの上限

// ---------- 線 ----------
function strokeLength(pts) { let l = 0; for (let i = 1; i < pts.length; i++) l += len2(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); return l; }
// 線分ごとに等間隔で点を打つ（左右対称な形は点も対称になるように）。閉じた線は最後の点を重ねない
function samplePolyline(pts, spacing) {
  const out = [];
  const closed = pts.length > 2 && len2(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y) < 1;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], d = len2(b.x - a.x, b.y - a.y);
    if (d === 0) continue;
    const n = Math.max(1, Math.ceil(d / spacing));
    for (let k = 0; k < n; k++) out.push({ x: a.x + (b.x - a.x) * k / n, y: a.y + (b.y - a.y) * k / n });
  }
  if (!closed) out.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });
  if (!out.length) out.push({ x: pts[0].x, y: pts[0].y });
  return out;
}
// 点を減らす（Douglas-Peucker）。指の線は細かすぎるので、線分を減らして当たりを軽くする
function simplify(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Array(pts.length).fill(false); keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i0, i1] = stack.pop(), a = pts[i0], b = pts[i1], dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy;
    let best = -1, bd = tol;
    for (let i = i0 + 1; i < i1; i++) {
      const p = pts[i];
      let d;
      if (l2 === 0) d = len2(p.x - a.x, p.y - a.y);
      else { let u = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2; u = Math.max(0, Math.min(1, u)); d = len2(p.x - (a.x + dx * u), p.y - (a.y + dy * u)); }
      if (d > bd) { bd = d; best = i; }
    }
    if (best >= 0) { keep[best] = true; stack.push([i0, best], [best, i1]); }
  }
  return pts.filter((p, i) => keep[i]);
}
// 描いた線をゲームで使う形にする: 点を減らし、整数に丸め（URL に入れる形と同じ）、長さが limit を超えたら切る
function normalizeStroke(raw, limit) {
  const pts = [];
  let used = 0;
  for (const p of simplify(raw, 1.2)) {
    const q = { x: Math.max(-300, Math.min(W + 300, Math.round(p.x))), y: Math.max(-2900, Math.min(600, Math.round(p.y))) };
    if (pts.length) {
      const o = pts[pts.length - 1], d = len2(q.x - o.x, q.y - o.y);
      if (d < 1) continue;
      if (limit != null && used + d > limit) {
        const t = (limit - used) / d;
        if (t > 0.2) pts.push({ x: Math.round(o.x + (q.x - o.x) * t), y: Math.round(o.y + (q.y - o.y) * t) });
        break;
      }
      used += d;
    }
    pts.push(q);
  }
  return pts.length >= 2 && strokeLength(pts) >= MIN_LEN ? pts : null;
}

// ---------- 物 ----------
let nextId = 1;
function makeBody(stroke, isStatic) {
  const pts = samplePolyline(stroke, SAMPLE), n = pts.length;
  let cx = 0, cy = 0;
  for (const p of pts) { cx += p.x; cy += p.y; }
  cx /= n; cy /= n;
  const lp = pts.map(p => ({ x: p.x - cx, y: p.y - cy }));
  const ls = [];
  for (let i = 1; i < stroke.length; i++) ls.push({ ax: stroke[i - 1].x - cx, ay: stroke[i - 1].y - cy, bx: stroke[i].x - cx, by: stroke[i].y - cy });
  let I = n * M_PT * LT * LT / 2;
  for (const p of lp) I += M_PT * (p.x * p.x + p.y * p.y);
  const m = n * M_PT;
  const b = { id: nextId++, pts: lp, segs: ls, stroke, m, invM: isStatic ? 0 : 1 / m, I, invI: isStatic ? 0 : 1 / I,
    x: cx, y: cy, vx: 0, vy: 0, th: 0, om: 0, co: 1, si: 0, sleep: isStatic, static: isStatic, stillT: 0,
    ax: cx, ay: cy, ath: 0, wx: cx, wy: cy, wth: 0, moved: false, wsegs: [], minY: 0, bb: { x0: 0, y0: 0, x1: 0, y1: 0 }, fell: false, age: 0 };
  updateShape(b);
  return b;
}
function updateShape(b) {
  const co = dcos(b.th), si = dsin(b.th);
  b.co = co; b.si = si;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of b.pts) {
    const wx = b.x + p.x * co - p.y * si, wy = b.y + p.x * si + p.y * co;
    if (wx < x0) x0 = wx; if (wx > x1) x1 = wx; if (wy < y0) y0 = wy; if (wy > y1) y1 = wy;
  }
  b.minY = y0;
  const pad = 2 * LT + 4;
  b.bb.x0 = x0 - pad; b.bb.y0 = y0 - pad; b.bb.x1 = x1 + pad; b.bb.y1 = y1 + pad;
  const ws = b.wsegs; ws.length = 0;
  for (const s of b.segs) {
    const ax = b.x + s.ax * co - s.ay * si, ay = b.y + s.ax * si + s.ay * co, bx = b.x + s.bx * co - s.by * si, by = b.y + s.bx * si + s.by * co;
    ws.push({ ax, ay, bx, by, minx: Math.min(ax, bx) - 2 * LT, maxx: Math.max(ax, bx) + 2 * LT, miny: Math.min(ay, by) - 2 * LT, maxy: Math.max(ay, by) + 2 * LT });
  }
}
function wake(world, b) {
  if (!b.sleep || b.static) return;
  b.sleep = false; b.stillT = 0; b.ax = b.x; b.ay = b.y; b.ath = b.th; b.wx = b.x; b.wy = b.y; b.wth = b.th; b.moved = false;
}
function overlap(a, b) { return !(a.x1 < b.x0 || a.x0 > b.x1 || a.y1 < b.y0 || a.y0 > b.y1); }
function wakeNeighbors(world, b) {
  for (const c of world.bodies) if (c !== b && c.sleep && !c.static && overlap(b.bb, c.bb)) wake(world, c);
}
// P の点 (px, py) と Q の線分 s の当たりを 1 つ集める（解くのは solveContacts）。
// 当たりは常に「A = 先の物・B = 後の物、法線は B から A へ」の向きにそろえる（あとで まとめるため）
function collect(world, P, px, py, Q, s, first) {
  const dx = s.bx - s.ax, dy = s.by - s.ay, l2 = dx * dx + dy * dy;
  let u = l2 > 0 ? ((px - s.ax) * dx + (py - s.ay) * dy) / l2 : 0;
  u = u < 0 ? 0 : u > 1 ? 1 : u;
  const qx = s.ax + dx * u, qy = s.ay + dy * u, ex = px - qx, ey = py - qy, d = len2(ex, ey);
  const pen = 2 * LT - d;
  if (pen <= 0) return;
  let nx, ny;
  if (d < 1e-6) { nx = 0; ny = -1; } else { nx = ex / d; ny = ey / d; }
  const rpx = px - P.x, rpy = py - P.y, rqx = qx - Q.x, rqy = qy - Q.y;
  const rvx = (P.vx - P.om * rpy) - (Q.vx - Q.om * rqy), rvy = (P.vy + P.om * rpx) - (Q.vy + Q.om * rqx);
  const vn = rvx * nx + rvy * ny;
  if (vn < -WAKE_V) { wake(world, P); wake(world, Q); }
  const c = P === first
    ? { A: P, B: Q, nx, ny, rax: rpx, ray: rpy, rbx: rqx, rby: rqy }
    : { A: Q, B: P, nx: -nx, ny: -ny, rax: rqx, ray: rqy, rbx: rpx, rby: rpy };
  c.tx = -c.ny; c.ty = c.nx; c.px = (px + qx) / 2; c.py = (py + qy) / 2; c.pen = pen; c.pn = 0; c.pt = 0; c.kn = 0; c.kt = 0; c.bias = 0;
  world.contacts.push(c);
}
function pairCollect(world, P, Q, first) {
  const co = P.co, si = P.si;
  for (const p of P.pts) {
    const px = P.x + p.x * co - p.y * si, py = P.y + p.x * si + p.y * co;
    for (const s of Q.wsegs) {
      if (px < s.minx || px > s.maxx || py < s.miny || py > s.maxy) continue;
      collect(world, P, px, py, Q, s, first);
    }
  }
}
// 1 組の物の当たりを減らす: 同じ向きの当たりは 両はしと いちばん深いもの だけ残す
// （平らな面どうしの当たりが 10 点もあると、順番に解いたときの偏りで着地が回ってしまう）
function reducePair(world, from) {
  const cs = world.contacts, n = cs.length - from;
  if (n <= 2) return;
  const groups = [];
  for (let i = from; i < cs.length; i++) {
    const c = cs[i];
    let g = null;
    for (const h of groups) if (h[0].nx * c.nx + h[0].ny * c.ny > 0.94) { g = h; break; }
    if (g) g.push(c); else groups.push([c]);
  }
  const keep = [];
  for (const g of groups) {
    if (g.length <= 2) { for (const c of g) keep.push(c); continue; }
    const tx = g[0].tx, ty = g[0].ty;
    let lo = g[0], hi = g[0], deep = g[0], slo = Infinity, shi = -Infinity;
    for (const c of g) {
      const sc = c.px * tx + c.py * ty;
      if (sc < slo) { slo = sc; lo = c; }
      if (sc > shi) { shi = sc; hi = c; }
      if (c.pen > deep.pen) deep = c;
    }
    keep.push(lo); if (hi !== lo) keep.push(hi); if (deep !== lo && deep !== hi) keep.push(deep);
  }
  cs.length = from;
  for (const c of keep) cs.push(c);
}
// 集めた当たりを 反復で解く（力積を積み上げて 0 以上に保つ。めり込みは速度の下駄（bias）で押し返す）
function solveContacts(world, dt) {
  const cs = world.contacts;
  for (const c of cs) {
    const A = c.A, B = c.B;
    const imA = A.sleep ? 0 : A.invM, iiA = A.sleep ? 0 : A.invI, imB = B.sleep ? 0 : B.invM, iiB = B.sleep ? 0 : B.invI;
    const ran = c.rax * c.ny - c.ray * c.nx, rbn = c.rbx * c.ny - c.rby * c.nx;
    const rat = c.rax * c.ty - c.ray * c.tx, rbt = c.rbx * c.ty - c.rby * c.tx;
    c.kn = imA + imB + ran * ran * iiA + rbn * rbn * iiB;
    c.kt = imA + imB + rat * rat * iiA + rbt * rbt * iiB;
    c.ran = ran; c.rbn = rbn; c.rat = rat; c.rbt = rbt; c.imA = imA; c.iiA = iiA; c.imB = imB; c.iiB = iiB;
    const p = c.pen - SLOP;
    c.bias = p > 0 ? BETA * p / dt : 0;
    if (c.bias > BIAS_MAX) c.bias = BIAS_MAX;
  }
  const n = cs.length;
  for (let it = 0; it < ITER; it++) {
    for (let k = 0; k < n; k++) {
      const c = it & 1 ? cs[n - 1 - k] : cs[k];
      if (c.kn === 0) continue;
      const A = c.A, B = c.B;
      let rvx = (A.vx - A.om * c.ray) - (B.vx - B.om * c.rby), rvy = (A.vy + A.om * c.rax) - (B.vy + B.om * c.rbx);
      const vn = rvx * c.nx + rvy * c.ny;
      let j = (-vn + c.bias) / c.kn;
      const pn0 = c.pn; c.pn = pn0 + j; if (c.pn < 0) c.pn = 0; j = c.pn - pn0;
      A.vx += j * c.nx * c.imA; A.vy += j * c.ny * c.imA; A.om += c.ran * j * c.iiA;
      B.vx -= j * c.nx * c.imB; B.vy -= j * c.ny * c.imB; B.om -= c.rbn * j * c.iiB;
      rvx = (A.vx - A.om * c.ray) - (B.vx - B.om * c.rby); rvy = (A.vy + A.om * c.rax) - (B.vy + B.om * c.rbx);
      const vt = rvx * c.tx + rvy * c.ty;
      let jt = -vt / c.kt;
      const lim = MU * c.pn, pt0 = c.pt; c.pt = pt0 + jt; if (c.pt < -lim) c.pt = -lim; else if (c.pt > lim) c.pt = lim; jt = c.pt - pt0;
      A.vx += jt * c.tx * c.imA; A.vy += jt * c.ty * c.imA; A.om += c.rat * jt * c.iiA;
      B.vx -= jt * c.tx * c.imB; B.vy -= jt * c.ty * c.imB; B.om -= c.rbt * jt * c.iiB;
    }
  }
}

// ---------- 世界 ----------
function createWorld() {
  const plat = makeBody([{ x: PLAT_X0, y: LT }, { x: PLAT_X1, y: LT }], true);   // 台の上面が y = 0
  const world = { bodies: [plat], t: 0, dropT: 0, pieces: 0, fell: 0, lastFell: null, strokes: [], contacts: [] };
  return world;
}
// 止まっている物の いちばん高いところ（台の上面から。線の太さ込み）
function towerHeight(world, includeAwake) {
  let h = 0;
  for (const b of world.bodies) if (!b.static && (includeAwake || b.sleep)) { const t = LT - b.minY; if (t > h) h = t; }
  return h;
}
function dropLineY(world) { return -towerHeight(world) - DROP_GAP; }
// 線を 落とす線より上に置く（下にはみ出していたら持ち上げる）
function placeStroke(world, stroke) {
  const line = dropLineY(world);
  let maxY = -Infinity; for (const p of stroke) if (p.y > maxY) maxY = p.y;
  const dy = maxY > line - LT ? Math.round(line - LT - maxY) : 0;
  return dy ? stroke.map(p => ({ x: p.x, y: p.y + dy })) : stroke;
}
function addPiece(world, stroke) {
  const b = makeBody(stroke, false);
  world.bodies.push(b); world.pieces++; world.dropT = 0; world.strokes.push(stroke);
  return b;
}
function settled(world) { for (const b of world.bodies) if (!b.sleep) return false; return true; }
function forceSleep(world) { for (const b of world.bodies) if (!b.sleep) { b.sleep = true; b.vx = 0; b.vy = 0; b.om = 0; } }
function step(world, dt) {
  world.t += dt; world.dropT += dt;
  const bs = world.bodies;
  for (const b of bs) {
    if (b.sleep) continue;
    b.age += dt;
    b.vy += G * dt;
    b.vx *= 1 - 0.1 * dt; b.vy *= 1 - 0.1 * dt; b.om *= 1 - 0.4 * dt;
  }
  world.contacts.length = 0;
  for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
    const A = bs[i], B = bs[j];
    if (A.sleep && B.sleep) continue;
    if (!overlap(A.bb, B.bb)) continue;
    const from = world.contacts.length;
    pairCollect(world, A, B, A); pairCollect(world, B, A, A);
    reducePair(world, from);
  }
  solveContacts(world, dt);
  for (const b of bs) {
    if (b.sleep) continue;
    b.x += b.vx * dt; b.y += b.vy * dt; b.th += b.om * dt;
    if (b.th > PI) b.th -= TWO_PI; else if (b.th < -PI) b.th += TWO_PI;
    updateShape(b);
  }
  let removed = false;
  for (const b of bs) {
    if (b.static || b.sleep) continue;
    if (Math.abs(b.x - b.ax) > SLEEP_D || Math.abs(b.y - b.ay) > SLEEP_D || Math.abs(wrapAngle(b.th - b.ath)) > SLEEP_A) { b.ax = b.x; b.ay = b.y; b.ath = b.th; b.stillT = 0; }
    else { b.stillT += dt; if (b.stillT >= SLEEP_T) { b.sleep = true; b.vx = 0; b.vy = 0; b.om = 0; } }
    if (!b.moved && (Math.abs(b.x - b.wx) > MOVE_D || Math.abs(b.y - b.wy) > MOVE_D || Math.abs(wrapAngle(b.th - b.wth)) > MOVE_A)) { b.moved = true; wakeNeighbors(world, b); }
    if (b.y > FALL_Y || b.x < -400 || b.x > W + 400) { b.fell = true; removed = true; }
  }
  if (removed) {
    world.lastFell = bs.filter(b => b.fell);
    world.bodies = bs.filter(b => !b.fell); world.fell += world.lastFell.length;
    for (const b of world.bodies) wake(world, b);
  }
  if (world.dropT >= SETTLE_MAX) forceSleep(world);
}
// 止まるまで進める（テスト・再生用）。戻り値は かかった秒
function settle(world) { const t0 = world.t; while (!settled(world)) step(world, DT); return world.t - t0; }
// 線の並びを最初から全部積む（テスト・友達のタワーの再生）
function simulateAll(strokes) {
  const world = createWorld();
  for (const st of strokes) { addPiece(world, placeStroke(world, st)); settle(world); }
  return { world, height: towerHeight(world), fell: world.fell, t: world.t };
}

// ---------- URL 用エンコード（base64url） ----------
// 1、SIM_VERSION、高さ u16、線の本数、線ごとに [点の数 u8][最初の点 u16(x+1000) u16(y+3000)][以後 差分 i8（128 は u16 のしるし）]
function encodeTower(strokes, height) {
  const out = [];
  const u8 = v => out.push(v & 255), u16 = v => { out.push(v & 255, (v >> 8) & 255); };
  u8(1); u8(SIM_VERSION); u16(Math.max(0, Math.min(65535, Math.round(height || 0)))); u8(strokes.length);
  for (const st of strokes) {
    const pts = st.slice(0, 255);
    u8(pts.length);
    let px = 0, py = 0;
    pts.forEach((p, i) => {
      const x = Math.round(p.x), y = Math.round(p.y);
      if (i === 0) { u16(x + 1000); u16(y + 3000); }
      else for (const d of [x - px, y - py]) { if (d >= -127 && d <= 127) u8(d); else { u8(128); u16(d + 32768); } }
      px = x; py = y;
    });
  }
  let bin = ''; for (const v of out) bin += String.fromCharCode(v);
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeTower(str) {
  try {
    const s = str.replace(/-/g, '+').replace(/_/g, '/');
    const bin = typeof atob === 'function' ? atob(s) : Buffer.from(s, 'base64').toString('binary');
    const a = Array.from(bin, ch => ch.charCodeAt(0));
    let i = 0; const u8 = () => a[i++], u16 = () => { const v = a[i] | (a[i + 1] << 8); i += 2; return v; };
    if (u8() !== 1 || u8() !== SIM_VERSION) return null;
    const height = u16(), n = u8(), strokes = [];
    if (n > N_PIECES) return null;
    for (let e = 0; e < n; e++) {
      const m = u8(), pts = [];
      let x = 0, y = 0;
      for (let k = 0; k < m; k++) {
        if (k === 0) { x = u16() - 1000; y = u16() - 3000; }
        else { for (const c of ['x', 'y']) { let d = u8(); if (d === 128) d = u16() - 32768; else if (d > 127) d -= 256; if (c === 'x') x += d; else y += d; } }
        pts.push({ x, y });
      }
      if (pts.length >= 2) strokes.push(pts);
    }
    if (i !== a.length) return null;
    return { height, strokes };
  } catch (e) { return null; }
}

root.DrawTower = { setIter: v => { ITER = v; }, SIM_VERSION, W, PLAT_X0, PLAT_X1, N_PIECES, INK, DROP_GAP, DT, G, LT, SETTLE_MAX, FALL_Y, MIN_LEN, dsin, dcos, wrapAngle, len2,
  strokeLength, samplePolyline, simplify, normalizeStroke, makeBody, createWorld, towerHeight, dropLineY, placeStroke, addPiece, settled, forceSleep, step, settle, simulateAll, encodeTower, decodeTower };
})(typeof module !== 'undefined' ? module.exports : window);
