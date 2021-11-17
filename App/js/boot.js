/*
	*******************************************************************************
	R3ditor V2 - boot.js
	By TheMitoSan

	This file is responsible for startup process and internal functions.
	PS: This file is under sorting process!
	*******************************************************************************
*/
// Internal Vars
var R3_APP_START = false, APP_ON_BOOT = true, APP_CAN_START = true, R3_ELECTRON, APP_PATH, APP_ASSETS, APP_EXEC_PATH, APP_TOOLS, APP_TITLE, APP_IS_32 = false,
	APP_ONLINE, ORIGINAL_FILENAME, ORIGINAL_APP_PATH, APP_REQUIRE_SUCESS, APP_ENABLE_MOD = false,
	// Mod Vars
	R3_MOD_PATH, R3_MOD_NAME,
	// External Modules
	APP_FS, APP_MEMJS, APP_GUI, DiscordRPC, APP_REQUIRE_PATH, APP_CHILD_PROCESS,
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
		var eReason = '', 					   // Error reason
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
					R3_MEMJS.requireSucess = true;
				} catch (err) {
					console.error('Unable to require MemoryJS!\n' + err);
				};
			};
			APP_CHILD_PROCESS = require('child_process');
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
					tempPath = R3_tools.fixPath(APP_REQUIRE_PATH.dirname(process.execPath)) + '/R3V2';
				};
				APP_EXEC_PATH = R3_tools.fixPath(ORIGINAL_APP_PATH);
				APP_TOOLS = R3_tools.fixPath(APP_EXEC_PATH + '/Tools');
				APP_PATH = R3_tools.fixPath(tempPath) + '/R3V2';
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
		};
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
							R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to read file! <br>Reason: ' + fReader.error);
							console.error('APP_FS ERROR!\n' + fReader.error);
							R3_SYSTEM.alert('ERROR: \n' + fReader.error);
						};
					};
				},
				writeFileSync: function(path, fData, mode){
					R3_fileManager.saveFile(R3_tools.getFileName(path.name) + '.' + R3_tools.getFileExtension(path.name), fData, mode, R3_tools.getFileExtension(path.name));
				}
			};
		} catch (err) {
			R3_DESIGN_CRITIAL_ERROR(err);
		};
	};
};
// Detect browser on web-mode
function R3_WEB_checkBrowser(){
	if (R3_WEBMODE === true){
		const  uArgent = navigator.userAgent;
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
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: You are using R3ditor V2 on Android! This isn\'t recommended, since screen size aren\'t great for this tool display.');
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
		} else {
			INT_VERSION = INT_VERSION + ' [WEB]';
			APP_TITLE = APP_TITLE + ' [WEB]';
			R3_WEBMODE = true;
		};
		R3_INIT_REQUIRE();
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
		R3_SYSTEM.log('log', APP_TITLE);
		// Log args
		if (nwArgs.length !== 0){
			R3_SYSTEM.log('log', 'Run Args: <font class="user-can-select">' + nwArgs.toString().replace(RegExp(',', 'gi'), ' ') + '</font>');
		};
		R3_SYSTEM.log('separator');
		// If web, log navigator.userArgent
		if (R3_WEBMODE === true){
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Webmode) - User-Argent: <font class="user-can-select">' + navigator.userAgent + '</font>');
			R3_SYSTEM.log('separator');
			R3_SYSTEM.log('log', atob(special_day_03));
			R3_SYSTEM.log('separator');
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
	Messages
