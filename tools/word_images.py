"""
しりとり・ことばづくり用の単語（words.js）と、はんたいことば用の絵を ChatGPT で作るための一覧。
  python tools/word_images.py prompt N     → N 枚目（0始まり）のシート用プロンプトを表示（4列x3行=12語）
  python tools/word_images.py split N FILE → ダウンロードしたシート FILE を 12 枚に切り分けて assets/words/ に保存
  python tools/word_images.py opp-prompt N / opp-split N FILE → はんたいことば（4列x2行=8枚）
"""
import os, sys, subprocess

# (かな, id, 英語の説明)
WORDS = [
    ('りんご', 'ringo', 'a red apple'),
    ('ぶどう', 'budou', 'a bunch of purple grapes'),
    ('みかん', 'mikan', 'a mandarin orange'),
    ('すいか', 'suika', 'a slice of watermelon'),
    ('ばなな', 'banana', 'a banana'),
    ('いちご', 'ichigo', 'a strawberry'),
    ('もも', 'momo', 'a peach'),
    ('なし', 'nashi', 'a yellow-green pear'),
    ('れもん', 'remon', 'a lemon'),
    ('きうい', 'kiui', 'a kiwi fruit cut in half'),
    ('とまと', 'tomato', 'a tomato'),
    ('にんじん', 'ninjin', 'a carrot'),
    ('とうもろこし', 'toumorokoshi', 'an ear of corn'),
    ('なす', 'nasu', 'an eggplant'),
    ('きゅうり', 'kyuuri', 'a cucumber'),
    ('きのこ', 'kinoko', 'a mushroom'),
    ('おにぎり', 'onigiri', 'a rice ball with seaweed'),
    ('ぱん', 'pan', 'a loaf of bread'),
    ('けーき', 'keeki', 'a slice of strawberry cake'),
    ('あめ', 'ame', 'a wrapped candy'),
    ('どーなつ', 'doonatsu', 'a pink frosted donut'),
    ('あいす', 'aisu', 'an ice cream cone'),
    ('らーめん', 'raamen', 'a bowl of ramen noodles'),
    ('すし', 'sushi', 'two pieces of sushi'),
    ('たまご', 'tamago', 'an egg'),
    ('ちーず', 'chiizu', 'a wedge of cheese'),
    ('くっきー', 'kukkii', 'a chocolate chip cookie'),
    ('じゅーす', 'juusu', 'a juice box with a straw'),
    ('ぞう', 'zou', 'an elephant'),
    ('きりん', 'kirin', 'a giraffe'),
    ('かめ', 'kame', 'a turtle'),
    ('さかな', 'sakana', 'a fish'),
    ('ひよこ', 'hiyoko', 'a yellow chick'),
    ('ぺんぎん', 'pengin', 'a penguin'),
    ('かに', 'kani', 'a red crab'),
    ('たこ', 'tako', 'an octopus'),
    ('うさぎ', 'usagi', 'a rabbit'),
    ('うま', 'uma', 'a horse'),
    ('うし', 'ushi', 'a cow'),
    ('ねこ', 'neko', 'a cat'),
    ('いぬ', 'inu', 'a dog'),
    ('ねずみ', 'nezumi', 'a mouse'),
    ('らいおん', 'raion', 'a lion'),
    ('かえる', 'kaeru', 'a frog'),
    ('ぱんだ', 'panda', 'a panda'),
    ('こあら', 'koara', 'a koala'),
    ('きつね', 'kitsune', 'a fox'),
    ('くま', 'kuma', 'a brown bear'),
    ('ぶた', 'buta', 'a pig'),
    ('にわとり', 'niwatori', 'a hen'),
    ('あひる', 'ahiru', 'a white duck'),
    ('はち', 'hachi', 'a bee'),
    ('ちょうちょ', 'choucho', 'a butterfly'),
    ('てんとうむし', 'tentoumushi', 'a ladybug'),
    ('あり', 'ari', 'an ant'),
    ('かたつむり', 'katatsumuri', 'a snail'),
    ('ごりら', 'gorira', 'a gorilla'),
    ('ひつじ', 'hitsuji', 'a sheep'),
    ('やぎ', 'yagi', 'a goat'),
    ('しか', 'shika', 'a deer'),
    ('いるか', 'iruka', 'a dolphin'),
    ('くじら', 'kujira', 'a whale'),
    ('さめ', 'same', 'a shark'),
    ('へび', 'hebi', 'a snake'),
    ('ふくろう', 'fukurou', 'an owl'),
    ('かさ', 'kasa', 'an umbrella'),
    ('ぼうし', 'boushi', 'a straw hat'),
    ('くつした', 'kutsushita', 'a pair of socks'),
    ('くつ', 'kutsu', 'a pair of sneakers'),
    ('めがね', 'megane', 'a pair of glasses'),
    ('らんどせる', 'randoseru', 'a red school backpack'),
    ('くるま', 'kuruma', 'a red car'),
    ('ばす', 'basu', 'a yellow bus'),
    ('でんしゃ', 'densha', 'a train'),
    ('ひこうき', 'hikouki', 'an airplane'),
    ('ろけっと', 'roketto', 'a rocket'),
    ('ふね', 'fune', 'a sailboat'),
    ('じてんしゃ', 'jitensha', 'a bicycle'),
    ('へりこぷたー', 'herikoputaa', 'a helicopter'),
    ('しょうぼうしゃ', 'shoubousha', 'a fire truck'),
    ('きゅうきゅうしゃ', 'kyuukyuusha', 'an ambulance'),
    ('さくら', 'sakura', 'a cherry blossom flower'),
    ('ひまわり', 'himawari', 'a sunflower'),
    ('ちゅーりっぷ', 'chuurippu', 'a tulip'),
    ('き', 'ki', 'a tree'),
    ('つき', 'tsuki', 'a crescent moon'),
    ('ほし', 'hoshi', 'a yellow star'),
    ('たいよう', 'taiyou', 'a smiling sun'),
    ('くも', 'kumo', 'a fluffy cloud'),
    ('にじ', 'niji', 'a rainbow'),
    ('ゆきだるま', 'yukidaruma', 'a snowman'),
    ('ひ', 'hi', 'a campfire flame'),
    ('いえ', 'ie', 'a house'),
    ('どあ', 'doa', 'a door'),
    ('いす', 'isu', 'a chair'),
    ('べっど', 'beddo', 'a bed'),
    ('とけい', 'tokei', 'an alarm clock'),
    ('てれび', 'terebi', 'a television'),
    ('ぴあの', 'piano', 'a piano'),
    ('たいこ', 'taiko', 'a drum'),
    ('ぎたー', 'gitaa', 'a guitar'),
    ('ふうせん', 'fuusen', 'a red balloon'),
    ('ぼーる', 'booru', 'a soccer ball'),
    ('ほん', 'hon', 'a book'),
    ('ぷれぜんと', 'purezento', 'a gift box with a bow'),
    ('かぎ', 'kagi', 'a key'),
    ('すず', 'suzu', 'a bell'),
    ('はぶらし', 'haburashi', 'a toothbrush'),
    ('せっけん', 'sekken', 'a bar of soap'),
    ('ばけつ', 'baketsu', 'a bucket'),
    ('はさみ', 'hasami', 'scissors'),
    ('えんぴつ', 'enpitsu', 'a pencil'),
    ('くれよん', 'kureyon', 'a crayon'),
    ('かめら', 'kamera', 'a camera'),
    ('すぷーん', 'supuun', 'a spoon'),
    ('ふぉーく', 'fooku', 'a fork'),
    ('ぎゅうにゅう', 'gyuunyuu', 'a carton of milk'),
]
PER = 15  # 5列 x 3行

