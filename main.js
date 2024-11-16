const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Server } = require('socket.io');
const { createServer } = require('http');

// Disable GPU rendering for compatibility
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
            nodeIntegration: false, // Prevent Node.js access in renderer
            contextIsolation: true, // Enforce secure isolation
        },
    });

    win.loadFile(path.join(__dirname, 'renderer/index.html'));
}

// Handle WebSocket events for real-time data
io.on('connection', (socket) => {
    console.log('A client connected to the WebSocket server.');

    // Receive Arduino data from the backend and send it to the renderer
    socket.on('arduino_data', (data) => {
        console.log('Received data from backend:', data);
        BrowserWindow.getAllWindows().forEach((win) => {
            win.webContents.send('arduino-data', data);
        });
    });

    // Listen for threshold updates
    socket.on('update_threshold', (threshold) => {
        console.log('Received threshold update:', threshold);
        BrowserWindow.getAllWindows().forEach((win) => {
            win.webContents.send('update-threshold', threshold);
        });
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected from the WebSocket server.');
    });
});

// Start the WebSocket server when the app is ready
app.whenReady().then(() => {
    httpServer.listen(5001, () => {
        console.log('WebSocket server is running on port 5001.');
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});