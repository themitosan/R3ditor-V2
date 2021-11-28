/*
    *******************************************************************************
    R3ditor V2 - main.js
    By TheMitoSan

    This file is responsible to start R3V2 on Electron engine.
    This file was created based on electron-quick-start project
    *******************************************************************************
*/
const {app, BrowserWindow} = require('electron'), path = require('path');
// Create R3V2 window
function R3_createMainWindow(){
    const R3_mainWindow = new BrowserWindow({
        width: 1316,
        height: 720,
        minWidth: 1316,
        minHeight: 720,
        darkTheme: true,
        title: 'R3ditor V2 - Please wait...',
        icon: __dirname + '/App/img/logo_ico.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    R3_mainWindow.loadFile('App/index.htm');
    R3_mainWindow.setMenuBarVisibility(false);
    // R3_mainWindow.webContents.openDevTools();
};
// Load main window
app.whenReady().then(() => {
    R3_createMainWindow();
    app.on('activate', function(){
        if (BrowserWindow.getAllWindows().length === 0){
            R3_createMainWindow();
        };
    });
});
app.on('window-all-closed', function(){
    if (process.platform !== 'darwin'){
        app.quit();
    };
});