const { ipcRenderer } = reqire('electron');

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded!');
});

window.ipcRenderer = ipcRenderer;