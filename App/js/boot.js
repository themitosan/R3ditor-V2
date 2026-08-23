/*
	*******************************************************************************
	R3ditor V2 - boot.js
	By TemmieHeartz

	This file is responsible for startup process and internal functions.
	PS: This file is under sorting process!
	*******************************************************************************
*/

/*
	R3_MODULES
	Internal Modules
*/
tempFn_R3_MODULES = {
	os: void 0,
	fs: void 0,
	gui: void 0,
	path: void 0,
	memoryjs: void 0,
	childProcess: void 0,
	// Require Status
	requireSucess: !1
}

// Initialize modules
tempFn_R3_MODULES['INIT'] = function(){
	R3_SYSTEM.web.checkBrowser();
	if (R3_SYSTEM.web.isBrowser === !1){

		var eReason = '', 					   // Error reason
			engineVersion, 					   // nwjs
			engineArch = process.arch, 		   // x86 / x64
			enginePlatform = process.platform; // win32, darwin, linux... 

		/*
			Detect engine (nwjs, electron and etc.)
		*/

		// NW.js [Node-Webkit]
		if (process.versions['node-webkit'] !== void 0){
			engineVersion = process.versions['node-webkit'];
			R3_SYSTEM.web.is_NW = !0;
		}

		/*
			Start Require process
		*/
		if (engineVersion !== void 0){

			// Init MemoryJS
			if (engineArch === 'x64' && enginePlatform === 'win32'){
				try {
					R3_MODULES.memoryjs = require('memoryjs');
					R3_MEMJS.requireSucess = !0;
				} catch (err) {
					console.error('Unable to require MemoryJS!\n' + err);
				}
			}

			R3_MODULES.os = require('os');
			R3_MODULES.path = require('path');
			R3_MODULES.fs = require('fs-extra');
			R3_MODULES.childProcess = require('child_process');

			// NW.gui
			if (R3_SYSTEM.web.is_NW === !0){
				R3_MODULES.gui = require('nw.gui');
				R3_MODULES.gui.Screen.Init();
				R3_SYSTEM_availableMonitors = Object.keys(R3_MODULES.gui.Screen.screens).length;
			}

			/*
				End
			*/
			R3_MODULES.requireSucess = !0;
		}

	} else {
		/*
			Web Mode
		*/
		try {
			// Try to port some node.js functions to web
			R3_MODULES.fs = {
				readFileSync: function(path, options){
					if (path !== void 0 && path !== ''){
						var fReader = new FileReader;
						if (options === void 0) options = 'hex';
						/*
							Read Modes
							Original Code: https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
						*/
						// Hex
						if (options === 'hex'){
							fReader.readAsArrayBuffer(path);
							fReader.onload = function(){
								R3_SYSTEM.web.FILE_BRIDGE = Array.prototype.map.call(new Uint8Array(fReader.result), function(x){
									return ('00' + x.toString(16)).slice(-2);
								}).join('');
							}
						}
						// Text
						if (options === 'utf-8'){
							fReader.readAsText(path);
							fReader.onload = function(){
								R3_SYSTEM.web.FILE_BRIDGE = fReader.result;
							}
						}
						// End
						fReader.onerror = function(){
							R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to read file! <br>Reason: ' + fReader.error);
							console.error('R3_MODULES.fs ERROR!\n' + fReader.error);
							R3_SYSTEM.alert('ERROR: \n' + fReader.error);
						}
					}
				},
				writeFileSync: function(path, fData, mode){
					R3_fileManager.saveFile(R3_tools.getFileName(path.name) + '.' + R3_tools.getFileExtension(path.name), fData, mode, R3_tools.getFileExtension(path.name));
				}
			}
		} catch (err) {
			R3_DESIGN_CRITIAL_ERROR(err);
		}
	}
}

// End
const R3_MODULES = tempFn_R3_MODULES;
delete tempFn_R3_MODULES;

/*
	Functions
*/

