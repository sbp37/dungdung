#!/usr/bin/env python3
"""puff 스프라이트를 크림 배경 위에 그려 PWA 아이콘 PNG 생성."""
from PIL import Image

ROWS = [
    '....KKKKKKKK....',
    '..KKMMMMMMMMKK..',
    '.KMMMMMMMMMMMMK.',
    'KMMmMMMMMMMMMmMK',
    'KMBWBMMMMMMBWBMK',
    'KMMMMMMMMMMMMMMK',
    'KMMMMMKKMMMMMMMK',
    '.KMMMMMKKMMMMMK.',
    '..KKMMMMMMMMKK..',
    '....KKKKKKKK....',
]
PAL = {
    'K': '#4a4257',
    'W': '#fffdf7',
    'B': '#4a4257',
    'M': '#c8ecd9',
    'm': '#a5dcbe',
    'P': '#ffb3a0',
}
BG = '#f6edd9'

for out_size, path in [(512, 'public/icon-512.png'), (192, 'public/icon-192.png')]:
    scale = out_size // 24
    sw = len(ROWS[0]) * scale
    sh = len(ROWS) * scale
    img = Image.new('RGBA', (out_size, out_size), BG)
    ox = (out_size - sw) // 2
    oy = (out_size - sh) // 2
    px = img.load()
    for y, row in enumerate(ROWS):
        for x, ch in enumerate(row):
            c = PAL.get(ch)
            if not c:
                continue
            rgb = tuple(int(c[i : i + 2], 16) for i in (1, 3, 5)) + (255,)
            for dy in range(scale):
                for dx in range(scale):
                    px[ox + x * scale + dx, oy + y * scale + dy] = rgb
    img.save(path)
    print('wrote', path)
