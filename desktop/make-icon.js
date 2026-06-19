// Renders the Querious app icon (the ◧ mark on the violet→cyan gradient) with
// Electron and captures it to build/icon.png — electron-builder turns it into .icns.
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const ICON_HTML = `<!doctype html><html><body style="margin:0">
  <div style="width:1024px;height:1024px;display:grid;place-items:center;background:#0a0b14">
    <div style="width:760px;height:760px;border-radius:180px;background:linear-gradient(135deg,#7c5cff,#22d3ee);display:grid;place-items:center;box-shadow:0 60px 140px rgba(124,92,255,.55)">
      <div style="position:relative;width:360px;height:360px;border-radius:64px;border:34px solid #fff;box-sizing:border-box;overflow:hidden">
        <div style="position:absolute;left:0;top:0;bottom:0;width:50%;background:#fff"></div>
      </div>
    </div>
  </div>
</body></html>`;

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1024, height: 1024, show: true, frame: false, webPreferences: {} });
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(ICON_HTML));
  await new Promise(r => setTimeout(r, 400));
  let img = await win.webContents.capturePage();
  img = img.resize({ width: 1024, height: 1024 });
  fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'build', 'icon.png'), img.toPNG());
  console.log('[icon] wrote build/icon.png (' + img.getSize().width + 'px)');
  app.quit();
});
