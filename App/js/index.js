/*
	R3ditor V2 - index.js
	Agora vai mah!
*/
// Internal Vars
var R3_APP_START = false, APP_ON_BOOT = true, APP_CAN_START = true, R3_ELECTRON, APP_PATH, APP_ASSETS, APP_EXEC_PATH, APP_TOOLS, APP_TITLE, APP_IS_32 = false,
	APP_ONLINE, ORIGINAL_FILENAME, ORIGINAL_APP_PATH, APP_REQUIRE_SUCESS, APP_ENABLE_MOD = false,
	// Mod Vars
	R3_MOD_PATH, R3_MOD_NAME,
	// External Modules
	APP_FS, APP_MEMJS, APP_GUI, DiscordRPC, APP_REQUIRE_PATH,
	// Executable Vars
	EXTERNAL_APP_PID, EXTERNAL_APP_EXITCODE = 0, EXTERNAL_APP_RUNNING = false,
	// Game Vars
	R3_RE3_CANRUN = false, R3_MERCE_CANRUN = R3_RE3_CANRUN, RE3_PID, RE3_RUNNING = R3_RE3_CANRUN,
	// Download Vars
	R3_FILE_DOWNLOAD_COMPLETE = false, R3_FILE_DOWNLOAD_STATUSCODE = 0, R3_FILE_DOWNLOAD_PERCENT = 0,
	// Web Mode
	R3_WEBMODE = false, R3_WEB_FILE_BRIDGE = '', 
	// Web Engines
	R3_WEB_IS_SAFARI   = false, // Apple Safari
	R3_WEB_IS_FOX 	   = false, // Mozilla Firefox
	R3_WEB_IS_IE 	   = false, // Internet Explorer
	R3_WEB_IS_ANDROID  = false, // Google Chrome (Android)
	R3_WEB_IS_PS4 	   = false, // PS4 Browser
	R3_WEB_IS_NW 	   = false, // NW.js
	R3_WEB_IS_ELECTRON = false, // Electron
	// Log window text
	R3_SYSTEM_LOG_TEXT = '',
	// Backup Manager
	R3_SYSTEM_BACKUP_LIST = {},
	// Temp Coords
	TEMP_X_Pos, TEMP_Y_Pos, TEMP_Z_Pos, TEMP_R_Pos, TEMP_zIndex;
