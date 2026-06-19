/* Prepares desktop/app/ from the shared web app (../index.html).
   Stage 1: copy as-is (still uses CDN for the WASM runtimes).
   Stage 2 will rewrite the CDN <script>/locateFile/indexURL URLs to bundled
   ./vendor/ paths here so the app works fully offline. */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'index.html');
const outDir = path.join(__dirname, 'app');
fs.mkdirSync(outDir, { recursive: true });

let html = fs.readFileSync(src, 'utf8');

// --- Offline: rewrite CDN URLs → bundled ./vendor/ paths ---
// Each prefix replace fixes both the <script src> and the locateFile/indexURL templates.
const rewrites = [
  ['https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/', './vendor/sqljs/'],
  ['https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',   './vendor/pyodide/']
];
let n = 0;
for (const [from, to] of rewrites) {
  const before = html.length;
  html = html.split(from).join(to);
  n += (before !== html.length) ? 1 : 0;
}
// Safety net: fail loudly if any jsdelivr URL slipped through (would break offline).
const leftover = (html.match(/cdn\.jsdelivr\.net/g) || []).length;
if (leftover) console.warn('[build] WARNING: ' + leftover + ' jsdelivr URL(s) still present — offline will break');

fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('[build] wrote app/index.html (' + html.length + ' bytes), rewrote ' + n + ' CDN prefixes, ' + leftover + ' jsdelivr refs left');