// Start Process
function R3_LOAD(){
	try {

		R3_APP_START = !0;
		var startInWebMode = !1, nwArgs = [], nwFlavor = '';

		// Drity code for webmode
		if (typeof nw !== 'undefined' && typeof process !== 'undefined'){
			nwArgs = nw.App.argv;
			if (nwArgs.indexOf('--webmode') !== -1) startInWebMode = !0;
		} else {
			startInWebMode = !0;
		}
		R3_SYSTEM.web.isBrowser = startInWebMode;

		// Init modules
		R3_MODULES.INIT();
		R3_SYSTEM.getPaths();
		if (R3_SYSTEM.web.isBrowser === !0){
			INT_VERSION = INT_VERSION + ' [WEB]';
			R3_INIT_DATABASE_GENERATE();
			R3_LOAD_SETTINGS();
			R3_DESIGN_ADJUST();
		} else {
			if (R3_MODULES.requireSucess === !0){

				// NW Flavor
				if (R3_SYSTEM.web.is_NW === !0) nwFlavor = ' [' + process.versions['nw-flavor'] + ']';
				INT_VERSION = INT_VERSION + nwFlavor;

				try {
					R3_INIT_DATABASE_GENERATE();
					R3_LOAD_CHECKFILES();
					R3_LOAD_SETTINGS();
					R3_DESIGN_ADJUST();
				} catch (err) {
					R3_DESIGN_CRITIAL_ERROR(err);
					console.error(err);
				}

			}
		}

		// End
		R3_SYSTEM.appTitle = 'R3ditor V2 - Ver. ' + INT_VERSION;
		R3_SYSTEM.log('log', R3_SYSTEM.appTitle);

		// Log args
		if (nwArgs.length !== 0) R3_SYSTEM.log('log', 'Run Args: <font class="user-can-select">' + nwArgs.toString().replace(RegExp(',', 'gi'), ' ') + '</font>');
		R3_SYSTEM.log('separator');

		// If web, log navigator.userArgent
		if (R3_SYSTEM.web.isBrowser === !0){
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Webmode) - User-Argent: <font class="user-can-select">' + navigator.userAgent + '</font>');
			R3_SYSTEM.log('separator');
			R3_SYSTEM.log('log', atob(special_day_03));
			R3_SYSTEM.log('separator');
		} else {

			// eNGE Start
			eNGE_INIT();

		}

		document.title = R3_SYSTEM.appTitle;
		console.info(R3_SYSTEM.appTitle);

	} catch (err) {
		console.error(err);
		R3_DESIGN_CRITIAL_ERROR(err);
	}
}

