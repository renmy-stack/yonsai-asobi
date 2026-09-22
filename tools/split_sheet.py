"""
ChatGPT で生成した「3列x2行のキャラシート」を6枚に切り分け、
白背景を透過にして PNG で保存する。

使い方:
  python tools/split_sheet.py <sheet.png> <出力フォルダ> name1 name2 name3 name4 name5 name6 [--cols 3 --rows 2]
"""
import sys, argparse
from collections import deque
from PIL import Image
import numpy as np


def knockout_white(img: Image.Image, tol: int = 40) -> Image.Image:
    """画像の外周から続く白い領域だけを透明にする（目の白目などは残す）。"""
    arr = np.array(img.convert("RGBA"))
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(int)
    near_white = (rgb.min(axis=2) >= 255 - tol)
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near_white[y, x] and not visited[y, x]:
                visited[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if near_white[y, x] and not visited[y, x]:
                visited[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and near_white[ny, nx]:
                visited[ny, nx] = True; q.append((ny, nx))
    # 縁をなめらかに: 白さに応じてアルファを落とす
    alpha = arr[:, :, 3].copy()
    alpha[visited] = 0
    # 透明領域に隣接する半白ピクセルを少しだけ薄くする（簡易アンチエイリアス）
    edge = visited.copy()
    edge[1:, :] |= visited[:-1, :]; edge[:-1, :] |= visited[1:, :]
    edge[:, 1:] |= visited[:, :-1]; edge[:, :-1] |= visited[:, 1:]
    ring = edge & ~visited
    whiteness = rgb.min(axis=2)
    alpha[ring] = np.clip((255 - whiteness[ring]) * 2, 0, 255).astype(np.uint8)
    arr[:, :, 3] = alpha
    return Image.fromarray(arr, "RGBA")


def keep_main_blob(img: Image.Image) -> Image.Image:
    """不透明ピクセルの連結成分のうち、最大のもの（と重なる成分）だけ残す。
    隣のセルからはみ出したパーツを除去する。"""
    arr = np.array(img)
    solid = arr[:, :, 3] > 0
    h, w = solid.shape
    label = np.zeros((h, w), dtype=np.int32)
    comps = []
    cur = 0
    ys, xs = np.nonzero(solid)
    for y0, x0 in zip(ys, xs):
        if label[y0, x0]:
            continue
        cur += 1
        q = deque([(y0, x0)]); label[y0, x0] = cur
        size = 0; miny = maxy = y0; minx = maxx = x0
        while q:
            y, x = q.popleft(); size += 1
            miny = min(miny, y); maxy = max(maxy, y); minx = min(minx, x); maxx = max(maxx, x)
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not label[ny, nx]:
                    label[ny, nx] = cur; q.append((ny, nx))
        comps.append((size, cur, (minx, miny, maxx, maxy)))
    if len(comps) <= 1:
        return img
    comps.sort(reverse=True)
    _, main, (mx0, my0, mx1, my1) = comps[0]
    keep = {main}
    # メインの矩形と重なる成分（切れた耳やしっぽ）と、メインの 15% 以上の大きさの成分（信号機と車など）は残す
    main_size = comps[0][0]
    for size, lid, (x0, y0, x1, y1) in comps[1:]:
        overlap = x1 >= mx0 and x0 <= mx1 and y1 >= my0 and y0 <= my1 and size > 30
        if overlap or size >= main_size * 0.15:
            keep.add(lid)
    mask = np.isin(label, list(keep))
    arr[:, :, 3][~mask] = 0
    return Image.fromarray(arr, "RGBA")


def trim(img: Image.Image, pad: int = 12) -> Image.Image:
    """透明部分を切り落として正方形に整える。"""
    bbox = img.getbbox()
    if not bbox:
        return img
    img = img.crop(bbox)
    w, h = img.size
    side = max(w, h) + pad * 2
    out = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    out.paste(img, ((side - w) // 2, (side - h) // 2))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet"); ap.add_argument("outdir"); ap.add_argument("names", nargs="+")
    ap.add_argument("--cols", type=int, default=3); ap.add_argument("--rows", type=int, default=2)
    ap.add_argument("--size", type=int, default=512, help="出力の一辺(px)")
    ap.add_argument("--keep-bg", action="store_true", help="白背景を透過にしない")
    a = ap.parse_args()
    sheet = Image.open(a.sheet).convert("RGBA")
    W, H = sheet.size
    cw, ch = W / a.cols, H / a.rows
    if len(a.names) != a.cols * a.rows:
        sys.exit(f"名前は {a.cols * a.rows} 個必要です（{len(a.names)} 個指定）")
    for i, name in enumerate(a.names):
        r, c = divmod(i, a.cols)
        cell = sheet.crop((int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch)))
        if not a.keep_bg:
            cell = trim(keep_main_blob(knockout_white(cell)))
        cell = cell.resize((a.size, a.size), Image.LANCZOS)
        path = f"{a.outdir}/{name}.png"
        cell.save(path, optimize=True)
        print("saved", path)


if __name__ == "__main__":
    main()
