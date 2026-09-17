import os
import base64
from PIL import Image, ImageOps

ASSETS_DIR = 'assets'
MASCOT_SVG = os.path.join(ASSETS_DIR, 'mascot.svg')
LOGO_PNG = os.path.join(ASSETS_DIR, 'logo.png')
LOGO_LIGHT_PNG = os.path.join(ASSETS_DIR, 'logo-light.png')

# 1. Extract high-res mascot from mascot.svg
with open(MASCOT_SVG, 'r', encoding='utf-8') as f:
    svg_content = f.read()

prefix = 'href="data:image/png;base64,'
idx = svg_content.find(prefix)
if idx == -1:
    raise ValueError("Could not find base64 image in mascot.svg")

b64_start = idx + len(prefix)
b64_end = svg_content.find('"', b64_start)
b64_data = svg_content[b64_start:b64_end]
img_bytes = base64.b64decode(b64_data)

import io
base_mascot = Image.open(io.BytesIO(img_bytes)).convert('RGBA')
print(f"Loaded mascot from mascot.svg: size={base_mascot.size}")

# Find tight bounding box of mascot
bbox = base_mascot.getbbox() # (left, upper, right, lower)
print(f"Mascot bbox: {bbox}")
cropped_mascot = base_mascot.crop(bbox)
cw, ch = cropped_mascot.size

# Function to place cropped mascot onto a target canvas
def create_mascot_icon(target_size, bg_color=None, scale_factor=0.82):
    canvas = Image.new('RGBA', (target_size, target_size), bg_color if bg_color else (0, 0, 0, 0))
    
    # Calculate fit size maintaining aspect ratio
    max_dim = int(target_size * scale_factor)
    ratio = min(max_dim / cw, max_dim / ch)
    new_w = int(cw * ratio)
    new_h = int(ch * ratio)
    
    resized = cropped_mascot.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center on canvas
    offset_x = (target_size - new_w) // 2
    offset_y = (target_size - new_h) // 2
    
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas

# --- Generate favoricon.png (512x512, transparent background, crisp) ---
fav_png = create_mascot_icon(512, bg_color=None, scale_factor=0.90)
fav_png.save(os.path.join(ASSETS_DIR, 'favoricon.png'), 'PNG', optimize=True)
print("Saved assets/favoricon.png (512x512 transparent)")

# --- Generate favicon.svg based on mascot.svg ---
# Create an SVG that embeds the clean mascot in a square viewBox
buf = io.BytesIO()
fav_png.save(buf, format='PNG')
fav_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
svg_template = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image width="512" height="512" href="data:image/png;base64,{fav_b64}"/>
</svg>
'''
with open(os.path.join(ASSETS_DIR, 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_template)
print("Saved assets/favicon.svg (real mascot embedded)")

# Also update favoricon.svg to match
with open(os.path.join(ASSETS_DIR, 'favoricon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_template)
print("Saved assets/favoricon.svg")

# --- Generate apple-touch-icon.png (180x180, #0A0A0A background) ---
apple_icon = create_mascot_icon(180, bg_color=(10, 10, 10, 255), scale_factor=0.76)
apple_icon.save(os.path.join(ASSETS_DIR, 'apple-touch-icon.png'), 'PNG', optimize=True)
print("Saved assets/apple-touch-icon.png (180x180 dark tile)")

# --- Generate pwa-192.png (192x192, #0A0A0A background) ---
pwa_192 = create_mascot_icon(192, bg_color=(10, 10, 10, 255), scale_factor=0.78)
pwa_192.save(os.path.join(ASSETS_DIR, 'pwa-192.png'), 'PNG', optimize=True)
print("Saved assets/pwa-192.png (192x192)")

# --- Generate pwa-512.png (512x512, #0A0A0A background) ---
pwa_512 = create_mascot_icon(512, bg_color=(10, 10, 10, 255), scale_factor=0.78)
pwa_512.save(os.path.join(ASSETS_DIR, 'pwa-512.png'), 'PNG', optimize=True)
print("Saved assets/pwa-512.png (512x512)")

# --- Generate pwa-maskable-512.png (512x512, safe zone 80% = scale_factor 0.65) ---
pwa_maskable = create_mascot_icon(512, bg_color=(10, 10, 10, 255), scale_factor=0.64)
pwa_maskable.save(os.path.join(ASSETS_DIR, 'pwa-maskable-512.png'), 'PNG', optimize=True)
print("Saved assets/pwa-maskable-512.png (512x512 maskable safe zone)")

# --- Generate shortcuts (96x96) ---
for s_name in ['shortcut-devis.png', 'shortcut-blog.png', 'shortcut-contact.png']:
    sc = create_mascot_icon(96, bg_color=(10, 10, 10, 255), scale_factor=0.75)
    sc.save(os.path.join(ASSETS_DIR, s_name), 'PNG', optimize=True)
    print(f"Saved assets/{s_name} (96x96)")

# --- Generate logo-light.png from logo.png ---
# Preserves mascot (x < 355) 100% untouched
# Changes text "Aken" (x >= 355) to dark ink #17130E while preserving original alpha
im_logo = Image.open(LOGO_PNG).convert('RGBA')
lw, lh = im_logo.size
logo_pixels = im_logo.load()

im_logo_light = im_logo.copy()
light_pixels = im_logo_light.load()

# Color for text in light mode: #17130E (23, 19, 14) matching --text-heading
TEXT_INK = (23, 19, 14)

for x in range(355, lw):
    for y in range(lh):
        r, g, b, a = logo_pixels[x, y]
        if a > 0:
            light_pixels[x, y] = (TEXT_INK[0], TEXT_INK[1], TEXT_INK[2], a)

im_logo_light.save(LOGO_LIGHT_PNG, 'PNG', optimize=True)
print(f"Saved {LOGO_LIGHT_PNG} (mascot untouched orange, text #17130E)")

print("ALL ASSETS SUCCESSFULLY GENERATED!")