/*
	R3_SYSTEM
	System Variables and Functions
*/
tempFn_R3_SYSTEM = {

	/*
		Init Variables
	*/
	appTitle: '',
	APP_ON_BOOT: !0, // "APP_ON_BOOT" is responsible for avoiding some functions to run when app is already loaded
	appCanStart: !0,

	/*
		Log Variables / functions
	*/
	logText: '',
	logList: {},
	logInternal: '',
	currentLogId: 0,
	logCounter_INFO: 0,
	logCounter_WARN: 0,
	logCounter_ERROR: 0,
	RELEASE_LOG_DATA: !1,

	/*
		Common API replacements
	*/

	// Prompt replace
	prompt: function(txt){
		var res = window.prompt(txt);
		R3_keyPress.releaseKeys();
		return res;
	},

	// Confirm replace
	confirm: function(conf){
		var res = window.confirm(conf);
		R3_keyPress.releaseKeys();
		return res;
	},

	// Alert system
	alert: function(msg){
		if (msg !== void 0){
			window.alert(msg);
			R3_keyPress.releaseKeys();
		}
	},

	/*
		External Software
	*/
	externalSoftware: {
		processPID: 0,
		processExitCode: 0,
		processRunning: !1
	},

	/*
		Web Variables / Functions
	*/
	web: {

		FILE_BRIDGE: '',
		isBrowser: !1,
		online: navigator.onLine, // APP_ONLINE

		// Web Modes
		is_IE: !1,	    // Internet Explorer
		is_NW: !1,	    // NW.js (Node Webkit)
		is_PS4: !1,	    // Playstation 4
		is_SAFARI: !1,   // Apple Safari
		is_FIREFOX: !1,  // Mozilla Firefox
		is_ANDROID: !1,  // Android Browsers

		// Warn Message
		webWarn: function(){
			R3_SYSTEM.alert('WARN: This function is only available on desktop version.');
			R3_SYSTEM.log('warn', 'WARN: This function is only available on desktop version.');
		},

		// Detect browser on web-mode
		checkBrowser: function(){
			if (R3_SYSTEM.web.isBrowser === !0){
				const uArgent = navigator.userAgent;

				// Apple Safari / PS4
				if (uArgent.indexOf('Safari') !== -1 && uArgent.indexOf('Chrome') === -1){
					if (uArgent.indexOf('PlayStation 4') === -1){
						R3_SYSTEM.web.is_SAFARI = !0;
					} else {
						R3_SYSTEM.web.is_PS4 = !0;
					}
				}

				// Mozilla Firefox
				if (uArgent.indexOf('Firefox/') !== -1 && uArgent.indexOf('Chrome') === -1) R3_SYSTEM.web.is_FIREFOX = !0;

				// Interet Explorer (IE11)
				if (uArgent.indexOf('.NET') !== -1 && uArgent.indexOf('Chrome') === -1) R3_SYSTEM.web.is_IE = !0;

				// Android Devices
				if (uArgent.indexOf('Android') !== -1){
					R3_SYSTEM.web.is_ANDROID = !0;
					R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: You are using R3ditor V2 on Android! This isn\'t recommended, since screen size aren\'t great for this tool display.');
				}

			}
		}
	},

	/*
		App Paths
	*/
	paths: {
		app: '',	 // "App" Path
		mod: '',	 // Documents folder
		tools: '',	 // Tools
		original: '' // "App" Copy
	},

	/*
		Messages
	*/
	// WIP Message
	WIP: function(){
		R3_SYSTEM.alert('TemmieHeartz Says - THIS IS WIP! #Sorry');
		R3_SYSTEM.log('warn', 'TemmieHeartz Says - THIS IS WIP! #Sorry');
	}

}

/*
	R3_SYSTEM.getPath
	Get path variables from OS
*/
tempFn_R3_SYSTEM['getPaths'] = function(){
	if (R3_SYSTEM.web.isBrowser === !1){
		R3_SYSTEM.paths.app = R3_tools.fixPath(process.cwd());
		R3_SYSTEM.paths.tools = R3_tools.fixPath(process.cwd()) + '/Tools';
		R3_SYSTEM.paths.original = R3_SYSTEM.paths.app;

		/*
			Other OS
		*/

		// macOS (Tested on Mojave)
		if (process.platform === 'darwin') R3_SYSTEM.paths.app = process.env.HOME + '/Documents/R3V2';

		// Windows [Tested on 7, 8, 8.1, 10 and 11 Preview]
		if (process.platform === 'win32'){

			var tempPath = process.env.HOMEDRIVE + process.env.HOMEPATH + '/Documents';
			/*
				Fix if documents does not exists (attempt to fix 3lric boot issue)
				This will redirect the R3_SYSTEM.paths.app to executable dir
			*/
			if (R3_MODULES.fs.existsSync(tempPath) !== !0) tempPath = R3_tools.fixPath(R3_MODULES.path.dirname(process.execPath)) + '/R3V2';
			R3_SYSTEM.paths.mod = R3_tools.fixPath(tempPath) + '/R3V2';

		} else {
			R3_SETTINGS.APP_useImageFix = !0;
		}

		// Linux (Tested on Ubuntu 21.10)
		if (process.platform === 'linux'){
			R3_SYSTEM.paths.mod = R3_MODULES.os.homedir() + '/R3V2';
			R3_SYSTEM.paths.tools = R3_tools.fixPath(R3_SYSTEM.paths.original + '/Tools');
		}

	}
}

