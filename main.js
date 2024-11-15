require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Creates the main application window.
 * Loads the index.html page and opens the developer tools.
 * Closes the main window on the 'closed' event.
 */
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../renderer/preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    win.loadFile(path.join(__dirname, '../renderer/index.html'));
    win.webContents.openDevTools();

    win.on('closed', () => {
        app.quit();
    });
}

// Initializes the application when Electron is ready
app.whenReady().then(createWindow);

// Quits the application when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Recreates a window if the application is activated and no windows are open (for macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});