# Générateur d'images Open Graph par article du blog (1200x630)
# Rastérise assets/blog/cover-N.svg via Chrome headless, puis compose
# la bannière (fond Aken + couverture arrondie + titre + catégorie).
# Usage : python tools/generate-og-articles.py
import glob
import math
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG = os.path.join(ROOT, "assets", "blog")
OUT = os.path.join(ROOT, "assets", "og")
TMP = os.path.join(OUT, "_tmp")
os.makedirs(OUT, exist_ok=True)
os.makedirs(TMP, exist_ok=True)

CHROME_CANDIDATES = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
]
CHROME = next((c for c in CHROME_CANDIDATES if os.path.exists(c)), None)

W, H = 1200, 630

TITLES = {
    1: ("Automatiser votre entreprise au Mali", "ENTREPRENEURS"),
    2: ("Wave & Orange Money dans votre app", "TECHNIQUE"),
    3: ("Applications qui marchent en 3G", "TECHNIQUE"),
    4: ("Du papier au logiciel : cas réel", "ÉTUDE DE CAS"),
    5: ("Cloud ou VPS : le bon choix", "INFRASTRUCTURE"),
    6: ("Sécuriser les données de votre PME", "SÉCURITÉ"),
    7: ("PWA ou app native ?", "TECHNIQUE"),
    8: ("Vos Excel en tableaux de bord", "DATA & IA"),
    9: ("Vivre du freelance tech au Mali", "ENTREPRENEURS"),
    10: ("Sécuriser un VPS en 10 étapes", "INFRASTRUCTURE"),
    11: ("Lancer votre boutique en ligne", "ENTREPRENEURS"),
    12: ("Le design sombre qui convertit", "TECHNIQUE"),
}


def rasterize(svg_path, out_png, width=720, height=405):
    """Rastérise un SVG en PNG via Chrome headless (screenshot)."""
    url = "file:///" + svg_path.replace("\\", "/")
    cmd = [
        CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
        "--force-device-scale-factor=1",
        f"--window-size={width},{height}",
        f"--screenshot={out_png}", url,
    ]
    subprocess.run(cmd, check=True, capture_output=True, timeout=30)


def make_banner(n, svg_path):
    rasterized = os.path.join(TMP, f"r-{n}.png")
    make_banner.chrome_ok = make_banner.chrome_ok and True
    rasterize(svg_path, rasterized)

    img = Image.new("RGB", (W, H), (10, 10, 10))
    draw = ImageDraw.Draw(img)

    # Glow orange d'ambiance
    glow = Image.new("RGB", (W, H), (10, 10, 10))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-260, 240, 480, 900], fill=(48, 21, 4))
    gd.ellipse([860, -240, 1500, 420], fill=(56, 24, 4))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    img = Image.blend(img, glow, 0.85)
    draw = ImageDraw.Draw(img)

    # Grille de points
    for x in range(30, W, 44):
        for y in range(30, H, 44):
            draw.ellipse([x, y, x + 2, y + 2], fill=(30, 15, 6))

    # Onde signature en bas
    for i in range(0, W, 1):
        y = 600 + int(8 * math.sin(i / 92.0))
        draw.ellipse([i, y, i + 2, y + 2], fill=(140, 58, 0))

    # Couverture rasterisée, arrondie, à droite
    cover = Image.open(rasterized).convert("RGB").resize((560, 315), Image.LANCZOS)
    mask = Image.new("L", (560, 315), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, 560, 315], 22, fill=255)
    img.paste(cover, (580, 120), mask)
    # Liseré lumineux autour de la carte
    draw.rounded_rectangle([580, 120, 1140, 435], 22, outline=(255, 107, 0), width=3)

    # Badge catégorie
    cat = TITLES[n][1]
    f_cat = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
    bw = draw.textlength(cat, font=f_cat) + 36
    draw.rounded_rectangle([70, 96, 70 + bw, 138], 21, fill=(255, 107, 0))
    draw.text((88, 104), cat, font=f_cat, fill=(10, 10, 10))

    # Titre de l'article (retours à la ligne auto ~ 2 lignes max)
    title = TITLES[n][0]
    f_title = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 52)
    f_sub = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 24)
    maxw = 470
    words, lines, cur = title.split(), [], ""
    for w_ in words:
        test = (cur + " " + w_).strip()
        if draw.textlength(test, font=f_title) <= maxw:
            cur = test
        else:
            lines.append(cur)
            cur = w_
    lines.append(cur)
    ty = 176
    for ln in lines[:3]:
        draw.text((70, ty), ln, font=f_title, fill=(255, 255, 255))
        ty += 62

    # Marque en bas
    draw.text((70, 470), "Blog & Insights Aken", font=ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 30), fill=(255, 130, 30))
    draw.text((70, 512), "Analyses · Guides · Retours d'expérience — Bamako, Mali", font=f_sub, fill=(176, 176, 176))
    draw.rounded_rectangle([70, 556, 240, 562], 3, fill=(255, 107, 0))

    out = os.path.join(OUT, f"og-article-{n}.png")
    img.save(out, optimize=True)
    os.remove(rasterized)
    return out, os.path.getsize(out)


make_banner.chrome_ok = CHROME is not None

if not CHROME:
    print("Chrome introuvable — rastérisation impossible", file=sys.stderr)
    sys.exit(1)

for path in sorted(glob.glob(os.path.join(BLOG, "cover-*.svg"))):
    n = int(os.path.basename(path).split("-")[1].split(".")[0])
    if n not in TITLES:
        continue
    out, size = make_banner(n, path)
    print(f"og-article-{n}.png : {size // 1024} Ko")

print("Terminé.")