*/
// WIP Placeholder
function R3_WIP(){
	R3_SYSTEM.alert('TheMitoSan Says - THIS IS WIP! #Sorry');
	R3_SYSTEM.log('warn', 'TheMitoSan Says - THIS IS WIP! #Sorry');
};
// R3 WEB Warn
function R3_WEBWARN(){
	R3_SYSTEM.alert('WARN: This function is only available on desktop version.');
	R3_SYSTEM.log('warn', 'WARN: This function is only available on desktop version.');
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
				process.chdir(R3_tools.getFilePath(exe));
			};
			if (mode === 1){
				process.chdir(R3_MOD_PATH);
				console.info('External Executable: Running ' + exe + ' with chdir in ' + R3_MOD_PATH);
			};
			if (mode === 2){
				console.info('INFO - Skipping chdir...');
			};
			if (mode === 3){
				process.chdir(R3_tools.getFilePath(newFilePath));
				console.info('External Executable: Running ' + exe + ' with chdir in ' + R3_tools.getFilePath(newFilePath));
			};
			if (args === undefined || args === '' || args === null){
				args = [''];
			};
			RE3_PID = 0;
			const PROCESS = APP_CHILD_PROCESS.spawn(exe, args);
			EXTERNAL_APP_RUNNING = true;
			if (mode !== 0){
				RE3_PID = PROCESS.pid;
			};
			PROCESS.stdout.on('data', function(data){
				console.info(data.toString());
				R3_SYSTEM.log('log', data.toString());
			});
			PROCESS.stderr.on('data', function(data){
				console.info(data.toString());
				R3_SYSTEM.log('log', data.toString());
			});
			PROCESS.on('close', function(code){
				R3_SYSTEM.log('separator');
				EXTERNAL_APP_RUNNING = false;
				process.chdir(ORIGINAL_APP_PATH);
				if (RE3_RUNNING !== false){
					RE3_RUNNING = false;
					R3_LIVESTATUS_CLOSE_BAR();
					clearInterval(R3_MEMJS.updatePosTimer);
					if (parseInt(code) < 2){
						R3_SYSTEM.log('log', 'R3ditor V2 - INFO: The game closed with code <font class="user-can-select">' + code + '</font>');
					} else {
						R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: The game closed with code <font class="user-can-select">' + code + '</font>!');
						R3_MINIWINDOW.open(0);
					};
				} else {
					R3_SYSTEM.log('log', 'R3ditor V2 - INFO: The application closed with code <font class="user-can-select">' + code + '</font>');
				};
				return code;
			});
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: You can\'t run external software in non-windows systems!');
		};
	};
};
// Kill Process
function R3_killExternalSoftware(processID){
	if (R3_WEBMODE === false){
		try {
			if (processID !== '' && processID !== undefined && processID !== null){
				process.kill(parseInt(processID));
			} else {
				if (EXTERNAL_APP_PID !== 0 && EXTERNAL_APP_PID !== undefined){
					process.kill(EXTERNAL_APP_PID);
				};
			};
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to kill process ' + processID + '! <br>Details: ' + err);
		};
	};
};
// Run Games 
function R3_runGame(mode){
	if (R3_WEBMODE === false && R3_GAME_VERSIONS[R3_LIVESTATUS.currentMode][2] === false && R3_UPDATER_RUNNING === false){
		if (APP_FS.existsSync(R3_SETTINGS.R3_RE3_PATH) === true){
			if (mode === 0 && R3_RE3_CANRUN === true){
				R3_MEMJS.seekProcess();
				if (R3_MEMJS.processObj !== undefined){
					R3_LIVESTATUS_OPEN_BAR();
				} else {
					R3_runExec(R3_SETTINGS.R3_RE3_PATH, undefined, 0);
				};
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Resident Evil 3...');
			};
			if (mode === 1 && R3_MERCE_CANRUN === true){
				R3_runExec(R3_SETTINGS.R3_MERCE_PATH, undefined, 0);
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Mercenaries');
			};
			if (mode === 2 && R3_RE3_CANRUN === true){
				R3_MEMJS.seekProcess();
				if (R3_MEMJS.processObj !== undefined){
					R3_LIVESTATUS_OPEN_BAR();
				} else {
					R3_runExec(R3_RE3_MOD_PATH, undefined, 1);
				};
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Resident Evil 3 (Mod)');
			};
			if (mode === 3 && R3_MERCE_CANRUN === true){
				R3_runExec(R3_SETTINGS.R3_MERCE_PATH, undefined, 1);
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Game) Running Mercenaries (Mod)');
			};
			// 32-bit check
			if (APP_IS_32 !== true && R3_MEMJS.requireSucess === true && R3_MERCE_CANRUN === true && R3_RE3_CANRUN === true){
				if (mode === 0 || mode === 2){
					R3_MEMJS.seekProcess();
					R3_LIVESTATUS_OPEN_BAR();
				};
			};
		} else {
			R3_SYSTEM.log('error', 'ERROR - Unable to start game! <br>Reason: The file was not found! (404)');
		};
	} else {
		if (R3_WEBMODE === true){
			R3_WEBWARN();
		};
	};
};
/*
	SYSTEM Functions
*/
tempFn_R3_SYSTEM = {
	// Log Variables
	logText: '',
	logList: {},
	logInternal: '',
	currentLogId: 0,
	logCounter_INFO: 0,
	logCounter_WARN: 0,
	logCounter_ERROR: 0,
	RELEASE_LOG_DATA: false
};
/*
	R3_SYSTEM_PROMPT
	Prompt replace
*/
tempFn_R3_SYSTEM['prompt'] = function(txt){
	var res = window.prompt(txt);
	R3_KEYPRESS_releaseKeys();
	return res;
};
/*
	R3_SYSTEM_CONFIRM
	Confirm replace
*/
tempFn_R3_SYSTEM['confirm'] = function(conf){
	var res = window.confirm(conf);
	R3_KEYPRESS_releaseKeys();
	return res;
};
/*
	R3_SYSTEM_ALERT
	Alert system 
*/
tempFn_R3_SYSTEM['alert'] = function(msg){
	if (msg !== undefined){
		window.alert(msg);
		R3_KEYPRESS_releaseKeys();
	};
};
/*
	R3_SYSTEM_LOG
	Log system
*/
tempFn_R3_SYSTEM['log'] = function(mode, text){
	if (R3_SETTINGS.SETTINGS_DISABLE_LOG === false && R3_SETTINGS.R3_NW_ARGS_DISABLE_LOG === false){
		var lastLog, isSeparator = false, HTML_LOG_TEMPLATE = logCSS = textClean = '', canLog = true,
			defaultCheck = [undefined, '', 'log', 'ok', 'info'];
		if (text === undefined){
			text = '';
		};
		if (R3_SYSTEM.log_RESET === true){
			document.getElementById('R3_LOG_HOLDER').innerHTML = '';
			R3_SYSTEM.log_RESET = false;
		} else {
			textClean = R3_tools.removeHtmlFromString(text);
		};
		// Avoid eNGE null messages
		if (textClean === 'R3ditor V2 - INFO: (eNGE) \n'){
			textClean = text = '';
			canLog = false;
		};
		lastLog = R3_SYSTEM.logList[(R3_SYSTEM.currentLogId - 1)];
		if (lastLog !== undefined && lastLog.type === 'separator' && mode === 'separator'){
			canLog = false;
		};
		/*
			Final checks
		*/
		if (canLog === true){
			if (defaultCheck.indexOf(mode) !== -1){
				logCSS = 'R3_LOG_OK';
				R3_SYSTEM.logCounter_INFO++;
			};
			if (mode === 'warn'){
				console.warn(textClean);
				logCSS = 'R3_LOG_WARN';
				R3_SYSTEM.logCounter_WARN++;
			};
			if (mode === 'error'){
				console.error(textClean);
				logCSS = 'R3_LOG_ERROR';
				R3_SYSTEM.logCounter_ERROR++;
			};
			if (mode === 'separator'){
				isSeparator = true;
				textClean = SYSTEM_LOG_SEPARATOR_TEXT;
				HTML_LOG_TEMPLATE = '<div id="R3_LOG_ID_N_' + R3_SYSTEM.currentLogId + '" class="SEPARATOR-3"></div>';
			} else {
				HTML_LOG_TEMPLATE = '<div id="R3_LOG_ID_N_' + R3_SYSTEM.currentLogId + '" class="R3_LOG_ITEM ' + logCSS + '">' + text + '</div>';
			};
			// Open on warn / error
			if (mode === 'warn' || mode === 'error'){
				if (R3_SETTINGS.SETTINGS_OPEN_LOG_ON_WARN_ERROR === true){
					R3_MINIWINDOW.open(0);
				};
			};
			/*
				End
			*/
			R3_SYSTEM.logText = R3_SYSTEM.logText + textClean + '\n';
			R3_SYSTEM.logInternal = R3_SYSTEM.logInternal + HTML_LOG_TEMPLATE;
			R3_SYSTEM.logList[R3_SYSTEM.currentLogId] = {type: mode, message: text};
			R3_SYSTEM.RELEASE_LOG_DATA = true;
			R3_SYSTEM.currentLogId++;
			// Execute log if window is opened
			if (R3_MINI_WINDOW_DATABASE[0][5] === true){
				R3_SYSTEM.appendLog();
			};
		};
	} else {
		if (text !== undefined){
			if (mode === undefined || mode.toLowerCase() === 'log'){
				console.info(R3_tools.removeHtmlFromString(text));
			};
			if (mode.toLowerCase() === 'warn'){
				console.warn(R3_tools.removeHtmlFromString(text));
			};
			if (mode.toLowerCase() === 'error'){
				console.error(R3_tools.removeHtmlFromString(text));
			};
		};
	};
};
// Append log
tempFn_R3_SYSTEM['appendLog'] = function(){
	if (R3_SYSTEM.RELEASE_LOG_DATA === true){
		document.getElementById('R3_LOG_HOLDER').innerHTML = R3_SYSTEM.logInternal;
		document.getElementById('R3_LOG_HOLDER').scrollTop = document.getElementById('R3_LOG_HOLDER').scrollHeight;
		document.getElementById('R3V2_TITLE_LOG_WINDOW').innerHTML = 'R3ditor V2 Log <i>[' + R3_SYSTEM.logCounter_INFO + ' Infos, ' + R3_SYSTEM.logCounter_WARN + ' Warns and ' + R3_SYSTEM.logCounter_ERROR + ' Errors]</i>';
		R3_SYSTEM.RELEASE_LOG_DATA = false;
	};
};
// Clear Log R3_SYSTEM_CLEAR_LOG
tempFn_R3_SYSTEM['clearLog'] = function(resetConsole){
	R3_SYSTEM.logList = {};
	R3_SYSTEM.logText = R3_SYSTEM.logInternal = '';
	document.getElementById('R3_LOG_HOLDER').innerHTML = '';
	R3_SYSTEM.currentLogId = R3_SYSTEM.logCounter_INFO = R3_SYSTEM.logCounter_WARN = R3_SYSTEM.logCounter_ERROR = 0;
	R3_SYSTEM.log('log', 'R3ditor V2 - The log was cleared');
	R3_SYSTEM.log('separator');
	if (resetConsole === true){
		console.clear();
	};
};
// Save Log R3_SYSTEM_SAVE_LOG
tempFn_R3_SYSTEM['saveLog'] = function(){
	if (R3_SYSTEM.log_TEXT !== ''){
		R3_fileManager.saveFile('R3V2_LOG.log', R3_SYSTEM_LOG_TEXT, 'utf-8', '.log', function(finalFile){
			var finalLbl = '';
			if (R3_WEBMODE === false){
				finalLbl = 'Path: <font class="user-can-select">' + finalFile + '</font>';
			};
			R3_SYSTEM.log('separator');
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Save complete! ' + finalLbl);
		});
	};
};
// Open file in Hex Editor R3_SYSTEM.openInHex
tempFn_R3_SYSTEM['openInHex'] = function(){
	if (R3_WEBMODE === false){
		if (APP_FS.existsSync(R3_SETTINGS.R3_HEX_PATH) !== false && APP_FS.existsSync(ORIGINAL_FILENAME) !== false){
			R3_runExec(R3_SETTINGS.R3_HEX_PATH, [ORIGINAL_FILENAME]);
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to open file in hex, since the Hex Viewer or file was not found!');
		};
	} else {
		R3_WEBWARN();
	};
};
// Reload App R3_RELOAD
tempFn_R3_SYSTEM['reload'] = function(){
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
const R3_SYSTEM = tempFn_R3_SYSTEM;
delete tempFn_R3_SYSTEM;
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
	R3_RDT_MAP_totalCams = 0;
	R3_RDT_currentTimFile = 0;
	RDT_arquivoBruto = undefined;
	R3_RDT_MAP_HEADER = undefined;
	R3_RDT_MAP_HEADER_POINTERS = [];
	// Raw Sections
	R3_RDT_rawSections = {
		RAWSECTION_VB: '', 	   ORIGINAL_VB: '',
		RAWSECTION_SCA: '',    ORIGINAL_SCA: '',
		RAWSECTION_RID: '',    ORIGINAL_RID: '',
		RAWSECTION_RVD: '',    ORIGINAL_RVD: '',
		RAWSECTION_OBJ: '',    ORIGINAL_OBJ: '',
		RAWSECTION_LIT: '',    ORIGINAL_LIT: '',
		RAWSECTION_PRI: '',    ORIGINAL_PRI: '',
		RAWSECTION_FLR: '',    ORIGINAL_FLR: '',
		RAWSECTION_MSG: '',    ORIGINAL_MSG: '',
		RAWSECTION_SCD: '',    ORIGINAL_SCD: '',
		RAWSECTION_EFF: '',    ORIGINAL_EFF: '',
		RAWSECTION_SND: '',    ORIGINAL_SND: '',
		RAWSECTION_BLK: '',    ORIGINAL_BLK: '',
		RAWSECTION_RBJ: '',    ORIGINAL_RBJ: '',
		RAWSECTION_EFFSPR: '', ORIGINAL_EFFSPR: '',
		ARRAY_TIM: [],
		ARRAY_OBJ: []
	};
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
	R3_rdtRID.cameraList = [];
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