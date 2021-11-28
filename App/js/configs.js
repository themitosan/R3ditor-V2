/*
	*******************************************************************************
	R3ditor V2 - configs.js
	By TheMitoSan

	This file is responsible for storing all functions / variables related to 
	main app settings.
	*******************************************************************************
*/
var R3_SETTINGS = {
		// Paths
		'R3_RE3_PATH': '',
		'R3_HEX_PATH': '',
		'R3_MERCE_PATH': '',
		'R3_RE3MV_PATH': '',
		'R3_RE3_MOD_PATH': '',
		'R3_RE3SLDE_PATH': '',
		'R3_RE3PLWE_PATH': '',
		// General
		'APP_useImageFix': false,
		'ENABLE_ANIMATIONS': false,
		'SETTINGS_USE_DISCORD': false,
		'SETTINGS_MOVE_WINDOW': false,
		'SETTINGS_DISABLE_LOG': false,
		'SETTINGS_SCD_EDITOR_MODE': 0,
		'SETTINGS_DISABLE_ENGE': true,
		'SETTINGS_ENGE_WIDTH_RES': 640,
		'SETTINGS_ENGE_HEIGHT_RES': 480,
		'SETTINGS_ENABLE_RE3SLDE': false,
		'SETTINGS_LIVESTATUS_BAR_POS': 0,
		'SETTINGS_SCD_HEXVIEW_FACTOR': 1,
		'SETTINGS_OPEN_LOG_STARTUP': true,
		'SETTINGS_MSG_DECOMPILER_MODE': 3,
		'SETTINGS_ENABLE_MOVE_SCREEN_ID': 0,
		'SETTINGS_ENABLE_FULLSCREEN': false,
		'SETTINGS_ENABLE_MOVE_SCREEN': false,
		'SETTINGS_SHORTCUT_CLOSETOOL': false,
		'SETTINGS_DISPLAY_POSITION_INT': false,
		'SETTINGS_DISABLE_RDT_BACKGROUND': false,
		'SETTINGS_OPEN_LOG_ON_WARN_ERROR': false,
		'SETTINGS_SCD_HOVER_FUNCTION_HEX': false,
		'SETTINGS_SCD_SELECT_HEX_AS_TEXT': false,
		'SETTINGS_SCD_FOCUS_FUNCTION_CLICK': false,
		'SETTINGS_SCD_DECOMPILER_SHOWOPCODE': false,
		'SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR': false,
		'SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST': false,
		'SETTINGS_SCD_DECOMPILER_ENABLE_LOG': false,
		'SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST': false,
		'SETTINGS_SHOW_LAST_FILE_OPENED_POPUP': true,
		'SETTINGS_LIVESTATUS_ENABLE_GAME_DISCOVER': true,
		'SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS': false,
		'SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS': false,
		'SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE': false,
		'SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM': false,
		'SETTINGS_ENGE_BIOS_PATH': '',
		'SETTINGS_RECENT_FILE_NAME': '',
		'SETTINGS_RECENT_FILE_TYPE': 0,
		'SETTINGS_RECENT_FILE_PATH': '',
		'RE3_LIVE_RENDER_TIME': 60,
		// Args variables
		'R3_NW_ARGS_DISABLE_DISCORD': false,
		'R3_NW_ARGS_DISABLE_MOVE_SCREEN': false,
		'R3_NW_ARGS_OVERWRITE_MOVE_SCREEN': false,
		'R3_NW_ARGS_DISABLE_DOORLINK': false,
		'R3_NW_ARGS_DISABLE_LOG': false,
		'R3_NW_ARGS_DISABLE_ENGE': false
	}, R3_SETTINGS_LOADING = false;
