// Script de génération des icônes Aken basées fidèlement sur assets/mascot.svg
// Délègue à tools/build_mascot_assets.py
const { spawnSync } = require('child_process');
const path = require('path');

const pyScript = path.join(__dirname, 'build_mascot_assets.py');
const res = spawnSync('python', [pyScript], { stdio: 'inherit' });
if (res.error) {
  console.error("Erreur d'exécution de python tools/build_mascot_assets.py :", res.error);
  process.exit(1);
}
process.exit(res.status || 0);
