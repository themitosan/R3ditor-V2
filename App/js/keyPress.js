/*
	*******************************************************************************
	R3ditor V2 - keyPress.js
	By TemmieHeartz

	This file is responsible for dealing with keyboard / mouse input to be used on
	R3V2 tools and more.

	PS: I'm not happy about This file and it will suffer major rework soon!
	*******************************************************************************
*/

tempFn_R3_keyPress = {
	// Variables
	enableShortcuts: true, // R3_keyPress.enableShortcuts
	keyUpToggleTimout: true, // R3_keyPress.keyUpToggleTimout
	KEYBOARD_INIT_OK: false,

	// Key Mapping
	KEY_ALT: false, // R3_keyPress.KEY_ALT
	KEY_SHIFT: false, // R3_keyPress.KEY_SHIFT
	KEY_CONTROL: false, // R3_keyPress.KEY_CONTROL

	// Release special keys on prompts, alerts and etc.
	releaseKeys: function(){ // R3_keyPress.releaseKeys
		R3_keyPress.KEY_ALT = false;
		R3_keyPress.KEY_SHIFT = false;
		R3_keyPress.KEY_CONTROL = false;
	}
};
// Initialize keyboard
tempFn_R3_keyPress['INIT'] = function(){
	if (R3_keyPress.KEYBOARD_INIT_OK === false){
		R3_keyPress.KEYBOARD_INIT_OK = true;
		/*
			KeyDown
		*/
		document.addEventListener('keydown', function(kd){
			// console.info(kd.keyCode);
			if (R3_keyPress.enableShortcuts === true && R3_SYSTEM.APP_ON_BOOT === false){
				// Hold shift [SHIFT]
				if (kd.keyCode === 16){
					R3_keyPress.KEY_SHIFT = true;
				};
				// Hold control [CTRL]
				if (kd.keyCode === 17){
					R3_keyPress.KEY_CONTROL = true;
				};
				// Release control if [ALT_GR] is pressed
				if (kd.keyCode === 18){
					R3_keyPress.KEY_ALT = true;
					R3_keyPress.KEY_CONTROL = false;
				};
				// SCD Seek Scripts, Functions and Navigation
				if (R3_MENU_CURRENT === 9){
					if (R3_keyPress.KEY_CONTROL === true && R3_SCD_IS_EDITING === false && SCD_arquivoBruto !== undefined && R3_keyPress.KEY_SHIFT === false){
						// Disable skip shortcuts
						if (R3_SETTINGS.SETTINGS_SCD_DISABLE_NEXT_PREV_SHORTCUTS === false){
							// Next [CTRL + Right Arrow]
							if (kd.keyCode === 39){
								R3_SCD_SKIPSCRIPT(1);
							};
							// Previous [CTRL + Left Arrow]
							if (kd.keyCode === 37){
								R3_SCD_SKIPSCRIPT(0);
							};
						};
						// Next Function [CTRL + Down]
						if (kd.keyCode === 38){
							R3_SCD_navigateFunctions(0);
						};
						// Previous Function [CTRL + Up]
						if (kd.keyCode === 40){
							R3_SCD_navigateFunctions(1);
						};
						// Return Previous 10 Functions [CTRL + Page Up]
						if (kd.keyCode === 33){
							R3_SCD_navigateFunctions(3);
						};
						// Advance Next 10 Functions [CTRL + Page Down]
						if (kd.keyCode === 34){
							R3_SCD_navigateFunctions(4);
						};
						// Blur Search SCD Function in some cases
						if (kd.keyCode === 86){
							document.getElementById('SCD_FUNCTION_SEARCH_FIELD').blur();
						};
					};
				};
				// MSG Shortcuts
				if (R3_MENU_CURRENT === 7){
					if (R3_keyPress.KEY_CONTROL === true && MSG_arquivoBruto !== undefined && R3_SETTINGS.SETTINGS_MSG_DISABLE_NEXT_PREV_SHORTCUTS === false){
						// Next Message [CTRL + Right Arrow]
						if (kd.keyCode === 39){
							R3_MSG_SKIPSCRIPT(1);
						};
						// Previous Message [CTRL + Left Arrow]
						if (kd.keyCode === 37){
							R3_MSG_SKIPSCRIPT(0);
						};
					};
				};
				// RID Seek Camera
				if (R3_MENU_CURRENT === 10 && R3_MINI_WINDOW_DATABASE[6][5] === true){
					// Next Next [CTRL + Right Arrow]
					if (kd.keyCode === 39){
						R3_DESIGN_RID_seekCamera(1);
					};
					// Previous Previous [CTRL + Left Arrow]
					if (kd.keyCode === 37){
						R3_DESIGN_RID_seekCamera(0);
					};
				};
			};
			// Update text data on SCD Code editor
			if (R3_MENU_CURRENT === 9 && R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
				R3_SCD_CODE_updateTextData();
			};
		});
		/*
			KeyUp
		*/
		document.addEventListener('keyup', function(kp){
			// console.info(kp.keyCode);
			if (R3_keyPress.enableShortcuts === true && R3_SYSTEM.APP_ON_BOOT !== true){
				// Release Shift [SHIFT]
				if (kp.keyCode === 16){
					R3_keyPress.KEY_SHIFT = false;
				};
				// Release Control [CTRL]
				if (kp.keyCode === 17){
					R3_keyPress.KEY_CONTROL = false;
				};
				// Release Alt [ALT]
				if (kp.keyCode === 18){
					R3_keyPress.KEY_ALT = false;
				};
				// Close on Esc [ESC]
				if (kp.keyCode === 27){
					// SCD Editor
					if (R3_MENU_CURRENT === 9){
						// SCD Search form
						if (R3_MINI_WINDOW_DATABASE[9][5] === true){
							R3_MINIWINDOW.close(9);
						};
						// Close Edit form
						if (R3_SCD_IS_EDITING === true){
							R3_SCD_cancelFunctionEdit();
						};
					};
					// MSG Editor
					if (R3_MENU_CURRENT === 7 && R3_MSG_IS_EDITING === true){
						R3_MSG_cancelFunctionEdit();
					};
					// RID Editor
					if (R3_MENU_CURRENT === 10 && R3_MINI_WINDOW_DATABASE[6][5] === true){
						R3_MINIWINDOW.close(6);
					};
				};
				// Commands not available on web vesion
				if (R3_SYSTEM.web.isBrowser === false){
					// Open Help Center [F1]
					if (kp.keyCode === 112){
						R3_HC_OPEN_PAGE(R3_MENU_CURRENT);
					};
					// [CTRL] Hotkeys
					if (R3_keyPress.KEY_CONTROL === true){
						// Open SCD Opcode Finder [Main Menu, CTRL + SHIFT + F]
						if (R3_keyPress.KEY_SHIFT === true && kp.keyCode === 70){
							R3_SCD_openOpcodeFinder();
						};
						// Open log window [CTRL + SHIFT + L]
						if (R3_keyPress.KEY_SHIFT === true && kp.keyCode === 76){
							R3_DESIGN_openLogWindow();
						};
						// Close tools using [CTRL + E]
						if (R3_keyPress.KEY_SHIFT === false && R3_SETTINGS.SETTINGS_SHORTCUT_CLOSETOOL === true && kp.keyCode === 69){
							R3_MENU_EXIT();
						};
						// Open Item Databse [CTRL + SHIFT + D]
						if (R3_keyPress.KEY_SHIFT === true && kp.keyCode === 68){
							R3_MINIWINDOW.open(15, 'center');
						};
						// RDT - Open editors using numbers [CTRL + Number]
						if (R3_MENU_CURRENT === 10 && R3_MINI_WINDOW_DATABASE[6][5] === false){
							// SCD [CTRL + 1]
							if (kp.keyCode === 49){
								R3_RDT.sections.openSCD();
							};
							// MSG [CTRL + 2]
							if (kp.keyCode === 50){
								R3_RDT.sections.openMSG();
							};
							// RID [CTRL + 3]
							if (kp.keyCode === 51){
								R3_RDT.sections.openRID();
							};
							// LIT [CTRL + 4]
							if (kp.keyCode === 52){
								R3_RDT.sections.openLIT();
							};
							// PRI [CTRL + 5]
							if (kp.keyCode === 53){
								R3_RDT.sections.openPRI();
							};
							// SCA [CTRL + 6]
							if (kp.keyCode === 54){
								R3_RDT.sections.openSCA();
							};
						};
						// Open windows / editors on main menu [CTRL + Number]
						if (R3_MENU_CURRENT === 4){
							// RDT Editor [CTRL + 1]
							if (kp.keyCode === 49){
								R3_SHOW_MENU(10);
							};
							// SCD Editor [CTRL + 2]
							if (kp.keyCode === 50){
								R3_SHOW_MENU(9);
							};
							// MSG Editor [CTRL + 3]
							if (kp.keyCode === 51){
								R3_SHOW_MENU(7);
							};
							// SAV Editor [CTRL + 4]
							if (kp.keyCode === 52){
								R3_SYSTEM.WIP();
							};
							// INI Editor [CTRL + 5]
							if (kp.keyCode === 53){
								R3_SHOW_MENU(6);
							};
							// RE3SET Editor [CTRL + 6]
							if (kp.keyCode === 54){
								R3_SYSTEM.WIP();
							};
							// New Mod (Wizard) [CTRL + N]
							if (kp.keyCode === 78){
								R3_DESIGN_displayWizard();
							};
							// Open Mod [CTRL + O]
							if (kp.keyCode === 79){
								R3_MOD.loadMod();
							};
						};
						// Go Back to RDT menu [CTRL + ']
						if (RDT_arquivoBruto !== undefined && R3_MENU_BACK_EXCLUDE.indexOf(R3_MENU_CURRENT) === -1 && kp.keyCode === 192){
							R3_MINIWINDOW.close([6, 10]);
							R3_DESIGN_RDT_closeFileList();
							R3_SHOW_MENU(10);
						};
					};
					// Open Next Map on RDT Editor
					if (R3_MENU_CURRENT === 10 && R3_MINI_WINDOW_DATABASE[6][5] === false){
						// Next Map [CTRL + Right Arrow]
						if (R3_keyPress.KEY_CONTROL === true && R3_keyPress.KEY_SHIFT === false && kp.keyCode === 39){
							R3_RDT_openNextPrevMap(0);
						};
						// Next Map [CTRL + Left Arrow]
						if (R3_keyPress.KEY_CONTROL === true && R3_keyPress.KEY_SHIFT === false && kp.keyCode === 37){
							R3_RDT_openNextPrevMap(1);
						};
					};
					// Open RDT file list [CTRL + Q]
					if (R3_MENU_CURRENT === 4 || R3_MENU_CURRENT === 10 || R3_MENU_CURRENT === 9 || R3_MENU_CURRENT === 7){
						if (R3_keyPress.KEY_CONTROL === true && kp.keyCode === 81){
							R3_DESIGN_RDT_openFileList();
							R3_SHOW_MENU(10);
							if (RDT_arquivoBruto === undefined){
								TMS.css('BTN_MAIN_27', {'display': 'none'});
							};
						};
					};
					/*
						SCD Editor
					*/
					if (R3_MENU_CURRENT === 9){
						// SCD - Alternate from List to code editor and etc [F2]
						if (R3_SCD_IS_EDITING === false && kp.keyCode === 113){
							R3_SCD_OPEN_CLOSE_CODE_EDITOR();
						};
						// SCD - Save / Open JS File [Code editor]
						if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1 && R3_keyPress.KEY_CONTROL === false && R3_keyPress.KEY_ALT === true){
							// Open file [ALT + O]
							if (kp.keyCode === 79){
								R3_SCD_OPEN_JS_FILE();
							};
							// Save file [ALT + S]
							if (kp.keyCode === 83){
								R3_SCD_SAVE_JS_FILE();
							};
						};
						// SCD - Open Script List [CTRL + L]
						if (R3_keyPress.KEY_SHIFT === false && R3_keyPress.KEY_CONTROL === true && kp.keyCode === 76){
							R3_MINIWINDOW.open(4);
						};
						// Navigation Shortcuts
						if (R3_SCD_IS_EDITING === false && R3_keyPress.KEY_CONTROL === true){
							// Compile JS SCD Script [CTRL + R]
							if (kp.keyCode === 82 && R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1 && R3_keyPress.KEY_SHIFT === false){
								R3_SCD_JS_START_COMPILER();
							};
							// Open edit form via shortcut [CTRL + Space]
							if (kp.keyCode === 32){
								R3_SCD_OPEN_SCRIPT_SHORTCUT();
							};
							// Open find function [CTRL + F]
							if (kp.keyCode === 70){
								R3_DESIGN_OPEN_FIND_FUNCTION();
							};
							// Add new script [CTRL + +]
							if (kp.keyCode === 187){
								R3_SCD_SCRIPT_ADD();
							};
							// Remove current script [CTRL + -]
							if (kp.keyCode === 189){
								R3_SCD_SCRIPT_REMOVE();
							}
							// Copy Function [CTRL + C]
							if (kp.keyCode === 67 && R3_SCD_FUNCTION_FOCUSED === true){
								R3_SCD_COPY_FUNCTION();
							};
							// Crop Function [CTRL + X]
							if (kp.keyCode === 88 && R3_SCD_FUNCTION_FOCUSED === true){
								R3_SCD_COPY_FUNCTION(true);
							};
							// Paste Function [CTRL + V]
							if (kp.keyCode === 86){
								// Using [SHIFT] will ask where to paste
								if (R3_keyPress.KEY_SHIFT === true){
									R3_SCD_PASTE_FUNCTION();
								} else {
									R3_SCD_PASTE_FUNCTION(true);
								};
							};
							// Delete Function [CTRL + Delete]
							if (kp.keyCode === 46){
								R3_SCD_FUNCTION_REMOVE();
							};
							// Jump to Run Script [GO_SUB] location [CTRL + J]
							if (kp.keyCode === 74 && R3_SCD_FUNCTION_FOCUSED === true){
								R3_SCD_JUMP_GOSUB();
							};
							// Import script [CTRL + I]
							if (kp.keyCode === 73 && R3_keyPress.KEY_SHIFT === false){
								R3_SCD_IMPORT_SCRIPT();
							};
							// Export Script [CTRL + SHIFT + E]
							if (R3_keyPress.KEY_SHIFT === true && kp.keyCode === 69){
								R3_SCD_EXPORT_SCRIPT();
							};
							// [CTRL + SHIFT] Combos
							if (R3_keyPress.KEY_SHIFT === true){
								// Go to first function [CTRL + SHIFT + Page Up]
								if (kp.keyCode === 33){
									R3_SCD_navigateFunctions(6);
								};
								// Go to last function [CTRL + SHIFT + Page Down]
								if (kp.keyCode === 34){
									R3_SCD_navigateFunctions(7);
								};
							};
						};
						// Open next function while edit form still open
						if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0 && R3_SCD_IS_EDITING === true && R3_keyPress.KEY_CONTROL === true && R3_keyPress.KEY_SHIFT === false){
							// Next function [CTRL + Right Arrow]
							if (kp.keyCode === 39){
								R3_SCD_openPrevNextFunction(1);
							};
							// Previous function [CTRL + Left Arrow]
							if (kp.keyCode === 37){
								R3_SCD_openPrevNextFunction(0);
							};
						};
					};
					// MSG - Shortcuts
					if (R3_MENU_CURRENT === 7 && R3_keyPress.KEY_CONTROL === true){
						// Add new message [CTRL + +]
						if (kp.keyCode === 187){
							R3_MSG_addMessage();
						};
						// Remove current message [CTRL + -]
						if (kp.keyCode === 189){
							R3_MSG_removeMessage();
						};
						// Compile Message [CTRL + R]
						if (kp.keyCode === 82){
							R3_MSG_EDIT_APPLY(3);
						};
					};
					// Apply Function [CTRL + Enter] or [ALT + Enter]
					if (R3_keyPress.KEY_CONTROL === true && kp.keyCode === 13 || R3_keyPress.KEY_ALT === true && kp.keyCode === 13){
						// SCD Editor
						if (R3_MENU_CURRENT === 9 && R3_SCD_IS_EDITING === true){
							var checkCanApply = document.getElementById('R3_SCD_EDITFUNCTION_HOLDER').innerHTML;
							if (checkCanApply !== INCLUDE_SCD_EDIT_WIP){
								TMS.triggerClick('R3_SCD_BTN_APPLY');
							} else {
								R3_SCD_cancelFunctionEdit();
							};
						};
						// MSG Editor
						if (R3_MENU_CURRENT === 7 && R3_MSG_IS_EDITING === true){
							TMS.triggerClick('R3_MSG_BTN_APPLY');
						};
					};
					// GOTO [CTRL + G]
					if (R3_keyPress.KEY_CONTROL === true && kp.keyCode === 71){
						// SCD Editor
						if (R3_MENU_CURRENT === 9){
							R3_SCD_GOTO_SCRIPT();
						};
						// MSG Editor
						if (R3_MENU_CURRENT === 7){
							R3_MSG_GOTO_MESSAGE();
						};
					};
					// Open files [CTRL + O]
					if (R3_keyPress.KEY_CONTROL === true && kp.keyCode === 79){
						// RDT Editor
						if (R3_MENU_CURRENT === 10){
							R3_RDT.loadFile();
						};
						// SCD Editor
						if (R3_MENU_CURRENT === 9){
							R3_SCD_LOAD_FILE();
						};
						// MSG Editor
						if (R3_MENU_CURRENT === 7){
							R3_MSG_LOADFILE();
						};
					};
					// New file [CTRL + N]
					if (R3_keyPress.KEY_CONTROL === true && kp.keyCode === 78){
						// RDT Editor
						if (R3_MENU_CURRENT === 10){
							R3_RDT.newFile();
						};
						// SCD Editor
						if (R3_MENU_CURRENT === 9){
							R3_SCD_NEW_FILE();
						};
						// MSG Editor
						if (R3_MENU_CURRENT === 7){
							R3_MSG_NEW_FILE();
						};
					};
					// Save files [CTRL + S]
					if (R3_keyPress.KEY_CONTROL === true && kp.keyCode === 83){
						// RDT Editor
						if (R3_MENU_CURRENT === 10 && RDT_arquivoBruto !== undefined){
							R3_RDT.compile();
						};
						// SCD Editor
						if (R3_MENU_CURRENT === 9 && SCD_arquivoBruto !== undefined){
							R3_SCD_COMPILE(0);
						};
						// MSG Editor
						if (R3_MENU_CURRENT === 7 && MSG_arquivoBruto !== undefined){
							R3_MSG_COMPILE(0);
						};
					};
					// Swap Bar Pos [F3]
					if (kp.keyCode === 114 && R3_keyPress.keyUpToggleTimout !== true && R3_GAME.gameRunning !== false){
						R3_LIVESTATUS_BAR_TOGGLEPOS();
					};
					// Open RE3 Livestatus [F4]
					if (kp.keyCode === 115 && R3_keyPress.keyUpToggleTimout !== true && R3_GAME.gameRunning !== false){
						R3_LIVESTATUS_OPEN_MENU();
					};
					// Run Game
					if (R3_GAME.gameRunning !== true){
						// [F5]: Run RE3 (Mod)
						if (kp.keyCode === 118){
							R3_GAME.run(0);
						};
						// [F6]: Run MERCE
						if (kp.keyCode === 119){
							R3_GAME.run(1);
						};
						// [F7]: Run RE3
						if (kp.keyCode === 116){
							R3_GAME.run(2);
						};
						// [F8]: Run MERCE (MOD)
						if (kp.keyCode === 117){
							R3_GAME.run(3);
						};
					};
					// [F9]: Go to title screen
					if (kp.keyCode === 120 && R3_GAME.gameRunning === true){
						R3_LIVESTATUS.gotoTitleScreen();
					};
					// Apply SCD Hack / Open Hex Window
					if (R3_keyPress.KEY_CONTROL === true && RDT_arquivoBruto !== undefined && kp.keyCode === 72){
						/*
							APPLY SCD HACK [CTRL + SHIFT + H]
							Remove the lines below when this feature becomes obsolete
						*/
						if (R3_keyPress.KEY_SHIFT === true){
							R3_RDT.scdHack.applyHack(true);
						} else {
							R3_MINIWINDOW.open(3);
						};
					};
					// Open Backup Manager [CTRL + SHIFT + B]
					if (R3_keyPress.KEY_CONTROL === true && R3_keyPress.KEY_SHIFT === true && kp.keyCode === 66){
						R3_DESIGN_renderBackupManager();
					};
				};
			}
			// Reload [CTRL + SHIFT + R]
			if (kp.keyCode === 82 && R3_keyPress.KEY_SHIFT === true && R3_keyPress.KEY_CONTROL === true){
				R3_SYSTEM.reload();
			};
			// Update text data on SCD Code editor
			if (R3_MENU_CURRENT === 9 && R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1){
				R3_SCD_CODE_updateTextData();
			};
		});
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: (Keyboard) This function is already initialized!');
	};
};
/*
	End
*/
const R3_keyPress = tempFn_R3_keyPress;
delete tempFn_R3_keyPress;

