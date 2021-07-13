/*
	R3ditor V2 - design.js
	Agora vai... ou não :/
*/
/*
	Main Vars
*/
var R3_HAS_CRITICAL_ERROR = false, R3_ENABLE_ANIMATIONS = false, R3_SYSTEM_LOG_RESET = false, R3_LOG_ID = 0, R3_LOG_COUNTER_INFO = 0, R3_LOG_COUNTER_WARN = 0, R3_LOG_COUNTER_ERROR = 0,
	// Menu Vars
	R3_MENU_HISTORY = [], R3_MENU_CURRENT = 4, R3_MENU_LOCK = false, R3_DESIGN_LOADING_ACTIVE = false, R3_LIVESTATUS_OPEN = false, R3_LIVESTATUS_FORCE_RENDER = false, R3_LIVESTATUS_RENDER_COUNTER = 0, R3_GET_BG = false, R3_THEPIC = '',
	// Funtion search list
	R3_INTERNAL_functionBtnArray = [], R3_INTERNAL_functionBtnScdArray = [],
	// RDT Menu Vars
	R3_RDT_FILELIST_MAPS = {}, R3_RDT_MENU_LABEL_FIX_NUMBER = 110, R3_DESIGN_RDT_LOADLOCK = false, APP_CAN_RENDER_DEV = true,
	// SCD Editor Vars
	R3_SCD_HIGHLIGHT_FUNCTION = 0, R3_SCD_SEARCH_HIGHLIGHT_FUNCTION = 0,
	// SCD JS Editor Vars
	R3_SCD_CODE_zoom = 12,
	// System display vars
	R3_SYSTEM_availableMonitors = 0,
	// RDT Path Vars
	R3_RDT_PREFIX_EASY = 'DATA_AJ', R3_RDT_PREFIX_HARD = 'DATA_E',
	// Mini window Active database
	R3_MINI_WINDOW_DATABASE_STATUS = [
		false, // R3V2 Log
		false, // MSG Hex View
		false, // Xdelta Patcher
		false, // SCD Hex View
		false, // SCD Script List
		false, // MSG List
		false, // RID Editor
		false, // MSG Hex Translator
		false, // SCD Preset Window
		false, // SCD Search Form
		false, // RDT Export Sections
		false, // R3V2 Help Center
		false, // SCD ID List
		false, // eNGE PS1 Canvas
		false, // SCD edit form
		false, // Item Database
		false, // RDT TIM Manager
		false, // RDT OBJ Manager
		false, // Backup Manager  
		false, // RE3 Livestatus
		false  // SCD DoorLink
	],
	// Mini Window Database
	R3_MINI_WINDOW_DATABASE = {
		/*
			Order:
			Width, Height, Top, Left, Z-index  Focus DOM element after opening
		*/
		0:  [670,  294,    68,  4,   9999999,  ''], 							  	 // R3V2 Log
		1:  [380,  178,    68,  4,    	 100,  ''], 							  	 // MSG Hex View
		2:  [700,  130,    68,  4,   9999998,  ''], 							  	 // Xdelta Patcher
		3:  [414,  310,    68,  4,    	 100,  ''], 							  	 // SCD Hex View
		4:  [210,  560,    68,  726,  	 101,  ''], 							  	 // SCD Script List
		5:  [232,  560,    68,  858,  	 101,  ''], 							  	 // MSG List
		6:  [860,  342,    68,  4,    	 100,  ''], 							  	 // RID Editor
		7:  [392,  178,    68,  768,  	 100,  ''], 							  	 // MSG Hex Translator
		8:  [300,  124,    68,  552,  	 104,  ''], 							  	 // SCD Preset Window
		9:  [300,  442,    68,  446,  	 103,  'R3_SCD_SEARCH_SCD_SCRIPT_INPUT'], 	 // SCD Search Form
		10: [200,  376,    68,  570,   	 101,  ''], 							  	 // RDT Export Sections
		11: [780,  294,    68,  4,    100000,  ''], 							  	 // R3V2 Help Center
		12: [540,  410,    226, 466,  	 102,  'R3_SCD_SEARCH_SCD_ID_OPCODE_INPUT'], // SCD ID List
		13: [640,  480,    68,  4,    999999,  'R3_PS1_DISPLAY'],					 // eNGE PS1 Canvas
		14: [760,  480,    68,  12,      105,  ''],									 // SCD edit form
		15: [400,  358,    68,  4, 	  999999,  'R3_ITEM_DATABASE_SEARCH'],			 // Item Database
		16: [220,  88,     68,  444, 	 101,  'R3_RDT_timManagerList'],			 // RDT TIM Manager
		17: [220,  88,     68,  486, 	 102,  'R3_RDT_objManagerList'],			 // RDT OBJ Manager
		18: [680,  434,    68,  4, 	 9999998,  ''],									 // Backup Manager
		19: [1100, 620,    68,  4, 	 9999998,  ''], 								 // RE3 Livestatus
		20: [416,  482,    68,  4, 		 105,  'R3_SCD_DOORLINK_MAP_INPUT']			 // SCD DoorLink
	};