/*
	Onload
*/
window.addEventListener('DOMContentLoaded', function(evt){
	try {
		if (R3_APP_START === false){
			R3_LOAD();
		};
	} catch (err) {
		console.error(err + '\nEvent: ' + evt);
		R3_DESIGN_CRITIAL_ERROR(err);
	};
});
/*
	Functions
*/
// Require modules
function R3_INIT_REQUIRE(){
	if (R3_WEBMODE === false){
		var eReason = '',
			engineVersion, 					   // nwjs, Electron
			engineArch = process.arch, 		   // x86 / x64
			enginePlatform = process.platform; // win32, darwin or linux 
		/*
			Detect engine (nwjs, electron and etc.)
		*/
		// NW.js [Node-Webkit]
		if (process.versions['node-webkit'] !== undefined){
			engineVersion = process.versions['node-webkit'];
			R3_WEB_IS_NW = true;
		};
		// Electron
		if (process.versions['electron'] !== undefined){
			engineVersion = process.versions['electron'];
			R3_WEB_IS_ELECTRON = true;
		};
		/*
			Start Require process
		*/
		if (engineVersion !== undefined){
			// Init MemoryJS
			if (engineArch === 'x64' && enginePlatform === 'win32'){
				try {
					APP_MEMJS = require('memoryjs');
					MEM_JS_requreSucess = true;
				} catch (err) {
					console.error('Unable to require MemoryJS!\n' + err);
				};
			};
			DiscordRPC = require('discord-rpc');
			APP_REQUIRE_PATH = require('path');
			ORIGINAL_APP_PATH = process.cwd();
			APP_ONLINE = navigator.onLine;
			APP_PATH = ORIGINAL_APP_PATH;
			APP_FS = require('fs-extra');
			// NW.gui
			if (R3_WEB_IS_NW === true){
				APP_GUI = require('nw.gui');
				APP_GUI.Screen.Init();
				R3_SYSTEM_availableMonitors = Object.keys(APP_GUI.Screen.screens).length;
			};
			// Require Electron
			if (R3_WEB_IS_ELECTRON === true){
				R3_ELECTRON = require('electron');
			};
			/*
				Other OS
			*/
			// macOS (Tested on Mojave)
			if (process.platform === 'darwin'){
				APP_PATH = process.env.HOME + '/Documents/R3V2';
				APP_ASSETS = process.cwd();
			};
			// Windows [Tested on 7, 8, 8.1, 10 and 11 Preview]
			if (process.platform === 'win32'){
				var tempPath = process.env.HOMEDRIVE + process.env.HOMEPATH + '/Documents';
				/*
					Fix if documents does not exists (attempt to fix 3lric boot issue)
					This will redirect the APP_PATH to executable dir
				*/
				if (APP_FS.existsSync(tempPath) !== true){
					tempPath = R3_fixPath(APP_REQUIRE_PATH.dirname(process.execPath)) + '/R3V2';
				};
				APP_EXEC_PATH = R3_fixPath(ORIGINAL_APP_PATH);
				APP_TOOLS = R3_fixPath(APP_EXEC_PATH + '/Tools');
				APP_PATH = R3_fixPath(tempPath) + '/R3V2';
			} else {
				APP_useImageFix = true;
			};
			// Linux (Tested on Ubuntu)
			if (process.platform === 'linux'){
				APP_PATH = ORIGINAL_APP_PATH;
			};
			/*
				End
			*/
			APP_REQUIRE_SUCESS = true;
		} else {
			/*
				Web Mode
			*/
			try {
				R3_WEB_checkBrowser();
				// Try to port some nw functions to web
				APP_FS = {
					readFileSync: function(path, options){
						if (path !== undefined && path !== ''){
							var fReader = new FileReader;
							if (options === undefined){
								options = 'hex';
							}
							/*
								Read Modes
								Original Code: https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
							*/
							// Hex
							if (options === 'hex'){
								fReader.readAsArrayBuffer(path);
								fReader.onload = function(){
									R3_WEB_FILE_BRIDGE = Array.prototype.map.call(new Uint8Array(fReader.result), function(x){
										return ('00' + x.toString(16)).slice(-2);
									}).join('');
								};
							};
							// Text
							if (options === 'utf-8'){
								fReader.readAsText(path);
								fReader.onload = function(){
									R3_WEB_FILE_BRIDGE = fReader.result;
								};
							};
							// End
							fReader.onerror = function(){
								R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to read file! <br>Reason: ' + fReader.error);
								console.error('APP_FS ERROR!\n' + fReader.error);
								R3_SYSTEM_ALERT('ERROR: \n' + fReader.error);
							};
						};
					},
					writeFileSync: function(path, fData, mode){
						R3_FILE_SAVE(R3_getFileName(path.name) + '.' + R3_getFileExtension(path.name), fData, mode, R3_getFileExtension(path.name));
					}
				};
			} catch (err) {
				R3_DESIGN_CRITIAL_ERROR(err);
			};
		};
	};
};
// Detect browser on web-mode
function R3_WEB_checkBrowser(){
	if (R3_WEBMODE === true){
		var uArgent = navigator.userAgent;
		// Check if navigator is Apple Safari / PS4
		if (uArgent.indexOf('Safari') !== -1 && uArgent.indexOf('Chrome') === -1){
			if (uArgent.indexOf('PlayStation 4') === -1){
				R3_WEB_IS_SAFARI = true;
			} else {
				R3_WEB_IS_PS4 = true;
			};
		};
		// Mozilla Firefox
		if (uArgent.indexOf('Firefox/') !== -1 && uArgent.indexOf('Chrome') === -1){
			R3_WEB_IS_FOX = true;
		};
		// Interet Explorer (IE11)
		if (uArgent.indexOf('.NET') !== -1 && uArgent.indexOf('Chrome') === -1){
			R3_WEB_IS_IE = true;
		};
		// Android Devices
		if (uArgent.indexOf('Android') !== -1){
			R3_WEB_IS_ANDROID = true;
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: You are using R3ditor V2 on Android! This isn\'t recommended, since screen size aren\'t great for this tool display.');
		};
	};
};
// Start Process
function R3_LOAD(){
	try {
		R3_APP_START = true;
		var startInWebMode = false, nwArgs = [], nwFlavor = '';
		// Drity code for webmode
		if (typeof nw !== 'undefined'){
			nwArgs = nw.App.argv;
			if (nwArgs.indexOf('--webmode') !== -1){
				startInWebMode = true;
			};
		};
		// Init modules
		if (typeof process !== 'undefined' && startInWebMode === false){
			R3_WEBMODE = false;
			R3_INIT_REQUIRE();
		} else {
			INT_VERSION = INT_VERSION + ' [WEB]';
			APP_TITLE = APP_TITLE + ' [WEB]';
			R3_WEBMODE = true;
			R3_INIT_REQUIRE();
		};
		if (R3_WEBMODE === true){
			R3_INIT_DATABASE_GENERATE();
			R3_LOAD_SETTINGS();
			R3_DESIGN_ADJUST();
		} else {
			if (APP_REQUIRE_SUCESS === true){
				// NW Flavor
				if (R3_WEB_IS_NW === true){
					nwFlavor = ' [' + process.versions['nw-flavor'] + ']';
				};
				INT_VERSION = INT_VERSION + nwFlavor;
				try {
					R3_INIT_DATABASE_GENERATE();
					R3_LOAD_CHECKFILES();
					R3_LOAD_SETTINGS();
					R3_DESIGN_ADJUST();
				} catch (err) {
					R3_DESIGN_CRITIAL_ERROR(err);
					console.error(err);
				};
			};
		};
		// End
		APP_TITLE = 'R3ditor V2 - Ver. ' + INT_VERSION;
		R3_SYSTEM_LOG('log', APP_TITLE);
		// Log args
		if (nwArgs.length !== 0){
			R3_SYSTEM_LOG('log', 'Run Args: <font class="user-can-select">' + nwArgs.toString().replace(RegExp(',', 'gi'), ' ') + '</font>');
		};
		R3_SYSTEM_LOG('separator');
		// If web, log navigator.userArgent
		if (R3_WEBMODE === true){
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (Webmode) - User-Argent: <font class="user-can-select">' + navigator.userAgent + '</font>');
			R3_SYSTEM_LOG('separator');
			R3_SYSTEM_LOG('log', atob(special_day_03));
			R3_SYSTEM_LOG('separator');
		} else {
			// eNGE Start
			eNGE_INIT();
		};
		document.title = APP_TITLE;
		console.info(APP_TITLE);
	} catch (err) {
		console.error(err);
		R3_DESIGN_CRITIAL_ERROR(err);
	};
};
/*
	Utils
*/
// Reload App
function R3_RELOAD(){
	R3_DISC_clearActivity();
	if (RE3_RUNNING === true){
		R3_killExternalSoftware(RE3_PID);
	};
	if (R3_WEBMODE !== true){
		localStorage.clear();
		sessionStorage.clear();
		chrome.runtime.reload();
	} else {
		location.reload(true);
	};
};
/*
	Messages
*/
// WIP Placeholder
function R3_WIP(){
	R3_SYSTEM_ALERT('TheMitoSan Says - THIS IS WIP! #Sorry');
	R3_SYSTEM_LOG('warn', 'TheMitoSan Says - THIS IS WIP! #Sorry');
};
// R3 WEB Warn
function R3_WEBWARN(){
	R3_SYSTEM_ALERT('WARN: This function is only available on desktop version.');
	R3_SYSTEM_LOG('warn', 'WARN: This function is only available on desktop version.');
};
/*
	External Software
*/
// Run Executable
function R3_runExec(exe, args, mode, newFilePath){
	if (R3_WEBMODE === false){
		if (process.platform === 'win32'){
			/*
				Modes:
				0: Use executable path as chdir
				1: Use Internal assets path as chdir
				2: Don't set chdir
				3: Set custom chdir
			*/
			if (mode === 0){
				process.chdir(R3_getFilePath(exe));
			};
			if (mode === 1){
				process.chdir(R3_MOD_PATH);
				console.info('External Executable: Running ' + exe + ' with chdir in ' + R3_MOD_PATH);
			};
			if (mode === 2){
				console.info('INFO - Skipping chdir...');
			};
			if (mode === 3){
				process.chdir(R3_getFilePath(newFilePath));
				console.info('External Executable: Running ' + exe + ' with chdir in ' + R3_getFilePath(newFilePath));
			};
			if (args === undefined || args === '' || args === null){
				args = [''];
			};
			RE3_PID = 0;
			const cProcess = require('child_process'),
				  PROCESS = cProcess.spawn(exe, args);
			EXTERNAL_APP_RUNNING = true;
			if (mode !== 0){
				RE3_PID = PROCESS.pid;
			};
			PROCESS.stdout.on('data', function(data){
				console.info(data.toString());
				R3_SYSTEM_LOG('log', data.toString());
			});
			PROCESS.stderr.on('data', function(data){
				console.info(data.toString());
				R3_SYSTEM_LOG('log', data.toString());
			});
			PROCESS.on('close', function(code){
				R3_SYSTEM_LOG('separator');
				EXTERNAL_APP_RUNNING = false;
				process.chdir(ORIGINAL_APP_PATH);
				if (RE3_RUNNING !== false){
					RE3_RUNNING = false;
					R3_LIVESTATUS_CLOSE_BAR();
					clearInterval(MEM_JS_updatePosTimer);
					if (parseInt(code) < 2){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: The game closed with code <font class="user-can-select">' + code + '</font>');
					} else {
						R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: The game closed with code <font class="user-can-select">' + code + '</font>!');
						R3_DESIGN_MINIWINDOW_OPEN(0);
					};
				} else {
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: The application closed with code <font class="user-can-select">' + code + '</font>');
				};
				return code;
			});
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: You can\'t run external software in non-windows systems!');
		};
	};
};
// Kill Process
function R3_killExternalSoftware(processID){
	if (R3_WEBMODE === false){
		try {
			if (processID !== '' && processID !== undefined && processID !== null){
				var PID = parseInt(processID);
				process.kill(PID);
			} else {
				if (EXTERNAL_APP_PID !== 0 && EXTERNAL_APP_PID !== undefined){
					process.kill(EXTERNAL_APP_PID);
				};
			};
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to kill process ' + processID + '! <br>Details: ' + err);
		};
	};
};
// Open file in Hex Editor
function R3_SYSTEM_openInHex(){
	if (R3_WEBMODE === false){
		if (APP_FS.existsSync(R3_HEX_PATH) !== false && APP_FS.existsSync(ORIGINAL_FILENAME) !== false){
			R3_runExec(R3_HEX_PATH, [ORIGINAL_FILENAME]);
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to open file in hex, since the Hex Viewer or file was not found!');
		};
	} else {
		R3_WEBWARN();
	};
};
// Run Games 
function R3_runGame(mode){
	if (R3_WEBMODE === false && R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === false && R3_UPDATER_RUNNING === false){
		if (APP_FS.existsSync(R3_SETTINGS.R3_RE3_PATH) === true){
			if (mode === 0 && R3_RE3_CANRUN === true){
				R3_MEMJS.seekProcess();
				if (PROCESS_OBJ !== undefined){
					R3_LIVESTATUS_OPEN_BAR();
				} else {
					R3_runExec(R3_SETTINGS.R3_RE3_PATH, undefined, 0);
				};
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (Game) Running Resident Evil 3...');
			};
			if (mode === 1 && R3_MERCE_CANRUN === true){
				R3_runExec(R3_SETTINGS.R3_MERCE_PATH, undefined, 0);
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (Game) Running Mercenaries');
			};
			if (mode === 2 && R3_RE3_CANRUN === true){
				R3_MEMJS.seekProcess();
				if (R3_MEMJS_PROCESS_OBJ !== undefined){
					R3_LIVESTATUS_OPEN_BAR();
				} else {
					R3_runExec(R3_RE3_MOD_PATH, undefined, 1);
				};
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (Game) Running Resident Evil 3 (Mod)');
			}
			if (mode === 3 && R3_MERCE_CANRUN === true){
				R3_runExec(R3_MERCE_PATH, undefined, 1);
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (Game) Running Mercenaries (Mod)');
			};
			// 32-bit check
			if (APP_IS_32 !== true && MEM_JS_requreSucess === true && R3_MERCE_CANRUN === true && R3_RE3_CANRUN === true){
				if (mode === 0 || mode === 2){
					R3_MEMJS.seekProcess();
					R3_LIVESTATUS_OPEN_BAR();
				};
			};
		} else {
			R3_SYSTEM_LOG('error', 'ERROR - Unable to start game!\nReason: The file was not found! (404)');
		};
	} else {
		if (R3_WEBMODE === true){
			R3_WEBWARN();
		};
	};
};
/*
	Log functions
*/
function R3_SYSTEM_SAVE_LOG(){
	if (R3_SYSTEM_LOG_TEXT !== ''){
		R3_FILE_SAVE('R3V2_LOG.log', R3_SYSTEM_LOG_TEXT, 'utf-8', '.log', function(finalFile){
			R3_SYSTEM_LOG('separator');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Save complete!');
			if (R3_WEBMODE === false){
				R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + finalFile + '</font>');
			};
		});
	};
};
/*
	File Manager functions
*/
// Load files
function R3_FILE_LOAD(extension, functionEval, returnFile, readMode, skipAppFs){
	if (functionEval !== undefined){
		if (extension === ''){
			extension = '.*';
		};
		if (readMode === undefined){
			readMode = 'hex';
		};
		R3_WEB_FILE_BRIDGE = '';
		document.getElementById('R3_FILE_LOAD_DOM').value = '';
		document.getElementById('R3_FILE_LOAD_DOM').files = null;
		document.getElementById('R3_FILE_LOAD_DOM').accept = extension;
		TMS.triggerClick('R3_FILE_LOAD_DOM');
		document.getElementById('R3_FILE_LOAD_DOM').onchange = function(){
			var hexFile, cFile = document.getElementById('R3_FILE_LOAD_DOM').files[0],
				fPath = cFile.path, loaderInterval;
			if (R3_WEBMODE === true){
				fPath = cFile;
			};
			if (skipAppFs === false || skipAppFs === undefined){
				hexFile = APP_FS.readFileSync(fPath, readMode);
			} else {
				hexFile = null;
			};
			loaderInterval = setInterval(function(){
					if (hexFile !== undefined && hexFile !== ''){
						if (returnFile !== true){
							if (cFile !== undefined){
								if (R3_WEBMODE === false){
									fPath = R3_fixPath(cFile.path.toString());
								} else {
									fPath = cFile;
								};
								functionEval(fPath, hexFile);
							};
						} else {
							functionEval(document.getElementById('R3_FILE_LOAD_DOM').files[0], hexFile);
						};
						clearInterval(loaderInterval);
					} else {
						console.info('Waiting APP_FS...');
						if (R3_WEBMODE === true){
							hexFile = R3_WEB_FILE_BRIDGE;
						};
					};
				}, 100);
		};
	};
};
// Save files
function R3_FILE_SAVE(filename, content, mode, ext, execNext){
	if (R3_WEBMODE === false){
		// Mode: utf-8, hex...
		var extension = '', location;
		if (ext !== undefined && ext !== ''){
			extension = ext;
		};
		document.getElementById('R3_FILE_SAVE_DOM').nwsaveas = filename;
		document.getElementById('R3_FILE_SAVE_DOM').accept = '.' + extension.replace('.', '');
		document.getElementById('R3_FILE_SAVE_DOM').onchange = function(){
			location = document.getElementById('R3_FILE_SAVE_DOM').value;
			if (location.replace(filename, '') !== ''){
				try {
					APP_FS.writeFileSync(location, content, mode);
				} catch (err) {
					R3_SYSTEM_LOG('error', 'ERROR - Unable to save file!\nReason: ' + err);
				};
			};
			document.getElementById('R3_FILE_SAVE_DOM').value = '';
			document.getElementById('R3_FILE_SAVE_DOM').accept = '';
			if (execNext !== undefined){
				execNext(location);
			};
		};
		TMS.triggerClick('R3_FILE_SAVE_DOM');
	} else {
		/*
			Original Code
			https://stackoverflow.com/questions/25354313/saving-a-uint8array-to-a-binary-file
			https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
		*/
		var downloadBlob, downloadURL, bType = 'application/octet-stream', convertHexFunction = function(hexString){
  			return new Uint8Array(hexString.match(/.{1,2}/g).map(function(byte){
  				return parseInt(byte, 16)
  			}));
  		};
		downloadBlob = function(data, fileName, mimeType){
			var blob, url;
			blob = new Blob([data], {
				type: mimeType
			});
			url = window.URL.createObjectURL(blob);
			downloadURL(url, fileName);
			setTimeout(function(){
				return window.URL.revokeObjectURL(url);
			}, 1000);
		};
		downloadURL = function(data, fileName){
			var a;
			a = document.createElement('a');
			a.href = data;
			a.download = fileName;
			document.body.appendChild(a);
			a.style = 'display: none';
			a.click();
			a.remove();
		};
		if (mode === 'utf-8'){
			bType = 'text/plain';
			downloadBlob(content, filename, bType);
		} else {
			downloadBlob(convertHexFunction(content), filename, bType);
		};
		if (execNext !== undefined){
			execNext(location);
		};
	};
};
// Download Files
function R3_FILE_DOWNLOAD(url, downloadFileName, execNext){
	if (R3_WEBMODE === false){
		var R3_FILE_DOWNLOAD_PG = R3_FILE_DOWNLOAD_LENGTH = R3_FILE_DOWNLOAD_PERCENT = 0, R3_FILE_DOWNLOAD_COMPLETE = false;
		if (APP_FS.existsSync(downloadFileName) === true){
			APP_FS.unlinkSync(downloadFileName);
		};
		const http = require('https'),
			file = APP_FS.createWriteStream(downloadFileName),
			request = http.get(url, function(response){
				response.pipe(file);
				response.on('data', function(chunk){
					R3_FILE_DOWNLOAD_STATUSCODE = response.statusCode;
					R3_FILE_DOWNLOAD_PG = R3_FILE_DOWNLOAD_PG + parseInt(chunk.length);
					R3_FILE_DOWNLOAD_LENGTH = parseInt(response.headers['content-length']);
					R3_FILE_DOWNLOAD_PERCENT = R3_parsePercentage(R3_FILE_DOWNLOAD_PG, R3_FILE_DOWNLOAD_LENGTH);
				});
				file.on('finish', function(){
					R3_FILE_DOWNLOAD_COMPLETE = true;
					R3_FILE_DOWNLOAD_STATUSCODE = response.statusCode;
					if (R3_FILE_DOWNLOAD_STATUSCODE === 200){
						console.info('FILE - Download OK!\nStatus Code: ' + R3_FILE_DOWNLOAD_STATUSCODE);
					} else {
						console.warn('FILE - Download Failed!\nStatus Code: ' + R3_FILE_DOWNLOAD_STATUSCODE);
					};
					if (execNext !== undefined){
						execNext();
					};
				});
			});
	};
};
// Select Path
function R3_FOLDER_SELECT(functionEval){
	if (R3_WEBMODE === false){
		if (functionEval !== undefined){
			TMS.triggerClick('R3_FOLDER_LOAD_DOM');
			document.getElementById('R3_FOLDER_LOAD_DOM').onchange = function(){
				var cFile = document.getElementById('R3_FOLDER_LOAD_DOM').files[0];
				if (cFile.path !== null && cFile.path !== undefined && cFile.path !== ''){
					functionEval(R3_fixPath(cFile.path));
					document.getElementById('R3_FOLDER_LOAD_DOM').value = '';
					document.getElementById('R3_FOLDER_LOAD_DOM').accept = '';
				};
			};
		};
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: This function is not available on web mode.');
	};
};
/*
	Extra parsers

	Get file name
	Original Code: https://stackoverflow.com/questions/857618/javascript-how-to-extract-filename-from-a-file-input-control
*/
function R3_getFileName(filePath){
	var resFileName = '';
	if (filePath !== '' && filePath !== undefined){
		if (filePath.indexOf('(') !== -1){
			var tempTxt = filePath.replace(/^(.*[/\\])?/, '').replace(/(\.[^.]*)$/, '');
			res = tempTxt.slice(0, tempTxt.indexOf('('));
		} else {
			res = filePath.replace(/^(.*[/\\])?/, '').replace(/(\.[^.]*)$/, '');
		};
	};
	return res;
};
// Get File Extension
function R3_getFileExtension(file){
	var res = '';
	if (file !== '' && file !== undefined){
		res = file.split('.').pop();
	};
	return res;
};
// Format Hex values to string properly
function R3_solveHEX(hex){
	var res = '';
	if (hex !== '' && hex !== undefined){
		res = hex.replace(new RegExp(' ', 'g'), '').toLowerCase();
	};
	return res;
};
// Get file name
function R3_getFilePath(fileName){
	var res = '';
	if (fileName !== undefined && fileName !== ''){
		res = R3_fixPath(APP_REQUIRE_PATH.dirname(fileName));
	};
	return res;
};
// Process In-Game Vars
function R3_processBIO3Vars(hex){
	if (hex !== undefined && hex !== ''){
		if (hex.length === 4){
			var finalNumber = 0, first = parseInt(hex.slice(0, 2), 16), second = parseInt(hex.slice(2, 4), 16);
			while(second !== 0){
				finalNumber = finalNumber + 255;
				finalNumber++;
				second--;
			};
			while (first !== 0){
				finalNumber++;
				first--;
			};
			return finalNumber;
		};
	} else {
		return 0;
	};
};
// Parse Percentage
function R3_parsePercentage(current, maximum){
	var res = 0;
	if (current !== undefined && maximum !== undefined && current !== '' && maximum !== ''){
		res = Math.floor((current / maximum) * 100);
	};
	return res;
};
// Fix Path Size
function R3_fixPathSize(path, limit){
	if (path !== undefined && path !== ''){
		if (path.length < 50){
			return path;
		} else {
			return '...' + path.slice(parseInt(path.length - limit), path.length);
		};
	} else {
		return '';
	};
};
// Fix path
function R3_fixPath(path){
	var res = '';
	// If loading settings
	if (R3_SETTINGS_LOADING === true && path === ''){
		res = 'Undefined';
	};
	if (path !== undefined && path !== ''){
		res = path.replace(new RegExp('\\\\', 'gi'), '/');
	};
	return res;
};
// Get number from hex (Using Endian)
function R3_getPosFromHex(hex){
	if (hex !== undefined && hex !== ''){
		return (parseInt(R3_parseEndian(hex), 16) * 2);
	};
};
// Get number from hex (Without Endian)
function R3_parseHexLengthToString(hex){
	if (hex !== undefined && hex !== ''){
		return (parseInt(hex, 16) * 2);
	};
};
// Parse string from Endian
function R3_parseEndian(str){
	var final = '';
	if (str !== undefined && str !== ''){
		final = str.toString().match(/.{2,2}/g).reverse().toString().replace(RegExp(',', 'gi'), '');
	};
	return final;
};
// Get file size
function R3_getFileSize(filePath, mode){
	if (filePath !== undefined && filePath !== '' && R3_WEBMODE === false){
		var read = APP_FS.statSync(filePath), fsize = read.size, res = 0;
		// Bytes
		if (mode === 0 || mode === undefined){
			res = read.size;
		};
		// In KB
		if (mode === 1){
			res = parseInt(read.size / 1024);
		};
		// In MB
		if (mode === 2){
			res = read.size / 1000000.0;
		};
		return res;
	};
};
// Get all indexes of string in another string
function R3_getAllIndexes(arr, val){
	if (arr !== null && val !== null || arr !== undefined && val !== undefined){
    	var idx = [], i = -1;
    	while ((i = arr.indexOf(val, i + 1)) != -1){
    	    idx.push(i);
    	};
    	return idx;
	} else {
		R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: (Internal) Invalid arguments on R3_getAllIndexes!');
	};
};
// Get Current Date
function R3_getDate(mode){
	/*
		Modes
		0: Full
		1: Day
		2: Month
		3: Year
		4: Hour
		5: Minutes
		6: Seconds
	*/
	var t = new Date, d = t.getDate(), h = t.getHours(), s = t.getSeconds(), y = t.getFullYear().toString(), mi = t.getMinutes(), m = (t.getMonth() + 1);
	if (mode === undefined){
		mode = 0;
	};
	if (d.toString().length < 2){
		d = '0' + t.getDate();
	};
	if (m.toString().length < 2){
		m = '0' + parseInt(t.getMonth() + 1);
	};
	if (h.toString().length < 2){
		h = '0' + t.getHours(); 
	};
	if (mi.toString().length < 2){
		mi = '0' + t.getMinutes(); 
	};
	if (s.toString().length < 2){
		s = '0' + t.getSeconds();
	};
	if (mode === 0){
		return d + '-' + m + '-' + y + '_' + h + '.' + mi + '.' + s;
	};
	if (mode === 1){
		return d.toString();
	};
	if (mode === 2){
		return m.toString();
	};
	if (mode === 3){
		return y.toString();
	};
	if (mode === 4){
		return h.toString();
	};
	if (mode === 5){
		return mi.toString();
	};
	if (mode === 6){
		return s.toString();
	};
};
// Read Date gerenated with R3_getDate
function R3_readDate(dateStr, mode){
	if (dateStr !== undefined && dateStr !== ''){
		if (mode === undefined || mode === ''){
			mode = 0;
		} else {
			mode = parseInt(mode);
		};
		// Date
		if (mode === 0){
			return dateStr.slice(0, 10).replace(new RegExp('-', 'gi'), '/');
		};
		// Time
		if (mode === 1){
			return dateStr.slice(11, dateStr.length).replace(new RegExp('[.]', 'gi'), ':');
		};
	} else {
		return '';
	};
};
// Process Player HP
function R3_processHP(hex){
	if (hex !== '' && hex.length === 4){
		var stat, color, vital = R3_processBIO3Vars(hex);
		/*
			The correct value should be 32767, but i'm leaving a
			margin error to game thinks the player still alive!
		*/
		if (vital > 30100){
			stat = 'Dead';
			color = 'R3_COLOR_DANGER';
		};
		if (vital === 0){
			stat = 'Almost dead!';
			color = 'R3_COLOR_DANGER';
		};
		if (vital > 0 && vital < 21){
			stat = 'Danger';
			color = 'R3_COLOR_DANGER';
		};
		if (vital > 20 && vital < 31){
			stat = 'Caution';
			color = 'R3_COLOR_CAUTION_RED';
		};
		if (vital > 30 && vital < 101){
			stat = 'Caution';
			color = 'R3_COLOR_CAUTION';
		};
		if (vital > 101 && vital < 201){
			stat = 'Fine';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 200 && vital < 500){
			stat = 'Fine...?';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 499 && vital < 999){
			stat = 'Life Hack!';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 999 && vital < 19999){
			stat = 'Unfair!';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 19999 && vital < 30099){
			stat = 'CHEATER!';
			color = 'R3_COLOR_FINE';
		};
		return [vital, stat, hex, color];
	};
};
// Format string as a hex
function R3_unsolveHEX(hex, mode){
	var res = '', rw;
	if (hex !== '' && hex !== undefined && hex !== null){
		if (mode === undefined || mode === 0){
			rw = hex.match(/.{1,2}/g);
		};
		if (mode === 1){
			rw = hex.match(/.{1,4}/g);
		};
		if (mode === 2){
			rw = hex.match(/.{1,8}/g);
		};
		res = rw.toString().replace(RegExp(',', 'gi'), ' ').toUpperCase();
	};
	return res;
};
// Parse Positive
function R3_parsePositive(number){
	var final = 0;
	if (number !== undefined && parseInt(number) !== NaN && number !== ''){
		var num = parseInt(number), tempRes = parseInt(num - num - num);
		if (tempRes < 0){
			final = parseInt(tempRes *- 1);
		} else {
			final = tempRes;
		};
	};
	return final;
};
// Process location position
function R3_processBIO3PosNumbers(number){
	var final = 0;
	if (number !== undefined){
		var numTemp = parseInt(number);
		if (numTemp > 32767){
			numTemp = parseInt(numTemp - 65536);
		};
		final = numTemp;
	};
	return final;
};
// Convert position int to hex
function R3_convertPosIntToHex(number){
	if (number !== undefined && number !== ''){
		var num = parseInt(number);
		if (num < 0){
			num = parseInt(num + 65536);
		};
		return R3_fixVars(num.toString(16), 4);
	};
};
// Convert position hex to int
function R3_convertPosHexToInt(hex){
	if (hex !== undefined && hex !== ''){
		var fixed = R3_parseEndian(hex),
			conv  = parseInt(fixed, 16);
		if (conv > 32767){
			conv = parseInt(conv - 65536);
		};
		return conv;
	};
};
// Get all locations of specifc string
function R3_getAllIndexes(arr, val){
	if (arr !== null && val !== null || arr !== undefined && val !== undefined){
    	var indexes = [], i = -1;
    	while ((i = arr.indexOf(val, i + 1)) !== -1){
    	    indexes.push(i);
    	};
    	return indexes;
	};
};
// Get char from left / right [Use in OM_SET]
function R3_getByteFromPos(mode, value){
	if (mode !== undefined && value !== undefined){
		var res = value.slice(1);
		if (mode === 0){
			res = value.slice(0, 1);
		};
		return res;
	};
};
/*
	R3_fixVars (aka. MEMORY_JS_fixVars)
	By far, one of the most important functions inside R3V2!
*/
function R3_fixVars(inp, v){
	var c = 0, inp, size;
	if (inp === undefined || inp === ''){
		input = '00';
	} else {
		input = inp.toString();
	};
	if (v === undefined || v === ''){
		size = 2;
	} else {
		size = parseInt(v);
	};
	if (input.length < size){
		while (input.length !== size){
			input = '0' + input;
		};
	} else {
		if (input.length !== size && input.toString().length > size){
			input = input.slice(0, v);
		};
	};
	return input;
};
// Copy text to clipboard
function R3_SYS_copyText(textData){
	if (textData !== undefined && textData !== ''){
		var tmpDom = document.createElement('textarea');
		document.body.appendChild(tmpDom);
		tmpDom.value = textData;
		tmpDom.select();
		document.execCommand('copy');
		document.body.removeChild(tmpDom);
	};
};
// Copy files / folders
function R3_SYS_copyFiles(source, destiny, execNext){
	if (R3_WEBMODE === false){
		APP_FS.copy(source, destiny, function(err){
			if (err){
				R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to copy! <br>Reason: ' + err);
			} else {
				if (execNext !== undefined){
					execNext();
				} else {
					return true;
				};
			};
		});
	};
};
/*
	Hex Time Converter - THIS IS WIP!
	Modes:

	0: Full Time
	1: Array
	2: MM SS DC
	3: 2 with quotes
	4: Hex to Int
*/
function R3_TIME_parseHexTime(hex, outputMode){
	var final = 0;
	if (hex !== undefined && hex !== ''){
		if (outputMode === undefined){
			outputMode = 0;
		};
		var DC = SS = MM = HH = 0,
			timeHex = hex.match(/.{2,2}/g),
			data0 = parseInt(timeHex[0], 16),
			data1 = parseInt(timeHex[1], 16),
			// Adding to counter
			DC = parseInt((data0 * 100) + (data1 * 256 * 100));
		while (DC > 99){
			DC = parseInt(DC - 100);
			SS++;
		};
		while (SS > 59){
			SS = parseInt(SS - 60);
			MM++;
		};
		while (MM > 59){
			MM = parseInt(MM - 60);
			HH++;
		};
		/*
			End
		*/
		if (outputMode === 0){
			final = R3_fixVars(HH, 2) + ':' + R3_fixVars(MM, 2) + ':' + R3_fixVars(SS, 2) + ':' + R3_fixVars(DC, 2);
		};
		if (outputMode === 1){
			final = [HH, MM, SS, DC];
		};
		if (outputMode === 2){
			final = R3_fixVars(MM, 2) + ':' + R3_fixVars(SS, 2) + ':' + R3_fixVars(DC, 2);
		};
		if (outputMode === 3){
			final = R3_fixVars(HH, 2) + ':' + R3_fixVars(MM, 2) + '\'' + R3_fixVars(SS, 2) + '\'\'' + R3_fixVars(DC, 2);
		};
		if (outputMode === 4){
			final = parseInt(HH + MM + SS + DC);
		};
		return final;
	};
};
// Convert Endian Number to Int
function R3_parseEndianToInt(hex){
	if (hex !== undefined && hex !== ''){
		var final = 0, split = hex.match(/.{2,2}/g), firstVal, secondVal, hx_00, hx_01, hx_02, hx_03;
		// 8 Bits
		if (hex.length === 4){
			firstVal = (parseInt(split[0], 16) * 256);
			secondVal = parseInt(split[1], 16);
			final = parseInt(firstVal + secondVal);
		};
		// 16 Bits
		if (hex.length === 8){
			hx_00 = (((parseInt(split[0], 16) * 256) * 256) * 256);
			hx_01 = ((parseInt(split[1], 16) * 256) * 256);
			hx_02 = (parseInt(split[2], 16) * 256);
			hx_03 = (parseInt(split[3], 16));
			final = parseInt(hx_00 + hx_01 + hx_02 + hx_03);
		};
	};
	return final;
};
// Clean Hex code
function R3_cleanHex(hex){
	var final = '';
	if (hex !== undefined && hex !== ''){
		final = R3_solveHEX(hex);
		R3_HEX_FORMAT_EXCLUDE.forEach(function(cItem){
			final = final.replace(new RegExp(cItem, 'g'), '').replace(/[^a-z0-9]/gi, '');
		});
	};
	return final;
};
// Clean Hex from Input
function R3_cleanHexFromInput(domId){
	if (domId !== undefined){
		var clean = R3_cleanHex(document.getElementById(domId).value);
		document.getElementById(domId).value = clean;
	};
};
// Get Random Number
function R3_genRandomNumber(maximum){
	if (maximum !== undefined){
		return parseInt(Math.floor(Math.random() * parseInt(maximum)));
	} else {
		return Math.random();
	};
};
/*
	Process 4:3 Res
	Modes:

	0: Wdith
	1: Height
*/
function R3_parsePSXRes(mode, res){
	if (res === NaN || res === undefined || res === ''){
		res = 256;
	};
	if (mode === 0){
		return parseInt(res / 1.14);
	} else {
		return parseInt(res * 1.14);
	};
};
/*
	Remove HTML from string

	Remove HTML from string (textClean) original code:
	https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
*/
function R3_removeHtmlFromString(str){
	if (str === undefined || str === ''){
		return '';
	} else {
		return str.replace(/<[^>]*>?/gm, '');
	};
};
/*
	Parse isInteger
	Added to enhance IE oldness!
*/
function R3_isInteger(value){
	var res = false;
	if (value !== undefined){
		// If IE
		if (R3_WEB_IS_IE === true && value.toString().indexOf('.') === -1){
			res = true;
		} else {
			res = Number.isInteger(value);
		};
	};
	return res;
};
// Get map path
function R3_getMapPath(){
	if (APP_ENABLE_MOD === true){
		var gMode = parseInt(document.getElementById('R3_RDT_FILELIST_GAMEMODE').value),
			cPrefix = R3_RDT_PREFIX_EASY;
		if (gMode === 1){
			cPrefix = R3_RDT_PREFIX_HARD;
		};
		return [gMode, R3_MOD_PATH + '/' + cPrefix + '/RDT/'];
	};
};
/*
	Cleaner
	Let's reset everyting!
*/
function R3_UTILS_VAR_CLEAN(){
	// Main Menu
	R3_UTILS_VAR_CLEAN_GENERAL();
	// Xdelta
	R3_UTILS_VAR_CLEAN_XDELTA();
	// OBJ Patcher
	R3_UTILS_VAR_CLEAN_OBJ();
	// MSG Editor
	R3_UTILS_VAR_CLEAN_MSG();
	// SCD Editor
	R3_UTILS_VAR_CLEAN_SCD();
	// RDT Editor
	R3_UTILS_VAR_CLEAN_RDT();
	// ARD Utility
	R3_UTILS_VAR_CLEAN_ARD();
	// RID Editor
	R3_UTILS_VAR_CLEAN_RID();
	// LIT Editor
	R3_UTILS_VAR_CLEAN_LIT();
	// TIM Files
	R3_UTILS_VAR_CLEAN_TIM();
};
function R3_UTILS_VAR_CLEAN_GENERAL(){
	ORIGINAL_FILENAME = undefined;
};
function R3_UTILS_VAR_CLEAN_XDELTA(){
	R3_XDELTA_PATCH = undefined;
	R3_XDELTA_ORIGINALFILE = undefined;
};
function R3_UTILS_VAR_CLEAN_OBJ(){
	OBJ_arquivoBruto = '';
};
function R3_UTILS_VAR_CLEAN_MSG(){
	R3_MSG_tempHex = '';
	R3_MSG_textMode = '';
	R3_MSG_commands = {};
	R3_MSG_RDT_POINTERS = [];
	R3_MSG_RDT_MESSAGES = [];
	R3_MSG_totalCommands = 0;
	MSG_arquivoBruto = undefined;
};
function R3_UTILS_VAR_CLEAN_SCD(){
	R3_SCD_path = '';
	R3_SCD_POINTERS = [];
	R3_SCD_fileName = '';
	SCD_HEADER_LENGTH = 0;
	R3_SCD_SCRIPTS_LIST = {};
	R3_SCD_TOTAL_SCRITPS = 0;
	R3_SCD_IS_EDITING = false;
	R3_SCD_currentOpcode = '';
	R3_SCD_CURRENT_SCRIPT = 0;
	R3_SCD_previousOpcode = [];
	R3_SCD_TOTAL_FUNCTIONS = 0;
	R3_SCD_TEMP_GOSUB_VALUE = 0;
	R3_TEMP_INSERT_OPCODE = '';
	R3_SCD_CURREN_HEX_VIEW = '';
	R3_SCD_ID_LIST_ENTRIES = {};
	SCD_arquivoBruto = undefined;
	R3_SCD_CURRENT_SCRIPT_HEX = '';
	R3_SCD_FUNCTION_FOCUSED = false;
	R3_SCD_SCRIPTS_IS_LOADING = false;
	R3_SCD_OVERALL_TOTAL_FUNCTIONS = 0;
};
function R3_UTILS_VAR_CLEAN_RDT(){
	R3_RDT_LOADED = false;
	R3_RDT_ARRAY_TIM = [];
	R3_RDT_ARRAY_OBJ = [];
	R3_RDT_MAP_totalCams = 0;
	R3_RDT_currentTimFile = 0;
	RDT_arquivoBruto = undefined;
	R3_RDT_MAP_HEADER = undefined;
	R3_RDT_MAP_HEADER_POINTERS = [];
	// Raw Sections
	R3_RDT_RAWSECTION_VB  = undefined;
	R3_RDT_RAWSECTION_SCA = undefined;
	R3_RDT_RAWSECTION_RID = undefined;
	R3_RDT_RAWSECTION_OBJ = undefined;
	R3_RDT_RAWSECTION_RVD = undefined;
	R3_RDT_RAWSECTION_LIT = undefined;
	R3_RDT_RAWSECTION_PRI = undefined;
	R3_RDT_RAWSECTION_MSG = undefined;
	R3_RDT_RAWSECTION_SCD = undefined;
	R3_RDT_RAWSECTION_EFF = undefined;
	R3_RDT_RAWSECTION_SND = undefined;
	R3_RDT_RAWSECTION_BLK = undefined;
	R3_RDT_RAWSECTION_FLR = undefined;
	R3_RDT_RAWSECTION_RBJ = undefined;
	R3_RDT_RAWSECTION_EFFSPR = undefined;
	// Original copy
	R3_RDT_ORIGINAL_VB = undefined;
	R3_RDT_ORIGINAL_SCA = undefined;
	R3_RDT_ORIGINAL_RID = undefined;
	R3_RDT_ORIGINAL_RVD = undefined;
	R3_RDT_ORIGINAL_OBJ = undefined;
	R3_RDT_ORIGINAL_LIT = undefined;
	R3_RDT_ORIGINAL_PRI = undefined;
	R3_RDT_ORIGINAL_MSG = undefined;
	R3_RDT_ORIGINAL_SCD = undefined;
	R3_RDT_ORIGINAL_EFF = undefined;
	R3_RDT_ORIGINAL_SND = undefined;
	R3_RDT_ORIGINAL_BLK = undefined;
	R3_RDT_ORIGINAL_FLR = undefined;
	R3_RDT_ORIGINAL_RBJ = undefined;
	R3_RDT_ORIGINAL_EFFSPR = undefined;
};
function R3_UTILS_VAR_CLEAN_ARD(){
	ARD_filePath = '';
	ARD_fileName = '';
	ARD_sections = [];
	ARD_fileSize = undefined;
	ARD_objectsMetadata = [];
	ARD_arquivoBruto = undefined;
	ARD_totalObjects = undefined;
};
function R3_UTILS_VAR_CLEAN_RID(){
	RID_cameraList = [];
	RID_arquivoBruto = undefined;
};
function R3_UTILS_VAR_CLEAN_LIT(){
	LIT_lightArray = [];
	LIT_camPointers = [];
	LIT_arquivoBruto = undefined;
};
function R3_UTILS_VAR_CLEAN_TIM(){
	TIM_arquivoBruto = undefined;
	TIM_header = undefined;
	TIM_bppType = undefined;
	TIM_clutSize = undefined;
	TIM_VRAM_palleteOrgX = undefined;
	TIM_VRAM_palleteOrgY = undefined;
	TIM_colorsPerCLUT = undefined;
	TIM_totalCLUT = undefined;
	TIM_CLUT = undefined;
	TIM_RAW_IMG = undefined;
};