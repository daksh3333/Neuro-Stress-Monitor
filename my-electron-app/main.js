const { app, BrowserWindow } = require('electron');
const path = require('path');

// Create a new window when Electron app is ready
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // Enables Node.js in renderer process
      contextIsolation: false // Disable contextIsolation for easier dev (optional)
    }
  });

  // Load the React app's build folder
  win.loadURL('http://localhost:3000'); // For development (React runs on 3000 by default)

  // Uncomment below to open devtools by default
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recreate window on macOS if clicked on dock
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
