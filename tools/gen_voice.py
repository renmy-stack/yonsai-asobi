"""
VOICEVOX でゲーム内の全セリフを音声ファイル化する。

前提: VOICEVOX を起動しておく（http://127.0.0.1:50021）
使い方:
  python tools/gen_voice.py            # 未生成のものだけ作る
  python tools/gen_voice.py --force    # 全部作り直す
  python tools/gen_voice.py --speaker 1 --speed 0.95
出力:
  assets/voice/<hash>.mp3  と  assets/voice/manifest.json（セリフ → ファイル名）
"""
import argparse, hashlib, json, os, sys, struct, wave, io, urllib.request, urllib.parse

HOST = 'http://127.0.0.1:50021'
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'voice')

# ---------- セリフの一覧（ゲームのコードと合わせる） ----------
NAMES = ['いぬ', 'ねこ', 'ぞう', 'らいおん', 'うし', 'かえる', 'うさぎ', 'ぱんだ', 'きりん', 'ぺんぎん', 'さる', 'ぶた',
         'でんしゃ', 'くるま', 'バス', 'しょうぼうしゃ', 'パトカー', 'ひこうき',
         'りんご', 'バナナ', 'おにぎり', 'パン', 'いちご', 'ケーキ']
LABELS = ['どうぶつ', 'のりもの', 'たべもの']
COLORS = ['あか', 'きいろ', 'みどり', 'あお', 'オレンジ', 'ちゃいろ', 'はいいろ', 'しろ', 'ピンク']
KANAS = sorted({n[0] for n in NAMES if 'ぁ' <= n[0] <= 'ゖ'})
HIRA_NAMES = [n for n in NAMES if 'ぁ' <= n[0] <= 'ゖ']
COLORING = ['いぬ', 'くるま', 'りんご', 'さかな', 'おうち', 'おはな', 'でんしゃ', 'ねこ', 'ちょうちょ', 'アイス', 'ロケット', 'うさぎ']
SONGS = ['きらきらぼし', 'ちょうちょう', 'かえるのうた', 'メリーさんのひつじ']
READ = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく']
# 助数詞（catalog.js の COUNTERS と同じ）
COUNTERS = {
    'hiki': ('なんびき', ['いっぴき', 'にひき', 'さんびき', 'よんひき', 'ごひき', 'ろっぴき']),
    'tou':  ('なんとう', ['いっとう', 'にとう', 'さんとう', 'よんとう', 'ごとう', 'ろくとう']),
    'dai':  ('なんだい', ['いちだい', 'にだい', 'さんだい', 'よんだい', 'ごだい', 'ろくだい']),
    'ki':   ('なんき',   ['いっき', 'にき', 'さんき', 'よんき', 'ごき', 'ろっき']),
    'ko':   ('なんこ',   ['いっこ', 'にこ', 'さんこ', 'よんこ', 'ごこ', 'ろっこ']),
    'hon':  ('なんぼん', ['いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん']),
    'wa':   ('なんわ',   ['いちわ', 'にわ', 'さんわ', 'よんわ', 'ごわ', 'ろくわ']),
}
NAME_COUNTER = {'いぬ': 'hiki', 'ねこ': 'hiki', 'かえる': 'hiki', 'ぞう': 'tou', 'らいおん': 'tou', 'うし': 'tou',
                'でんしゃ': 'dai', 'くるま': 'dai', 'バス': 'dai', 'しょうぼうしゃ': 'dai', 'パトカー': 'dai', 'ひこうき': 'ki',
                'りんご': 'ko', 'おにぎり': 'ko', 'パン': 'ko', 'いちご': 'ko', 'ケーキ': 'ko', 'バナナ': 'hon',
                'うさぎ': 'wa', 'ぱんだ': 'tou', 'きりん': 'tou', 'ぺんぎん': 'wa', 'さる': 'hiki', 'ぶた': 'tou'}
SHAPES = ['まる', 'さんかく', 'しかく', 'ほし', 'ハート']
CLOCK = ['いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ']

