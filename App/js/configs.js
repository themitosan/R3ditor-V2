/*
	R3ditor V2 - configs.js
	By TheMitoSan
	Sorry Again.
*/
// Main Vars
var APP_ON_BOOT = true,
	APP_CAN_START = true,
	APP_useImageFix = false,
	SETTINGS_USE_DISCORD = false,
	SETTINGS_MOVE_WINDOW = false,
	SETTINGS_SCD_EDITOR_MODE = 0,
	SETTINGS_ENGE_WIDTH_RES = 640,
	SETTINGS_ENGE_HEIGHT_RES = 480,
	SETTINGS_ENABLE_RE3SLDE = false,
	R3_RDT_DIVISOR = atob(R3_MP_WM),
	SETTINGS_LIVESTATUS_BAR_POS = 0,
	SETTINGS_SCD_HEXVIEW_FACTOR = 1,
	SETTINGS_OPEN_LOG_STARTUP = true,
	SETTINGS_MSG_DECOMPILER_MODE = 3,
	SETTINGS_ENABLE_MOVE_SCREEN_ID = 0,
	SETTINGS_ENABLE_FULLSCREEN = false,
	SETTINGS_ENABLE_MOVE_SCREEN = true,
	SETTINGS_SHORTCUT_CLOSETOOL = false,
	SETTINGS_OPEN_LOG_ON_WARN_ERROR = false,
	SETTINGS_SCD_HOVER_FUNCTION_HEX = false,
	SETTINGS_SCD_SELECT_HEX_AS_TEXT = false,
	SETTINGS_SCD_FOCUS_FUNCTION_CLICK = false,
	SETTINGS_ENABLE_RDT_OPEN_ANIMATION = true,
	SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST = false,
	SETTINGS_SCD_DECOMPILER_SHOWOPCODE = false,
	SETTINGS_SCD_DECOMPILER_ENABLE_LOG = false,
	SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR = false,
	SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST = false,
	SETTINGS_SHOW_LAST_FILE_OPENED_POPUP = true,
	SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS = false,
	SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS = false,
	SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE = false,
	SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM = false,
	SETTINGS_ENGE_BIOS_PATH, SETTINGS_ENGE_BIOS, SETTINGS_RECENT_FILE_NAME, SETTINGS_RECENT_FILE_TYPE = 0, SETTINGS_RECENT_FILE_PATH,
	// Args variables
	R3_NW_ARGS_DISABLE_DISCORD = false, R3_NW_ARGS_DISABLE_MOVE_SCREEN = false, R3_NW_ARGS_OVERWRITE_MOVE_SCREEN = false, R3_NW_ARGS_DISABLE_DOORLINK = false;