/*
	External Software
*/
// Run Executable
tempFn_R3_SYSTEM.externalSoftware['runExec'] = function(exe, args, mode, newFilePath){
	if (R3_SYSTEM.web.isBrowser === !1){

		/*
			Modes:
			0: Use executable path as chdir
			1: Use Internal assets path as chdir
			2: Don't set chdir
			3: Set custom chdir
		*/

		if (mode === 0) process.chdir(R3_tools.getFilePath(exe));
		if (mode === 1){
			process.chdir(R3_MOD.path);
			console.info('External Executable: Running ' + exe + ' with chdir in ' + R3_MOD.path);
		}
		if (mode === 2) console.info('INFO - Skipping chdir...');
		if (mode === 3){
			process.chdir(R3_tools.getFilePath(newFilePath));
			console.info('External Executable: Running ' + exe + ' with chdir in ' + R3_tools.getFilePath(newFilePath));
		}
		if (args === void 0 || args === '' || args === null) args = [''];
		R3_GAME.gamePID = 0;

		/*
			Run windows executable on non-windows platform
			This will require wine to work
		*/
		if (process.platform !== 'win32' && exe.toLowerCase().indexOf('.exe') !== -1){
			args.splice(0, 0, exe);
			exe = 'wine';
		}
		const PROCESS = R3_MODULES.childProcess.spawn(exe, args);
		R3_SYSTEM.externalSoftware.processRunning = !0;
		if (mode !== 0) R3_GAME.gamePID = PROCESS.pid;
		PROCESS.stdout.on('data', function(data){
			console.info(data.toString());
			R3_SYSTEM.log('log', 'R3ditor V2 - External Software (stdout): ' + data.toString());
		});
		PROCESS.stderr.on('data', function(data){
			console.info(data.toString());
			R3_SYSTEM.log('log', 'R3ditor V2 - External Software (stderr): ' + data.toString());
		});
		PROCESS.on('close', function(code){
			R3_SYSTEM.log('separator');
			R3_SYSTEM.externalSoftware.processRunning = !1;
			process.chdir(R3_SYSTEM.paths.original);
			if (R3_GAME.gameRunning !== !1){
				R3_GAME.gameRunning = !1;
				R3_LIVESTATUS_CLOSE_BAR();
				clearInterval(R3_MEMJS.updatePosTimer);
				if (parseInt(code) < 2){
					R3_SYSTEM.log('log', 'R3ditor V2 - INFO: The game closed with code <font class="user-can-select">' + code + '</font>');
				} else {
					R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: The game closed with code <font class="user-can-select">' + code + '</font>!');
					R3_MINIWINDOW.open(0);
				}
			} else {
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: The application closed with code <font class="user-can-select">' + code + '</font>');
			}
			return code;
		});
	}
}

// Kill Process R3_SYSTEM.externalSoftware.killPID
tempFn_R3_SYSTEM.externalSoftware['killPID'] = function(processID){
	if (R3_SYSTEM.web.isBrowser === !1){
		try {
			if (processID !== '' && processID !== void 0 && processID !== null){
				process.kill(parseInt(processID));
			} else {
				if (R3_SYSTEM.externalSoftware.processPID !== 0 && R3_SYSTEM.externalSoftware.processPID !== void 0){
					process.kill(R3_SYSTEM.externalSoftware.processPID);
				}
			}
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to kill process ' + processID + '! <br>Details: ' + err);
		}
	}
}

