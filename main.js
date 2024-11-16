const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Server } = require('socket.io');
const { createServer } = require('http');

// Disable GPU rendering
app.commandLine.appendSwitch('disable-gpu');
app.disableHardwareAcceleration();

// Create an HTTP server for WebSocket communication
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow connections from any origin
    },
});

// Function to create the main application window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer/preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Load the renderer's HTML file
    win.loadFile(path.join(__dirname, 'renderer/index.html'));

    // Uncomment for debugging during development
    // win.webContents.openDevTools();
}

// IPC handler for notifications
ipcMain.on('send-notification', (event, message) => {
    const notification = new BrowserWindow({
        width: 300,
        height: 100,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            contextIsolation: true,
        },
    });

    notification.loadURL(
        `data:text/html;charset=utf-8,
        <html>
            <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;background-color:white;font-family:Arial;">
                <h2>${message}</h2>
            </body>
        </html>`
    );

    setTimeout(() => notification.close(), 5000); // Close the notification after 5 seconds
});


// WebSocket integration for real-time data
io.on('connection', (socket) => {
    console.log('A client connected.');

    // Listen for Arduino data from the backend
    socket.on('arduino_data', (data) => {
        console.log('Received data from backend:', data);

        // Emit the data to the renderer process
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('arduino-data', data);
        });
    });

    // Receive threshold updates from the backend
    socket.on('update_threshold', (threshold) => {
        console.log('Received threshold update:', threshold);

        // Emit the threshold update to the renderer process
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('update-threshold', threshold);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected.');
    });
});

// Start the WebSocket server
app.whenReady().then(() => {
    httpServer.listen(5001, () => {
        console.log('WebSocket server listening on port 5001');
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Handle IPC notifications
ipcMain.on('send-notification', (event, message) => {
    const notification = new BrowserWindow({
        width: 300,
        height: 100,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            contextIsolation: true,
        },
    });

    notification.loadURL(
        `data:text/html;charset=utf-8,
        <html>
            <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;background-color:white;font-family:Arial;">
                <h2>${message}</h2>
            </body>
        </html>`
    );

    setTimeout(() => notification.close(), 5000); // Auto-close after 5 seconds
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