/*
	Functions
*/
// Check Path and Files
function R3_LOAD_CHECKFILES(){
	if (R3_WEBMODE === false){
		try {
			// Create Paths
			if (APP_FS.existsSync(APP_PATH) !== true){
				APP_FS.mkdirSync(APP_PATH);
			};
			DATABASE_INIT_CREATE_FOLDER.forEach(function(foldePath){
				if (APP_FS.existsSync(foldePath) !== true){
					APP_FS.mkdirSync(foldePath);
				};
			});
			/*
				Delete Files
				Will do on Windows and Linux
			*/
			if (process.platform !== 'darwin'){
				DATABASE_INIT_DELETE_FILES.forEach(function(deleteFile){
					if (APP_FS.existsSync(deleteFile === true)){
						APP_FS.unlinkSync(deleteFile);
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
		// THX
		document.getElementById('R3_SPLASH_thanks').innerHTML = INCLUDE_THX;
		document.getElementById('R3_SPLASH_CREATORS').innerHTML = INCLUDE_CRX;
		document.getElementById('R3_SPLASH_VER').innerHTML = 'Ver. ' + INT_VERSION;
		// Load
		var SETTINGS_FILE, configsList = [], fileExists = false;
		if (R3_WEBMODE !== true){
			SETTINGS_FILE = APP_PATH + '/Configs/configs.R3V2';
			fileExists = APP_FS.existsSync(SETTINGS_FILE);
		} else {
			if (localStorage.getItem('R3V2_SETTINGS') !== null){
				fileExists = true;
			};
		};
		// Fix eNGE Bios
		SETTINGS_ENGE_BIOS_PATH = APP_PATH + '/Configs/PS_BIOS.R3V2';
		if (fileExists !== false){
			if (R3_WEBMODE === false){
				APP_FS.readFileSync(SETTINGS_FILE).toString().split('\n').forEach(function(line){ 
					configsList.push(line); 
				});
			} else {
				localStorage.getItem('R3V2_SETTINGS').toString().split('\n').forEach(function(line){ 
					configsList.push(line); 
				});
			};
			/*
				Load configs
			*/
			// RE3 Path
			if (configsList[0] !== undefined){
				R3_RE3_PATH = configsList[0];
				document.getElementById('R3_SETTINGS_RE3_PATH').innerHTML = R3_RE3_PATH.replace(new RegExp('\\\\', 'gi'), '/');
			} else {
				R3_RE3_PATH = undefined;
				document.getElementById('R3_SETTINGS_RE3_PATH').innerHTML = 'Undefined';
			};
			// MERCE Path
			if (configsList[1] !== undefined){
				R3_MERCE_PATH = configsList[1];
				document.getElementById('R3_SETTINGS_MERCE_PATH').innerHTML = R3_MERCE_PATH.replace(new RegExp('\\\\', 'gi'), '/');
			} else {
				R3_MERCE_PATH = undefined;
				document.getElementById('R3_SETTINGS_MERCE_PATH').innerHTML = 'Undefined';
			};
			// Hex Editor Path
			if (configsList[2] !== undefined){
				R3_HEX_PATH = configsList[2];
				document.getElementById('R3_SETTINGS_HEX_PATH').innerHTML = R3_HEX_PATH.replace(new RegExp('\\\\', 'gi'), '/');
			} else {
				R3_HEX_PATH = undefined;
				document.getElementById('R3_SETTINGS_HEX_PATH').innerHTML = 'Undefined';
			};
			// RE3SLDE Path
			if (configsList[3] !== undefined){
				R3_RE3SLDE_PATH = configsList[3];
				document.getElementById('R3_SETTINGS_RE3SLDE_PATH').innerHTML = R3_RE3SLDE_PATH.replace(new RegExp('\\\\', 'gi'), '/');
			} else {
				R3_RE3SLDE_PATH = undefined;
				document.getElementById('R3_SETTINGS_RE3SLDE_PATH').innerHTML = 'Undefined';
			};
			// Use Discord Rich Presence
			if (configsList[4] !== undefined){
				SETTINGS_USE_DISCORD = JSON.parse(configsList[4]);
			} else {
				SETTINGS_USE_DISCORD = false;
			};
			document.getElementById('R3_SETTINGS_ENABLE_DISCORD').checked = SETTINGS_USE_DISCORD;
			// RE3 Livestatus Pos.
			if (configsList[5] !== undefined){
				SETTINGS_LIVESTATUS_BAR_POS = parseInt(configsList[5]);
			} else {
				SETTINGS_LIVESTATUS_BAR_POS = 0;
			};
			document.getElementById('R3_SETTINGS_LIVESTATUS_POSITION').value = SETTINGS_LIVESTATUS_BAR_POS;
			// MOD Path
			if (configsList[6] !== undefined){
				R3_MOD_PATH = configsList[6].replace(new RegExp('\\\\', 'gi'), '/');
			} else {
				R3_MOD_PATH = APP_ASSETS + '/Assets';
			};
			document.getElementById('R3_SETTINGS_MOD_PATH').innerHTML = R3_MOD_PATH;
			// Move window
			if (configsList[7] !== undefined){
				SETTINGS_MOVE_WINDOW = JSON.parse(configsList[7]);
			} else {
				SETTINGS_MOVE_WINDOW = false;
			};
			document.getElementById('R3_SETTINGS_MOVE_CORNER').checked = SETTINGS_MOVE_WINDOW;
			// RE3 Version
			if (configsList[8] !== undefined){
				RE3_LIVE_CURRENTMOD = parseInt(configsList[8]);
			} else {
				RE3_LIVE_CURRENTMOD = 0;
			};
			document.getElementById('R3_SETTINGS_RE3_VERSION').value = RE3_LIVE_CURRENTMOD;
			// Livestatus Update speed
			if (configsList[9] !== undefined){
				RE3_LIVE_RENDER_TIME = parseInt(configsList[9]);
			} else {
				RE3_LIVE_RENDER_TIME = 60;
			};
			document.getElementById('R3_SETTINGS_LIVETSTATUS_FREQUENCY').innerHTML = RE3_LIVE_RENDER_TIME;
			document.getElementById('R3_SETTINGS_RANGE_LIVETSTATUS_FREQUENCY').value = RE3_LIVE_RENDER_TIME;
			// Enable animations
			if (configsList[10] !== undefined){
				R3_ENABLE_ANIMATIONS = JSON.parse(configsList[10]);
			} else {
				R3_ENABLE_ANIMATIONS = false;
			};
			document.getElementById('R3_SETTINGS_ENABLE_ANIMATIONS').checked = R3_ENABLE_ANIMATIONS;
			// Enable Mod
			if (configsList[11] !== undefined){
				APP_ENABLE_MOD = JSON.parse(configsList[11]);
			} else {
				APP_ENABLE_MOD = false;
			};
			// [CTRL + E] Close Tool
			if (configsList[12] !== undefined){
				SETTINGS_SHORTCUT_CLOSETOOL = JSON.parse(configsList[12]);
			} else {
				SETTINGS_SHORTCUT_CLOSETOOL = false;
			};
			document.getElementById('R3_SETTINGS_ENABLE_SHORTCUT_CLOSETOOL').checked = SETTINGS_SHORTCUT_CLOSETOOL;
			// Move window to a specific display
			if (configsList[13] !== undefined){
				SETTINGS_ENABLE_MOVE_SCREEN = JSON.parse(configsList[13]);
			} else {
				SETTINGS_ENABLE_MOVE_SCREEN = true;
			};
			document.getElementById('R3_SETTINGS_ENABLE_STARTUP_SCREEN').checked = JSON.parse(SETTINGS_ENABLE_MOVE_SCREEN);
			// MSG Decrypt Mode
			if (configsList[14] !== undefined){
				SETTINGS_MSG_DECOMPILER_MODE = parseInt(configsList[14]);
			} else {
				SETTINGS_MSG_DECOMPILER_MODE = 3;
			};
			document.getElementById('R3_SETTINGS_MSG_DATABASE_MODE').value = SETTINGS_MSG_DECOMPILER_MODE;
			// Open Log at startup
			if (configsList[15] !== undefined){
				SETTINGS_OPEN_LOG_STARTUP = JSON.parse(configsList[15]);
			} else {
				SETTINGS_OPEN_LOG_STARTUP = false;
			};
			document.getElementById('R3_SETTINGS_OPEN_LOG_STARTUP').checked = SETTINGS_OPEN_LOG_STARTUP;
			// Show SCD log while decompiling
			if (configsList[16] !== undefined){
				SETTINGS_SCD_DECOMPILER_ENABLE_LOG = JSON.parse(configsList[16]);
			} else {
				SETTINGS_SCD_DECOMPILER_ENABLE_LOG = false;
			};
			document.getElementById('R3_SETTINGS_SCD_LOG_WHILE_DECOMPILING').checked = SETTINGS_SCD_DECOMPILER_ENABLE_LOG;
			// Show Opcode on SCD Function
			if (configsList[17] !== undefined){
				SETTINGS_SCD_DECOMPILER_SHOWOPCODE = JSON.parse(configsList[17]);
			} else {
				SETTINGS_SCD_DECOMPILER_SHOWOPCODE = false;
			};
			document.getElementById('R3_SETTINGS_SCD_LOG_SHOW_OPCODE_FUNCIONS').checked = SETTINGS_SCD_DECOMPILER_SHOWOPCODE;
			// Open Script List when open SCD File
			if (configsList[18] !== undefined){
				SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST = JSON.parse(configsList[18]);
			} else {
				SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST = false;
			};
			document.getElementById('R3_SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST').checked = SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST;
			// Open MSG List when open RDT Message
			if (configsList[19] !== undefined){
				SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST = JSON.parse(configsList[19]);
			} else {
				SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST = false;
			};
			document.getElementById('R3_SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST').checked = SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST;
			// Original APP_PATH
			if (R3_WEBMODE === false){
				if (process.platform !== 'darwin'){
					if (configsList[20] !== undefined){
						process.chdir(configsList[20]);
					};
				};
			};
			// Change SCD Hex View Colors
			if (configsList[21] !== undefined){
				SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR = JSON.parse(configsList[21]);
			} else {
				SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR = false;
			};
			document.getElementById('R3_SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR').checked = SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR;
			// Hover Function on SCD Hex View
			if (configsList[22] !== undefined){
				SETTINGS_SCD_HOVER_FUNCTION_HEX = JSON.parse(configsList[22]);
			} else {
				SETTINGS_SCD_HOVER_FUNCTION_HEX = false;
			};
			document.getElementById('R3_SETTINGS_SCD_HOVER_FUNCTION_HEX').checked = SETTINGS_SCD_HOVER_FUNCTION_HEX;
			// Select SCD hex as text
			if (configsList[23] !== undefined){
				SETTINGS_SCD_SELECT_HEX_AS_TEXT = JSON.parse(configsList[23]);
			} else {
				SETTINGS_SCD_SELECT_HEX_AS_TEXT = false;
			};
			document.getElementById('R3_SETTINGS_SCD_SELECT_HEX_FUNCTION').checked = SETTINGS_SCD_SELECT_HEX_AS_TEXT;
			// Recent File Name
			SETTINGS_RECENT_FILE_NAME = configsList[24];
			// Recent File Type
			SETTINGS_RECENT_FILE_TYPE = parseInt(configsList[25]);
			// Recent File Path
			SETTINGS_RECENT_FILE_PATH = configsList[26];
			// Enable Recent Popup
			if (configsList[27] !== undefined){
				SETTINGS_SHOW_LAST_FILE_OPENED_POPUP = JSON.parse(configsList[27]);
			} else {
				SETTINGS_SHOW_LAST_FILE_OPENED_POPUP = false;
			};
			document.getElementById('R3_SETTINGS_SHOW_RECENT_POPUP').checked = SETTINGS_SHOW_LAST_FILE_OPENED_POPUP;
			// SCD Hex View Size Factor
			if (configsList[28] !== undefined){
				SETTINGS_SCD_HEXVIEW_FACTOR = parseFloat(configsList[28]);
			} else {
				SETTINGS_SCD_HEXVIEW_FACTOR = 1;
			};
			document.getElementById('R3_SETTINGS_SCD_HEX_VIEW_SIZE').value = SETTINGS_SCD_HEXVIEW_FACTOR;
			// SCD Editor Mode
			if (configsList[29] !== undefined){
				SETTINGS_SCD_EDITOR_MODE = parseInt(configsList[29]);
			} else {
				SETTINGS_SCD_EDITOR_MODE = 0;
			};
			document.getElementById('R3_SETTINGS_SCD_EDITOR_MODE').value = SETTINGS_SCD_EDITOR_MODE;
			// Disable RDT animation
			if (configsList[30] !== undefined){
				SETTINGS_ENABLE_RDT_OPEN_ANIMATION = JSON.parse(configsList[30]);
			} else {
				SETTINGS_ENABLE_RDT_OPEN_ANIMATION = false;
			};
			document.getElementById('R3_SETTINGS_ENABLE_RDT_ANIMATIONS').checked = SETTINGS_ENABLE_RDT_OPEN_ANIMATION;
			// Enable Fullscreen mode
			if (configsList[31] !== undefined){
				SETTINGS_ENABLE_FULLSCREEN = JSON.parse(configsList[31]);
			} else {
				SETTINGS_ENABLE_FULLSCREEN = false;
			};
			document.getElementById('R3_SETTINGS_ENABLE_FULLSCREEN').checked = SETTINGS_ENABLE_FULLSCREEN;
			// eNGE Bios / Path
			if (configsList[32] !== undefined){
				SETTINGS_ENGE_BIOS_PATH = configsList[32];
			} else {
				SETTINGS_ENGE_BIOS_PATH = undefined;
			};
			document.getElementById('R3_SETTINGS_eNGE_BIOS_PATH').innerHTML = SETTINGS_ENGE_BIOS_PATH;
			// eNGE Width Res.
			if (configsList[33] !== undefined){
				SETTINGS_ENGE_WIDTH_RES = parseInt(configsList[33]);
			} else {
				SETTINGS_ENGE_WIDTH_RES = 640;
			};
			document.getElementById('R3_SETTINGS_ENGE_WIDTH').value = SETTINGS_ENGE_WIDTH_RES;
			// eNGE Height Res.
			if (configsList[34] !== undefined){
				SETTINGS_ENGE_HEIGHT_RES = parseInt(configsList[34]);
			} else {
				SETTINGS_ENGE_HEIGHT_RES = 480;
			};
			document.getElementById('R3_SETTINGS_ENGE_HEIGHT').value = SETTINGS_ENGE_HEIGHT_RES;
			// Open log window on console warn / error
			if (configsList[35] !== undefined){
				SETTINGS_OPEN_LOG_ON_WARN_ERROR = JSON.parse(configsList[35]);
			} else {
				SETTINGS_OPEN_LOG_ON_WARN_ERROR = false;
			};
			document.getElementById('R3_SETTINGS_OPEN_LOG_ON_WARN_ERROR').checked = SETTINGS_OPEN_LOG_ON_WARN_ERROR;
			// MSG - Use shortcuts to skip next / previous message
			if (configsList[36] !== undefined){
				SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS = JSON.parse(configsList[36]);
			} else {
				SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS = false;
			};
			// SCD - Use shortcuts to skip next / previous script
			if (configsList[37] !== undefined){
				SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS = JSON.parse(configsList[37]);
			} else {
				SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS = false;
			};
			document.getElementById('R3_SETTINGS_SCD_DISABLE_SHORTCUTS_NEXT_PREV').checked = SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS;
			// SCD - Center function on click
			if (configsList[38] !== undefined){
				SETTINGS_SCD_FOCUS_FUNCTION_CLICK = JSON.parse(configsList[38]);
			} else {
				SETTINGS_SCD_FOCUS_FUNCTION_CLICK = false;
			};
			document.getElementById('R3_SETTINGS_SCD_FOCUS_FUNCTION_CLICK').checked = SETTINGS_SCD_FOCUS_FUNCTION_CLICK;
			// SCD - Keep original JS code after compiling
			if (configsList[39] !== undefined){
				SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE = JSON.parse(configsList[39]);
			} else {
				SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE = false;
			};
			document.getElementById('R3_SETTINGS_SCD_JS_COMPILER_KEEP_FILE').checked = SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE;
			// SCD - Keep original JS code after compiling
			if (configsList[40] !== undefined){
				SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM = JSON.parse(configsList[40]);
			} else {
				SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM = false;
			};
			document.getElementById('R3_SETTINGS_SCD_SNAP_SEARCH_EDIT_FORM').checked = SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM;
			// Move window to another sreen - monitor id
			if (configsList[41] !== undefined){
				SETTINGS_ENABLE_MOVE_SCREEN_ID = parseInt(configsList[41]);
			} else {
				SETTINGS_ENABLE_MOVE_SCREEN_ID = 0;
			};
			document.getElementById('SETTINGS_ENABLE_MOVE_DISPLAY_SELECT').value = SETTINGS_ENABLE_MOVE_SCREEN_ID;
			/*
				End
			*/
			R3_LOAD_PROCESS_SETTINGS();
		} else {
			R3_SAVE_SETTINGS(true);
		};
	} catch (err) {
		console.error(err);
		R3_INIT_ERROR(err);
	};
};
// Process other load settings
function R3_LOAD_PROCESS_SETTINGS(){
	// Process args
	if (APP_ON_BOOT === true){
		R3_INIT_PROCESS_ARGS();
	};
	// Move Window
	if (SETTINGS_MOVE_WINDOW !== false){
		window.moveTo(0, 0);
	};
	// Open Log at startup
	if (APP_ON_BOOT === true && SETTINGS_OPEN_LOG_STARTUP !== false){
		R3_DESIGN_MINIWINDOW_OPEN(0);
	};
	// NW Checks
	if (R3_WEBMODE === false){
		// Init discord rich presence
		R3_DISCORD_INIT();
		// Check for Mod
		if (APP_FS.existsSync(R3_MOD_PATH + '/Bio3.ini') === true){
			APP_ENABLE_MOD = true;
		} else {
			APP_ENABLE_MOD = false;
		};
		// Check if Executable Exists (RE3)
		if (APP_FS.existsSync(R3_RE3_PATH) !== false){
			R3_DESIGN_ENABLE_BTN('BTN_MAIN_0');
			R3_RE3_CANRUN = true;
			if (APP_ENABLE_MOD === true){
				if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === false){
					R3_RE3_MOD_PATH = APP_PATH + '/Assets/' + R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][3];
				};
				if (APP_FS.existsSync(R3_RE3_MOD_PATH) === true){
					R3_DESIGN_ENABLE_BTN('BTN_MAIN_3');
				};
			};
		} else {
			R3_DESIGN_DISABLE_BTN('BTN_MAIN_0');
			R3_DESIGN_DISABLE_BTN('BTN_MAIN_3');
		};
		// Check if Executable Exists (MERCE)
		if (APP_FS.existsSync(R3_MERCE_PATH) === true){
			R3_DESIGN_ENABLE_BTN('BTN_MAIN_2');
			R3_MERCE_CANRUN = true;
			if (APP_ENABLE_MOD === true){
				R3_DESIGN_ENABLE_BTN('BTN_MAIN_4');
			};
		} else {
			R3_DESIGN_DISABLE_BTN('BTN_MAIN_2');
			R3_DESIGN_DISABLE_BTN('BTN_MAIN_4');
		};
		// Check if REBirth is selected
		if (RE3_LIVE_CURRENTMOD === 4){
			R3_MERCE_CANRUN = false;
			$('#BTN_MAIN_2').css({'display': 'none'});
			$('#BTN_MAIN_4').css({'display': 'none'});
		} else {
			$('#BTN_MAIN_2').css({'display': 'inline-flex'});
			$('#BTN_MAIN_4').css({'display': 'inline-flex'});
		};
		// RE3SDLE Path
		if (APP_FS.existsSync(R3_RE3SLDE_PATH) === true){
			SETTINGS_ENABLE_RE3SLDE = true;
		};
		// Check for game mode paths
		R3_SETTINGS_getMapPrefix();
		// Disable Discord
		if (SETTINGS_USE_DISCORD !== true){
			R3_DISC_clearActivity();
		};
		// Set Recent File
		R3_DESIGN_UPDATE_LATEST_LABELS();
		R3_SETTINGS_ENGE_LOAD_BIOS();
		R3_DOORLINK_CHECK();
	} else {
		// Variables
		APP_ENABLE_MOD = false;
		SETTINGS_USE_DISCORD = false;
		SETTINGS_ENABLE_RE3SLDE = false;
	};
	/*
		MOD Path Fixes
	*/
	var modPathTest = R3_MOD_PATH.slice(parseInt(R3_MOD_PATH.length - 1), R3_MOD_PATH.length);
	if (modPathTest === '/' || modPathTest === '\\'){
		R3_MOD_PATH = R3_MOD_PATH.slice(0, parseInt(R3_MOD_PATH.length - 1));
	};
	/*
		End
	*/
	if (APP_ON_BOOT === true){
		// Move windows to another display
		if (SETTINGS_ENABLE_MOVE_SCREEN === true && R3_NW_ARGS_OVERWRITE_MOVE_SCREEN === false){
			R3_SYSTEM_moveWindowToScreen(SETTINGS_ENABLE_MOVE_SCREEN_ID);
		};
		document.getElementById('R3_RDT_FILELIST_GAMEMODE').value = 1;
		R3_RDT_FILELIST_UPDATELIST();
		R3_DOORLINK_CHECK();
		R3_DESIGN_ADJUST();
		R3_GOTO_MAIN();
	};
};
// Post-boot action
function R3_LOAD_CHECK_EXTRA(){
	R3_DESIGN_CHECKRES();
	// Try to detect if game is open
	if (R3_WEBMODE === false && MEM_JS_requreSucess === true){
		R3_CHECK_GAME_IS_RUNNING();
	};
	if (R3_getDate(2) === '09' && R3_getDate(1) === '28'){
		APP_CAN_RENDER_DEV = false;
		var diff = (parseInt(R3_getDate(3)) - 1999);
		R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', atob(FG_HIDDENSTRINGS[0][0]) + diff + atob(FG_HIDDENSTRINGS[0][1]), 'RE3', 144);
	} else {
		R3_WEB_ALERT();
	};
};
// Save Settings
function R3_SAVE_SETTINGS(reload, logSaving){
	/*
		----------------------------
		|	   Settings Order	   |
		----------------------------
		0:  RE3 Normal Path
		1:  RE3 Merce Path
		2:  Hex Editor Path
		3:  RE3SLDE Path
		4:  Use Discord
		5:  RE3 Livestatus Pos.
		6:  MOD Path
		7:  Move window top-left
		8:  Game Version
		9:  Livestatus Update Time
		10: Enable animation
		11: Enable MOD
		12: Esc close tools
		13: Move window to a specific display
		14: MSG RE Mode
		15: Open Log at startup
		16: Log functions while decompiling SCD code
		17: Show Opcodes in front of SCD functions
		18: Open SCD List while opening a new SCD File
		19: Open MSG List when open RDT Message
		20: Original APP_PATH
		21: Change SCD Hex View Colors
		22: Hover SCD Function on Hex View
		23: Select SCD hex as normal text
		24: Recent File Name
		25: Recent File Type
		26: Recent File Path
		27: Show Recent file popup
		28: SCD Hex View Factor
		29: SCD Editor Mode (List / Code)
		30: Show RDT Open Animation
		31: Fullscreen mode
		32: eNGE Bios Path
		33: eNGE Window Width
		34: eNGE Window Height
		35: Open log if console warns / error
		36: Disable Skip Shortcuts on MSG Editor
		37: Disable Skip Shortcuts on SCD JS Editor
		38: (SCD) Center function on click
		39: (SCD) Keep original JS file after compiling
		40: (SCD) Snap Search Form with Edit form
		41: Move window to another display - monitor id
	*/
	R3_LOAD_CHECKFILES();
	// Fix ORIGINAL_APP_PATH
	if (ORIGINAL_APP_PATH !== '' && ORIGINAL_APP_PATH !== undefined){
		ORIGINAL_APP_PATH = ORIGINAL_APP_PATH.replace(new RegExp('\\\\', 'gi'), '/');
	};
	// Get eNGE Res.
	R3_ENGE_updateResVars();
	// Save Data
	var newConfigFile = R3_RE3_PATH + '\n' + R3_MERCE_PATH + '\n' + R3_HEX_PATH + '\n' + R3_RE3SLDE_PATH + '\n' + SETTINGS_USE_DISCORD + '\n' + SETTINGS_LIVESTATUS_BAR_POS + '\n' + 
						R3_MOD_PATH + '\n' + SETTINGS_MOVE_WINDOW + '\n' + RE3_LIVE_CURRENTMOD + '\n' + RE3_LIVE_RENDER_TIME + '\n' + R3_ENABLE_ANIMATIONS + '\n' + APP_ENABLE_MOD + '\n' + 
						SETTINGS_SHORTCUT_CLOSETOOL + '\n' + SETTINGS_ENABLE_MOVE_SCREEN + '\n' + SETTINGS_MSG_DECOMPILER_MODE + '\n' + SETTINGS_OPEN_LOG_STARTUP + '\n' + SETTINGS_SCD_DECOMPILER_ENABLE_LOG + '\n' + 
						SETTINGS_SCD_DECOMPILER_SHOWOPCODE + '\n' + SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST + '\n' + SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST + '\n' + ORIGINAL_APP_PATH + '\n' + SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR + '\n' + 
						SETTINGS_SCD_HOVER_FUNCTION_HEX + '\n' + SETTINGS_SCD_SELECT_HEX_AS_TEXT + '\n' + SETTINGS_RECENT_FILE_NAME + '\n' + SETTINGS_RECENT_FILE_TYPE + '\n' + SETTINGS_RECENT_FILE_PATH + '\n' + SETTINGS_SHOW_LAST_FILE_OPENED_POPUP + '\n' + 
						SETTINGS_SCD_HEXVIEW_FACTOR + '\n' + SETTINGS_SCD_EDITOR_MODE + '\n' + SETTINGS_ENABLE_RDT_OPEN_ANIMATION + '\n' + SETTINGS_ENABLE_FULLSCREEN + '\n' + SETTINGS_ENGE_BIOS_PATH + '\n' + SETTINGS_ENGE_WIDTH_RES + '\n' + SETTINGS_ENGE_HEIGHT_RES + '\n' +
						SETTINGS_OPEN_LOG_ON_WARN_ERROR + '\n' + SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS + '\n' + SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS + '\n' + SETTINGS_SCD_FOCUS_FUNCTION_CLICK + '\n' + SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE + '\n' + SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM + '\n' +
						SETTINGS_ENABLE_MOVE_SCREEN_ID;
	try {
		if (R3_WEBMODE === false){
			APP_FS.writeFileSync(APP_PATH + '/Configs/configs.R3V2', newConfigFile, 'utf-8');
		} else {
			localStorage.setItem('R3V2_SETTINGS', newConfigFile);
		};
		if (logSaving !== false){
			R3_SYSTEM_LOG('log', 'R3ditor V2 - Saving settings...');
		};
		if (reload === true){
			R3_RELOAD();
		};
	} catch (err) {
		R3_SYSTEM_LOG('error', 'ERROR - Unable to save settings!\nReason: ' + err);
	};
};
/*
	Settings Form Functions
*/
// Save Settings
function R3_SETTINGS_SAVE(){
	if (RE3_RUNNING !== false){
		R3_LIVESTATUS_BAR_ADJUSTINTERFACE();
	};
	R3_SAVE_SETTINGS(false, false);
	if (RE3_RUNNING === false){
		R3_MENU_GOBACK();
	};
	R3_LOAD_PROCESS_SETTINGS();
};
// Update checkbox
function R3_SETTINGS_UPDATE_CHECKBOX(){
	SETTINGS_MOVE_WINDOW = JSON.parse(document.getElementById('R3_SETTINGS_MOVE_CORNER').checked);
	SETTINGS_USE_DISCORD = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_DISCORD').checked);
	R3_ENABLE_ANIMATIONS = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_ANIMATIONS').checked);
	SETTINGS_OPEN_LOG_STARTUP = JSON.parse(document.getElementById('R3_SETTINGS_OPEN_LOG_STARTUP').checked);
	SETTINGS_ENABLE_FULLSCREEN = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_FULLSCREEN').checked);
	SETTINGS_ENABLE_MOVE_SCREEN = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_STARTUP_SCREEN').checked);
	SETTINGS_SHORTCUT_CLOSETOOL = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_SHORTCUT_CLOSETOOL').checked);
	SETTINGS_SCD_HOVER_FUNCTION_HEX = JSON.parse(document.getElementById('R3_SETTINGS_SCD_HOVER_FUNCTION_HEX').checked);
	SETTINGS_OPEN_LOG_ON_WARN_ERROR = JSON.parse(document.getElementById('R3_SETTINGS_OPEN_LOG_ON_WARN_ERROR').checked);
	SETTINGS_SHOW_LAST_FILE_OPENED_POPUP = JSON.parse(document.getElementById('R3_SETTINGS_SHOW_RECENT_POPUP').checked);
	SETTINGS_SCD_SELECT_HEX_AS_TEXT = JSON.parse(document.getElementById('R3_SETTINGS_SCD_SELECT_HEX_FUNCTION').checked);
	SETTINGS_ENABLE_RDT_OPEN_ANIMATION = JSON.parse(document.getElementById('R3_SETTINGS_ENABLE_RDT_ANIMATIONS').checked);
	SETTINGS_SCD_FOCUS_FUNCTION_CLICK = JSON.parse(document.getElementById('R3_SETTINGS_SCD_FOCUS_FUNCTION_CLICK').checked);
	SETTINGS_SCD_DECOMPILER_ENABLE_LOG = JSON.parse(document.getElementById('R3_SETTINGS_SCD_LOG_WHILE_DECOMPILING').checked);
	SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST = JSON.parse(document.getElementById('R3_SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST').checked);
	SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR = JSON.parse(document.getElementById('R3_SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR').checked);
	SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST = JSON.parse(document.getElementById('R3_SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST').checked);
	SETTINGS_SCD_DECOMPILER_SHOWOPCODE = JSON.parse(document.getElementById('R3_SETTINGS_SCD_LOG_SHOW_OPCODE_FUNCIONS').checked);
	SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE = JSON.parse(document.getElementById('R3_SETTINGS_SCD_JS_COMPILER_KEEP_FILE').checked);
	SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS = JSON.parse(document.getElementById('R3_SETTINGS_MSG_DISABLE_SHORTCUTS_NEXT_PREV').checked);
	SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS = JSON.parse(document.getElementById('R3_SETTINGS_SCD_DISABLE_SHORTCUTS_NEXT_PREV').checked);
	SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM = JSON.parse(document.getElementById('R3_SETTINGS_SCD_SNAP_SEARCH_EDIT_FORM').checked);
	// Process selection
	R3_DESIGN_processSettingsChanges();
};
// Update select
function R3_SETTINGS_UPDATE_SELECT(){
	RE3_LIVE_CURRENTMOD = parseInt(document.getElementById('R3_SETTINGS_RE3_VERSION').value);
	SETTINGS_SCD_EDITOR_MODE = parseInt(document.getElementById('R3_SETTINGS_SCD_EDITOR_MODE').value);
	SETTINGS_MSG_DECOMPILER_MODE = parseInt(document.getElementById('R3_SETTINGS_MSG_DATABASE_MODE').value);
	SETTINGS_LIVESTATUS_BAR_POS = parseInt(document.getElementById('R3_SETTINGS_LIVESTATUS_POSITION').value);
	SETTINGS_SCD_HEXVIEW_FACTOR = parseFloat(document.getElementById('R3_SETTINGS_SCD_HEX_VIEW_SIZE').value);
	SETTINGS_ENABLE_MOVE_SCREEN_ID = parseInt(document.getElementById('SETTINGS_ENABLE_MOVE_DISPLAY_SELECT').value);
};
// Update ranges
function R3_SETTINGS_UPDATE_RANGE(mode){
	if (mode === 0){
		var newValue = document.getElementById('R3_SETTINGS_RANGE_LIVETSTATUS_FREQUENCY').value;
		document.getElementById('R3_SETTINGS_LIVETSTATUS_FREQUENCY').innerHTML = newValue;
		RE3_LIVE_RENDER_TIME = newValue;
	};
};
// Set Executable Path
function R3_SETTINGS_SET_PATH(mode){
	if (mode !== 4){
		if (mode !== 5){
			R3_FILE_LOAD('.exe', function(pathFuture){
				var fixPath = pathFuture.replace(new RegExp('\\\\', 'g'), '/');
				if (mode === 0){
					R3_RE3_PATH = fixPath;
					document.getElementById('R3_SETTINGS_RE3_PATH').innerHTML = R3_RE3_PATH;
				};
				if (mode === 1){
					R3_MERCE_PATH = fixPath;
					document.getElementById('R3_SETTINGS_MERCE_PATH').innerHTML = R3_MERCE_PATH;
				};
				if (mode === 2){
					R3_HEX_PATH = fixPath;
					document.getElementById('R3_SETTINGS_HEX_PATH').innerHTML = R3_HEX_PATH;
				};
				if (mode === 3){
					R3_RE3SLDE_PATH = fixPath;
					document.getElementById('R3_SETTINGS_RE3SLDE_PATH').innerHTML = R3_RE3SLDE_PATH;
				};
			});
		} else {
			R3_FILE_LOAD('.R3V2', function(biosPath){
				SETTINGS_ENGE_BIOS_PATH = biosPath.replace(new RegExp('\\\\', 'g'), '/');
				document.getElementById('R3_SETTINGS_eNGE_BIOS_PATH').innerHTML = SETTINGS_ENGE_BIOS_PATH;
			});
		};
	} else {
		R3_FOLDER_SELECT(function(pathFuture){
			var fileCheck = pathFuture.replace(new RegExp('\\\\', 'g'), '/') + '/bio3.ini';
			if (APP_FS.existsSync(fileCheck) === true){
				R3_MOD_PATH = fileCheck.slice(0, (fileCheck.length - 8));
				document.getElementById('R3_SETTINGS_MOD_PATH').innerHTML = R3_MOD_PATH;
			} else {
				R3_SYSTEM_ALERT('WARN - You selected the wrong path!\nPlease select a path that haves Resident Evil 3 config file! (Bio3.ini)');
			};
		});
	};
};
// Generate prefix for map paths [DATA_AU, DATA_E, DATA_AJ]
function R3_SETTINGS_getMapPrefix(){
	if (R3_WEBMODE === false){
		// Easy
		var mPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_EASY + '/RDT/';
		if (APP_FS.existsSync(mPath) !== true){
			console.info('INFO: DATA_AJ does not exist! Switching to DATA_AU');
			R3_RDT_PREFIX_EASY = 'DATA_AU';
		};
		// Hard
		mPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_HARD + '/RDT/';
		if (APP_FS.existsSync(mPath) !== true){
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
	if (SETTINGS_ENGE_BIOS_PATH !== undefined && SETTINGS_ENGE_BIOS_PATH !== 'undefined'){
		if (APP_FS.existsSync(SETTINGS_ENGE_BIOS_PATH) === true){
			SETTINGS_ENGE_BIOS = APP_FS.readFileSync(SETTINGS_ENGE_BIOS_PATH, 'hex');
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (eNGE) unable to load bios! <br>Reason: The file was not found! (404)');
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
	videoY = R3_parsePSXRes(0, videoX);
	// Apply values
	document.getElementById('R3_SETTINGS_ENGE_WIDTH').value = videoX;
	document.getElementById('R3_SETTINGS_ENGE_HEIGHT').value = videoY;
	R3_ENGE_updateResVars();
};
// Update Res. Vars
function R3_ENGE_updateResVars(){
	var vW = parseInt(document.getElementById('R3_SETTINGS_ENGE_WIDTH').value), vH = parseInt(document.getElementById('R3_SETTINGS_ENGE_HEIGHT').value);
	if (vW === NaN || vW === '' || vW < 360){
		vW = 360;
	};
	if (vH === NaN || vH === '' || vH < 317){
		vH = 317;
	};
	SETTINGS_ENGE_WIDTH_RES = vW;
	SETTINGS_ENGE_HEIGHT_RES = vH;
	$('#R3V2_MINI_WINDOW_13').css({'width': SETTINGS_ENGE_WIDTH_RES, 'height': SETTINGS_ENGE_HEIGHT_RES});
};
/*
	Database Functions
*/
function R3_INIT_generateSelectValues(db, mode, prevHTML, limit){
	var c = 0, modeType, TEMP_STR = currentHex = '',
		tempAttr = Object.keys(db), maxLimit = tempAttr.length;
	if (prevHTML !== undefined && prevHTML !== ''){
		TEMP_STR = prevHTML;
	};
	if (limit !== undefined && parseInt(limit) !== NaN){
		maxLimit = parseInt(limit);
	};
	// Start Madness
	while (c < maxLimit){
		// Modes
		if (mode === 'hex'){
			modeType = MEMORY_JS_fixVars(tempAttr[c], 2);
			TEMP_STR = TEMP_STR + '<option value="' + modeType + '">(' + modeType.toUpperCase() + ') ' + db[modeType][0] + '</option>';
		};
		// Item
		if (mode === 'item'){
			modeType = MEMORY_JS_fixVars(c.toString(16), 2);
			TEMP_STR = TEMP_STR + '<option value="' + modeType + '">(' + modeType.toUpperCase() + ') ' + db[modeType][0] + '</option>';
		};
		// Files
		if (mode === 'files'){
			modeType = MEMORY_JS_fixVars(tempAttr[c], 2);
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
		c++;
	};
	return TEMP_STR;
};
// Generate Database
function R3_INIT_DATABASE_GENERATE(){
	// Check for Web
	if (R3_WEBMODE === false){
		R3_MOD_PATH = APP_PATH + '/Assets';
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
	if (R3_WEBMODE === false){
		var nwFlags = nw.App.argv;
		if (nwFlags !== []){
			// Disable animations
			if (nwFlags.indexOf('--disable-animations') !== -1){
				R3_ENABLE_ANIMATIONS = false;
				SETTINGS_ENABLE_RDT_OPEN_ANIMATION = false;
				document.getElementById('R3_SETTINGS_LBL_enableAnim').onclick = null;
				document.getElementById('R3_SETTINGS_LBL_enableAnimRDT').onclick = null;
				document.getElementById('R3_SETTINGS_ENABLE_ANIMATIONS').disabled = 'disabled';
				document.getElementById('R3_SETTINGS_ENABLE_RDT_ANIMATIONS').disabled = 'disabled';
			};
			// Enter Fullscreen
			if (nwFlags.indexOf('--fullscreen') !== -1){
				R3_DESIGN_toggleFullScreen(0);
			};
			// Disable discord
			if (nwFlags.indexOf('--disable-discord') !== -1){
				R3_NW_ARGS_DISABLE_DISCORD = true;
			};
			// Disable moving screen
			if (nwFlags.indexOf('--disable-move-screen') !== -1){
				R3_NW_ARGS_DISABLE_MOVE_SCREEN = true;
			};
			// Move window to a specific screen
			if (nwFlags.indexOf('--screen') !== -1){
				R3_NW_ARGS_OVERWRITE_MOVE_SCREEN = true;
				R3_SYSTEM_moveWindowToScreen(nwFlags[parseInt(nwFlags.indexOf('--screen') + 1)]);
			};
			// Disable DoorLink
			if (nwFlags.indexOf('--disable-doorlink') !== -1){
				R3_NW_ARGS_DISABLE_DOORLINK = true;
			};
		};
	};
};
/*
	NW Window Functions
	Original code: https://stackoverflow.com/questions/29472038/node-webkit-moving-second-window-to-a-second-or-specific-screen
*/
function R3_SYSTEM_moveWindowToScreen(windowId){
	if (R3_WEBMODE === false && parseInt(windowId) !== NaN && SETTINGS_ENABLE_FULLSCREEN === false && R3_NW_ARGS_DISABLE_MOVE_SCREEN === false){
		var appWindow  = APP_GUI.Window.get(),
			appScreens = APP_GUI.Screen.screens[windowId];
		appWindow.x = appScreens.work_area.x;
		appWindow.y = 0;
		appWindow.show();
		setTimeout(function(){
			appWindow.maximize();
		}, 50);
	};
};