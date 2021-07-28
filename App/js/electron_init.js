/*
	electron_init.js
	This is only a test
*/
const { app, BrowserWindow } = require('electron');
function createWindow(){
	const win = new BrowserWindow({
		width: 800,
		height: 600
	});
  	win.loadFile('App/index.htm');
};
app.on('window-all-closed', function(){
	if (process.platform !== 'darwin'){
		app.quit();
	};
})
app.on('ready', function () {
  createWindow();
});