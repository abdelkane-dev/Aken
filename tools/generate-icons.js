// Générateur d'icônes PNG — Mascotte Aken (zéro dépendance)
// Rasterise la géométrie vectorielle de assets/mascot.svg : polygones + ellipses,
// scanline fill avec antialiasing 3×3, dégradé vertical Aken, tuile sombre
// arrondie, encodeur PNG RGBA (zlib natif de Node).
// Usage : node tools/generate-icons.js
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ASSETS = path.join(__dirname, '..', 'assets');

/* ═══ 1. Géométrie de la mascotte (unités du viewBox 240×240) ═══ */
const DARK = [10, 10, 10]; // yeux, visière, tuile de fond

const GRAD = [
  { t: 0.0, c: [255, 170, 0] },   // #FFAA00
  { t: 0.55, c: [255, 107, 0] },  // #FF6B00
  { t: 1.0, c: [255, 61, 0] }     // #FF3D00
];

function gradColor(t) {
  if (t <= 0) return GRAD[0].c;
  if (t >= 1) return GRAD[GRAD.length - 1].c;
  for (let i = 1; i < GRAD.length; i++) {
    if (t <= GRAD[i].t) {
      const a = GRAD[i - 1], b = GRAD[i];
      const k = (t - a.t) / (b.t - a.t || 1);
      return [
        a.c[0] + (b.c[0] - a.c[0]) * k,
        a.c[1] + (b.c[1] - a.c[1]) * k,
        a.c[2] + (b.c[2] - a.c[2]) * k
      ];
    }
  }
  return GRAD[GRAD.length - 1].c;
}

function ellipseToPoly(cx, cy, rx, ry, seg) {
  const pts = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}

/* Échantillonnage de cubiques de Bézier RELATIVES (commandes « c » du SVG)
   → polygones fidèles aux paths de mascot.svg */
