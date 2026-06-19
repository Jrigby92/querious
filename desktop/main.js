const { app, BrowserWindow, shell } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'app');
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.wasm': 'application/wasm', '.json': 'application/json', '.zip': 'application/zip',
  '.whl': 'application/octet-stream', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.map': 'application/json'
};

// Serve the bundled app over loopback http so fetch()/WebAssembly behave like a
// normal web page (file:// blocks those). Only local, bundled files are served.
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      if (p === '/') p = '/index.html';
      const fp = path.normalize(path.join(ROOT, p));
      if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
      fs.readFile(fp, (err, data) => {
        if (err) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function createWindow(port) {
  const win = new BrowserWindow({
    width: 1240, height: 860, minWidth: 760, minHeight: 600,
    title: 'Querious',
    backgroundColor: '#0a0b14',
    webPreferences: { contextIsolation: true }
  });
  win.loadURL(`http://127.0.0.1:${port}/index.html`);
  win.webContents.on('did-finish-load', () => console.log('[querious] page loaded ok'));
  win.webContents.on('did-fail-load', (_e, code, desc) => console.error('[querious] load failed', code, desc));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });

  // Optional offline self-test: loads pandas inside Electron, prints result, quits.
  if (process.env.QUERIOUS_SELFTEST) {
    win.webContents.once('did-finish-load', async () => {
      try {
        const r = await win.webContents.executeJavaScript(
          '(async()=>{await ensurePandas();' +
          'const sql=(typeof db!=="undefined"&&db.exec("SELECT COUNT(*) FROM orders")[0].values[0][0]);' +
          'const py=runOne("2+2",{kind:"expr"});' +
          'const pd=runPd("orders[\'amount\'].sum()",false);' +
          'return JSON.stringify({sql, py:py.val, pyOk:py.ok, pdOk:pd.ok});})()'
        );
        console.log('[querious] SELFTEST ' + r);
      } catch (e) { console.error('[querious] SELFTEST error', e); }
      app.quit();
    });
  }
}

app.whenReady().then(async () => {
  const port = await startServer();
  createWindow(port);
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(port); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