/*
	Functions
*/
// Check Path and Files
function R3_LOAD_CHECKFILES(){
	if (R3_SYSTEM.web.isBrowser === false){
		try {
			// Path
			const DATABASE_INIT_CREATE_FOLDER = [
				R3_SYSTEM.paths.mod,
				R3_SYSTEM.paths.mod + '/Assets',
				R3_SYSTEM.paths.mod + '/Update',
				R3_SYSTEM.paths.mod + '/Configs',
				R3_SYSTEM.paths.mod + '/Assets/Save',
				R3_SYSTEM.paths.mod + '/Configs/Backup',
				R3_SYSTEM.paths.mod + '/Configs/Backup/RDT'
			],
			DATABASE_INIT_DELETE_FILES = [
				R3_SYSTEM.paths.mod + '/Update/Update.zip',
				R3_SYSTEM.paths.tools + '/XDELTA_PATCH_FILE.bin'
			];
			// Create Paths
			DATABASE_INIT_CREATE_FOLDER.forEach(function(foldePath){
				if (R3_MODULES.fs.existsSync(foldePath) !== true){
					R3_MODULES.fs.mkdirSync(foldePath);
				};
			});
			/*
				Delete Files
				Will run on Windows and Linux
			*/
			if (process.platform !== 'darwin'){
				DATABASE_INIT_DELETE_FILES.forEach(function(deleteFile){
					if (R3_MODULES.fs.existsSync(deleteFile) === true){
						R3_MODULES.fs.unlinkSync(deleteFile);
					};
				});
			};
			// Init Backup System
			R3_BACKUP_MANAGER_LOAD();
		} catch (err) {
			R3_DESIGN_CRITIAL_ERROR(err);
		};
	};
};
// Load Settings
function R3_LOAD_SETTINGS(){
	try {
		// Load
		var requestSave = false, fPath = R3_SYSTEM.paths.mod + '/Configs/configs.R3V2', settingsJson = {};
		if (R3_SYSTEM.web.isBrowser === false){
			if (R3_MODULES.fs.existsSync(fPath) === true){
				settingsJson = JSON.parse(R3_MODULES.fs.readFileSync(fPath, 'utf-8'));
			} else {
				requestSave = true;
			};
		} else {
			if (localStorage.getItem('R3V2_SETTINGS') !== null){
				settingsJson = JSON.parse(localStorage.getItem('R3V2_SETTINGS'));
			} else {
				requestSave = true;
			};
		};
		// Check if need to generate settings
		if (requestSave === false){
			R3_SETTINGS = settingsJson;
			// Fix eNGE Bios
			R3_SETTINGS.SETTINGS_ENGE_BIOS_PATH = R3_SYSTEM.paths.mod + '/Configs/PS_BIOS.R3V2';
			R3_LOAD_PROCESS_SETTINGS();
		} else {
			R3_SETTINGS_SAVE(true);
		};
	} catch (err) {
		R3_DESIGN_CRITIAL_ERROR(err);
	};
};
// Process other load settings
function R3_LOAD_PROCESS_SETTINGS(){
	R3_SETTINGS_LOADING = true;
	var modPathTest;
	R3_DESIGN_loadSettingsGUI();
	// Process args
	if (APP_ON_BOOT === true){
		R3_INIT_PROCESS_ARGS();
	};
	// Move Window
	if (R3_SETTINGS.SETTINGS_MOVE_WINDOW !== false){
		window.moveTo(0, 0);
	};
	// Open Log at startup
	if (APP_ON_BOOT === true && R3_SETTINGS.SETTINGS_OPEN_LOG_STARTUP !== false){
		R3_MINIWINDOW.open(0);
	};
	// NW Checks
	if (R3_SYSTEM.web.isBrowser === false){
		// Init discord rich presence
		R3_DISCORD_INIT();
		// Check for Mod
		if (R3_MODULES.fs.existsSync(R3_MOD_PATH + '/Bio3.ini') === true){
			APP_ENABLE_MOD = true;
		} else {
			APP_ENABLE_MOD = false;
		};
		// Check if Executable Exists (RE3)
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.R3_RE3_PATH) === true){
			R3_RE3_CANRUN = true;
			if (APP_ENABLE_MOD === true && R3_GAME_VERSIONS[R3_LIVESTATUS.currentMode][2] === false){
				R3_RE3_MOD_PATH = R3_SYSTEM.paths.mod + '/Assets/' + R3_GAME_VERSIONS[R3_LIVESTATUS.currentMode][3];
			};
		};
		// Check MERCE path
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.R3_MERCE_PATH) === true){
			R3_MERCE_CANRUN = true;
		};
		// RE3SDLE Path
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.R3_RE3SLDE_PATH) === true){
			SETTINGS_ENABLE_RE3SLDE = true;
		};
		// Check for game mode paths
		R3_SETTINGS_getMapPrefix();
		// Disable Discord
		if (R3_SETTINGS.SETTINGS_USE_DISCORD !== true){
			R3_DISC_clearActivity();
		};
		// Set Recent File
		R3_DESIGN_UPDATE_LATEST_LABELS();
		R3_SETTINGS_ENGE_LOAD_BIOS();
		R3_DOORLINK.checkDatabase();
	} else {
		// Variables
		APP_ENABLE_MOD = false;
		SETTINGS_USE_DISCORD = false;
		SETTINGS_ENABLE_RE3SLDE = false;
	};
	/*
		MOD Path Fixes
	*/
	modPathTest = R3_MOD_PATH.slice(parseInt(R3_MOD_PATH.length - 1), R3_MOD_PATH.length);
	if (modPathTest === '/' || modPathTest === '\\'){
		R3_MOD_PATH = R3_MOD_PATH.slice(0, parseInt(R3_MOD_PATH.length - 1));
	};
	/*
		End
	*/
	if (APP_ON_BOOT === true){
		// Move windows to another display
		if (R3_SETTINGS.SETTINGS_ENABLE_MOVE_SCREEN === true && R3_SETTINGS.R3_NW_ARGS_OVERWRITE_MOVE_SCREEN === false){
			R3_SYSTEM_moveWindowToScreen(SETTINGS_ENABLE_MOVE_SCREEN_ID);
		};
		document.getElementById('R3_RDT_FILELIST_GAMEMODE').value = 1;
		R3_RDT_FILELIST_UPDATELIST();
		R3_DOORLINK.checkDatabase();
		R3_DESIGN_ADJUST();
		setTimeout(function(){
			R3_GOTO_MAIN();
		}, 1400);
	};
	R3_SETTINGS_LOADING = false;
};
// Post-boot action
function R3_LOAD_CHECK_EXTRA(){
	R3_DESIGN_CHECKRES();
	// Try to detect if game is open
	if (R3_SYSTEM.web.isBrowser === false && R3_MEMJS.requireSucess === true){
		R3_MEMJS.checkIfGameIsRunning();
	};
	// One of the best musics from EW&F! (Do you remember...)
	if (R3_tools.getDate(2) === '09' && R3_tools.getDate(1) === '28'){
		APP_CAN_RENDER_DEV = false;
		const diff = (parseInt(R3_tools.getDate(3)) - 1999);
		R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', atob(FG_HIDDENSTRINGS[0][0]) + diff + atob(FG_HIDDENSTRINGS[0][1]), 'RE3', 140);
	} else {
		R3_WEB_ALERT();
	};
	R3_POSTBOOT();
};
// Function to be overwritten by debug.js
function R3_POSTBOOT(){};
// Save Settings
function R3_SAVE_SETTINGS(reload, logSaving){
	R3_LOAD_CHECKFILES();
	// Get eNGE Res.
	R3_ENGE_updateResVars();
	const newConfigFile = JSON.stringify(R3_SETTINGS);
	// Save Data
	try {
		if (R3_SYSTEM.web.isBrowser === false){
			R3_MODULES.fs.writeFileSync(R3_SYSTEM.paths.mod + '/Configs/configs.R3V2', newConfigFile, 'utf-8');
		} else {
			localStorage.setItem('R3V2_SETTINGS', newConfigFile);
		};
		if (logSaving !== false){
			R3_SYSTEM.log('log', 'R3ditor V2 - Settings: Saving changes...');
		};
		if (reload === true){
			R3_SYSTEM.reload();
		};
	} catch (err) {
		R3_SYSTEM.log('error', 'ERROR - Unable to save settings!\nReason: ' + err);
	};
};
/*
	Settings Form Functions
*/
// Save Settings
function R3_SETTINGS_SAVE(){
	R3_SAVE_SETTINGS(false, false);
	if (RE3_RUNNING === false){
		R3_MENU_GOBACK();
	};
	R3_LOAD_PROCESS_SETTINGS();
};
// Update checkbox
function R3_SETTINGS_UPDATE_CHECKBOX(){
	R3_SETTINGS.SETTINGS_MOVE_WINDOW = JSON.parse(document.getElementById('R3_SETTINGS_MOVE_CORNER').checked);
	R3_SETTINGS.SETTINGS_DISABLE_LOG = JSON.parse(document.getElementById('R3_SETTINGS_DISABLE_LOG').checked);
	R3_SETTINGS.SETTINGS_DISABLE_ENGE = JSON.parse(document.getElementById('R3_SETTINGS_DISABLE_ENGE').checked);
	R3_SETTINGS.ENABLE_ANIMATIONS = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_ANIMATIONS').checked);
	R3_SETTINGS.SETTINGS_USE_DISCORD = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_DISCORD').checked);
	R3_SETTINGS.SETTINGS_OPEN_LOG_STARTUP = JSON.parse(document.getElementById('R3_SETTINGS_OPEN_LOG_STARTUP').checked);
	R3_SETTINGS.SETTINGS_ENABLE_FULLSCREEN = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_FULLSCREEN').checked);
	R3_SETTINGS.SETTINGS_DISPLAY_POSITION_INT = JSON.parse(document.getElementById('R3_SETTINGS_DISPLAY_POS_INT').checked);
	R3_SETTINGS.SETTINGS_ENABLE_MOVE_SCREEN = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_STARTUP_SCREEN').checked);
	R3_SETTINGS.SETTINGS_SHORTCUT_CLOSETOOL = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_SHORTCUT_CLOSETOOL').checked);
	R3_SETTINGS.SETTINGS_DISABLE_RDT_BACKGROUND = JSON.parse(document.getElementById('R3_SETTINGS_DISABLE_RDT_BACKGROUND').checked);
	R3_SETTINGS.SETTINGS_SCD_HOVER_FUNCTION_HEX = JSON.parse(document.getElementById('R3_SETTINGS_SCD_HOVER_FUNCTION_HEX').checked);
	R3_SETTINGS.SETTINGS_OPEN_LOG_ON_WARN_ERROR = JSON.parse(document.getElementById('R3_SETTINGS_OPEN_LOG_ON_WARN_ERROR').checked);
	R3_SETTINGS.SETTINGS_SHOW_LAST_FILE_OPENED_POPUP = JSON.parse(document.getElementById('R3_SETTINGS_SHOW_RECENT_POPUP').checked);
	R3_SETTINGS.SETTINGS_SCD_SELECT_HEX_AS_TEXT = JSON.parse(document.getElementById('R3_SETTINGS_SCD_SELECT_HEX_FUNCTION').checked);
	R3_SETTINGS.SETTINGS_SCD_FOCUS_FUNCTION_CLICK = JSON.parse(document.getElementById('R3_SETTINGS_SCD_FOCUS_FUNCTION_CLICK').checked);
	R3_SETTINGS.SETTINGS_SCD_DECOMPILER_ENABLE_LOG = JSON.parse(document.getElementById('R3_SETTINGS_SCD_LOG_WHILE_DECOMPILING').checked);
	R3_SETTINGS.SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST = JSON.parse(document.getElementById('R3_SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST').checked);
	R3_SETTINGS.SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR = JSON.parse(document.getElementById('R3_SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR').checked);
	R3_SETTINGS.SETTINGS_LIVESTATUS_ENABLE_GAME_DISCOVER = JSON.parse(document.getElementById('R3_SETTINGS_LIVESTATUS_DISCOVER').checked);
	R3_SETTINGS.SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST = JSON.parse(document.getElementById('R3_SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST').checked);
	R3_SETTINGS.SETTINGS_SCD_DECOMPILER_SHOWOPCODE = JSON.parse(document.getElementById('R3_SETTINGS_SCD_LOG_SHOW_OPCODE_FUNCIONS').checked);
	R3_SETTINGS.SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE = JSON.parse(document.getElementById('R3_SETTINGS_SCD_JS_COMPILER_KEEP_FILE').checked);
	R3_SETTINGS.SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS = JSON.parse(document.getElementById('R3_SETTINGS_MSG_DISABLE_SHORTCUTS_NEXT_PREV').checked);
	R3_SETTINGS.SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS = JSON.parse(document.getElementById('R3_SETTINGS_SCD_DISABLE_SHORTCUTS_NEXT_PREV').checked);
	R3_SETTINGS.SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM = JSON.parse(document.getElementById('R3_SETTINGS_SCD_SNAP_SEARCH_EDIT_FORM').checked);
	// Process selection
	R3_DESIGN_processSettingsChanges();
};
// Update select
function R3_SETTINGS_UPDATE_SELECT(){
	R3_LIVESTATUS.currentMode = parseInt(document.getElementById('R3_SETTINGS_RE3_VERSION').value);
	R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE = parseInt(document.getElementById('R3_SETTINGS_SCD_EDITOR_MODE').value);
	R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE = parseInt(document.getElementById('R3_SETTINGS_MSG_DATABASE_MODE').value);
	R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS = parseInt(document.getElementById('R3_SETTINGS_LIVESTATUS_POSITION').value);
	R3_SETTINGS.SETTINGS_SCD_HEXVIEW_FACTOR = parseFloat(document.getElementById('R3_SETTINGS_SCD_HEX_VIEW_SIZE').value);
	R3_SETTINGS.SETTINGS_ENABLE_MOVE_SCREEN_ID = parseInt(document.getElementById('SETTINGS_ENABLE_MOVE_DISPLAY_SELECT').value);
};
// Update ranges
function R3_SETTINGS_UPDATE_RANGE(mode){
	if (mode === 0){
		var newValue = document.getElementById('R3_SETTINGS_RANGE_LIVETSTATUS_FREQUENCY').value;
		document.getElementById('R3_SETTINGS_LIVETSTATUS_FREQUENCY').innerHTML = newValue;
		R3_SETTINGS.RE3_LIVE_RENDER_TIME = newValue;
	};
};
// Set Executable Path
function R3_SETTINGS_SET_PATH(mode){
	if (mode !== 4){
		if (mode !== 5){
			R3_fileManager.loadFile('.exe', function(pathFuture){
				var fixPath = R3_tools.fixPath(pathFuture);
				if (mode === 0){
					// R3_SETTINGS_RE3_PATH
					R3_SETTINGS.R3_RE3_PATH = fixPath;
					document.getElementById('R3_SETTINGS_RE3_PATH').innerHTML = R3_SETTINGS.R3_RE3_PATH;
				};
				if (mode === 1){
					// R3_SETTINGS_MERCE_PATH
					R3_SETTINGS.R3_MERCE_PATH = fixPath;
					document.getElementById('R3_SETTINGS_MERCE_PATH').innerHTML = R3_SETTINGS.R3_MERCE_PATH;
				};
				if (mode === 2){
					// R3_SETTINGS_HEX_PATH
					R3_SETTINGS.R3_HEX_PATH = fixPath;
					document.getElementById('R3_SETTINGS_HEX_PATH').innerHTML = R3_SETTINGS.R3_HEX_PATH;
				};
				if (mode === 3){
					// R3_SETTINGS_RE3SLDE_PATH
					R3_SETTINGS.R3_RE3SLDE_PATH = fixPath;
					document.getElementById('R3_SETTINGS_RE3SLDE_PATH').innerHTML = R3_SETTINGS.R3_RE3SLDE_PATH;
				};
				// R3_SETTINGS_RE3MV_PATH
				if (mode === 6){
					R3_SETTINGS.R3_RE3MV_PATH = fixPath;
					document.getElementById('R3_SETTINGS_RE3MV_PATH').innerHTML = R3_SETTINGS.R3_RE3MV_PATH;
				};
				// R3_SETTINGS_RE3PLWE_PATH
				if (mode === 7){
					R3_SETTINGS.R3_RE3PLWE_PATH = fixPath;
					document.getElementById('R3_SETTINGS_RE3PLWE_PATH').innerHTML = R3_SETTINGS.R3_RE3PLWE_PATH;
				};
			});
		} else {
			R3_fileManager.loadFile('.R3V2', function(biosPath){
				R3_SETTINGS.SETTINGS_ENGE_BIOS_PATH = R3_tools.fixPath(biosPath);
				document.getElementById('R3_SETTINGS_eNGE_BIOS_PATH').innerHTML = R3_SETTINGS.SETTINGS_ENGE_BIOS_PATH;
			});
		};
	} else {
		R3_fileManager.selectPath(function(pathFuture){
			var fileCheck = pathFuture + '/bio3.ini';
			if (R3_MODULES.fs.existsSync(fileCheck) === true){
				R3_MOD_PATH = fileCheck.slice(0, (fileCheck.length - 8));
				document.getElementById('R3_SETTINGS_MOD_PATH').innerHTML = R3_MOD_PATH;
			} else {
				R3_SYSTEM.alert('WARN - You selected the wrong path!\nPlease select a path that haves Resident Evil 3 config file! (Bio3.ini)');
			};
		});
	};
};
// Generate prefix for map paths [DATA_AU, DATA_E, DATA_AJ]
function R3_SETTINGS_getMapPrefix(){
	if (R3_SYSTEM.web.isBrowser === false){
		// Easy
		var mPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_EASY + '/RDT/';
		if (R3_MODULES.fs.existsSync(mPath) !== true){
			console.info('INFO: DATA_AJ does not exist! Switching to DATA_AU');
			R3_RDT_PREFIX_EASY = 'DATA_AU';
		};
		// Hard
		mPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_HARD + '/RDT/';
		if (R3_MODULES.fs.existsSync(mPath) !== true){
			console.info('INFO: DATA_E does not exist! Switching to DATA_U');
			R3_RDT_PREFIX_EASY = 'DATA_U';
		};
		// End
		document.getElementById('R3_RDT_IMPORT_EASY_PREFIX').innerHTML = R3_RDT_PREFIX_EASY;
		document.getElementById('R3_RDT_IMPORT_HARD_PREFIX').innerHTML = R3_RDT_PREFIX_HARD;
		document.getElementById('R3_LBL_IMPORT_EASY').title = 'Set this option enabled to import your new map to easy mode (' + R3_RDT_PREFIX_EASY + ')';
		document.getElementById('R3_LBL_IMPORT_HARD').title = 'Set this option enabled to import your new map to hard mode (' + R3_RDT_PREFIX_HARD + ')';
	};
};
/*
	eNGE Settings Functions
*/
// Load bios while R3V2 initial setup
function R3_SETTINGS_ENGE_LOAD_BIOS(){
	if (R3_SETTINGS.SETTINGS_DISABLE_ENGE !== true && R3_SETTINGS.R3_NW_ARGS_DISABLE_ENGE !== true){
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.SETTINGS_ENGE_BIOS_PATH) === true){
			SETTINGS_ENGE_BIOS = R3_MODULES.fs.readFileSync(R3_SETTINGS.SETTINGS_ENGE_BIOS_PATH, 'hex');
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: (eNGE) unable to load bios (The file was not found!)');
		};
	};
};
// Update Res. Size
function R3_ENGE_updateResScale(mode){
	var videoX, videoY = parseInt(document.getElementById('R3_SETTINGS_ENGE_HEIGHT').value);
	if (mode === 0){
		videoX = parseInt(document.getElementById('R3_ENGE_SETTINGS_SCALER').value);
	} else {
		videoX = parseInt(document.getElementById('R3_SETTINGS_ENGE_WIDTH').value);
	};
	videoY = R3_tools.parsePSRes(0, videoX);
	// Apply values
	document.getElementById('R3_SETTINGS_ENGE_WIDTH').value = videoX;
	document.getElementById('R3_SETTINGS_ENGE_HEIGHT').value = videoY;
	R3_ENGE_updateResVars();
};
// Update Res. Vars
function R3_ENGE_updateResVars(){
	var vW = parseInt(document.getElementById('R3_SETTINGS_ENGE_WIDTH').value),
		vH = parseInt(document.getElementById('R3_SETTINGS_ENGE_HEIGHT').value);
	if (vW === NaN || vW === '' || vW < 360){
		vW = 360;
	};
	if (vH === NaN || vH === '' || vH < 317){
		vH = 317;
	};
	R3_SETTINGS.SETTINGS_ENGE_WIDTH_RES = vW;
	R3_SETTINGS.SETTINGS_ENGE_HEIGHT_RES = vH;
	TMS.css('R3V2_MINI_WINDOW_13', {'width': R3_SETTINGS.SETTINGS_ENGE_WIDTH_RES, 'height': R3_SETTINGS.SETTINGS_ENGE_HEIGHT_RES});
};
/*
	Database Functions
*/
function R3_INIT_generateSelectValues(db, mode, prevHTML, limit){
	var modeType, TEMP_STR = currentHex = '', tempAttr = Object.keys(db), maxLimit = tempAttr.length;
	if (prevHTML !== undefined && prevHTML !== ''){
		TEMP_STR = prevHTML;
	};
	if (limit !== undefined && parseInt(limit) !== NaN){
		maxLimit = parseInt(limit);
	};
	// Start Madness
	for (var c = 0; c < maxLimit; c++){
		// Modes
		if (mode === 'hex'){
			modeType = R3_tools.fixVars(tempAttr[c], 2);
			TEMP_STR = TEMP_STR + '<option value="' + modeType + '">(' + modeType.toUpperCase() + ') ' + db[modeType][0] + '</option>';
		};
		// Item
		if (mode === 'item'){
			modeType = R3_tools.fixVars(c.toString(16), 2);
			TEMP_STR = TEMP_STR + '<option value="' + modeType + '">(' + modeType.toUpperCase() + ') ' + db[modeType][0] + '</option>';
		};
		// Files
		if (mode === 'files'){
			modeType = R3_tools.fixVars(tempAttr[c], 2);
			TEMP_STR = TEMP_STR + '<option value="' + modeType + '">(' + modeType.toUpperCase() + ') ' + db[modeType] + '</option>';
		};
		// Set Variables
		if (mode === 'set'){
			modeType = tempAttr[c];
			TEMP_STR = TEMP_STR + '<option value="' + modeType + '">(' + modeType.toUpperCase() + ') ' + db[modeType] + '</option>';
		};
		// Preset button
		if (mode === 'presetBtn'){
			TEMP_STR = TEMP_STR + '<input type="button" class="SCD_FUNCTION_BUTTON" value="' + db[c][0] + '" onclick="R3_SCD_usePreset(' + c + ');">';
		};
		// Special CK
		if (mode === 'ckSpecial'){
			TEMP_STR = TEMP_STR + '<option value="' + tempAttr[c] + '">(' + tempAttr[c] + ') ' + db[tempAttr[c]] + '</option>';
		};
	};
	return TEMP_STR;
};
// Generate Database
function R3_INIT_DATABASE_GENERATE(){
	// Check for Web
	if (R3_SYSTEM.web.isBrowser === false){
		R3_MOD_PATH = R3_SYSTEM.paths.mod + '/Assets';
	} else {
		R3_MOD_PATH = '';
	};
	var tempAttr, TEMP_STR = currentHex = '';
	// Item
	INCLUDE_EDIT_ITEM = R3_INIT_generateSelectValues(DATABASE_ITEM, 'item');
	// Item Attr
	INCLUDE_EDIT_ATTR = R3_INIT_generateSelectValues(DATABASE_ITEM_ATTR, 'hex');
	// Files
	INCLUDE_EDIT_FILE = R3_INIT_generateSelectValues(DATABASE_FILES, 'files', '<option disabled="disabled"></option><option disabled="disabled">Files</option><option disabled="disabled"></option>');
	// Maps
	INCLUDE_EDIT_MAP = R3_INIT_generateSelectValues(DATABASE_MAPS, 'files', '<option disabled="disabled"></option><option disabled="disabled">Maps</option><option disabled="disabled"></option>');
	// Weapons
	INCLUDE_EDIT_WEAPON = R3_INIT_generateSelectValues(DATABASE_ITEM, 'item', '', 21);
	// SCD Set Event Value [SET] Values
	INCLUDE_EDIT_SCD_SET_VALUES = R3_INIT_generateSelectValues(R3_SCD_SET_VALUES, 'set');
	// SCD Char Trigger [WORK_SET] Targets
	INCLUDE_EDIT_SCD_WORK_SET_TARGET = R3_INIT_generateSelectValues(R3_SCD_WORK_SET_TARGET, 'set');
	// SCD PLC_DEST Animations
	INCLUDE_EDIT_SCD_PLC_DEST_ANIMATIONS = R3_INIT_generateSelectValues(R3_SCD_PLC_DEST_ANIMATIONS, 'hex');
	// SCD EM_SET Types
	INCLUDE_EDIT_SCD_EM_SET_TYPES = R3_INIT_generateSelectValues(RDT_EMDNAME, 'files');
	// SCD EM_SET Pose
	INCLUDE_EDIT_SCD_EM_SET_POSE = R3_INIT_generateSelectValues(RDT_EMDPOS, 'files');
	// SCD AOT TYPES
	INCLUDE_EDIT_AOT_TYPES = R3_INIT_generateSelectValues(R3_SCD_AOT_TYPES, 'hex');
	// SCD Display modes
	INCLUDE_EDIT_SCD_MSG_DISPLAYMODE = R3_INIT_generateSelectValues(R3_SCD_MSG_DISPLAYMODE, 'set');
	// SCD CK Types
	INCLUDE_EDIT_SCD_CK_TYPES = R3_INIT_generateSelectValues(R3_SCD_CK_VARS, 'set');
	// SCD FADE_SET Types
	INCLUDE_EDIT_SCD_FADE_TYPES = R3_INIT_generateSelectValues(R3_SCD_FADE_SET_TYPES, 'set');
	// SCD PLC_NECK Animations
	INCLUDE_EDIT_SCD_PLC_NECK_ANIMATIONS = R3_INIT_generateSelectValues(R3_SCD_PLC_NECK_ANIMATIONS, 'hex');
	// SCD SET_TIMER Targets
	INCLUDE_EDIT_SCD_SET_TIMER_TARGET = R3_INIT_generateSelectValues(R3_SCD_SET_TIMER_TARGET, 'set');
	// CALC_OP Operations
	INCLUDE_EDIT_SCD_CALC_OP_OPERATIONS = R3_INIT_generateSelectValues(R3_SCD_CALC_OP_OPERATIONS, 'set');
	// SCD Preset List
	INCLUDE_EDIT_SCD_PRESET_LIST = R3_INIT_generateSelectValues(R3_SCD_PRESET_LIST, 'presetBtn');
	// SCD CK Special conditions
	INCLUDE_EDIT_SCD_CK_SPECIAL = R3_INIT_generateSelectValues(R3_SCD_CK_SPECIAL_CONTITIONS, 'ckSpecial', '<option disabled="disabled"></option><option disabled="disabled">CK Special Conditions</option><option disabled="disabled"></option>');
	// SCD OM_SET Object Types
	INCLUDE_EDIT_SCD_OM_SET_TYPE = R3_INIT_generateSelectValues(R3_SCD_OM_SET_AOT_TYPES, 'ckSpecial');
	// SCD OM_SET Colission Types
	INCLUDE_EDIT_SCD_OM_SET_COL_TYPE = R3_INIT_generateSelectValues(R3_SCD_OM_SET_COLISSION_TYPES, 'ckSpecial');
	// SCD OM_SET Colission Shape
	INCLUDE_EDIT_SCD_OM_SET_COL_SHAPE = R3_INIT_generateSelectValues(R3_SCD_OM_SET_COLISSION_SHAPES, 'ckSpecial');
	// SCD ITEM_AOT_SET Blink Colors
	INCLUDE_EDIT_SCD_ITEM_AOT_SET_BLINK_COLOR = R3_INIT_generateSelectValues(R3_SCD_ITEM_AOT_SET_BLINK_COLORS, 'set');
	/*
		End
	*/
	R3_INIT_APPEND();
};
/*
	Process executable flags
*/
function R3_INIT_PROCESS_ARGS(){
	if (R3_SYSTEM.web.isBrowser === false && APP_ON_BOOT === true){
		var runFlags;
		// NW.js
		if (R3_SYSTEM.web.is_NW === true){
			runFlags = nw.App.argv;
		};
		// Electron
		if (R3_SYSTEM.web.is_ELECTRON === true){
			runFlags = process.argv;
		};
		/*
			Start
		*/
		if (runFlags !== []){
			// Disable animations
			if (runFlags.indexOf('--disable-animations') !== -1){
				R3_SETTINGS.ENABLE_ANIMATIONS = false;
				document.getElementById('R3_SETTINGS_LBL_enableAnim').onclick = null;
				document.getElementById('R3_SETTINGS_ENABLE_ANIMATIONS').disabled = 'disabled';
			};
			// Enter Fullscreen
			if (runFlags.indexOf('--fullscreen') !== -1){
				R3_DESIGN_toggleFullScreen(0);
			};
			// Disable discord
			if (runFlags.indexOf('--disable-discord') !== -1){
				R3_SETTINGS.R3_NW_ARGS_DISABLE_DISCORD = true;
			};
			// Disable moving screen
			if (runFlags.indexOf('--disable-move-screen') !== -1){
				R3_SETTINGS.R3_NW_ARGS_DISABLE_MOVE_SCREEN = true;
			};
			// Move window to a specific screen
			if (runFlags.indexOf('--screen') !== -1){
				R3_SETTINGS.R3_NW_ARGS_OVERWRITE_MOVE_SCREEN = true;
				R3_SYSTEM_moveWindowToScreen(runFlags[parseInt(runFlags.indexOf('--screen') + 1)]);
			};
			// Disable DoorLink
			if (runFlags.indexOf('--disable-doorlink') !== -1){
				R3_SETTINGS.R3_NW_ARGS_DISABLE_DOORLINK = true;
			};
			// Disable Log
			if (runFlags.indexOf('--disable-log') !== -1){
				R3_SETTINGS.R3_NW_ARGS_DISABLE_LOG = true;
			};
			// Disable eNGE
			if (runFlags.indexOf('--disable-enge') !== -1){
				R3_SETTINGS.R3_NW_ARGS_DISABLE_ENGE = true;
			};
		};
	};
};
/*
	NW Window Functions
	Original code: https://stackoverflow.com/questions/29472038/node-webkit-moving-second-window-to-a-second-or-specific-screen
*/
function R3_SYSTEM_moveWindowToScreen(windowId){
	if (R3_SYSTEM.web.isBrowser === false && parseInt(windowId) !== NaN && SETTINGS_ENABLE_FULLSCREEN === false && R3_NW_ARGS_DISABLE_MOVE_SCREEN === false && R3_SYSTEM.web.is_ELECTRON === false){
		var appWindow = R3_MODULES.gui.Window.get(), appScreens = R3_MODULES.gui.Screen.screens[windowId];
		appWindow.x = appScreens.work_area.x;
		appWindow.y = 0;
		appWindow.show();
		setTimeout(function(){
			appWindow.maximize();
		}, 50);
	};
};