function sampleCubics(start, segments, perCurve) {
  const pts = [];
  let cur = start;
  for (const seg of segments) {
    const [d1x, d1y, d2x, d2y, dex, dey] = seg;
    const c1 = [cur[0] + d1x, cur[1] + d1y];
    const c2 = [cur[0] + d2x, cur[1] + d2y];
    const end = [cur[0] + dex, cur[1] + dey];
    for (let i = 1; i <= perCurve; i++) {
      const t = i / perCurve, mt = 1 - t;
      const x = mt * mt * mt * cur[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * end[0];
      const y = mt * mt * mt * cur[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * end[1];
      pts.push([x, y]);
    }
    cur = end;
  }
  return pts;
}

/* Casque — path exact de mascot.svg : M120 32 c-51 0-84 32-84 76 … */
const HEAD = sampleCubics([120, 32], [
  [-51, 0, -84, 32, -84, 76],
  [0, 16, 5, 28, 14, 36],
  [6, 5, 14, 8, 24, 9],
  [14, 1, 30, -4, 46, -4],
  [16, 0, 32, 5, 46, 4],
  [10, -1, 18, -4, 24, -9],
  [9, -8, 14, -20, 14, -36],
  [0, -44, -33, -76, -84, -76]
], 28);

/* Visière-sourire — path exact : M50 150 c22 10 45 14 70 14 s… */
const VISOR = sampleCubics([50, 150], [
  [22, 10, 45, 14, 70, 14],
  [25, 0, 48, -4, 70, -14],
  [-4, 12, -13, 21, -25, 26],
  [-13, 6, -29, 9, -45, 9],
  [-16, 0, -32, -3, -45, -9],
  [-12, -5, -21, -14, -25, -26]
], 28);

const SHAPES = [
  { ellipse: [49, 55, 17, 16] },                     // antenne gauche
  { ellipse: [191, 55, 17, 16] },                    // antenne droite
  { poly: HEAD },                                    // casque
  { ellipse: [87, 108, 16, 18], dark: true },        // œil gauche
  { ellipse: [153, 108, 16, 18], dark: true },       // œil droit
  { poly: VISOR, dark: true },                       // visière
  { ellipse: [64, 206, 21, 20] },                    // pod gauche
  { ellipse: [176, 206, 21, 20] }                    // pod droit
];

function pointInPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function shapeHit(sh, ux, uy) {
  if (sh.ellipse) {
    const dx = (ux - sh.ellipse[0]) / sh.ellipse[2];
    const dy = (uy - sh.ellipse[1]) / sh.ellipse[3];
    return dx * dx + dy * dy <= 1;
  }
  return pointInPoly(ux, uy, sh.poly);
}

/* ═══ 2. Rasterisation (tuile sombre arrondie + mascotte dégradé) ═══ */
function rasterize(size, opts) {
  const padding = opts.padding !== undefined ? opts.padding : 0.12;
  const radiusRatio = opts.radiusRatio !== undefined ? opts.radiusRatio : 0.225;
  const SS = 3; // supersampling 3×3

  const buf = Buffer.alloc(size * size * 4, 0);
  const pad = Math.round(size * padding);
  const s = (size - pad * 2) / 240; // échelle mascotte
  const r = size * radiusRatio;

  const inTile = (px, py) => {
    if (r <= 0) return true; // plein cadre (maskable / apple-touch)
    const x0 = Math.min(Math.max(px, r), size - r);
    const y0 = Math.min(Math.max(py, r), size - r);
    const dx = px - x0, dy = py - y0;
    return dx * dx + dy * dy <= r * r;
  };

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      // Couverture de la tuile (antialiasing du coin arrondi)
      let tileCov = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          if (inTile(px + (sx + 0.5) / SS, py + (sy + 0.5) / SS)) tileCov++;
        }
      }
      if (tileCov === 0) continue;
      const tileA = tileCov / (SS * SS);

      // Couverture mascotte + couleur moyenne (dégradé vs éléments sombres)
      let cov = 0, darkCov = 0, gR = 0, gG = 0, gB = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = px + (sx + 0.5) / SS, fy = py + (sy + 0.5) / SS;
          if (!inTile(fx, fy)) continue;
          const ux = (fx - pad) / s, uy = (fy - pad) / s;
          if (ux < 0 || ux > 240 || uy < 0 || uy > 240) continue;
          let gradHit = false, darkHit = false;
          for (const sh of SHAPES) {
            if (!shapeHit(sh, ux, uy)) continue;
            if (sh.dark) darkHit = true; else gradHit = true;
          }
          if (gradHit || darkHit) {
            cov++;
            if (darkHit) darkCov++;
            const c = gradColor(uy / 240);
            gR += c[0]; gG += c[1]; gB += c[2];
          }
        }
      }

      const mascotA = cov / (SS * SS);
      let rC = DARK[0], gC = DARK[1], bC = DARK[2];
      if (cov > 0) {
        const darkA = darkCov / cov;
        const avgR = gR / cov, avgG = gG / cov, avgB = gB / cov;
        rC = avgR + (DARK[0] - avgR) * darkA;
        gC = avgG + (DARK[1] - avgG) * darkA;
        bC = avgB + (DARK[2] - avgB) * darkA;
        // composite mascotte (alpha) au-dessus de la tuile sombre
        rC = rC * mascotA + DARK[0] * (1 - mascotA);
        gC = gC * mascotA + DARK[1] * (1 - mascotA);
        bC = bC * mascotA + DARK[2] * (1 - mascotA);
      }

      const idx = (py * size + px) * 4;
      buf[idx] = Math.round(rC);
      buf[idx + 1] = Math.round(gC);
      buf[idx + 2] = Math.round(bC);
      buf[idx + 3] = Math.round(255 * tileA);
    }
  }
  return buf;
}

/* ═══ 3. Encodeur PNG RGBA (filtre 0 + zlib natif) ═══ */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePNG(rgba, size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // profondeur 8 bits
  ihdr[9] = 6;  // RGBA
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filtre None
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

/* ═══ 4. Déclinaisons ═══ */
const OUTPUTS = [
  { name: 'favoricon.png', size: 192, padding: 0.05, radiusRatio: 0.225 },  // favicon PNG + PWA any
  { name: 'pwa-192.png', size: 192, padding: 0.12, radiusRatio: 0.225 },
  { name: 'pwa-512.png', size: 512, padding: 0.12, radiusRatio: 0.225 },
  { name: 'pwa-maskable-512.png', size: 512, padding: 0.2, radiusRatio: 0 }, // zone sûre 80%, plein cadre
  { name: 'apple-touch-icon.png', size: 180, padding: 0.12, radiusRatio: 0 },// iOS arrondit lui-même
  { name: 'shortcut-devis.png', size: 96, padding: 0.12, radiusRatio: 0.225 },
  { name: 'shortcut-blog.png', size: 96, padding: 0.12, radiusRatio: 0.225 },
  { name: 'shortcut-contact.png', size: 96, padding: 0.12, radiusRatio: 0.225 }
];

module.exports = { SHAPES, shapeHit, pointInPoly, gradColor };

if (require.main === module) {
  for (const item of OUTPUTS) {
    const png = encodePNG(rasterize(item.size, item), item.size);
    fs.writeFileSync(path.join(ASSETS, item.name), png);
    console.log('✔', item.name, `${item.size}x${item.size}`, `(${(png.length / 1024).toFixed(1)} Ko)`);
  }

  console.log('\n✅ Icônes Aken générées dans assets/');
}