/*
	R3_SYSTEM_LOG
	Log system
*/
tempFn_R3_SYSTEM['log'] = function(mode, text){
	if (R3_SETTINGS.SETTINGS_DISABLE_LOG === !1 && R3_SETTINGS.R3_NW_ARGS_DISABLE_LOG === !1){

		var lastLog, 
			canLog = !0,
			isSeparator = !1, 
			HTML_LOG_TEMPLATE = logCSS = textClean = '', 
			defaultCheck = [void 0, '', 'log', 'ok', 'info'];

		if (text === void 0) text = '';
		if (R3_SYSTEM.log_RESET === !0){
			document.getElementById('R3_LOG_HOLDER').innerHTML = '';
			R3_SYSTEM.log_RESET = !1;
		} else {
			textClean = R3_tools.removeHtmlFromString(text);
		}

		// Avoid eNGE null messages
		if (textClean === 'R3ditor V2 - INFO: (eNGE) \n'){
			textClean = text = '';
			canLog = !1;
		}
		lastLog = R3_SYSTEM.logList[(R3_SYSTEM.currentLogId - 1)];
		if (lastLog !== void 0 && lastLog.type === 'separator' && mode === 'separator') canLog = !1;

		/*
			Final checks
		*/

		if (canLog === !0){
			if (defaultCheck.indexOf(mode) !== -1){
				logCSS = 'R3_LOG_OK';
				R3_SYSTEM.logCounter_INFO++;
			}
			if (mode === 'warn'){
				console.warn(textClean);
				logCSS = 'R3_LOG_WARN';
				R3_SYSTEM.logCounter_WARN++;
			}
			if (mode === 'error'){
				console.error(textClean);
				logCSS = 'R3_LOG_ERROR';
				R3_SYSTEM.logCounter_ERROR++;
			}
			if (mode === 'separator'){
				isSeparator = !0;
				textClean = SYSTEM_LOG_SEPARATOR_TEXT;
				HTML_LOG_TEMPLATE = '<div id="R3_LOG_ID_N_' + R3_SYSTEM.currentLogId + '" class="SEPARATOR-3"></div>';
			} else {
				HTML_LOG_TEMPLATE = '<div id="R3_LOG_ID_N_' + R3_SYSTEM.currentLogId + '" class="R3_LOG_ITEM ' + logCSS + '">' + text + '</div>';
			}

			// Open on warn / error
			if (mode === 'warn' || mode === 'error') if (R3_SETTINGS.SETTINGS_OPEN_LOG_ON_WARN_ERROR === !0) R3_MINIWINDOW.open(0);

			/*
				End
			*/
			R3_SYSTEM.logText = R3_SYSTEM.logText + textClean + '\n';
			R3_SYSTEM.logInternal = R3_SYSTEM.logInternal + HTML_LOG_TEMPLATE;
			R3_SYSTEM.logList[R3_SYSTEM.currentLogId] = {type: mode, message: text};
			R3_SYSTEM.RELEASE_LOG_DATA = !0;
			R3_SYSTEM.currentLogId++;
			// Execute log if window is opened
			if (R3_MINI_WINDOW_DATABASE[0][5] === !0) R3_SYSTEM.appendLog();
		}

	} else {
		if (text !== void 0){
			if (mode === void 0 || mode.toLowerCase() === 'log') console.info(R3_tools.removeHtmlFromString(text));
			if (mode.toLowerCase() === 'warn') console.warn(R3_tools.removeHtmlFromString(text));
			if (mode.toLowerCase() === 'error') console.error(R3_tools.removeHtmlFromString(text));
		}
	}
}

// Append log
tempFn_R3_SYSTEM['appendLog'] = function(){
	if (R3_SYSTEM.RELEASE_LOG_DATA === !0){
		document.getElementById('R3_LOG_HOLDER').innerHTML = R3_SYSTEM.logInternal;
		document.getElementById('R3_LOG_HOLDER').scrollTop = document.getElementById('R3_LOG_HOLDER').scrollHeight;
		document.getElementById('R3V2_TITLE_LOG_WINDOW').innerHTML = 'R3ditor V2 Log <i>[' + R3_SYSTEM.logCounter_INFO + ' Infos, ' + R3_SYSTEM.logCounter_WARN + ' Warns and ' + R3_SYSTEM.logCounter_ERROR + ' Errors]</i>';
		R3_SYSTEM.RELEASE_LOG_DATA = !1;
	}
}

