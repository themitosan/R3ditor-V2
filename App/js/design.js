/*
	*******************************************************************************
	R3ditor V2 - design.js
	By TemmieHeartz

	One of the biggest files, This file is responsible for dealing with HTML / CSS 
	operations inside R3V2.
	*******************************************************************************
*/
// Main Vars
var R3_HAS_CRITICAL_ERROR = false,
	// Menu Vars
	R3_MENU_HISTORY = [], R3_MENU_CURRENT = 4, R3_MENU_LOCK = false, R3_DESIGN_LOADING_ACTIVE = false, R3_LIVESTATUS_OPEN = false, R3_LIVESTATUS_FORCE_RENDER = false, R3_GET_BG = false, R3_THEPIC = '',
	// Funtion search list
	R3_INTERNAL_functionBtnArray = [], R3_INTERNAL_functionBtnScdArray = [],
	// RDT Menu Vars
	R3_RDT_FILELIST_MAPS = {}, R3_RDT_FILELIST_CURRENTMODE = [], R3_RDT_MENU_LABEL_FIX_NUMBER = 110, R3_DESIGN_RDT_LOADLOCK = false, APP_CAN_RENDER_DEV = true,
	// SCD Editor Vars
	R3_SCD_HIGHLIGHT_FUNCTION = 0, R3_SCD_SEARCH_HIGHLIGHT_FUNCTION = 0,
	// SCD JS Editor Vars
	R3_SCD_CODE_zoom = 12,
	// System display vars
	R3_SYSTEM_availableMonitors = 0,
	// RDT Path Vars
	R3_RDT_PREFIX_EASY = 'DATA_AJ', R3_RDT_PREFIX_HARD = 'DATA_E',
	// Livestatus Vars
	DEBUG_LOCKRENDER = false,
	// Mini Window Database
	R3_MINI_WINDOW_DATABASE = {
		/*
			Order:
			Width, Height, Top, Left, Z-index,  Status Focus DOM element after opening
		*/
		0:  [670,  294,    68,  4,    9999999,  false, ''], 								 // R3V2 Log
		1:  [380,  178,    68,  4,    	  100,  false, ''], 								 // MSG Hex View
		2:  [700,  130,    68,  4,    9999998,  false, ''], 								 // Xdelta Patcher
		3:  [414,  310,    68,  4,    	  100,  false, ''], 								 // SCD Hex View
		4:  [274,  560,    44,  426,  	  101,  false, ''], 								 // SCD Script List
		5:  [232,  560,    68,  858,  	  101,  false, ''], 								 // MSG List
		6:  [860,  342,    68,  4,    	  100,  false, ''], 								 // RID Editor
		7:  [392,  178,    44,  138,  	  100,  false, ''], 								 // MSG Hex Translator
		8:  [300,  124,    44,  744,  	  104,  false, ''], 								 // SCD Preset Window
		9:  [310,  442,    44,  586,  	  103,  false, 'R3_SCD_SEARCH_SCD_SCRIPT_INPUT'],	 // SCD Search Form
		10: [200,  408,    44,  570,   	  101,  false, ''],									 // RDT Export Sections
		11: [780,  294,    68,  4,     100000,  false, ''],									 // R3V2 Help Center
		12: [580,  416,    226, 466,  	  102,  false, 'R3_SCD_SEARCH_SCD_ID_OPCODE_INPUT'], // SCD ID List
		13: [640,  480,    68,  4,    9999999,  false, 'R3_PS1_DISPLAY'],					 // eNGE PS1 Canvas
		14: [760,  480,    68,  12,       105,  false, ''],									 // SCD edit form
		15: [400,  358,    68,  4, 	  999999,   false, 'R3_ITEM_DATABASE_SEARCH'],			 // Item Database
		16: [220,  88,     44,  444, 	  101,  false, 'R3_RDT_timManagerList'],			 // RDT TIM Manager
		17: [220,  88,     44,  486, 	  102,  false, 'R3_RDT_objManagerList'],			 // RDT OBJ Manager
		18: [680,  434,    68,  4, 	  9999998,  false, ''],									 // Backup Manager
		19: [1194, 636,    68,  4, 	  9999998,  false, ''],									 // RE3 Livestatus
		20: [416,  482,    44,  4, 		  105,  false, 'R3_SCD_DOORLINK_MAP_INPUT'],		 // SCD DoorLink
		21: [482,  520,    44,  4,    9999998,  false, 'R3_WIZARD_MOD_NAME'],				 // R3V2 Wizard
		22: [522,  376,    44,  4,    9999999,  false, 'R3_UPDATER_CURRENT_BRANCH'],		 // R3V2 Updater
		23: [350,  438,    44,  4,    9999997,  false, 'R3_OPCODE_FINDER_SEARCH'],			 // SCD Opcode Finder
		24: [404,  454,    44,  4,		  106,  false, '']									 // Leo's Hub
	};
/*
	Main Consts
*/
const R3_MENU_BACK_EXCLUDE = [0, 2, 8],
	// Design Consts
	R3_ICON_maxIcons = 100, R3_TOTAL_MENUS = 20,
	// Tab Index
	R3_TABS_INDEX = {
		0: 1, // RE3 Livestatus
		1: 2, // SCD ID List
		2: 3  // Leo's Hub
	};
/*
	Main Functions
*/
// Resize Check
window.onresize = function(){
	R3_DESIGN_CHECKRES();
};
// Check main window res.
function R3_DESIGN_CHECKRES(){
	if (R3_SYSTEM.APP_ON_BOOT === false && R3_HAS_CRITICAL_ERROR === false){
		if (window.innerWidth < 1216 && window.innerHeight < 711){
			TMS.css('R3_SPLASH', {'display': 'none'});
			TMS.css('R3_APP_HOLDER', {'display': 'none'});
			TMS.css('R3_APP_MAIN_DIV', {'display': 'inline'});
			document.getElementById('R3_MAIN_LOADING_DIV').innerHTML = INCLUDE_R3V2_LOWRES;
		} else {
			TMS.css('R3_APP_HOLDER', {'display': 'inline'});
			TMS.css('R3_APP_MAIN_DIV', {'display': 'none'});
		};
	};
};
// Spawn Critial Error
function R3_DESIGN_CRITIAL_ERROR(args){
	if (args !== undefined && args !== ''){
		var fError = args;
		R3_HAS_CRITICAL_ERROR = true;
		TMS.css('R3_SPLASH', {'display': 'none'});
		TMS.css('R3_APP_HOLDER', {'display': 'none'});
		TMS.css('R3_APP_MAIN_DIV', {'display': 'inline'});
		TMS.css('R3_MAIN_LOADING_DIV', {'display': 'inline', 'box-shadow': '0px 0px 100px #f00'});
		if (args.stack !== undefined){
			fError = args.stack;
		};
		document.getElementById('R3_MAIN_LOADING_DIV').innerHTML = INCLUDE_R3V2_CRITICAL_ERROR;
		document.getElementById('R3_ERROR_CRITICAL_REASON').innerHTML = fError;
		console.error(fError);
	};
};
// Append data
function R3_INIT_APPEND(){
	try {
		var BOX_ITEM_32 = HTML_TEMPLATE = '', tempId, tempOpcode, verStr = 'Web Version';
		// Append displays
		for (var i = 0; i < R3_SYSTEM_availableMonitors; i++){
			HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + i + '">Display ' + (i + 1) + '</option>';
		};
		document.getElementById('SETTINGS_ENABLE_MOVE_DISPLAY_SELECT').innerHTML = HTML_TEMPLATE;
		HTML_TEMPLATE = '';
		// Append Settings
		document.getElementById('R3_RID_EDIT_camType').innerHTML = INCLUDE_RDT_CAMERA_TYPES;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_AT').innerHTML = INCLUDE_EDIT_ATTR;
		document.getElementById('R3_FILEGEN_fontStyle').innerHTML = INCLUDE_FILEGEN_FONTSTYLES;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').innerHTML = INCLUDE_EDIT_ITEM;
		document.getElementById('R3_SETTINGS_RE3_VERSION').innerHTML = INCLUDE_OPTION_RE3_VERSION;
		document.getElementById('R3_SETTINGS_SCD_HEX_VIEW_SIZE').innerHTML = INCLUDE_OPTION_SCD_SIZE;
		document.getElementById('R3_RDT_FILELIST_GAMEMODE').innerHTML = INCLUDE_RDT_FILELIST_GAMEMODE;
		document.getElementById('R3_SCD_SCRIPT_PRESET_LIST').innerHTML = INCLUDE_EDIT_SCD_PRESET_LIST;
		document.getElementById('R3_SETTINGS_SCD_EDITOR_MODE').innerHTML = INCLUDE_SCD_OPTION_EDITOR_MODE;
		document.getElementById('R3_SETTINGS_MSG_DATABASE_MODE').innerHTML = INCLUDE_OPTION_MSG_DECOMPILE;
		document.getElementById('R3_SETTINGS_LIVESTATUS_POSITION').innerHTML = INCLUDE_OPTION_LIVESTATUS_POS;
		// Append about section
		document.getElementById('R3_SPLASH_thanks').innerHTML = INCLUDE_THX;
		document.getElementById('R3_SPLASH_CREATORS').innerHTML = INCLUDE_CRX;
		document.getElementById('R3_SPLASH_VER').innerHTML = 'Ver. ' + INT_VERSION;
		document.getElementById('ABOUT_manyThanks_DIV').innerHTML = '<font class="ABOUT_manyThanks_LBL">Many Thanks to</font>:<br><br>' + INCLUDE_ABOUT_THX + INCLUDE_ABOUT_SNIPPETS + INCLUDE_ENDING;
		// Append RE3 Livestatus Item Box
		for (var c = 0; c < 64; c++){
			BOX_ITEM_32 = '';
			if (c === 32){
				BOX_ITEM_32 = 'R3_LIVESTATUS_BOX_ITEM_MIDDLE';
			};
			HTML_TEMPLATE = HTML_TEMPLATE + '\n<div class="R3_LIVESTATUS_BOX_ITEM ' + BOX_ITEM_32 + '" id="R3_LIVESTATUS_BOX_ITEM_' + c + '" onclick="R3_LIVESTATUS_EDIT_ITEMBOX(' + c + ');">' + 
							'<img src="img/items/00.webp" id="R3_LIVESTATUS_BOX_IMG_' + c + '"><div id="R3_LIVESTATUS_BOX_ITEM_QT_' + c + '" class="R3_LIVESTATUS_BOX_ITEM_QT">0</div>' + 
							'<div class="R3_LIVESTATUS_BOX_ITEM_LBL" id="R3_LIVESTATUS_BOX_ITEM_LBL_' + c + '">(<font class="monospace mono_xyzr">' + R3_tools.fixVars(c, 2) + '</font>) ' +
							'Empty Slot</div></div>';
		};
		document.getElementById('R3_LIVESTATUS_BOX_HOLDER').innerHTML = HTML_TEMPLATE;
		// App Version
		document.getElementById('ABOUT_LBL_R3_VERSION').innerHTML = INT_VERSION;
		if (R3_SYSTEM.web.isBrowser === false){
			if (R3_SYSTEM.web.is_NW === true){
				verStr = 'NW.js Version: ' + process.versions['node-webkit'] + ' (' + process.arch + ')';
			};
			if (R3_SYSTEM.web.is_ELECTRON === true){
				verStr = 'Electron Version:' + process.versions['electron'] + ' (' + process.arch + ')';
			};
		};
		document.getElementById('ABOUT_LBL_NW_VERSION').innerHTML = verStr;
		// Array for Search Fields
		if (R3_SYSTEM.APP_ON_BOOT === true){
			R3_DESIGN_prepareBtnArray();
		};
		// Add SCD Titles for functions
		Object.keys(R3_SCD_DATABASE).forEach(function(cItem, cIndex){
			tempOpcode = R3_tools.fixVars(parseInt(cIndex).toString(16), 2);
			tempId = 'BTN_SCD_' + tempOpcode.toUpperCase() + '_' + R3_SCD_DATABASE[tempOpcode.toLowerCase()][1].replace(' [', '_').replace(']', '').replace(RegExp(' ', 'gi'), '_').replace('_/', '');
			if (document.getElementById(tempId) !== null){
				document.getElementById(tempId).title = R3_SCD_INFO_DATABASE[tempOpcode];
			};
		});

	} catch (err) {
		R3_SYSTEM.appCanStart = false;
		R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to append main data! [R3_INIT_APPEND] <br>Reason: ' + err);
		if (R3_SYSTEM.APP_ON_BOOT === true){
			R3_DESIGN_CRITIAL_ERROR(err);
		} else {
			R3_SYSTEM.alert('ERROR: Unable to append main data! [R3_INIT_APPEND]\nReason: ' + err);
		};
	};
};
// Show Menu
function R3_SHOW_MENU(menuId){
	if (R3_MENU_LOCK !== true && R3_HAS_CRITICAL_ERROR === false){
		if (menuId !== R3_MENU_CURRENT){
			var canClearCanvas = true;
			if (menuId === undefined){
				menuId = 4;
			};
			R3_MENU_CURRENT = menuId;
			// Clear extra renderer
			clearInterval(FG_EXTRA_RENDER);
			for (var c = 0; c < (R3_TOTAL_MENUS + 1); c++){
				TMS.css('MENU_' + c, {'display': 'none'});
			};
			/*
				Special adjusts
			*/
			// About Page [BG]
			if (menuId === 1){
				if (R3_GAME.gameRunning === true){
					R3_LIVESTATUS_CLOSE_BAR();
				};
				R3_MINIWINDOW.close(0);
				TMS.css('R3_MENU_MAIN_TOP', {'display': 'none'});
				TMS.css('MENU_1', {'height': '100%', 'top': '0px'});
				TMS.fadeIn('ABOUT_BG', 21000);
			} else {
				if (R3_GAME.gameRunning === true){
					R3_LIVESTATUS_OPEN_BAR();
				};
				if (menuId !== 2){
					TMS.css('R3_MENU_MAIN_TOP', {'display': 'inline-flex'});
				};
			};
			// MSG Editor
			if (menuId === 7){
				if (RDT_arquivoBruto !== undefined){
					document.title = R3_SYSTEM.appTitle + ' - MSG Editor - File: ' + R3_RDT_mapName + '.RDT';
					TMS.css('BTN_MAIN_32', {'display': 'inline-flex'});
				} else {
					TMS.css('BTN_MAIN_32', {'display': 'none'});
				};
			};
			// SCD Editor
			if (menuId === 9){
				R3_MINIWINDOW.close([3, 12]);
				// Fix Scroll
				TMS.scrollTop({
					'SCD_FUNCTION_LIST': 0,
					'R3_SCD_SCRIPT_INNER': 0
				});
				if (SCD_arquivoBruto !== undefined){
					R3_DESIGN_SCD_openScriptList();
					setTimeout(function(){
						document.getElementById('R3_SCD_SCRIPT_LISTS').scrollTop = 0;
						TMS.focus('SCD_FUNCTION_SEARCH_FIELD');
					}, 40);
				};
				// Generate new SCD file if empty
				if (SCD_arquivoBruto === undefined){
					R3_SCD_NEW_FILE();
				};
			};
			// RDT Editor
			if (menuId === 10){
				if (R3_SYSTEM.web.isBrowser === true){
					TMS.css('R3_RDT_FILELIST', {'display': 'none'});
					TMS.css('R3_RDT_IMPORT_RDT', {'display': 'none'});
				} else {
					TMS.css('R3_PAGE_ICON_BG_7', {'display': 'none'});
				};
				document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
				R3_RDT_FILELIST_UPDATELIST();
				setTimeout(function(){
					document.getElementById('R3_RDT_FILELIST_SERACH').focus();
				}, 50);
				if (RDT_arquivoBruto !== undefined){
					document.title = R3_SYSTEM.appTitle + ' - RDT Editor - File: ' + R3_RDT_mapName + '.RDT';
				};
			} else {
				R3_MINIWINDOW.closeAllRdtMiniWindows();
			};
			// Main Menu
			if (menuId !== 4){
				R3_MINIWINDOW.close(23);
				R3_DESIGN_OPEN_CLOSE_LATEST(1);
				TMS.css('MENU_' + menuId, {'display': 'block'});
				TMS.css('R3_MENU_ITEM_OPCODE_FINDER', {'display': 'none'});
				// RE3 Scroll
				if (menuId === 8){
					document.getElementById('R3_LIVESTATUS_BOX_ITEM_LBL_26').scrollIntoView();
				};
			} else {
				if (R3_SYSTEM.web.isBrowser === false && R3_MOD.enableMod === true){
					if (R3_THEPIC === 'R50606.JPG' || R3_THEPIC === 'R50605.JPG'){
						canClearCanvas = false;
						R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', 'BEEP. BEEP. BOOP. BEBOBEBOBIIIIIP... BOOP!\n\nI see you got a good RNG here!\n\nTemmieHeartz!', 'RE3', 40);
					};
					TMS.css('R3_MENU_ITEM_OPCODE_FINDER', {'display': 'block'});
				};
				TMS.css('BTN_MAIN_53', {'display': 'inline-flex'});
				TMS.css('BTN_SCD_HACK', {'display': 'none'});
				R3_DESIGN_OPEN_CLOSE_LATEST(0);
			};
			// Loading screen
			if (menuId === 2){
				R3_MINIWINDOW.close([0, 2, 11, 15]);
			};
			R3_DESIGN_CHECK_SHOW_EXECS();
			// Append dropdown menu
			if (R3_DESIGN_DROPDOWN_DATABASE[menuId][0] !== 'NO_DROPDOWN'){
				document.getElementById('R3_MENU_CURRENT_TOOL_HOLDER').innerHTML = R3_DESIGN_DROPDOWN_DATABASE[menuId][1];
				TMS.css('R3_MENU_CURRENT_TOOL_HOLDER', {'min-width': R3_DESIGN_DROPDOWN_DATABASE[menuId][2] + 'px'});
				document.getElementById('R3_MENU_DROPDOWN_LBL').innerHTML = R3_DESIGN_DROPDOWN_DATABASE[menuId][0];
				TMS.css('R3_MENU_CURRENT_TOOL', {'display': 'inline-block'});
			} else {
				TMS.css('R3_MENU_CURRENT_TOOL', {'display': 'none'});
			};
			/*
				End
			*/
			if (canClearCanvas === true){
				document.getElementById('MAIN_HIDDEN_CANVAS').innerHTML = '';
			};
			R3_DISC_setActivity(R3_DISC_MENUS[menuId][0], R3_DISC_MENUS[menuId][1]);
			R3_MINIWINDOW.close(11);
			R3_MENU_HISTORY.push(menuId);
			R3_WEB_ALERT();
		};
	};
};
// Menu Navigation
function R3_MENU_GOBACK(){
	R3_DESIGN_CHECK_SHOW_EXECS();
	if (R3_MENU_LOCK !== true){
		if (R3_MENU_HISTORY.length === 1){
			TMS.css('MENU_' + R3_MENU_HISTORY[0], {'display': 'none'});
			R3_SHOW_MENU(4);
		} else {
			var check = R3_MENU_BACK_EXCLUDE.indexOf(R3_MENU_HISTORY[(R3_MENU_HISTORY.length - 2)]);
			TMS.css('MENU_' + R3_MENU_HISTORY[(R3_MENU_HISTORY.length - 1)], {'display': 'none'});
			if (check !== -1){
				R3_MENU_EXIT();
			} else {
				if (R3_MENU_HISTORY[(R3_MENU_HISTORY.length - 2)] === R3_MENU_CURRENT){
					R3_MENU_HISTORY = [];
				};
				R3_SHOW_MENU(R3_MENU_HISTORY[(R3_MENU_HISTORY.length - 2)]);
			};
		};
	};
};
// Exit from tool
function R3_MENU_EXIT(){
	R3_UTILS_CLEANTOOLS();
	R3_UTILS_VAR_CLEAN();
	R3_SHOW_MENU(4);
};
// Disable PC version exec buttons if emu
function R3_DESIGN_CHECK_SHOW_EXECS(){
	if (R3_SYSTEM.web.isBrowser === false){
		if (R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].gameData.isConsole === true){
			TMS.css('R3_MENU_RUN_GAME', {'display': 'none'});
		} else {
			TMS.css('R3_MENU_RUN_GAME', {'display': 'inline-block'});
		};
	};
};
// Web Alert
function R3_WEB_ALERT(){
	if (APP_CAN_RENDER_DEV === true && R3_SYSTEM.web.isBrowser === true){
		R3_FILEGEN_selectTextColor(0);
		R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', 'You are running R3ditor V2 web version!\nTo have all features (Like RE3 Livestatus, Previews, ARD Extractor and more), download the local version!\n\nVisit https://themitosan.github.io/ to get download link.', 'RE1', 10);
	};
};
// Show Tabs
function R3_DESIGN_SHOWTABS(tabIndex, id){
	if (R3_TABS_INDEX[tabIndex] !== undefined){
		for (var c = 0; c < (R3_TABS_INDEX[tabIndex] + 1); c++){
			TMS.css('R3_MENU_' + tabIndex + '_' + c, {'display': 'none'});
			TMS.removeClass('R3_TABS_' + tabIndex + '_' + c, 'R3_TAB_SELECT');
		};
		TMS.css('R3_MENU_' + tabIndex + '_' + id, {'display': 'block'});
		TMS.addClass('R3_TABS_' + tabIndex + '_' + id, 'R3_TAB_SELECT');
	};
};
// Adjust Design
function R3_DESIGN_ADJUST(){
	// Load settings changes
	R3_DESIGN_processSettingsChanges();
	// Add icons to buttons and bg
	var getFiles, cMiniWindow, thePic;
	for (var c = 0; c < (R3_ICON_maxIcons + 1); c++){
		if (document.getElementById('BTN_MAIN_' + c) !== null){
			TMS.css('BTN_MAIN_' + c, {'background-image': 'url(\'./img/icons/icon-' + c + '.webp\')'});
		};
		if (document.getElementById('R3_PAGE_ICON_BG_' + c) !== null){
			TMS.css('R3_PAGE_ICON_BG_' + c, {'background-image': 'url(\'./img/icons/icon-' + c + '.webp\')'});
		};
	};
	// Init mini windows
	Object.keys(R3_MINI_WINDOW_DATABASE).forEach(function(cItem, cIndex){
		cMiniWindow = document.getElementById('R3V2_MINI_WINDOW_' + cIndex);
		if (cMiniWindow !== null){
			R3_MINIWINDOW.INIT('R3V2_MINI_WINDOW_' + cIndex);
		};
	});
	// Prepare SCD editor
	R3_SCD_SWAP_EDITOR_MODE(R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE);
	// [RE3SET] - Disable WIP Forms
	TMS.disableElement(['BTN_MAIN_21','BTN_MAIN_58','BTN_MAIN_59','BTN_MAIN_60','BTN_MAIN_61']);
	// Fix RDT Path Labels and disable some unused functions in non-windows os / web
	if (R3_SYSTEM.web.isBrowser === false){
		// Mod Menu
		TMS.css('R3_MENU_MOD', {'display': 'block'});
		TMS.css('SETTINGS_LI_CLEARCACHE', {'display': 'none'});
		if (INT_VERSION.indexOf('DEV_VERSION') !== -1){
			TMS.css('R3_MENU_ITEM_GITHUB_UPDATER', {'display': 'block'});
		};
		if (process.platform !== 'win32'){
			R3_RDT_MENU_LABEL_FIX_NUMBER = 124;
			// Buttons
			TMS.disableElement(['BTN_MAIN_11', 'BTN_MAIN_12', 'BTN_MAIN_14']);
		} else {
			R3_RDT_MENU_LABEL_FIX_NUMBER = 104;
		};
		// Get random image for main bg
		if (R3_GET_BG === false){
			if (R3_MOD.enableMod === true){
				getFiles = R3_MODULES.fs.readdirSync(R3_SYSTEM.paths.mod + '/Assets/DATA_A/BSS/');
				getFiles.forEach(function(cFile, cIndex){
					if (cFile.indexOf('SLD') !== -1){
						getFiles.splice(cIndex, 1);
					};
				});
				thePic = Math.floor(Math.random() * Math.floor(getFiles.length)), fileFix = '';
				if (R3_SETTINGS.APP_useImageFix === true){
					fileFix = 'file://';
				};
				document.getElementById('R3_HOME_BG').src = fileFix + R3_SYSTEM.paths.mod + '/Assets/DATA_A/BSS/' + getFiles[thePic];
				R3_THEPIC = getFiles[thePic];
				if (R3_THEPIC === 'R50605.JPG' || R3_THEPIC === 'R50606.JPG'){
					R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', INCLUDE_RE3_BEEP_BOOP, 'RE3', 40);
				};
				if (R3_SETTINGS.ENABLE_ANIMATIONS === true){
					TMS.fadeIn('R3_HOME_BG', 7100);
				} else {
					TMS.css('R3_HOME_BG', {'display': 'inline'});	
				};
				// End
				R3_GET_BG = true;
			} else {
				TMS.css('R3_HOME_BG', {'display': 'none'});
			};
		};
		// Mod Enabled
		if (R3_MOD.enableMod === true){
			TMS.css('R3_MENU_ITEM_LEOS_HUB', {'display': 'block'});
			TMS.css('R3_MENU_ITEM_OPCODE_FINDER', {'display': 'block'});
		};
		// Leo's settings
		TMS.css('SETTINGS_DIV_LEO_PATH', {'display': 'block'});
	} else {
		// Hide run game if web mode
		TMS.css('BTN_MOD_EXPORT', {'display': 'none'});
		TMS.css('R3_MENU_RUN_GAME', {'display': 'none'});
		TMS.css('SETTINGS_DIV_ENGE', {'display': 'none'});
		TMS.css('SETTINGS_DIV_PATHS', {'display': 'none'});
		TMS.css('SETTINGS_LI_DISCORD', {'display': 'none'});
		TMS.css('SETTINGS_LI_MOVEWINDOW', {'display': 'none'});
		TMS.css('SETTINGS_DIV_GAME_MODE', {'display': 'none'});
		TMS.css('SETTINGS_DIV_LIVESTATUS', {'display': 'none'});
		TMS.css('SETTINGS_LI_RECENTPOPUP', {'display': 'none'});
		TMS.css('R3_FILEGEN_BACKGROUND_DIV', {'display': 'none'});
		TMS.css('SETTINGS_LI_UPDATE_DOORLINK', {'display': 'none'});
		TMS.css('SETTINGS_LI_ENABLE_MOVE_DISPLAY', {'display': 'none'});
		// Hide about nw version
		TMS.css('DIV_ABOUT_NW', {'display': 'none'});
		// Fix Number
		R3_RDT_MENU_LABEL_FIX_NUMBER = 124;
		// Buttons
		TMS.disableElement(['BTN_MAIN_BACKUP', 'BTN_MAIN_11', 'BTN_MAIN_12', 'BTN_MAIN_14', 'BTN_MAIN_55', 'BTN_MAIN_15', 'BTN_MAIN_16', 'BTN_MAIN_33']);
		// Remove big preview on file generator
		TMS.css('R3_FILEGEN_RENDERAREA_BIG', {'display': 'none'});
		// Adjust some ranges if firefox
		if (R3_SYSTEM.web.is_FIREFOX === true){
			// Fix log window on Firefox
			R3_MINI_WINDOW_DATABASE[0][0] = 800;
			TMS.css('R3_RID_EDIT_rangePosX', {'width': '120px'});
			TMS.css('R3_RID_EDIT_rangePosY', {'width': '120px'});
			TMS.css('R3_RID_EDIT_rangePosZ', {'width': '120px'});
			TMS.css('R3_RID_EDIT_rangePosR', {'width': '120px'});
		};
	};
	// Fix percentage design
	R3_LIVESTATUS_OPEN_BAR();
	setTimeout(function(){
		R3_LIVESTATUS_CLOSE_BAR();
	}, 10);
};
/*
	Toggle fullscreen modes
	Modes:

	0 = Enter
	1 = Leave
*/
function R3_DESIGN_toggleFullScreen(mode){
	if (mode === 0){
		if (R3_SYSTEM.web.isBrowser === false && R3_SYSTEM.web.is_NW === true){
			require('nw.gui').Window.get().enterFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		};
	} else {
		if (R3_SYSTEM.web.isBrowser === false && R3_SYSTEM.web.is_NW === true){
			nw.Window.get().leaveFullscreen();
		} else {
			var webFs = window.fullScreen;
			if (typeof document.webkitIsFullScreen !== 'undefined'){
				webFs = document.webkitIsFullScreen;
			};
			if (webFs === true){
				document.exitFullscreen();
			};
		};
	};
};
// Display Main menu
function R3_GOTO_MAIN(){
	try {
		if (R3_SYSTEM.appCanStart === true && R3_HAS_CRITICAL_ERROR === false){
			// Check fullscreen
			if (R3_SETTINGS.SETTINGS_ENABLE_FULLSCREEN === true){
				R3_DESIGN_toggleFullScreen(0);
			} else {
				R3_DESIGN_toggleFullScreen(1);
			};
			// Get random character icon
			var getRandomPlr = parseInt(Math.floor(Math.random() * 2) + 1);
			if (getRandomPlr === 0 || getRandomPlr > 2){
				getRandomPlr = 1;
			};
			TMS.css('R3_SPLASH_BG', {'background-image': 'url(\'./img/PLR_0' + getRandomPlr + '.webp\')'});
			// Animation
			if (R3_SETTINGS.ENABLE_ANIMATIONS === true){
				TMS.fadeIn('R3_SPLASH', 400);
				TMS.fadeIn('R3_SPLASH_TITLE', (R3_internalHoldTime / 4));
				TMS.animate('R3_SPLASH_TITLE', {'left': '26%'}, (R3_internalHoldTime * 1.1));
				TMS.animate('R3_SPLASH_BG', {'background-position-x': 'calc(100% + 110px)'}, (R3_internalHoldTime * 1.1));
				// Frame Anim
				TMS.fadeIn('R3_SPLASH_BG_FRAME_TOP', (R3_internalHoldTime / 2));
				TMS.fadeIn('R3_SPLASH_BG_FRAME_BOTOM', (R3_internalHoldTime / 2));
				// End
				TMS.fadeIn('R3_SPLASH_BG', (R3_internalHoldTime * 1.1));
				TMS.fadeIn('R3_SPLASH_thanks', (R3_internalHoldTime / 4));
				TMS.fadeIn('R3_SPLASH_BG_BIG', (R3_internalHoldTime * 1.2));
			} else {
				TMS.css('R3_SPLASH_TITLE', {'display': 'inline'});
				// Frame
				TMS.css('R3_SPLASH_BG_FRAME_TOP', {'display': 'inline'});
				TMS.css('R3_SPLASH_BG_FRAME_BOTOM', {'display': 'inline'});
				TMS.css('R3_SPLASH_BG', {'display': 'inline', 'background-position-x': 'calc(100% + 110px)'});
				// End
				TMS.css('R3_SPLASH_thanks', {'display': 'inline'});
				TMS.css('R3_SPLASH_BG_BIG', {'display': 'inline'});
				TMS.css('R3_SPLASH', {'display': 'inline'});
			};
			setTimeout(function(){
				TMS.css('R3_APP_HOLDER', {'display': 'inline'});
				TMS.css('R3_APP_MAIN_DIV', {'display': 'none'});
				R3_DESIGN_OPEN_CLOSE_LATEST(0);
				R3_SYSTEM.APP_ON_BOOT = false;
				R3_LOAD_CHECK_EXTRA();
			}, R3_internalHoldTime);
		};
	} catch (err){
		R3_DESIGN_CRITIAL_ERROR(err);
	};
};
// Show Interface
function R3_DESIGN_SHOW_INTERFACE(){
	if (R3_SETTINGS.R3_SYSTEM.APP_ON_BOOT === false){
		if (R3_SETTINGS.ENABLE_ANIMATIONS === true){
			TMS.fadeOut('R3_APP_MAIN_DIV', 100);
		} else {
			TMS.css('R3_APP_MAIN_DIV', {'display': 'none'});
		};
		R3_MENU_CURRENT = 4;
	} else {
		R3_SYSTEM.reload();
	};
};
// Open Log window
function R3_DESIGN_openLogWindow(){
	if (R3_SETTINGS.SETTINGS_DISABLE_LOG === false && R3_SETTINGS.R3_NW_ARGS_DISABLE_LOG === false){
		R3_MINIWINDOW.open(0);
	};
};
// See full log
function R3_DESIGN_seeFullLog(){
	if (R3_SETTINGS.SETTINGS_DISABLE_LOG === false && R3_SETTINGS.R3_NW_ARGS_DISABLE_LOG === false){
		TMS.setInnerHtml('R3_LOG_HOLDER', R3_SYSTEM.log_INTERNAL);
		TMS.css('R3V2_LOG_FULLVIEW', {'display': 'none'});
		R3_SYSTEM.log_RETURN = true;
	};
};