/*
	SCD Code Editor Functions
*/
function R3_SCD_CODE_EDITOR_KEYFIX(evt){
	// console.info(evt);
	R3_SCD_CODE_updateTextData();
	// Fix [TAB] focus
	if (evt.keyCode === 9){
		evt.preventDefault();
		var codeArea = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA'), st = codeArea.selectionStart, ed = codeArea.selectionEnd;
		codeArea.value = codeArea.value.substring(0, st) + '\t' + codeArea.value.substring(ed);
		codeArea.selectionStart = codeArea.selectionEnd = (st + 1);
	};
};
// Enhance code typing
function R3_SCD_CODE_EDITOR_enhanceType(evt){
	const textData = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value,
		latestChar = textData.slice(textData.length - 1), autoCompleteDatabase = {
			'{': '}',
			'[': ']',
			'(': ')'
		}, skipChar = [8, 46]; // Skip Delete and Backspace keys
	// Auto-complete keys
	if (Object.keys(autoCompleteDatabase).indexOf(latestChar) !== -1 && skipChar.indexOf(evt.keyCode) === -1){
		document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value = textData + autoCompleteDatabase[latestChar];
	};
};
/*
	Mouse
	General Functions
*/
tempFn_R3_mouse = {
	MOUSE_INIT_OK: false
};
// Initialize mouse
tempFn_R3_mouse['INIT'] = function(){
	if (R3_mouse.MOUSE_INIT_OK === false){
		R3_mouse.MOUSE_INIT_OK = true;
		// Mouse Wheel
		document.addEventListener('wheel', function(mWheel){
			// console.info(mWheel.deltaY);
			if (R3_MENU_CURRENT === 9){
				// While not editing
				if (R3_SCD_IS_EDITING === false && R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
					// Focus previous function [CTRL + Mouse Scroll Up]
					if (R3_keyPress.KEY_CONTROL === true && mWheel.deltaY < 0){
						// Normal
						if (R3_keyPress.KEY_SHIFT === false){
							R3_SCD_navigateFunctions(0);
						} else {
							// -10 [CTRL + SHIFT + Mouse Scroll Up]
							R3_SCD_navigateFunctions(3);
						};
					};
					// Focus next function [CTRL + Mouse Scroll Down]
					if (R3_keyPress.KEY_CONTROL === true && mWheel.deltaY > 0){
						// Normal
						if (R3_keyPress.KEY_SHIFT === false){
							R3_SCD_navigateFunctions(1);
						} else {
							// +10 [CTRL + SHIFT + Mouse Scroll Down]
							R3_SCD_navigateFunctions(4);
						};
					};
				};
				// JS Code editor
				if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1){
					// Text Size
					if (R3_keyPress.KEY_CONTROL === true){
						// Zoom +
						if (mWheel.deltaY < 0){
							R3_DESIGN_CODE_zoomMode(0);
						} else {
							R3_DESIGN_CODE_zoomMode(1);
						};
						// Update Text labels
						R3_SCD_CODE_updateTextData();
					};
				};
			};
			// Prevent page zoom
			if (R3_keyPress.KEY_CONTROL === true){
				mWheel.preventDefault();
			};
		}, {passive: false});
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: (Mouse) This function is already initialized!');
	};
};
/*
	End
*/
const R3_mouse = tempFn_R3_mouse;
delete tempFn_R3_mouse;