OPP = [
    ('ookii', 'a big elephant'), ('chiisai', 'a tiny mouse'), ('nagai', 'a very long train with many cars'), ('mijikai', 'a very short train with one car'),
    ('ooi', 'a big pile of many apples'), ('sukunai', 'a single apple'), ('takai', 'a bird flying high above a tall tree'), ('hikui', 'a bird standing low on the ground next to a small flower'),
    ('akarui', 'a bright sunny room with sunshine through the window'), ('kurai', 'a dark night room lit only by a small moon'), ('hayai', 'a rabbit running fast with speed lines'), ('osoi', 'a turtle walking very slowly'),
    ('atsui', 'a sweating sun on a hot summer day with a melting ice cream'), ('samui', 'a shivering snowman in falling snow'), ('ue', 'a cat sitting on top of a table'), ('shita', 'a cat sitting under a table'),
]

STYLE = ('Generate an image (wide landscape). A sprite sheet arranged in a strict {cols} columns x {rows} rows grid of equal cells, '
         'each picture centered in its own cell with generous margin, plain solid white background, no grid lines, no text, no letters, no shadows. '
         'Style: kawaii flat vector illustration, thick rounded dark outlines, soft bright pastel colors, cute smiling faces where natural. ')

def prompt(n):
    items = WORDS[n * PER:(n + 1) * PER]
    rows = [items[i:i + 5] for i in range(0, len(items), 5)]
    txt = STYLE.format(cols=5, rows=len(rows))
    for r, row in enumerate(rows):
        txt += f"Row {r + 1} left to right: " + ", ".join(f"({i + 1}) {w[2]}" for i, w in enumerate(row)) + ". "
    return txt.strip()

def opp_prompt(n):
    items = OPP[n * 8:(n + 1) * 8]
    txt = STYLE.format(cols=4, rows=2)
    txt += "Top row left to right: " + ", ".join(f"({i + 1}) {w[1]}" for i, w in enumerate(items[:4])) + ". "
    txt += "Bottom row left to right: " + ", ".join(f"({i + 5}) {w[1]}" for i, w in enumerate(items[4:])) + "."
    return txt

def split(n, path, opp=False):
    here = os.path.dirname(os.path.abspath(__file__))
    if opp:
        names = [w[0] for w in OPP[n * 8:(n + 1) * 8]]; out = os.path.join(here, '..', 'assets', 'opposite'); cols, rows = 4, 2
    else:
        items = WORDS[n * PER:(n + 1) * PER]; names = [w[1] for w in items]; out = os.path.join(here, '..', 'assets', 'words'); cols, rows = 5, (len(items) + 4) // 5
    os.makedirs(out, exist_ok=True)
    subprocess.check_call([sys.executable, os.path.join(here, 'split_sheet.py'), path, out, *names, '--cols', str(cols), '--rows', str(rows), '--size', '320'] + (['--keep-all'] if opp else []))

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'prompt': print(prompt(int(sys.argv[2])))
    elif cmd == 'opp-prompt': print(opp_prompt(int(sys.argv[2])))
    elif cmd == 'split': split(int(sys.argv[2]), sys.argv[3])
    elif cmd == 'opp-split': split(int(sys.argv[2]), sys.argv[3], opp=True)
    elif cmd == 'count': print(len(WORDS), (len(WORDS) + PER - 1) // PER)
