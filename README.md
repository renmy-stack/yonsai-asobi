# 4さいの あそび（4歳向けタッチ遊びアプリ）

4歳の子ども向け。HTML/CSS/JS だけで動く Web アプリ（PWA）。
絵は ChatGPT の画像生成で作成、音はブラウザで合成、声は OS の音声合成。
`index.html` がメニュー。どのページも左上「🏠」を **1.5秒長押し** でメニューに戻る。

## ゲーム一覧（20種）

| ページ | 名前 | 内容 |
|--------|------|------|
| `quiz.html` | どこかな？ | 6枚の中から「〇〇はどこ？」と言われたものをタッチ。5問目からは全部まぜる |
| `add.html` | たしざん | 2＋1 などを絵で数えて答える。助数詞つき（「いぬが にひきと いっぴき。あわせて なんびき？」） |
| `sort.html` | ならべかえ | 小さい順・大きい順・少ない順・多い順にタッチ。3つ→4つ |
| `clock.html` | とけい | 「なんじ？」時計の短い針を見て答える。5問できたら「〇じはん」も |
| `shape.html` | かたち | まる・さんかく・しかく・ほし・ハート。名前で選ぶ／同じ形を探す |
| `diff.html` | まちがいさがし | 上下2枚の絵で1か所だけ違うところをタッチ。2x3→3x3 |
| `maze.html` | めいろ | 指でなぞって動物をごはんまで連れていく。5x5→7x7→9x9 |
| `count.html` | かぞえよう | ものをタッチして「いち、に、さん」と数え、数字ボタンで答える。助数詞はものに合わせる（いぬ→なんびき、ぞう→なんとう、くるま→なんだい、ひこうき→なんき、りんご→なんこ、バナナ→なんぼん） |
| `compare.html` | くらべよう | おおきい/ちいさい/おおい/すくない のどっち？ |
| `color.html` | いろあて | 「あかいのは どれ？」色のついた3択 |
| `hiragana.html` | ひらがな | 「『い』ではじまるのは どれ？」名前の頭文字クイズ |
| `oddone.html` | なかまはずれ | 4つのうち仲間じゃないもの（どうぶつ/のりもの/たべもの）を選ぶ |
| `shadow.html` | かげあて | シルエットを見て誰か当てる。正解すると絵が現れる |
| `memory.html` | おなじカード | 12枚（6組）の神経衰弱 |
| `sequence.html` | じゅんばん | 光った順番を覚えて同じ順にタッチ（2〜6個、だんだん長く） |
| `puzzle.html` | パズル | 2枚タッチで入れ替えるスライドなしパズル。2x2 → 3x3 → 4x4 |
| `signal.html` | しんごう | あおのときに車をタッチすると進む。あかだと「とまれ！」 |
| `coloring.html` | ぬりえ | 線画6枚をタッチで塗りつぶし（ChatGPT の線画） |
| `draw.html` | おえかき | 自由に描く。9色・太さ・けしごむ・キャラのスタンプ |
| `piano.html` | ピアノ | 8鍵。きらきらぼし等4曲を自動演奏して鍵盤が光る |

## ごほうび・親向け

- **シール帳** (`stickers.html`): どのゲームでも5問正解するとシールが1枚もらえる（26種）。メニュー右上から開く
- **おうちのひと** (`parent.html`): メニュー左上の ⚙️ を2秒長押し。おしまいタイマー（時間が来ると「きょうは おしまい」画面）、遊んだ記録（回数・正解率）、メニューに出すゲームの選択、データ消去
- 保存先は端末の localStorage（`asobi-v1`）。Safari の「ホーム画面に追加」は長期間使わないと消えることがある
- `sw.js`: オフライン用の Service Worker。https で配信したときだけ有効（GitHub Pages 等に置くと外でも遊べる）

## ファイル