// Clear Log
tempFn_R3_SYSTEM['clearLog'] = function(resetConsole){
	R3_SYSTEM.logList = {};
	R3_SYSTEM.logText = R3_SYSTEM.logInternal = '';
	document.getElementById('R3_LOG_HOLDER').innerHTML = '';
	R3_SYSTEM.currentLogId = R3_SYSTEM.logCounter_INFO = R3_SYSTEM.logCounter_WARN = R3_SYSTEM.logCounter_ERROR = 0;
	R3_SYSTEM.log('log', 'R3ditor V2 - The log was cleared');
	R3_SYSTEM.log('separator');
	if (resetConsole === !0) console.clear();
}

// Save Log
tempFn_R3_SYSTEM['saveLog'] = function(){
	if (R3_SYSTEM.log_TEXT !== ''){
		R3_fileManager.saveFile('R3V2_LOG.log', R3_SYSTEM.logText, 'utf-8', '.log', function(finalFile){
			var finalLbl = '';
			if (R3_SYSTEM.web.isBrowser === !1) finalLbl = 'Path: <font class="user-can-select">' + finalFile + '</font>';
			R3_SYSTEM.log('separator');
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Save complete! ' + finalLbl);
		});
	}
}

// Open file in Hex Editor
tempFn_R3_SYSTEM['openInHex'] = function(){
	if (R3_SYSTEM.web.isBrowser === !1){
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.R3_HEX_PATH) !== !1 && R3_MODULES.fs.existsSync(R3_fileManager.originalFilename) !== !1){
			R3_SYSTEM.externalSoftware.runExec(R3_SETTINGS.R3_HEX_PATH, [R3_fileManager.originalFilename]);
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to open file in hex, since the Hex Viewer or file was not found!');
		}
	} else {
		R3_SYSTEM.web.webWarn();
	}
}

// Reload App
tempFn_R3_SYSTEM['reload'] = function(){
	if (R3_GAME.gameRunning === !0) R3_SYSTEM.externalSoftware.killPID(R3_GAME.gamePID);
	if (R3_SYSTEM.web.isBrowser !== !0){
		localStorage.clear();
		sessionStorage.clear();
		chrome.runtime.reload();
	} else {
		location.reload(!0);
	}
}

// End
const R3_SYSTEM = tempFn_R3_SYSTEM;
delete tempFn_R3_SYSTEM;

/*
	R3_MOD
	Functions / Variables for mod
*/
tempFn_R3_MOD = {
	path: '',
	title: '',
	enableMod: !1
}

// Load Mod
tempFn_R3_MOD['loadMod'] = function(){
	if (R3_SYSTEM.web.isBrowser === !1){
		R3_fileManager.loadFile('.R3MOD, .R3V2', function(fName){
			R3_MENU_EXIT();
			var mFile = R3_MODULES.fs.readFileSync(fName, 'utf-8');
			R3_WIZARD_modFile = JSON.parse(mFile);
			R3_MOD.path = R3_WIZARD_modFile.modPath;
			R3_MOD.title = R3_WIZARD_modFile.modName;
			R3_LIVESTATUS.currentMode = parseInt(R3_WIZARD_modFile.gameMode);
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Mod loaded sucessfully! <br>Mod Name: ' + R3_MOD.title + ' <br>Game Mode: ' + R3_LIVESTATUS.currentMode);
			R3_SAVE_SETTINGS(!1);
		});
	}
}

// End
const R3_MOD = tempFn_R3_MOD;
delete tempFn_R3_MOD;

/*
	R3_GAME
	Functions / Variables for game
*/
tempFn_R3_GAME = {
	gamePID: 0,
	gameRunning: !1,
	// Game status
	RE3_canRun: !1,
	MERCE_canRun: !1
}

