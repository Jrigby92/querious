/* Prepares desktop/app/ from the shared web app (../index.html) for the offline
   desktop (Electron) and mobile (Capacitor) builds:
   - strips the PWA tags (manifest / service-worker / icon links) that would 404
     in a native shell (the native app bundles everything),
   - ensures the runtime URLs are local ./vendor/ paths (the web build already is),
   - copies the bundled runtimes (../vendor) into app/vendor. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(__dirname, 'app');
fs.mkdirSync(outDir, { recursive: true });

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Strip the PWA block (manifest + apple/icon links + SW registration script).
html = html.replace(/<!-- PWA: installable \+ offline -->[\s\S]*?serviceWorker[\s\S]*?<\/script>\s*/, '');

// Safety net: the runtimes must be local. The web index.html already uses
// ./vendor/, but rewrite any stray CDN URLs just in case.
if (/cdn\.jsdelivr\.net/.test(html)) {
  html = html.split('https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/').join('./vendor/sqljs/')
             .split('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/').join('./vendor/pyodide/');
}
const leftover = (html.match(/cdn\.jsdelivr\.net/g) || []).length;
if (leftover) console.warn('[build] WARNING: ' + leftover + ' jsdelivr URL(s) still present');
const pwaLeft = /manifest\.webmanifest|register\('sw\.js'\)/.test(html);
if (pwaLeft) console.warn('[build] WARNING: PWA tags not fully stripped');

fs.writeFileSync(path.join(outDir, 'index.html'), html);
fs.cpSync(path.join(root, 'vendor'), path.join(outDir, 'vendor'), { recursive: true });

console.log('[build] app/index.html (' + html.length + ' bytes) + vendor bundled; jsdelivr:' + leftover + ' pwaTagsLeft:' + pwaLeft);