- `common.css` / `common.js` — 全ページ共通のスタイル・音・声・粒の演出・長押しボタン
- `catalog.js` — 登場キャラの一覧（名前・絵文字・音・色・助数詞）。どうぶつ12・のりもの6・たべもの6。画像が無いときは絵文字で代用
- `games.js` — ゲームの一覧（メニューと親向けページで共通）
- `assets/icons/<game>.png` — メニュー用のゲームアイコン（ChatGPT 生成、4x2 シートを分割）
- `game.css` — クイズ系ゲーム共通の部品（問題文・⭐・選択肢カード）
- `assets/<セット>/<id>.png` — キャラ画像（背景透過 512x512）。`_sheet.png` は生成元のシート
- `assets/coloring/<id>.png` — ぬりえ用の線画（白背景 640x640）
- `tools/split_sheet.py` — ChatGPT で作った 3x2 のシートを 6 枚に切り分けて背景透過にする

## 画像の作り方（ChatGPT）

1. ChatGPT に次のように頼む（英語のほうが並びが安定する）:

   > Generate an image (wide landscape). A sprite sheet of 6 cute ... arranged in a strict 3 columns x 2 rows grid of equal-size cells, each centered with generous margin, plain solid white background, no grid lines, no text, no shadows. Style: kawaii flat vector, thick rounded outlines, pastel colors. Top row: A, B, C. Bottom row: D, E, F.

2. 画像を保存して `assets/<セット>/_sheet.png` に置く
3. 切り分け:

   ```
   python tools/split_sheet.py assets/animals/_sheet.png assets/animals dog cat elephant lion cow frog
   ```

4. `catalog.js` に id / 名前 / 絵文字 / 音を追加する

## 声の作り方（VOICEVOX）

セリフは `assets/voice/` の mp3（VOICEVOX で生成）を再生する。無いセリフは OS の音声合成で代用する。

1. VOICEVOX（https://voicevox.hiroshiba.jp/）を起動しておく
2. 生成:

   ```
   python tools/gen_voice.py                 # 未生成のセリフだけ作る
   python tools/gen_voice.py --force         # 全部作り直す
   python tools/gen_voice.py --speaker 1     # 話者を変える（1=ずんだもん あまあま, 2=四国めたん, 8=春日部つむぎ）
   ```

3. セリフの一覧は `tools/gen_voice.py` の `phrases()`。ゲームに新しいセリフを足したら、ここにも追加して再生成する
4. 長い文は `say(['せいかい！', 'いぬは', 'さんびき！'])` のように部品を並べて再生する（部品ごとに mp3 がある）
5. `say()` は言い終わると resolve する Promise を返す。次の問題へ進むときは `sayThen(text, opts, fn)` を使い、声が途中で切れないようにする
6. クレジット: 「VOICEVOX:ずんだもん」（公開するときは表記が必要）

## iPhone で試す手順

1. PC と iPhone を同じ Wi-Fi につなぐ
2. PC でプロジェクトルート（このフォルダの1つ上）で次を実行

   ```
   python -m http.server 8000 --bind 0.0.0.0
   ```

3. PC の IP アドレスを調べる（PowerShell で `ipconfig` → IPv4 アドレス）
4. iPhone の Safari で `http://<PCのIP>:8000/app/` を開く
5. 共有ボタン → **ホーム画面に追加** → ホームのアイコンから起動すると全画面になる

## 子どもに渡すときの設定（iPhone）

- 設定 → アクセシビリティ → **アクセスガイド** をオンにする
- アプリを開いてサイドボタンを3回押すと、そのアプリから出られなくなる
- 画面の向きロックをかけておくと持ち替えても安定する

## 今後の TODO

- [ ] iPhone 実機で子どもに触らせて反応を見る
- [ ] 鳴き声・声を本物の音声ファイルに差し替える（今は合成音＋音声合成）
- [ ] オフライン対応（Service Worker、https が必要）
- [ ] 公開用サーバー（GitHub Pages / Netlify など）
