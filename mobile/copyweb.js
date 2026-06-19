/* Populates mobile/www from the fully-offline desktop build (../desktop/app),
   so the iOS/Android app bundles SQL + Python + pandas and works offline. */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'desktop', 'app');
const outDir = path.join(__dirname, 'www');

if (!fs.existsSync(path.join(srcDir, 'index.html')) || !fs.existsSync(path.join(srcDir, 'vendor'))) {
  console.error('Missing ../desktop/app (with vendor/). Build the offline web assets first:');
  console.error('  cd ../desktop && npm run build      # writes app/index.html');
  console.error('  (and ensure app/vendor/ exists — the bundled sql.js + pyodide runtimes)');
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.cpSync(srcDir, outDir, { recursive: true });
console.log('[mobile] copied desktop/app -> www (offline web core)');