// Run Game
tempFn_R3_GAME['run'] = function(mode){
	if (R3_SYSTEM.web.isBrowser === !1 && R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].gameData.isConsole === !1 && R3_UPDATER_RUNNING === !1){
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.R3_RE3_PATH) === !0){
			if (mode === 0 && R3_GAME.RE3_canRun === !0){
				R3_MEMJS.seekProcess();
				if (R3_MEMJS.processObj !== void 0){
					R3_LIVESTATUS_OPEN_BAR();
				} else {
					R3_SYSTEM.externalSoftware.runExec(R3_SETTINGS.R3_RE3_PATH, void 0, 0);
				}
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Resident Evil 3...');
			}
			if (mode === 1 && R3_GAME.MERCE_canRun === !0){
				R3_SYSTEM.externalSoftware.runExec(R3_SETTINGS.R3_MERCE_PATH, void 0, 0);
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Mercenaries');
			};
			if (mode === 2 && R3_GAME.RE3_canRun === !0){
				R3_MEMJS.seekProcess();
				if (R3_MEMJS.processObj !== void 0){
					R3_LIVESTATUS_OPEN_BAR();
				} else {
					R3_SYSTEM.externalSoftware.runExec(R3_SETTINGS.R3_RE3_PATH, void 0, 1);
				}
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Resident Evil 3 (Mod)');
			}
			if (mode === 3 && R3_GAME.MERCE_canRun === !0){
				R3_SYSTEM.externalSoftware.runExec(R3_SETTINGS.R3_MERCE_PATH, void 0, 1);
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Mercenaries (Mod)');
			}
			// Run check
			if (R3_MEMJS.requireSucess === !0 && R3_GAME.MERCE_canRun === !0 && R3_GAME.RE3_canRun === !0){
				if (mode === 0 || mode === 2){
					R3_MEMJS.seekProcess();
					R3_LIVESTATUS_OPEN_BAR();
				}
			}
		} else {
			R3_SYSTEM.log('error', 'ERROR - Unable to start game! <br>Reason: The file was not found! (404)');
		}
	} else {
		if (R3_SYSTEM.web.isBrowser === !0) R3_SYSTEM.web.webWarn();
	}
}

// End
const R3_GAME = tempFn_R3_GAME;
delete tempFn_R3_GAME;

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
}

function R3_UTILS_VAR_CLEAN_GENERAL(){
	R3_fileManager.originalFilename = void 0;
}

function R3_UTILS_VAR_CLEAN_XDELTA(){
	R3_XDELTA_PATCH = void 0;
	R3_XDELTA_ORIGINALFILE = void 0;
}

function R3_UTILS_VAR_CLEAN_OBJ(){
	OBJ_arquivoBruto = '';
}

function R3_UTILS_VAR_CLEAN_MSG(){
	R3_MSG_tempHex = '';
	R3_MSG_textMode = '';
	R3_MSG_commands = {};
	R3_MSG_RDT_POINTERS = [];
	R3_MSG_RDT_MESSAGES = [];
	R3_MSG_totalCommands = 0;
	MSG_arquivoBruto = void 0;
}

function R3_UTILS_VAR_CLEAN_SCD(){
	R3_SCD_path = '';
	R3_SCD_POINTERS = [];
	R3_SCD_fileName = '';
	SCD_HEADER_LENGTH = 0;
	R3_SCD_SCRIPTS_LIST = {};
	R3_SCD_TOTAL_SCRITPS = 0;
	R3_SCD_IS_EDITING = !1;
	R3_SCD_currentOpcode = '';
	R3_SCD_CURRENT_SCRIPT = 0;
	R3_SCD_previousOpcode = [];
	R3_SCD_TOTAL_FUNCTIONS = 0;
	R3_SCD_TEMP_GOSUB_VALUE = 0;
	R3_TEMP_INSERT_OPCODE = '';
	R3_SCD_CURREN_HEX_VIEW = '';
	R3_SCD_ID_LIST_ENTRIES = {};
	SCD_arquivoBruto = void 0;
	R3_SCD_CURRENT_SCRIPT_HEX = '';
	R3_SCD_FUNCTION_FOCUSED = !1;
	R3_SCD_SCRIPTS_IS_LOADING = !1;
	R3_SCD_OVERALL_TOTAL_FUNCTIONS = 0;
}