/*
	MiniWindow API
*/
tempFn_R3_MINIWINDOW = {};
/*
	Drag Elements R3_DESIGN_enableDragElement
	Original Code: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
*/
tempFn_R3_MINIWINDOW['INIT'] = function(elementId){
	var elmnt = document.getElementById(elementId), pos1 = pos2 = pos3 = pos4 = 0, finalTop, finalLeft;
	if (document.getElementById(elementId + '_HEADER') !== null){
		document.getElementById(elementId + '_HEADER').onmousedown = MINI_WINDOW_dragMouseDown;
	} else {
		elmnt.onmousedown = MINI_WINDOW_dragMouseDown;
	};
	function MINI_WINDOW_dragMouseDown(e){
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmousemove = MINI_WINDOW_elementDrag;
		document.onmouseup = MINI_WINDOW_closeDragElement;
	};
	function MINI_WINDOW_elementDrag(e){
		// console.info(domId);
		var domId = elmnt.id;
		e = e || window.event;
		e.preventDefault();
		pos1 = (pos3 - e.clientX);
		pos2 = (pos4 - e.clientY);
		pos3 = e.clientX;
		pos4 = e.clientY;
		finalTop = (elmnt.offsetTop - pos2);
		finalLeft = (elmnt.offsetLeft - pos1);
		if (finalTop < 30){
			finalTop = 30;
		};
		if (finalLeft < 4){
			finalLeft = 4;
		};
		if (domId === 'R3V2_MINI_WINDOW_14'){
			// Snap Search function with edit form
			if (R3_MINI_WINDOW_DATABASE[9][5] === true && R3_SETTINGS.SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM === true){
				R3_MINIWINDOW.snap(14, 9, true);
			};
			// Snap DoorLink
			if (R3_MINI_WINDOW_DATABASE[20][5] === true){
				R3_MINIWINDOW.snap(14, 20, true);
			};
		};
		// End
		elmnt.style.top = finalTop + 'px';
		elmnt.style.left = finalLeft + 'px';
	};
	function MINI_WINDOW_closeDragElement(){
		document.onmouseup = null;
		document.onmousemove = null;
	};
};
// Open Mini Window R3_DESIGN_MINIWINDOW_OPEN
tempFn_R3_MINIWINDOW['open'] = function(windowId, mode){
	// console.info('Window ID: ' + windowId + ' - ' + R3_MINI_WINDOW_DATABASE[windowId][5]);
	if (R3_MINI_WINDOW_DATABASE[windowId] !== undefined){
		var focusDomName, scrollSize, fixLeft = '792px';
		// Close all Mini-Windows if RDT editor is active
		if (R3_MENU_CURRENT === 10){
			R3_MINIWINDOW.closeAllRdtMiniWindows();
		};
		if (R3_MENU_CURRENT !== 1 && R3_MINI_WINDOW_DATABASE[windowId][5] === false){
			if (windowId !== 0 && windowId !== 11){
				// SCD Hex View
				if (windowId === 3){
					TMS.css('R3V2_MINI_WINDOW_' + windowId, {
						'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
						'top': R3_MINI_WINDOW_DATABASE[windowId][2] + 'px',
						'left': R3_MINI_WINDOW_DATABASE[windowId][3] + 'px',
						'width': (R3_MINI_WINDOW_DATABASE[windowId][0] * R3_SETTINGS.SETTINGS_SCD_HEXVIEW_FACTOR) + 'px',
						'height': (R3_MINI_WINDOW_DATABASE[windowId][1] * R3_SETTINGS.SETTINGS_SCD_HEXVIEW_FACTOR) + 'px'
					});
				} else {
					TMS.css('R3V2_MINI_WINDOW_' + windowId, {
						'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
						'top': R3_MINI_WINDOW_DATABASE[windowId][2] + 'px',
						'left': R3_MINI_WINDOW_DATABASE[windowId][3] + 'px',
						'width': R3_MINI_WINDOW_DATABASE[windowId][0] + 'px',
						'height': R3_MINI_WINDOW_DATABASE[windowId][1] + 'px'
					});
				};
			} else {
				// Log window
				if (R3_SYSTEM.web.is_FIREFOX === true){
					fixLeft = '872px';
				};
				TMS.css('R3V2_MINI_WINDOW_' + windowId, {
					'top': 'calc(100% - 342px)',
					'left': 'calc(100% - ' + fixLeft + ')',
					'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
					'width': R3_MINI_WINDOW_DATABASE[windowId][0] + 'px',
					'height': R3_MINI_WINDOW_DATABASE[windowId][1] + 'px'
				});
				scrollSize = document.getElementById('R3_LOG_HOLDER').scrollHeight;
				document.getElementById('R3_LOG_HOLDER').scrollTop = scrollSize;
				document.getElementById('R3V2_TITLE_LOG_WINDOW').innerHTML = 'R3ditor V2 Log <i>[' + R3_SYSTEM.logCounter_INFO + ' Infos, ' + R3_SYSTEM.logCounter_WARN + ' Warns and ' + R3_SYSTEM.logCounter_ERROR + ' Errors]</i>';
				// Append log if it's open
				if (R3_SYSTEM.RELEASE_LOG_DATA === true){
					R3_SYSTEM.appendLog();
				};
			};
			// R3V2 Help Center
			if (windowId === 11){
				TMS.css('R3V2_MINI_WINDOW_' + windowId, {
					'left': 'calc(50% - 350px)',
					'z-index': R3_MINI_WINDOW_DATABASE[0][4],
					'top': R3_MINI_WINDOW_DATABASE[windowId][2] + 'px',
					'width': R3_MINI_WINDOW_DATABASE[windowId][0] + 'px',
					'height': 'calc(100% - 90px)'
				});
				document.getElementById('R3_HELP_CENTER_HOLDER').scrollTop = 0;
			};
			// eNGE Window Size
			if (windowId === 13){
				TMS.css('R3V2_MINI_WINDOW_' + windowId, {
					'width': SETTINGS_ENGE_WIDTH_RES + 'px',
					'height': SETTINGS_ENGE_HEIGHT_RES + 'px',
					'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
					'top': R3_MINI_WINDOW_DATABASE[windowId][2] + 'px',
					'left': R3_MINI_WINDOW_DATABASE[windowId][3] + 'px'
				});
			};
		};
		if (R3_SETTINGS.ENABLE_ANIMATIONS === true){
			TMS.fadeIn('R3V2_MINI_WINDOW_' + windowId, 80);
		} else {
			TMS.css('R3V2_MINI_WINDOW_' + windowId, {'display': 'block'});
		};
		// Focus element
		focusDomName = R3_MINI_WINDOW_DATABASE[windowId][6];
		if (focusDomName !== '' && document.getElementById(focusDomName) !== null){
			setTimeout(function(){
				document.getElementById(R3_MINI_WINDOW_DATABASE[windowId][6]).focus();
			}, 30);
		};
		// Close DoorLink if SCD Search Form
		if (windowId === 9){
			R3_MINIWINDOW.close(20);
		};
		// Disable shortcuts if eNGE is opened
		if (windowId === 13){
			eNGE_FOCUS();	
		};
		// Adjust window size if SCD edit form
		if (windowId === 14 && R3_SCD_DATABASE[R3_SCD_currentOpcode] !== undefined){
			TMS.css('R3V2_MINI_WINDOW_' + windowId, {'width': R3_SCD_DATABASE[R3_SCD_currentOpcode][6] + 'px', 'height': R3_SCD_DATABASE[R3_SCD_currentOpcode][7] + 'px'});
			R3_MINIWINDOW.adjustMiniWindowForm();
		};
		// Process opening mode
		if (mode !== undefined && R3_MINI_WINDOW_DATABASE[windowId][5] === false){
			// Center Screen
			if (mode === 'center'){
				var windowW = window.innerWidth,
					windowH = window.innerHeight,
					formW = document.getElementById('R3V2_MINI_WINDOW_' + windowId).offsetWidth,
					formH = document.getElementById('R3V2_MINI_WINDOW_' + windowId).offsetHeight,
					finalW = ((windowW / 2) - (formW / 2)),
					finalH = ((windowH / 2) - (formH / 2));
				// End
				TMS.css('R3V2_MINI_WINDOW_' + windowId, {'left': finalW + 'px', 'top': finalH + 'px'});
			};
		};
		/*
			End
		*/
		R3_MINI_WINDOW_DATABASE[windowId][5] = true;
	} else {
		R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to open window! <br>Reason: Window ID does not exist!');
	};
};
// Close Mini Window R3_DESIGN_MINIWINDOW_CLOSE
tempFn_R3_MINIWINDOW['close'] = function(windowId){
	var checkButton, closeList = [];
	if (windowId === 'all'){
		Object.keys(R3_MINI_WINDOW_DATABASE).forEach(function(cItem, cIndex){
			closeList.push(cItem);
		});
	} else {
		if (typeof windowId === 'object'){
			closeList = windowId;
		} else {
			closeList.push(parseInt(windowId));
		};
	};
	closeList.forEach(function(cItem, cIndex){
		windowId = parseInt(cItem);
		// Give R3ditor V2 shortcuts again!
		if (windowId === 13){
			eNGE_LOST_FOCUS();
		};
		// Last file opened fix
		if (R3_MENU_CURRENT === 4 && R3_SETTINGS.SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
			R3_DESIGN_OPEN_CLOSE_LATEST(0);
		};
		// Help Center
		checkButton = document.getElementById('R3V2_MINI_WINDOW_MAXIMIZE_' + windowId);
		if (checkButton !== null){
			TMS.css('R3V2_MINI_WINDOW_MAXIMIZE_' + windowId, {'display': 'inline'});
		};
		// Clear Log fix
		if (windowId === 0){
			TMS.css('R3V2_MINI_WINDOW_CLEAR_LOG', {'right': '105px'});
		};
		// Clear Item database
		if (windowId === 15){
			R3_DESIGN_CLEAN_ITEM_DATABASE();
		};
		// End
		TMS.css('R3V2_MINI_WINDOW_' + windowId, {'display': 'none'});
		R3_MINI_WINDOW_DATABASE[windowId][5] = false;
	});
};
// Maximize window R3_DESIGN_MINIWINDOW_MAXIMIZE
tempFn_R3_MINIWINDOW['maximize'] = function(windowId){
	if (windowId !== undefined){
		if (R3_SETTINGS.ENABLE_ANIMATIONS === false){
			TMS.fadeOut('R3V2_MINI_WINDOW_MAXIMIZE_' + windowId, 100);
			TMS.css('R3V2_MINI_WINDOW_' + windowId, {'top': '44px', 'left': '4px', 'width': 'calc(100% - 122px)', 'height': 'calc(100% - 88px)'});
		} else {
			TMS.css('R3V2_MINI_WINDOW_MAXIMIZE_' + windowId, {'display': 'none'});
			TMS.css('R3V2_MINI_WINDOW_' + windowId, {'width': 'calc(100% - 122px)', 'height': 'calc(100% - 88px)'});
			TMS.animate('R3V2_MINI_WINDOW_' + windowId, {'top': '44px', 'left': '4px'}, 100, 'cubic-bezier(0, 1, 0, 1)');
		};
		// Clear Log fix
		if (windowId === 0){
			TMS.css('R3V2_MINI_WINDOW_CLEAR_LOG', {'right': '32px'});
		};
		// Last file opened fix
		if (R3_MENU_CURRENT === 4 && R3_SETTINGS.SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
			R3_DESIGN_OPEN_CLOSE_LATEST(1);
		};
	};
};
// Snap two mini windows R3_DESIGN_MINIWINDOW_SNAP
tempFn_R3_MINIWINDOW['snap'] = function(windowA, windowB, fixDrag){
	var winA = document.getElementById('R3V2_MINI_WINDOW_' + windowA), winB = document.getElementById('R3V2_MINI_WINDOW_' + windowB);
	if (winA !== null && winB !== null){
		if (fixDrag !== true){
			var calcNextX = (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).x - (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowB).w / 2));
			if (calcNextX < 4){
				calcNextX = 4;
			};
			if (R3_SETTINGS.ENABLE_ANIMATIONS === true){
				TMS.animate('R3V2_MINI_WINDOW_' + windowA, {'left': calcNextX + 'px'}, 400, 'cubic-bezier(0, 1.06, 0, 1.02)');
			} else {
				TMS.css('R3V2_MINI_WINDOW_' + windowA, {'left': calcNextX + 'px'});
			};
		};
		TMS.css('R3V2_MINI_WINDOW_' + windowB, {
			'top': R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).y + 'px',
			'left': (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).x + (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).w + 10)) + 'px'
		});
	};
};
// Adjust miniwindow if are SCD Edit Form (Advanced stuff) R3_DESIGN_adjustMiniWindowForm
tempFn_R3_MINIWINDOW['adjustMiniWindowForm'] = function(){
	// Adjust window size on Set Interactive Object [AOT_SET]
	if (R3_SCD_currentOpcode === '63'){
		var cType = document.getElementById('R3_SCD_EDIT_63_aot').value;
		if (cType === '04'){
			TMS.css('R3V2_MINI_WINDOW_14', {'height': '380px'});
		} else {
			TMS.css('R3V2_MINI_WINDOW_14', {'height': '260px'});
		};
	};
};
// Close all miniwindows from RDT editor R3_DESIGN_closeAllRdtMiniWindows
tempFn_R3_MINIWINDOW['closeAllRdtMiniWindows'] = function(){
	R3_MINIWINDOW.close([6, 9, 10, 16, 17, 20]);
};
const R3_MINIWINDOW = tempFn_R3_MINIWINDOW;
delete tempFn_R3_MINIWINDOW;

