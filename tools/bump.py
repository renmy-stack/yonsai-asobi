"""JS/CSS の版番号を付け直す（更新を公開する前に実行）。古いキャッシュが使われるのを防ぐ。
  python tools/bump.py
"""
import re, glob, os, datetime
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
v = datetime.datetime.now().strftime('%Y%m%d%H%M')
n = 0
for f in glob.glob('*.html'):
    s = open(f, encoding='utf-8').read()
    s2 = re.sub(r'(src|href)="([a-z_]+\.(?:js|css))(\?v=[^"]*)?"', lambda m: f'{m.group(1)}="{m.group(2)}?v={v}"', s)
    if s2 != s: open(f, 'w', encoding='utf-8').write(s2); n += 1
s = open('sw.js', encoding='utf-8').read()
s = re.sub(r"const CACHE = '[^']+';", f"const CACHE = 'asobi-{v}';", s)
open('sw.js', 'w', encoding='utf-8').write(s)
print('version', v, 'files', n)