/*
	Main Consts
*/
const R3_MENU_BACK_EXCLUDE = [0, 2, 8],
	// Design Consts
	R3_ICON_maxIcons = 100, R3_MINI_WINDOW_maxWindows = 100, R3_TOTAL_MENUS = 20,
	// Tab Index
	R3_TABS_INDEX = {
		0: 1, // RE3 Livestatus
		1: 2  // SCD Id List
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
	if (APP_ON_BOOT === false && R3_HAS_CRITICAL_ERROR === false){
		if (window.innerWidth < 1216 && window.innerHeight < 711){
			$('#R3_SPLASH').css({'display': 'none'});
			$('#R3_APP_HOLDER').css({'display': 'none'});
			$('#R3_APP_MAIN_DIV').css({'display': 'inline'});
			document.getElementById('R3_MAIN_LOADING_DIV').innerHTML = INCLUDE_R3V2_LOWRES;
		} else {
			$('#R3_APP_HOLDER').css({'display': 'inline'});
			$('#R3_APP_MAIN_DIV').css({'display': 'none'});
		};
	};
};
// Spawn Critial Error
function R3_DESIGN_CRITIAL_ERROR(args){
	if (args !== undefined && args !== ''){
		var fError = args;
		R3_HAS_CRITICAL_ERROR = true;
		$('#R3_SPLASH').css({'display': 'none'});
		$('#R3_APP_HOLDER').css({'display': 'none'});
		$('#R3_MAIN_LOADING_DIV').css({'display': 'none', 'box-shadow': '0px 0px 100px #f00'});
		if (R3_ENABLE_ANIMATIONS === false){
			$('#R3_APP_MAIN_DIV').css({'display': 'inline'});
			$('#R3_MAIN_LOADING_DIV').css({'display': 'inline'});
		} else {
			$('#R3_APP_MAIN_DIV').fadeIn({duration: 200, queue: false});
			setTimeout(function(){
				$('#R3_MAIN_LOADING_DIV').slideDown({duration: 200, queue: false});
			}, 200);
		};
		if (args.stack !== undefined){
			fError = args.stack;
		};
		document.getElementById('R3_MAIN_LOADING_DIV').innerHTML = INCLUDE_R3V2_CRITICAL_ERROR;
		document.getElementById('R3_ERROR_CRITICAL_REASON').innerHTML = fError;
	};
};
// Append data
function R3_INIT_APPEND(){
	try {
		var c = 0, BOX_ITEM_32 = HTML_TEMPLATE = '';
		// Append displays
		while (c < R3_SYSTEM_availableMonitors){
			HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + c + '">Display ' + (c + 1) + '</option>';
			c++;
		};
		document.getElementById('SETTINGS_ENABLE_MOVE_DISPLAY_SELECT').innerHTML = HTML_TEMPLATE;
		c = 0;
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
		document.getElementById('ABOUT_manyThanks_DIV').innerHTML = '<font class="ABOUT_manyThanks_LBL">Many Thanks to</font>:<br><br>' + INCLUDE_ABOUT_THX + INCLUDE_ABOUT_SNIPPETS + INCLUDE_ENDING;
		// Append RE3 Livestatus Item Box
		while (c < 64){
			if (c === 32){
				BOX_ITEM_32 = 'R3_LIVESTATUS_BOX_ITEM_MIDDLE';
			} else {
				BOX_ITEM_32 = '';
			};
			HTML_TEMPLATE = HTML_TEMPLATE + '\n<div class="R3_LIVESTATUS_BOX_ITEM ' + BOX_ITEM_32 + '" id="R3_LIVESTATUS_BOX_ITEM_' + c + '">' + 
							'<img src="img/items/00.png" id="R3_LIVESTATUS_BOX_IMG_' + c + '"><div id="R3_LIVESTATUS_BOX_ITEM_QT_' + c + '" class="R3_LIVESTATUS_BOX_ITEM_QT">0</div>' + 
							'<div class="R3_LIVESTATUS_BOX_ITEM_LBL" id="R3_LIVESTATUS_BOX_ITEM_LBL_' + c + '">(<font class="monospace mono_xyzr">' + MEMORY_JS_fixVars(c, 2) + '</font>) ' +
							'Empty Slot</div><input type="button" value="Edit" class="R3_LIVESTATUS_BOX_EDIT_BTN" onclick="R3_LIVESTATUS_EDIT_ITEMBOX(' + c + ');"></div>';
			c++;
		};
		document.getElementById('R3_LIVESTATUS_BOX_HOLDER').innerHTML = HTML_TEMPLATE;
		// App Version
		document.getElementById('ABOUT_LBL_R3_VERSION').innerHTML = INT_VERSION;
		if (R3_WEBMODE === false){
			document.getElementById('ABOUT_LBL_NW_VERSION').innerHTML = process.versions['node-webkit'] + ' (' + process.arch + ')';
		} else {
			document.getElementById('ABOUT_LBL_NW_VERSION').innerHTML = 'Web Version';
		};
		// Array for Search Fields
		if (APP_ON_BOOT === true){
			R3_DESIGN_prepareBtnArray();
		};
		// Add MSG titles
		c = 0;
		while (c < Object.keys(MSG_functionTypes).length){
			if (document.getElementById('R3_MSG_fnTtitle_' + c) !== null){
				document.getElementById('R3_MSG_fnTtitle_' + c).title = MSG_functionTypes[c][2];
			};
			c++;
		};
	} catch (err) {
		APP_CAN_START = false;
		R3_SYSTEM_LOG('error', 'ERROR: Unable to append main data! [R3_INIT_APPEND] <br>Reason: ' + err);
		if (APP_ON_BOOT === true){
			R3_INIT_ERROR('ERROR: Unable to append main data! [R3_INIT_APPEND] <br>Reason: ' + err);
		} else {
			R3_SYSTEM_ALERT('ERROR: Unable to append main data! [R3_INIT_APPEND]\nReason: ' + err);
		};
	};
};
// Show Menu
function R3_SHOW_MENU(menuId){
	if (R3_MENU_LOCK !== true && R3_HAS_CRITICAL_ERROR === false){
		if (menuId !== R3_MENU_CURRENT){
			var c = 0;
			if (menuId === undefined){
				menuId = 4;
			};
			R3_MENU_CURRENT = menuId;
			// Clear extra renderer
			clearInterval(FG_EXTRA_RENDER);
			while (c < (R3_TOTAL_MENUS + 1)){
				$('#MENU_' + c).css({'display': 'none'});
				c++;
			};
			/*
				Special adjusts
			*/
			// About Page [BG]
			if (menuId === 1){
				if (RE3_RUNNING === true){
					R3_LIVESTATUS_CLOSE_BAR();
				};
				R3_DESIGN_MINIWINDOW_CLOSE(0);
				$('#R3_MENU_MAIN_TOP').css({'display': 'none'});
				$('#MENU_1').css({'height': '100%', 'top': '0px'});
				$('#ABOUT_BG').fadeIn({duration: 21000, queue: false});
			} else {
				if (RE3_RUNNING === true){
					R3_LIVESTATUS_OPEN_BAR();
				};
				if (menuId !== 2){
					$('#R3_MENU_MAIN_TOP').css({'display': 'inline-flex'});
				};
			};
			// MSG Editor
			if (menuId === 7){
				if (RDT_arquivoBruto !== undefined){
					$('#BTN_MAIN_32').css({'display': 'inline-flex'});
				} else {
					$('#BTN_MAIN_32').css({'display': 'none'});
				};
			};
			// SCD Editor
			if (menuId === 9){
				R3_DESIGN_MINIWINDOW_CLOSE(3);
				R3_DESIGN_MINIWINDOW_CLOSE(12);
				// Fix Scroll
				document.getElementById('SCD_FUNCTION_LIST').scrollTop = 0;
				document.getElementById('R3_SCD_SCRIPT_INNER').scrollTop = 0;
				if (SCD_arquivoBruto !== undefined){
					R3_DESIGN_SCD_openScriptList();
					setTimeout(function(){
						document.getElementById('R3_SCD_SCRIPT_LISTS').scrollTop = 0;
						document.getElementById('SCD_FUNCTION_SEARCH_FIELD').focus();
					}, 40);
				};
				// Generate new SCD file if empty
				if (SCD_arquivoBruto === undefined){
					R3_SCD_NEW_FILE();
				};
			};
			// RDT Editor
			if (menuId === 10){
				if (R3_WEBMODE === true){
					$('#R3_RDT_FILELIST').css({'display': 'none'});
					$('#R3_RDT_IMPORT_RDT').css({'display': 'none'});
				} else {
					$('#R3_PAGE_ICON_BG_7').css({'display': 'none'});
				};
				document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
				R3_RDT_FILELIST_UPDATELIST();
				setTimeout(function(){
					document.getElementById('R3_RDT_FILELIST_SERACH').focus();
				}, 50);
				if (RDT_arquivoBruto !== undefined){
					document.title = APP_TITLE + ' - RDT Editor - File: ' + R3_RDT_mapName + '.RDT';
				};
			} else {
				R3_DESIGN_closeAllRdtMiniWindows();
			};
			// Main Menu
			if (menuId !== 4){
				R3_DESIGN_OPEN_CLOSE_LATEST(1);
				$('#BTN_MAIN_53').css({'display': 'none'});
				$('#MENU_' + menuId).css({'display': 'block'});
				$('#R3_MENU_MAIN_TOP_EXEC_GAME_DIV').css({'right': '268px'});
				// RE3 Scroll
				if (menuId === 8){
					document.getElementById('R3_LIVESTATUS_BOX_ITEM_LBL_26').scrollIntoView();
				};
			} else {
				if (R3_WEBMODE === false && R3_THEPIC === 'R50606.JPG'){
					R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', 'BEEP. BEEP. BOOP. BEBOBEBOBIIIIIP... BOOP!\n\nI see you got a good RNG here!\n\nTheMitoSan!', 'RE3', 40);
				};
				$('#R3_MENU_MAIN_TOP_EXEC_GAME_DIV').css({'right': '302px'});
				$('#BTN_MAIN_53').css({'display': 'inline-flex'});
				$('#BTN_SCD_HACK').css({'display': 'none'});
				R3_DESIGN_OPEN_CLOSE_LATEST(0);
			};
			// Loading screen
			if (menuId === 2){
				R3_DESIGN_MINIWINDOW_CLOSE(0);
				R3_DESIGN_MINIWINDOW_CLOSE(2);
				R3_DESIGN_MINIWINDOW_CLOSE(15);
				R3_DESIGN_MINIWINDOW_CLOSE(11);
			};
			R3_DESIGN_CHECK_SHOW_EXECS();
			// Append dropdown menu
			if (R3_DESIGN_DROPDOWN_DATABASE[menuId][0] !== 'NO_DROPDOWN'){
				document.getElementById('R3_MENU_CURRENT_TOOL_HOLDER').innerHTML = R3_DESIGN_DROPDOWN_DATABASE[menuId][1];
				$('#R3_MENU_CURRENT_TOOL_HOLDER').css({'min-width': R3_DESIGN_DROPDOWN_DATABASE[menuId][2] + 'px'});
				document.getElementById('R3_MENU_DROPDOWN_LBL').innerHTML = R3_DESIGN_DROPDOWN_DATABASE[menuId][0];
				$('#R3_MENU_CURRENT_TOOL').css({'display': 'inline-block'});
			} else {
				$('#R3_MENU_CURRENT_TOOL').css({'display': 'none'});
			};
			/*
				End
			*/
			//console.info('DESIGN - GOTO Menu ' + menuId + ' (' + R3_DISC_MENUS[menuId][0] + ')');
			R3_DISC_setActivity(R3_DISC_MENUS[menuId][0], R3_DISC_MENUS[menuId][1]);
			document.getElementById('MAIN_HIDDEN_CANVAS').innerHTML = '';
			R3_DESIGN_MINIWINDOW_CLOSE(11);
			R3_MENU_HISTORY.push(menuId);
			R3_WEB_ALERT();
		};
	};
};
// Disable PC version exec buttons if emu
function R3_DESIGN_CHECK_SHOW_EXECS(){
	if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === true){
		$('#R3_MENU_RUN_GAME').css({'display': 'none'});
	} else {
		$('#R3_MENU_RUN_GAME').css({'display': 'inline-block'});
	};
};
// Web Alert
function R3_WEB_ALERT(){
	if (APP_CAN_RENDER_DEV === true && R3_WEBMODE === true){
		R3_FILEGEN_selectTextColor(0);
		R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', 'You are running R3ditor V2 web version!\nTo have all features (Like RE3 Livestatus, Previews, ARD Extractor and more), download the local version!\n\nVisit https://themitosan.github.io/ to get download link.', 'RE1', 10);
	};
};
// Menu Navigation
function R3_MENU_GOBACK(){
	R3_DESIGN_CHECK_SHOW_EXECS();
	if (R3_MENU_LOCK !== true){
		if (R3_MENU_HISTORY.length === 1){
			$('#MENU_' + R3_MENU_HISTORY[0]).css({'display': 'none'});
			R3_SHOW_MENU(4);
		} else {
			var check = R3_MENU_BACK_EXCLUDE.indexOf(R3_MENU_HISTORY[(R3_MENU_HISTORY.length - 2)]);
			$('#MENU_' + R3_MENU_HISTORY[(R3_MENU_HISTORY.length - 1)]).css({'display': 'none'});
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
// Show Tabs
function R3_DESIGN_SHOWTABS(tabIndex, id){
	var c = 0, maxTabs = R3_TABS_INDEX[tabIndex];
	if (maxTabs !== undefined){
		while (c < (maxTabs + 1)){
			$('#R3_MENU_' + tabIndex + '_' + c).css({'display': 'none'});
			$('#R3_TABS_' + tabIndex + '_' + c).removeClass('R3_TAB_SELECT');
			c++;
		};
		$('#R3_MENU_' + tabIndex + '_' + id).css({'display': 'block'});
		$('#R3_TABS_' + tabIndex + '_' + id).addClass('R3_TAB_SELECT');
	};
};
// Adjust Design
function R3_DESIGN_ADJUST(){
	// Load settings changes
	R3_DESIGN_processSettingsChanges();
	// Add icons to buttons and bg
	var c = e = 0, cMiniWindow, thePic;
	while (c < (R3_ICON_maxIcons + 1)){
		if (document.getElementById('BTN_MAIN_' + c) !== null){
			$('#BTN_MAIN_' + c).css({'background-image': 'url(\'./img/icons/icon-' + c + '.png\')'});
			if (document.getElementById('R3_PAGE_ICON_BG_' + c) !== null){
				$('#R3_PAGE_ICON_BG_' + c).css({'background-image': 'url(\'./img/icons/icon-' + c + '.png\')'});
			};
		}
		c++;
	};
	// Init mini windows
	c = 0;
	while (c < (R3_MINI_WINDOW_maxWindows + 1)){
		cMiniWindow = document.getElementById('R3V2_MINI_WINDOW_' + c);
		if (cMiniWindow !== null){
			R3_DESIGN_enableDragElement('R3V2_MINI_WINDOW_' + c);
		}
		c++;
	};
	// Prepare SCD editor
	R3_SCD_SWAP_EDITOR_MODE(SETTINGS_SCD_EDITOR_MODE);
	// Adjust loading div
	if (R3_ENABLE_ANIMATIONS === true){
		$('#R3_MAIN_LOADING_DIV').animate({'width': '70%'}, {duration: 1200, queue: false});
	} else {
		$('#R3_MAIN_LOADING_DIV').css({'width': '70%'});
	};
	// Disable export button
	R3_DESIGN_DISABLE_BTN('BTN_MOD_EXPORT');
	// [RE3SET] - Disable WIP Forms
	R3_DESIGN_DISABLE_BTN('BTN_MAIN_21');
	R3_DESIGN_DISABLE_BTN('BTN_MAIN_58');
	R3_DESIGN_DISABLE_BTN('BTN_MAIN_59');
	R3_DESIGN_DISABLE_BTN('BTN_MAIN_60');
	R3_DESIGN_DISABLE_BTN('BTN_MAIN_61');
	// Fix RDT Path Labels and disable some unused functions in non-windows os / web
	if (R3_WEBMODE === false){
		$('#SETTINGS_LI_CLEARCACHE').css({'display': 'none'});
		if (process.platform !== 'win32'){
			R3_RDT_MENU_LABEL_FIX_NUMBER = 124;
			// Buttons
			R3_DESIGN_DISABLE_BTN('BTN_MAIN_11');
			R3_DESIGN_DISABLE_BTN('BTN_MAIN_12');
			R3_DESIGN_DISABLE_BTN('BTN_MAIN_14');
		} else {
			R3_RDT_MENU_LABEL_FIX_NUMBER = 104;
		};
		// Get random image for main bg
		if (R3_GET_BG === false){
			if (APP_ENABLE_MOD === true){
				var getFiles = APP_FS.readdirSync(APP_PATH + '/Assets/DATA_A/BSS/');
				while (e < getFiles.length){
					if (getFiles[e].indexOf('SLD') !== -1){
						getFiles.splice(e, 1);
					} else {
						e++;
					};
				};
				thePic = Math.floor(Math.random() * Math.floor(getFiles.length)), fileFix = '';
				if (APP_useImageFix === true){
					fileFix = 'file://';
				};
				document.getElementById('R3_HOME_BG').src = fileFix + APP_PATH + '/Assets/DATA_A/BSS/' + getFiles[thePic];
				R3_THEPIC = getFiles[thePic];
				if (R3_THEPIC === 'R50606.JPG'){
					R3_FILEGEN_RENDER_EXTERNAL('MAIN_HIDDEN_CANVAS', INCLUDE_RE3_BEEP_BOOP, 'RE3', 40);
				};
				if (R3_ENABLE_ANIMATIONS === true){
					$('#R3_HOME_BG').fadeIn({duration: 7100, queue: false});
				} else {
					$('#R3_HOME_BG').css({'display': 'inline'});	
				};
				// End
				R3_GET_BG = true;
			} else {
				$('#R3_HOME_BG').css({'display': 'none'});
			};
		};
	} else {
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_BACKUP');
		// Hide NW settings if web mode
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_15');
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_16');
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_33');
		$('#BTN_MOD_EXPORT').css({'display': 'none'});
		$('#SETTINGS_DIV_ENGE').css({'display': 'none'});
		$('#SETTINGS_DIV_PATHS').css({'display': 'none'});
		$('#SETTINGS_LI_DISCORD').css({'display': 'none'});
		$('#SETTINGS_LI_MOVEWINDOW').css({'display': 'none'});
		$('#SETTINGS_DIV_GAME_MODE').css({'display': 'none'});
		$('#SETTINGS_DIV_LIVESTATUS').css({'display': 'none'});
		$('#SETTINGS_LI_RECENTPOPUP').css({'display': 'none'});
		$('#R3_FILEGEN_BACKGROUND_DIV').css({'display': 'none'});
		$('#SETTINGS_LI_UPDATE_DOORLINK').css({'display': 'none'});
		$('#SETTINGS_LI_ENABLE_MOVE_DISPLAY').css({'display': 'none'});
		// Hide about nw version
		$('#DIV_ABOUT_NW').css({'display': 'none'});
		// Fix Number
		R3_RDT_MENU_LABEL_FIX_NUMBER = 124;
		// Buttons
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_11');
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_12');
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_14');
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_55');
		// Remove big preview on file generator
		$('#R3_FILEGEN_RENDERAREA_BIG').css({'display': 'none'});
		// Run Game Buttons
		$('#R3_MENU_MAIN_TOP_EXEC_GAME_DIV').css({'display': 'none !important'});
		// Adjust some ranges if firefox
		if (R3_WEB_IS_FOX === true){
			// Fix log window on Firefox
			R3_MINI_WINDOW_DATABASE[0][0] = 800;
			$('#R3_RID_EDIT_rangePosX').css({'width': '120px'});
			$('#R3_RID_EDIT_rangePosY').css({'width': '120px'});
			$('#R3_RID_EDIT_rangePosZ').css({'width': '120px'});
			$('#R3_RID_EDIT_rangePosR').css({'width': '120px'});
		};
	};
	// Fix percentage design
	R3_LIVESTATUS_OPEN_BAR();
	setTimeout(function(){
		R3_LIVESTATUS_CLOSE_BAR();
	}, 10);
};
// Enable and Disable Elements
function R3_DESIGN_ENABLE_BTN(id){
	if (document.getElementById(id) !== null){
		document.getElementById(id).disabled = '';
		$('#' + id).css({'filter': 'grayscale(0) blur(0px)', 'cursor': 'pointer', 'opacity': '1'});	
	};
};
function R3_DESIGN_DISABLE_BTN(id){
	if (document.getElementById(id) !== null){
		document.getElementById(id).disabled = 'disabled';
		$('#' + id).css({'filter': 'grayscale(1) blur(0.8px)', 'cursor': 'not-allowed', 'opacity': '0.6'});
	};
};
/*
	Toggle fullscreen modes
	Mode:

	0 = Enter
	1 = Leave
*/
function R3_DESIGN_toggleFullScreen(mode){
	if (mode === 0){
		if (R3_WEBMODE === false){
			require('nw.gui').Window.get().enterFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		};
	} else {
		if (R3_WEBMODE === false){
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
	if (APP_CAN_START === true){
		// Check fullscreen
		if (SETTINGS_ENABLE_FULLSCREEN === true){
			R3_DESIGN_toggleFullScreen(0);
		} else {
			R3_DESIGN_toggleFullScreen(1);
		};
		// Get random character icon
		var getRandomPlr = parseInt(Math.floor(Math.random() * 2) + 1);
		if (getRandomPlr === 0 || getRandomPlr > 2){
			getRandomPlr = 1;
		};
		$('#R3_SPLASH_BG').css({'background-image': 'url(\'./img/PLR_0' + getRandomPlr + '.png\')'});
		// Animation
		if (R3_ENABLE_ANIMATIONS === true){
			$('#R3_SPLASH').fadeIn({duration: 400, queue: false});
			$('#R3_SPLASH_TITLE').fadeIn({duration: (R3_internalHoldTime / 4), queue: false});
			$('#R3_SPLASH_TITLE').animate({'left': '26%'}, {duration: (R3_internalHoldTime * 1.1), queue: false});
			$('#R3_SPLASH_BG').animate({'background-position-x': 'calc(100% + 110px)'}, {duration: (R3_internalHoldTime * 1.1), queue: false});
			// Frame Anim
			$('#R3_SPLASH_BG_FRAME_TOP').fadeIn({duration: R3_internalHoldTime / 2, queue: false});
			$('#R3_SPLASH_BG_FRAME_BOTOM').fadeIn({duration: R3_internalHoldTime / 2, queue: false});
			// End
			$('#R3_SPLASH_BG').fadeIn({duration: (R3_internalHoldTime * 1.1), queue: false});
			$('#R3_SPLASH_thanks').fadeIn({duration: (R3_internalHoldTime / 4), queue: false});
			$('#R3_SPLASH_BG_BIG').fadeIn({duration: (R3_internalHoldTime * 1.2), queue: false});
		} else {
			$('#R3_SPLASH_TITLE').css({'display': 'inline'});
			// Frame
			$('#R3_SPLASH_BG_FRAME_TOP').css({'display': 'inline'});
			$('#R3_SPLASH_BG_FRAME_BOTOM').css({'display': 'inline'});
			$('#R3_SPLASH_BG').css({'display': 'inline', 'background-position-x': 'calc(100% + 110px)'});
			// End
			$('#R3_SPLASH_thanks').css({'display': 'inline'});
			$('#R3_SPLASH_BG_BIG').css({'display': 'inline'});
			$('#R3_SPLASH').css({'display': 'inline'});
		};
		setTimeout(function(){
			$('#R3_APP_HOLDER').css({'display': 'inline'});
			$('#R3_APP_MAIN_DIV').css({'display': 'none'});
			R3_DESIGN_OPEN_CLOSE_LATEST(0);
			APP_ON_BOOT = false;
			R3_LOAD_CHECK_EXTRA();
		}, R3_internalHoldTime);
	};
};
// Show Interface
function R3_DESIGN_SHOW_INTERFACE(){
	if (APP_ON_BOOT === false){
		if (R3_ENABLE_ANIMATIONS === true){
			$('#R3_APP_MAIN_DIV').fadeOut({duration: 100, queue: false});
		} else {
			$('#R3_APP_MAIN_DIV').css({'display': 'none'});
		};
		R3_MENU_CURRENT = 4;
	} else {
		R3_RELOAD();
	};
};
/*
	R3_SYSTEM_PROMPT
	Prompt replace
*/
function R3_SYSTEM_PROMPT(txt){
	var res = window.prompt(txt);
	R3_KEYPRESS_releaseKeys();
	return res;
};
/*
	R3_SYSTEM_CONFIRM
	Confirm replace
*/
function R3_SYSTEM_CONFIRM(conf){
	var res = window.confirm(conf);
	R3_KEYPRESS_releaseKeys();
	return res;
};
/*
	R3_SYSTEM_ALERT
	Alert system 
*/
function R3_SYSTEM_ALERT(msg){
	if (msg !== undefined){
		window.alert(msg);
		R3_KEYPRESS_releaseKeys();
	};
};
/*
	R3_SYSTEM_LOG
	Log system
*/
function R3_SYSTEM_LOG(mode, text){
	var lastLog, HTML_LOG_TEMPLATE = logCSS = textClean = '', canLog = true,
		defaultCheck = [undefined, '', 'log', 'ok', 'info'];
	if (text === undefined){
		text = '';
	};
	if (R3_SYSTEM_LOG_RESET === true){
		document.getElementById('R3_LOG_HOLDER').innerHTML = '';
		R3_SYSTEM_LOG_RESET = false;
	} else {
		textClean = R3_removeHtmlFromString(text);
	};
	// Avoid eNGE null messages
	if (textClean === 'R3ditor V2 - INFO: (eNGE) \n'){
		textClean = text = '';
		canLog = false;
	};
	lastLog = document.getElementById('R3_LOG_ID_N_' + (R3_LOG_ID - 1));
	if (lastLog !== null){
		if (lastLog.className === 'SEPARATOR-3' && mode === 'separator'){
			canLog = false;
		};
	};
	/*
		Final checks
	*/
	if (canLog === true){
		if (defaultCheck.indexOf(mode) !== -1){
			logCSS = 'R3_LOG_OK';
			R3_LOG_COUNTER_INFO++;
		};
		if (mode === 'warn'){
			if (SETTINGS_OPEN_LOG_ON_WARN_ERROR === true){
				R3_DESIGN_MINIWINDOW_OPEN(0);
			};
			console.warn(textClean);
			logCSS = 'R3_LOG_WARN';
			R3_LOG_COUNTER_WARN++;
		};
		if (mode === 'error'){
			if (SETTINGS_OPEN_LOG_ON_WARN_ERROR === true){
				R3_DESIGN_MINIWINDOW_OPEN(0);
			};
			console.error(textClean);
			logCSS = 'R3_LOG_ERROR';
			R3_LOG_COUNTER_ERROR++;
		};
		if (mode === 'separator'){
			textClean = SYSTEM_LOG_SEPARATOR_TEXT;
			HTML_LOG_TEMPLATE = '<div id="R3_LOG_ID_N_' + R3_LOG_ID + '" class="SEPARATOR-3"></div>';
		} else {
			HTML_LOG_TEMPLATE = '<div id="R3_LOG_ID_N_' + R3_LOG_ID + '" class="R3_LOG_ITEM ' + logCSS + '">' + text + '</div>';
		};
		// End
		$('#R3_LOG_HOLDER').append(HTML_LOG_TEMPLATE);
		R3_SYSTEM_LOG_TEXT = R3_SYSTEM_LOG_TEXT + textClean + '\n';
		R3_LOG_ID++;
		document.getElementById('R3V2_TITLE_LOG_WINDOW').innerHTML = 'R3ditor V2 Log <i>[' + R3_LOG_COUNTER_INFO + ' Infos, ' + R3_LOG_COUNTER_WARN + ' Warns and ' + R3_LOG_COUNTER_ERROR + ' Errors]</i>';
		document.getElementById('R3_LOG_HOLDER').scrollTop = document.getElementById('R3_LOG_HOLDER').scrollHeight;
	};
};
// Clear Log
function R3_SYSTEM_CLEAR_LOG(){
	R3_SYSTEM_LOG_TEXT = '';
	R3_LOG_ID = R3_LOG_COUNTER_INFO = R3_LOG_COUNTER_WARN = R3_LOG_COUNTER_ERROR = 0;
	document.getElementById('R3_LOG_HOLDER').innerHTML = '';
	R3_SYSTEM_LOG('log', 'R3ditor V2 - The log was cleared');
	R3_SYSTEM_LOG('separator');
	console.clear();
};
/*
	Open / Close Mini Window
*/
// Open Mini Window
function R3_DESIGN_MINIWINDOW_OPEN(windowId, mode){
	// console.info('Window ID: ' + windowId + ' - ' + R3_MINI_WINDOW_DATABASE_STATUS[windowId]);
	if (R3_MINI_WINDOW_DATABASE[windowId] !== undefined){
		var focusDomName, scrollSize, fixLeft = '792px';
		// Close all Mini-Windows if RDT editor is active
		if (R3_MENU_CURRENT === 10){
			R3_DESIGN_closeAllRdtMiniWindows();
		};
		if (R3_MENU_CURRENT !== 1 && R3_MINI_WINDOW_DATABASE_STATUS[windowId] === false){
			if (windowId !== 0 && windowId !== 11){
				// SCD Hex View
				if (windowId === 3){
					$('#R3V2_MINI_WINDOW_' + windowId).css({
						'display': 'block',
						'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
						'top': R3_MINI_WINDOW_DATABASE[windowId][2] + 'px',
						'left': R3_MINI_WINDOW_DATABASE[windowId][3] + 'px',
						'width': (R3_MINI_WINDOW_DATABASE[windowId][0] * SETTINGS_SCD_HEXVIEW_FACTOR) + 'px',
						'height': (R3_MINI_WINDOW_DATABASE[windowId][1] * SETTINGS_SCD_HEXVIEW_FACTOR) + 'px'
					});
				} else {
					$('#R3V2_MINI_WINDOW_' + windowId).css({
						'display': 'block',
						'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
						'top': R3_MINI_WINDOW_DATABASE[windowId][2] + 'px',
						'left': R3_MINI_WINDOW_DATABASE[windowId][3] + 'px',
						'width': R3_MINI_WINDOW_DATABASE[windowId][0] + 'px',
						'height': R3_MINI_WINDOW_DATABASE[windowId][1] + 'px'
					});
				};
			} else {
				if (R3_WEB_IS_FOX === true){
					fixLeft = '872px';
				};
				$('#R3V2_MINI_WINDOW_' + windowId).css({
					'display': 'block',
					'top': 'calc(100% - 342px)',
					'left': 'calc(100% - ' + fixLeft + ')',
					'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
					'width': R3_MINI_WINDOW_DATABASE[windowId][0] + 'px',
					'height': R3_MINI_WINDOW_DATABASE[windowId][1] + 'px'
				});
				scrollSize = document.getElementById('R3_LOG_HOLDER').scrollHeight;
				document.getElementById('R3_LOG_HOLDER').scrollTop = scrollSize;
			};
			// R3V2 Help Center
			if (windowId === 11){
				$('#R3V2_MINI_WINDOW_' + windowId).css({
					'display': 'block',
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
				$('#R3V2_MINI_WINDOW_' + windowId).css({
					'display': 'block',
					'width': SETTINGS_ENGE_WIDTH_RES + 'px',
					'height': SETTINGS_ENGE_HEIGHT_RES + 'px',
					'z-index': R3_MINI_WINDOW_DATABASE[windowId][4],
					'top': R3_MINI_WINDOW_DATABASE[windowId][2] + 'px',
					'left': R3_MINI_WINDOW_DATABASE[windowId][3] + 'px'
				});
			};
		};
		// Focus element
		focusDomName = R3_MINI_WINDOW_DATABASE[windowId][5];
		if (focusDomName !== '' && document.getElementById(focusDomName) !== null){
			setTimeout(function(){
				document.getElementById(R3_MINI_WINDOW_DATABASE[windowId][5]).focus();
			}, 20);
		};
		// Close DoorLink if SCD Search Form
		if (windowId === 9){
			R3_DESIGN_MINIWINDOW_CLOSE(20);
		};
		// Disable shortcuts if eNGE is opened
		if (windowId === 13){
			eNGE_FOCUS();	
		};
		// Adjust window size if SCD edit form
		if (windowId === 14 && R3_SCD_DATABASE[R3_SCD_currentOpcode] !== undefined){
			$('#R3V2_MINI_WINDOW_' + windowId).css({'width': R3_SCD_DATABASE[R3_SCD_currentOpcode][6] + 'px', 'height': R3_SCD_DATABASE[R3_SCD_currentOpcode][7] + 'px'});
			R3_DESIGN_adjustMiniWindowForm();
		};
		// Process opening mode
		if (mode !== undefined && R3_MINI_WINDOW_DATABASE_STATUS[windowId] === false){
			// Center Screen
			if (mode === 'center'){
				var windowW = window.innerWidth,
					windowH = window.innerHeight,
					formW = document.getElementById('R3V2_MINI_WINDOW_' + windowId).offsetWidth,
					formH = document.getElementById('R3V2_MINI_WINDOW_' + windowId).offsetHeight,
					finalW = ((windowW / 2) - (formW / 2)),
					finalH = ((windowH / 2) - (formH / 2));
				// End
				$('#R3V2_MINI_WINDOW_' + windowId).css({'left': finalW + 'px', 'top': finalH + 'px'});
			};
		};
		/*
			End
		*/
		R3_MINI_WINDOW_DATABASE_STATUS[windowId] = true;
	} else {
		R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to open window! <br>Reason: Window ID does not exist!');
	};
};
// Adjust miniwindow if are SCD Edit Form (Advanced stuff)
function R3_DESIGN_adjustMiniWindowForm(){
	// Adjust window size on Set Interactive Object [AOT_SET]
	if (R3_SCD_currentOpcode === '63'){
		var cType = document.getElementById('R3_SCD_EDIT_63_aot').value;
		if (cType === '04'){
			$('#R3V2_MINI_WINDOW_14').css({'height': '380px'});
		} else {
			$('#R3V2_MINI_WINDOW_14').css({'height': '260px'});
		};
	};
};
// Close all miniwindows from RDT editor
function R3_DESIGN_closeAllRdtMiniWindows(){
	R3_DESIGN_MINIWINDOW_CLOSE(6);
	R3_DESIGN_MINIWINDOW_CLOSE(10);
	R3_DESIGN_MINIWINDOW_CLOSE(16);
	R3_DESIGN_MINIWINDOW_CLOSE(17);
	// SCD Editor
	R3_DESIGN_MINIWINDOW_CLOSE(9);
	R3_DESIGN_MINIWINDOW_CLOSE(20);
};
// Close Mini Window
function R3_DESIGN_MINIWINDOW_CLOSE(windowId){
	// Give R3ditor V2 shortcuts again!
	if (windowId === 13){
		eNGE_LOST_FOCUS();
	};
	// Last file opened fix
	if (R3_MENU_CURRENT === 4 && SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
		R3_DESIGN_OPEN_CLOSE_LATEST(0);
	};
	// Help Center
	var checkButton = document.getElementById('R3V2_MINI_WINDOW_MAXIMIZE_' + windowId);
	if (checkButton !== null){
		$('#R3V2_MINI_WINDOW_MAXIMIZE_' + windowId).css({'display': 'inline'});
	};
	// Clear Log fix
	if (windowId === 0){
		$('#R3V2_MINI_WINDOW_CLEAR_LOG').css({'right': '105px'});
	};
	// Clear Item database
	if (windowId === 15){
		R3_DESIGN_CLEAN_ITEM_DATABASE();
	};
	// End
	R3_MINI_WINDOW_DATABASE_STATUS[windowId] = false;
	$('#R3V2_MINI_WINDOW_' + windowId).css({'display': 'none'});
};
// Maximize window
function R3_DESIGN_MINIWINDOW_MAXIMIZE(windowId){
	if (windowId !== undefined){
		if (R3_ENABLE_ANIMATIONS === false){
			$('#R3V2_MINI_WINDOW_MAXIMIZE_' + windowId).fadeOut({duration: 100, queue: false});
			$('#R3V2_MINI_WINDOW_' + windowId).css({'top': '68px', 'left': '4px', 'width': 'calc(100% - 122px)', 'height': 'calc(100% - 88px)'});
		} else {
			$('#R3V2_MINI_WINDOW_MAXIMIZE_' + windowId).css({'display': 'none'});
			$('#R3V2_MINI_WINDOW_' + windowId).css({'width': 'calc(100% - 122px)', 'height': 'calc(100% - 88px)'});
			$('#R3V2_MINI_WINDOW_' + windowId).animate({'top': '68px', 'left': '4px'}, {duration: 80, queue: false});
		};
		// Clear Log fix
		if (windowId === 0){
			$('#R3V2_MINI_WINDOW_CLEAR_LOG').css({'right': '32px'});
		};
		// Last file opened fix
		if (R3_MENU_CURRENT === 4 && SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
			R3_DESIGN_OPEN_CLOSE_LATEST(1);
		};
	};
};
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
				document.getElementById(lblId).innerHTML = R3_parsePercentage(rangeValue, maxPercent);
			} else {
				document.getElementById(lblId).innerHTML = rangeValue;
			};
		};
	};
};
/*
	Drag Elements - MINI_WINDOW
	Original Code: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
*/
function R3_DESIGN_enableDragElement(elementId){
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
		if (finalTop < 44 && R3_MENU_CURRENT !== 4){
			finalTop = 44;
		} else {
			if (finalTop < 30 && R3_MENU_CURRENT === 4){
				finalTop = 30;
			};
		}
		if (finalLeft < 4){
			finalLeft = 4;
		};
		if (domId === 'R3V2_MINI_WINDOW_14'){
			// Snap Search function with edit form
			if (R3_MINI_WINDOW_DATABASE_STATUS[9] === true && SETTINGS_SCD_SNAP_SEARCH_WINDOW_WITH_EDIT_FORM === true){
				R3_DESIGN_MINIWINDOW_SNAP(14, 9, true);
			};
			// Snap DoorLink
			if (R3_MINI_WINDOW_DATABASE_STATUS[20] === true){
				R3_DESIGN_MINIWINDOW_SNAP(14, 20, true);
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
// Snap two mini windows
function R3_DESIGN_MINIWINDOW_SNAP(windowA, windowB, fixDrag){
	var winA = document.getElementById('R3V2_MINI_WINDOW_' + windowA), winB = document.getElementById('R3V2_MINI_WINDOW_' + windowB);
	if (winA !== null && winB !== null){
		if (fixDrag !== true){
			var calcNextX = (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).x - (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowB).w / 2));
			if (calcNextX < 4){
				calcNextX = 4;
			};
			$('#R3V2_MINI_WINDOW_' + windowA).css({
				'left': calcNextX + 'px'
			});
		};
		$('#R3V2_MINI_WINDOW_' + windowB).css({
			'top': R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).y + 'px',
			'left': (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).x + (R3_DESIGN_getCssParams('R3V2_MINI_WINDOW_' + windowA).w + 10)) + 'px'
		});
	};
};
// Get CSS pos. from DOM
function R3_DESIGN_getCssParams(domId){
	if (domId !== undefined){
		var remPx = function(str){
				return parseInt(str.replace('px', ''));
			}, winStyle = document.getElementById(domId).style;
		return {x: remPx(winStyle.left), y: remPx(winStyle.top), w: remPx(winStyle.width), h: remPx(winStyle.height)};
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
		$('#' + domMainFunctionList).css({'display': 'none'});
		$('#' + domSearchResultCanvas).css({'display': 'block'});
		document.getElementById(domSearchResultCanvas).innerHTML = '';
		SEEK_RESULTS = R3_INTERNAL_functionBtnArray.filter(function(el){
			return el.toString().toLowerCase().indexOf(funcSeekName) !== -1;
		});
		if (SEEK_RESULTS.length !== 0){
			SEEK_RESULTS.forEach(function(p){
				tmpFunc = document.getElementById(fnPrefix + p).outerHTML;
				cFunc = tmpFunc.replace('id=\"' + p + '\" ', '');
				$('#' + domSearchResultCanvas).append(cFunc);
			});
		} else {
			$('#' + domSearchResultCanvas).append('<u><b>Whoops</b> - No Result Found!</u> :(');
		};
	} else {
		$('#' + domMainFunctionList).css({'display': 'block'});
		$('#' + domSearchResultCanvas).css({'display': 'none'});
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
	if (SETTINGS_RECENT_FILE_TYPE !== undefined){
		// RDT
		if (SETTINGS_RECENT_FILE_TYPE === 0){
			R3_RDT_LOAD(SETTINGS_RECENT_FILE_PATH, true);
			R3_DESIGN_RDT_closeFileList();
			R3_SHOW_MENU(10);
		};
		// MSG
		if (SETTINGS_RECENT_FILE_TYPE === 1){
			R3_MSG_startLoadMsg(SETTINGS_RECENT_FILE_PATH);
			R3_SHOW_MENU(7);
		};
		// SCD
		if (SETTINGS_RECENT_FILE_TYPE === 2){
			R3_SCD_STARTLOAD(SETTINGS_RECENT_FILE_PATH);
			R3_SHOW_MENU(9);
		};
	};
};
// Set Recent File
function R3_LATEST_SET_FILE(name, type, location){
	if (R3_WEBMODE === false){
		if (name !== undefined && type !== undefined && location !== undefined){
			SETTINGS_RECENT_FILE_NAME = name;
			SETTINGS_RECENT_FILE_TYPE = type;
			SETTINGS_RECENT_FILE_PATH = location;
			R3_DESIGN_UPDATE_LATEST_LABELS();
			R3_SAVE_SETTINGS(false, false);
		};
	};
};
// Update Recent File Labels
function R3_DESIGN_UPDATE_LATEST_LABELS(){
	if (R3_WEBMODE === false){
		document.getElementById('R3_LBL_RECENT_FILE').innerHTML = SETTINGS_RECENT_FILE_NAME;
		document.getElementById('R3_LBL_RECENT_FILE_PATH').title = SETTINGS_RECENT_FILE_PATH;
		document.getElementById('R3_LBL_RECENT_FILE_TYPE').innerHTML = R3_LATEST_FILE_TYPES[SETTINGS_RECENT_FILE_TYPE];
		document.getElementById('R3_LBL_RECENT_FILE_PATH').innerHTML = R3_fixPathSize(SETTINGS_RECENT_FILE_PATH, (R3_RDT_MENU_LABEL_FIX_NUMBER - 8)).replace('//', '/');
		if (SETTINGS_RECENT_FILE_TYPE === 0){
			var fName = SETTINGS_RECENT_FILE_NAME.toLowerCase().replace('.rdt', '').toUpperCase(),
				fPath_00 = R3_MOD_PATH + '/DATA_A/BSS/' + fName + '00.JPG',	fPath_01 = R3_MOD_PATH + '/DATA_A/BSS/' + fName + '01.JPG', fFix = '';
			if (APP_useImageFix === true){
				fFix = 'file://';
			};
			if (APP_FS.existsSync(fPath_00) === true){
				$('#R3_LATEST_FILE_IMG_PREV').css({'background-image': 'url(\"' + fFix + fPath_00 + '\")'});
			} else {
				if (APP_FS.existsSync(fPath_01) === true){
					$('#R3_LATEST_FILE_IMG_PREV').css({'background-image': 'url(\"' + fFix + fPath_01 + '\")'});
				} else {
					$('#R3_LATEST_FILE_IMG_PREV').css({'background-image': 'url()'});
				};
			};
		} else {
			$('#R3_LATEST_FILE_IMG_PREV').css({'background-image': 'url()'});
		};
	};
};
// Open / Close Recent File Popup
function R3_DESIGN_OPEN_CLOSE_LATEST(mode){
	if (R3_WEBMODE === false){
		if (SETTINGS_RECENT_FILE_NAME !== 'undefined' && SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
			// 0 = Open, 1 = Close
			if (mode === 0 && R3_MENU_CURRENT === 4){
				if (R3_ENABLE_ANIMATIONS === true){
					$('#R3_LATEST_FILE_DIV').animate({'left': '-46px'}, {duration: 88, queue: false});
					$('#R3_LATEST_FILE_DIV').fadeIn({duration: 88, queue: false});
				} else {
					$('#R3_LATEST_FILE_DIV').css({'left': '-46px', 'display': 'block'});	
				};
				setTimeout(function(){
					document.getElementById('R3_BTN_LATEST_FILE').focus();
				}, 90);
			} else {
				if (R3_ENABLE_ANIMATIONS === true){
					$('#R3_LATEST_FILE_DIV').animate({'left': '-210px'}, {duration: 70, queue: false});
					$('#R3_LATEST_FILE_DIV').fadeOut({duration: 70, queue: false});
				} else {
					$('#R3_LATEST_FILE_DIV').css({'left': '-210px', 'display': 'none'});
				};
			};
		};
	};
};
/*
	Help Center
*/
function R3_HC_OPEN_PAGE(pageId){
	var pName;
	// Display help content
	if (R3_HC_DATABASE[pageId] !== undefined){
		pName = R3_HC_DATABASE[pageId][0];
		document.getElementById('R3_HC_TITLE_LABEL').innerHTML = R3_HC_DATABASE[pageId][0];
		document.getElementById('R3_HELP_CENTER_HOLDER').innerHTML = R3_HC_DATABASE[pageId][1];
		document.getElementById('R3_HELP_CENTER_MINILABEL').innerHTML = R3_HC_DATABASE[pageId][0];
		document.getElementById('R3_HELP_CENTER_ICON_HOLDER').src = 'img/icons/icon-' + R3_HC_DATABASE[pageId][2] + '.png';
	} else {
		pName = '404. Oh well...';
		document.getElementById('R3_HC_TITLE_LABEL').innerHTML = 'Oh no... (404)';
		document.getElementById('R3_HELP_CENTER_ICON_HOLDER').src = 'img/404.png';
		document.getElementById('R3_HELP_CENTER_MINILABEL').innerHTML = '<b>404!</b> <i>Oh No...</i>';
		document.getElementById('R3_HELP_CENTER_HOLDER').innerHTML = '<div class="align-center"><font class="LBL_title">Oh no!</font><br>Well... Looks like the help page you requested was not found or doesn\'t exists yet!</div>';
	};
	// Last file opened fix
	if (R3_MENU_CURRENT === 4 && SETTINGS_SHOW_LAST_FILE_OPENED_POPUP === true){
		R3_DESIGN_OPEN_CLOSE_LATEST(1);
	};
	// End
	document.getElementById('R3_HELP_CENTER_HOLDER').scrollTop = 0;
	R3_DESIGN_MINIWINDOW_OPEN(11, 'center');
};
/*
	SCD Editor
*/
// Render SCD DoorLink
function R3_DESIGN_DOORLINK_RENDER(){
	if (SCD_arquivoBruto !== undefined){
		var mapInput = document.getElementById('R3_SCD_DOORLINK_MAP_INPUT').value.toUpperCase();
		if (mapInput.length === 3){
			var HTML_TEMPLATE = '', cArray, cName, cCam, pLocation, pLocationName, cCamPath, cLocation, checkResult = R3_DOORLINK_DATABASE['R' + mapInput];
			if (checkResult !== undefined){
				cName = RDT_locations['R' + mapInput][0];
				cLocation = RDT_locations['R' + mapInput][1];
				checkResult.forEach(function(cItem, cIndex){
					cArray = checkResult[cIndex];
					cCam = cArray[8].toUpperCase();
					cCamPath = APP_PATH + '/Assets/DATA_A/BSS/R' + mapInput + cCam + '.JPG';
					if (APP_FS.existsSync(cCamPath) !== true){
						cCamPath = 'img/404.png';
					};
					pLocation = cArray[9];
					pLocationName = RDT_locations[pLocation][0] + ', ' + RDT_locations[pLocation][1];
					// Template
					HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_SCD_DOORLINK_itemHolder"><img src="' + cCamPath + '" class="R3_SCD_DOORLINK_camPreview" alt="DOORLINK_PREVIEW_' + cIndex + '">' +
									'<div class="R3_SCD_DOORLINK_dataInfo">Location <font class="monospace mono_xyzr">' + (cIndex + 1) + '</font> - Camera: <font class="monospace mono_xyzr user-can-select">' + cCam + '</font><br>' +
									'Parent map: <font class="monospace mono_xyzr" title="' + pLocationName + '">' + pLocation + '</font><br>X: <font class="monospace mono_xyzr user-can-select COLOR_X">' + cArray[1].toUpperCase() +
									'</font> Y: <font class="monospace mono_xyzr user-can-select COLOR_Y">' + cArray[2].toUpperCase() + '</font> ' + 'Z: <font class="monospace mono_xyzr user-can-select COLOR_Z">' + cArray[3].toUpperCase() +
									'</font> R: <font class="monospace mono_xyzr user-can-select COLOR_R">' + cArray[4].toUpperCase() + '</font><br><input type="button" value="Use this location" title="Click here to use this location as spawn ' +
									'pos." onclick="R3_DESIGN_DOORLINK_APPLY(\'R' + mapInput + '\', ' + cIndex + ');" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY R3_SCD_DOORLINK_APPLYFIX"></div></div>';
				});
			} else {
				cName = cLocation = 'Unknwon Location';
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
	if (SCD_arquivoBruto !== undefined && R3_SCD_IS_EDITING === true && R3_MINI_WINDOW_DATABASE_STATUS[20] === false){
		if (R3_NW_ARGS_DISABLE_DOORLINK === false){
			if (Object.keys(R3_DOORLINK_DATABASE).length !== 0){
				R3_DESIGN_MINIWINDOW_CLOSE(9);
				document.getElementById('R3_SCD_DOORLINK_MAP_INPUT').value = '';
				document.getElementById('R3_SCD_DOORLINK_mapName').innerHTML = 'Unknwon Location';
				document.getElementById('R3_SCD_DOORLINK_mapLocation').innerHTML = 'Unknwon Location';
				document.getElementById('R3_SCD_DOORLINK_doorHolder').innerHTML = '<br><div class="align-center">There\'s nothing to show up here!</div>';
				R3_DESIGN_MINIWINDOW_OPEN(20);
				R3_DESIGN_MINIWINDOW_SNAP(14, 20);
			} else {
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to open DoorLink! <br>Reason: You must generate DoorLink database before using this option! <br>If you already extracted game assets: Go to settings, navigate to SCD Settings and click on \"Update DoorLink Database\".');
			};
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to open DoorLink! <br>Reason: DoorLink was disabled on run args!');
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
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_nextCam').value = magicArray[8];
		R3_SCD_FUNCTIONEDIT_updateCamPreview(R3_SCD_currentOpcode);
	};
};
// Give focus to result
function R3_DESIGN_SCD_focusResultFromSearchForm(domId){
	if (domId !== undefined){
		SCD_FN_SEARCH_RESULT.forEach(function(d, cIndex){
			$('#R3_SCD_SEARCH_FIND_FN_' + cIndex).css({'box-shadow': '0px 0px 0px #0000'});
		});
		// End
		$('#R3_SCD_SEARCH_FIND_FN_' + domId).css({'box-shadow': '0px 0px 10px #fffa'});
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
		if (R3_KEYPRESS_ALT === true){
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
				$('#' + listHolder).css({'display': 'none'});
				$('#' + output).css({'display': 'inline-block'});
				document.getElementById(output).innerHTML = seekResult.outerHTML;
			} else {
				document.getElementById(valueInput).value = '';
				R3_SYSTEM_ALERT('WARN: Unable to find ' + seekId + '!');
				canCloseRes = true;
			};
		} else {
			canCloseRes = true;
		};
		if (canCloseRes === true){
			$('#' + output).css({'display': 'none'});
			$('#' + listHolder).css({'display': 'inline-block'});
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
		$('#BTN_MAIN_29').css({'display': 'none'});
		$('#BTN_MAIN_52').css({'display': 'none'});
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
		if (SETTINGS_SCD_EDITOR_MODE === 0){
			R3_DESIGN_MINIWINDOW_OPEN(9);
		} else {
			R3_DESIGN_MINIWINDOW_CLOSE(9);
		};
	};
};
// Add Color to label on Search opcode result
function R3_SCD_SEARCH_OPCODE_ADDCOLOR(fnId){
	if (SCD_arquivoBruto !== undefined){
		var c = 0;
		while (c < 20){
			$('#R3_LBL_SCD_SEARCH_FUNCTION_OPCODE').removeClass('R3_SCD_function_' + c);
			c++;
		};
		$('#R3_LBL_SCD_SEARCH_FUNCTION_OPCODE').addClass('R3_SCD_function_' + fnId);
	} else {
		R3_SCD_NEW_FILE();
	};
};
// GOTO Search Result
function R3_SCD_SEARCH_GOTO_FUNCTION(cID, functionId){
	if (SCD_arquivoBruto !== undefined){
		R3_SCD_displayScript(cID);
		if (SETTINGS_SCD_EDITOR_MODE === 0){
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
		sList.scrollBy(0, sList.scrollHeight);
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
		var c = 0, cFunction, holderHeight, focusFn, canFocus = true
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
		while (c < R3_SCD_TOTAL_FUNCTIONS){
			$('#R3_SCD_scriptCommand_' + c).css({'box-shadow': '0px 0px 0px #000'});
			c++;
		};
		// Make it shine, baby!
		$('#R3_SCD_scriptCommand_' + R3_SCD_HIGHLIGHT_FUNCTION).css({'box-shadow': '0px 0px 10px #fff'});
		// Focus function
		if (isClick === true && SETTINGS_SCD_FOCUS_FUNCTION_CLICK === false){
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
/*
	Swap to code editor

	Modes
	0: List Editor
	1: Code Editor
*/
function R3_SCD_SWAP_EDITOR_MODE(mode){
	if (mode !== undefined){
		var dTime = 100;
		SETTINGS_SCD_EDITOR_MODE = mode;
		if (mode === 0){
			document.getElementById('R3_SCD_SCRIPT_INNER').innerHTML = '';
			$('#R3_SCD_CODE_EDITOR_buttonHolder').css({'display': 'none'});
			$('#R3_SUBMENU_BUTTONS_COPYPASTE').css({'display': 'inline-flex'});
			$('#BTN_MAIN_48').css({'background-image': 'url(\'img/icons/icon-48.png\')'});
			document.getElementById('BTN_MAIN_48').title = 'Click here to open code editor';
			if (R3_ENABLE_ANIMATIONS === true){
				$('#R3_SCD_FUNCTIONS_HOLDER').fadeIn({duration: dTime, queue: false});
				$('#R3_SCD_FUNCTIONS_HOLDER').animate({'top': '40px', 'filter': 'blur(0px)'}, {duration: dTime, queue: false});
				$('#R3_SCD_SCRIPT_VIEW_DIV').animate({'width': '70%'}, {duration: (dTime + 10), queue: false});
			} else {
				$('#R3_SCD_SCRIPT_VIEW_DIV').css({'width': '70%'});
				$('#R3_SCD_FUNCTIONS_HOLDER').css({'display': 'inline', 'top': '40px', 'filter': 'blur(0px)'});
			};
		} else {
			$('#R3_SUBMENU_BUTTONS_COPYPASTE').css({'display': 'none'});
			$('#R3_SCD_CODE_EDITOR_buttonHolder').css({'display': 'inline-flex'});
			$('#BTN_MAIN_48').css({'background-image': 'url(\'img/icons/icon-49.png\')'});
			document.getElementById('BTN_MAIN_48').title = 'Click here to open list editor';
			document.getElementById('R3_SCD_SCRIPT_INNER').innerHTML = INCLUDE_SCD_CODE_EDITOR;
			if (R3_ENABLE_ANIMATIONS === true){
				$('#R3_SCD_FUNCTIONS_HOLDER').fadeOut({duration: dTime, queue: false});
				$('#R3_SCD_FUNCTIONS_HOLDER').animate({'top': '0px', 'filter': 'blur(2px)'}, {duration: dTime, queue: false});
				$('#R3_SCD_SCRIPT_VIEW_DIV').animate({'width': '100%'}, {duration: (dTime + 10), queue: false});
			} else {
				$('#R3_SCD_SCRIPT_VIEW_DIV').css({'width': '100%'});
				$('#R3_SCD_FUNCTIONS_HOLDER').css({'display': 'none', 'top': '0px', 'filter': 'blur(2px)'});
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
	if (SETTINGS_SCD_EDITOR_MODE === 1){
		setTimeout(function(){
			document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').focus();
			document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').scrollTop = 0;
			document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').selectionEnd = 0;
			document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').selectionStart = 0;
			R3_SCD_CODE_updateTextData();
		}, 30);
	};
};	
// Open / Close code editor
function R3_SCD_OPEN_CLOSE_CODE_EDITOR(){
	if (R3_SCD_IS_EDITING === false){
		if (SETTINGS_SCD_EDITOR_MODE === 0){
			R3_DESIGN_MINIWINDOW_CLOSE(9);
			R3_SCD_SWAP_EDITOR_MODE(1);
		} else {
			R3_SCD_SWAP_EDITOR_MODE(0);
		};
	};
};
// Update code editor text info
function R3_SCD_CODE_updateTextData(){
	if (SETTINGS_SCD_EDITOR_MODE === 1 && R3_SCD_IS_EDITING === false){
		var textTarget = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA'),
			textValue = textTarget.value,
			textLines = textValue.split('\n');
		document.getElementById('R3_SCD_CODE_fontSize').innerHTML = R3_SCD_CODE_zoom;
		document.getElementById('R3_SCD_CODE_codeLines').innerHTML = textLines.length;
		document.getElementById('R3_SCD_CODE_codeLength').innerHTML = textValue.length;
		document.getElementById('R3_SCD_CODE_cursorAt').innerHTML = textTarget.selectionStart;
		document.getElementById('R3_SCD_CODE_selectionEnd').innerHTML = textTarget.selectionEnd;
		document.getElementById('R3_SCD_CODE_selectionStart').innerHTML = textTarget.selectionStart;
		document.getElementById('R3_SCD_CODE_keyShift').innerHTML = R3_KEYPRESS_SHIFT.toString().slice(0, 1).toUpperCase() + R3_KEYPRESS_SHIFT.toString().slice(1);
		document.getElementById('R3_SCD_CODE_keyCtrl').innerHTML = R3_KEYPRESS_CONTROL.toString().slice(0, 1).toUpperCase() + R3_KEYPRESS_CONTROL.toString().slice(1);
		// End
		if (textTarget.selectionStart !== textTarget.selectionEnd){
			$('#R3_SCD_CODE_selectionDiv').css({'display': 'inline'});
		} else {
			$('#R3_SCD_CODE_selectionDiv').css({'display': 'none'});
		};
	};
};
// Zoom JS Code editor
function R3_DESIGN_CODE_zoomMode(mode){
	if (SETTINGS_SCD_EDITOR_MODE === 1){
		if (mode === 0){
			R3_SCD_CODE_zoom++;
		} else {
			R3_SCD_CODE_zoom--;
		};
		if (R3_SCD_CODE_zoom < 6){
			R3_SCD_CODE_zoom = 6;
		};
		if (R3_SCD_CODE_zoom > 120){
			R3_SCD_CODE_zoom = 120;	
		};
		// End
		$('#R3_SCD_CODE_EDITOR_TEXTAREA').css({'font-size': R3_SCD_CODE_zoom + 'px'});
	};
};
// SCD Seek Function
function R3_SCD_seekFunction(kPress){
	var funcSeekName, tmpFunc, cFunc, c = 0, SEEK_RESULTS, kp = kPress.which || kPress.keyCode;
	if (kp === 8 || R3_KEYPRESS_CONTROL === true){
		document.getElementById('SCD_FUNCTION_SEARCH_FIELD').value = '';
	};
	funcSeekName = document.getElementById('SCD_FUNCTION_SEARCH_FIELD').value.toLowerCase().replace(RegExp(' ', 'gi'), '_');
	if (funcSeekName.length !== 0){
		$('#SCD_FUNCTION_SEARCH_FIELD').css({'text-transform': 'uppercase'});
		$('#SCD_FUNCTION_LIST').css({'display': 'none'});
		$('#R3_SCD_FUNCTIONS_SEARCH').css({'display': 'block'});
		document.getElementById('R3_SCD_FUNCTIONS_SEARCH').innerHTML = '';
		SEEK_RESULTS = R3_INTERNAL_functionBtnScdArray.filter(function(el){
			return el.toString().toLowerCase().indexOf(funcSeekName) !== -1;
		});
		if (SEEK_RESULTS.length !== 0){
			while (c < SEEK_RESULTS.length){
				tmpFunc = document.getElementById('BTN_SCD_' + SEEK_RESULTS[c]).outerHTML;
				cFunc = tmpFunc.replace('id="' + SEEK_RESULTS[c] + '" ', '');
				$('#R3_SCD_FUNCTIONS_SEARCH').append(cFunc);
				c++;
			};
		} else {
			$('#R3_SCD_FUNCTIONS_SEARCH').append('<u><b>Whoops</b> - No Result Found!</u> :(');
		};
		R3_KEYPRESS_releaseKeys();
	} else {
		R3_SCD_closeSeekFunction();
	};
};
// Close SCD Seek Function
function R3_SCD_closeSeekFunction(){
	$('#SCD_FUNCTION_LIST').css({'display': 'block'});
	$('#R3_SCD_FUNCTIONS_SEARCH').css({'display': 'none'});
	$('#SCD_FUNCTION_SEARCH_FIELD').css({'text-transform': 'none'});
};
// Update Labels
function R3_SCD_updateLabels(){
	if (RDT_arquivoBruto !== undefined){
		$('#R3_SCD_BTN_APPLYRDT').css({'display': 'inline-flex'});
	};
	document.getElementById('R3_SCD_SCRIPT_INNER').scrollTop = 0;
	if (R3_SCD_CURRENT_SCRIPT !== 0){
		document.getElementById('R3_SCD_LBL_currentScript').innerHTML = R3_SCD_CURRENT_SCRIPT;
	} else {
		document.getElementById('R3_SCD_LBL_currentScript').innerHTML = 'INIT';
	};
	document.getElementById('R3_SCD_HEX_RAW').innerHTML = R3_SCD_CURREN_HEX_VIEW;
	document.getElementById('R3_SCD_LBL_TOTALFUNCTIONS').innerHTML = R3_SCD_TOTAL_FUNCTIONS;
	document.getElementById('R3_SCD_LBL_hexLength').innerHTML = MEMORY_JS_fixVars((R3_SCD_CURRENT_SCRIPT_HEX.length / 2).toString(16), 2).toUpperCase();
};
// Update Selected Script
function R3_DESIGN_SCD_UPDATE_SELECT(scriptId){
	var c = 0;
	while (c < R3_SCD_TOTAL_SCRITPS){
		$('#R3_SCD_SCRIPT_ID_' + c).removeClass('R3_SCRIPT_LIST_ITEM_SELECT');
		c++;
	};
	$('#R3_SCD_SCRIPT_ID_' + scriptId).addClass('R3_SCRIPT_LIST_ITEM_SELECT');
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
	R3_DESIGN_MINIWINDOW_CLOSE(8);
	R3_DESIGN_MINIWINDOW_CLOSE(11);
	// Hide some buttons
	$('#BTN_MAIN_45').css({'display': 'none'});
	$('#BTN_MAIN_42').css({'display': 'none'});
	$('#BTN_MAIN_52').css({'display': 'inline-flex'});
	// Add R3V2 Logo if doesn't use custom bg
	if (R3_SCD_DATABASE[cOpcode][8] === false){
		$('#R3_SCD_editForm_bg_image').css({'display': 'inline', 'background-image': 'url(\'img/logoWm.png\')', 'background-size': 'auto 80%'});
	} else {
		$('#R3_SCD_editForm_bg_image').css({'background-size': 'calc(100% + 60px)'});
	};
	// If are extra edit forms (non-opcodes)
	if (isExtra === undefined){
		$('#R3_SCD_FUNCTION_LOCATION_LBL').css({'display': 'inline'});
		document.getElementById('R3_SCD_LBL_EDITFUNCTION').innerHTML = titleMode + ' ' + R3_SCD_DATABASE[cOpcode][1].replace('[', '[<font class="monospace mono_xyzr">').replace(']', '</font>]');
	} else {
		$('#R3_SCD_FUNCTION_LOCATION_LBL').css({'display': 'none'});
		document.getElementById('R3_SCD_LBL_EDITFUNCTION').innerHTML = extraTitle;
	};
	// Open form
	if (R3_MINI_WINDOW_DATABASE_STATUS[14] === false){
		R3_DESIGN_MINIWINDOW_OPEN(14, 'center');
	};
};
// Close Edit
function R3_SCD_cancelFunctionEdit(exitFromEditForm){
	// Prevent memory
	R3_SCD_IS_EDITING = false;
	R3_SCD_currentOpcode = '';
	// Close Search List
	$('#BTN_MAIN_52').css({'display': 'none'});
	$('#BTN_MAIN_45').css({'display': 'inline-flex'});
	$('#BTN_MAIN_42').css({'display': 'inline-flex'});
	$('#SCD_FUNCTION_LIST').css({'display': 'block'});
	$('#R3_SCD_FUNCTIONS_SEARCH').css({'display': 'none'});
	document.getElementById('SCD_FUNCTION_SEARCH_FIELD').value = '';
	R3_DESIGN_MINIWINDOW_CLOSE(14);
	R3_DESIGN_MINIWINDOW_CLOSE(20);
	// End
	document.getElementById('R3_SCD_BTN_APPLY').onclick = null;
	if (R3_ENABLE_ANIMATIONS !== true){
		$('#R3_SCD_SCRIPT_INNER').css({'display': 'block'});
		$('#R3_SCD_EDITFUNCTION_DIV').css({'display': 'none'});
		$('#R3_SCD_CLEAR_SCRIPT_BTN').css({'display': 'block'});
	} else {
		$('#R3_SCD_SCRIPT_INNER').fadeIn({duration: 48, queue: false});
		$('#R3_SCD_CLEAR_SCRIPT_BTN').fadeIn({duration: 48, queue: false});
		$('#R3_SCD_EDITFUNCTION_DIV').fadeOut({duration: 48, queue: false});
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
	if (SCD_arquivoBruto !== undefined && SETTINGS_SCD_AUTO_OPEN_SCRIPT_LIST === true){
		R3_DESIGN_MINIWINDOW_OPEN(4);
	};
};
// Hover Function on Hex View
function R3_DESIGN_SCD_hoverFunction(fnId, displayHover){
	if (fnId !== undefined && SCD_arquivoBruto !== undefined && SETTINGS_SCD_HOVER_FUNCTION_HEX === true){
		var c = 0, scrTo;
		while (c < (R3_SCD_TOTAL_FUNCTIONS + 1)){
			$('#R3_SCD_scriptCommand_' + c).css({'box-shadow': 'none'});
			c++;
		};
		if (displayHover === true && SETTINGS_SCD_EDITOR_MODE === 0){
			scrTo = document.getElementById('R3_SCD_scriptCommand_' + fnId).offsetTop;
			$('#R3_SCD_scriptCommand_' + fnId).css({'box-shadow': '0px 0px 10px #fff'});
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
		$('#R3_SCD_EDIT_1e_editVarInt').css({'display': 'none'});
		$('#R3_SCD_EDIT_1e_editVarTime').css({'display': 'inline'});
		R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();
	} else {
		$('#R3_SCD_EDIT_1e_editVarTime').css({'display': 'none'});
		$('#R3_SCD_EDIT_1e_editVarInt').css({'display': 'inline'});
	};
};
// Update camera on Swap Camera [CUT_REPLACE]
function R3_SCD_FUNCTION_EDIT_updateCutReplace(){
	var prevCamValue, nextCamValue, imgFix = '', fPrev, fNext, prevTitle, nextTitle;
	if (RDT_arquivoBruto !== undefined){
		prevCamValue = MEMORY_JS_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_53_prevCamValue').value).toString(16), 2).toUpperCase();
		nextCamValue = MEMORY_JS_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_53_nextCamValue').value).toString(16), 2).toUpperCase();
		fPrev = APP_PATH + '/Assets/DATA_A/BSS/' + R3_RDT_mapName + prevCamValue + '.JPG';
		fNext = APP_PATH + '/Assets/DATA_A/BSS/' + R3_RDT_mapName + nextCamValue + '.JPG';
		if (APP_FS.existsSync(fPrev) !== true){
			fPrev = 'img/404.png';
			prevTitle = '';
		} else {
			prevTitle = 'Camera ' + document.getElementById('R3_SCD_EDIT_53_prevCamValue').value + '\nFile: ' + R3_RDT_mapName + prevCamValue + '.JPG';
		};
		if (APP_FS.existsSync(fNext) !== true){
			fNext = 'img/404.png';
			nextTitle = '';
		} else {
			nextTitle = 'Camera ' + document.getElementById('R3_SCD_EDIT_53_nextCamValue').value + '\nFile: ' + R3_RDT_mapName + nextCamValue + '.JPG';
		};
	} else {
		fPrev = fNext = 'img/404.png';
	};
	// non-windows fix\
	if (APP_useImageFix === true){
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
	var camPrev, door_nCam = MEMORY_JS_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_nextCam').value).toString(16), 2).toUpperCase(),
		door_nStage = MEMORY_JS_fixVars(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_stage').value, 1),
		door_nRoom = MEMORY_JS_fixVars(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_roomNumber').value, 2);
	if (parseInt(door_nStage) < 1){
		door_nStage = '1';
	};
	document.getElementById('R3_SCD_EDIT_' + cOpcode + '_lblNextStage').innerHTML = door_nStage;
	document.getElementById('R3_SCD_EDIT_' + cOpcode + '_lblNextRoom').innerHTML = door_nRoom.toUpperCase();
	if (door_nCam.length === 2 && door_nStage.length === 1 && door_nRoom.length === 2){
		camPrev = R3_MOD_PATH + '/DATA_A/BSS/R' + door_nStage + door_nRoom + door_nCam + '.JPG';
		if (R3_WEBMODE === false){
			if (APP_FS.existsSync(camPrev) !== true){
				camPrev = 'img/404.png';
			} else {
				// non-windows fix
				if (APP_useImageFix === true){
					camPrev = 'file://' + camPrev;
				};
			};
		} else {
			camPrev = 'img/404.png';
		};
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_camPreview').src = camPrev;
		if (R3_WEBMODE === false){
			if (camPrev !== 'img/404.png'){
				$('#R3_SCD_editForm_bg_image').css({'display': 'inline', 'background-image': 'url(' + camPrev + ')', 'background-size': 'calc(100% + 60px)'});
			} else {
				$('#R3_SCD_editForm_bg_image').css({'display': 'inline', 'background-image': 'linear-gradient(0deg, #0000, #0000)', 'background-size': 'auto 250%'});
			};
		};
	};
};
// Open use player pos.
function R3_SCD_FUNCTIONEDIT_showUsePlayerPos(mode){
	if (mode === 0){
		if (document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn') !== null){
			$('#R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn').css({'display': 'none'});
			$('#R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosDiv').css({'display': 'inline'});
		};
	} else {
		if (document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn') !== null){
			$('#R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosDiv').css({'display': 'none'});
			$('#R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_usePlayerPosBtn').css({'display': 'inline'});
		};
	};
};
// Update item icon preview
function R3_SCD_FUNCTIONEDIT_updateItemPreview(id, imgSrc){
	var itemId = document.getElementById(id).value,
		ITEM_imgIcon = 'img/items/details/' + itemId + '.png';
	if (parseInt(itemId, 16) > 133){
		ITEM_imgIcon = 'img/items/details/87.png';
	};
	$('#R3_SCD_editForm_bg_image').css({'display': 'inline', 'background-image': 'url(' + ITEM_imgIcon + ')', 'background-size': 'auto 236%'});
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
			$('#R3_SCD_EDIT_63_msgPrevDiv').css({'display': 'inline'});
			R3_SCD_FUNCTIONEDIT_updateData0onAOT();
		} else {
			$('#R3_SCD_EDIT_63_msgPrevDiv').css({'display': 'none'});
		};
		R3_DESIGN_adjustMiniWindowForm();
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to set AOT labels!');
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
		timerCountdown = R3_TIME_parseHexTime(MEMORY_JS_fixVars(document.getElementById('R3_SCD_EDIT_1e_hex').innerHTML, 4), 3);
		R3_FILEGEN_RENDER_EXTERNAL('R3_SCD_EDIT_1e_canvas', timerCountdown, 'RE3', 0);
	};
};
/*
	MSG Editor
*/
// Open Translator
function R3_MSG_openTranslator(){
	document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').value = '';
	R3_DESIGN_MINIWINDOW_OPEN(7);
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
		$('#R3_MSG_LBL_currentMessage').css({'display': 'inline'});
		$('#R3_MSG_BTN_APPLYRDT').css({'display': 'inline-flex'});
	} else {
		$('#R3_MSG_LBL_currentMessage').css({'display': 'none'});
		$('#R3_MSG_BTN_APPLYRDT').css({'display': 'none'});
	};
	document.getElementById('R3_MSG_MESSAGE_PREVIEW').innerHTML = R3_MSG_textMode;
	document.getElementById('R3_MSG_HEX_RAW').innerHTML = R3_unsolveHEX(R3_MSG_tempHex, 0);
	document.getElementById('R3_MSG_LBL_hexLength').innerHTML = MEMORY_JS_fixVars(parseInt(R3_MSG_tempHex.length / 2).toString(16), 2).toUpperCase();
};
// Update MSG List
function R3_MSG_DESIGN_updateMsgList(msgId){
	var c = 0, messageId = parseInt(msgId);
	while (c < R3_MSG_RDT_MESSAGES.length){
		$('#R3_MSG_MESSAGE_ID_' + c).removeClass('R3_SCRIPT_LIST_ITEM_SELECT');
		c++;
	};
	$('#R3_MSG_MESSAGE_ID_' + messageId).addClass('R3_SCRIPT_LIST_ITEM_SELECT');
};
/*
	RDT Editor
*/
// Update selected TIM file on TIM Manager
function R3_DESIGN_updateSelectedTimManager(){
	if (RDT_arquivoBruto !== undefined && R3_MINI_WINDOW_DATABASE_STATUS[16] === true){
		R3_RDT_currentTimFile = parseInt(document.getElementById('R3_RDT_timManagerList').value);
	};
};
// Update selected OBJ file on OBJ Manager
function R3_DESIGN_updateSelectedObjManager(){
	if (RDT_arquivoBruto !== undefined && R3_MINI_WINDOW_DATABASE_STATUS[17] === true){
		R3_RDT_currentObjFile = parseInt(document.getElementById('R3_RDT_objManagerList').value);
	};
};
// Update if SCD Hack is present
function R3_DESIGN_updateScdHack(){
	if (R3_RDT_SCD_HACK_ENABLED === true){
		$('#BTN_SCD_HACK').css({'display': 'inline'});
		$('#R3_RDT_BTN_ENABLE_SCD_HACK').css({'display': 'none'});
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) SCD Hack is enabled on this map!');
	} else {
		$('#BTN_SCD_HACK').css({'display': 'none'});
		$('#R3_RDT_BTN_ENABLE_SCD_HACK').css({'display': 'inline'});
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) SCD Hack is disbled on this map!');
	};
};
// Open Next / Prev Map
function R3_RDT_openNextPrevMap(mode){
	if (RDT_arquivoBruto !== undefined){
		var mapLocation, nextMap, nmPath = '', gMode = parseInt(document.getElementById('R3_RDT_FILELIST_GAMEMODE').value),
			mapList = R3_RDT_FILELIST_MAPS[gMode];
		if (mapList !== undefined){
			mapLocation = mapList.indexOf(R3_RDT_mapName + '.RDT');
			if (mapLocation !== -1){
				// Next
				if (mode === 0){
					nextMap = parseInt(mapLocation + 1);
				};
				// Prev
				if (mode === 1){
					nextMap = parseInt(mapLocation - 1);
				};
				// Game Modes
				if (gMode === 0){
					nmPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_EASY + '/RDT/';
				};
				if (gMode === 1){
					nmPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_HARD + '/RDT/';
				};
				/*
					End
				*/
				if (mapList[nextMap] !== undefined){
					if (R3_DESIGN_RDT_LOADLOCK === false){
						R3_RDT_LOAD(nmPath + mapList[nextMap], true);
					};
				};
			};
		};
	};
};
// Reset Interface
function R3_RDT_DESIGN_resetInterface(){
	$('#R3_RDT_GENERAL_IMG').css({'left': '-4%', 'display': 'none'});
	$('#R3_RDT_MENU_GENERAL_INFOS').css({'left': '52%', 'display': 'none'});
};
// Show RDT
function R3_RDT_DESIGN_enableInterface(showInterface){
	var mapFirstCamera = R3_MOD_PATH + '/DATA_A/BSS/' + R3_RDT_mapName + MEMORY_JS_fixVars(R3_genRandomNumber(R3_RDT_MAP_totalCams).toString(16), 2) + '.JPG',
		mapSecondCamera = R3_MOD_PATH + '/DATA_A/BSS/' + R3_RDT_mapName + '01.JPG';
	R3_DESIGN_closeAllRdtMiniWindows();
	if (R3_WEBMODE === false){
		if (APP_FS.existsSync(mapFirstCamera) === true){
			if (APP_useImageFix === true){
				mapFirstCamera = 'file://' + mapFirstCamera;
			};
			$('#R3_RDT_GENERAL_IMG').css({'background-image': 'url(' + mapFirstCamera + ')'});
		} else {
			if (APP_FS.existsSync(mapSecondCamera) === true){
				if (APP_useImageFix === true){
					mapSecondCamera = 'file://' + mapSecondCamera;
				};
				$('#R3_RDT_GENERAL_IMG').css({'background-image': 'url(' + mapSecondCamera + ')'});
			} else {
				$('#R3_RDT_GENERAL_IMG').css({'background-image': 'url(img/404.png)'});
			};
		};
	};
	// Check if Leo2236 RE3SLDE are present
	if (R3_WEBMODE === false){
		if (APP_FS.existsSync(R3_RE3SLDE_PATH) === true){
			$('#BTN_MAIN_38').css({'display': 'inline-flex'});
		} else {
			$('#BTN_MAIN_38').css({'display': 'none'});
		};
	} else {
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_38');
		R3_DESIGN_DISABLE_BTN('BTN_MAIN_26');
	};
	// Buttons
	$('#BTN_MAIN_27').css({'display': 'none'});
	$('#R3_MENU_BTNS_RDT_UTILITY').css({'display': 'inline-flex'});
	$('#R3_MENU_BTNS_RDT_MINIWINDOWS').css({'display': 'inline-flex'});
	$('#R3_MENU_BTNS_RDT_OPENSECTIONS').css({'display': 'inline-flex'});
	if (R3_WEBMODE === false){
		// Next / Previous Map
		if (APP_ENABLE_MOD === true){
			$('#R3_MENU_BTNS_NEXTPREV').css({'display': 'inline-flex'});
		} else {
			$('#R3_MENU_BTNS_NEXTPREV').css({'display': 'none'});
		};
		document.getElementById('R3_RDT_GENERAL_FILEPATH').title = ORIGINAL_FILENAME.replace('//', '/');
		document.getElementById('R3_RDT_GENERAL_FILEPATH').innerHTML = R3_fixPathSize(ORIGINAL_FILENAME, R3_RDT_MENU_LABEL_FIX_NUMBER).replace('//', '/');
		document.getElementById('R3_RDT_GENERAL_FILESIZE').innerHTML = R3_getFileSize(ORIGINAL_FILENAME, 1) + ' KB';
	} else {
		$('#R3_PAGE_ICON_BG_7').css({'display': 'none'});
		$('#R3_RDT_LBL_FILESIZE').css({'display': 'none'});
		document.getElementById('R3_RDT_GENERAL_FILEPATH').innerHTML = 'Unknwon';
	};
	// Map Name
	if (RDT_locations[R3_RDT_mapName] !== undefined){
		document.getElementById('R3_RDT_GENERAL_FILENAME').innerHTML = R3_RDT_mapName;
		document.getElementById('R3_RDT_GENERAL_LOCALNAME').innerHTML = RDT_locations[R3_RDT_mapName][0] + ', ' + RDT_locations[R3_RDT_mapName][1];
	} else {
		document.getElementById('R3_RDT_GENERAL_LOCALNAME').innerHTML = 'Unknown Location';
		if (R3_WEBMODE === false){
			document.getElementById('R3_RDT_GENERAL_FILENAME').innerHTML = R3_getFileName(ORIGINAL_FILENAME).toUpperCase();
		} else {
			document.getElementById('R3_RDT_GENERAL_FILENAME').innerHTML = ORIGINAL_FILENAME.name;
		};
	};
	// End Animation
	if (R3_ENABLE_ANIMATIONS === true && SETTINGS_ENABLE_RDT_OPEN_ANIMATION === true){
		var animTime = 810;
		$('#R3_RDT_GENERAL_IMG').animate({'left': '-2%'}, {duration: animTime});
		$('#R3_RDT_GENERAL_IMG').fadeIn({duration: parseInt(animTime - 200), queue: false});
		$('#R3_RDT_MENU_GENERAL_INFOS').fadeIn({duration: parseInt(animTime - 200), queue: false});
		$('#R3_RDT_MENU_GENERAL_INFOS').animate({'left': '50%'}, {duration: animTime, queue: false});
		setTimeout(function(){
			R3_DESIGN_RDT_LOADLOCK = false;
		}, parseInt(animTime + 10));
	} else {
		R3_DESIGN_RDT_LOADLOCK = false;
		$('#R3_RDT_GENERAL_IMG').css({'display': 'block', 'left': '-2%'});
		$('#R3_RDT_MENU_GENERAL_INFOS').css({'display': 'block', 'left': '50%'});
	};
	// End
	if (showInterface === true){
		setTimeout(function(){
			R3_DESIGN_RDT_openForm(0);
		}, 100);
	};
};
// File List
function R3_RDT_FILELIST_GENERATE(mode){
	if (R3_WEBMODE === false){
		R3_SETTINGS_getMapPrefix();
		document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '<div class="align-center">Generating file list, please wait...</div>';
		var c = 0, rPath, fileTest, currentMap, HTML_MAP_LIST = rdtPath = gameMode = mapIcon = '';
		if (parseInt(mode) === 0){
			gameMode = 'Easy';
			rdtPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_EASY + '/RDT/';
		};
		if (parseInt(mode) === 1){
			gameMode = 'Hard';
			rdtPath = R3_MOD_PATH + '/' + R3_RDT_PREFIX_HARD + '/RDT/';
		};
		// Start Reading
		if (APP_FS.existsSync(rdtPath) === true){
			R3_RDT_FILELIST_MAPS[mode] = APP_FS.readdirSync(rdtPath);
			// Remove unk files
			while (c < R3_RDT_FILELIST_MAPS[mode].length){
				fileTest = R3_RDT_FILELIST_MAPS[mode][c];
				if (fileTest.slice((fileTest.length - 4), fileTest.length).toUpperCase() !== '.RDT'){
					R3_RDT_FILELIST_MAPS[mode].splice(c, 1);
				};
				c++;
			};
			c = 0;
			while (c < R3_RDT_FILELIST_MAPS[mode].length){
				currentMap = R3_getFileName(R3_RDT_FILELIST_MAPS[mode][c]).toUpperCase();
				mapIcon = R3_MOD_PATH + '/DATA_A/BSS/' + currentMap + '00.JPG';
				if (APP_FS.existsSync(mapIcon) !== true){
					mapIcon = R3_MOD_PATH + '/DATA_A/BSS/' + currentMap + '01.JPG';
					if (APP_FS.existsSync(mapIcon) !== true){
						mapIcon = 'img/404.png';
					};
				};
				// non-windows fix
				if (APP_useImageFix === true && APP_FS.existsSync(mapIcon) === true){
					mapIcon = 'file://' + mapIcon;
				};
				rPath = rdtPath.replace(new RegExp('/', 'g'), '\\') + currentMap + '.RDT';
				HTML_MAP_LIST = HTML_MAP_LIST + '<div id="R3_RDT_FILELIST_ITEM_' + currentMap + '" class="R3_RDT_FILELIST_ITEM" onclick="R3_RDT_LOAD(\'' + rdtPath.replace(new RegExp('\\\\', 'g'), '/').replace('//', '/') +
								currentMap + '.RDT\', true);"><img src="' + mapIcon + '" class="R3_RDT_FILELIST_IMG"><div class="R3_RDT_FILELIST_ITEM_INFOS">Map: <font class="monospace mono_xyzr">' + currentMap + '</font><br>Location: <font class="monospace mono_xyzr">' +
								RDT_locations[currentMap][0] + '</font>, <font class="monospace mono_xyzr">' + RDT_locations[currentMap][1] + '</font><br><div class="SEPARATOR-0"></div>Path: <font class="monospace" title="' + rPath + '">' + R3_fixPathSize(rPath, R3_RDT_MENU_LABEL_FIX_NUMBER) + '</font></div></div>';
				c++;
			};
			document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '';
			$('#R3_RDT_FILELIST_HOLDER').append(HTML_MAP_LIST);
			// End
			document.getElementById('R3_RDT_FILELIST_HOLDER').scrollTop = 0;
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to get RDT file list!');
			document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '<div class="align-center">The path for this game mode are not available!</div>';
		};
	} else {
		document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '<div class="align-center">Too bad - This option are not available in web mode :(</div>';
	};
};
// Update map list
function R3_RDT_FILELIST_UPDATELIST(){
	R3_RDT_FILELIST_GENERATE(document.getElementById('R3_RDT_FILELIST_GAMEMODE').value);
};
// Search map list
function R3_RDT_FILELIST_SEARCHMAP(event){
	if (R3_WEBMODE === false){
		var kp = event.keyCode, seekValue, mapResult;
		if (kp === 8 || kp === 46){
			document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
		};
		seekValue = R3_cleanHex(document.getElementById('R3_RDT_FILELIST_SERACH').value.toUpperCase()).toUpperCase();
		document.getElementById('R3_RDT_FILELIST_SERACH').value = seekValue;
		// Search
		if (seekValue.length === 3){
			mapResult = document.getElementById('R3_RDT_FILELIST_ITEM_R' + seekValue);
			if (mapResult !== null){
				document.getElementById('R3_RDT_FILELIST_HOLDER').innerHTML = '';
				$('#R3_RDT_FILELIST_HOLDER').append(mapResult);
				if (kp === 13){
					$('#R3_RDT_FILELIST_ITEM_R' + seekValue).trigger('click');
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
		var c = 0, currentForm;
		while (c < 9999){
			currentForm = document.getElementById('R3_RDT_MENU_' + c);
			if (currentForm !== null){
				$('#R3_RDT_MENU_' + c).css({'display': 'none'});
			};
			c++;
		}
		$('#R3_RDT_MENU_' + formId).css({'display': 'inline'});
	};
};
// Open RDT List
function R3_DESIGN_RDT_openFileList(){
	R3_DESIGN_MINIWINDOW_CLOSE(6);
	R3_DESIGN_MINIWINDOW_CLOSE(10);
	$('#R3_MENU_BTNS_NEXTPREV').css({'display': 'none'});
	$('#R3_MENU_BTNS_RDT_UTILITY').css({'display': 'none'});
	$('#R3_MENU_BTNS_RDT_MINIWINDOWS').css({'display': 'none'});
	$('#R3_MENU_BTNS_RDT_OPENSECTIONS').css({'display': 'none'});
	document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
	$('#BTN_MAIN_27').css({'display': 'inline'});
	R3_RDT_FILELIST_UPDATELIST();
	R3_DESIGN_RDT_openForm(1);
	setTimeout(function(){
		document.getElementById('R3_RDT_FILELIST_SERACH').focus();
	}, 50);
};
// Close RDT List
function R3_DESIGN_RDT_closeFileList(){
	$('#R3_MENU_BTNS_RDT_OPENSECTIONS').css({'display': 'inline-flex'});
	$('#R3_MENU_BTNS_RDT_MINIWINDOWS').css({'display': 'inline-flex'});
	$('#R3_MENU_BTNS_RDT_UTILITY').css({'display': 'inline-flex'});
	document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
	$('#BTN_MAIN_27').css({'display': 'none'});
	R3_DESIGN_RDT_openForm(0);
};
/*
	RID
*/
// Update current camera
function R3_DESIGN_RID_updateCamSelected(camId){
	// Set BG
	var c = 0, totCams, mPath, camBss = R3_MOD_PATH + '/DATA_A/BSS/' + R3_RDT_mapName + MEMORY_JS_fixVars(parseInt(camId).toString(16), 2) + '.JPG';
	if (R3_WEBMODE === false){
		if (APP_FS.existsSync(camBss) === false){
			camBss = 'img/404.png';
			$('#R3_RID_EDIT_FORM_INNER_BG').css({'background-image': 'url(\'./img/404.png\')'});
		} else {
			mPath = R3_MOD_PATH;
			if (APP_useImageFix === true){
				mPath = 'file://' + R3_MOD_PATH;
			};
			$('#R3_RID_EDIT_FORM_INNER_BG').css({'background-image': 'url(\'' + mPath + '/DATA_A/BSS/' + R3_RDT_mapName + MEMORY_JS_fixVars(parseInt(camId).toString(16), 2) + '.JPG\')'});
		};
		// Non-windows fix
		if (APP_useImageFix === true){
			camBss = 'file://' + camBss;
		};
	} else {
		camBss = 'img/404.png';
	};
	document.getElementById('R3_RID_CAMERA_BSS').src = camBss;
	// Cam List
	totCams = RID_cameraList.length;
	while (c < totCams){
		$('#R3_RID_CAM_' + c).removeClass('R3_SCRIPT_LIST_ITEM_SELECT');
		c++;
	};
	$('#R3_RID_CAM_' + camId).addClass('R3_SCRIPT_LIST_ITEM_SELECT');
	document.getElementById('R3_RID_CAMERA_LIST_HOLDER').scrollTop = (document.getElementById('R3_RID_CAM_' + camId).offsetTop - 36);
	// Title
	document.getElementById('R3_RID_lblTitleCurrentCam').innerHTML = camId + ' (' + MEMORY_JS_fixVars(parseInt(camId).toString(16), 2).toUpperCase() + ')';
	// End
	RID_currentCamera = parseInt(camId);
};
document.FOR_HACKERS_ONLY = function(){
	R3_SYSTEM_CLEAR_LOG();
	R3_SYSTEM_LOG_RESET = true;
	R3_SYSTEM_LOG('separator');
	R3_SYSTEM_LOG('log', '<div class="align-center">' + atob('TG9va2luZyBpbnNpZGUgUjNWMiBDb2RlPyBKdXN0IGhvcGUgeW91IGhhdmUgYSBnb29kIHRpbWUhPGJyPjxicj5EbyB5b3Ugd2FubmEgcGxheSBhIGNvb2wgZ2FtZT8gVHJ5IDx1IHRpdGxlPSJIaSEiPkNyb3NzQ29kZTwvdT4hPGJyPkl0IGlzIGF2YWlsYWJsZSBvbiBTdGVhbSAoV2luLCBtYWNPUyBhbmQgTGludXgpLCBQUzQgYW5kIGV2ZW4gb24gTmludGVuZG8gU3dpdGNoITxicj48YnI+VGhlcmUgaXMgYSB3ZWJkZW1vIGlmIHlvdSB3YW50IHRyeSB0aGUgZ2FtZSBiZWZvcmUgcHVyY2hhc2luZyBpdDo8YnI+PGEgaHJlZj0iaHR0cHM6Ly9jcm9zcy1jb2RlLmNvbS9lbi9zdGFydCIgdGFyZ2V0PSJfYmxhbmsiPmh0dHBzOi8vY3Jvc3MtY29kZS5jb20vZW4vc3RhcnQ8L2E+PGJyPjxicj5Ob3cgLSBpZiB5b3Ugd2FudCBrbm93IGFib3V0IHRoaXMgc29mdHdhcmUsIDxhIGhyZWY9Imh0dHBzOi8vdHdpdHRlci5jb20vdGhlbWl0b3NhbiIgdGFyZ2V0PSJfYmxhbmsiPkRNIG1lIG9uIFR3aXR0ZXI8L2E+ITxicj48YnI+U2VlIHlvdSBsYXRlciE8YnI+PGJyPjxhIGhyZWY9Imh0dHBzOi8vdGhlbWl0b3Nhbi5naXRodWIuaW8vIiB0YXJnZXQ9Il9ibGFuayI+VGhlTWl0b1NhbjwvYT4u') + '</div>');
	R3_SYSTEM_LOG('separator');
	document.getElementById('R3V2_TITLE_LOG_WINDOW').innerHTML = 'I S33 Y0U!';
	$('#R3_LOG_ID_N_2').addClass('SEPARATOR-5');
	$('#R3_LOG_ID_N_4').addClass('SEPARATOR-5');
	$('#R3_LOG_ID_N_2').removeClass('SEPARATOR-3');
	$('#R3_LOG_ID_N_4').removeClass('SEPARATOR-3');
	R3_DESIGN_MINIWINDOW_OPEN(0, 'center');
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
	document.getElementById('R3_RID_LBL_POS_X').innerHTML = R3_parseEndian(R3_convertPosNumbersToHex(parseInt(document.getElementById('R3_RID_EDIT_posX').value))).toUpperCase();
	document.getElementById('R3_RID_LBL_POS_Y').innerHTML = R3_parseEndian(R3_convertPosNumbersToHex(parseInt(document.getElementById('R3_RID_EDIT_posY').value))).toUpperCase();
	document.getElementById('R3_RID_LBL_POS_Z').innerHTML = R3_parseEndian(R3_convertPosNumbersToHex(parseInt(document.getElementById('R3_RID_EDIT_posZ').value))).toUpperCase();
	document.getElementById('R3_RID_LBL_POS_R').innerHTML = R3_parseEndian(R3_convertPosNumbersToHex(parseInt(document.getElementById('R3_RID_EDIT_posR').value))).toUpperCase();
};
// Next / Previous Camera
function R3_DESIGN_RID_seekCamera(mode){
	if (mode === 0){
		RID_currentCamera--;
	} else {
		RID_currentCamera++;
	};
	if (RID_currentCamera > (RID_cameraList.length - 1)){
		RID_currentCamera = (RID_cameraList.length - 1)
	};
	if (RID_currentCamera < 0){
		RID_currentCamera = 0;
	};
	R3_RID_OPEN_CAMERA(RID_currentCamera);
};
/*
	RE3 Livestatus
*/
// Open RE3 Livestatus Menu
function R3_LIVESTATUS_OPEN_MENU(){
	if (R3_WEBMODE === false){
		R3_DESIGN_SHOWTABS(0, 0);
		R3_DESIGN_MINIWINDOW_OPEN(19, 'center');
	};
};
function R3_LIVESTATUS_OPEN_BAR(){
	if (R3_WEBMODE === false){
		var c = 0;
		// Disabling Run buttons
		$('#R3_MENU_MAIN_TOP_EXEC_GAME_DIV').css({'display': 'none'});
		// Bottom
		if (SETTINGS_LIVESTATUS_BAR_POS === 0){
			$('#R3_LIVESTATUS_FOOTER_HOLDER').css({'display': 'inline'});
			// Adjust menus
			while (c < R3_TOTAL_MENUS){
				if (c !== 2){
					$('#MENU_' + c).css({'width': '100%', 'height': 'calc(100% - 64px)'});
				};
				c++;
			};
		};
		// Right
		if (SETTINGS_LIVESTATUS_BAR_POS === 1){
			$('#R3_LIVESTATUS_RIGHT_HOLDER').css({'display': 'inline'});
			// Adjust menus
			while (c < R3_TOTAL_MENUS){
				if (c !== 2){
					$('#MENU_' + c).css({'width': 'calc(100% - 112px)', 'height': 'calc(100% - 26px)'});
				};
				c++;
			};
		};
	};
};
// Close Bar
function R3_LIVESTATUS_CLOSE_BAR(){
	var c = 0;
	$('#R3_LIVESTATUS_RIGHT_HOLDER').css({'display': 'none'});
	$('#R3_LIVESTATUS_FOOTER_HOLDER').css({'display': 'none'});
	if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === false){
		$('#R3_MENU_MAIN_TOP_EXEC_GAME_DIV').css({'display': 'inline-flex'});
	} else {
		$('#R3_MENU_MAIN_TOP_EXEC_GAME_DIV').css({'display': 'none'});
	};
	// Adjust menus
	while (c < R3_TOTAL_MENUS){
		$('#MENU_' + c).css({'width': '100%', 'height': 'calc(100% - 24px)'});
		c++;
	};
	// End
	R3_DESIGN_MINIWINDOW_CLOSE(19);
};
// Adjust Interface
function R3_LIVESTATUS_BAR_ADJUSTINTERFACE(){
	R3_LIVESTATUS_CLOSE_BAR();
	setTimeout(function(){
		R3_LIVESTATUS_OPEN_BAR();
	}, 100);
};
// Toggle Bar Position
function R3_LIVESTATUS_BAR_TOGGLEPOS(){
	if (RE3_RUNNING !== false && R3_WEBMODE === false){
		R3_KEYUP_TOOGLE_TIMEOUT = true;
		R3_LIVESTATUS_FORCE_RENDER = true;
		if (SETTINGS_LIVESTATUS_BAR_POS === 0){
			SETTINGS_LIVESTATUS_BAR_POS = 1;
		} else {
			SETTINGS_LIVESTATUS_BAR_POS = 0;
		};
		R3_SETTINGS_SAVE();
		setTimeout(function(){
			R3_KEYUP_TOOGLE_TIMEOUT = false;
		}, 500);
	};
};
// Render RE3 Livestatus infos
function R3_LIVETSTATUS_RENDER(){
	/*
		Bars
	*/
	// Var Cleaning
	var c = f = 0, ext, checkPos, checkPlayer, currentInventory;
	// Map Values
	if (RE3_LIVE_MAP !== REALTIME_CurrentRDT || R3_LIVESTATUS_FORCE_RENDER === true){
		if (RDT_locations[REALTIME_CurrentRDT] !== undefined){
				ext = 'RDT';
			if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === true){
				ext = 'ARD';
			};
			document.getElementById('R3_LIVESTATUS_LBL_ROOM_NAME').innerHTML = RDT_locations[REALTIME_CurrentRDT][0];
			document.getElementById('R3_LIVESTATUS_LBL_ROOM_FILENAME').innerHTML = REALTIME_CurrentRDT + '.' + ext;
			document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_RDT').innerHTML = REALTIME_CurrentRDT + '.' + ext;
			document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_MAP_NAME').innerHTML = RDT_locations[REALTIME_CurrentRDT][0];
			RE3_LIVE_MAP = REALTIME_CurrentRDT;
		};
	};
	// Pos. Values
	checkPos = REALTIME_X_Pos + REALTIME_Y_Pos + REALTIME_Z_Pos + REALTIME_R_Pos + REALTIME_zIndex;
	if (checkPos !== RE3_LIVE_POS){
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value = REALTIME_X_Pos;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value = REALTIME_Y_Pos;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value = REALTIME_Z_Pos;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value = REALTIME_R_Pos;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value = REALTIME_zIndex;
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_X').innerHTML = REALTIME_X_Pos;
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_Y').innerHTML = REALTIME_Y_Pos;
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_Z').innerHTML = REALTIME_Z_Pos;
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_R').innerHTML = REALTIME_R_Pos;
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_zI').innerHTML = REALTIME_zIndex;
		RE3_LIVE_POS = REALTIME_X_Pos + REALTIME_Y_Pos + REALTIME_Z_Pos + REALTIME_R_Pos + REALTIME_zIndex;
	};
	// Player Values
	checkPlayer = REALTIME_CurrentHP + REALTIME_CurrentPlayer + REALTIME_CurrentWeapon;
	if (checkPlayer !== RE3_LIVE_PLAYER){
		$('#R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV').removeClass('R3_COLOR_FINE');
		$('#R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV').removeClass('R3_COLOR_DANGER');
		$('#R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV').removeClass('R3_COLOR_POISON');
		$('#R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV').removeClass('R3_COLOR_CAUTION');
		$('#R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV').removeClass('R3_COLOR_CAUTION_RED');
		$('#R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERCONDITION_DIV').addClass(R3_processHP(REALTIME_CurrentHP)[3]);
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_HP').innerHTML = R3_processHP(REALTIME_CurrentHP)[0];
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_CONDITION').innerHTML = R3_processHP(REALTIME_CurrentHP)[1];
		var cPlayer = 'img/PLR_' + REALTIME_CurrentPlayer + '.png',
			cWeapon = 'img/items/' + REALTIME_CurrentWeapon + '.png';
		$('#R3_LIVESTATUS_MINITAB_2_BG').css({'background-image': 'url("./img/PLR_' + REALTIME_CurrentPlayer + '.png")'});
		document.getElementById('R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_PLAYERICON').src = cPlayer;
		document.getElementById('R3_LIVESTATUS_' + SETTINGS_LIVESTATUS_BAR_POS + '_WEAPONICON').src = cWeapon;
		// RE3 Live Window
		document.getElementById('R3_LIVESTATUS_LBL_PLR_HP_HEX').innerHTML = REALTIME_CurrentHP;
		document.getElementById('R3_LIVESTATUS_LBL_PLR_HP').innerHTML = R3_processHP(REALTIME_CurrentHP)[0];
		document.getElementById('R3_LIVESTATUS_LBL_PLR_CONDITION').innerHTML = R3_processHP(REALTIME_CurrentHP)[1];
		document.getElementById('R3_LIVESTATUS_LBL_PLR_WEAPON').innerHTML = R3_LIVESTATUS_WEAPONS[REALTIME_CurrentWeapon];
		document.getElementById('R3_LIVESTATUS_LBL_PLR_CURRENT').innerHTML = R3_LIVESTATUS_playerList[REALTIME_CurrentPlayer];
		/*
			End
		*/
		RE3_LIVE_PLAYER = REALTIME_CurrentHP + REALTIME_CurrentPlayer + REALTIME_CurrentWeapon;
	};
	// Item Box
	if (TEMP_ITEMBOX !== RE3_LIVE_BOX){
		var IT, QT, AT, boxArray = RE3_LIVE_BOX.match(/.{1,8}/g), tempQT;
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
			}
			document.getElementById('R3_LIVESTATUS_BOX_ITEM_QT_' + c).innerHTML = tempQT;
			document.getElementById('R3_LIVESTATUS_BOX_IMG_' + c).src = 'img/items/' + IT + '.png';
			document.getElementById('R3_LIVESTATUS_BOX_ITEM_LBL_' + c).innerHTML = '(' + c + ') ' + DATABASE_ITEM[IT][0];
			if (DATABASE_ITEM_ATTR[AT] !== undefined){
				$('#R3_LIVESTATUS_BOX_ITEM_QT_' + c).css({'color': DATABASE_ITEM_ATTR[AT][1], 'opacity': DATABASE_ITEM_ATTR[AT][4]});	
			};
			c++;
		};
		// End
		TEMP_ITEMBOX = RE3_LIVE_BOX;
	};
	// Infinite HP
	if (document.getElementById('R3_LIVESTATUS_OPTION_INFINITE_HP').checked === true){
		R3_LIVESTATUS_infiniteHP();
	};
	// Camera
	if (RE3_LIVE_CAM !== REALTIME_CurrentCam){
		var nextCam = R3_MOD_PATH + '/DATA_A/BSS/' + REALTIME_CurrentRDT + REALTIME_CurrentCam + '.JPG';
		if (APP_FS.existsSync(nextCam) !== false){
			document.getElementById('R3_LIVESTATUS_IMG_CURRENT_CAM').src = nextCam;
		} else {
			document.getElementById('R3_LIVESTATUS_IMG_CURRENT_CAM').src = 'img/404.png';
		}
		document.getElementById('R3_LIVESTATUS_LBL_CURRENT_CAM').innerHTML = REALTIME_CurrentCam;
		document.getElementById('R3_LIVESTATUS_LBL_' + SETTINGS_LIVESTATUS_BAR_POS + '_CAM').innerHTML = REALTIME_CurrentCam;
		RE3_LIVE_CAM = REALTIME_CurrentCam;
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
	// Force renderer
	// R3_LIVESTATUS_RENDER_COUNTER++;
	// if (R3_LIVESTATUS_FORCE_RENDER === true){
	// 	R3_LIVESTATUS_FORCE_RENDER = false;
	// };
	// if (R3_LIVESTATUS_RENDER_COUNTER > 16){
	// 	R3_LIVESTATUS_FORCE_RENDER = true;
	// 	R3_LIVESTATUS_RENDER_COUNTER = 0;
	// };
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
		document.getElementById('R3_LIVESTATUS_INVENT_ICON_' + slotId).src = 'img/items/' + IT + '.png';
		$('#R3_LIVESTATUS_LBL_INVENT_' + slotId).css({'color': itColor, 'text-shadow': itShadow, 'display': itDisplay});
		document.getElementById('R3_LIVESTATUS_INVENT_ICON_' + slotId).title = DATABASE_ITEM[IT][0] + ' (Click to edit this slot)\n\n' + DATABASE_ITEM[IT][1].replace(new RegExp('<br>', 'gi'), '\n');
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unknown Item Attr! [' + AT + ']');
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
		$('#R3_LIVESTATUS_MINITAB_4').css({'display': 'block'});
		$('#R3_LIVESTATUS_MINISECTION_4').css({'display': 'block'});
		document.getElementById('R3_LIVESTATUS_EDIT_INVENT_APPLY').onclick = function(){
			R3_LIVESTATUS_APPLYITEM(inventId);
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
	document.getElementById('R3_LIVESTATUS_IMG_ITEM_SETSLOT').src = 'img/items/details/' + IT + '.png';
	$('#R3_LIVESTATUS_IMG_ITEM_BG').css({'background-image': 'url("./img/items/details/' + IT + '.png")'});
};
// Edit Itembox
function R3_LIVESTATUS_EDIT_ITEMBOX(itemId){
	var IT, QT, AT, R3_IBOX_TEMP = RE3_LIVE_BOX.match(/.{1,8}/g), iHex = R3_IBOX_TEMP[itemId];
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
		/*
			End
		*/
		$('#R3_LIVESTATUS_MINITAB_4').css({'display': 'block'});
		$('#R3_LIVESTATUS_MINISECTION_4').css({'display': 'block'});
		document.getElementById('R3_LIVESTATUS_EDIT_INVENT_APPLY').onclick = function(){
			R3_LIVESTATUS_APPLYITEMBOX(itemId);
		};
		document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX_SEARCH').focus();
	};
};
// Cancel Slot Edit
function R3_LIVESTATUS_EDIT_INVENT_CANCEL(){
	$('#R3_LIVESTATUS_MINITAB_4').css({'display': 'none'});
	$('#R3_LIVESTATUS_MINISECTION_4').css({'display': 'none'});
	document.getElementById('R3_LIVESTATUS_EDIT_INVENT_APPLY').onclick = undefined;
};
// Close RE3 Livestatus
function R3_LIVESTATUS_CLOSEMENU(){
	R3_LIVESTATUS_OPEN = false;
	R3_DESIGN_MINIWINDOW_CLOSE(19);
};
/*
	eNGE Design Functions
*/
function R3_eNGE_openEmuWindow(){
	if (R3_WEBMODE === false){
		R3_DESIGN_MINIWINDOW_OPEN(13, 'center');
	};
};
// Make eNGE window visisble on settings
function R3_eNGE_makeWindowVisible(mode){
	if (mode === 0){
		if (R3_MINI_WINDOW_DATABASE_STATUS[13] === false){
			R3_DESIGN_MINIWINDOW_OPEN(13);
		};
		$('#R3V2_MINI_WINDOW_13').css({'z-index': '10000010'});
	} else {
		$('#R3V2_MINI_WINDOW_13').css({'z-index': '999999'});
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
	$('#R3_MENU_MAIN_TOP').css({'display': 'none'});
	document.getElementById('R3_LOADING_TITLE').innerHTML = title;
	document.getElementById('R3_LOADING_STATUS').innerHTML = status;
	document.getElementById('R3_LOADING_PGBAR_LABEL').innerHTML = percent;
	$('#R3_LOADING_PGBAR_DIV').css({'width': 'calc(' + parseInt(percent) + '% - 20px)'});
	R3_SHOW_MENU(2);	
	R3_MENU_LOCK = true;
};
function R3_UTILS_LOADING_UPDATE(status, percent){
	document.getElementById('R3_LOADING_STATUS').innerHTML = status;
	document.getElementById('R3_LOADING_PGBAR_LABEL').innerHTML = percent;
	$('#R3_LOADING_PGBAR_DIV').css({'width': 'calc(' + parseInt(percent) + '% - 20px)'});
};
function R3_UTILS_LOADING_CLOSE(){
	$('#R3_MENU_MAIN_TOP').css({'display': 'inline-flex'});
	R3_DESIGN_LOADING_ACTIVE = false;
	R3_MENU_LOCK = false;
	R3_MENU_GOBACK();
};
/*
	Backup manager
*/
function R3_DESIGN_renderBackupManager(){
	if (R3_WEBMODE === false){
		var c = 0, HTML_TEMPLATE = '', fPath, fName, fShort, fType, fEditor, fDate, fileArray = Object.keys(R3_SYSTEM_BACKUP_LIST).reverse();
		if (Object.keys(R3_SYSTEM_BACKUP_LIST).length !== 0){
			document.getElementById('R3_BACKUP_MANAGER_ITEMS').innerHTML = '<div class="align-center">Generating backup list - Please wait</div>';
			while (c < fileArray.length){
				fName   = fileArray[c];
				fShort  = R3_SYSTEM_BACKUP_LIST[fileArray[c]][0];
				fType   = R3_SYSTEM_BACKUP_LIST[fileArray[c]][1];
				fEditor = R3_SYSTEM_BACKUP_LIST[fileArray[c]][2];
				fDate   = R3_SYSTEM_BACKUP_LIST[fileArray[c]][3] + ' - ' + R3_SYSTEM_BACKUP_LIST[fileArray[c]][4];
				fPath   = R3_SYSTEM_BACKUP_LIST[fileArray[c]][5];
				HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_BACKUP_MANAGER_ITEM" id="R3_BACKUP_MANAGER_ITEM_' + c + '"><font title="File: ' + fName + '\nPath: ' + fPath + '">' + fShort + '</font>' +
								'<font class="R3_BACKUP_MANAGER_format">' + fType + '</font><font class="R3_BACKUP_MANAGER_changesOn">' + fEditor + '</font><font class="R3_BACKUP_MANAGER_modifiedOn">' + 
								fDate + '</font><div class="R3_BACKUP_MANAGER_actions"><input type="button" value="Restore" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" onclick="R3_BACKUP_MANAGER_restore(' + c + ');" ' + 
								'title="Click here to restore this backup file"><input type="button" value="Delete" class="BTN_R3CLASSIC BTN_R3CLASSIC_DELETE" onclick="R3_BACKUP_MANAGER_delete(' + c + ');" ' +
								'title="Click here to delete this backup file"></div></div>';
				c++;
			};
			document.getElementById('R3_BACKUP_MANAGER_ITEMS').innerHTML = HTML_TEMPLATE;
		} else {
			document.getElementById('R3_BACKUP_MANAGER_ITEMS').innerHTML = '<br><div class="align-center">There\'s nothing to display here!</div>';
		};
		R3_DESIGN_MINIWINDOW_OPEN(18, 'center');
	};
};
/*
	Settings
*/
function R3_DESIGN_processSettingsChanges(){
	// Move screen to another display
	if (SETTINGS_ENABLE_MOVE_SCREEN === true){
		$('#SETTINGS_ENABLE_MOVE_DISPLAY_DIV').css({'display': 'inline'});
	} else {
		$('#SETTINGS_ENABLE_MOVE_DISPLAY_DIV').css({'display': 'none'});
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
	document.getElementById('R3_ITEM_DATABASE_ICON').src = 'img/items/details/00.png';
};
function R3_DESIGN_CLEAN_MAINMENU(){
	document.title = APP_TITLE;
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
	document.getElementById('R3_MSG_MESSAGE_PREVIEW').innerHTML = '';
	document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').value = '';
	document.getElementById('R3_MSG_LBL_hexLength').innerHTML = '00';
};
function R3_DESIGN_CLEAN_SCD(){
	R3_SCD_cancelFunctionEdit();
	$('#R3_SCD_BTN_APPLYRDT').css({'display': 'none'});
	document.getElementById('R3_SCD_HEX_RAW').innerHTML = '';
	document.getElementById('R3_SCD_SCRIPT_INNER').innerHTML = '';
	document.getElementById('R3_SCD_SCRIPT_LISTS').innerHTML = '';
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
	$('#BTN_MAIN_27').css({'display': 'none'});
	document.getElementById('R3_RDT_FILELIST_SERACH').value = '';
};
function R3_DESIGN_CLEAN_RID(){
	document.getElementById('R3_RID_CAMERA_LIST_HOLDER').innerHTML = '';
};