/*
	Ranges
*/
// Update Ranges
function R3_DESIGN_UPDATE_RANGES(rangeId, lblId, usePercentage, maxPercent){
	if (rangeId !== undefined && lblId !== undefined){
		var rangeValue, rangeDom = document.getElementById(rangeId);
		if (rangeDom !== null){
			rangeValue = parseInt(rangeDom.value);
			if (usePercentage === true){
				if (maxPercent === undefined){
					maxPercent = rangeValue;
				};
				document.getElementById(lblId).innerHTML = R3_tools.parsePercentage(rangeValue, maxPercent);
			} else {
				document.getElementById(lblId).innerHTML = rangeValue;
			};
		};
	};
};
// Get CSS pos. from DOM
function R3_DESIGN_getCssParams(domId){
	if (domId !== undefined){
		var remPx = function(str){
				return parseInt(str.replace('px', ''));
			}, winStyle = document.getElementById(domId).style;
		return {x: remPx(winStyle.left), y: remPx(winStyle.top), w: remPx(winStyle.width), h: remPx(winStyle.height), position: winStyle.position};
	};
};
/*
	Search Fields
*/
// Prepare search
function R3_DESIGN_prepareBtnArray(){
	var c = 0, R3_INTERNAL_functionBtnList = document.getElementsByClassName('MSG_FUNCTION_BUTTON'),
		R3_INTERNAL_functionScdList = document.getElementsByClassName('SCD_FUNCTION_BUTTON');
	// MSG Editor
	while (c < R3_INTERNAL_functionBtnList.length){
		R3_INTERNAL_functionBtnArray.push(R3_INTERNAL_functionBtnList[c].id.slice(8, R3_INTERNAL_functionBtnList[c].id.length));
		c++;
	};
	// SCD Editor
	c = 0;
	while (c < R3_INTERNAL_functionScdList.length){
		R3_INTERNAL_functionBtnScdArray.push(R3_INTERNAL_functionScdList[c].id.slice(8, R3_INTERNAL_functionScdList[c].id.length));
		c++;
	};
};
// Function holder - Seek Function
function R3_fnHolder_seekFunction(kPress, domSearchField, domSearchResultCanvas, domMainFunctionList, fnPrefix){
	var tmpFunc, cFunc, funcSeekName, SEEK_RESULTS, kp = kPress.which || kPress.keyCode;
	if (kp === 8){
		document.getElementById(domSearchField).value = '';
	};
	funcSeekName = document.getElementById(domSearchField).value.toLowerCase().replace(RegExp(' ', 'gi'), '_');
	if (funcSeekName.length !== 0){
		TMS.css(domMainFunctionList, {'display': 'none'});
		TMS.css(domSearchResultCanvas, {'display': 'block'});
		document.getElementById(domSearchResultCanvas).innerHTML = '';
		SEEK_RESULTS = R3_INTERNAL_functionBtnArray.filter(function(el){
			return el.toString().toLowerCase().indexOf(funcSeekName) !== -1;
		});
		if (SEEK_RESULTS.length !== 0){
			SEEK_RESULTS.forEach(function(p){
				tmpFunc = document.getElementById(fnPrefix + p).outerHTML;
				cFunc = tmpFunc.replace('id=\"' + p + '\" ', '');
				TMS.append(domSearchResultCanvas, cFunc);
			});
		} else {
			TMS.append(domSearchResultCanvas, '<u><b>Whoops</b> - No Result Found!</u> :(');
		};
	} else {
		TMS.css(domMainFunctionList, {'display': 'block'});
		TMS.css(domSearchResultCanvas, {'display': 'none'});
	};
};
// Delete search fields
function R3_DESIGN_BACKSPACE(evt, id){
	if (evt.keyCode === 8 && id !== undefined){
		document.getElementById(id).value = '';
	};
};
/*
	Recent (latest) Files
*/
// Open Recent File
function R3_LATEST_OPEN(){
	if (R3_SETTINGS.SETTINGS_RECENT_FILE_PATH !== ''){
		// RDT
		if (R3_SETTINGS.SETTINGS_RECENT_FILE_TYPE === 0){
			R3_RDT.readMap(R3_SETTINGS.SETTINGS_RECENT_FILE_PATH, true);
			R3_DESIGN_RDT_closeFileList();
			R3_SHOW_MENU(10);
		};
		// MSG
		if (R3_SETTINGS.SETTINGS_RECENT_FILE_TYPE === 1){
			R3_MSG_startLoadMsg(R3_SETTINGS.SETTINGS_RECENT_FILE_PATH);
			R3_SHOW_MENU(7);
		};
		// SCD
		if (R3_SETTINGS.SETTINGS_RECENT_FILE_TYPE === 2){
			R3_SCD_STARTLOAD(R3_SETTINGS.SETTINGS_RECENT_FILE_PATH);
			R3_SHOW_MENU(9);
		};
	};
};
// Set Recent File
function R3_LATEST_SET_FILE(name, type, location){
	if (R3_SYSTEM.web.isBrowser === false){
		if (name !== undefined && type !== undefined && location !== undefined){
			R3_SETTINGS.SETTINGS_RECENT_FILE_NAME = name;
			R3_SETTINGS.SETTINGS_RECENT_FILE_TYPE = type;
			R3_SETTINGS.SETTINGS_RECENT_FILE_PATH = location;
			R3_DESIGN_UPDATE_LATEST_LABELS();
			R3_SAVE_SETTINGS(false, false);
		};
	};
};
// Update Recent File Labels
function R3_DESIGN_UPDATE_LATEST_LABELS(){
	if (R3_SYSTEM.web.isBrowser === false){
		document.getElementById('R3_LBL_RECENT_FILE').innerHTML = R3_SETTINGS.SETTINGS_RECENT_FILE_NAME;
		document.getElementById('R3_LBL_RECENT_FILE_TYPE').innerHTML = R3_LATEST_FILE_TYPES[R3_SETTINGS.SETTINGS_RECENT_FILE_TYPE];
		if (R3_SETTINGS.SETTINGS_RECENT_FILE_TYPE === 0){
			var fName = R3_SETTINGS.SETTINGS_RECENT_FILE_NAME.toLowerCase().replace('.rdt', '').toUpperCase(),
				fPath_00 = R3_MOD.path + '/DATA_A/BSS/' + fName + '00.JPG',	fPath_01 = R3_MOD.path + '/DATA_A/BSS/' + fName + '01.JPG', fFix = '';
			if (R3_SETTINGS.APP_useImageFix === true){
				fFix = 'file://';
			};
			if (R3_MODULES.fs.existsSync(fPath_00) === true){
				TMS.css('R3_LATEST_FILE_IMG_PREV', {'background-image': 'url(\"' + fFix + fPath_00 + '\")'});
			} else {
				if (R3_MODULES.fs.existsSync(fPath_01) === true){
					TMS.css('R3_LATEST_FILE_IMG_PREV', {'background-image': 'url(\"' + fFix + fPath_01 + '\")'});
				} else {
					TMS.css('R3_LATEST_FILE_IMG_PREV', {'background-image': 'url()'});
				};
			};
		} else {
			TMS.css('R3_LATEST_FILE_IMG_PREV', {'background-image': 'url()'});
		};
	};
};
// Open / Close Recent File Popup
function R3_DESIGN_OPEN_CLOSE_LATEST(mode){
	if (R3_SYSTEM.web.isBrowser === false){
		if (R3_SETTINGS.SETTINGS_RECENT_FILE_NAME !== '' && R3_SETTINGS.SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
			// 0 = Open, 1 = Close
			if (mode === 0 && R3_MENU_CURRENT === 4){
				if (R3_SETTINGS.ENABLE_ANIMATIONS === false){
					TMS.css('R3_LATEST_FILE_DIV', {'display': 'block'});
				} else {
					TMS.animate('R3_LATEST_FILE_DIV', {'display': 'block', 'opacity': '1', 'left': '-44px'}, 200);
				};
				setTimeout(function(){
					document.getElementById('R3_BTN_LATEST_FILE').focus();
				}, 60);
			} else {
				if (R3_SETTINGS.ENABLE_ANIMATIONS === false){
					TMS.css('R3_LATEST_FILE_DIV', {'display': 'none'});
				} else {
					TMS.animate('R3_LATEST_FILE_DIV', {'display': 'block', 'opacity': '0', 'left': '-540px'}, 200);
				};
			};
		};
	};
};
/*
	Help Center
*/
function R3_HC_OPEN_PAGE(pageId){
	// Display help content
	if (R3_HC_DATABASE[pageId] !== undefined){
		var pName = R3_HC_DATABASE[pageId][0];
		document.getElementById('R3_HC_TITLE_LABEL').innerHTML = R3_HC_DATABASE[pageId][0];
		document.getElementById('R3_HELP_CENTER_HOLDER').innerHTML = R3_HC_DATABASE[pageId][1];
		document.getElementById('R3_HELP_CENTER_MINILABEL').innerHTML = R3_HC_DATABASE[pageId][0];
		document.getElementById('R3_HELP_CENTER_ICON_HOLDER').src = 'img/icons/icon-' + R3_HC_DATABASE[pageId][2] + '.webp';
		// Last file opened fix
		if (R3_MENU_CURRENT === 4 && R3_SETTINGS.SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
			R3_DESIGN_OPEN_CLOSE_LATEST(1);
		};
		// End
		document.getElementById('R3_HELP_CENTER_HOLDER').scrollTop = 0;
		R3_MINIWINDOW.open(11, 'center');
	};
};
/*
	SCD Editor
*/
// Render SCD Active Status
function R3_SCD_renderScriptActiveStatus(){
	if (SCD_arquivoBruto !== undefined){
		var cStatus = R3_SCD_SCRIPT_ACTIVE_LIST[R3_SCD_CURRENT_SCRIPT];
		if (cStatus === true){
			document.getElementById('R3_SCD_SCRIPT_ACTIVE').title = 'This script is active';
			TMS.css('R3_SCD_SCRIPT_ACTIVE', {'background-image': 'linear-gradient(to bottom, #0f0, #00c700)', 'box-shadow': '0px 0px 10px #0906'});
		} else {
			document.getElementById('R3_SCD_SCRIPT_ACTIVE').title = 'This script is not active';
			TMS.css('R3_SCD_SCRIPT_ACTIVE', {'background-image': 'linear-gradient(to bottom, #000, #444)', 'box-shadow': 'none'});
		};
		Object.keys(R3_SCD_SCRIPTS_LIST).forEach(function(cItem){
			if (document.getElementById('R3_SCD_SCRIPT_LIST_ACTIVE_' + cItem) !== null){
				if (R3_SCD_SCRIPT_ACTIVE_LIST[parseInt(cItem)] === true){
					document.getElementById('R3_SCD_SCRIPT_LIST_ACTIVE_' + cItem).title = 'This script is active';
					TMS.css('R3_SCD_SCRIPT_LIST_ACTIVE_' + cItem, {'box-shadow': '0px 0px 6px #000', 'background-image': 'linear-gradient(to bottom, #0f0, #0a0)'});
				} else {
					document.getElementById('R3_SCD_SCRIPT_LIST_ACTIVE_' + cItem).title = 'This script is not active';
					TMS.css('R3_SCD_SCRIPT_LIST_ACTIVE_' + cItem, {'box-shadow': 'none', 'background-image': 'linear-gradient(to bottom, #000, #444)'});
				};
			};
		});
	};
};
// Render SCD DoorLink
function R3_DESIGN_DOORLINK_RENDER(){
	if (SCD_arquivoBruto !== undefined){
		var mapInput = document.getElementById('R3_SCD_DOORLINK_MAP_INPUT').value.toUpperCase();
		if (mapInput.length === 3){
			var HTML_TEMPLATE = '', cArray, cName, cCam, pLocation, pLocationName, cCamPath, cCamFix = '', cLocation, checkResult = R3_DOORLINK_DATABASE['R' + mapInput];
			if (checkResult !== undefined){
				cName = RDT_locations['R' + mapInput][0];
				cLocation = RDT_locations['R' + mapInput][1];
				checkResult.forEach(function(cItem, cIndex){
					cArray = checkResult[cIndex];
					cCam = cArray[8].toUpperCase();
					cCamPath = R3_SYSTEM.paths.mod + '/Assets/DATA_A/BSS/R' + mapInput + cCam + '.JPG';
					if (process.platform !== 'win32'){
						cCamFix = 'file://';
					};
					if (R3_MODULES.fs.existsSync(cCamPath) !== true){
						cCamPath = 'img/404.webp';
					};
					pLocation = cArray[9];
					pLocationName = RDT_locations[pLocation][0] + ', ' + RDT_locations[pLocation][1];
					// Template
					HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_SCD_DOORLINK_itemHolder"><img src="' + cCamFix + cCamPath + '" class="R3_SCD_DOORLINK_camPreview" alt="DOORLINK_PREVIEW_' + cIndex + '">' +
									'<div class="R3_SCD_DOORLINK_dataInfo">Location <font class="monospace mono_xyzr">' + (cIndex + 1) + '</font> - Camera: <font class="monospace mono_xyzr user-can-select">' + cCam + '</font><br>' +
									'Parent map: <font class="monospace mono_xyzr" title="' + pLocationName + '">' + pLocation + '</font><br>X: <font class="monospace mono_xyzr user-can-select COLOR_X">' + cArray[1].toUpperCase() +
									'</font> Y: <font class="monospace mono_xyzr user-can-select COLOR_Y">' + cArray[2].toUpperCase() + '</font> ' + 'Z: <font class="monospace mono_xyzr user-can-select COLOR_Z">' + cArray[3].toUpperCase() +
									'</font> R: <font class="monospace mono_xyzr user-can-select COLOR_R">' + cArray[4].toUpperCase() + '</font><br><input type="button" value="Use this location" title="Click here to use this location as spawn ' +
									'pos." onclick="R3_DESIGN_DOORLINK_APPLY(\'R' + mapInput + '\', ' + cIndex + ');" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY R3_SCD_DOORLINK_APPLYFIX"></div></div>';
				});
			} else {
				cName = cLocation = 'Unknown Location';
				HTML_TEMPLATE = '<br><div class="align-center">There\'s nothing to show up here!</div>';
			};
			document.getElementById('R3_SCD_DOORLINK_MAP_INPUT').value = '';
			document.getElementById('R3_SCD_DOORLINK_mapName').innerHTML = cName;
			document.getElementById('R3_SCD_DOORLINK_mapLocation').innerHTML = cLocation;
			document.getElementById('R3_SCD_DOORLINK_doorHolder').innerHTML = HTML_TEMPLATE;
			document.getElementById('R3_SCD_DOORLINK_doorHolder').scrollTop = 0;
		};
	};
};
// Open SCD DoorLink
function R3_DESIGN_SCD_openDoorLink(){
	if (SCD_arquivoBruto !== undefined && R3_SCD_IS_EDITING === true && R3_MINI_WINDOW_DATABASE[20][5] === false){
		if (R3_SETTINGS.R3_NW_ARGS_DISABLE_DOORLINK === false){
			if (Object.keys(R3_DOORLINK_DATABASE).length !== 0){
				R3_MINIWINDOW.close(9);
				document.getElementById('R3_SCD_DOORLINK_MAP_INPUT').value = '';
				document.getElementById('R3_SCD_DOORLINK_mapName').innerHTML = 'Unknwon Location';
				document.getElementById('R3_SCD_DOORLINK_mapLocation').innerHTML = 'Unknwon Location';
				document.getElementById('R3_SCD_DOORLINK_doorHolder').innerHTML = '<br><div class="align-center">There\'s nothing to show up here!</div>';
				R3_MINIWINDOW.open(20);
				R3_MINIWINDOW.snap(14, 20);
			} else {
				R3_SYSTEM.log('separator');
				R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to open DoorLink! <br>Reason: You must generate DoorLink database before using this option! <br>If you already extracted game assets: Go to settings, navigate to SCD Settings and click on \"Update DoorLink Database\".');
			};
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to open DoorLink! <br>Reason: DoorLink was disabled on run args!');
		};
	};
};
// Apply SCD DoorLink
function R3_DESIGN_DOORLINK_APPLY(mapName, id){
	if (mapName !== undefined && id !== undefined && R3_SCD_IS_EDITING === true){
		var magicArray = R3_DOORLINK_DATABASE[mapName][id];
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_nextX').value = magicArray[1];
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_nextY').value = magicArray[2];
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_nextZ').value = magicArray[3];
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_nextR').value = magicArray[4];
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_zIndex').value = magicArray[5];
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_stage').value = (parseInt(magicArray[6]) + 1);
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_roomNumber').value = magicArray[7];
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_nextCam').value = parseInt(magicArray[8], 16);
		R3_SCD_FUNCTIONEDIT_updateCamPreview(R3_SCD_currentOpcode);
	};
};
// Give focus to result
function R3_DESIGN_SCD_focusResultFromSearchForm(domId){
	if (domId !== undefined){
		SCD_FN_SEARCH_RESULT.forEach(function(d, cIndex){
			TMS.css('R3_SCD_SEARCH_FIND_FN_' + cIndex, {'box-shadow': '0px 0px 0px #0000'});
		});
		// End
		TMS.css('R3_SCD_SEARCH_FIND_FN_' + domId, {'box-shadow': '0px 0px 10px #fffa'});
	};
};
// Navigate between found results on SCD search list
function R3_DESIGN_navigateResultFromSearchForm(mode){
	if (SCD_arquivoBruto !== undefined && SCD_FN_SEARCH_RESULT.length !== 0){
		if (mode === 0){
			R3_SCD_SEARCH_HIGHLIGHT_FUNCTION--;
		} else {
			R3_SCD_SEARCH_HIGHLIGHT_FUNCTION++;
		};
		if (R3_SCD_SEARCH_HIGHLIGHT_FUNCTION < 0){
			R3_SCD_SEARCH_HIGHLIGHT_FUNCTION = 0;
		};
		if (R3_SCD_SEARCH_HIGHLIGHT_FUNCTION > (SCD_FN_SEARCH_RESULT.length - 1)){
			R3_SCD_SEARCH_HIGHLIGHT_FUNCTION = (SCD_FN_SEARCH_RESULT.length - 1);
		};
		R3_DESIGN_SCD_focusResultFromSearchForm(R3_SCD_SEARCH_HIGHLIGHT_FUNCTION);
		// Jump (GOTO)
		R3_SCD_SEARCH_GOTO_FUNCTION(SCD_FN_SEARCH_RESULT[R3_SCD_SEARCH_HIGHLIGHT_FUNCTION][0], SCD_FN_SEARCH_RESULT[R3_SCD_SEARCH_HIGHLIGHT_FUNCTION][1]);
		// Scroll result list
		var offTop = document.getElementById('R3_SCD_SEARCH_FIND_FN_' + R3_SCD_SEARCH_HIGHLIGHT_FUNCTION).offsetTop,
			holderHeight = document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_RESULT').offsetHeight;
		document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_RESULT').scrollTop = ((offTop - (holderHeight / 2)) - 30);
		// Open edit form if CTRL is pressed
		if (R3_keyPress.KEY_ALT === true){
			R3_SCD_FUNCTION_EDIT(SCD_FN_SEARCH_RESULT[R3_SCD_SEARCH_HIGHLIGHT_FUNCTION][1]);
		};
	};
};
// Insert function on SCD ID list
function R3_SCD_ID_LIST_INSERT(mode, id, type, textDisplay){
	if (SCD_arquivoBruto !== undefined){
		// General
		if (mode === 0){
			R3_SCD_ID_LIST_ENTRIES[id] = [id.toUpperCase(), type, textDisplay];
		};
		// Set 3D Object [OM_SET] list
		if (mode === 1){
			R3_SCD_ID_OM_SET_ENTRIES[id] = [id.toUpperCase(), type, textDisplay];
		};
	};
};
// Capture all ID's from functions
function R3_SCD_ID_LIST_CAPTURE(){
	if (SCD_arquivoBruto !== undefined){
		// Clean list
		R3_SCD_ID_LIST_ENTRIES = {};
		R3_SCD_ID_OM_SET_ENTRIES = {};
		// Start the madness
		var c = d = 0, cScript, cFunction, cOpcode, R3_SCD_DEC_DB;
		while (c < Object.keys(R3_SCD_SCRIPTS_LIST).length){
			cScript = R3_SCD_SCRIPTS_LIST[c];
			while (d < cScript.length){
				cFunction = cScript[d];
				cOpcode = cFunction.slice(0, 2);
				R3_SCD_DEC_DB = R3_SCD_DECOMPILER_DATABASE[cOpcode];
				// Set Door [DOOR_AOT_SET]
				if (cOpcode === '61'){
					var DOOR_Id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						DOOR_nMap = RDT_locations['R' + (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1]), 16) + 1) + cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]).toUpperCase()][0];
					R3_SCD_ID_LIST_INSERT(0, DOOR_Id, R3_SCD_DATABASE[cOpcode][2], R3_SCD_DATABASE[cOpcode][1] + ' - Leads to ' + DOOR_nMap);
				};
				// Set Door 4P [DOOR_AOT_SET_4P]
				if (cOpcode === '62'){
					var DOOR_Id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						DOOR_nMapFull = 'R' + (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1]), 16) + 1) + cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]),
						DOOR_nMap = RDT_locations[DOOR_nMapFull.toUpperCase()][0];
					R3_SCD_ID_LIST_INSERT(0, DOOR_Id, R3_SCD_DATABASE[cOpcode][2], R3_SCD_DATABASE[cOpcode][1] + ' - Leads to ' + DOOR_nMap);
				};
				// Set Interactive Object [AOT_SET]
				if (cOpcode === '63'){
					var AOT_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						AOT_aot  = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]);
						AOT_model = '';
					if (R3_SCD_AOT_TYPES[AOT_aot] !== undefined){
						AOT_model = R3_SCD_AOT_TYPES[AOT_aot][0];
					} else {
						AOT_model = '(<font class="monospace mono_xyzr">' + AOT_aot.toUpperCase() + '</font>) Unknown AOT!';
					};
					R3_SCD_ID_LIST_INSERT(0, AOT_id, R3_SCD_DATABASE[cOpcode][2], R3_SCD_DATABASE[cOpcode][1] + ' - ' + AOT_model);
				};
				// Set Item [ITEM_AOT_SET]
				if (cOpcode === '67'){
					var ITEM_Id 	= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						ITEM_Opcode = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
						ITEM_title  = '';
					// Item
					if (parseInt(ITEM_Opcode, 16) < 134){
						ITEM_title = DATABASE_ITEM[ITEM_Opcode.toLowerCase()][0];
					};
					// File
					if (parseInt(ITEM_Opcode, 16) > 133 && parseInt(ITEM_Opcode, 16) < 164){
						ITEM_title = DATABASE_FILES[ITEM_Opcode.toLowerCase()];
					};
					// Map
					if (parseInt(ITEM_Opcode, 16) > 163){
						ITEM_title = DATABASE_MAPS[ITEM_Opcode.toLowerCase()];
					};
					R3_SCD_ID_LIST_INSERT(0, ITEM_Id.toLowerCase(), R3_SCD_DATABASE[cOpcode][2], R3_SCD_DATABASE[cOpcode][1] + ' - ' + ITEM_title);
				};
				// Set Item 4P [ITEM_AOT_SET_4P]
				if (cOpcode === '68'){
					var ITEM_Id 	= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						ITEM_Opcode = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
						ITEM_title  = '';
					// Item
					if (parseInt(ITEM_Opcode, 16) < 134){
						ITEM_title = DATABASE_ITEM[ITEM_Opcode.toLowerCase()][0];
					};
					// File
					if (parseInt(ITEM_Opcode, 16) > 133 && parseInt(ITEM_Opcode, 16) < 164){
						ITEM_title = DATABASE_FILES[ITEM_Opcode.toLowerCase()];
					}
					// Map
					if (parseInt(ITEM_Opcode, 16) > 163){
						ITEM_title = DATABASE_MAPS[ITEM_Opcode.toLowerCase()];
					};
					R3_SCD_ID_LIST_INSERT(0, ITEM_Id.toLowerCase(), R3_SCD_DATABASE[cOpcode][2], R3_SCD_DATABASE[cOpcode][1] + ' - ' + ITEM_title);
				};
				// Set 3D Object [OM_SET]
				if (cOpcode === '7f'){
					var OM_id  = cFunction.slice(R3_SCD_DEC_DB.objId[0], R3_SCD_DEC_DB.objId[1]),
						OM_AOT = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]);
					R3_SCD_ID_LIST_INSERT(1, OM_id.toLowerCase(), R3_SCD_DATABASE[cOpcode][2], R3_SCD_DATABASE[cOpcode][1] + ' - ' + R3_SCD_OM_SET_AOT_TYPES[OM_AOT]);
				};
				d++;
			};
			d = 0;
			c++;
		};
		// End
		R3_SCD_ID_LIST_RENDER();
	};
};
// Render SCD ID list
function R3_SCD_ID_LIST_RENDER(){
	if (SCD_arquivoBruto !== undefined){
		document.getElementById('R3_SCD_ID_LIST_HOLDER').innerHTML = '';
		document.getElementById('R3_SCD_ID_LIST_HOLDER_OM_SET').innerHTML = '';
		var cID, HTML_TEMPLATE = '';
		Object.keys(R3_SCD_ID_LIST_ENTRIES).forEach(function(cItem, cIndex){
			cID = R3_SCD_ID_LIST_ENTRIES[cItem];
			HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_SCRIPT_LIST_ITEM R3_SCD_ID_LIST_ITEM R3_SCD_BTN_function_' + cID[1] + '" id="R3_SCD_ID_FUNCTION_' + 
							cID[0].toUpperCase() + '"><font class="monospace mono_xyzr user-can-select">' + cID[0].toUpperCase() + '</font> - ' + cID[2].replace('[', '[<font class="monospace mono_xyzr">').replace(']', '</font>]') + '</div>';
		});
		document.getElementById('R3_SCD_ID_LIST_HOLDER').innerHTML = HTML_TEMPLATE;
		HTML_TEMPLATE = '';
		Object.keys(R3_SCD_ID_OM_SET_ENTRIES).forEach(function(cItem, cIndex){
			cID = R3_SCD_ID_OM_SET_ENTRIES[cItem];
			HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_SCRIPT_LIST_ITEM R3_SCD_ID_LIST_ITEM R3_SCD_BTN_function_' + cID[1] + '" id="R3_SCD_OM_FUNCTION_' + 
							cID[0].toUpperCase() + '"><font class="monospace mono_xyzr user-can-select">' + cID[0].toUpperCase() + '</font> - ' + cID[2].replace('[', '[<font class="monospace mono_xyzr">').replace(']', '</font>]') + '</div>';
		});
		// End
		document.getElementById('R3_SCD_ID_LIST_HOLDER_OM_SET').innerHTML = HTML_TEMPLATE;
	};
};
// Search on SCD ID List
function R3_DESIGN_SEARCH_SCD_ID_LIST(evt, valueInput, inputDom, listHolder, output){
	if (SCD_arquivoBruto !== undefined){
		var seekResult, canCloseRes = false, seekId = document.getElementById(valueInput).value.toUpperCase();
		if (evt.inputType === 'deleteContentBackward' || evt.inputType === 'deleteContentForward'){
			document.getElementById(valueInput).value = '';
		};
		if (seekId !== '' && seekId !== '  ' && seekId.length === 2){
			seekResult = document.getElementById(inputDom + seekId);
			if (seekResult !== null){
				TMS.css(listHolder, {'display': 'none'});
				TMS.css(output, {'display': 'inline-block'});
				document.getElementById(output).innerHTML = seekResult.outerHTML;
			} else {
				document.getElementById(valueInput).value = '';
				R3_SYSTEM.alert('WARN: Unable to find ' + seekId + '!');
				canCloseRes = true;
			};
		} else {
			canCloseRes = true;
		};
		if (canCloseRes === true){
			TMS.css(output, {'display': 'none'});
			TMS.css(listHolder, {'display': 'inline-block'});
			document.getElementById(output).innerHTML = '';
		};
	} else {
		document.getElementById(valueInput).value = '';
	};
};
// Open insert hex preview
function R3_DESIGN_OPEN_SCD_INSERT_PREVIEW(hex){
	if (SCD_arquivoBruto !== undefined){
		var cOpcode = hex.slice(0, 2), cCssId = R3_SCD_DATABASE[cOpcode][2];
		// Append preview
		document.getElementById('R3_SCD_EDITFUNCTION_HOLDER').innerHTML = INCLUDE_SCD_EDIT_FUNCTIONS['90'];
		// Update DOM
		document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_POS').value = 1;
		document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_FNAME').innerHTML = R3_SCD_DATABASE[cOpcode][1];
		document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_FNAME').classList.value = 'monospace mono_xyzr R3_SCD_function_' + cCssId + ' no-bg-image';
		R3_DESIGN_UPDATE_INSERT_HEX_POS();
		// End
		document.getElementById('R3_SCD_BTN_APPLY').onclick = function(){
			R3_SCD_PREPARE_INSERT_HEX(hex);
		};
		R3_SCD_openFunctionEdit(cOpcode, false, true, 'Insert Hex Function - Preview');
		// Hide some buttons
		TMS.css('BTN_MAIN_29', {'display': 'none'});
		TMS.css('BTN_MAIN_52', {'display': 'none'});
		setTimeout(function(){
			document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_POS').focus();
		}, 40);
	} else {
		R3_SCD_NEW_FILE();
	};
};
// Update insert hex pos
function R3_DESIGN_UPDATE_INSERT_HEX_POS(){
	document.getElementById('R3_SCD_EDIT_90_scriptPreview').innerHTML = '';
	var c = d = 0, canScroll = true, scriptId = parseInt(document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_POS').value - 1);
	if (document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_POS').value === '' || scriptId < 0){
		scriptId = 0;
	};
	if (scriptId < (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length)){
		var scriptLength = (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length), HTML_TEMPLATE = '';
		document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_POS').max = scriptLength;
		while (c < scriptLength){
			var cFunction, cName, cCssId, cInfo;
			if (c === scriptId){
				cFunction = R3_TEMP_INSERT_OPCODE;
				cName = R3_SCD_DATABASE[cFunction][1];
				cCssId = R3_SCD_DATABASE[cFunction][2];
				cInfo = R3_SCD_INFO_DATABASE[cFunction];
				HTML_TEMPLATE = HTML_TEMPLATE + '<div id="R3_SCD_INSERT_NEW_FN_DIV" class="R3_SCD_EDIT_DEMO_NEXTFN monospace R3_SCD_function_' + cCssId + '" title="' + cInfo + '\n[This is the new function you are inserting on this script.]"><div class="R3_SCD_INSERT_newFn">NEW</div> <div class="R3_SCD_INSERT_NEW_FIX"><u>' + cName + '</u></div></div>';
			} else {
				cFunction = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][d].slice(0, 2);
				cName = R3_SCD_DATABASE[cFunction][1];
				cCssId = R3_SCD_DATABASE[cFunction][2];
				cInfo = R3_SCD_INFO_DATABASE[cFunction];
				HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_SCD_EDIT_DEMO_NEXTFN monospace R3_SCD_function_' + cCssId + '" title="' + cInfo + '"><div class="R3_SCD_INSERT_LBL_FIX">' + cName + '</div></div>';
				d++;
			};
			c++;
		};
	} else {
		canScroll = false;
		HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_SCD_function_14">The script location are out of bounds!<br>Set a number from 1 to ' + R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length + '</div>';
	};
	// Append
	document.getElementById('R3_SCD_EDIT_90_scriptPreview').innerHTML = HTML_TEMPLATE.replace(new RegExp('undefined', 'gi'), '');
	// Focus new function
	if (canScroll === true){
		var holderHeight = document.getElementById('R3_SCD_EDIT_90_scriptPreview').offsetHeight,
			offsetTop = document.getElementById('R3_SCD_INSERT_NEW_FN_DIV').offsetTop;
		document.getElementById('R3_SCD_EDIT_90_scriptPreview').scrollTop = (offsetTop - ((holderHeight / 2) - 26));
	};
};
// Open search function form
function R3_DESIGN_OPEN_FIND_FUNCTION(){
	if (SCD_arquivoBruto !== undefined){
		if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			R3_MINIWINDOW.open(9);
		} else {
			R3_MINIWINDOW.close(9);
		};
	};
};
// Add Color to label on Search opcode result
function R3_SCD_SEARCH_OPCODE_ADDCOLOR(fnId){
	if (SCD_arquivoBruto !== undefined){
		var c = 0;
		while (c < 20){
			TMS.removeClass('R3_LBL_SCD_SEARCH_FUNCTION_OPCODE', 'R3_SCD_function_' + c);
			c++;
		};
		TMS.addClass('R3_LBL_SCD_SEARCH_FUNCTION_OPCODE', 'R3_SCD_function_' + fnId);
	} else {
		R3_SCD_NEW_FILE();
	};
};
// GOTO Search Result
function R3_SCD_SEARCH_GOTO_FUNCTION(cID, functionId){
	if (SCD_arquivoBruto !== undefined){
		R3_SCD_displayScript(cID);
		if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			R3_SCD_HIGHLIGHT_FUNCTION = parseInt(functionId - 1);
			R3_SCD_navigateFunctions(1);
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
// Scroll Script List
function R3_SCD_scrollScriptList(){
	if (RDT_arquivoBruto !== undefined){
		var sList = document.getElementById('R3_SCD_SCRIPT_INNER');
		if (sList !== null){
			sList.scrollBy(0, sList.scrollHeight);
		};
	};
};
/*
	Navigate between functions
	
	Modes: 
	0 = Previous function
	1 = Next function
	2 = Focus current function
	3 = Return 10 functions
	4 = Advance 10 functions
	5 = Focus specific function
	6 = Focus first function
	7 = Focus last function

	fnId: Function ID
	isClick: if focus are from user click
*/
function R3_SCD_navigateFunctions(mode, fnId, isClick){
	if (SCD_arquivoBruto !== undefined){
		var cFunction, holderHeight, focusFn, canFocus = true;
		// Modes
		if (mode === 0){
			R3_SCD_HIGHLIGHT_FUNCTION--;
		};
		if (mode === 1){
			R3_SCD_HIGHLIGHT_FUNCTION++;
		};
		if (mode === 3){
			R3_SCD_HIGHLIGHT_FUNCTION = (R3_SCD_HIGHLIGHT_FUNCTION - 10);
		};
		if (mode === 4){
			R3_SCD_HIGHLIGHT_FUNCTION = (R3_SCD_HIGHLIGHT_FUNCTION + 10);
		};
		if (mode === 5 && parseInt(fnId) !== NaN && fnId !== undefined && fnId !== ''){
			R3_SCD_HIGHLIGHT_FUNCTION = parseInt(fnId);
		};
		if (mode === 6){
			R3_SCD_HIGHLIGHT_FUNCTION = 0;
		};
		if (mode === 7){
			R3_SCD_HIGHLIGHT_FUNCTION = parseInt(R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length);
		};
		// End
		if (R3_SCD_HIGHLIGHT_FUNCTION < 0){
			R3_SCD_HIGHLIGHT_FUNCTION = 0;
		};
		if (R3_SCD_HIGHLIGHT_FUNCTION > (R3_SCD_TOTAL_FUNCTIONS - 2)){
			R3_SCD_HIGHLIGHT_FUNCTION = (R3_SCD_TOTAL_FUNCTIONS - 2);
		};
		for (var c = 0; c < R3_SCD_TOTAL_FUNCTIONS; c++){
			TMS.css('R3_SCD_scriptCommand_' + c, {'box-shadow': '0px 0px 0px #000'});
		};
		// Make it shine, baby!
		TMS.css('R3_SCD_scriptCommand_' + R3_SCD_HIGHLIGHT_FUNCTION, {'box-shadow': '0px 0px 10px #fff'});
		// Focus function
		if (isClick === true && R3_SETTINGS.SETTINGS_SCD_FOCUS_FUNCTION_CLICK === false){
			canFocus = false;
		};
		if (canFocus === true){
			focusFn = document.getElementById('R3_SCD_scriptCommand_' + R3_SCD_HIGHLIGHT_FUNCTION);
			if (focusFn !== null){
				cFunction = document.getElementById('R3_SCD_scriptCommand_' + R3_SCD_HIGHLIGHT_FUNCTION).offsetTop;
				holderHeight = document.getElementById('R3_SCD_SCRIPT_INNER').offsetHeight;
				document.getElementById('R3_SCD_SCRIPT_INNER').scrollTop = (cFunction - ((holderHeight / 2)) + 50);
			};
		}
		// End
		R3_SCD_FUNCTION_FOCUSED = true;
	} else {
		R3_SCD_NEW_FILE();
	};
};
// Open next / previous function while edit form still open
function R3_SCD_openPrevNextFunction(mode){
	if (SCD_arquivoBruto !== undefined){
		var tempNextOp, tempHex, tempNextFn = R3_SCD_CURRENT_FUNCTION, canOpen = false;
		while (canOpen === false){
			if (mode === 0){
				tempNextFn--;
			} else {
				tempNextFn++;
			};
			tempNextOp = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][tempNextFn];
			if (tempNextOp === undefined){
				break;
			} else {
				if (INCLUDE_SCD_EDIT_FUNCTIONS[tempNextOp.slice(0, 2)] !== 'NO_EDIT'){
					canOpen = true;
				};
			};
		};
		// End
		if (tempNextOp !== undefined && canOpen === true){
			R3_SCD_CURRENT_FUNCTION = tempNextFn;
			R3_MINI_WINDOW_DATABASE[14][6] = false;
			R3_SCD_navigateFunctions(5, R3_SCD_CURRENT_FUNCTION);
			R3_SCD_FUNCTION_EDIT(R3_SCD_CURRENT_FUNCTION);
		};
	};
};
/*
	Swap to code editor

	Modes
	0: List Editor
	1: Code Editor
*/
function R3_SCD_SWAP_EDITOR_MODE(mode){
	if (mode !== undefined){
		var dTime = 100;
		R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE = mode;
		if (mode === 0){
			document.getElementById('R3_SCD_SCRIPT_INNER').innerHTML = '';
			TMS.css('R3_SCD_CODE_EDITOR_buttonHolder', {'display': 'none'});
			TMS.css('R3_SUBMENU_BUTTONS_COPYPASTE', {'display': 'inline-flex'});
			TMS.css('BTN_MAIN_48', {'background-image': 'url(\'img/icons/icon-48.webp\')'});
			document.getElementById('BTN_MAIN_48').title = 'Click here to open code editor';
			if (R3_SETTINGS.ENABLE_ANIMATIONS === true){
				TMS.fadeIn('R3_SCD_FUNCTIONS_HOLDER', dTime);
				TMS.animate('R3_SCD_FUNCTIONS_HOLDER', {'opacity': '1', 'top': '40px', 'filter': 'blur(0px)'}, dTime);
				TMS.animate('R3_SCD_SCRIPT_VIEW_DIV', {'width': '77%'}, (dTime + 10));
			} else {
				TMS.css('R3_SCD_SCRIPT_VIEW_DIV', {'width': '77%'});
				TMS.css('R3_SCD_FUNCTIONS_HOLDER', {'display': 'inline', 'top': '40px', 'filter': 'blur(0px)'});
			};
		} else {
			TMS.css('R3_SUBMENU_BUTTONS_COPYPASTE', {'display': 'none'});
			TMS.css('R3_SCD_CODE_EDITOR_buttonHolder', {'display': 'inline-flex'});
			TMS.css('BTN_MAIN_48', {'background-image': 'url(\'img/icons/icon-49.webp\')'});
			document.getElementById('BTN_MAIN_48').title = 'Click here to open list editor';
			document.getElementById('R3_SCD_SCRIPT_INNER').innerHTML = INCLUDE_SCD_CODE_EDITOR;
			if (R3_SETTINGS.ENABLE_ANIMATIONS === true){
				TMS.fadeOut('R3_SCD_FUNCTIONS_HOLDER', dTime);
				TMS.animate('R3_SCD_FUNCTIONS_HOLDER', {'opacity': '0', 'top': '0px', 'filter': 'blur(2px)'}, dTime);
				TMS.animate('R3_SCD_SCRIPT_VIEW_DIV', {'width': '100%'}, (dTime + 10));
			} else {
				TMS.css('R3_SCD_SCRIPT_VIEW_DIV', {'width': '100%'});
				TMS.css('R3_SCD_FUNCTIONS_HOLDER', {'display': 'none', 'top': '0px', 'filter': 'blur(2px)'});
			};
			R3_DESIGN_JS_CODE_FOCUS();
		};
		// End
		R3_SAVE_SETTINGS(false, false);
		if (R3_MENU_CURRENT === 9){
			if (SCD_arquivoBruto !== undefined && R3_SCD_IS_EDITING === false){
				R3_SCD_displayScript(R3_SCD_CURRENT_SCRIPT);
			} else {
				R3_SCD_NEW_FILE();
			};
		};
	};
};
// Focus JS code editor
function R3_DESIGN_JS_CODE_FOCUS(){
	if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1){
		setTimeout(function(){
			if (document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA') !== null){
				TMS.focus('R3_SCD_CODE_EDITOR_TEXTAREA');
				document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').scrollTop = 0;
				document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').selectionEnd = 0;
				document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').selectionStart = 0;
				R3_SCD_CODE_updateTextData();
			};
		}, 30);
	};
};	
// Open / Close code editor
function R3_SCD_OPEN_CLOSE_CODE_EDITOR(){
	if (R3_SCD_IS_EDITING === false){
		if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			R3_MINIWINDOW.close(9);
			R3_SCD_SWAP_EDITOR_MODE(1);
		} else {
			R3_SCD_SWAP_EDITOR_MODE(0);
		};
	};
};
// Update code editor text info
function R3_SCD_CODE_updateTextData(){
	if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1 && R3_SCD_IS_EDITING === false){
		var textTarget = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA'),
			textValue = textTarget.value,
			textLines = textValue.split('\n');
		document.getElementById('R3_SCD_CODE_fontSize').innerHTML = R3_SCD_CODE_zoom;
		document.getElementById('R3_SCD_CODE_codeLines').innerHTML = textLines.length;
		document.getElementById('R3_SCD_CODE_codeLength').innerHTML = textValue.length;
		document.getElementById('R3_SCD_CODE_cursorAt').innerHTML = textTarget.selectionStart;
		document.getElementById('R3_SCD_CODE_selectionEnd').innerHTML = textTarget.selectionEnd;
		document.getElementById('R3_SCD_CODE_selectionStart').innerHTML = textTarget.selectionStart;
		document.getElementById('R3_SCD_CODE_keyShift').innerHTML = R3_keyPress.KEY_SHIFT.toString().slice(0, 1).toUpperCase() + R3_keyPress.KEY_SHIFT.toString().slice(1);
		document.getElementById('R3_SCD_CODE_keyCtrl').innerHTML = R3_keyPress.KEY_CONTROL.toString().slice(0, 1).toUpperCase() + R3_keyPress.KEY_CONTROL.toString().slice(1);
		// End
		if (textTarget.selectionStart !== textTarget.selectionEnd){
			TMS.css('R3_SCD_CODE_selectionDiv', {'display': 'inline'});
		} else {
			TMS.css('R3_SCD_CODE_selectionDiv', {'display': 'none'});
		};
	};
};
// Zoom JS Code editor
function R3_DESIGN_CODE_zoomMode(mode){
	if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1){
		if (mode === 0){
			R3_SCD_CODE_zoom++;
		} else {
			R3_SCD_CODE_zoom--;
		};
		if (R3_SCD_CODE_zoom < 6){
			R3_SCD_CODE_zoom = 6;
		};
		if (R3_SCD_CODE_zoom > 140){
			R3_SCD_CODE_zoom = 140;	
		};
		// End
		TMS.css('R3_SCD_CODE_EDITOR_TEXTAREA', {'font-size': R3_SCD_CODE_zoom + 'px'});
	};
};
// SCD Seek Function
function R3_SCD_seekFunction(kPress){
	var funcSeekName, tmpFunc, cFunc, c = 0, SEEK_RESULTS, kp = kPress.which || kPress.keyCode;
	if (kp === 8 || R3_keyPress.KEY_CONTROL === true){
		document.getElementById('SCD_FUNCTION_SEARCH_FIELD').value = '';
	};
	funcSeekName = document.getElementById('SCD_FUNCTION_SEARCH_FIELD').value.toLowerCase().replace(RegExp(' ', 'gi'), '_');
	if (funcSeekName.length !== 0){
		TMS.css('SCD_FUNCTION_LIST', {'display': 'none'});
		TMS.css('R3_SCD_FUNCTIONS_SEARCH', {'display': 'block'});
		TMS.css('SCD_FUNCTION_SEARCH_FIELD', {'text-transform': 'uppercase'});
		document.getElementById('R3_SCD_FUNCTIONS_SEARCH').innerHTML = '';
		SEEK_RESULTS = R3_INTERNAL_functionBtnScdArray.filter(function(el){
			return el.toString().toLowerCase().indexOf(funcSeekName) !== -1;
		});
		if (SEEK_RESULTS.length !== 0){
			while (c < SEEK_RESULTS.length){
				tmpFunc = document.getElementById('BTN_SCD_' + SEEK_RESULTS[c]).outerHTML;
				cFunc = tmpFunc.replace('id="' + SEEK_RESULTS[c] + '" ', '');
				TMS.append('R3_SCD_FUNCTIONS_SEARCH', cFunc);
				c++;
			};
		} else {
			TMS.append('R3_SCD_FUNCTIONS_SEARCH', '<u><b>Whoops</b> - No Result Found!</u> :(');
		};
		R3_keyPress.releaseKeys();
	} else {
		R3_SCD_closeSeekFunction();
	};
};
// Close SCD Seek Function
function R3_SCD_closeSeekFunction(){
	TMS.css('SCD_FUNCTION_LIST', {'display': 'block'});
	TMS.css('R3_SCD_FUNCTIONS_SEARCH', {'display': 'none'});
	TMS.css('SCD_FUNCTION_SEARCH_FIELD', {'text-transform': 'none'});
};
// Update Labels
function R3_SCD_updateLabels(){
	var scriptName = R3_SCD_CURRENT_SCRIPT;
	if (RDT_arquivoBruto !== undefined){
		TMS.css('R3_SCD_BTN_APPLYRDT', {'display': 'inline-flex'});
	};
	if (document.getElementById('R3_SCD_SCRIPT_INNER').scrollTop !== 0){
		document.getElementById('R3_SCD_SCRIPT_INNER').scrollTop = 0;
	};
	if (SCD_scriptNames[R3_SCD_CURRENT_SCRIPT] !== undefined){
		scriptName = SCD_scriptNames[R3_SCD_CURRENT_SCRIPT];
	};
	document.getElementById('R3_SCD_LBL_currentScript').innerHTML = scriptName;
	document.getElementById('R3_SCD_HEX_RAW').innerHTML = R3_SCD_CURREN_HEX_VIEW;
	document.getElementById('R3_SCD_LBL_TOTALFUNCTIONS').innerHTML = R3_SCD_TOTAL_FUNCTIONS;
	document.getElementById('R3_SCD_LBL_hexLength').innerHTML = R3_tools.fixVars((R3_SCD_CURRENT_SCRIPT_HEX.length / 2).toString(16), 2).toUpperCase();
};
// Update Selected Script
function R3_DESIGN_SCD_UPDATE_SELECT(scriptId){
	for (var c = 0; c < R3_SCD_TOTAL_SCRITPS; c++){
		TMS.removeClass('R3_SCD_SCRIPT_ID_' + c, 'R3_SCRIPT_LIST_ITEM_SELECT');
	};
	TMS.addClass('R3_SCD_SCRIPT_ID_' + scriptId, 'R3_SCRIPT_LIST_ITEM_SELECT');
};
// Open SCD Edit
function R3_SCD_openFunctionEdit(cOpcode, isInsert, isExtra, extraTitle){
	R3_SCD_IS_EDITING = true;
	// Vars
	var titleMode = 'Edit', windowTop, windowLeft;
	if (isInsert === true){
		titleMode = 'Insert';
		document.getElementById('R3_SCD_editFunction_pos').disabled = '';
	};
	// Close miniwindows
	R3_MINIWINDOW.close([8, 11]);
	// Hide some buttons
	TMS.css('BTN_MAIN_45', {'display': 'none'});
	TMS.css('BTN_MAIN_42', {'display': 'none'});
	TMS.css('BTN_MAIN_52', {'display': 'inline-flex'});
	// Add R3V2 Logo if doesn't use custom bg
	if (R3_SCD_DATABASE[cOpcode][8] === false){
		TMS.css('R3_SCD_editForm_bg_image', {'display': 'inline', 'background-image': 'url(\'img/logoWm.webp\')', 'background-size': 'auto 80%'});
	} else {
		TMS.css('R3_SCD_editForm_bg_image', {'background-size': 'calc(100% + 60px)'});
	};
	// If are extra edit forms (non-opcodes)
	if (isExtra === undefined){
		document.getElementById('R3_SCD_LBL_EDITFUNCTION').innerHTML = titleMode + ' ' + R3_SCD_DATABASE[cOpcode][1].replace('[', '[<font class="monospace mono_xyzr">').replace(']', '</font>]');
	} else {
		document.getElementById('R3_SCD_LBL_EDITFUNCTION').innerHTML = extraTitle;
	};
	// Open form
	if (R3_MINI_WINDOW_DATABASE[14][5] === false){
		R3_MINIWINDOW.open(14, 'center');
	};
};
// Close Edit
function R3_SCD_cancelFunctionEdit(exitFromEditForm){
	// Prevent memory
	R3_SCD_IS_EDITING = false;
	R3_SCD_currentOpcode = '';
	// Close Search List
	TMS.css('BTN_MAIN_52', {'display': 'none'});
	TMS.css('BTN_MAIN_45', {'display': 'inline-flex'});
	TMS.css('BTN_MAIN_42', {'display': 'inline-flex'});
	TMS.css('SCD_FUNCTION_LIST', {'display': 'block'});
	TMS.css('R3_SCD_FUNCTIONS_SEARCH', {'display': 'none'});
	document.getElementById('SCD_FUNCTION_SEARCH_FIELD').value = '';
	R3_MINIWINDOW.close([14, 20]);
	// End
	document.getElementById('R3_SCD_BTN_APPLY').onclick = null;
	if (R3_SETTINGS.ENABLE_ANIMATIONS !== true){
		TMS.css('R3_SCD_SCRIPT_INNER', {'display': 'block'});
		TMS.css('R3_SCD_EDITFUNCTION_DIV', {'display': 'none'});
		TMS.css('R3_SCD_CLEAR_SCRIPT_BTN', {'display': 'block'});
	} else {
		TMS.fadeIn('R3_SCD_SCRIPT_INNER', 48);
		TMS.fadeIn('R3_SCD_CLEAR_SCRIPT_BTN', 48);
		TMS.fadeOut('R3_SCD_EDITFUNCTION_DIV', 48);
	};
	setTimeout(function(){
		document.getElementById('SCD_FUNCTION_SEARCH_FIELD').focus();
		// Auto focus if a function was previously focused
		if (exitFromEditForm === true){
			R3_SCD_navigateFunctions(2);
		};
	}, 50);
};
// Open Script List
function R3_DESIGN_SCD_openScriptList(){
	if (SCD_arquivoBruto !== undefined && R3_SETTINGS.SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST === true){
		R3_MINIWINDOW.open(4);
	};
};
// Hover Function on Hex View
function R3_DESIGN_SCD_hoverFunction(fnId, displayHover){
	if (fnId !== undefined && SCD_arquivoBruto !== undefined && R3_SETTINGS.SETTINGS_SCD_HOVER_FUNCTION_HEX === true){
		var scrTo;
		for (var c = 0; c < R3_SCD_TOTAL_FUNCTIONS; c++){
			TMS.css('R3_SCD_scriptCommand_' + c, {'box-shadow': 'none'});
		};
		if (displayHover === true && R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			scrTo = document.getElementById('R3_SCD_scriptCommand_' + fnId).offsetTop;
			TMS.css('R3_SCD_scriptCommand_' + fnId, {'box-shadow': '0px 0px 10px #fff'});
			document.getElementById('R3_SCD_SCRIPT_INNER').scrollTop = parseInt(scrTo - 4);
		};
	};
};
/*
	SCD Edit Functions
*/
// Update [SET_TIMER] forms
function R3_SCD_FUNCTIONEDIT_UPDATE_SET_TIMER(){
	var editMode = document.getElementById('R3_SCD_EDIT_1e_target').value;
	if (editMode === '29'){
		TMS.css('R3_SCD_EDIT_1e_editVarInt', {'display': 'none'});
		TMS.css('R3_SCD_EDIT_1e_editVarTime', {'display': 'inline'});
		R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();
	} else {
		TMS.css('R3_SCD_EDIT_1e_editVarTime', {'display': 'none'});
		TMS.css('R3_SCD_EDIT_1e_editVarInt', {'display': 'inline'});
	};
};
// Update camera on Swap Camera [CUT_REPLACE]
function R3_SCD_FUNCTION_EDIT_updateCutReplace(){
	var prevCamValue, nextCamValue, imgFix = '', fPrev, fNext, prevTitle, nextTitle;
	if (RDT_arquivoBruto !== undefined){
		prevCamValue = R3_tools.fixVars(parseInt(document.getElementById('R3_SCD_EDIT_53_prevCamValue').value).toString(16), 2).toUpperCase();
		nextCamValue = R3_tools.fixVars(parseInt(document.getElementById('R3_SCD_EDIT_53_nextCamValue').value).toString(16), 2).toUpperCase();
		fPrev = R3_SYSTEM.paths.mod + '/Assets/DATA_A/BSS/' + R3_RDT_mapName + prevCamValue + '.JPG';
		fNext = R3_SYSTEM.paths.mod + '/Assets/DATA_A/BSS/' + R3_RDT_mapName + nextCamValue + '.JPG';
		if (R3_MODULES.fs.existsSync(fPrev) !== true){
			fPrev = 'img/404.webp';
			prevTitle = '';
		} else {
			prevTitle = 'Camera ' + document.getElementById('R3_SCD_EDIT_53_prevCamValue').value + '\nFile: ' + R3_RDT_mapName + prevCamValue + '.JPG';
		};
		if (R3_MODULES.fs.existsSync(fNext) !== true){
			fNext = 'img/404.webp';
			nextTitle = '';
		} else {
			nextTitle = 'Camera ' + document.getElementById('R3_SCD_EDIT_53_nextCamValue').value + '\nFile: ' + R3_RDT_mapName + nextCamValue + '.JPG';
		};
	} else {
		fPrev = fNext = 'img/404.webp';
	};
	// non-windows fix\
	if (R3_SETTINGS.APP_useImageFix === true){
		imgFix = 'file://';
	};
	// End
	document.getElementById('R3_SCD_EDIT_53_nextCam').title = nextTitle;
	document.getElementById('R3_SCD_EDIT_53_nextCam').src = imgFix + fNext;
	document.getElementById('R3_SCD_EDIT_53_previousCam').title = prevTitle;
	document.getElementById('R3_SCD_EDIT_53_previousCam').src = imgFix + fPrev;
};
// Update camera preview
function R3_SCD_FUNCTIONEDIT_updateCamPreview(cOpcode){
	var camPrev, door_nCam = R3_tools.fixVars(parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_nextCam').value).toString(16), 2).toUpperCase(),
		door_nStage = R3_tools.fixVars(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_stage').value, 1),
		door_nRoom = R3_tools.fixVars(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_roomNumber').value, 2);
	if (parseInt(door_nStage) < 1){
		door_nStage = '1';
	};
	document.getElementById('R3_SCD_EDIT_' + cOpcode + '_lblNextStage').innerHTML = door_nStage;
	document.getElementById('R3_SCD_EDIT_' + cOpcode + '_lblNextRoom').innerHTML = door_nRoom.toUpperCase();
	if (door_nCam.length === 2 && door_nStage.length === 1 && door_nRoom.length === 2){
		camPrev = R3_MOD.path + '/DATA_A/BSS/R' + door_nStage + door_nRoom + door_nCam + '.JPG';
		if (R3_SYSTEM.web.isBrowser === false){
			if (R3_MODULES.fs.existsSync(camPrev) !== true){
				camPrev = 'img/404.webp';
			} else {
				// non-windows fix
				if (R3_SETTINGS.APP_useImageFix === true){
					camPrev = 'file://' + camPrev;
				};
			};
		} else {
			camPrev = 'img/404.webp';
		};
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_camPreview').src = camPrev;
		if (R3_SYSTEM.web.isBrowser === false){
			if (camPrev !== 'img/404.webp'){
				TMS.css('R3_SCD_editForm_bg_image', {'display': 'inline', 'background-image': 'url(' + camPrev + ')', 'background-size': 'calc(100% + 60px)'});
			} else {
				TMS.css('R3_SCD_editForm_bg_image', {'display': 'inline', 'background-image': 'linear-gradient(0deg, #0000, #0000)', 'background-size': 'auto 250%'});
			};
		};
	};
};
// Open use player pos.
function R3_SCD_FUNCTIONEDIT_showUsePlayerPos(mode){
	if (mode === 0){
		if (document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn') !== null){
			TMS.css('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn', {'display': 'none'});
			TMS.css('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosDiv', {'display': 'inline'});
		};
	} else {
		if (document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn') !== null){
			TMS.css('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosDiv', {'display': 'none'});
			TMS.css('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn', {'display': 'inline'});
		};
	};
};
// Update item icon preview
function R3_SCD_FUNCTIONEDIT_updateItemPreview(id, imgSrc){
	var itemId = document.getElementById(id).value,
		ITEM_imgIcon = 'img/items/details/' + itemId + '.webp';
	if (parseInt(itemId, 16) > 133){
		ITEM_imgIcon = 'img/items/details/87.webp';
	};
	TMS.css('R3_SCD_editForm_bg_image', {'display': 'inline', 'background-image': 'url(' + ITEM_imgIcon + ')', 'background-size': 'auto 236%'});
	document.getElementById(imgSrc).src = ITEM_imgIcon;
	if (DATABASE_ITEM[itemId] !== undefined){
		document.getElementById(imgSrc).title = DATABASE_ITEM[itemId][0] + '\n' + DATABASE_ITEM[itemId][1].replace(new RegExp('<br>', 'gi'), '\n');
	};
};
// Update AOT_SET Data labels
function R3_SCD_FUNCTIONEDIT_updateAotSetLabels(){
	var aotId = document.getElementById('R3_SCD_EDIT_63_aot').value;
	if (R3_SCD_AOT_TYPES[aotId] !== undefined){
		document.getElementById('R3_SCD_EDIT_63_LBL_data0').innerHTML = R3_SCD_AOT_TYPES[aotId][1];
		document.getElementById('R3_SCD_EDIT_63_LBL_data1').innerHTML = R3_SCD_AOT_TYPES[aotId][2];
		document.getElementById('R3_SCD_EDIT_63_LBL_data2').innerHTML = R3_SCD_AOT_TYPES[aotId][3];
		document.getElementById('R3_SCD_EDIT_63_LBL_data3').innerHTML = R3_SCD_AOT_TYPES[aotId][4];
		if (aotId === '04'){
			TMS.css('R3_SCD_EDIT_63_msgPrevDiv', {'display': 'inline'});
			R3_SCD_FUNCTIONEDIT_updateData0onAOT();
		} else {
			TMS.css('R3_SCD_EDIT_63_msgPrevDiv', {'display': 'none'});
		};
		R3_MINIWINDOW.adjustMiniWindowForm();
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to set AOT labels!');
	};
};
// Update message preview on [AOT_SET] if AOT is Text Message
function R3_SCD_FUNCTIONEDIT_updateData0onAOT(){
	if (R3_SCD_IS_EDITING === true && R3_SCD_currentOpcode === '63'){
		var aotType = document.getElementById('R3_SCD_EDIT_63_aot').value;
		if (aotType === '04'){
			R3_SCD_FUNCION_displayMsgPreview(document.getElementById('R3_SCD_EDIT_63_data0').value);
		};
	};
};
// Update SET_TIMER canvas
function R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas(){
	document.getElementById('R3_SCD_EDIT_1e_hex').innerHTML = R3_SCD_EDIT_FUNCTION_SET_TIMER_CONVERT();
	var timerCountdown, editMode = document.getElementById('R3_SCD_EDIT_1e_target').value;
	if (editMode === '29'){
		timerCountdown = R3_tools.parseHexTime(R3_tools.fixVars(document.getElementById('R3_SCD_EDIT_1e_hex').innerHTML, 4), 3);
		R3_FILEGEN_RENDER_EXTERNAL('R3_SCD_EDIT_1e_canvas', timerCountdown, 'RE3', 0);
	};
};
/*
	Open SCD Opcode Finder
	This tool can find all locations for all SCD opcodes inside RE3
*/
function R3_SCD_openOpcodeFinder(){
	if (R3_SYSTEM.web.isBrowser === false && R3_MOD.enableMod === true && R3_MENU_CURRENT === 4){
		R3_MENU_EXIT();
		R3_UTILS_VAR_CLEAN();
		document.getElementById('R3_OPCODE_FINDER_opName').innerHTML = '';
		document.getElementById('R3_OPCODE_FINDER_RESULT').innerHTML = '';
		document.getElementById('R3V2_TITLE_SCD_OPCODE_FINDER').innerHTML = 'SCD Opcode Finder';
		R3_MINIWINDOW.open(23, 'center');
	};
};
/*
	MSG Editor
*/
// Open Translator
function R3_MSG_openTranslator(){
	document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').value = '';
	R3_MINIWINDOW.open(7);
	setTimeout(function(){
		document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').focus();
	}, 70);
};
// Clear MSG Filed
function R3_MSG_clearTranslateField(){
	document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').value = '';
};
// Update Labels
function R3_MSG_updateLabels(msgId){
	if (RDT_arquivoBruto !== undefined){
		document.getElementById('R3_MSG_LBL_currentMessage').innerHTML = parseInt(msgId + 1);
		TMS.css('R3_MSG_LBL_currentMessage', {'display': 'inline'});
		TMS.css('R3_MSG_BTN_APPLYRDT', {'display': 'inline-flex'});
	} else {
		TMS.css('R3_MSG_LBL_currentMessage', {'display': 'none'});
		TMS.css('R3_MSG_BTN_APPLYRDT', {'display': 'none'});
	};
	// Update only on MSG editor
	if (R3_MENU_CURRENT === 7){
		document.getElementById('R3_MSG_MESSAGE_PREVIEW').innerHTML = R3_MSG_textMode;
		document.getElementById('R3_MSG_HEX_RAW').innerHTML = R3_tools.unsolveHex(R3_MSG_tempHex, 0);
		document.getElementById('R3_MSG_LBL_hexLength').innerHTML = R3_tools.fixVars(parseInt(R3_MSG_tempHex.length / 2).toString(16), 2).toUpperCase();
	};
};
// Update MSG List
function R3_MSG_DESIGN_updateMsgList(msgId){
	var messageId = parseInt(msgId);
	for (var c = 0; c < R3_MSG_RDT_MESSAGES.length; c++){
		TMS.removeClass('R3_MSG_MESSAGE_ID_' + c, 'R3_SCRIPT_LIST_ITEM_SELECT');
	};
	TMS.addClass('R3_MSG_MESSAGE_ID_' + messageId, 'R3_SCRIPT_LIST_ITEM_SELECT');
};
/*
	RDT Editor
*/
// Update selected TIM file on TIM Manager
function R3_DESIGN_updateSelectedTimManager(){
	if (RDT_arquivoBruto !== undefined && R3_MINI_WINDOW_DATABASE[16][5] === true){
		R3_RDT_currentTimFile = parseInt(document.getElementById('R3_RDT_timManagerList').value);
	};
};
// Update selected OBJ file on OBJ Manager
function R3_DESIGN_updateSelectedObjManager(){
	if (RDT_arquivoBruto !== undefined && R3_MINI_WINDOW_DATABASE[17][5] === true){
		R3_RDT_currentObjFile = parseInt(document.getElementById('R3_RDT_objManagerList').value);
	};
};
// Update if SCD Hack is present
function R3_DESIGN_updateScdHack(){
	var hStatus = 'Enabled';
	if (R3_RDT.scdHackEnabled === true){
		TMS.css('BTN_SCD_HACK', {'display': 'inline'});
		TMS.css('R3_RDT_BTN_ENABLE_SCD_HACK', {'display': 'none'});
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (RDT) SCD Hack is enabled on this map!');
	} else {
		hStatus = 'Disbled';
		TMS.css('BTN_SCD_HACK', {'display': 'none'});
		TMS.css('R3_RDT_BTN_ENABLE_SCD_HACK', {'display': 'inline'});
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (RDT) SCD Hack is disbled on this map!');
	};
	document.getElementById('R3_RDT_GENERAL_SCDHACKSTATUS').innerHTML = hStatus;
};
// Open Next / Prev Map
function R3_RDT_openNextPrevMap(mode){
	if (RDT_arquivoBruto !== undefined){
		var mapLocation, nextMap, nmPath = '', gMode = parseInt(document.getElementById('R3_RDT_FILELIST_GAMEMODE').value),
			mapList = R3_RDT_FILELIST_MAPS[gMode];
		if (mapList !== undefined){
			mapLocation = mapList.indexOf(R3_RDT_mapName + '.RDT');
			if (mapLocation !== -1){
				nextMap = parseInt(mapLocation + 1);
				nmPath = R3_MOD.path + '/' + R3_RDT_PREFIX_EASY + '/RDT/';
				// Prev
				if (mode === 1){
					nextMap = parseInt(mapLocation - 1);
				};
				// Game Modes
				if (gMode === 1){
					nmPath = R3_MOD.path + '/' + R3_RDT_PREFIX_HARD + '/RDT/';
				};
				// End
				if (mapList[nextMap] !== undefined && R3_DESIGN_RDT_LOADLOCK === false){
					R3_RDT.readMap(nmPath + mapList[nextMap], true);
				};
			};
		};
	};
};
// Reset Interface
function R3_RDT_DESIGN_resetInterface(){
	if (R3_DOORLINK_RUNNING === false && R3_MINI_WINDOW_DATABASE[23][5] === true){
		R3_MINIWINDOW.close(23);
	};
};
// Show RDT
function R3_RDT_DESIGN_enableInterface(showInterface){
	R3_MINIWINDOW.closeAllRdtMiniWindows();
	// Background image
	if (R3_SETTINGS.SETTINGS_DISABLE_RDT_BACKGROUND === false){
		var mapFirstCamera = R3_MOD.path + '/DATA_A/BSS/' + R3_RDT_mapName + R3_tools.fixVars(R3_tools.genRandomNumber(R3_RDT_MAP_totalCams).toString(16), 2) + '.JPG',
			  mapSecondCamera = R3_MOD.path + '/DATA_A/BSS/' + R3_RDT_mapName + '01.JPG';
		if (R3_SYSTEM.web.isBrowser === false){
			if (R3_MODULES.fs.existsSync(mapFirstCamera) === true){
				if (R3_SETTINGS.APP_useImageFix === true){
					mapFirstCamera = 'file://' + mapFirstCamera;
				};
				TMS.css('R3_RDT_GENERAL_IMG', {'background-image': 'url(' + mapFirstCamera + ')'});
			} else {
				if (R3_MODULES.fs.existsSync(mapSecondCamera) === true){
					if (R3_SETTINGS.APP_useImageFix === true){
						mapSecondCamera = 'file://' + mapSecondCamera;
					};
					TMS.css('R3_RDT_GENERAL_IMG', {'background-image': 'url(' + mapSecondCamera + ')'});
				} else {
					TMS.css('R3_RDT_GENERAL_IMG', {'background-image': 'url(img/404.webp)'});
				};
			};
		};
	} else {
		// Disable background
		if (TMS.getCssData('R3_RDT_GENERAL_IMG', 'background-image') !== 'none'){
			TMS.css('R3_RDT_GENERAL_IMG', {'background-image': 'none'});
		};
	};
	// Buttons
	TMS.css('BTN_MAIN_27', {'display': 'none'});
	TMS.css('R3_MENU_BTNS_RDT_UTILITY', {'display': 'inline-flex'});
	TMS.css('R3_MENU_BTNS_RDT_MINIWINDOWS', {'display': 'inline-flex'});
	TMS.css('R3_MENU_BTNS_RDT_OPENSECTIONS', {'display': 'inline-flex'});
	if (R3_SYSTEM.web.isBrowser === false){
		// Next / Previous Map
		if (R3_MOD.enableMod === true){
			TMS.css('R3_MENU_BTNS_NEXTPREV', {'display': 'inline-flex'});
		} else {
			TMS.css('R3_MENU_BTNS_NEXTPREV', {'display': 'none'});
		};
		document.getElementById('R3_RDT_GENERAL_FILEPATH').title = R3_fileManager.originalFilename.replace('//', '/');
		document.getElementById('R3_RDT_GENERAL_FILESIZE').innerHTML = R3_tools.getFileSize(R3_fileManager.originalFilename, 1) + ' KB';
		document.getElementById('R3_RDT_GENERAL_FILEPATH').innerHTML = R3_tools.fixPathSize(R3_fileManager.originalFilename, (R3_fileManager.originalFilename.length / 2)).replace('//', '/');
	} else {
		TMS.css('R3_PAGE_ICON_BG_7', {'display': 'none'});
		TMS.disableElement(['BTN_MAIN_38', 'BTN_MAIN_26']);
		TMS.css('R3_RDT_LBL_FILESIZE', {'display': 'none'});
		document.getElementById('R3_RDT_GENERAL_FILEPATH').innerHTML = 'Unknwon';
	};
	// Map Name
	if (RDT_locations[R3_RDT_mapName] !== undefined){
		document.getElementById('R3_RDT_GENERAL_FILENAME').innerHTML = R3_RDT_mapName;
		document.getElementById('R3_RDT_GENERAL_LOCALNAME').innerHTML = RDT_locations[R3_RDT_mapName][0] + ', ' + RDT_locations[R3_RDT_mapName][1];
	} else {
		document.getElementById('R3_RDT_GENERAL_LOCALNAME').innerHTML = 'Unknown Location';
		if (R3_SYSTEM.web.isBrowser === false){
			document.getElementById('R3_RDT_GENERAL_FILENAME').innerHTML = R3_tools.getFileName(R3_fileManager.originalFilename).toUpperCase();
		} else {
			document.getElementById('R3_RDT_GENERAL_FILENAME').innerHTML = R3_fileManager.originalFilename.name;
		};
	};
	// End Animation
	R3_DESIGN_RDT_LOADLOCK = false;
	TMS.css('R3_RDT_GENERAL_IMG', {'display': 'block'});
	TMS.css('R3_RDT_MENU_GENERAL_INFOS', {'display': 'block'});
	// End
	if (showInterface === true){
		setTimeout(function(){
			R3_DESIGN_RDT_openForm(0);
		}, 100);
	};
};

// Filelist
function R3_RDT_FILELIST_GENERATE(currentMode){
	if (R3_SYSTEM.web.isBrowser === false){

		R3_SETTINGS_getMapPrefix();
		document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '<div class="align-center">Generating file list, please wait...</div>';
		var mode = R3_tools.getMapPath()[0], rPath, fileTest, currentMap, HTML_MAP_LIST = mapIcon = '', gameMode = 'Easy',
			rdtPath = R3_tools.getMapPath()[1];
		if (mode === 1){
			gameMode = 'Hard';
		};

		const path = require('path');

		// Start Reading
		if (R3_MODULES.fs.existsSync(rdtPath) === true){
			R3_RDT_FILELIST_MAPS[mode] = R3_MODULES.fs.readdirSync(rdtPath);
			if (R3_RDT_FILELIST_CURRENTMODE !== R3_RDT_FILELIST_MAPS[mode]){
				R3_RDT_FILELIST_CURRENTMODE = R3_RDT_FILELIST_MAPS[mode];
				R3_RDT_FILELIST_MAPS[mode].forEach(function(cItem){
					if (R3_tools.getFileExtension(cItem) === 'RDT'){
						currentMap = R3_tools.getFileName(cItem).toUpperCase();
						mapIcon = R3_MOD.path + '/DATA_A/BSS/' + currentMap + '00.JPG';
						if (R3_MODULES.fs.existsSync(mapIcon) !== true){
							mapIcon = R3_MOD.path + '/DATA_A/BSS/' + currentMap + '01.JPG';
							if (R3_MODULES.fs.existsSync(mapIcon) !== true){
								mapIcon = 'img/404.webp';
							};
						};
						// Non-windows fix
						if (R3_SETTINGS.APP_useImageFix === true && R3_MODULES.fs.existsSync(mapIcon) === true){
							mapIcon = 'file://' + mapIcon;
						};
						rPath = rdtPath.replace(new RegExp('/', 'g'), '\\') + '/' + currentMap + '.RDT';
						HTML_MAP_LIST = HTML_MAP_LIST + '<div id="R3_RDT_FILELIST_ITEM_' + currentMap + '" class="R3_RDT_FILELIST_ITEM" onclick="R3_RDT.readMap(`' + rdtPath + '/' +
										currentMap + '.RDT`, true);"><img src="' + mapIcon + '" class="R3_RDT_FILELIST_IMG"><div class="R3_RDT_FILELIST_ITEM_INFOS">Map: <font class="monospace mono_xyzr">' +
										currentMap + '</font><br>Location: <font class="monospace mono_xyzr">' + RDT_locations[currentMap][0] + '</font>, <font class="monospace mono_xyzr">' + RDT_locations[currentMap][1] +
										'</font><br><div class="SEPARATOR-0"></div>Path: <font class="monospace" title="' + rPath + '">' + R3_tools.fixPathSize(rPath, R3_RDT_MENU_LABEL_FIX_NUMBER) + '</font></div></div>';
					} else {
						R3_RDT_FILELIST_MAPS[mode].splice(R3_RDT_FILELIST_MAPS[mode].indexOf(cItem), 1);
					};
				});
				// End
				document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = HTML_MAP_LIST;
				document.getElementById('R3_RDT_FILELIST_HOLDER').scrollTop = 0;
			};
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to get RDT file list!');
			document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '<div class="align-center">The path for this game mode are not available!</div>';
		};
	};
};
// Update map list
function R3_RDT_FILELIST_UPDATELIST(){
	R3_RDT_FILELIST_GENERATE(document.getElementById('R3_RDT_FILELIST_GAMEMODE').value);
};
// Search map list
function R3_RDT_FILELIST_SEARCHMAP(event){
	if (R3_SYSTEM.web.isBrowser === false){
		var kp = event.keyCode, seekValue, mapResult;
		if (kp === 8 || kp === 46){
			document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
		};
		seekValue = R3_tools.cleanHex(document.getElementById('R3_RDT_FILELIST_SERACH').value.toUpperCase()).toUpperCase();
		document.getElementById('R3_RDT_FILELIST_SERACH').value = seekValue;
		// Search
		if (seekValue.length === 3){
			mapResult = document.getElementById('R3_RDT_FILELIST_ITEM_R' + seekValue);
			if (mapResult !== null){
				document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = mapResult.outerHTML;
				if (kp === 13){
					TMS.triggerClick('R3_RDT_FILELIST_ITEM_R' + seekValue);
				};
			} else {
				document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '<div class="align-center">Unable to find R' + seekValue.toUpperCase() + '.RDT</div>';
			};
		} else {
			R3_RDT_FILELIST_UPDATELIST();
		};
	};
};
// Open selected menu
function R3_DESIGN_RDT_openForm(formId){
	if (formId !== undefined){
		for (var c = 0; c < 9999; c++){
			if (document.getElementById('R3_RDT_MENU_' + c) !== null){
				TMS.css('R3_RDT_MENU_' + c, {'display': 'none'});
			};
		};
		TMS.css('R3_RDT_MENU_' + formId, {'display': 'inline'});
	};
};
// Open RDT List
function R3_DESIGN_RDT_openFileList(){
	R3_MINIWINDOW.close([6, 10]);
	TMS.css('R3_MENU_BTNS_NEXTPREV', {'display': 'none'});
	TMS.css('R3_MENU_BTNS_RDT_UTILITY', {'display': 'none'});
	TMS.css('R3_MENU_BTNS_RDT_MINIWINDOWS', {'display': 'none'});
	TMS.css('R3_MENU_BTNS_RDT_OPENSECTIONS', {'display': 'none'});
	document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
	TMS.css('BTN_MAIN_27', {'display': 'inline'});
	R3_RDT_FILELIST_UPDATELIST();
	R3_DESIGN_RDT_openForm(1);
	setTimeout(function(){
		document.getElementById('R3_RDT_FILELIST_SERACH').focus();
	}, 50);
};
// Close RDT List
function R3_DESIGN_RDT_closeFileList(){
	TMS.css('R3_MENU_BTNS_RDT_OPENSECTIONS', {'display': 'inline-flex'});
	TMS.css('R3_MENU_BTNS_RDT_MINIWINDOWS', {'display': 'inline-flex'});
	TMS.css('R3_MENU_BTNS_RDT_UTILITY', {'display': 'inline-flex'});
	document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
	TMS.css('BTN_MAIN_27', {'display': 'none'});
	R3_DESIGN_RDT_openForm(0);
};
/*
	RID
*/
// Update current camera
function R3_DESIGN_RID_updateCamSelected(camId){
	// Set BG
	var mPath, camBss = R3_MOD.path + '/DATA_A/BSS/' + R3_RDT_mapName + R3_tools.fixVars(parseInt(camId).toString(16), 2) + '.JPG';
	if (R3_SYSTEM.web.isBrowser === false){
		if (R3_MODULES.fs.existsSync(camBss) === false){
			camBss = 'img/404.webp';
			TMS.css('R3_RID_EDIT_FORM_INNER_BG', {'background-image': 'url(\'./img/404.webp\')'});
		} else {
			mPath = R3_MOD.path;
			if (R3_SETTINGS.APP_useImageFix === true){
				mPath = 'file://' + R3_MOD.path;
			};
			TMS.css('R3_RID_EDIT_FORM_INNER_BG', {'background-image': 'url(\'' + mPath + '/DATA_A/BSS/' + R3_RDT_mapName + R3_tools.fixVars(parseInt(camId).toString(16), 2) + '.JPG\')'});
		};
		// Non-windows fix
		if (R3_SETTINGS.APP_useImageFix === true){
			camBss = 'file://' + camBss;
		};
	} else {
		camBss = 'img/404.webp';
	};
	document.getElementById('R3_RID_CAMERA_BSS').src = camBss;
	// Cam List
	for (var c = 0; c < R3_rdtRID.cameraList.length; c++){
		TMS.removeClass('R3_RID_CAM_' + c, 'R3_SCRIPT_LIST_ITEM_SELECT');
	};
	TMS.addClass('R3_RID_CAM_' + camId, 'R3_SCRIPT_LIST_ITEM_SELECT');
	document.getElementById('R3_RID_CAMERA_LIST_HOLDER').scrollTop = (document.getElementById('R3_RID_CAM_' + camId).offsetTop - 36);
	// Title
	document.getElementById('R3_RID_lblTitleCurrentCam').innerHTML = camId + ' (' + R3_tools.fixVars(parseInt(camId).toString(16), 2).toUpperCase() + ')';
	// End
	R3_rdtRID.currentCamera = parseInt(camId);
};
document.FOR_HACKERS_ONLY = function(){
	R3_SYSTEM.clearLog();
	R3_SYSTEM.log_RESET = true;
	R3_SYSTEM.log('separator');
	R3_SYSTEM.log('log', '<div class="align-center">' + atob('TG9va2luZyBpbnNpZGUgUjNWMiBDb2RlPyBKdXN0IGhvcGUgeW91IGhhdmUgYSBnb29kIHRpbWUhPGJyPjxicj5EbyB5b3Ugd2FubmEgcGxheSBhIGNvb2wgZ2FtZT8gVHJ5IDx1IHRpdGxlPSJIaSEiPkNyb3NzQ29kZTwvdT4hPGJyPkl0IGlzIGF2YWlsYWJsZSBvbiBTdGVhbSAoV2luLCBtYWNPUyBhbmQgTGludXgpLCBQUzQgYW5kIGV2ZW4gb24gTmludGVuZG8gU3dpdGNoITxicj48YnI+VGhlcmUgaXMgYSB3ZWJkZW1vIGlmIHlvdSB3YW50IHRyeSB0aGUgZ2FtZSBiZWZvcmUgcHVyY2hhc2luZyBpdDo8YnI+PGEgaHJlZj0iaHR0cHM6Ly9jcm9zcy1jb2RlLmNvbS9lbi9zdGFydCIgdGFyZ2V0PSJfYmxhbmsiPmh0dHBzOi8vY3Jvc3MtY29kZS5jb20vZW4vc3RhcnQ8L2E+PGJyPjxicj5Ob3cgLSBpZiB5b3Ugd2FudCBrbm93IGFib3V0IHRoaXMgc29mdHdhcmUsIDxhIGhyZWY9Imh0dHBzOi8vdHdpdHRlci5jb20vdGhlbWl0b3NhbiIgdGFyZ2V0PSJfYmxhbmsiPkRNIG1lIG9uIFR3aXR0ZXI8L2E+ITxicj48YnI+U2VlIHlvdSBsYXRlciE8YnI+PGJyPjxhIGhyZWY9Imh0dHBzOi8vdGhlbWl0b3Nhbi5naXRodWIuaW8vIiB0YXJnZXQ9Il9ibGFuayI+VGhlTWl0b1NhbjwvYT4u') + '</div>');
	R3_SYSTEM.log('separator');
	TMS.addClass('R3_LOG_ID_N_2', 'SEPARATOR-5');
	TMS.addClass('R3_LOG_ID_N_4', 'SEPARATOR-5');
	TMS.removeClass('R3_LOG_ID_N_2', 'SEPARATOR-3');
	TMS.removeClass('R3_LOG_ID_N_4', 'SEPARATOR-3');
	document.getElementById('R3V2_TITLE_LOG_WINDOW').innerHTML = '~ I S33 Y0U! ~';
	R3_MINIWINDOW.open(0, 'center');
};
// Update Range
function R3_DESIGN_RID_updateRange(){
	document.getElementById('R3_RID_EDIT_rangePosX').value = document.getElementById('R3_RID_EDIT_posX').value;
	document.getElementById('R3_RID_EDIT_rangePosY').value = document.getElementById('R3_RID_EDIT_posY').value;
	document.getElementById('R3_RID_EDIT_rangePosZ').value = document.getElementById('R3_RID_EDIT_posZ').value;
	document.getElementById('R3_RID_EDIT_rangePosR').value = document.getElementById('R3_RID_EDIT_posR').value;
	R3_DESIGN_RID_updateLabels();
};
// Update Input
function R3_DESIGN_RID_updateInput(){
	document.getElementById('R3_RID_EDIT_posX').value = document.getElementById('R3_RID_EDIT_rangePosX').value;
	document.getElementById('R3_RID_EDIT_posY').value = document.getElementById('R3_RID_EDIT_rangePosY').value;
	document.getElementById('R3_RID_EDIT_posZ').value = document.getElementById('R3_RID_EDIT_rangePosZ').value;
	document.getElementById('R3_RID_EDIT_posR').value = document.getElementById('R3_RID_EDIT_rangePosR').value;
	R3_DESIGN_RID_updateLabels();
};
// Update value labels
function R3_DESIGN_RID_updateLabels(){
	document.getElementById('R3_RID_LBL_POS_X').innerHTML = R3_tools.parseEndian(R3_tools.convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posX').value))).toUpperCase();
	document.getElementById('R3_RID_LBL_POS_Y').innerHTML = R3_tools.parseEndian(R3_tools.convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posY').value))).toUpperCase();
	document.getElementById('R3_RID_LBL_POS_Z').innerHTML = R3_tools.parseEndian(R3_tools.convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posZ').value))).toUpperCase();
	document.getElementById('R3_RID_LBL_POS_R').innerHTML = R3_tools.parseEndian(R3_tools.convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posR').value))).toUpperCase();
};
// Next / Previous Camera
function R3_DESIGN_RID_seekCamera(mode){
	if (mode === 0){
		R3_rdtRID.currentCamera--;
	} else {
		R3_rdtRID.currentCamera++;
	};
	if (R3_rdtRID.currentCamera > (R3_rdtRID.cameraList.length - 1)){
		R3_rdtRID.currentCamera = (R3_rdtRID.cameraList.length - 1)
	};
	if (R3_rdtRID.currentCamera < 0){
		R3_rdtRID.currentCamera = 0;
	};
	R3_rdtRID.readCamera(R3_rdtRID.currentCamera);
};
/*
	RE3 Livestatus
*/
// Open RE3 Livestatus Menu
function R3_LIVESTATUS_OPEN_MENU(){
	if (R3_SYSTEM.web.isBrowser === false && R3_GAME.gameRunning === true){
		R3_DESIGN_SHOWTABS(0, 0);
		R3_MINIWINDOW.open(19);
	};
};
// Open Bar
function R3_LIVESTATUS_OPEN_BAR(){
	if (R3_SYSTEM.web.isBrowser === false){
		for (var c = 0; c < R3_TOTAL_MENUS; c++){
			if (c !== 2 && document.getElementById('MENU_' + c) !== null){
				if (R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS === 1){
					TMS.css('MENU_' + c, {'width': 'calc(100% - 112px)', 'height': 'calc(100% - 26px)'});
				} else {
					TMS.css('MENU_' + c, {'width': '100%', 'height': 'calc(100% - 64px)'});
				};
			};
		};
		TMS.css('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_HOLDER', {'display': 'block'});
	};
};
// Close Bar
function R3_LIVESTATUS_CLOSE_BAR(){
	TMS.css('R3_LIVESTATUS_0_HOLDER', {'display': 'none'});
	TMS.css('R3_LIVESTATUS_1_HOLDER', {'display': 'none'});
	// Adjust menus
	for (var c = 0; c < R3_TOTAL_MENUS; c++){
		if (document.getElementById('MENU_' + c) !== null){
			TMS.css('MENU_' + c, {'width': '100%', 'height': 'calc(100% - 24px)'});
		};
	};
	// End
	if (R3_MINI_WINDOW_DATABASE[19][5] === true){
		R3_MINIWINDOW.close(19);
	};
};
// Adjust Interface
function R3_LIVESTATUS_BAR_ADJUSTINTERFACE(){
	R3_LIVESTATUS_OPEN_BAR();
	setTimeout(function(){
		R3_LIVESTATUS_CLOSE_BAR();
	}, 100);
};
// Toggle Bar Position
function R3_LIVESTATUS_BAR_TOGGLEPOS(){
	if (R3_GAME.gameRunning === true && R3_SYSTEM.web.isBrowser === false){
		R3_LIVESTATUS_CLOSE_BAR();
		if (R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS === 0){
			R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS = 1;
		} else {
			R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS = 0;
		};
		R3_LIVESTATUS_OPEN_BAR();
		R3_keyPress.keyUpToggleTimout = true;
		R3_LIVESTATUS_FORCE_RENDER = true;
		R3_SETTINGS_SAVE();
		setTimeout(function(){
			R3_keyPress.keyUpToggleTimout = false;
		}, 1000);
	};
};
// Render RE3 Livestatus infos
function R3_LIVETSTATUS_RENDER(){
	/*
		Bars
	*/
	// Var Cleaning
	var c = f = 0, ext = 'RDT', checkPos, checkPlayer, currentInventory, R3_PLAYER_POS;
	// Map Values
	if (RE3_LIVE_MAP !== R3_LIVESTATUS.currentRDT || R3_LIVESTATUS_FORCE_RENDER === true){
		if (RDT_locations[R3_LIVESTATUS.currentRDT] !== undefined){
			if (R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].gameData.isConsole === true){
				ext = 'ARD';
			};
			document.getElementById('R3_LIVESTATUS_LBL_ROOM_NAME').innerHTML = RDT_locations[R3_LIVESTATUS.currentRDT][0];
			document.getElementById('R3_LIVESTATUS_LBL_ROOM_FILENAME').innerHTML = R3_LIVESTATUS.currentRDT + '.' + ext;
			document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_RDT').innerHTML = R3_LIVESTATUS.currentRDT + '.' + ext;
			document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_MAP_NAME').innerHTML = RDT_locations[R3_LIVESTATUS.currentRDT][0];
			RE3_LIVE_MAP = R3_LIVESTATUS.currentRDT;
		};
	};
	// Pos. Values
	checkPos = R3_LIVESTATUS.playerXPos + R3_LIVESTATUS.playerYPos + R3_LIVESTATUS.playerZPos + R3_LIVESTATUS.playerRPos + R3_LIVESTATUS.playerzIndex;
	if (checkPos !== RE3_LIVE_POS || R3_LIVESTATUS_FORCE_RENDER === true){
		R3_PLAYER_POS = [R3_LIVESTATUS.playerXPos, R3_LIVESTATUS.playerYPos, R3_LIVESTATUS.playerZPos, R3_LIVESTATUS.playerRPos, R3_LIVESTATUS.playerzIndex];
		if (R3_SETTINGS.SETTINGS_DISPLAY_POSITION_INT === true){
			R3_PLAYER_POS = [R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerXPos), R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerYPos), R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerZPos), R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerRPos), parseInt(R3_LIVESTATUS.playerzIndex)];
		};
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value = R3_LIVESTATUS.playerXPos;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value = R3_LIVESTATUS.playerYPos;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value = R3_LIVESTATUS.playerZPos;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value = R3_LIVESTATUS.playerRPos;
		// Modifiers
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X_INT').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerXPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X_RANGE').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerXPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y_INT').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerYPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y_RANGE').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerYPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z_INT').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerZPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z_RANGE').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerZPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R_INT').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerRPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R_RANGE').value = R3_tools.convertPosHexToInt(R3_LIVESTATUS.playerRPos);
		document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value = R3_LIVESTATUS.playerzIndex;
		//
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_X').innerHTML = R3_PLAYER_POS[0];
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_Y').innerHTML = R3_PLAYER_POS[1];
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_Z').innerHTML = R3_PLAYER_POS[2];
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_R').innerHTML = R3_PLAYER_POS[3];
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_zI').innerHTML = R3_PLAYER_POS[4];
		RE3_LIVE_POS = R3_LIVESTATUS.playerXPos + R3_LIVESTATUS.playerYPos + R3_LIVESTATUS.playerZPos + R3_LIVESTATUS.playerRPos + R3_LIVESTATUS.playerzIndex;
	};
	// Player Values
	checkPlayer = R3_LIVESTATUS.currentHP + R3_LIVESTATUS.currentPlayer + R3_LIVESTATUS.currentWeapon;
	if (checkPlayer !== RE3_LIVE_PLAYER || R3_LIVESTATUS_FORCE_RENDER === true){
		TMS.removeClass('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV', 'R3_COLOR_FINE');
		TMS.removeClass('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV', 'R3_COLOR_DANGER');
		TMS.removeClass('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV', 'R3_COLOR_POISON');
		TMS.removeClass('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV', 'R3_COLOR_CAUTION');
		TMS.removeClass('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV', 'R3_COLOR_CAUTION_RED');
		TMS.addClass('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV', R3_tools.processPlayerHP(R3_LIVESTATUS.currentHP)[3]);
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_HP').innerHTML = R3_tools.processPlayerHP(R3_LIVESTATUS.currentHP)[0];
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_CONDITION').innerHTML = R3_tools.processPlayerHP(R3_LIVESTATUS.currentHP)[1];
		// Weapons
		const cPlayer = 'img/PLR_' + R3_LIVESTATUS.currentPlayer + '.webp', cWeapon = 'img/items/' + R3_LIVESTATUS.currentWeapon + '.webp';
		TMS.css('R3_LIVESTATUS_MINITAB_2_BG', {'background-image': 'url("./img/PLR_' + R3_LIVESTATUS.currentPlayer + '.webp")'});
		document.getElementById('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERICON').src = cPlayer;
		document.getElementById('R3_LIVESTATUS_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_WEAPONICON').src = cWeapon;
		// RE3 Live Window
		document.getElementById('R3_LIVESTATUS_LBL_PLR_HP_HEX').innerHTML = R3_LIVESTATUS.currentHP;
		document.getElementById('R3_LIVESTATUS_LBL_PLR_HP').innerHTML = R3_tools.processPlayerHP(R3_LIVESTATUS.currentHP)[0];
		document.getElementById('R3_LIVESTATUS_LBL_PLR_CONDITION').innerHTML = R3_tools.processPlayerHP(R3_LIVESTATUS.currentHP)[1];
		document.getElementById('R3_LIVESTATUS_LBL_PLR_WEAPON').innerHTML = R3_LIVESTATUS_DB.weaponList[R3_LIVESTATUS.currentWeapon];
		document.getElementById('R3_LIVESTATUS_LBL_PLR_CURRENT').innerHTML = R3_LIVESTATUS_DB.playerList[R3_LIVESTATUS.currentPlayer];
		/*
			End
		*/
		RE3_LIVE_PLAYER = R3_LIVESTATUS.currentHP + R3_LIVESTATUS.currentPlayer + R3_LIVESTATUS.currentWeapon;
	};
	// Item Box
	if (TEMP_ITEMBOX !== R3_LIVESTATUS.playerItemBox){
		var IT, QT, AT, boxArray = R3_LIVESTATUS.playerItemBox.match(/.{1,8}/g), tempQT;
		while (c < 64){
			IT = boxArray[c].slice(0, 2).toLowerCase();
			QT = parseInt(boxArray[c].slice(2, 4), 16);
			AT = boxArray[c].slice(4, 6).toLowerCase();
			if (DATABASE_ITEM_PERCENTAGE.indexOf(AT) !== -1){
				tempQT = QT + '%';
			} else {
				tempQT = QT;
			};
			if (DATABASE_ITEM_INFINITE.indexOf(AT) !== -1){
				tempQT = 'Inf.';
			};
			if (parseInt(IT, 16) > 133){
				IT = '85';
			};
			document.getElementById('R3_LIVESTATUS_BOX_ITEM_QT_' + c).innerHTML = tempQT;
			document.getElementById('R3_LIVESTATUS_BOX_IMG_' + c).src = 'img/items/' + IT + '.webp';
			document.getElementById('R3_LIVESTATUS_BOX_ITEM_LBL_' + c).innerHTML = '(' + c + ') ' + DATABASE_ITEM[IT][0];
			if (DATABASE_ITEM_ATTR[AT] !== undefined){
				TMS.css('R3_LIVESTATUS_BOX_ITEM_QT_' + c, {'color': DATABASE_ITEM_ATTR[AT][1], 'opacity': DATABASE_ITEM_ATTR[AT][4]});	
			};
			c++;
		};
		// End
		TEMP_ITEMBOX = R3_LIVESTATUS.playerItemBox;
	};
	// Infinite HP
	if (document.getElementById('R3_LIVESTATUS_OPTION_INFINITE_HP').checked === true){
		R3_LIVESTATUS.infiniteHP();
	};
	// Camera
	if (RE3_LIVE_CAM !== R3_LIVESTATUS.currentCam){
		var nextCam = R3_MOD.path + '/DATA_A/BSS/' + R3_LIVESTATUS.currentRDT + R3_LIVESTATUS.currentCam + '.JPG';
		if (R3_MODULES.fs.existsSync(nextCam) !== false){
			document.getElementById('R3_LIVESTATUS_IMG_CURRENT_CAM').src = nextCam;
		} else {
			document.getElementById('R3_LIVESTATUS_IMG_CURRENT_CAM').src = 'img/404.webp';
		};
		document.getElementById('R3_LIVESTATUS_LBL_CURRENT_CAM').innerHTML = parseInt(R3_LIVESTATUS.currentCam, 16);
		document.getElementById('R3_LIVESTATUS_LBL_' + R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS + '_CAM').innerHTML = parseInt(R3_LIVESTATUS.currentCam, 16);
		RE3_LIVE_CAM = R3_LIVESTATUS.currentCam;
	};
	// Inventory
	currentInventory = localStorage.getItem('REALTIME_INVENTORY');
	if (currentInventory !== RE3_LIVE_INVENT || R3_LIVESTATUS_FORCE_RENDER === true){
		while (f < 10){
			var cSlot = currentInventory.match(/.{8,8}/g)[f],
				IT = cSlot.slice(0, 2).toLowerCase(),
				QT = cSlot.slice(2, 4).toLowerCase(),
				AT = cSlot.slice(4, 6).toLowerCase();
			R3_LIVESTATUS_RENDER_INVENT_SLOT(f, IT, QT, AT);
			f++;
		};
		RE3_LIVE_INVENT = currentInventory;
	};
	/*
		End
	*/
	// Turn Off Force renderer
	if (R3_LIVESTATUS_FORCE_RENDER === true){
		R3_LIVESTATUS_FORCE_RENDER = false;
	};
};
// Render Inventory
function R3_LIVESTATUS_RENDER_INVENT_SLOT(sID, IT, QT, AT){
	if (DATABASE_ITEM_ATTR[AT] !== undefined){
		var slotId = parseInt(sID + 1), itColor = DATABASE_ITEM_ATTR[AT][1], itShadow = DATABASE_ITEM_ATTR[AT][2], itDisplay = DATABASE_ITEM_ATTR[AT][3], itQT = parseInt(QT, 16);
		if (DATABASE_ITEM_PERCENTAGE.indexOf(AT) !== -1){
			itQT = itQT + '%';
		};
		if (DATABASE_ITEM_INFINITE.indexOf(AT) !== -1){
			itQT = 'Inf.';
		};
		if (parseInt(IT, 16) > 133){
			IT = '85';
		};
		document.getElementById('R3_LIVESTATUS_LBL_INVENT_' + slotId).innerHTML = itQT;
		document.getElementById('R3_LIVESTATUS_INVENT_ICON_' + slotId).src = 'img/items/' + IT + '.webp';
		TMS.css('R3_LIVESTATUS_LBL_INVENT_' + slotId, {'color': itColor, 'text-shadow': itShadow, 'display': itDisplay});
		document.getElementById('R3_LIVESTATUS_INVENT_ICON_' + slotId).title = DATABASE_ITEM[IT][0] + ' (Click to edit this slot)\n\n' + DATABASE_ITEM[IT][1].replace(new RegExp('<br>', 'gi'), '\n');
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unknown Item Attr! [' + AT + ']');
	};
};
// Edit Item Slot
function R3_LIVESTATUS_EDIT_INVENT(inventId){
	var inventSlot, IT, QT, AT, itHEX = localStorage.getItem('REALTIME_INVENTORY').match(/.{8,8}/g);
	if (itHEX !== null){
		// Get Inventory data
		inventSlot = itHEX[(inventId - 1)];
		IT = inventSlot.slice(0, 2).toLowerCase();
		QT = parseInt(inventSlot.slice(2, 4), 16);
		AT = inventSlot.slice(4, 6).toLowerCase();
		// Display Info
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_QT').value = QT;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_AT').value = AT;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value = IT;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX_SEARCH').value = '';
		document.getElementById('R3_LIVESTATUS_MINITAB_4').value = 'Edit Inventory Slot ' + inventId;
		R3_LIVESTATUS_EDIT_INVENT_RENDERIMG();
		// End
		TMS.css('R3_LIVESTATUS_MINITAB_4', {'display': 'block'});
		TMS.css('R3_LIVESTATUS_MINISECTION_4', {'display': 'block'});
		document.getElementById('R3_LIVESTATUS_EDIT_INVENT_APPLY').onclick = function(){
			R3_LIVESTATUS.applyInventItem(inventId);
		};
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX_SEARCH').focus();
	};
};
// Search Item Hex on Slot Edit
function R3_LIVESTATUS_SEARCH_ITEM_HEX_SLOT(){
	var IT = document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX_SEARCH').value;
	if (IT !== '' && IT.length === 2){
		if (DATABASE_ITEM[IT] !== undefined){
			document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value = IT;
		} else {
			document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value = '00';
		};
		R3_LIVESTATUS_EDIT_INVENT_RENDERIMG();
	};
};
// Render Image on Edit
function R3_LIVESTATUS_EDIT_INVENT_RENDERIMG(){
	var IT = document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value;
	document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX_SEARCH').value = '';
	document.getElementById('R3_LIVESTATUS_IMG_ITEM_SETSLOT').src = 'img/items/details/' + IT + '.webp';
	TMS.css('R3_LIVESTATUS_IMG_ITEM_BG', {'background-image': 'url("./img/items/details/' + IT + '.webp")'});
};
// Edit Itembox
function R3_LIVESTATUS_EDIT_ITEMBOX(itemId){
	var IT, QT, AT, R3_IBOX_TEMP = R3_LIVESTATUS.playerItemBox.match(/.{1,8}/g), iHex = R3_IBOX_TEMP[itemId];
	if (iHex !== ''){
		IT = iHex.slice(0, 2).toLowerCase();
		QT = parseInt(iHex.slice(2, 4), 16);
		AT = iHex.slice(4, 6).toLowerCase();
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_QT').value = QT;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_AT').value = AT;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value = IT;
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX_SEARCH').value = '';
		document.getElementById('R3_LIVESTATUS_MINITAB_4').value = 'Edit Item Box Slot ' + itemId;
		R3_LIVESTATUS_EDIT_INVENT_RENDERIMG();
		// End
		TMS.css('R3_LIVESTATUS_MINITAB_4', {'display': 'block'});
		TMS.css('R3_LIVESTATUS_MINISECTION_4', {'display': 'block'});
		document.getElementById('R3_LIVESTATUS_EDIT_INVENT_APPLY').onclick = function(){
			R3_LIVESTATUS.applyBoxItem(itemId);
		};
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX_SEARCH').focus();
	};
};
// Cancel Slot Edit
function R3_LIVESTATUS_EDIT_INVENT_CANCEL(){
	TMS.css('R3_LIVESTATUS_MINITAB_4', {'display': 'none'});
	TMS.css('R3_LIVESTATUS_MINISECTION_4', {'display': 'none'});
	document.getElementById('R3_LIVESTATUS_EDIT_INVENT_APPLY').onclick = undefined;
};
// Close RE3 Livestatus
function R3_LIVESTATUS_CLOSEMENU(){
	R3_LIVESTATUS_OPEN = false;
	R3_MINIWINDOW.close(19);
};
// Update Pos Via range
function R3_LIVESTATUS_UPDATE_POS(mode, axis){
	if (axis !== undefined){
		var newPos;
		if (mode === 0){
			newPos = parseInt(document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_RANGE').value);
			if (document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_RANGE').value === ''){
				newPos = 0;
			};
			document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_INT').value = newPos;
			document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis).value = R3_tools.parseEndian(R3_tools.convertPosIntToHex(newPos)).toUpperCase();
		} else {
			newPos = parseInt(document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_INT').value);
			if (document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_INT').value === ''){
				newPos = 0;
			};
			document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_RANGE').value = newPos;
			document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis).value = R3_tools.parseEndian(R3_tools.convertPosIntToHex(newPos)).toUpperCase();
		};
	};
};
// R3_LIVESTATUS_APPLY_PLAYERPOS_BAR
function R3_LIVESTATUS_APPLY_PLAYERPOS_BAR(){
	if (R3_GAME.gameRunning === true && R3_MEMJS.processObj !== undefined){
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value = R3_TEMP_X;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value = R3_TEMP_Y;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value = R3_TEMP_Z;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value = R3_TEMP_R;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value = R3_TEMP_zI;
		R3_LIVESTATUS.applyPlayerPos();
	};
};
// RE3_LIVE_COPY_PASTE_LOCATION
function RE3_LIVE_COPY_PASTE_LOCATION(mode){
	if (R3_GAME.gameRunning === true && R3_MEMJS.processObj !== undefined){
		if (mode === 0){
			R3_LIVESTATUS.tempXPos = REALTIME_X_Pos;
			R3_LIVESTATUS.tempYPos = REALTIME_Y_Pos;
			R3_LIVESTATUS.tempZPos = REALTIME_Z_Pos;
			R3_LIVESTATUS.tempRPos = REALTIME_R_Pos;
			R3_SYS_copyText('[CURRENT LOCATION]\nCurrent Map: R' + parseInt(REALTIME_CurrentStage) + REALTIME_CurrentRoomNumber + '.RDT\nX Pos: ' + REALTIME_X_Pos + '\nY Pos: ' + REALTIME_Y_Pos + '\nZ Pos: ' + REALTIME_Z_Pos + '\nR Pos: ' + REALTIME_R_Pos);
			TMS.css('RE3_LIVESTATUS_stageOptions_pastePos', {'display': 'inline'});
		} else {
			document.getElementById('RE3_LIVESTATUS_edit_X').value = R3_LIVESTATUS.tempXPos;
			document.getElementById('RE3_LIVESTATUS_edit_Y').value = R3_LIVESTATUS.tempYPos;
			document.getElementById('RE3_LIVESTATUS_edit_Z').value = R3_LIVESTATUS.tempZPos;
			document.getElementById('RE3_LIVESTATUS_edit_R').value = R3_LIVESTATUS.tempRPos;
		};
	};
};
/*
	eNGE Design Functions
*/
function R3_eNGE_openEmuWindow(){
	if (R3_SYSTEM.web.isBrowser === false && R3_SETTINGS.SETTINGS_DISABLE_ENGE === false){
		R3_MINIWINDOW.open(13, 'center');
	};
};
// Make eNGE window visisble on settings
function R3_eNGE_makeWindowVisible(mode){
	if (mode === 0){
		if (R3_MINI_WINDOW_DATABASE[13][5] === false && R3_SETTINGS.SETTINGS_DISABLE_ENGE === false){
			R3_MINIWINDOW.open(13);
		};
		TMS.css('R3V2_MINI_WINDOW_13', {'z-index': '10000010'});
	} else {
		TMS.css('R3V2_MINI_WINDOW_13', {'z-index': '999999'});
	};
};
/*
	R3V2 Wizard
*/
// Open R3V2 Wizard
function R3_DESIGN_displayWizard(){
	if (R3_SYSTEM.web.isBrowser === false && R3_MENU_CURRENT !== 0){
		document.getElementById('R3_WIZARD_GAME_PATH').title = '';
		document.getElementById('R3_WIZARD_GAME_PATH').innerHTML = 'Unknown Location';
		R3_MINIWINDOW.open(21, 'center');
	} else {
		if (R3_SYSTEM.web.isBrowser === true){
			R3_SYSTEM.web.webWarn();
		};
	};
};
/*
	Utils
*/
function R3_DESIGN_UTILS_processCheckBox(checkboxId, updateSettings){
	var check = document.getElementById(checkboxId).checked;
	if (check === true){
		document.getElementById(checkboxId).checked = false;
	} else {
		document.getElementById(checkboxId).checked = true;
	};
	if (updateSettings === true){
		R3_SETTINGS_UPDATE_CHECKBOX();
	};
};
/*
	Loading Screen
*/
function R3_UTILS_CALL_LOADING(title, status, percent){
	R3_DESIGN_LOADING_ACTIVE = true;
	TMS.css('R3_MENU_MAIN_TOP', {'display': 'none'});
	document.getElementById('R3_LOADING_TITLE').innerHTML = title;
	document.getElementById('R3_LOADING_STATUS').innerHTML = status;
	document.getElementById('R3_LOADING_PGBAR_LABEL').innerHTML = percent;
	TMS.css('R3_LOADING_PGBAR_DIV', {'width': 'calc(' + parseInt(percent) + '% - 20px)'});
	R3_SHOW_MENU(2);	
	R3_MENU_LOCK = true;
};
function R3_UTILS_LOADING_UPDATE(status, percent){
	document.getElementById('R3_LOADING_STATUS').innerHTML = status;
	document.getElementById('R3_LOADING_PGBAR_LABEL').innerHTML = percent;
	TMS.css('R3_LOADING_PGBAR_DIV', {'width': 'calc(' + parseInt(percent) + '% - 20px)'});
};
function R3_UTILS_LOADING_CLOSE(){
	TMS.css('R3_MENU_MAIN_TOP', {'display': 'inline-flex'});
	R3_DESIGN_LOADING_ACTIVE = false;
	R3_MENU_LOCK = false;
	R3_MENU_GOBACK();
};
/*
	Backup manager
*/
function R3_DESIGN_renderBackupManager(){
	if (R3_SYSTEM.web.isBrowser === false){
		var c = 0, HTML_TEMPLATE = '', fPath, fName, fShort, fType, fEditor, fDate, fileArray = Object.keys(R3_backupManager.backupList).reverse();
		if (Object.keys(R3_backupManager.backupList).length !== 0){
			document.getElementById('R3_BACKUP_MANAGER_ITEMS').innerHTML = '<div class="align-center">Generating backup list - Please wait</div>';
			while (c < fileArray.length){
				fName   = fileArray[c];
				fShort  = R3_backupManager.backupList[fileArray[c]][0];
				fType   = R3_backupManager.backupList[fileArray[c]][1];
				fEditor = R3_backupManager.backupList[fileArray[c]][2];
				fDate   = R3_backupManager.backupList[fileArray[c]][3] + ' - ' + R3_backupManager.backupList[fileArray[c]][4];
				fPath   = R3_backupManager.backupList[fileArray[c]][5];
				HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_BACKUP_MANAGER_ITEM" id="R3_BACKUP_MANAGER_ITEM_' + c + '"><font title="File: ' + fName + '\nPath: ' + fPath + '">' + fShort + '</font>' +
								'<font class="R3_BACKUP_MANAGER_format">' + fType + '</font><font class="R3_BACKUP_MANAGER_changesOn">' + fEditor + '</font><font class="R3_BACKUP_MANAGER_modifiedOn">' + 
								fDate + '</font><div class="R3_BACKUP_MANAGER_actions"><input type="button" value="Restore" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" onclick="R3_backupManager.restoreFile(' + c + ');" ' + 
								'title="Click here to restore this backup file"><input type="button" value="Delete" class="BTN_R3CLASSIC BTN_R3CLASSIC_DELETE" onclick="R3_backupManager.deleteFile(' + c + ');" ' +
								'title="Click here to delete this backup file"></div></div>';
				c++;
			};
			document.getElementById('R3_BACKUP_MANAGER_ITEMS').innerHTML = HTML_TEMPLATE;
		} else {
			document.getElementById('R3_BACKUP_MANAGER_ITEMS').innerHTML = '<br><div class="align-center txt-italic">There\'s nothing to display here!</div>';
		};
		R3_MINIWINDOW.open(18, 'center');
	};
};
/*
	Settings
*/
function R3_DESIGN_processSettingsChanges(){
	// Move screen to another display
	if (R3_SETTINGS.SETTINGS_ENABLE_MOVE_SCREEN === true){
		TMS.css('SETTINGS_ENABLE_MOVE_DISPLAY_DIV', {'display': 'inline'});
	} else {
		TMS.css('SETTINGS_ENABLE_MOVE_DISPLAY_DIV', {'display': 'none'});
	};
};
// Load settings into GUI
function R3_DESIGN_loadSettingsGUI(){
	document.getElementById('R3_SETTINGS_RE3_PATH').innerHTML = R3_tools.fixPath(R3_SETTINGS.R3_RE3_PATH);
	document.getElementById('R3_SETTINGS_MERCE_PATH').innerHTML = R3_tools.fixPath(R3_SETTINGS.R3_MERCE_PATH);
	document.getElementById('R3_SETTINGS_HEX_PATH').innerHTML = R3_tools.fixPath(R3_SETTINGS.R3_HEX_PATH);
	document.getElementById('R3_SETTINGS_RE3SLDE_PATH').innerHTML = R3_tools.fixPath(R3_SETTINGS.R3_RE3SLDE_PATH);
	document.getElementById('R3_SETTINGS_ENABLE_DISCORD').checked = R3_SETTINGS.SETTINGS_USE_DISCORD;
	document.getElementById('R3_SETTINGS_LIVESTATUS_POSITION').value = R3_SETTINGS.SETTINGS_LIVESTATUS_BAR_POS;
	document.getElementById('R3_SETTINGS_MOD_PATH').innerHTML = R3_MOD.path;
	document.getElementById('R3_SETTINGS_MOVE_CORNER').checked = R3_SETTINGS.SETTINGS_MOVE_WINDOW;
	document.getElementById('R3_SETTINGS_RE3_VERSION').value = R3_LIVESTATUS.currentMode;
	document.getElementById('R3_SETTINGS_LIVETSTATUS_FREQUENCY').innerHTML = R3_SETTINGS.RE3_LIVE_RENDER_TIME;
	document.getElementById('R3_SETTINGS_RANGE_LIVETSTATUS_FREQUENCY').value = R3_SETTINGS.RE3_LIVE_RENDER_TIME;
	document.getElementById('R3_SETTINGS_ENABLE_ANIMATIONS').checked = R3_SETTINGS.ENABLE_ANIMATIONS;
	document.getElementById('R3_SETTINGS_ENABLE_SHORTCUT_CLOSETOOL').checked = R3_SETTINGS.SETTINGS_SHORTCUT_CLOSETOOL;
	document.getElementById('R3_SETTINGS_ENABLE_STARTUP_SCREEN').checked = R3_SETTINGS.SETTINGS_ENABLE_MOVE_SCREEN;
	document.getElementById('R3_SETTINGS_MSG_DATABASE_MODE').value = R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE;
	document.getElementById('R3_SETTINGS_OPEN_LOG_STARTUP').checked = R3_SETTINGS.SETTINGS_OPEN_LOG_STARTUP;
	document.getElementById('R3_SETTINGS_SCD_LOG_WHILE_DECOMPILING').checked = R3_SETTINGS.SETTINGS_SCD_DECOMPILER_ENABLE_LOG;
	document.getElementById('R3_SETTINGS_SCD_LOG_SHOW_OPCODE_FUNCIONS').checked = R3_SETTINGS.SETTINGS_SCD_DECOMPILER_SHOWOPCODE;
	document.getElementById('R3_SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST').checked = R3_SETTINGS.SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST;
	document.getElementById('R3_SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST').checked = R3_SETTINGS.SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST;
	document.getElementById('R3_SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR').checked = R3_SETTINGS.SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR;
	document.getElementById('R3_SETTINGS_SCD_HOVER_FUNCTION_HEX').checked = R3_SETTINGS.SETTINGS_SCD_HOVER_FUNCTION_HEX;
	document.getElementById('R3_SETTINGS_SCD_SELECT_HEX_FUNCTION').checked = R3_SETTINGS.SETTINGS_SCD_SELECT_HEX_AS_TEXT;
	document.getElementById('R3_SETTINGS_SHOW_RECENT_POPUP').checked = R3_SETTINGS.SETTINGS_SHOW_LAST_FILE_OPENED_POPUP;
	document.getElementById('R3_SETTINGS_SCD_HEX_VIEW_SIZE').value = R3_SETTINGS.SETTINGS_SCD_HEXVIEW_FACTOR;
	document.getElementById('R3_SETTINGS_SCD_EDITOR_MODE').value = R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE;
	document.getElementById('R3_SETTINGS_DISABLE_LOG').checked = R3_SETTINGS.SETTINGS_DISABLE_LOG;
	document.getElementById('R3_SETTINGS_ENABLE_FULLSCREEN').checked = R3_SETTINGS.SETTINGS_ENABLE_FULLSCREEN;
	document.getElementById('R3_SETTINGS_eNGE_BIOS_PATH').innerHTML = R3_SETTINGS.SETTINGS_ENGE_BIOS_PATH;
	document.getElementById('R3_SETTINGS_ENGE_WIDTH').value = R3_SETTINGS.SETTINGS_ENGE_WIDTH_RES;
	document.getElementById('R3_SETTINGS_ENGE_HEIGHT').value = R3_SETTINGS.SETTINGS_ENGE_HEIGHT_RES;
	document.getElementById('R3_SETTINGS_OPEN_LOG_ON_WARN_ERROR').checked = R3_SETTINGS.SETTINGS_OPEN_LOG_ON_WARN_ERROR;
	document.getElementById('R3_SETTINGS_SCD_DISABLE_SHORTCUTS_NEXT_PREV').checked = R3_SETTINGS.SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS;
	document.getElementById('R3_SETTINGS_SCD_FOCUS_FUNCTION_CLICK').checked = R3_SETTINGS.SETTINGS_SCD_FOCUS_FUNCTION_CLICK;
	document.getElementById('R3_SETTINGS_SCD_JS_COMPILER_KEEP_FILE').checked = R3_SETTINGS.SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE;
	document.getElementById('R3_SETTINGS_SCD_SNAP_SEARCH_EDIT_FORM').checked = R3_SETTINGS.SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM;
	document.getElementById('SETTINGS_ENABLE_MOVE_DISPLAY_SELECT').value = R3_SETTINGS.SETTINGS_ENABLE_MOVE_SCREEN_ID;
	document.getElementById('R3_SETTINGS_DISPLAY_POS_INT').checked = R3_SETTINGS.SETTINGS_DISPLAY_POSITION_INT;
	document.getElementById('R3_SETTINGS_RE3MV_PATH').innerHTML = R3_tools.fixPath(R3_SETTINGS.R3_RE3MV_PATH);
	document.getElementById('R3_SETTINGS_RE3PLWE_PATH').innerHTML = R3_tools.fixPath(R3_SETTINGS.R3_RE3PLWE_PATH);
	document.getElementById('R3_SETTINGS_LIVESTATUS_DISCOVER').checked = R3_SETTINGS.SETTINGS_LIVESTATUS_ENABLE_GAME_DISCOVER;
	document.getElementById('R3_SETTINGS_DISABLE_ENGE').checked = R3_SETTINGS.SETTINGS_DISABLE_ENGE;
	document.getElementById('R3_SETTINGS_DISABLE_RDT_BACKGROUND').checked = R3_SETTINGS.SETTINGS_DISABLE_RDT_BACKGROUND;
};
/*
	Xdelta Patcher
*/
function R3_DESIGN_openXdeltaPatcher(){
	if (R3_SYSTEM.web.isBrowser === false){
		R3_MINIWINDOW.open(2, 'center');
	} else {
		R3_SYSTEM.web.webWarn();
	};
};
/*
	Cleaner
	Let's reset every tool!
*/
function R3_UTILS_CLEANTOOLS(){
	// Main Menu
	R3_DESIGN_CLEAN_MAINMENU();
	// Xdelta Patcher
	R3_DESIGN_CLEAN_XDELTA();
	// MSG Editor
	R3_DESIGN_CLEAN_MSG();
	// SCD Editor
	R3_DESIGN_CLEAN_SCD();
	// RDT Editor
	R3_DESIGN_CLEAN_RDT();
	// RID Editor
	R3_DESIGN_CLEAN_RID();
	// Item database miniwindow
	R3_DESIGN_CLEAN_ITEM_DATABASE();
};
function R3_DESIGN_CLEAN_ITEM_DATABASE(){
	document.getElementById('R3_ITEM_DATABASE_SEARCH').value = '';
	document.getElementById('R3_ITEM_DATABASE_TITLE').innerHTML = '';
	document.getElementById('R3_ITEM_DATABASE_DETAILS').innerHTML = '';
	document.getElementById('R3_ITEM_DATABASE_ICON').src = 'img/items/details/00.webp';
};
function R3_DESIGN_CLEAN_MAINMENU(){
	document.title = R3_SYSTEM.appTitle;
	document.getElementById('MAIN_HIDDEN_CANVAS').innerHTML = '';
};
function R3_DESIGN_CLEAN_XDELTA(){
	document.getElementById('R3_XDELTA_LBL_XFILE').innerHTML = 'No file selected';
	document.getElementById('R3_XDELTA_LBL_ORIGFILE').innerHTML = 'No file selected';
};
function R3_DESIGN_CLEAN_MSG(){
	document.getElementById('R3_MSG_EDIT_TEXTAREA').value = '';
	document.getElementById('R3_MSG_SCRIPT_LISTS').innerHTML = '';
	// Pre-refactor
	document.getElementById('R3_MSG_HEX_RAW').innerHTML = '';
	document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').value = '';
	document.getElementById('R3_MSG_LBL_hexLength').innerHTML = '00';
	document.getElementById('R3_MSG_MESSAGE_PREVIEW').innerHTML = '';
};
function R3_DESIGN_CLEAN_SCD(){
	R3_SCD_cancelFunctionEdit();
	TMS.css('R3_SCD_BTN_APPLYRDT', {'display': 'none'});
	document.getElementById('R3_SCD_HEX_RAW').innerHTML = '';
	document.getElementById('R3_SCD_SCRIPT_INNER').innerHTML = '';
	document.getElementById('R3_SCD_SCRIPT_LISTS').innerHTML = '';
	document.getElementById('R3_OPCODE_FINDER_SEARCH').value = '';
	document.getElementById('R3_SCD_ID_LIST_HOLDER').innerHTML = '';
	document.getElementById('R3_SCD_LBL_hexLength').innerHTML = '00';
	document.getElementById('R3_SCD_LBL_TOTALFUNCTIONS').innerHTML = '0';
	document.getElementById('R3_SCD_EDITFUNCTION_HOLDER').innerHTML = '';
	document.getElementById('R3_SCD_LBL_currentScript').innerHTML = 'INIT';
	document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_RESULT').innerHTML = '';
	document.getElementById('R3_LBL_SCD_SEARCH_FUNCTION_OPCODE').innerHTML = '';
};
function R3_DESIGN_CLEAN_RDT(){
	R3_DESIGN_RDT_openFileList();
	TMS.css('BTN_MAIN_27', {'display': 'none'});
	document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
};
function R3_DESIGN_CLEAN_RID(){
	document.getElementById('R3_RID_CAMERA_LIST_HOLDER').innerHTML = '';
};