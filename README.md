# 4さいの あそび（4歳向けタッチ遊びアプリ）

4歳の子ども向け。HTML/CSS/JS だけで動く Web アプリ（PWA）。
絵は ChatGPT の画像生成で作成、音はブラウザで合成、声は OS の音声合成。
`index.html` がメニュー。どのページも左上「🏠」を **1.5秒長押し** でメニューに戻る。

## ゲーム一覧（37種）

メニューは「かず / あたま / ことば / うごき / つくる」の5つのタブに分かれる（1画面に最大12個）。

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
| `hiragana.html` | ひらがな | 「『い』ではじまるのは どれ？」名前の頭文字クイズ。名前は答えたあとに表示 |
| `oddone.html` | なかまはずれ | 4つのうち仲間じゃないもの（どうぶつ/のりもの/たべもの）を選ぶ |
| `shadow.html` | かげあて | シルエットを見て誰か当てる。正解すると絵が現れる |
| `memory.html` | おなじカード | 神経衰弱。最初は8枚（4組）、慣れたら12枚（6組） |
| `sequence.html` | じゅんばん | 光った順番を覚えて同じ順にタッチ（2〜6個、だんだん長く） |
| `puzzle.html` | パズル | 2枚タッチで入れ替えるスライドなしパズル。2x2 → 3x3 |
| `number.html` | すうじあて | 「なな は どれ？」数字の読み。1〜5 → 1〜10 |
| `pattern.html` | つぎはどれ？ | ○△○△？ のパターンの続きを選ぶ（ABAB → AABB → ABC） |
| `gone.html` | なくなったの | 3〜5個を覚えて、消えたものを当てる |
| `sound.html` | おとあて | 鳴き声・クラクションを聞いて当てる |
| `hide.html` | かくれんぼ | 茂みに隠れた動物を「ねこは どこ？」で探す |
| `trace.html` | なぞりがき | かたち・すうじ・ひらがなを指でなぞる（7割塗れたら合格） |
| `shiritori.html` | しりとり | ずんだもんの言葉の最後の音で始まる絵を選ぶ（単語帳117語、絵つき） |
| `opposite.html` | はんたいことば | おおきい⇔ちいさい など8組を絵で |
| `spell.html` | ことばづくり | 文字タイルを順にタッチして「さ・く・ら」を作る |
| `mole.html` | もぐらたたき | 30秒。ハチはたたかない |
| `balloon.html` | ふうせんわり | 「あかの ふうせんを わって！」色や数字を指示 |
| `catch.html` | くだものキャッチ | 30秒。カゴを動かして果物を受ける。虫はよける |
| `tangram.html` | かたちはめ | 形のピースを枠にドラッグ。3 → 4 → 6個 |
| `tidy.html` | かたづけ | どうぶつ・のりもの・たべものを箱にドラッグして分ける |
| `road.html` | みちつなぎ | 道のタイルを回して車をおうちまでつなぐ。3x3 → 5x5 |
| `sugoroku.html` | すごろく | ずんだもんと交互にサイコロ。マスのお題（まねっこ等）つき |
| `janken.html` | じゃんけん | ずんだもんと勝負。勝ち方も説明 |
| `signal.html` | しんごう | あおのときに車をタッチすると進む。あかだと「とまれ！」 |
| `coloring.html` | ぬりえ | 線画12枚をタッチで塗りつぶし（ChatGPT の線画） |
| `draw.html` | おえかき | 自由に描く。9色・太さ・けしごむ・キャラのスタンプ |
| `piano.html` | ピアノ | 8鍵。きらきらぼし等4曲を自動演奏して鍵盤が光る |

## ごほうび・親向け

- **シール帳** (`stickers.html`): どのゲームでも5問正解するとシールが1枚もらえる（26種。トロフィーと犬は出にくい「きらきらシール」）。全種類集めると特別なお祝い。メニュー右上から開く
- **おうちのひと** (`parent.html`): メニュー左上の ⚙️ を2秒長押し → 「4＋6＝？」の計算に答えると開く。おしまいタイマー（時間が来ると「きょうは おしまい」画面。30分放置で自動解除）、遊んだ記録（回数・時間・正解率・最後に遊んだ日、きょうの合計）、メニューに出すゲームの選択、タイトル変更、ぜんぶダウンロード（オフライン用）、データ消去、クレジット
- **レベルの保存**: ゲームごとの到達レベル（難易度段階）を保存し、次に開いたとき続きから
- **ほめ言葉**: 正解時は「せいかい！／すごい！／やったね！／そのちょうし！／じょうずだね！」からランダム
- **声の先読み**: 出題時に正解・不正解のセリフを先に読み込むので、初回でも間が空かない
- **画面ロック防止**: 遊んでいる間は画面が自動で消えない（iOS 16.4 以降）
- **おえかきの保存**: 📷 で絵を画像にして表示。長押しで写真に保存できる
- 保存先は端末の localStorage（`asobi-v1`）。Safari の「ホーム画面に追加」は長期間使わないと消えることがある
- `sw.js`: オフライン用の Service Worker。https で配信したときだけ有効（GitHub Pages 等に置くと外でも遊べる）

## ファイル

- `common.css` / `common.js` — 全ページ共通のスタイル・音・声・粒の演出・長押しボタン
- `catalog.js` — 登場キャラの一覧（名前・絵文字・音・色・助数詞）。どうぶつ12・のりもの6・たべもの6。画像が無いときは絵文字で代用
- `games.js` — ゲームの一覧とカテゴリ（メニューと親向けページで共通）
- `words.js` — ことば系ゲーム用の単語帳（117語。絵は `assets/words/<id>.png`、無ければ絵文字）
- `assets/opposite/` — はんたいことばの絵16枚、`assets/misc/` — カゴ・虫・ふうせん・茂み・手・コマ・箱・タブなど35枚（すべて ChatGPT 生成）
- `tools/word_images.py` — 単語・はんたい・その他の絵を ChatGPT に頼むプロンプト生成と、シートの切り分け
- `assets/scenes/` — かくれんぼの背景（ChatGPT 生成。無ければ空と草のグラデーション）
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

## 公開先（GitHub Pages）

- URL: **https://renmy-stack.github.io/yonsai-asobi/**
- リポジトリ: https://github.com/renmy-stack/yonsai-asobi （このフォルダ `app/` がリポジトリのルート）
- 更新の反映: このフォルダで `git add -A && git commit -m "..." && git push` すると1〜2分で公開に反映される
- https なので Service Worker が有効になり、一度開けばオフラインでも遊べる
- 生成元のシート画像（`_sheet*.png`）は `.gitignore` で除外している

## iPhone で試す手順（ローカルで試すとき）

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
