require('dotenv').config();


const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs')
const path = require('path');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,        // Replace with your actual client ID from Google Developer Console
    process.env.CLIENT_SECRET,    // Replace with your actual client secret from Google Developer Console
    process.env.REDIRECT_URI      // Replace with your redirect URI (e.g., http://localhost:3000/oauth2callback)
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',          // Offline access to get refresh token
    scope: ['https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'],  // Define the permissions you're requesting
});

console.log('Authorize this app by visiting this URL:', authUrl);
// This flag should be replaced with actual authentication logic
let auth = false;


/**
 * Creates the main application window.
 * If the user is not authenticated, an authentication window is also created.
 * The main window loads the index.html page and opens the developer tools.
 * The authentication window loads the auth.html page and is modal, blocking interaction with the main window.
 * Closes the main window on 'closed' event.
 */
function createWindow() {
    let win = new BrowserWindow({
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


    // this is where the auth window opens
    // the path to the auth window is '../renderer/auth.html'
    // opens a 'modal' window
    if (!auth) {
        let authWindow = new BrowserWindow({
            width: 400,
            height: 400,
            parent: win,
            modal: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            }
        });


        authWindow.loadFile(path.join(__dirname, '../renderer/auth.html'));
    }


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


// Recreates a window if the application is activated and no windows are open
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});




// Listens for 'mood-change' events from the renderer process
// Logs the mood change and sends a response back to the renderer
ipcMain.on('mood-change', (event, mood) => {
    console.log('Mood changed to:', mood);
    event.reply('mood-response', mood);
});










app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
