const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable GPU acceleration to prevent crashes
app.disableHardwareAcceleration();

function createWindow() {
    const win = new BrowserWindow({
        width: 720,
        height: 600,
        x: 0,                         // Position at the left edge of the screen
        y: 0,
        webPreferences: {
            preload: path.join(__dirname, 'renderer/preload.js'),
            contextIsolation: false, // Allows the use of require in renderer.js
            nodeIntegration: true, // Enables Node.js features
        },
    });

    win.loadFile(path.join(__dirname, 'renderer/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});