def phrases():
    P = set()
    # 固定
    P.update([
        'せいかい！', 'すごい！', 'せいかい！ すごい！', 'ごもん せいかい！ すごい！', 'ごかい せいかい！ すごい！',
        'ぜんぶ みつけた！ すごい！', 'できた！', 'じょうずに すすめた！', 'ざんねん。 もういちど みてみよう',
        'よくみてね', 'おなじ じゅんばんで タッチ！', 'これは だれの かげかな？', 'かげを よくみてね',
        'あお！ すすめ', 'あか！ とまれ', 'あかは とまれ！ あおまで まってね', 'まっしろに なったよ', 'やりなおし',
        'おおきいのは どっち？', 'ちいさいのは どっち？', 'おおいのは どっち？', 'すくないのは どっち？', 'ちがうよ。',
        'せいかい！ こっちが おおきい！', 'せいかい！ こっちが ちいさい！',
        'タッチして かぞえてみよう', 'ちがうのは どれかな？', 'おなじ！', 'ちがうね', '2まい タッチして いれかえよう',
        'いただきます！', 'いろを ぬろう',
    ])
    P.update(READ)
    P.update(f'{r}じゃないよ。' for r in READ)
    P.update(['こっちが', 'おおきい！', 'ちいさい！'])
    for q, nums in COUNTERS.values():
        P.update(f'{n}！' for n in nums)
    for n, c in NAME_COUNTER.items():
        P.add(f'{n}は {COUNTERS[c][0]} かな？')
    # たしざん: 「いぬが いっぴきと にひき。 あわせて なんびき？」
    P.update(['あわせて', 'ぜんぶ タッチして かぞえてみよう'])
    for q, nums in COUNTERS.values():
        P.add(f'{q}？')
        P.update(f'{n}と' for n in nums)
        P.update(f'{n}。' for n in nums)
    P.update(f'{n}が' for n in NAMES)
    # とけい
    P.update(['なんじ かな？', 'あかい みじかい はりを みてね'])
    P.update(f'{c}！' for c in CLOCK)
    P.update(f'{c}はん！' for c in CLOCK)
    # かたち
    P.update(['おなじ かたちは どれかな？', 'おなじ かたちを さがしてね'])
    for s in SHAPES:
        P.update([f'{s}は どれかな？', f'{s}！', f'それは {s}。'])
    # まちがいさがし・ならべかえ・めいろ
    P.update(['ちがう ところは どこかな？', 'ここが ちがうね', 'そこは おなじだよ',
              'ちいさい じゅんに タッチ！', 'おおきい じゅんに タッチ！', 'すくない じゅんに タッチ！', 'おおい じゅんに タッチ！',
              'せいかい！ ならんだ！', 'つぎは どれかな？',
              'ゴール！ やったね！'])
    P.update(f'{n}まで つれていこう！' for n in NAMES)
    # シール・タイマー
    P.update(['シールを もらった！', 'きょうは おしまい！ また あそぼうね', 'トロフィー', 'わんちゃん'])
    P.update(['すごい！', 'やったね！', 'そのちょうし！', 'じょうずだね！', 'きらきらシールを もらった！', 'ぜんぶ あつめた！ すごい！'])
    P.update(SONGS)
    P.update(f'{n}に いろを ぬろう' for n in COLORING)
    for n in NAMES:
        P.update([n, f'{n}は', f'{n}を', f'{n}！', f'{n}は どこかな？', f'それは {n}。', f'{n}の かげでした！',
                  f'{n}じゃないよ。', f'{n}の パズル！', f'{n}だ！'])
    for l in LABELS:
        P.update([f'{l}じゃないのは どれかな？', f'{l}だね', f'{l}だよ。', f'おなじ {l}を さがそう！'])
    for c in COLORS:
        P.update([f'{c}のは どれかな？', f'{c}の', f'{c}だね。', f'{c}は どれかな？'])
    for k in KANAS:
        P.update([f'{k}で はじまるのは どれかな？', f'{k}で はじまるね。', f'{k}は どれかな？'])
    P.update(f'{n[0]}、{n}！' for n in HIRA_NAMES)
    return sorted(P)

# ---------- 合成 ----------
def synth(text, speaker, speed):
    q = urllib.request.Request(f'{HOST}/audio_query?' + urllib.parse.urlencode({'text': text, 'speaker': speaker}), method='POST')
    query = json.load(urllib.request.urlopen(q))
    query['speedScale'] = speed
    query['outputSamplingRate'] = 24000
    query['outputStereo'] = False
    query['prePhonemeLength'] = 0.05
    query['postPhonemeLength'] = 0.15
    s = urllib.request.Request(f'{HOST}/synthesis?' + urllib.parse.urlencode({'speaker': speaker}),
                               data=json.dumps(query).encode(), headers={'Content-Type': 'application/json'}, method='POST')
    return urllib.request.urlopen(s).read()

def wav_to_mp3(wav_bytes):
    import lameenc
    w = wave.open(io.BytesIO(wav_bytes))
    pcm = w.readframes(w.getnframes())
    enc = lameenc.Encoder()
    enc.set_bit_rate(48); enc.set_in_sample_rate(w.getframerate()); enc.set_channels(w.getnchannels()); enc.set_quality(2)
    return enc.encode(pcm) + enc.flush()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--speaker', type=int, default=3, help='VOICEVOX の話者ID（3=ずんだもん ノーマル）')
    ap.add_argument('--speed', type=float, default=0.95)
    ap.add_argument('--force', action='store_true')
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    mpath = os.path.join(OUT, 'manifest.json')
    manifest = json.load(open(mpath, encoding='utf-8')) if os.path.exists(mpath) and not a.force else {}
    todo = [t for t in phrases() if t not in manifest]
    print(f'{len(phrases())} セリフ中 {len(todo)} 件を生成します（話者 {a.speaker}）')
    for i, text in enumerate(todo, 1):
        name = hashlib.md5(text.encode()).hexdigest()[:10] + '.mp3'
        try:
            data = wav_to_mp3(synth(text, a.speaker, a.speed))
        except Exception as e:
            print('失敗:', text, e); continue
        open(os.path.join(OUT, name), 'wb').write(data)
        manifest[text] = name
        if i % 20 == 0 or i == len(todo):
            print(f'  {i}/{len(todo)}  {text}')
            json.dump(manifest, open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    json.dump(manifest, open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
    print(f'完了: {len(manifest)} 件, 合計 {total/1024/1024:.1f} MB')

if __name__ == '__main__':
    main()