function R3_UTILS_VAR_CLEAN_RDT(){
	R3_RDT_LOADED = !1;
	R3_RDT_MAP_totalCams = 0;
	R3_RDT_currentTimFile = 0;
	RDT_arquivoBruto = void 0;
	R3_RDT_MAP_HEADER = void 0;
	R3_RDT.HEADER_POINTERS = [];
	// Raw Sections
	R3_RDT_rawSections.ORIGINAL_VB = '';
	R3_RDT_rawSections.ORIGINAL_SCA = '';
	R3_RDT_rawSections.ORIGINAL_RID = '';
	R3_RDT_rawSections.ORIGINAL_RVD = '';
	R3_RDT_rawSections.ORIGINAL_OBJ = '';
	R3_RDT_rawSections.ORIGINAL_LIT = '';
	R3_RDT_rawSections.ORIGINAL_PRI = '';
	R3_RDT_rawSections.ORIGINAL_FLR = '';
	R3_RDT_rawSections.ORIGINAL_MSG = '';
	R3_RDT_rawSections.ORIGINAL_SCD = '';
	R3_RDT_rawSections.ORIGINAL_EFF = '';
	R3_RDT_rawSections.ORIGINAL_SND = '';
	R3_RDT_rawSections.ORIGINAL_BLK = '';
	R3_RDT_rawSections.ORIGINAL_RBJ = '';
	R3_RDT_rawSections.RAWSECTION_VB = '';
	R3_RDT_rawSections.RAWSECTION_SCA = '';
	R3_RDT_rawSections.RAWSECTION_RID = '';
	R3_RDT_rawSections.RAWSECTION_RVD = '';
	R3_RDT_rawSections.RAWSECTION_OBJ = '';
	R3_RDT_rawSections.RAWSECTION_LIT = '';
	R3_RDT_rawSections.RAWSECTION_PRI = '';
	R3_RDT_rawSections.RAWSECTION_FLR = '';
	R3_RDT_rawSections.RAWSECTION_MSG = '';
	R3_RDT_rawSections.RAWSECTION_SCD = '';
	R3_RDT_rawSections.RAWSECTION_EFF = '';
	R3_RDT_rawSections.RAWSECTION_SND = '';
	R3_RDT_rawSections.RAWSECTION_BLK = '';
	R3_RDT_rawSections.RAWSECTION_RBJ = '';
	R3_RDT_rawSections.ORIGINAL_EFFSPR = '';
	R3_RDT_rawSections.RAWSECTION_EFFSPR = '';
	R3_RDT_rawSections.ARRAY_TIM = [];
	R3_RDT_rawSections.ARRAY_OBJ = [];
}

function R3_UTILS_VAR_CLEAN_ARD(){
	ARD_filePath = '';
	ARD_fileName = '';
	ARD_sections = [];
	ARD_fileSize = void 0;
	ARD_objectsMetadata = [];
	ARD_arquivoBruto = void 0;
	ARD_totalObjects = void 0;
}

function R3_UTILS_VAR_CLEAN_RID(){
	R3_rdtRID.cameraList = [];
}

function R3_UTILS_VAR_CLEAN_LIT(){
	LIT_lightArray = [];
	LIT_camPointers = [];
	LIT_arquivoBruto = void 0;
}

function R3_UTILS_VAR_CLEAN_TIM(){
	TIM_arquivoBruto = void 0;
	TIM_header = void 0;
	TIM_bppType = void 0;
	TIM_clutSize = void 0;
	TIM_VRAM_palleteOrgX = void 0;
	TIM_VRAM_palleteOrgY = void 0;
	TIM_colorsPerCLUT = void 0;
	TIM_totalCLUT = void 0;
	TIM_CLUT = void 0;
	TIM_RAW_IMG = void 0;
}

/*
	Window Onload
*/
window.onload = function(){
	try {
		R3_LOAD();
	} catch (err) {
		console.error(err + '\nEvent: ' + evt);
		R3_DESIGN_CRITIAL_ERROR(err);
	}
}