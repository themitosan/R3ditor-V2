/*
	R3ditor V2 - scd.js
	Aka: The largest file inside R3V2!
*/
var R3_SCD_path = '',
	SCD_arquivoBruto,
	R3_SCD_fileName = '',
	R3_SCD_POINTERS = [],
	SCD_HEADER_LENGTH = 0,
	R3_SCD_SCRIPTS_LIST = {},
	R3_SCD_TOTAL_SCRITPS = 0,
	R3_SCD_IS_EDITING = false,
	SCD_FN_SEARCH_RESULT = [],
	R3_SCD_currentOpcode = '',
	R3_SCD_CURRENT_SCRIPT = 0,
	R3_SCD_TOTAL_FUNCTIONS = 0,
	R3_SCD_previousOpcode = [],
	R3_TEMP_INSERT_OPCODE = '',
	R3_SCD_CURREN_HEX_VIEW = '',
	R3_SCD_ID_LIST_ENTRIES = {},
	R3_SCD_CURRENT_FUNCTION = 0,
	R3_SCD_TEMP_GOSUB_VALUE = 0,
	R3_SCD_ID_OM_SET_ENTRIES = {},
	R3_SCD_SCRIPT_ACTIVE_LIST = [],
	R3_SCD_CURRENT_SCRIPT_HEX = '',
	R3_SCD_TEMP_COPY_PASTE_FUNCTION,
	R3_SCD_FUNCTION_FOCUSED = false,
	R3_SCD_SCRIPTS_IS_LOADING = false,
	R3_SCD_OVERALL_TOTAL_FUNCTIONS = 0;
/*
	Functions
*/
// Create a new file
function R3_SCD_NEW_FILE(){
	if (R3_SCD_IS_EDITING === false){
		R3_DESIGN_CLEAN_SCD();
		R3_UTILS_VAR_CLEAN_SCD();
		R3_SCD_fileName = 'Untitled';
		SCD_arquivoBruto = '06000a000c001902010001000100';
		R3_SCD_START_DECOMPILER(SCD_arquivoBruto);
		R3_DESIGN_SCD_openScriptList();
		document.title = APP_TITLE + ' - SCD Editor - File: ' + R3_SCD_fileName + '.SCD';
	};
};
// Load SCD / RDT File
function R3_SCD_LOAD_FILE(){
	R3_FILE_LOAD('.scd, .rdt', function(scdFile, hxFile){
		R3_SCD_STARTLOAD(scdFile, hxFile);
	});
};
// Start Load Process
function R3_SCD_STARTLOAD(scdFile, hxFile){
	var fName, loaderInterval;
	if (R3_WEBMODE === false){
		fName = R3_getFileExtension(scdFile).toLowerCase();
	} else {
		fName = R3_getFileExtension(scdFile.name).toLowerCase();
	};
	R3_SCD_HIGHLIGHT_FUNCTION = 0;
	if (fName !== 'scd' && fName !== 'rdt'){
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: This is not a valid SCD file!');
	} else {
		R3_DESIGN_CLEAN_SCD();
		R3_UTILS_VAR_CLEAN_SCD();
		if (R3_WEBMODE === false){
			ORIGINAL_FILENAME = scdFile;
		} else {
			ORIGINAL_FILENAME = scdFile.name;
		};
		if (hxFile === undefined){
			SCD_arquivoBruto = APP_FS.readFileSync(scdFile, 'hex');
		} else {
			SCD_arquivoBruto = hxFile;
		};
		// Start
		if (R3_WEBMODE === false){
			R3_SCD_fileName = R3_getFileName(scdFile).toUpperCase();
		} else {
			R3_SCD_fileName = R3_getFileName(scdFile.name).toUpperCase();
		};
		R3_SYSTEM_LOG('log', 'SCD - Loading file: <font class="user-can-select">' + scdFile + '</font>');
		document.title = APP_TITLE + ' - SCD Editor - File: ' + R3_SCD_fileName + '.' + fName.toUpperCase();
		if (fName === 'scd'){
			R3_SCD_path = scdFile;
			R3_SCD_START_DECOMPILER(SCD_arquivoBruto);
		};
		if (fName === 'rdt'){
			R3_SCD_EXTRACT_FROM_RDT(scdFile, SCD_arquivoBruto);
		};
		// End
		R3_LATEST_SET_FILE(R3_SCD_fileName + '.' + fName.toUpperCase(), 2, ORIGINAL_FILENAME);
		R3_DESIGN_SCD_openScriptList();
	};
};
// Extract SCD from RDT
function R3_SCD_EXTRACT_FROM_RDT(rdtFile, hx){
	R3_RDT_LOAD(rdtFile, false, hx);
	if (R3_WEBMODE === false){
		document.title = APP_TITLE + ' - SCD Editor - File: ' + R3_getFileName(rdtFile).toUpperCase() + '.RDT';
	} else {
		document.title = APP_TITLE + ' - SCD Editor - File: ' + R3_getFileName(rdtFile.name).toUpperCase() + '.RDT';
	};
	// End
	var lInterval = setInterval(function(){
		if (R3_RDT_LOADED === true){
			SCD_arquivoBruto = R3_RDT_RAWSECTION_SCD;
			R3_SCD_START_DECOMPILER(R3_RDT_RAWSECTION_SCD);
			clearInterval(lInterval);
		} else {
			console.info('SCD - Waiting RDT to load...');
		};
	}, 50);
};
/*
	Start SCD Decompiler
	This process will read the SCD and separate by scripts, to be read apart
*/
function R3_SCD_START_DECOMPILER(hex){
	// DoorLink Fix
	if (SCD_arquivoBruto === undefined){
		SCD_arquivoBruto = hex;
	};
	// Start process
	var TEMP_R3_SCD_POINTERS;
	R3_SCD_OVERALL_TOTAL_FUNCTIONS = 0;
	SCD_HEADER_LENGTH = R3_getPosFromHex(hex.slice(0, 4));
	// Add INIT pointer to script list
	R3_SCD_POINTERS.push(R3_parseEndian(hex.slice(0, 4)));
	// Add EXECS pointers
	TEMP_R3_SCD_POINTERS = hex.slice(4, (SCD_HEADER_LENGTH)).match(/.{4,4}/g).forEach(function(tmpPointer){
		R3_SCD_POINTERS.push(R3_parseEndian(tmpPointer));
	});
	// console.info(TEMP_R3_SCD_POINTERS);
	R3_SCD_TOTAL_SCRITPS = R3_SCD_POINTERS.length;
	R3_SCD_POINTERS.forEach(function(a, b){
		R3_SCD_GENERATE_LIST(b, hex, R3_SETTINGS.SETTINGS_SCD_DECOMPILER_ENABLE_LOG);
	});
	// End
	if (R3_SETTINGS.SETTINGS_SCD_DECOMPILER_ENABLE_LOG === true && R3_DOORLINK_RUNNING === false){
		R3_SYSTEM_LOG('separator');
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Finished loading SCD with ' + R3_SCD_TOTAL_SCRITPS + ' scripts, totalizing ' + R3_SCD_OVERALL_TOTAL_FUNCTIONS + ' functions.');
	};
	R3_SCD_displayScript(0);
};	
// Display Script
function R3_SCD_displayScript(scriptId){
	if (scriptId !== undefined && scriptId !== '' && R3_SCD_SCRIPTS_IS_LOADING === false && R3_DOORLINK_RUNNING === false){
		if (R3_SCD_SCRIPTS_LIST[scriptId] !== undefined){
			R3_SCD_CURRENT_SCRIPT = scriptId;
			R3_DESIGN_SCD_UPDATE_SELECT(scriptId);
			R3_SCD_RENDER_SCRIPT(scriptId, true);
			if (R3_SCD_previousOpcode[(R3_SCD_previousOpcode.length - 2)] !== R3_SCD_currentOpcode){
				R3_SCD_cancelFunctionEdit();	
			};
		} else {
			R3_SCD_WARN(0, scriptId);
		};
	};
};
// Check script active status
function R3_SCD_checkScriptActive(){
	if (SCD_arquivoBruto !== undefined){
		R3_SCD_SCRIPT_ACTIVE_LIST = Array(255).fill(false);
		R3_SCD_SCRIPT_ACTIVE_LIST[0] = true;
		R3_SCD_SCRIPT_ACTIVE_LIST[1] = true;
		// Start
		Object.keys(R3_SCD_SCRIPTS_LIST).forEach(function(cItem){
			const cScript = R3_SCD_SCRIPTS_LIST[cItem];
			cScript.forEach(function(cFunction){
				var cArgs, cOpcode = cFunction.slice(0, 2);
				if (cOpcode === '19'){
					cArgs = parseInt(cFunction.slice(2, 4), 16);
					R3_SCD_SCRIPT_ACTIVE_LIST[cArgs] = true;
				};
			});
		});
		// End
		R3_SCD_renderScriptActiveStatus();
	};
};
// Advance / Return Script
function R3_SCD_SKIPSCRIPT(mode){
	if (SCD_arquivoBruto !== undefined){
		if (mode !== undefined && R3_SCD_IS_EDITING === false){
			var nextScript = R3_SCD_CURRENT_SCRIPT;
			R3_SCD_HIGHLIGHT_FUNCTION = 0;
			if (mode === 0 || mode === undefined){
				nextScript--;
				if (nextScript < 0){
					nextScript = 0;
				};
			};
			if (mode === 1){
				nextScript++;
				if (nextScript > (R3_SCD_TOTAL_SCRITPS - 1)){
					nextScript = (R3_SCD_TOTAL_SCRITPS - 1);
				};
			};
			// Render fix
			if (R3_SCD_CURRENT_SCRIPT !== nextScript){
				R3_SCD_CURRENT_SCRIPT = nextScript;
				TMS.scrollCenter('R3_SCD_SCRIPT_ID_' + R3_SCD_CURRENT_SCRIPT);
				R3_SCD_displayScript(R3_SCD_CURRENT_SCRIPT);
				R3_SCD_HIGHLIGHT_FUNCTION = 0;
				R3_SCD_navigateFunctions(2);
			};
		} else {
			if (R3_SCD_IS_EDITING === false && SCD_arquivoBruto === undefined){
				R3_SCD_NEW_FILE();
			};
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
// Open Script using shortcut [CTRL + Space]
function R3_SCD_OPEN_SCRIPT_SHORTCUT(){
	if (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][R3_SCD_HIGHLIGHT_FUNCTION] !== undefined){
		var c = 0;
		while (c < R3_SCD_TOTAL_FUNCTIONS){
			TMS.css('R3_SCD_scriptCommand_' + c, {'box-shadow': '0px 0px 0px #000'});
			c++;
		};
		R3_SCD_FUNCTION_EDIT(R3_SCD_HIGHLIGHT_FUNCTION);
	};
};
// Open JS Script
function R3_SCD_OPEN_JS_FILE(){
	if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1){
		R3_FILE_LOAD('.js, .txt', function(jsFile, jsFile){
			document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value = jsFile;
			R3_SCD_CODE_updateTextData();
		}, undefined, 'utf-8');
	};
};
// Save JS Script
function R3_SCD_SAVE_JS_FILE(){
	if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1){
		var canSave = true, fName = errorReason = '', textCode = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value;
		if (textCode === ''){
			canSave = false;
			errorReason = errorReason + '\nThe JS script are blank! Please, insert required function to proceed.';
		};
		// End
		if (canSave === true){
			fName = 'R3_JS_' + R3_SCD_fileName + '_S' + R3_SCD_CURRENT_SCRIPT + '.js';
			R3_FILE_SAVE(fName, textCode, 'utf-8', '.js, .txt', function(finalPath){
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - Save Successful! - File: ' + fName);
				if (R3_WEBMODE === false){
					R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + finalPath + '</font>');
				};
				R3_DESIGN_JS_CODE_FOCUS();
			});
		} else {
			R3_SYSTEM_LOG('separator');
			R3_SYSTEM_ALERT('WARN: Unable to save JS Script!' + errorReason);
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to save JS Script! <br>Reason: ' + errorReason);
		};
	};
};
/*
	Search Functions
*/
function R3_SCD_SEARCH_SCRIPT_FUNCTION(functionOpcode, skipAlert){
	// Checks Before Search
	if (SCD_arquivoBruto !== undefined){
		var canSearch = true, opcodeSearch, tempScript, SCD_SEARCH_RESULTS = [];
		if (R3_DOORLINK_RUNNING === false){
			R3_cleanHexFromInput('R3_SCD_SEARCH_SCD_SCRIPT_INPUT');
			opcodeSearch = R3_cleanHex(document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_INPUT').value).toLowerCase();
		};
		if (functionOpcode !== undefined && functionOpcode !== ''){
			opcodeSearch = functionOpcode.toLowerCase();
		};
		// Check length
		if (R3_DOORLINK_RUNNING === false && opcodeSearch.length !== 2){
			canSearch = false;
		};
		// Check if is a valid SCD function
		if (parseInt(opcodeSearch, 16) !== NaN && parseInt(opcodeSearch, 16) > 143){
			canSearch = false;
			R3_SYSTEM_ALERT('WARN: This is not a valid SCD opcode!');
			document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_INPUT').value = '';
		};
		// Remove End Script [EVT_END] from search
		if (opcodeSearch === '01'){
			canSearch = false;
			document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_INPUT').value = '';
		};
		// End
		if (canSearch === true){
			document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_INPUT').value = '';
			// Start Search
			if (skipAlert !== true){
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Searching for Opcode <font class="user-can-select">' + opcodeSearch.toUpperCase() + '</font>...');
			};
			Object.keys(R3_SCD_SCRIPTS_LIST).forEach(function(cItem, cIndex){
				tempScript = R3_SCD_SCRIPTS_LIST[cIndex].filter(function(data){
					return data.slice(0, 2) === opcodeSearch;
				});
				if (tempScript.length !== 0){
					tempScript.forEach(function(cData, dataIndex){
						SCD_SEARCH_RESULTS.push([cIndex, R3_SCD_SCRIPTS_LIST[cIndex].indexOf(cData)]);
					});
				};
			});
			// Check Results
			if (SCD_SEARCH_RESULTS.length !== 0){
				if (R3_DOORLINK_RUNNING === true){
					return SCD_SEARCH_RESULTS;
				} else {
					// Prepare form
					R3_SCD_SEARCH_HIGHLIGHT_FUNCTION = 0;
					document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_RESULT').innerHTML = '';
					// Print result
					var cScript, HTML_RESULT_TEMPLATE = '';
					SCD_SEARCH_RESULTS.forEach(function(rItem, rIndex){
						cScript = SCD_SEARCH_RESULTS[rIndex][0], cFunction = SCD_SEARCH_RESULTS[rIndex][1], cLabel = cScript;
						cLabel = R3_fixVars(cScript, 3);
						if (SCD_scriptNames[cLabel] !== undefined){
							cLabel = SCD_scriptNames[cLabel];
						};
						HTML_RESULT_TEMPLATE = HTML_RESULT_TEMPLATE + '<div class="R3_SCRIPT_LIST_ITEM R3_SCRIPT_LIST_ITEM_NORMAL" id="R3_SCD_SEARCH_FIND_FN_' + rIndex + '">Script <font class="monospace mono_xyzr">' + cLabel + '</font> - Function <font class="monospace mono_xyzr">' + R3_fixVars(parseInt(cFunction + 1), 3) +
											   '</font><input type="button" class="BTN_R3CLASSIC R3_SCRIPT_LIST_ITEM_BTN" value="GOTO" onclick="R3_DESIGN_SCD_focusResultFromSearchForm(' + rIndex + ');R3_SCD_SEARCH_GOTO_FUNCTION(' + cScript + ', ' + cFunction + ');"></div>';
					});
					// End
					R3_KEYPRESS_ALT = false;
					SCD_FN_SEARCH_RESULT = SCD_SEARCH_RESULTS;
					R3_SCD_SEARCH_OPCODE_ADDCOLOR(R3_SCD_DATABASE[opcodeSearch][2]);
					document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_RESULT').scrollTop = 0;
					document.getElementById('R3_SCD_SEARCH_SCD_SCRIPT_RESULT').innerHTML = HTML_RESULT_TEMPLATE;
					document.getElementById('R3_LBL_SCD_SEARCH_FUNCTION_OPCODE').title = R3_SCD_INFO_DATABASE[opcodeSearch];
					document.getElementById('R3_LBL_SCD_SEARCH_FUNCTION_OPCODE').innerHTML = R3_SCD_DATABASE[opcodeSearch][1];
				};
			} else {
				if (skipAlert !== true){
					R3_SYSTEM_ALERT('WARN: Unable to find this opcode!\n\nOpcode: ' + opcodeSearch.toUpperCase() + ' (' + R3_SCD_DATABASE[opcodeSearch][1] + ')');
					R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to find this opcode! (Opcode: <font class="user-can-select">' + opcodeSearch.toUpperCase() + '</font> [' + R3_SCD_DATABASE[opcodeSearch.toLowerCase()][1] + '])');
				};
			};
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	GOTO
	Jump to an specific script
*/
// Jump using a destination [CTRL + G]
function R3_SCD_GOTO_SCRIPT(){
	if (SCD_arquivoBruto !== undefined){
		var scriptId, askScript = R3_SYSTEM_PROMPT('Please insert the script you want to jump below:');
		if (askScript !== '' && askScript !== null){
			scriptId = parseInt(askScript);
			if (scriptId !== undefined && R3_SCD_SCRIPTS_LIST[scriptId] !== undefined && scriptId !== NaN){
				R3_SCD_CURRENT_SCRIPT = scriptId;
				R3_SCD_displayScript(scriptId);
			} else {
				if (scriptId !== NaN && R3_SCD_SCRIPTS_LIST[scriptId] === undefined){
					R3_SCD_WARN(0, scriptId);
				} else {
					R3_SYSTEM_ALERT('WARN - The script ' + scriptId + ' is not available!');
					R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: The script ' + scriptId + ' is not available!');
				};
			};
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
// Jump using Run script [GO_SUB] coords. [CTRL + J] 
function R3_SCD_JUMP_GOSUB(){
	if (SCD_arquivoBruto !== undefined){
		var nScript, cScript = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][R3_SCD_HIGHLIGHT_FUNCTION];
		if (cScript.slice(0, 2) === '19'){
			nScript = parseInt(cScript.slice(2, 4), 16);
			if (R3_SCD_SCRIPTS_LIST[nScript] !== undefined){
				R3_SCD_HIGHLIGHT_FUNCTION = 0;
				R3_SCD_CURRENT_SCRIPT = nScript;
				R3_SCD_displayScript(R3_SCD_CURRENT_SCRIPT);
				R3_SCD_navigateFunctions(2);
			} else {
				R3_DESIGN_MINIWINDOW_OPEN(0);
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (SCD) Unable to jump to script ' + nScript + ' because it does not exist! <br><u>WARNING</u>: If you are seeing this message, this means this code is broken! <br>Create script ' + nScript + ' before saving this code on RDT!');
			};
		} else {
			R3_SYSTEM_LOG('separator');
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to jump since the highlighted function aren\'t Run script [GO_SUB]! <br>(' + R3_SCD_HIGHLIGHT_FUNCTION + ') Function: ' + R3_SCD_DATABASE[cScript.slice(0, 2)][1]);
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	Inject Hex Function
*/
function R3_SCD_INSERT_HEX(){
	if (SCD_arquivoBruto !== undefined){
		var askForHex, sortHex, skipPreview = false;
		if (R3_KEYPRESS_CONTROL === true){
			skipPreview = true;
		};
		askForHex = R3_SYSTEM_PROMPT('Please, insert the hex code below:\n(It must be only one function, more than one will break!)');
		if (askForHex !== null && askForHex !== ''){
			// Check function length
			sortHex = R3_solveHEX(askForHex);
			if (R3_isInteger(sortHex.length) === true){
				var cOpcode = sortHex.slice(0, 2),
					cLength = parseInt(R3_SCD_DATABASE[cOpcode][0] * 2),
					canApplyHex = true, reason = '',
					testStr = (sortHex.length / 2);
				// Check if is End Script [EVT_END]
				if (cOpcode === '01'){
					canApplyHex = false;
					reason = 'You can\'t add End Script [EVT_END] since it is hardcoded! (' + sortHex + ')';
				} else {
					if (sortHex.length !== cLength){
						canApplyHex = false;
						reason = 'The hex length for ' + R3_SCD_DATABASE[cOpcode][1] + ' are wrong!';
					};
				};
			} else {
				canApplyHex = false;
				reason = 'The user inserted a broken hex!';
			};
			// End
			if (canApplyHex === true){
				if (skipPreview === false){
					R3_TEMP_INSERT_OPCODE = sortHex.slice(0, 2);
					R3_DESIGN_OPEN_SCD_INSERT_PREVIEW(sortHex);
				} else {
					R3_SCD_COMPILE_INSERT_HEX(sortHex, 0);
				};
			} else {
				R3_SYSTEM_LOG('WARN', 'R3ditor V2 - WARN: Unable to insert hex! <br>Reason: ' + reason);
				R3_SYSTEM_ALERT('WARN - Unable to insert hex!\nReason: ' + reason);
			};
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
// Process insert hex data
function R3_SCD_PREPARE_INSERT_HEX(hex, iPos){
	if (hex !== undefined){
		var pos;
		if (iPos === undefined){
			pos = document.getElementById('R3_SCD_EXTRA_EDIT_INSERT_POS').value;
		} else {
			pos = parseInt(iPos);
		};
		if (parseInt(pos) === NaN || pos === ''){
			pos = 0;
		};
		pos = (parseInt(pos) - 1);
		if (pos < 0){
			pos = 0;
		};
		if (pos > (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length - 1)){
			pos = (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length - 1);
		};
		R3_SCD_COMPILE_INSERT_HEX(hex, pos);
		R3_SCD_cancelFunctionEdit();
	};
};
// Compile insert hex
function R3_SCD_COMPILE_INSERT_HEX(hex, pos){
	if (SCD_arquivoBruto !== undefined){
		R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].splice(pos, 0, hex);
		R3_TEMP_INSERT_OPCODE = '';
		R3_SCD_COMPILE(3);
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	Import / Export Script
*/
function R3_SCD_IMPORT_SCRIPT(){
	if (SCD_arquivoBruto !== undefined){
		R3_FILE_LOAD('.R3SCRIPT', function(fileName, tempHex){
			var c = 0, canImport = true, reason, tempArray = [];
			// Checks
			if (tempHex === '0100' || tempHex === ''){
				canImport = false;
				reason = 'This script is empty (Error Code: 00)';
			};
			if (tempHex.slice((tempHex.length - 4), tempHex.length) !== '0100'){
				canImport = false;
				reason = 'This script does not finalize the code! (Error Code: 01)';
			};
			if (R3_isInteger(tempHex.length / 2) === false){
				canImport = false;
				reason = 'The hex code is broken! (Error Code: 02)';
			};
			// End
			if (canImport === true){
				while (c < tempHex.length){
					var cOpcode = tempHex.slice(c, (c + 2)),
						cLength = parseInt(R3_SCD_DATABASE[cOpcode][0] * 2);
					tempArray.push(tempHex.slice(c, (c + cLength)));
					c = parseInt(c + cLength);
				};
				R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT] = tempArray;
				R3_SCD_COMPILE(3);
				if (R3_WEBMODE === false){
					R3_SYSTEM_ALERT('INFO - Import Successful!\nPath: ' + fileName);
				} else {
					R3_SYSTEM_ALERT('INFO - Import Successful!');
				};
			} else {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to import script! <br>Reason: ' + reason);
				R3_SYSTEM_ALERT('WARN - Unable to import script!\n\nReason: ' + reason);
			};
		}, undefined, 'hex');
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	Export
	Modes:

	0: Save As
*/
function R3_SCD_EXPORT_SCRIPT(mode){
	if (SCD_arquivoBruto !== undefined){
		if (mode === undefined || mode === ''){
			mode = 0;
		};
		var fileName, sName = R3_SCD_CURRENT_SCRIPT, canExport = true, reason = '', tempHex = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].toString().replace(new RegExp(',', 'g'), '');
		if (tempHex === '0100'){
			canExport = false;
			reason = 'This script is empty! (Error Code: 00)';
		};
		// End
		if (canExport === true){
			try {
				fileName = R3_SCD_fileName + '_S' + R3_fixVars(R3_SCD_CURRENT_SCRIPT, 2) + '.R3SCRIPT';
				if (SCD_scriptNames[R3_SCD_CURRENT_SCRIPT] !== undefined){
					fileName = R3_SCD_fileName + '_S' + SCD_scriptNames[R3_SCD_CURRENT_SCRIPT] + '.R3SCRIPT';
				};
				if (mode === 0){
					R3_FILE_SAVE(fileName, tempHex, 'hex', '.R3SCRIPT', function(scdPath){
						if (R3_WEBMODE === false){
							R3_SYSTEM_ALERT('Export Successful!\nPath: ' + scdPath);
						} else {
							R3_SYSTEM_ALERT('Export Successful!');
						};
					});
				};
			} catch (err) {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to export script! <br>Reason: ' + err);
				R3_SYSTEM_ALERT('WARN - Unable to export script!\n\nReason: (JS) ' + err);
			};
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to export script! <br>Reason: ' + reason);
			R3_SYSTEM_ALERT('WARN - Unable to export script!\n\nReason: ' + reason);
		};
	};
};
/*
	SCD Preset
*/
function R3_SCD_usePreset(presetId){
	if (SCD_arquivoBruto !== undefined){
		var c = 0, insertPos, ask, nextPreset = R3_SCD_PRESET_LIST[parseInt(presetId)][1].reverse();
		if (nextPreset !== undefined){
			if (R3_KEYPRESS_CONTROL === true){
				ask = parseInt(R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length);
			} else {
				ask = R3_SYSTEM_PROMPT('Please, insert the position where \"' + R3_SCD_PRESET_LIST[parseInt(presetId)][0] + '\" will be inserted below:');
			};
			// Start
			if (ask !== null && ask !== ''){
				insertPos = parseInt(ask - 1);
				if (insertPos < 0){
					insertPos = 0;
				};
				if (insertPos > R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length){
					insertPos = parseInt(R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length - 1);
				};
				// Start Process
				while (c < nextPreset.length){
					R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].splice(insertPos, 0, nextPreset[c]);
					ask++;
					c++;
				};
				R3_SCD_COMPILE(3);
				R3_DESIGN_MINIWINDOW_CLOSE(8);
			};
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	Add Scripts to list
	The 1st one always gonna be the INIT and the second AutoExec
*/
function R3_SCD_GENERATE_LIST(pointerPos, SCD_RAW, debugLog){
	try {
		R3_SCD_SCRIPTS_LIST[pointerPos] = [];
		var c = d = cFunction = 0, TEMP_SCD_READ = TEMP_SCD_SETTINGS = HTML_INIT_SCRIPT_TEMP = INIT_TEXT = scriptOff = textLabel = '', END_SCRIPT = false;
		TEMP_SCD_READ = SCD_RAW.slice(R3_parseHexLengthToString(R3_SCD_POINTERS[pointerPos])).match(/.{2,2}/g);
		if (debugLog === true){
			R3_SYSTEM_LOG('separator');
			if (SCD_scriptNames[pointerPos] !== undefined){
				INIT_TEXT = '(' + SCD_scriptNames[pointerPos] + ')';
			};
			R3_SYSTEM_LOG('log', 'R3ditor V2 - SCD: Reading Script ' + pointerPos + ' ' + INIT_TEXT);
		};
		while (END_SCRIPT !== true){
			if (c < TEMP_SCD_READ.length){
				// Seek by function in SCD Functions database
				if (R3_SCD_DATABASE[TEMP_SCD_READ[c]] !== undefined){
					try {
						// Read information of current opcode
						d = c;
						cFunction++;
						R3_SCD_OVERALL_TOTAL_FUNCTIONS++;
						var opcodeInfo,	OPCODE_HEX = TEMP_SCD_READ[c].toLowerCase(), OPCODE_LENGTH = R3_SCD_DATABASE[OPCODE_HEX][0];
						if (debugLog === true && R3_DOORLINK_RUNNING === false){
							opcodeInfo = 'SCD: Script ' + pointerPos + ' - Function: ' + R3_fixVars(cFunction, 4) + ' \nOpcode: <font class="R3_SCD_function_' + R3_SCD_DATABASE[OPCODE_HEX.toLowerCase()][2] + 
										 ' no-bg-image user-can-select">' + OPCODE_HEX.toUpperCase() + '</font> (<font class="R3_SCD_function_' + R3_SCD_DATABASE[OPCODE_HEX.toLowerCase()][2] + ' no-bg-image">' + R3_SCD_DATABASE[OPCODE_HEX][1] + 
										 '</font>)\nHex length: <font class="user-can-select">' + R3_fixVars(OPCODE_LENGTH.toString(16), 2).toUpperCase() + '</font>';
							R3_SYSTEM_LOG('log', opcodeInfo);
						};
						// Retreive all subcodes and add to string
						while (d < (c + OPCODE_LENGTH)){
							TEMP_SCD_SETTINGS = TEMP_SCD_SETTINGS + TEMP_SCD_READ[d];
							d++;
						};
						// Push to functions list inside script
						R3_SCD_SCRIPTS_LIST[pointerPos].push(TEMP_SCD_SETTINGS);
						// Check if is END of script (01 00)
						if (OPCODE_HEX === '01'){
							END_SCRIPT = true;
						};
						// End
						TEMP_SCD_SETTINGS = '';
						c = d;
					} catch (err) {
						R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to render opcode <font class="user-can-select">' + TEMP_SCD_READ[c] + '</font> <br>Reason: ' + err);
						END_SCRIPT = true;
					};
				} else {
					R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to find SCD Opcode <font class="user-can-select">' + TEMP_SCD_READ[c].toUpperCase() + '</font>, Adding as a single hex...');
					R3_SCD_SCRIPTS_LIST[pointerPos];
					c++;
				};
			} else {
				// Reach the end of raw file
				END_SCRIPT = true;
			};
		};
		// End
		if (R3_DOORLINK_RUNNING === false){
			textLabel = 'Script ' + pointerPos;
			if (SCD_scriptNames[pointerPos] !== undefined){
				textLabel = 'Script ' + SCD_scriptNames[pointerPos];
			};
			HTML_INIT_SCRIPT_TEMP = '<div class="R3_SCRIPT_LIST_ITEM R3_SCRIPT_LIST_ITEM_NORMAL" id="R3_SCD_SCRIPT_ID_' + pointerPos + '"><div class="R3_SCD_SCRIPT_LIST_ACTIVE" id="R3_SCD_SCRIPT_LIST_ACTIVE_' + pointerPos + '">' +
									'</div>' + textLabel + '<input type="button" class="BTN_R3CLASSIC R3_SCRIPT_LIST_ITEM_BTN" value="Load Script" onclick="R3_SCD_displayScript(' + pointerPos + ');"></div>';
			TMS.append('R3_SCD_SCRIPT_LISTS', HTML_INIT_SCRIPT_TEMP);
		};
	} catch (err) {
		R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to generate script list! <br>Details: ' + err);
		alert('ERROR - Unable to generate script list!\nReason: ' + err);
	};
};
/*
	Render script to editor
*/
function R3_SCD_RENDER_SCRIPT(id, canDisplayScript){
	if (id !== undefined && id !== ''){
		R3_SCD_FUNCTION_FOCUSED = false;
		R3_SCD_SCRIPTS_IS_LOADING = true;
		var codeArea = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA');
		if (codeArea !== null){
			document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value = '';
		};
		document.getElementById('R3_SCD_HEX_RAW').innerHTML = '';
		// Clean interface if list editor
		document.getElementById('R3_SCD_SCRIPT_INNER').innerHTML = '';
		R3_SCD_SWAP_EDITOR_MODE(R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE);
		var c = 0, lblId, scriptId = parseInt(id), changeColorCSS = '', hexSelectMode = 'user-can-select', SCD_HTML_TEMPLATE = '', cFunction, cName = scriptHex = tempScriptHex = '', cOpcode, cmdType, functionList = R3_SCD_SCRIPTS_LIST[scriptId];
		if (functionList === undefined){
			functionList = R3_SCD_SCRIPTS_LIST[0];
		};
		// Reading all functions proprieties to render on current script
		if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			while (c < functionList.length){
				// Main Infos
				cFunction = functionList[c];
				cOpcode   = cFunction.slice(0, 2);
				cmdType   = R3_SCD_DATABASE[cOpcode][2];
				cName     = R3_SCD_DATABASE[cOpcode][1].replace('[', '[<font class="monospace mono_xyzr user-can-select">').replace(']', '</font>]');
				var cRemove = '<input type="button" value="Delete" title="Click here to remove this function" class="R3_MSG_BTN_functionEdit R3_MSG_BTN_removeFix" onclick="R3_SCD_FUNCTION_REMOVE(' + c + ');">',
					cEdit = '<input type="button" value="Modify" title="Click here to modify this function" class="R3_MSG_BTN_functionEdit" onclick="R3_SCD_FUNCTION_EDIT(' + c + ');">',
					cProp = '<i>This function don\'t require any settings</i>',
					R3_SCD_DEC_DB = R3_SCD_DECOMPILER_DATABASE[cOpcode],
					fnHint = R3_SCD_INFO_DATABASE[cOpcode],
					opcodeHint_HEX = '';
				if (R3_SETTINGS.SETTINGS_SCD_DECOMPILER_SHOWOPCODE === true){
					opcodeHint_HEX = '(<font class="monospace mono_xyzr user-can-select">' + cOpcode.toUpperCase() + '</font>)';
				};
				R3_SCD_CURRENT_SCRIPT = scriptId;
				/*
					Function Definitions
				*/
				// Null Function [NOP]
				if (cOpcode === '00'){
					cEdit = '';
				};
				// End Script [EVT_END]
				if (cOpcode === '01'){
					cEdit = '';
					cRemove = '';
					cProp = '<i>You <u>can\'t</u> remove this function.</i>';
				};
				// Next Event [EVT_NEXT]
				if (cOpcode === '02'){
					cEdit = '';
				};
				// Event Chain [EVT_CHAIN]
				if (cOpcode === '03'){
					cEdit = '';
				};
				// Execute Event [EVT_EXEC]
				if (cOpcode === '04'){
					var EVT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + EVT_id.toUpperCase() + '</font>';
				};
				// Event Kill [EVT_KILL]
				if (cOpcode === '05'){
					var EVT_tartget = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]);
					cProp = 'Target: <font class="monospace mono_xyzr">' + EVT_tartget.toUpperCase() + '</font>';
				};
				// If [IF]
				if (cOpcode === '06'){
					var IF_length = cFunction.slice(R3_SCD_DEC_DB.length[0], R3_SCD_DEC_DB.length[1]),
					cProp = 'Hex: <font class="monospace mono_xyzr">' + IF_length.toUpperCase() + '</font>';
					cEdit = '';
				};
				// Else [ELSE]
				if (cOpcode === '07'){
					var ELSE_length = cFunction.slice(R3_SCD_DEC_DB.length[0], R3_SCD_DEC_DB.length[1]),
					cProp = 'Hex: <font class="monospace mono_xyzr">' + ELSE_length.toUpperCase() + '</font>';
					cEdit = '';
				};
				// End If [END_IF]
				if (cOpcode === '08'){
					cEdit = '';
				};
				// Sleep [SLEEP]
				if (cOpcode === '09'){
					var SLEEP_count = cFunction.slice(R3_SCD_DEC_DB.count[0], R3_SCD_DEC_DB.count[1]);
					cProp = 'Wait <font class="monospace mono_xyzr">' + parseInt(R3_parseEndian(SLEEP_count), 16) + '</font> ticks';
				};
				// Sleeping [SLEEPING]
				if (cOpcode === '0a'){
					var SLEEP_count = cFunction.slice(R3_SCD_DEC_DB.count[0], R3_SCD_DEC_DB.count[1]);
					cProp = 'Wait <font class="monospace mono_xyzr">' + parseInt(R3_parseEndian(SLEEP_count), 16) + '</font> ticks';
				};
				// [WSLEEP]
				if (cOpcode === '0b'){
					cEdit = '';
				};
				// [WSLEEPING]
				if (cOpcode === '0c'){
					cEdit = '';
				};
				// For [FOR]
				if (cOpcode === '0d'){
					var FOR_length 		= cFunction.slice(R3_SCD_DEC_DB.length[0], R3_SCD_DEC_DB.length[1]),
						FOR_sizeCounter = R3_SCD_FUNCTION_READ_CHECK_LENGTH_SPECIAL(FOR_length, c, '0d'),
						FOR_loopCount   = cFunction.slice(R3_SCD_DEC_DB.loopCount[0], R3_SCD_DEC_DB.loopCount[1]),
						FOR_loopConvert = parseInt(R3_parseEndian(FOR_loopCount), 16);
					cProp = 'This check holds ' + FOR_sizeCounter + ' (<font class="monospace mono_xyzr">' + FOR_length.toUpperCase() + '</font>) functions and will loop for ' + FOR_loopConvert + ' times.';
				};
				// End For [END_FOR]
				if (cOpcode === '0f'){
					cEdit = '';
				};
				// While [WHILE]
				if (cOpcode === '10'){
					// WIP
					cEdit = '';
				};
				// End While [END_WHILE]
				if (cOpcode === '11'){
					// WIP
					cEdit = '';
				};
				// Do Function [DO_START]
				if (cOpcode === '12'){
					// WIP
					cEdit = '';
				};
				// End Do (END_DO)
				if (cOpcode === '13'){
					// WIP
					cEdit = '';
				};
				// INIT Script [GO_SUB]
				if (cOpcode === '19'){
					var GO_scriptId = cFunction.slice(R3_SCD_DEC_DB.scriptId[0], R3_SCD_DEC_DB.scriptId[1]);
					cProp = 'Target Script: <font class="monospace mono_xyzr">' + parseInt(GO_scriptId, 16) + '</font> <input type="button" class="R3_MSG_BTN_functionEdit R3_SCD_BTN_GOSUB_GOTO" ' + 
							'title="(GOTO) Click here to open script ' + parseInt(GO_scriptId, 16) + '" value="GOTO" onclick="R3_SCD_displayScript(' + parseInt(GO_scriptId, 16) + ');">';
				};
				// [BREAK_POINT]
				if (cOpcode === '1c'){
					cEdit = '';
				};
				// Set Timer / Value [SET_TIMER]
				if (cOpcode === '1e'){
					var SET_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
						SET_time   = cFunction.slice(R3_SCD_DEC_DB.time[0], R3_SCD_DEC_DB.time[1]),
						SET_label  = R3_SCD_SET_TIMER_TARGET[SET_target];
					if (SET_target === '29'){
						cProp = 'Target: ' + SET_label + ' - Countdown: <font class="monospace mono_xyzr">' + R3_TIME_parseHexTime(SET_time, 3) + '</font>';
					} else {
						if (R3_SCD_SET_TIMER_TARGET[SET_target] === undefined){
							SET_label = '<font class="monospace mono_xyzr">' + R3_SCD_SET_TIMER_TARGET[SET_target] + '</font> (<font class="monospace mono_xyzr">Hex: ' + SET_target.toUpperCase() + '</font>)';
						};
						cProp = 'Set the ' + SET_label + ' with value <font class="monospace mono_xyzr">' + R3_TIME_parseHexTime(SET_time, 4) + '</font>';
					};
				};
				// [SET_DO]
				if (cOpcode === '1f'){
					var SET_value  = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
						SET_length = cFunction.slice(R3_SCD_DEC_DB.length[0], R3_SCD_DEC_DB.length[1]);
					cProp = 'Value: <font class="monospace mono_xyzr">' + SET_value.toUpperCase() + '</font> - Length: <font class="monospace mono_xyzr">' + SET_length.toUpperCase() + '</font>'; 
				};
				// Execute Calculation [CALC_OP]
				if (cOpcode === '20'){
					var CALC_accmId    = cFunction.slice(R3_SCD_DEC_DB.accumulatorId[0], R3_SCD_DEC_DB.accumulatorId[1]),
						CALC_operation = cFunction.slice(R3_SCD_DEC_DB.operation[0], R3_SCD_DEC_DB.operation[1]),
						CALC_opText    = R3_SCD_CALC_OP_OPERATIONS[CALC_operation];
					if (R3_SCD_CALC_OP_OPERATIONS[CALC_operation] === undefined){
						CALC_opText = '(' + CALC_operation.toUpperCase() + ') Unknown Operation';
					};
					cProp = 'Accumulator ID: <font class="monospace mono_xyzr">' + CALC_accmId.toUpperCase() + '</font> - Operation: <font class="monospace mono_xyzr">' + CALC_opText + '</font>';
				};
				/*
					[UNK_OPCODE_1]
					This is WIP
				*/
				if (cOpcode === '21'){
					cProp = cProp + '<i>... For Now! #WIP</i>';
					// WIP
				};
				// [EVT_CUT]
				if (cOpcode === '22'){
					var EVT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Value: <font class="monospace mono_xyzr">' + EVT_value.toUpperCase() + '</font>';
				};
				// [UNK_OPCODE_2]
				if (cOpcode === '23'){
					cEdit = '';
					cProp = 'This function was not implemented on R3ditor V2!';
				};
				// [CHASER_EVT_CLR]
				if (cOpcode === '24'){
					cEdit = '';
				};
				// Open Map [MAP_OPEN]
				if (cOpcode === '25'){
					var MAP_Id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						MAP_room = cFunction.slice(R3_SCD_DEC_DB.room[0], R3_SCD_DEC_DB.room[1]),
						MAP_name = 'R' + MAP_room.slice(1, MAP_room.length).toUpperCase();
					cProp = 'ID: <font class="monospace mono_xyzr">' + MAP_Id.toUpperCase() + '</font> - Map: ' + RDT_locations[MAP_name][0];
				};
				// [POINT_ADD]
				if (cOpcode === '26'){
					var POINT_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]);
					cProp = 'Data 0: <font class="user-can-select monospace mono_xyzr">' + POINT_data0.toUpperCase() + '</font>';
				};
				// [DOOR_CK]
				if (cOpcode === '27'){
					cEdit = '';
				};
				// Call Game Over [DIEDEMO_ON]
				if (cOpcode === '28'){
					cEdit = '';
				};
				// [DIR_CK]
				if (cOpcode === '29'){
					cEdit = '';
				};
				// [PARTS_SET]
				if (cOpcode === '2a'){
					var PARTS_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						PARTS_type = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + PARTS_id.toUpperCase() + '</font> - Type: <font class="monospace mono_xyzr">' + PARTS_type.toUpperCase() + '</font>';
				};
				// [VLOOP_SET]
				if (cOpcode === '2b'){
					var VLOOP_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Value: <font class="monospace mono_xyzr">' + VLOOP_value.toUpperCase() + '</font>';
				};
				// [OTA_BE_SET]
				if (cOpcode === '2c'){
					var OTA_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
						OTA_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
						OTA_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
					cProp = 'Data 0: <font class="monospace mono_xyzr">' + OTA_data0.toUpperCase() + '</font> - Data 1: <font class="monospace mono_xyzr">' + OTA_data1.toUpperCase() + '</font> - Flag: ' + R3_SCD_FLAG[OTA_flag];
				};
				// [LINE_START]
				if (cOpcode === '2d'){
					var LINE_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						LINE_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + LINE_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + LINE_value.toUpperCase() + '</font>';
				};
				// [LINE_MAIN]
				if (cOpcode === '2e'){
					var LINE_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + LINE_id.toUpperCase() + '</font>';
				};
				// [LINE_END]
				if (cOpcode === '2f'){
					cEdit = '';
				};
				// Set LIT Position [LIGHT_POS_SET]
				if (cOpcode === '30'){
					var LIGHT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'LIT ID: <font class="monospace mono_xyzr">' + LIGHT_id.toUpperCase() + '</font>';
				};
				// Set LIT Color [LIGHT_COLOR_SET]
				if (cOpcode === '32'){
					var LIT_id 	   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						LIT_colorR = cFunction.slice(R3_SCD_DEC_DB.colorR[0], R3_SCD_DEC_DB.colorR[1]),
						LIT_colorG = cFunction.slice(R3_SCD_DEC_DB.colorG[0], R3_SCD_DEC_DB.colorG[1]),
						LIT_colorB = cFunction.slice(R3_SCD_DEC_DB.colorB[0], R3_SCD_DEC_DB.colorB[1]),
						LIT_colorHex = LIT_colorR.toUpperCase() + LIT_colorG.toUpperCase() + LIT_colorB.toUpperCase();
					cProp = 'LIT ID: <font class="monospace mono_xyzr">' + LIT_id.toUpperCase() + '</font> - Color: <font class="monospace mono_xyzr">#<font class="user-can-select">' + LIT_colorHex + '</font></font> ' + 
							'<div class="R3_SCD_COLOR_FADE_SET_SCRIPT_LIST" title="LIT Color: #' + LIT_colorHex + '" style="background-color: #' + LIT_colorHex + ';"></div>';
				};
				// [AHEAD_ROOM_SET]
				if (cOpcode === '33'){
					var AHEAD_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Value: <font class="monospace mono_xyzr">' + AHEAD_value.toUpperCase() + '</font>';
				};
				// [BGM_TBL_CK]
				if (cOpcode === '35'){
					var BGM_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
						BGM_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
						BGM_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Data 0: <font class="monospace mono_xyzr">' + BGM_data0.toUpperCase() + '</font> - Data 1: <font class="monospace mono_xyzr">' + BGM_data1.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + BGM_value.toUpperCase() + '</font>';
				};
				// [ITEM_GET_CK]
				if (cOpcode === '36'){
					var ITEM_code  = cFunction.slice(R3_SCD_DEC_DB.itemId[0], R3_SCD_DEC_DB.itemId[1]),
						ITEM_quant = cFunction.slice(R3_SCD_DEC_DB.quant[0], R3_SCD_DEC_DB.quant[1]);
					cProp = 'Item: ' + DATABASE_ITEM[ITEM_code][0] + ' - Quantity: ' + parseInt(ITEM_quant, 16);
				};
				// [OM_REV]
				if (cOpcode === '37'){
					OM_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + OM_id.toUpperCase() + '</font>';
				};
				// [CHASER_LIFE_INIT]
				if (cOpcode === '38'){
					CHASER_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + CHASER_id.toUpperCase() + '</font>';
				};
				// [CHASER_ITEM_SET]
				if (cOpcode === '3b'){
					var CHASER_emId  = cFunction.slice(R3_SCD_DEC_DB.emId[0], R3_SCD_DEC_DB.emId[1]),
						CHASER_objId = cFunction.slice(R3_SCD_DEC_DB.objId[0], R3_SCD_DEC_DB.objId[1]);
					cProp = 'Em ID: <font class="monospace mono_xyzr">' + CHASER_emId.toUpperCase() + '</font> - Obj ID: <font class="monospace mono_xyzr">' + CHASER_objId.toUpperCase() + '</font>'; 
				};
				// [WEAPON_CHG_OLD]
				if (cOpcode === '3c'){
					cEdit = '';
				};
				// [SEL_EVT_ON]
				if (cOpcode === '3d'){
					var SEL_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + SEL_id.toUpperCase() + '</font>';
				};
				// Remove Item [ITEM_LOST]
				if (cOpcode === '3e'){
					var ITEM_Id 	 = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
						ITEM_imgIcon = 'img/items/' + ITEM_Id + '.png',
						ITEM_title   = '';
					if (R3_WEBMODE === false){
						if (APP_FS.existsSync(ORIGINAL_APP_PATH + '/App/' + ITEM_imgIcon) !== true){
							ITEM_imgIcon = 'img/items/86.png';
						} else {
							ITEM_title = DATABASE_ITEM[ITEM_Id][0];
						};
					} else {
						ITEM_title = DATABASE_ITEM[ITEM_Id][0];
					};
					cProp = 'Item: [<font class="monospace mono_xyzr">' + ITEM_Id.toUpperCase() + '</font>] ' + DATABASE_ITEM[ITEM_Id][0] + ' <img src="' + ITEM_imgIcon + '" title="' + ITEM_title + '" class="R3_SCD_SCRIPTITEM_ITEM_IMG">';
				};
				// [FLR_SET]
				if (cOpcode === '3f'){
					var FLR_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						FLR_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + FLR_id.toUpperCase() + '</font> - Flag: ' + R3_SCD_FLAG[FLR_flag];
				};
				// Set Variable [MEMB_SET]
				if (cOpcode === '40'){
					var MEMB_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						MEMB_variable = cFunction.slice(R3_SCD_DEC_DB.variable[0], R3_SCD_DEC_DB.variable[1]);
					cProp = 'Variable: <font class="monospace mono_xyzr">' + MEMB_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + MEMB_variable.toUpperCase() + '</font>';
				};
				// Set Variable 2 [MEMB_SET2]
				if (cOpcode === '41'){
					var MEMB_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						MEMB_variable = cFunction.slice(R3_SCD_DEC_DB.variable[0], R3_SCD_DEC_DB.variable[1]);
					cProp = 'Variable: <font class="monospace mono_xyzr">' + MEMB_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + MEMB_variable.toUpperCase() + '</font>';
				};
				// [MEMB_CMP]
				if (cOpcode === '43'){
					var MEMB_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						MEMB_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + MEMB_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + MEMB_value.toUpperCase() + '</font>';
				};
				// Set Fade [FADE_SET]
				if (cOpcode === '46'){
					var FADE_id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						FADE_type   = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
						// Color RBG
						FADE_colorR = cFunction.slice(R3_SCD_DEC_DB.colorR[0], R3_SCD_DEC_DB.colorR[1]),
						FADE_colorG = cFunction.slice(R3_SCD_DEC_DB.colorG[0], R3_SCD_DEC_DB.colorG[1]),
						FADE_colorB = cFunction.slice(R3_SCD_DEC_DB.colorB[0], R3_SCD_DEC_DB.colorB[1]),
						FADE_colorHex = FADE_colorR.toUpperCase() + FADE_colorG.toUpperCase() + FADE_colorB.toUpperCase();
					cProp = 'ID: <font class="monospace mono_xyzr">' + FADE_id.toUpperCase() + '</font> - Type: ' + R3_SCD_FADE_SET_TYPES[FADE_type] + '<div class="R3_SCD_COLOR_FADE_SET_SCRIPT_LIST" title="Fade Color: #' + 
							FADE_colorHex + '" style="background-color: #' + FADE_colorHex + ';"></div>';
				};
				// Char Trigger [WORK_SET]
				if (cOpcode === '47'){
					var WORK_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
						WORK_id  	= cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Set target ' + R3_SCD_WORK_SET_TARGET[WORK_target] + ' as ID <font class="user-can-select monospace mono_xyzr">' + WORK_id.toUpperCase() + '</font>';
				};
				// [SPD_SET]
				if (cOpcode === '48'){
					var SPD_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						SPD_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + SPD_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + SPD_value.toUpperCase() + '</font>';
				};
				// [ADD_SPD]
				if (cOpcode === '49'){
					cEdit = '';
				};
				// [ADD_ASPD]
				if (cOpcode === '4a'){
					cEdit = '';
				};
				// [ADD_VSPD]
				if (cOpcode === '4b'){
					cEdit = '';
				};
				// Check Boolean [CK]
				if (cOpcode === '4c'){
					var CK_event = cFunction.slice(R3_SCD_DEC_DB.event[0], R3_SCD_DEC_DB.event[1]),
						CK_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
						CK_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
						CK_tempEvt = '', CK_conditition = R3_SCD_FLAG[CK_flag];
					if (R3_SCD_CK_VARS[CK_event] === undefined){
						CK_tempEvt = '(<font class="monospace mono_xyzr">' + CK_event.toUpperCase() + '</font>) Unknown Event';
					} else {
						CK_tempEvt = R3_SCD_CK_VARS[CK_event];
					};
					// Check if is special condition
					if (CK_conditition === undefined){
						CK_conditition = R3_SCD_CK_SPECIAL_CONTITIONS[CK_flag];
						if (CK_conditition === undefined){
							CK_conditition = '(<font class="monospace mono_xyzr">' + CK_flag.toUpperCase() + '</font> Unknown Condition)';
						};
					};
					cProp = 'Checks if ' + CK_tempEvt + ' <font class="monospace mono_xyzr">' + CK_value.toUpperCase() + '</font> is / are ' + CK_conditition;
				};
				// Set Event Value [SET]
				if (cOpcode === '4d'){
					var SET_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						SET_var  = cFunction.slice(R3_SCD_DEC_DB.typeVar[0], R3_SCD_DEC_DB.typeVar[1]),
						SET_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
						SET_varType = R3_SCD_SET_VALUES[SET_var];
					if (SET_varType === undefined){
						SET_varType = '(<font class="monospace mono_xyzr">' + SET_var.toUpperCase() + '</font>) Unknown Value';
					};
					cProp = 'Event Track: <font class="monospace mono_xyzr">' + SET_id.toUpperCase() + '</font> - Set ' + SET_varType + ' ' + R3_SCD_FLAG[SET_flag];
				};
				// Compare Values [CMP]
				if (cOpcode === '4e'){
					var CMP_varType = cFunction.slice(R3_SCD_DEC_DB.varType[0],	R3_SCD_DEC_DB.varType[1]),
						CMP_cmpType = cFunction.slice(R3_SCD_DEC_DB.cmpType[0],	R3_SCD_DEC_DB.cmpType[1]),
						CMP_value   = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
						CMP_finalValue = R3_parseEndian(CMP_value).toUpperCase(),
						CMP_operator = R3_SCD_COMPARE_VALUES[CMP_cmpType][0],
						CMP_options = '';
					// Check for unk variable
					if (R3_SCD_CMP_OPTIONS[CMP_varType] !== undefined){
						CMP_options = R3_SCD_CMP_OPTIONS[CMP_varType];
					} else {
						CMP_options = '(<font class="monospace mono_xyzr">' + CMP_varType.toUpperCase() + '</font>) Unknown Variable';
					};
					// If Compare is an item
					if (CMP_cmpType === '02'){
						var tempItem = DATABASE_ITEM[R3_fixVars(CMP_value, 2)];
						if (tempItem !== undefined){
							CMP_finalValue = tempItem[0];
						};
					};
					// Check for returned from stage
					if (CMP_varType === '1b'){
						CMP_operator = '';
						CMP_finalValue = RDT_locations['R' + CMP_finalValue.slice(1, CMP_finalValue.length).toUpperCase()][0];
					};
					cProp = 'Compare if ' + CMP_options + ' ' + CMP_operator + ' <font class="monospace mono_xyzr">' + CMP_finalValue + '</font>';
				};
				// [RND]
				if (cOpcode === '4f'){
					cEdit = '';
				};
				// Change Camera [CUT_CHG]
				if (cOpcode === '50'){
					var CUT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						CUT_camPath = APP_PATH + '/Assets/DATA_A/BSS/' + R3_RDT_mapName + CUT_id.toUpperCase() + '.JPG',
						CUT_camPreview = '';
					if (APP_ENABLE_MOD === true && APP_FS.existsSync(CUT_camPath) === true){
						CUT_camPreview = '<img src="' + CUT_camPath + '" alt="R3_SCD_CAM_' + CUT_id.toUpperCase() + '_PREVIEW" class="R3_SCD_SCRIPTITEM_ITEM_IMG">';
					};
					cProp = 'Next Camera: <font class="monospace mono_xyzr">' + parseInt(CUT_id, 16) + '</font>' + CUT_camPreview;
				};
				// [CUT_OLD]
				if (cOpcode === '51'){
					cEdit = '';
				};
				// Lock Camera [CUT_AUTO]
				if (cOpcode === '52'){
					var CUT_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
					cProp = 'Camera Lock: ' + R3_SCD_FLAG[CUT_flag];
				};
				// Swap Camera [CUT_REPLACE]
				if (cOpcode === '53'){
					var CUT_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						CUT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'The trigger for camera <font class="monospace mono_xyzr">' + parseInt(CUT_id, 16) + '</font> will display camera <font class="monospace mono_xyzr">' + parseInt(CUT_value, 16) + '</font>';
				};
				// [CUT_BE_SET]
				if (cOpcode === '54'){
					var CUT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						CUT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
						CUT_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + CUT_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + CUT_value.toUpperCase() + '</font> - Flag: ' + R3_SCD_FLAG[CUT_flag];
				};
				// Set Target Position [POS_SET]
				if (cOpcode === '55'){
					var POS_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
						POS_X 	   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
						POS_Y 	   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
						POS_Z 	   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
					cProp = 'Target: <font class="monospace mono_xyzr">' + POS_target.toUpperCase() + '</font> - <font class="COLOR_X">X: <font class="user-can-select monospace mono_xyzr">' + POS_X.toUpperCase() + '</font></font> ' + 
							'<font class="COLOR_Y">Y: <font class="user-can-select monospace mono_xyzr">' + POS_Y.toUpperCase() + '</font></font> <font class="COLOR_Z">Z: <font class="user-can-select monospace mono_xyzr">' + 
							POS_Z.toUpperCase() + '</font></font>';
				};
				// [DIR_SET]
				if (cOpcode === '56'){
					var DIR_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
						DIR_X 	   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
						DIR_Y 	   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
						DIR_Z 	   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
					cProp = 'Target: <font class="monospace mono_xyzr">' + DIR_target.toUpperCase() + '</font> - <font class="COLOR_X">X: <font class="user-can-select monospace mono_xyzr">' + DIR_X.toUpperCase() + '</font></font> ' + 
							'<font class="COLOR_Y">Y: <font class="user-can-select monospace mono_xyzr">' + DIR_Y.toUpperCase() + '</font></font> <font class="COLOR_Z">Z: <font class="user-can-select monospace mono_xyzr">' + 
							DIR_Z.toUpperCase() + '</font></font>';
				};
				// [SET_VIB0]
				if (cOpcode === '57'){
					var SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
						SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
					cProp = 'Data 0: <font class="monospace mono_xyzr">' + SET_data0.toUpperCase() + '</font> - Data 1: <font class="monospace mono_xyzr">' + SET_data1.toUpperCase() + '</font>';
				};
				// [SET_VIB1]
				if (cOpcode === '58'){
					var SET_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
						SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + SET_id.toUpperCase() + '</font> - Data 0: <font class="monospace mono_xyzr">' + SET_data0.toUpperCase() + 
							'</font> - Data 1: <font class="monospace mono_xyzr">' + SET_data1.toUpperCase() + '</font>';
				};
				// [SET_VIB_FADE]
				if (cOpcode === '59'){
					var SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
						SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
						SET_data2 = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]),
						SET_data3 = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]);
					cProp = 'Data 0: <font class="monospace mono_xyzr">' + SET_data0.toUpperCase() + '</font> - Data 1: <font class="monospace mono_xyzr">' + SET_data1.toUpperCase() + 
							'</font> - Data 2: <font class="monospace mono_xyzr">' + SET_data2.toUpperCase() + '</font> - Data 3:  <font class="monospace mono_xyzr">' + SET_data3.toUpperCase() + '</font>';
				};
				// RBJ Trigger [RBJ_SET]
				if (cOpcode === '5a'){
					var RBJ_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + RBJ_id.toUpperCase() + '</font>';
				};
				// Display Message [MESSAGE_ON]
				if (cOpcode === '5b'){
					var MESSAGE_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						MESSAGE_dMode = cFunction.slice(R3_SCD_DEC_DB.displayMode[0], R3_SCD_DEC_DB.displayMode[1]),
						msgPrev = R3_MSG_RDT_MESSAGES_PREVIEW[parseInt(MESSAGE_id, 16)];
					if (msgPrev !== undefined){
						fnHint = R3_SCD_INFO_DATABASE[cOpcode] + '\n\nMessage Preview:\n' + R3_removeHtmlFromString(msgPrev).replace(RegExp('[(]Line Break[)]', 'gi'), '\n');
					} else {
						fnHint = R3_SCD_INFO_DATABASE[cOpcode] + '\n\nWARN: Unable to find message ' + parseInt(MESSAGE_id, 16) + ' on this map!';
					};
					cProp = 'Message ID: <font class="monospace mono_xyzr">' + parseInt(MESSAGE_id, 16) + '</font> (<font class="monospace mono_xyzr user-can-select">' + MESSAGE_id.toUpperCase() + '</font>) - Display Mode: ' + R3_SCD_MSG_DISPLAYMODE[MESSAGE_dMode];
				};
				// [RAIN_SET]
				if (cOpcode === '5c'){
					var RAIN_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Value: <font class="monospace mono_xyzr">' + RAIN_value.toUpperCase() + '</font>';
				};
				// [MESSAGE_OFF]
				if (cOpcode === '5d'){
					cEdit = '';
				};
				// [SHAKE_ON]
				if (cOpcode === '5e'){
					var SHAKE_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						SHAKE_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + SHAKE_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + SHAKE_value.toUpperCase() + '</font>';
				};
				// Change Weapon [WEAPON_CHG]
				if (cOpcode === '5f'){
					var WEAPON_id = cFunction.slice(R3_SCD_DEC_DB.weaponId[0], R3_SCD_DEC_DB.weaponId[1]),
						WEAPON_name = DATABASE_ITEM[WEAPON_id];
					if (WEAPON_name === undefined){
						WEAPON_name = '(<font class="monospace mono_xyzr">' + WEAPON_id.toUpperCase() + '</font>) Unknown Weapon!';
					} else {
						WEAPON_name = DATABASE_ITEM[WEAPON_id][0];
					};
					cProp = 'Weapon: ' + WEAPON_name;
				};
				// [UNK_OPCODE_3]
				if (cOpcode === '60'){
					cProp = 'This function was not implemented on R3ditor V2!';
				};
				// Set Door [DOOR_AOT_SET]
				if (cOpcode === '61'){
					var DOOR_Id		= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						DOOR_nStage = (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1]), 16) + 1),
						DOOR_nRoom  = cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]).toUpperCase(),
						DOOR_nCam   = cFunction.slice(R3_SCD_DEC_DB.nextCam[0], R3_SCD_DEC_DB.nextCam[1]).toUpperCase(),
						DOOR_nRDT 	= 'R' + DOOR_nStage + DOOR_nRoom;
						DOOR_nMap 	= RDT_locations[DOOR_nRDT][0],
						DOOR_cPrev  = '';
					if (R3_WEBMODE === false && APP_FS.existsSync(APP_PATH + '/Assets/DATA_A/BSS/' + DOOR_nRDT + DOOR_nCam + '.JPG') === true){
						DOOR_cPrev = '<img class="R3_SCD_SCRIPTITEM_ITEM_IMG" title="Next Cam: ' + parseInt(DOOR_nCam, 16) + '" alt="R3_SCD_DOOR_PREVIEW_' + DOOR_nRDT + '_' + DOOR_nCam + '" src="' + APP_PATH + '/Assets/DATA_A/BSS/R' + DOOR_nStage + DOOR_nRoom + DOOR_nCam + '.JPG">';
					};
					cProp = 'ID: <font class="monospace mono_xyzr">' + DOOR_Id + '</font> - Leads to <font class="monospace mono_xyzr">' + DOOR_nRDT + '.RDT</font> [ ' + DOOR_nMap + ' ]' + DOOR_cPrev;
				};
				// Set Door 4P [DOOR_AOT_SET_4P]
				if (cOpcode === '62'){
					var DOOR_Id		= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						DOOR_nStage = (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1]), 16) + 1),
						DOOR_nRoom  = cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]).toUpperCase(),
						DOOR_nCam   = cFunction.slice(R3_SCD_DEC_DB.nextCam[0], R3_SCD_DEC_DB.nextCam[1]).toUpperCase(),
						DOOR_nRDT 	= 'R' + DOOR_nStage + DOOR_nRoom;
						DOOR_nMap 	= RDT_locations[DOOR_nRDT][0],
						DOOR_cPrev  = '';
					if (R3_WEBMODE === false && APP_FS.existsSync(APP_PATH + '/Assets/DATA_A/BSS/' + DOOR_nRDT + DOOR_nCam + '.JPG') === true){
						DOOR_cPrev = '<img class="R3_SCD_SCRIPTITEM_ITEM_IMG" title="Next Cam: ' + parseInt(DOOR_nCam, 16) + '" alt="R3_SCD_DOOR_PREVIEW_' + DOOR_nRDT + '_' + DOOR_nCam + '" src="' + APP_PATH + '/Assets/DATA_A/BSS/R' + DOOR_nStage + DOOR_nRoom + DOOR_nCam + '.JPG">';
					};
					cProp = 'ID: <font class="monospace mono_xyzr">' + DOOR_Id + '</font> - Leads to <font class="monospace mono_xyzr">' + DOOR_nRDT + '.RDT</font> [ ' + DOOR_nMap + ' ]' + DOOR_cPrev;
				};
				// Set Interactive Object [AOT_SET]
				if (cOpcode === '63'){
					var AOT_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						AOT_aot   = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
						AOT_dMode = cFunction.slice(R3_SCD_DEC_DB.displayMode[0], R3_SCD_DEC_DB.displayMode[1]),
						AOT_model = '';
					if (R3_SCD_AOT_TYPES[AOT_aot] !== undefined){
						AOT_model = R3_SCD_AOT_TYPES[AOT_aot][0];
					} else {
						AOT_model = '(<font class="monospace mono_xyzr">' + AOT_aot.toUpperCase() + '</font>) Unknown AOT!';
					};
					cProp = 'ID: <font class="monospace mono_xyzr">' + AOT_id.toUpperCase() + '</font> - Type: ' + AOT_model;
				};
				// [AOT_RESET]
				if (cOpcode === '65'){
					var AOT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						AOT_type = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + AOT_id.toUpperCase() + '</font> - Type: <font class="monospace mono_xyzr">' + AOT_type.toUpperCase() + '</font>';
				};
				// Run Interactive Object [AOT_ON]
				if (cOpcode === '66'){
					var AOT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						AOT_preview = 'Unknown Source!';
						if (R3_SCD_ID_LIST_ENTRIES[AOT_id.toLowerCase()] !== undefined){
							AOT_preview = R3_SCD_ID_LIST_ENTRIES[AOT_id.toLowerCase()][2];
						} else {
							R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to find AOT target! (Target: <font class="user-can-select">' + AOT_id.toUpperCase() + '</font>)')	
						};
					cProp = 'Object ID: <font class="monospace mono_xyzr">' + AOT_id.toUpperCase() + ' - ' + AOT_preview + '</font>';
				};
				// Set Item [ITEM_AOT_SET]
				if (cOpcode === '67'){
					var ITEM_Id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						ITEM_Opcode  = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
						ITEM_imgIcon = 'img/items/' + ITEM_Opcode + '.png',
						ITEM_title   = '';
					// Fix files / maps icons
					if (parseInt(ITEM_Opcode, 16) > 133){
						ITEM_imgIcon = 'img/items/86.png';
					};
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
					cProp = 'ID: <font class="monospace mono_xyzr">' + ITEM_Id.toUpperCase() + '</font> - Item: [<font class="monospace mono_xyzr">' + ITEM_Opcode.toUpperCase() + '</font>] ' + ITEM_title + ' <img src="' + ITEM_imgIcon + 
							'" title="' + ITEM_title + '" class="R3_SCD_SCRIPTITEM_ITEM_IMG">';
				};
				// Set Item 4P [ITEM_AOT_SET_4P]
				if (cOpcode === '68'){
					var ITEM_Id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]).toUpperCase(),
						ITEM_Opcode  = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
						ITEM_imgIcon = 'img/items/' + ITEM_Opcode + '.png',
						ITEM_title   = '';
					// Fix files / maps icons
					if (parseInt(ITEM_Opcode, 16) > 133){
						ITEM_imgIcon = 'img/items/86.png';
					};
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
					cProp = 'ID: <font class="monospace mono_xyzr">' + ITEM_Id.toUpperCase() + '</font> - Item: [<font class="monospace mono_xyzr">' + ITEM_Opcode.toUpperCase() + '</font>] ' + ITEM_title + ' <img src="' + ITEM_imgIcon + 
							'" title="' + ITEM_title + '" class="R3_SCD_SCRIPTITEM_ITEM_IMG">';
				};
				// Shadow Effect [KAGE_SET]
				if (cOpcode === '69'){
					var KAGE_id 	= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						KAGE_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + KAGE_id.toUpperCase() + '</font> - Target: ' + R3_SCD_KAGE_OPTIONS[KAGE_target];
				};
				// [SUPER_SET]
				if (cOpcode === '6a'){
					var SUPER_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						SUPER_X  = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
						SUPER_Y  = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
						SUPER_Z  = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + SUPER_id.toUpperCase() + '</font> <font class="COLOR_X">X: <font class="user-can-select monospace mono_xyzr">' + SUPER_X.toUpperCase() + 
							'</font></font> <font class="COLOR_Y">Y: <font class="user-can-select monospace mono_xyzr">' + SUPER_Y.toUpperCase() + '</font></font> <font class="COLOR_Z">Z: <font class="user-can-select monospace mono_xyzr">' + 
							SUPER_Z.toUpperCase() + '</font></font>';
				};
				// Check Item [KEEP_ITEM_CK]
				if (cOpcode === '6b'){
					var ITEM_Id = cFunction.slice(R3_SCD_DEC_DB.itemId[0], R3_SCD_DEC_DB.itemId[1]),
						ITEM_imgIcon = 'img/items/' + ITEM_Id + '.png',
						ITEM_title = '';
					if (DATABASE_ITEM[ITEM_Id] === undefined){
						ITEM_imgIcon = 'img/items/86.png';
					} else {
						ITEM_title = DATABASE_ITEM[ITEM_Id][0];
					};
					cProp = 'Check if player haves ' + DATABASE_ITEM[ITEM_Id][0] + ' [<font class="monospace mono_xyzr">' + ITEM_Id.toUpperCase() + '</font>] <img src="' + ITEM_imgIcon + 
							'" title="' + ITEM_title + '" class="R3_SCD_SCRIPTITEM_ITEM_IMG">';
				};
				// [KEY_CK]
				if (cOpcode === '6c'){
					var KEY_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
						KEY_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Checks if <font class="monospace mono_xyzr">' + KEY_value.toUpperCase() + '</font> are ' + R3_SCD_FLAG[KEY_flag];
				};
				// [TRG_CK]
				if (cOpcode === '6d'){
					var TRG_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
						TRG_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'Flag: ' + R3_SCD_FLAG[TRG_flag] + ' - Value: <font class="monospace mono_xyzr">' + TRG_value.toUpperCase() + '</font>';
				};
				// [SCA_ID_SET]
				if (cOpcode === '6e'){
					var SCA_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						SCA_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + SCA_Id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + SCA_value.toUpperCase() + '</font>';
				};
				// [OM_BOMB]
				if (cOpcode === '6f'){
					var OM_id = cFunction.slice(R3_SCD_DEC_DB.omId[0], R3_SCD_DEC_DB.omId[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + OM_id.toUpperCase() + '</font>';
				};
				// [ESPR_KILL2]
				if (cOpcode === '75'){
					var ESPR_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + ESPR_id.toUpperCase() + '</font>';
				};
				// [ESPR_KILL_ALL]
				if (cOpcode === '76'){
					var ESPR_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						ESPR_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]); 
					cProp = 'ID: <font class="monospace mono_xyzr">' + ESPR_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + ESPR_value.toUpperCase() + '</font>'; 
				};
				// Play SE [SE_ON]
				if (cOpcode === '77'){
					var SE_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						SE_X  = cFunction.slice(R3_SCD_DEC_DB.seX[0], R3_SCD_DEC_DB.seX[1]),
						SE_Y  = cFunction.slice(R3_SCD_DEC_DB.seY[0], R3_SCD_DEC_DB.seY[1]),
						SE_Z  = cFunction.slice(R3_SCD_DEC_DB.seZ[0], R3_SCD_DEC_DB.seZ[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + SE_id.toUpperCase() + '</font> - <font class="COLOR_X">X: <font class="user-can-select monospace mono_xyzr">' + SE_X.toUpperCase() + '</font></font> ' + 
							'<font class="COLOR_Y">Y: <font class="user-can-select monospace mono_xyzr">' + SE_Y.toUpperCase() + '</font></font> <font class="COLOR_Z">Z: <font class="user-can-select monospace mono_xyzr">' + 
							SE_Z.toUpperCase() + '</font></font>'; 
				};
				// [BGM_CTL]
				if (cOpcode === '78'){
					var BGM_id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						BGM_value  = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
						BGM_volume = cFunction.slice(R3_SCD_DEC_DB.volume[0], R3_SCD_DEC_DB.volume[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + BGM_id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + BGM_value.toUpperCase() + '</font> - Volume: <font class="monospace mono_xyzr">' +
							R3_parsePercentage(parseInt(BGM_volume, 16), 255) + '%</font>';
				};
				// [XA_ON]
				if (cOpcode === '79'){
					var XA_Id   = cFunction.slice(R3_SCD_DEC_DB.xaId[0],   R3_SCD_DEC_DB.xaId[1]),
						XA_Data = cFunction.slice(R3_SCD_DEC_DB.xaData[0], R3_SCD_DEC_DB.xaData[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + XA_Id.toUpperCase() + '</font> - Data: <font class="monospace mono_xyzr">' + XA_Data.toUpperCase() + '</font>';
				};
				// Call Cinematic [MOVIE_ON]
				if (cOpcode === '7a'){
					var MOVIE_Id = cFunction.slice(R3_SCD_DEC_DB.movieId[0], R3_SCD_DEC_DB.movieId[1]);
					cProp = 'Cinematic ID: <font class="monospace mono_xyzr">' + MOVIE_Id.toUpperCase() + '</font>';
				};
				// [BGM_TBL_SET]
				if (cOpcode === '7b'){
					var BGM_id0  = cFunction.slice(R3_SCD_DEC_DB.id0[0], R3_SCD_DEC_DB.id0[1]),
						BGM_id1  = cFunction.slice(R3_SCD_DEC_DB.id1[0], R3_SCD_DEC_DB.id1[1]),
						BGM_type = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]);
					cProp = 'ID 0: <font class="monospace mono_xyzr">' + BGM_id0.toUpperCase() + '</font> - ID 1: <font class="monospace mono_xyzr">' + BGM_id1.toUpperCase() + 
							'</font> - Type: <font class="monospace mono_xyzr">' + BGM_type.toUpperCase() + '</font>';
				};
				// Open Inventory [STATUS_ON]
				if (cOpcode === '7c'){
					cEdit = '';
				};
				// Set Enemy / NPC [EM_SET]
				if (cOpcode === '7d'){
					var EM_id 	= cFunction.slice(R3_SCD_DEC_DB.enemyId[0], R3_SCD_DEC_DB.enemyId[1]),
						EM_type = cFunction.slice(R3_SCD_DEC_DB.enemyType[0], R3_SCD_DEC_DB.enemyType[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + EM_id.toUpperCase() + '</font> - Enemy / NPC: ' + RDT_EMDNAME[EM_type];
				};
				// [MIZU_DIV]
				if (cOpcode === '7e'){
					var MIZU_id = cFunction.slice(R3_SCD_DEC_DB.mizuId[0], R3_SCD_DEC_DB.mizuId[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + MIZU_id.toUpperCase() + '</font>';
				};
				// Set 3D Object [OM_SET]
				if (cOpcode === '7f'){
					var OM_id  		= cFunction.slice(R3_SCD_DEC_DB.objId[0], R3_SCD_DEC_DB.objId[1]),
						OM_AOT 		= cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
						OM_aotLabel = R3_SCD_OM_SET_AOT_TYPES[OM_AOT];
					if (OM_aotLabel === undefined){
						OM_aotLabel = 'Undefined (Hex: ' + OM_AOT.toUpperCase() + ')';
					};
					cProp = 'ID: <font class="monospace mono_xyzr">' + OM_id.toUpperCase() + '</font> - Type: <font class="monospace mono_xyzr">' + OM_aotLabel + '</font>';
				};
				// Motion Trigger [PLC_MOTION]
				if (cOpcode === '80'){
					var PLC_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + PLC_Id.toUpperCase() + '</font>';
				};
				// Set Animation DEST [PLC_DEST]
				if (cOpcode === '81'){
					var PLC_animation 	 = cFunction.slice(R3_SCD_DEC_DB.animation[0], R3_SCD_DEC_DB.animation[1]),
						PLC_animModifier = cFunction.slice(R3_SCD_DEC_DB.animModifier[0], R3_SCD_DEC_DB.animModifier[1]),
						PLC_animTxt = '';
						if (R3_SCD_PLC_DEST_ANIMATIONS[PLC_animation] === undefined){
							PLC_animTxt = '(<font class="monospace mono_xyzr">' + PLC_animation.toUpperCase() + '</font>) Unknown Animation';
						} else {
							PLC_animTxt = R3_SCD_PLC_DEST_ANIMATIONS[PLC_animation][0];
						}
					cProp = 'Animation: ' + PLC_animTxt + ' - Anim. Modifier: <font class="monospace mono_xyzr">' + PLC_animModifier.toUpperCase() + '</font>';
				};
				// Set Head Animation [PLC_NECK]
				if (cOpcode === '82'){
					var PLC_type = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
						PLC_animation = '';
					if (R3_SCD_PLC_NECK_ANIMATIONS[PLC_type] !== undefined){
						PLC_animation = R3_SCD_PLC_NECK_ANIMATIONS[PLC_type][0];
					} else {
						PLC_animation = '(<font class="monospace mono_xyzr">' + PLC_type.toUpperCase() + '</font>) Unknown Animation';
					};
					cProp = 'Type: ' + PLC_animation;
				};
				// Player Return [PLC_RET]
				if (cOpcode === '83'){
					cEdit = '';
				};
				// [PLC_FLG]
				if (cOpcode === '84'){
					var PLC_Id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]); 
					cProp = 'ID: <font class="monospace mono_xyzr">' + PLC_Id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' +
							PLC_value.toUpperCase() + '</font>'; 
				};
				// [PLC_GUN]
				if (cOpcode === '85'){
					var PLC_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + PLC_Id.toUpperCase() + '</font>';
				};
				// [PLC_GUN_EFF]
				if (cOpcode === '86'){
					cEdit = '';
				};
				// [PLC_STOP]
				if (cOpcode === '87'){
					cEdit = '';
				};
				// [PLC_ROT]
				if (cOpcode === '88'){
					var PLC_Id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]); 
					cProp = 'ID: <font class="monospace mono_xyzr">' + PLC_Id.toUpperCase() + '</font> - Value: <font class="monospace mono_xyzr">' + PLC_value.toUpperCase() + '</font>'; 
				};
				// [PLC_CNT]
				if (cOpcode === '89'){
					var PLC_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + PLC_Id.toUpperCase() + '</font>';
				};
				// [SPLC_RET]
				if (cOpcode === '8a'){
					cEdit = '';
				};
				// SPLC_SCE
				if (cOpcode === '8b'){
					cEdit = '';
				};
				// [PLC_SCE]
				if (cOpcode === '8c'){
					cEdit = '';
				};
				// [SPL_WEAPON_CHG]
				if (cOpcode === '8d'){
					cEdit = '';
				};
				// [PLC_MOT_NUM]
				if (cOpcode === '8e'){
					var PLC_Id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
						PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]); 
					cProp = 'ID: <font class="monospace mono_xyzr">' + PLC_Id.toUpperCase() + '</font> - Value: ' + PLC_value.toUpperCase(); 
				};
				// Reset Enemy Animation [EM_RESET]
				if (cOpcode === '8f'){
					var EM_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
					cProp = 'ID: <font class="monospace mono_xyzr">' + EM_id.toUpperCase() + '</font>';
				};
				/*
					Generate HTML and Stuff
				*/
				SCD_HTML_TEMPLATE = SCD_HTML_TEMPLATE + '<div class="R3_SCD_functionBase R3_SCD_function_' + cmdType + '" title="' + fnHint + '" id="R3_SCD_scriptCommand_' + c + '" ondblclick="R3_SCD_FUNCTION_EDIT(' + c + ');" onclick="R3_SCD_navigateFunctions(5, ' + c + ', true);">' + cEdit + 
									cRemove + '(<font class="monospace mono_xyzr">' + R3_fixVars(parseInt(c + 1), 3) + '</font>) - Function: ' + cName + ' ' + opcodeHint_HEX + '<br>' + cProp + '</div>';
				// Hex View checks
				if (R3_SETTINGS.SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR === true){
					changeColorCSS = 'R3_SCD_function_' + cmdType + ' no-bg-image';
				};
				if (R3_SETTINGS.SETTINGS_SCD_SELECT_HEX_AS_TEXT === true){
					hexSelectMode = 'user-select-normal';
				};
				scriptHex = scriptHex + '<font id="R3_SCD_HEX_VIEW_FN_' + c + '" onmouseover="R3_DESIGN_SCD_hoverFunction(' + c + ', true);" onmouseout="R3_DESIGN_SCD_hoverFunction(0, false);" class="' + hexSelectMode + ' ' + changeColorCSS + '" title="(' + parseInt(c + 1) + ') ' + fnHint + '">' + R3_unsolveHEX(cFunction) + '</font> ';
				tempScriptHex = tempScriptHex + R3_unsolveHEX(cFunction);
				// End
				c++;
			};
		} else {
			/*
				Code Mode (Script)
			*/
			var lblScript = R3_SCD_CURRENT_SCRIPT, tCount = 0, tempScriptCode, lastOpcodeWasCheck = false;
			if (SCD_scriptNames[R3_SCD_CURRENT_SCRIPT] !== undefined){
				lblScript = SCD_scriptNames[R3_SCD_CURRENT_SCRIPT];
			};
			tempScriptCode = '/*\n	Map ' + R3_SCD_fileName + ', Script ' + lblScript + '\n	This is on Alpha-WIP stage, it means you can\'t edit SCD using this method yet.\n\n	Please, be patient!\n	With love, TheMitoSan <3\n*/', tabCounter = 0;
			while (c < functionList.length){
				tCount = 0;
				cFunction = functionList[c];
				cOpcode   = cFunction.slice(0, 2);
				var R3_SCD_OPCODE_HAVE_FLAGS = R3_SCD_DATABASE[cOpcode][3],
					R3_SCD_DEC_DB = R3_SCD_DECOMPILER_DATABASE[cOpcode],
					R3_CODE_IS_CHECK = R3_SCD_DATABASE[cOpcode][5],
					R3_CODE_FN_NAME = R3_SCD_DATABASE[cOpcode][4],
					checkIfWasCheckOpcode = function(check, value){
						if (check === true){
							tabCounter--;
							return value.slice(0, (value.length - 1)) + ' && ';
						} else {
							return value;
						};
					},
					tabSpace = '';
				/*
					Start
				*/
				while (tCount < tabCounter){
					tabSpace = tabSpace + '	';
					tCount++;
				};
				// Fix Tabs [before]
				var nextFn = functionList[(c + 1)];
				if (nextFn !== undefined){
					var cNextOp = nextFn.slice(0, 2);
					// Else
					if (cNextOp === '07'){
						tabCounter--;
					};
					// End If
					if (cNextOp === '08'){
						tabCounter--;
					};
					// End For
					if (cNextOp === '0f'){
						tabCounter--;
					};
					// End While
					if (cNextOp === '11'){
						tabCounter--;
					};
					// End Do
					if (cNextOp === '13'){
						tabCounter--;
					};
				};
				// Current Opcode have not have attr / flags
				if (R3_SCD_OPCODE_HAVE_FLAGS === true){
					var tempCode = tempScriptCode + '\n' + tabSpace + R3_CODE_FN_NAME + '(', 
						closeJsCode = ');';
					/*
						Opcode Infos
					*/					
					// Execute Event [EVT_EXEC]
					if (cOpcode === '04'){
						var EVT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + EVT_id.toUpperCase() + '\'';
					};
					// Kill Event [EVT_KILL]
					if (cOpcode === '05'){
						var EVT_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]);
						tempScriptCode = tempCode + '\'' + EVT_target.toUpperCase() + '\'';
					};
					// Sleep [SLEEP]
					if (cOpcode === '09'){
						var SLEEP_sleeping = cFunction.slice(R3_SCD_DEC_DB.sleeping[0], R3_SCD_DEC_DB.sleeping[1]),
							SLEEP_count    = cFunction.slice(R3_SCD_DEC_DB.count[0], R3_SCD_DEC_DB.count[1]);
						tempScriptCode = tempCode + '\'' + SLEEP_sleeping.toUpperCase() + '\', \'' + SLEEP_count.toUpperCase() + '\'';
					};
					// Sleeping [SLEEPING]
					if (cOpcode === '0a'){
						var SLEEPING_count = cFunction.slice(R3_SCD_DEC_DB.count[0], R3_SCD_DEC_DB.count[1]);
						tempScriptCode = tempCode + '\'' + SLEEPING_count.toUpperCase() + '\'';	
					};
					// Run Script [GO_SUB]
					if (cOpcode === '19'){
						var scriptId = parseInt(cFunction.slice(R3_SCD_DEC_DB.scriptId[0], R3_SCD_DEC_DB.scriptId[1]), 16);
						tempScriptCode = tempCode + scriptId;
					};
					// Set Timer / Value [SET_TIMER]
					if (cOpcode === '1e'){
						var SET_target 	= cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
							SET_timeHex	= cFunction.slice(R3_SCD_DEC_DB.time[0],   R3_SCD_DEC_DB.time[1]);
						tempScriptCode = tempCode + '\'' + SET_target.toUpperCase() + '\', \'' + SET_timeHex.toUpperCase() + '\'';
					};
					// [SET_DO]
					if (cOpcode === '1f'){
						var SET_value  = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
							SET_length = cFunction.slice(R3_SCD_DEC_DB.length[0], R3_SCD_DEC_DB.length[1]);
						tempScriptCode = tempCode + '\'' + SET_value.toUpperCase() + '\', \'' + SET_length.toUpperCase() + '\'';
					};
					// Execute Calculation [CALC_OP]
					if (cOpcode === '20'){
						var CALC_unk0 	   = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							CALC_operation = cFunction.slice(R3_SCD_DEC_DB.operation[0], R3_SCD_DEC_DB.operation[1]),
							CALC_accmId    = cFunction.slice(R3_SCD_DEC_DB.accumulatorId[0], R3_SCD_DEC_DB.accumulatorId[1]),
							CALC_value 	   = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + CALC_unk0.toUpperCase() + '\', \'' + CALC_operation.toUpperCase() + '\', \'' + CALC_accmId.toUpperCase() + '\', \'' + CALC_value.toUpperCase() + '\'';
					};
					// [EVT_CUT]
					if (cOpcode === '22'){
						var EVT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + EVT_value.toUpperCase() + '\'';
					};
					// Open Map [MAP_OPEN]
					if (cOpcode === '25'){
						var MAP_Id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							MAP_room = cFunction.slice(R3_SCD_DEC_DB.room[0], R3_SCD_DEC_DB.room[1]);
						tempScriptCode = tempCode + '\'' + MAP_Id.toUpperCase() + '\', \'' + MAP_room.toUpperCase() + '\'';
					};
					// [POINT_ADD]
					if (cOpcode === '26'){
						var POINT_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							POINT_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
						tempScriptCode = tempCode + '\'' + POINT_data0.toUpperCase() + '\', \'' + POINT_data1.toUpperCase() + '\'';
					};
					// [DIR_CK]
					if (cOpcode === '29'){
						var DIR_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							DIR_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
							DIR_data2 = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]);
						tempScriptCode = tempCode + DIR_data0.toUpperCase() + ', ' + DIR_data1.toUpperCase() + ', ' + DIR_data2.toUpperCase();
					};
					// [PARTS_SET]
					if (cOpcode === '2a'){
						var PARTS_id	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							PARTS_type   = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
							PARTS_value	 = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + PARTS_id.toUpperCase() + '\', \'' + PARTS_type.toUpperCase() + '\', \'' + PARTS_value.toUpperCase() + '\'';
					};
					// [VLOOP_SET]
					if (cOpcode === '2b'){
						var VLOOP_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + VLOOP_value.toUpperCase() + '\'';
					};
					// [OTA_BE_SET]
					if (cOpcode === '2c'){
						var OTA_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							OTA_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
							OTA_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
						tempScriptCode = tempCode + '\'' + OTA_data0.toUpperCase() + '\', \'' + OTA_data1.toUpperCase() + '\', ' + R3_SCD_CODE_FLAGS[OTA_flag];
					};
					// [LINE_START]
					if (cOpcode === '2d'){
						var LINE_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							LINE_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + LINE_id.toUpperCase() + ', \'' + LINE_value.toUpperCase() + '\'';
					};
					// Set LIT Position [LIGHT_POS_SET]
					if (cOpcode === '30'){
						var LIGHT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							LIGHT_X  = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							LIGHT_Y  = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]);
						tempScriptCode = tempCode + '\'' + LIGHT_id.toUpperCase() + ', \'' + LIGHT_X.toUpperCase() + '\', \'' + LIGHT_Y.toUpperCase() + '\'';
					};
					// Set LIT Color [LIGHT_COLOR_SET]
					if (cOpcode === '32'){
						var LIGHT_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							LIGHT_unk0 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							LIGHT_R    = cFunction.slice(R3_SCD_DEC_DB.colorR[0], R3_SCD_DEC_DB.colorR[1]),
							LIGHT_G    = cFunction.slice(R3_SCD_DEC_DB.colorG[0], R3_SCD_DEC_DB.colorG[1]),
							LIGHT_B    = cFunction.slice(R3_SCD_DEC_DB.colorB[0], R3_SCD_DEC_DB.colorB[1]);
						tempScriptCode = tempCode + '\'' + LIGHT_id.toUpperCase() + '\', \'' + LIGHT_unk0.toUpperCase() + '\', ' + parseInt(LIGHT_R, 16) + ', ' + parseInt(LIGHT_G, 16) + ', ' + parseInt(LIGHT_B, 16);
					};
					// [AHEAD_ROOM_SET]
					if (cOpcode === '33'){
						var AHEAD_value  = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + AHEAD_value.toUpperCase() + '\'';
					};
					// [OM_REV]
					if (cOpcode === '37'){
						var OM_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + OM_id.toUpperCase() + '\'';
					};
					// [CHASER_LIFE_INIT]
					if (cOpcode === '38'){
						var CHASER_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + CHASER_id.toUpperCase() + '\'';	
					};
					// [CHASER_ITEM_SET]
					if (cOpcode === '3b'){
						var CHASER_emId  = cFunction.slice(R3_SCD_DEC_DB.emId[0], R3_SCD_DEC_DB.emId[1]),
							CHASER_objId = cFunction.slice(R3_SCD_DEC_DB.objId[0], R3_SCD_DEC_DB.objId[1]);
						tempScriptCode = tempCode + '\'' + CHASER_emId.toUpperCase() + '\', \'' + CHASER_objId.toUpperCase() + '\'';
					};
					// [SEL_EVT_ON]
					if (cOpcode === '3d'){
						var SEL_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + SEL_id.toUpperCase() + '\'';
					};
					// Remove Item [ITEM_LOST]
					if (cOpcode === '3e'){
						var ITEM_code = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]);
						tempScriptCode = tempCode + '\'' + ITEM_code.toUpperCase() + '\'';
					};
					// [FLR_SET]
					if (cOpcode === '3f'){
						var FLR_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							FLR_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
						tempScriptCode = tempCode + '\'' + FLR_id.toUpperCase() + '\', ' + R3_SCD_CODE_FLAGS[FLR_flag];
					};
					// Set Variable [MEMB_SET]
					if (cOpcode === '40'){
						var MEMB_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							MEMB_variable = cFunction.slice(R3_SCD_DEC_DB.variable[0], R3_SCD_DEC_DB.variable[1]);
						tempScriptCode = tempCode + '\'' + MEMB_id.toUpperCase() + '\', \'' + MEMB_variable.toUpperCase() + '\'';
					};
					// Set Value 2 [MEMB_SET2]
					if (cOpcode === '41'){
						var	MEMB_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							MEMB_variable = cFunction.slice(R3_SCD_DEC_DB.variable[0], R3_SCD_DEC_DB.variable[1]);
						tempScriptCode = tempCode + '\'' + MEMB_id.toUpperCase() + '\', \'' + MEMB_variable.toUpperCase() + '\'';
					};
					// Set Fade [FADE_SET]
					if (cOpcode === '46'){
						var FADE_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							FADE_unk0 	  = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							FADE_type 	  = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
							FADE_colorB   = cFunction.slice(R3_SCD_DEC_DB.colorB[0], R3_SCD_DEC_DB.colorB[1]),
							FADE_colorG   = cFunction.slice(R3_SCD_DEC_DB.colorG[0], R3_SCD_DEC_DB.colorG[1]),
							FADE_colorR   = cFunction.slice(R3_SCD_DEC_DB.colorR[0], R3_SCD_DEC_DB.colorR[1]),
							FADE_colorY   = cFunction.slice(R3_SCD_DEC_DB.colorY[0], R3_SCD_DEC_DB.colorY[1]),
							FADE_colorM   = cFunction.slice(R3_SCD_DEC_DB.colorM[0], R3_SCD_DEC_DB.colorM[1]),
							FADE_colorC   = cFunction.slice(R3_SCD_DEC_DB.colorC[0], R3_SCD_DEC_DB.colorC[1]),
							FADE_duration = cFunction.slice(R3_SCD_DEC_DB.duration[0], R3_SCD_DEC_DB.duration[1]);
						tempScriptCode = tempCode + '\'' + FADE_id.toUpperCase() + '\', \'' + FADE_unk0.toUpperCase() + '\', \'' + FADE_type.toUpperCase() + '\', \'' + FADE_colorB.toUpperCase() + '\', \'' + FADE_colorG.toUpperCase() + '\', \'' + 
										 FADE_colorR.toUpperCase() + '\', \'' + FADE_colorY.toUpperCase() + '\', \'' + FADE_colorM.toUpperCase() + '\', \'' + FADE_colorC.toUpperCase() + '\', \'' + FADE_duration.toUpperCase() + '\'';
					};
					// Char Trigger [WORK_SET]
					if (cOpcode === '47'){
						var WORK_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
							WORK_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + WORK_target.toUpperCase() + '\', \'' + WORK_value.toUpperCase() + '\'';
					};
					// [SPD_SET]
					if (cOpcode === '48'){
						var SPD_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							SPD_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + SPD_id.toUpperCase() + '\', \'' + SPD_value.toUpperCase() + '\'';
					};
					// Set Event Value [SET]
					if (cOpcode === '4d'){
						var SET_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							SET_var = cFunction.slice(R3_SCD_DEC_DB.typeVar[0], R3_SCD_DEC_DB.typeVar[1]),
							SET_flag = R3_SCD_CODE_FLAGS[cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1])];
						tempScriptCode = tempCode + '\'' + SET_id.toUpperCase() + '\', \'' + SET_var.toUpperCase() + '\', ' + SET_flag;
					};
					// Change Camera [CUT_CHG]
					if (cOpcode === '50'){
						var CUT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + parseInt(CUT_id, 16);
					};
					// Lock Camera [CUT_AUTO]
					if (cOpcode === '52'){
						var CUT_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
							isLocked = R3_SCD_CODE_FLAGS[CUT_flag];
						tempScriptCode = tempCode + isLocked;
					};
					// Swap Camera [CUT_REPLACE]
					if (cOpcode === '53'){
						var CUT_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							CUT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + parseInt(CUT_id, 16) + ', ' + parseInt(CUT_value, 16);
					};
					// [CUT_BE_SET]
					if (cOpcode === '54'){
						var CUT_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							CUT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
							CUT_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
						tempScriptCode = tempCode + '\'' + CUT_id.toUpperCase() + '\', \'' + CUT_value.toUpperCase() + '\', ' + R3_SCD_CODE_FLAGS[CUT_flag]; 
					};
					// Set Target Position [POS_SET]
					if (cOpcode === '55'){
						var POS_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
							POS_X	   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							POS_Y	   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							POS_Z	   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
						tempScriptCode = tempCode + '\'' + POS_target.toUpperCase() + '\', \'' + POS_X.toUpperCase() + '\', \'' + POS_Y.toUpperCase() + '\', \'' + POS_Z.toUpperCase() + '\'';
					};
					// [DIR_SET]
					if (cOpcode === '56'){
						var POS_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
							POS_X	   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							POS_Y	   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							POS_Z	   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
						tempScriptCode = tempCode + '\'' + POS_target.toUpperCase() + '\', \'' + POS_X.toUpperCase() + '\', \'' + POS_Y.toUpperCase() + '\', \'' + POS_Z.toUpperCase() + '\'';
					}
					// [SET_VIB0]
					if (cOpcode === '57'){
						var SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
						tempScriptCode = tempCode + '\'' + SET_data0.toUpperCase() + '\', \'' + SET_data1.toUpperCase() + '\'';
					};
					// [SET_VIB1]
					if (cOpcode === '58'){
						var SET_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
						tempScriptCode = tempCode + '\'' + SET_id.toUpperCase() + '\', \'' + SET_data0.toUpperCase() + '\', \'' + SET_data1.toUpperCase() + '\'';
					};
					// [SET_VIB_FADE]
					if (cOpcode === '59'){
						var SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
							SET_data2 = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]),
							SET_data3 = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]);
						tempScriptCode = tempCode + '\'' + SET_data0.toUpperCase() + '\', \'' + SET_data1.toUpperCase() + '\', \'' + SET_data2.toUpperCase() + '\', \'' + SET_data3.toUpperCase() + '\'';
					};
					// RBJ Trigger [RBJ_SET]
					if (cOpcode === '5a'){
						var RBJ_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + RBJ_id.toUpperCase() + '\'';	
					};
					// Display Message [MESSAGE_ON]
					if (cOpcode === '5b'){
						var MESSAGE_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							MESSAGE_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							MESSAGE_dMode = cFunction.slice(R3_SCD_DEC_DB.displayMode[0], R3_SCD_DEC_DB.displayMode[1]);
						tempScriptCode = tempCode + parseInt(MESSAGE_id, 16) + ', \'' + MESSAGE_data0.toUpperCase() + '\', \'' + MESSAGE_dMode.toUpperCase() + '\'';
					};
					// [RAIN_SET]
					if (cOpcode === '5c'){
						var RAIN_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + RAIN_value.toUpperCase() + '\'';
					};
					// [SHAKE_ON]
					if (cOpcode === '5e'){
						var SHAKE_id 	= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							SHAKE_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + SHAKE_id.toUpperCase() + '\', \'' + SHAKE_value.toUpperCase() + '\'';
					};
					// Change Weapon [WEAPON_CHG]
					if (cOpcode === '5f'){
						var WEAPON_id = cFunction.slice(R3_SCD_DEC_DB.weaponId[0], R3_SCD_DEC_DB.weaponId[1]);
						tempScriptCode = tempCode + '\'' + WEAPON_id.toUpperCase() + '\'';
					};
					// Set Door [DOOR_AOT_SET]
					if (cOpcode === '61'){
						var DOOR_Id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							DOOR_aot    = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
							DOOR_XPos   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							DOOR_YPos   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							DOOR_ZPos   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
							DOOR_RPos   = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
							DOOR_nextX  = cFunction.slice(R3_SCD_DEC_DB.nextXpos[0], R3_SCD_DEC_DB.nextXpos[1]),
							DOOR_nextY  = cFunction.slice(R3_SCD_DEC_DB.nextYpos[0], R3_SCD_DEC_DB.nextYpos[1]),
							DOOR_nextZ  = cFunction.slice(R3_SCD_DEC_DB.nextZpos[0], R3_SCD_DEC_DB.nextZpos[1]),
							DOOR_nextR  = cFunction.slice(R3_SCD_DEC_DB.nextRpos[0], R3_SCD_DEC_DB.nextRpos[1]),
							DOOR_nStage = (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1])) + 1),
							DOOR_nRoom  = cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]),
							DOOR_nCam 	= parseInt(cFunction.slice(R3_SCD_DEC_DB.nextCam[0], R3_SCD_DEC_DB.nextCam[1]), 16),
							DOOR_zIndex = cFunction.slice(R3_SCD_DEC_DB.zIndex[0], R3_SCD_DEC_DB.zIndex[1]),
							DOOR_type 	= cFunction.slice(R3_SCD_DEC_DB.doorType[0], R3_SCD_DEC_DB.doorType[1]),
							DOOR_orient = cFunction.slice(R3_SCD_DEC_DB.openOrient[0], R3_SCD_DEC_DB.openOrient[1]),
							DOOR_unk0 	= cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							DOOR_lkFlag = cFunction.slice(R3_SCD_DEC_DB.lockFlag[0], R3_SCD_DEC_DB.lockFlag[1]),
							DOOR_lkKey  = cFunction.slice(R3_SCD_DEC_DB.lockKey[0], R3_SCD_DEC_DB.lockKey[1]),
							DOOR_dText  = cFunction.slice(R3_SCD_DEC_DB.displayText[0], R3_SCD_DEC_DB.displayText[1]);
						tempScriptCode = tempCode + '\'' + DOOR_Id.toUpperCase() + '\', \'' + DOOR_aot.toUpperCase() + '\', \'' + DOOR_XPos.toUpperCase() + '\', \'' + DOOR_YPos.toUpperCase() + '\', \'' +
										 DOOR_ZPos.toUpperCase() + '\', \'' + DOOR_RPos.toUpperCase() + '\', \'' + DOOR_nextX.toUpperCase() + '\', \'' + DOOR_nextY.toUpperCase() + '\', \'' +
										 DOOR_nextZ.toUpperCase() + '\', \'' + DOOR_nextR.toUpperCase() + '\', ' + DOOR_nStage + ', \'' + DOOR_nRoom.toUpperCase() + '\', ' +
										 DOOR_nCam + ', \'' + DOOR_zIndex.toUpperCase() + '\', \'' + DOOR_type.toUpperCase() + '\', \'' + DOOR_orient.toUpperCase() + '\', \'' +
										 DOOR_unk0.toUpperCase() + '\', \'' + DOOR_lkFlag.toUpperCase() + '\', \'' + DOOR_lkKey.toUpperCase() + '\', \'' + DOOR_dText.toUpperCase() + '\'';
					};
					// Set Door 4P [DOOR_AOT_SET_4P]
					if (cOpcode === '62'){
						var DOOR_Id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							DOOR_aot    = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
							DOOR_XPos   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							DOOR_YPos   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							DOOR_ZPos   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
							DOOR_RPos   = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
							DOOR_4P     = cFunction.slice(R3_SCD_DEC_DB.val4P[0], R3_SCD_DEC_DB.val4P[1]),
							DOOR_nextX  = cFunction.slice(R3_SCD_DEC_DB.nextXpos[0], R3_SCD_DEC_DB.nextXpos[1]),
							DOOR_nextY  = cFunction.slice(R3_SCD_DEC_DB.nextYpos[0], R3_SCD_DEC_DB.nextYpos[1]),
							DOOR_nextZ  = cFunction.slice(R3_SCD_DEC_DB.nextZpos[0], R3_SCD_DEC_DB.nextZpos[1]),
							DOOR_nextR  = cFunction.slice(R3_SCD_DEC_DB.nextRpos[0], R3_SCD_DEC_DB.nextRpos[1]),
							DOOR_nStage = (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1])) + 1),
							DOOR_nRoom  = cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]),
							DOOR_nCam 	= parseInt(cFunction.slice(R3_SCD_DEC_DB.nextCam[0], R3_SCD_DEC_DB.nextCam[1]), 16),
							DOOR_zIndex = cFunction.slice(R3_SCD_DEC_DB.zIndex[0], R3_SCD_DEC_DB.zIndex[1]),
							DOOR_type 	= cFunction.slice(R3_SCD_DEC_DB.doorType[0], R3_SCD_DEC_DB.doorType[1]),
							DOOR_orient = cFunction.slice(R3_SCD_DEC_DB.openOrient[0], R3_SCD_DEC_DB.openOrient[1]),
							DOOR_unk0 	= cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							DOOR_lkFlag = cFunction.slice(R3_SCD_DEC_DB.lockFlag[0], R3_SCD_DEC_DB.lockFlag[1]),
							DOOR_lkKey  = cFunction.slice(R3_SCD_DEC_DB.lockKey[0], R3_SCD_DEC_DB.lockKey[1]),
							DOOR_dText  = cFunction.slice(R3_SCD_DEC_DB.displayText[0], R3_SCD_DEC_DB.displayText[1]);
						tempScriptCode = tempCode + '\'' + DOOR_Id.toUpperCase() + '\', \'' + DOOR_aot.toUpperCase() + '\', \'' + DOOR_XPos.toUpperCase() + '\', \'' +
										 DOOR_YPos.toUpperCase() + '\', \'' + DOOR_ZPos.toUpperCase() + '\', \'' + DOOR_RPos.toUpperCase() + '\', \'' + DOOR_4P.toUpperCase() + '\', \'' +
										 DOOR_nextX.toUpperCase() + '\', \'' + DOOR_nextY.toUpperCase() + '\', \'' + DOOR_nextZ.toUpperCase() + '\', \'' + DOOR_nextR.toUpperCase() + '\', ' +
										 DOOR_nStage + ', \'' + DOOR_nRoom.toUpperCase() + '\', ' + DOOR_nCam + ', \'' + DOOR_zIndex.toUpperCase() + '\', \'' +
										 DOOR_type.toUpperCase() + '\', \'' + DOOR_orient.toUpperCase() + '\', \'' + DOOR_unk0.toUpperCase() + '\', \'' + DOOR_lkFlag.toUpperCase() + '\', \'' +
										 DOOR_lkKey.toUpperCase() + '\', \'' + DOOR_dText.toUpperCase() + '\'';
					};
					// Set Interactive Object [AOT_SET]
					if (cOpcode === '63'){
						var AOT_id 		 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							AOT_aot 	 = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
							AOT_type 	 = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
							AOT_nFloor 	 = cFunction.slice(R3_SCD_DEC_DB.nFloor[0], R3_SCD_DEC_DB.nFloor[1]),
							AOT_aotSuper = cFunction.slice(R3_SCD_DEC_DB.aotSuper[0], R3_SCD_DEC_DB.aotSuper[1]),
							AOT_X		 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							AOT_Y		 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							AOT_W		 = cFunction.slice(R3_SCD_DEC_DB.posW[0], R3_SCD_DEC_DB.posW[1]),
							AOT_H		 = cFunction.slice(R3_SCD_DEC_DB.posH[0], R3_SCD_DEC_DB.posH[1]),
							AOT_data0 	 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							AOT_data1 	 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
							AOT_data2 	 = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]),
							AOT_data3 	 = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]),
							AOT_dMode 	 = cFunction.slice(R3_SCD_DEC_DB.displayMode[0], R3_SCD_DEC_DB.displayMode[1]);
						tempScriptCode 	 = tempCode + '\'' + AOT_id.toUpperCase() + '\', \'' + AOT_aot.toUpperCase() + '\', \'' + AOT_type.toUpperCase() + '\', \'' + AOT_nFloor.toUpperCase() + '\', \'' + AOT_aotSuper.toUpperCase() + '\', \'' + AOT_X.toUpperCase() + 
										   '\', \'' + AOT_Y.toUpperCase() + '\', \'' + AOT_W.toUpperCase() + '\', \'' + AOT_H.toUpperCase() + '\', \'' + AOT_data0.toUpperCase() + '\', \'' + AOT_data1.toUpperCase() + '\', \'' + AOT_data2.toUpperCase() + '\', \'' +
										   AOT_data3.toUpperCase() + '\', \'' + AOT_dMode.toUpperCase() + '\'';
					};
					// [AOT_RESET]
					if (cOpcode === '65'){
						var AOT_aot    = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
							AOT_id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							AOT_type   = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
							AOT_unk3   = cFunction.slice(R3_SCD_DEC_DB.unk3[0], R3_SCD_DEC_DB.unk3[1]),
							AOT_unk0   = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							AOT_num    = cFunction.slice(R3_SCD_DEC_DB.num[0], R3_SCD_DEC_DB.num[1]),
							AOT_unk1   = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
							AOT_flag   = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
							AOT_unk2   = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]);
						tempScriptCode = tempCode + '\'' + AOT_aot.toUpperCase() + '\', \'' + AOT_id.toUpperCase() + '\', \'' + AOT_type.toUpperCase() + '\', \'' + 
										 AOT_unk3.toUpperCase() + '\', \'' + AOT_unk0.toUpperCase() + '\', \'' + AOT_num.toUpperCase() + '\', \'' + AOT_unk1.toUpperCase() + '\', \'' + 
										 AOT_flag.toUpperCase() + '\', \'' + AOT_unk2.toUpperCase() + '\'';
					};
					// Run Interactive Object [AOT_ON]
					if (cOpcode === '66'){
						var AOT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + AOT_id.toUpperCase() + '\'';
					};
					// Set Item [ITEM_AOT_SET]
					if (cOpcode === '67'){
						var ITEM_Id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							ITEM_aot 	 = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
							ITEM_Xpos 	 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							ITEM_Ypos 	 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							ITEM_Zpos 	 = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
							ITEM_Rpos 	 = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
							ITEM_code 	 = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
							ITEM_unk0 	 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							ITEM_quant 	 = cFunction.slice(R3_SCD_DEC_DB.itemQuant[0], R3_SCD_DEC_DB.itemQuant[1]),
							ITEM_unk1 	 = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
							ITEM_unk2 	 = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]),
							ITEM_flag 	 = cFunction.slice(R3_SCD_DEC_DB.itemFlag[0], R3_SCD_DEC_DB.itemFlag[1]),
							ITEM_modelId = cFunction.slice(R3_SCD_DEC_DB.modelId[0], R3_SCD_DEC_DB.modelId[1]),
							ITEM_MP 	 = cFunction.slice(R3_SCD_DEC_DB.itemMP[0], R3_SCD_DEC_DB.itemMP[1]);
						tempScriptCode 	 = tempCode + '\'' + ITEM_Id.toUpperCase() + '\', \'' + ITEM_aot.toUpperCase() + '\', \'' + ITEM_Xpos.toUpperCase() + '\', \'' + ITEM_Ypos.toUpperCase() + '\', \'' +
										 ITEM_Zpos.toUpperCase() + '\', \'' + ITEM_Rpos.toUpperCase() + '\', \'' + ITEM_code.toUpperCase() + '\', ' + parseInt(ITEM_quant, 16) + ', \'' + ITEM_unk1.toUpperCase() + '\', \'' +
										 ITEM_unk2.toUpperCase() + '\', \'' + ITEM_flag.toUpperCase() + '\', \'' + ITEM_modelId.toUpperCase() + '\', \'' + ITEM_MP.toUpperCase() + '\'';
					};
					// Set Item 4P [ITEM_AOT_SET_4P]
					if (cOpcode === '68'){
						var ITEM_Id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							ITEM_aot 	 = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
							ITEM_Xpos 	 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							ITEM_Ypos 	 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							ITEM_Zpos 	 = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
							ITEM_Rpos 	 = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
							ITEM_4P 	 = cFunction.slice(R3_SCD_DEC_DB.val4P[0], R3_SCD_DEC_DB.val4P[1]),
							ITEM_code 	 = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
							ITEM_unk0 	 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							ITEM_quant 	 = cFunction.slice(R3_SCD_DEC_DB.itemQuant[0], R3_SCD_DEC_DB.itemQuant[1]),
							ITEM_unk1 	 = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
							ITEM_unk2 	 = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]),
							ITEM_flag 	 = cFunction.slice(R3_SCD_DEC_DB.itemFlag[0], R3_SCD_DEC_DB.itemFlag[1]),
							ITEM_modelId = cFunction.slice(R3_SCD_DEC_DB.modelId[0], R3_SCD_DEC_DB.modelId[1]),
							ITEM_MP 	 = cFunction.slice(R3_SCD_DEC_DB.itemMP[0], R3_SCD_DEC_DB.itemMP[1]);
						tempScriptCode 	 = tempCode + '\'' + ITEM_Id.toUpperCase() + '\', \'' + ITEM_aot.toUpperCase() + '\', \'' + ITEM_Xpos.toUpperCase() + '\', \'' + ITEM_Ypos.toUpperCase() + '\', \'' + ITEM_Zpos.toUpperCase() +
										 '\', \'' + ITEM_Rpos.toUpperCase() + '\', \'' + ITEM_4P.toUpperCase() + '\', \'' + ITEM_code.toUpperCase() + '\', ' + parseInt(ITEM_quant, 16) + ', \'' + ITEM_unk1.toUpperCase() + '\', \'' +
										 ITEM_unk2.toUpperCase() + '\', \'' + ITEM_flag.toUpperCase() + '\', \'' + ITEM_modelId.toUpperCase() + '\', \'' + ITEM_MP.toUpperCase() + '\'';
					};
					// [SCA_ID_SET]
					if (cOpcode === '6e'){
						var SCA_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							SCA_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + SCA_id.toUpperCase() + '\', \'' + SCA_value.toUpperCase() + '\'';
					};
					// [ESPR_KILL2]
					if (cOpcode === '75'){
						var ESPR_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + ESPR_id.toUpperCase() + '\'';
					};
					// [ESPR_KILL_ALL]
					if (cOpcode === '76'){
						var ESPR_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							ESPR_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + ESPR_id.toUpperCase() + '\', \'' + ESPR_value.toUpperCase() + '\'';
					};
					// Play SE [SE_ON]
					if (cOpcode === '77'){
						var SE_id  	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							SE_type  = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
							SE_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
							SE_work  = cFunction.slice(R3_SCD_DEC_DB.work[0], R3_SCD_DEC_DB.work[1]),
							SE_data3 = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]),
							SE_X 	 = cFunction.slice(R3_SCD_DEC_DB.seX[0], R3_SCD_DEC_DB.seX[1]),
							SE_Y 	 = cFunction.slice(R3_SCD_DEC_DB.seY[0], R3_SCD_DEC_DB.seY[1]),
							SE_Z 	 = cFunction.slice(R3_SCD_DEC_DB.seZ[0], R3_SCD_DEC_DB.seZ[1]);
						tempScriptCode = tempCode + '\'' + SE_id.toUpperCase() + '\', \'' + SE_type.toUpperCase() + '\', \'' + SE_data1.toUpperCase() + '\', \'' + SE_work.toUpperCase() + '\', \'' + SE_data3.toUpperCase() + '\', \'' +
										 SE_X.toUpperCase() + '\', \'' + SE_Y.toUpperCase() + '\', \'' + SE_Z.toUpperCase() + '\'';
					};
					// [BGM_CTL]
					if (cOpcode === '78'){
						var BGM_id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							BGM_op 	   = cFunction.slice(R3_SCD_DEC_DB.op[0], R3_SCD_DEC_DB.op[1]),
							BGM_type   = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
							BGM_value  = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
							BGM_volume = parseInt(cFunction.slice(R3_SCD_DEC_DB.volume[0], R3_SCD_DEC_DB.volume[1]), 16);
						tempScriptCode = tempCode + '\'' + BGM_id.toUpperCase() + '\', \'' + BGM_op.toUpperCase() + '\', \'' + BGM_type.toUpperCase() + '\', \'' + BGM_value.toUpperCase() + '\', ' + BGM_volume;
					};
					// [XA_ON]
					if (cOpcode === '79'){
						var XA_Id = cFunction.slice(R3_SCD_DEC_DB.xaId[0], R3_SCD_DEC_DB.xaId[1]),
							XA_Data = cFunction.slice(R3_SCD_DEC_DB.xaData[0], R3_SCD_DEC_DB.xaData[1]);
						tempScriptCode = tempCode + '\'' + XA_Id.toUpperCase() + '\', \'' + XA_Data.toUpperCase() + '\'';
					};
					// Call Cinematic [MOVIE_ON]
					if (cOpcode === '7a'){
						var MOVIE_id = cFunction.slice(R3_SCD_DEC_DB.movieId[0], R3_SCD_DEC_DB.movieId[1]);
						tempScriptCode = tempCode + '\'' + MOVIE_id.toUpperCase() + '\'';
					};
					// [BGM_TBL_SET]
					if (cOpcode === '7b'){
						var BGM_id0  = cFunction.slice(R3_SCD_DEC_DB.id0[0], R3_SCD_DEC_DB.id0[1]),
							BGM_id1  = cFunction.slice(R3_SCD_DEC_DB.id1[0], R3_SCD_DEC_DB.id1[1]),
							BGM_type = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]);
						tempScriptCode = tempCode + '\'' + BGM_id0.toUpperCase() + '\', \'' + BGM_id1.toUpperCase() + '\', \'' + BGM_type.toUpperCase() + '\'';
					};
					// Set Enemy / NPC [EM_SET]
					if (cOpcode === '7d'){
						var EM_unk0 	 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
							EM_enemyId   = cFunction.slice(R3_SCD_DEC_DB.enemyId[0], R3_SCD_DEC_DB.enemyId[1]),
							EM_enemyType = cFunction.slice(R3_SCD_DEC_DB.enemyType[0], R3_SCD_DEC_DB.enemyType[1]),
							EM_enemyPose = cFunction.slice(R3_SCD_DEC_DB.enemyPose[0], R3_SCD_DEC_DB.enemyPose[1]),
							EM_unk1 	 = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
							EM_unk2 	 = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]),
							EM_soundSet  = cFunction.slice(R3_SCD_DEC_DB.soundSet[0], R3_SCD_DEC_DB.soundSet[1]),
							EM_texture 	 = cFunction.slice(R3_SCD_DEC_DB.texture[0], R3_SCD_DEC_DB.texture[1]),
							EM_flag 	 = cFunction.slice(R3_SCD_DEC_DB.enemyFlag[0], R3_SCD_DEC_DB.enemyFlag[1]),
							EM_X 		 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
							EM_Y 		 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
							EM_Z 		 = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
							EM_R 		 = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
							EM_motion	 = cFunction.slice(R3_SCD_DEC_DB.motion[0], R3_SCD_DEC_DB.motion[1]),
							EM_ctrlFlag	 = cFunction.slice(R3_SCD_DEC_DB.ctrlFlag[0], R3_SCD_DEC_DB.ctrlFlag[1]);
						tempScriptCode = tempCode + '\'' + EM_unk0.toUpperCase() + '\', \'' + EM_enemyId.toUpperCase() + '\', \'' + EM_enemyType.toUpperCase() + '\', \'' +
										 EM_enemyPose.toUpperCase() + '\', \'' + EM_unk1.toUpperCase() + '\', \'' + EM_unk2.toUpperCase() + '\', \'' + EM_soundSet.toUpperCase() +
										 '\', \'' + EM_texture.toUpperCase() + '\', \'' + EM_flag.toUpperCase() + '\', \'' + EM_X.toUpperCase() + '\', \'' + EM_Y.toUpperCase() +
										 '\', \'' + EM_Z.toUpperCase() + '\', \'' + EM_R.toUpperCase() + '\', \'' + EM_motion.toUpperCase() + '\', \'' + EM_ctrlFlag.toUpperCase() + '\'';
					};
					// [MIZU_DIV]
					if (cOpcode === '7e'){
						var MIZU_id = cFunction.slice(R3_SCD_DEC_DB.mizuId[0], R3_SCD_DEC_DB.mizuId[1]);
						tempScriptCode = tempCode + '\'' + MIZU_id.toUpperCase() + '\'';
					};
					// Motion Trigger [PLC_MOTION]
					if (cOpcode === '80'){
						var PLC_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
							PLC_type  = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]);
						tempScriptCode = tempCode + '\'' + PLC_id + '\', \'' + PLC_value + '\', \'' + PLC_type + '\'';
					};
					// Set Animation DEST [PLC_DEST]
					if (cOpcode === '81'){
						var PLC_animation	 = cFunction.slice(R3_SCD_DEC_DB.animation[0], R3_SCD_DEC_DB.animation[1]),
							PLC_animModifier = cFunction.slice(R3_SCD_DEC_DB.animModifier[0], R3_SCD_DEC_DB.animModifier[1]),
							PLC_dataA		 = cFunction.slice(R3_SCD_DEC_DB.dataA[0], R3_SCD_DEC_DB.dataA[1]),
							PLC_dataB		 = cFunction.slice(R3_SCD_DEC_DB.dataB[0], R3_SCD_DEC_DB.dataB[1]);
						tempScriptCode = tempCode + '\'' + PLC_animation.toUpperCase() + '\', \'' + PLC_animModifier.toUpperCase() + '\', \'' + PLC_dataA.toUpperCase() + '\', \'' + PLC_dataB.toUpperCase() + '\'';
					};
					// Set Head Animation [PLC_NECK]
					if (cOpcode === '82'){
						var PLC_type   = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
							PLC_repeat = cFunction.slice(R3_SCD_DEC_DB.repeat[0], R3_SCD_DEC_DB.repeat[1]),
							PLC_data0  = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
							PLC_data1  = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
							PLC_data2  = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]),
							PLC_data3  = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]),
							PLC_speed  = cFunction.slice(R3_SCD_DEC_DB.speed[0], R3_SCD_DEC_DB.speed[1]);
						tempScriptCode = tempCode + '\'' + PLC_type.toUpperCase() + '\', \'' + PLC_repeat.toUpperCase() + '\', \'' + PLC_data0.toUpperCase() + '\', \'' + PLC_data1.toUpperCase() + '\', \'' + PLC_data2.toUpperCase() + '\', \'' + 
										 PLC_data3.toUpperCase() + '\', \'' + PLC_speed.toUpperCase() + '\'';
					};
					// [PLC_FLG]
					if (cOpcode === '84'){
						var PLC_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + PLC_id.toUpperCase() + '\', \'' + PLC_value.toUpperCase() + '\'';
					};
					// [PLC_GUN]
					if (cOpcode === '85'){
						var PLC_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + PLC_Id.toUpperCase() + '\'';
					};
					// [PLC_ROT]
					if (cOpcode === '88'){
						var PLC_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + PLC_id.toUpperCase() + '\', \'' + PLC_value.toUpperCase() + '\'';
					};
					// [PLC_CNT]
					if (cOpcode === '89'){
						var PLC_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + PLC_Id.toUpperCase() + '\'';
					};
					// [PLC_MOT_NUM]
					if (cOpcode === '8e'){
						var PLC_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
							PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
						tempScriptCode = tempCode + '\'' + PLC_id.toUpperCase() + '\', \'' + PLC_value.toUpperCase() + '\'';
					};
					// Reset Enemy Animation [EM_RESET]
					if (cOpcode === '8f'){
						var EM_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
						tempScriptCode = tempCode + '\'' + EM_id.toUpperCase() + '\'';
					};
					/*
						End
					*/
					tempScriptCode = tempScriptCode + closeJsCode;
				} else {
					if (R3_CODE_IS_CHECK === true){
						// [DOOR_CK]
						if (cOpcode === '27'){
							tempScriptCode = checkIfWasCheckOpcode(lastOpcodeWasCheck, tempScriptCode);
							tempScriptCode = tempScriptCode + R3_CODE_FN_NAME + '()){';
							lastOpcodeWasCheck = true;
							tabCounter++;
						};
						// [BGM_TBL_CK]
						if (cOpcode === '35'){
							tempScriptCode = checkIfWasCheckOpcode(lastOpcodeWasCheck, tempScriptCode);
							var BGM_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
								BGM_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
								BGM_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
							tempScriptCode = tempScriptCode + R3_CODE_FN_NAME + '(' + BGM_data0.toUpperCase() + ', ' + BGM_data1.toUpperCase() + ') === \'' + BGM_value.toUpperCase() + '\'){';
							lastOpcodeWasCheck = true;
							tabCounter++;
						};
						// [MEMB_CMP]
						if (cOpcode === '43'){
							tempScriptCode = checkIfWasCheckOpcode(lastOpcodeWasCheck, tempScriptCode);
							var MEMB_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
								MEMB_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
							tempScriptCode = tempScriptCode + R3_CODE_FN_NAME + '(\'' + MEMB_id.toUpperCase() + '\') === \'' + MEMB_value.toUpperCase() + '\'){';
							lastOpcodeWasCheck = true;
							tabCounter++;
						};
						// CK [CK]
						if (cOpcode === '4c'){
							tempScriptCode = checkIfWasCheckOpcode(lastOpcodeWasCheck, tempScriptCode);
							var CK_event = cFunction.slice(R3_SCD_DEC_DB.event[0], R3_SCD_DEC_DB.event[1]),
								CK_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
								CK_flag  = R3_SCD_CODE_FLAGS[cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1])];
							tempScriptCode = tempScriptCode + R3_CODE_FN_NAME + '(\'' + CK_event.toUpperCase() + '\', \'' + CK_value.toUpperCase() + '\') === ' + CK_flag + '){';
							lastOpcodeWasCheck = true;
							tabCounter++;
						};
						// Compare Values [CMP]
						if (cOpcode === '4e'){
							tempScriptCode = checkIfWasCheckOpcode(lastOpcodeWasCheck, tempScriptCode);
							var CMP_varType = cFunction.slice(R3_SCD_DEC_DB.varType[0],	R3_SCD_DEC_DB.varType[1]),
								CMP_cmpType = cFunction.slice(R3_SCD_DEC_DB.cmpType[0],	R3_SCD_DEC_DB.cmpType[1]),
								CMP_value   = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
							tempScriptCode = tempScriptCode + R3_CODE_FN_NAME + '(\'' + CMP_varType.toUpperCase() + '\' ' + R3_SCD_COMPARE_VALUES[CMP_cmpType][1] + ' \'' + CMP_value + '\')){';
							lastOpcodeWasCheck = true;
							tabCounter++;
						};
						// Check Item [KEEP_ITEM_CK]
						if (cOpcode === '6b'){
							tempScriptCode = checkIfWasCheckOpcode(lastOpcodeWasCheck, tempScriptCode);
							var ITEM_code = cFunction.slice(R3_SCD_DEC_DB.itemId[0], R3_SCD_DEC_DB.itemId[1]);
							tempScriptCode = tempScriptCode + R3_CODE_FN_NAME + '(\'' + ITEM_code.toUpperCase() + '\') === true){';
							lastOpcodeWasCheck = true;
							tabCounter++;
						};
						// [KEY_CK]
						if (cOpcode === '6c'){
							tempScriptCode = checkIfWasCheckOpcode(lastOpcodeWasCheck, tempScriptCode);
							var KEY_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
								KEY_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
							tempScriptCode = tempScriptCode + R3_CODE_FN_NAME + '(\'' + KEY_value + '\') === ' + R3_SCD_CODE_FLAGS[KEY_flag] + '){';
							lastOpcodeWasCheck = true;
							tabCounter++;
						};
					} else {
						lastOpcodeWasCheck = false;
						tempScriptCode = tempScriptCode + '\n' + tabSpace + R3_CODE_FN_NAME;
						// Else
						if (cOpcode === '07'){
							tabCounter++;
						};
						// For
						if (cOpcode === '0d'){
							tabCounter++;
						};
						// While
						if (cOpcode === '10'){
							tabCounter++;
						};
						// Do start
						if (cOpcode === '12'){
							tabCounter++;
						};
					};
				};
				/*
					End
				*/
				// Hex View checks
				if (R3_SETTINGS.SETTINGS_SCD_CHANGE_HEX_VIEW_COLOR === true){
					changeColorCSS = 'R3_SCD_function_' + cmdType + ' no-bg-image';
				};
				if (R3_SETTINGS.SETTINGS_SCD_SELECT_HEX_AS_TEXT === true){
					hexSelectMode = 'user-select-normal';
				};
				var fnHint = '';
				scriptHex = scriptHex + '<font id="R3_SCD_HEX_VIEW_FN_' + c + '" onmouseover="R3_DESIGN_SCD_hoverFunction(' + c + ', true);" onmouseout="R3_DESIGN_SCD_hoverFunction(0, false);" class="' + hexSelectMode + ' ' + changeColorCSS + '" title="(' + parseInt(c + 1) + ') ' + fnHint + '">' + R3_unsolveHEX(cFunction) + '</font> ';
				tempScriptHex = tempScriptHex + R3_unsolveHEX(cFunction);
				c++;
			};
			lblId = id;
			if (SCD_scriptNames[id] !== undefined){
				lblId = SCD_scriptNames[id];
			};
			document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value = tempScriptCode;
		};
		if (canDisplayScript === true && R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			TMS.append('R3_SCD_SCRIPT_INNER', SCD_HTML_TEMPLATE);
		};
		R3_SCD_CURRENT_SCRIPT_HEX = tempScriptHex.replace(new RegExp(' ', 'g'), '');
		R3_SCD_CURREN_HEX_VIEW = scriptHex.slice(0, parseInt(scriptHex.length - 1));
		R3_SCD_TOTAL_FUNCTIONS = functionList.length;
		R3_SCD_updateLabels();
		// End
		R3_SCD_ID_LIST_CAPTURE();
		R3_SCD_checkScriptActive();
		R3_SCD_SCRIPTS_IS_LOADING = false;
	};
};
// Clear Script
function R3_SCD_CLEAR_SCRIPT(){
	if (SCD_arquivoBruto !== undefined){
		if (R3_SCD_IS_EDITING === false){
			R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT] = ['0100'];
			R3_SCD_COMPILE(3);
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	Add / Remove Scripts
*/
// Add new script
function R3_SCD_SCRIPT_ADD(){
	if (R3_SCD_IS_EDITING === false){
		if (SCD_arquivoBruto !== undefined){
			var newScriptPos = Object.keys(R3_SCD_SCRIPTS_LIST).length;
			if (newScriptPos < 256){
				R3_SCD_SCRIPTS_LIST[newScriptPos] = ['0100'];
				R3_SCD_POINTERS[newScriptPos] = ['0000'];
				R3_SCD_TOTAL_SCRITPS++;
				R3_SCD_COMPILE(3);
				R3_SCD_displayScript(newScriptPos);
			} else {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to insert script! <br>Reason: You can only insert up to 255 scripts!');
			};
		} else {
			R3_SCD_NEW_FILE();
		};
	};
};
// Remove Script
function R3_SCD_SCRIPT_REMOVE(){
	if (R3_SCD_IS_EDITING === false){
		if (SCD_arquivoBruto !== undefined){
			if (Object.keys(R3_SCD_SCRIPTS_LIST).length !== 2){
				if (R3_SCD_CURRENT_SCRIPT === 0 || R3_SCD_CURRENT_SCRIPT === 1){
					R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: You can\'t delete this script! <br>Instead, try removing all functions using "Clear Script".');
				} else {
					R3_SCD_POINTERS.splice(R3_SCD_CURRENT_SCRIPT, 1);
					delete R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT];
					var newScriptPos = parseInt(Object.keys(R3_SCD_SCRIPTS_LIST).length - 1);
					R3_SCD_CURRENT_SCRIPT = newScriptPos;
					R3_SCD_TOTAL_SCRITPS--;
					R3_SCD_COMPILE(3);
					R3_SCD_displayScript(newScriptPos);
				};
			} else {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: You can\'t delete this script!');
			};
		} else {
			R3_SCD_NEW_FILE();
		};
	};
};
/*
	Copy / Paste Functions
*/
// Copy Function
function R3_SCD_COPY_FUNCTION(isCrop){
	if (SCD_arquivoBruto !== undefined){
		if (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][R3_SCD_HIGHLIGHT_FUNCTION] !== undefined){
			if (R3_SCD_IS_EDITING === true){
				// Opened edit form
				R3_SCD_TEMP_COPY_PASTE_FUNCTION = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][R3_SCD_CURRENT_FUNCTION];
			} else {
				// Copy shortcut [CTRL + C]
				if (R3_SCD_FUNCTION_FOCUSED === true){
					R3_SCD_TEMP_COPY_PASTE_FUNCTION = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][R3_SCD_HIGHLIGHT_FUNCTION];
				};
			};
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: This function is not available to copy!');
		};
		// End
		if (R3_SCD_TEMP_COPY_PASTE_FUNCTION !== '' && R3_SCD_TEMP_COPY_PASTE_FUNCTION !== undefined){
			if (isCrop === true){
				R3_SCD_FUNCTION_REMOVE(R3_SCD_HIGHLIGHT_FUNCTION);
			};
			var cOpcode = R3_SCD_TEMP_COPY_PASTE_FUNCTION.slice(0, 2), cColor = R3_SCD_DATABASE[cOpcode][2];
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Function copied sucessfully! <br>Function: ' + R3_fixVars(R3_SCD_HIGHLIGHT_FUNCTION, 4) + ' - Opcode: <font class="R3_SCD_function_' +
								 cColor + ' no-bg-image user-can-select">' + cOpcode.toUpperCase() + '</font> (<font class="R3_SCD_function_' + cColor + ' no-bg-image">' + R3_SCD_DATABASE[cOpcode][1] + '</font>)');
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
// Paste Function
function R3_SCD_PASTE_FUNCTION(isShortcut){
	if (SCD_arquivoBruto !== undefined){
		if (R3_SCD_IS_EDITING === false && R3_SCD_TEMP_COPY_PASTE_FUNCTION !== undefined){
			var promptPos, nextPos;
			if (isShortcut !== true){
				promptPos = R3_SYSTEM_PROMPT('Please, insert where you want to paste this function:');
			} else {
				promptPos = (R3_SCD_HIGHLIGHT_FUNCTION + 2);
			};
			if (promptPos !== null && promptPos !== '' && parseInt(promptPos) !== NaN){
				if (parseInt(promptPos) === 0){
					promptPos = 1;
				};
				nextPos = (parseInt(promptPos) - 1);
				if (nextPos > R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length){
					nextPos = (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length - 1);
				};
				R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].splice(nextPos, 0, R3_SCD_TEMP_COPY_PASTE_FUNCTION);
				R3_SCD_COMPILER_checkConditionalOpcodes(3);
				// Focus new function if shortcut
				if (isShortcut === true){
					R3_SCD_HIGHLIGHT_FUNCTION = promptPos;
					R3_SCD_navigateFunctions(0);
				};
			};
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	Add / Remove Functions
*/
// Add Function
function R3_SCD_FUNCTION_ADD(cOpcode){
	if (R3_SCD_IS_EDITING === false && SCD_arquivoBruto !== undefined){
		if (R3_SCD_DATABASE[cOpcode] !== undefined){
			R3_SCD_closeSeekFunction();
			TMS.css('R3_SCD_editForm_bg_image', {'display': 'none'});
			TMS.css('SCD_FUNCTION_SEARCH_FIELD', {'text-transform': 'none'});
			document.getElementById('SCD_FUNCTION_SEARCH_FIELD').value = '';
			document.getElementById('R3_SCD_editFunction_pos').disabled = '';
			document.getElementById('R3_SCD_editFunction_pos').value = (R3_SCD_HIGHLIGHT_FUNCTION + 2);
			document.getElementById('R3_SCD_editFunction_pos').max = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length;
			var focusDomId = '', opcodeForm = INCLUDE_SCD_EDIT_FUNCTIONS[cOpcode];
			// Check if form exists
			if (opcodeForm !== ''){
				document.getElementById('R3_SCD_EDITFUNCTION_HOLDER').innerHTML = opcodeForm;
				R3_SCD_currentOpcode = cOpcode;
				// Force it to render the new form
				if (R3_SCD_previousOpcode[(R3_SCD_previousOpcode.length - 1)] !== R3_SCD_currentOpcode){
					R3_DESIGN_MINIWINDOW_CLOSE(14);
				};
				R3_SCD_previousOpcode.push(R3_SCD_currentOpcode);
				R3_SCD_IS_EDITING = false;
				/*
					Opcodes
				*/
				// Execute Event [EVT_EXEC]
				if (cOpcode === '04'){
					document.getElementById('R3_SCD_EDIT_04_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_04_id';
				};
				// Event Kill [EVT_KILL]
				if (cOpcode === '05'){
					document.getElementById('R3_SCD_EDIT_05_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_05_id';
				};
				// Else [ELSE]
				if (cOpcode === '07'){
					document.getElementById('R3_SCD_EDIT_07_length').value = 1;
					R3_SCD_FUNCTION_CHECK_LENGTH_GENERATOR('07');
					focusDomId = 'R3_SCD_EDIT_07_length';
				};
				// Sleep [SLEEP]
				if (cOpcode === '09'){
					document.getElementById('R3_SCD_EDIT_09_sleeping').value = '0a';
					document.getElementById('R3_SCD_EDIT_09_count').value = 10;
					focusDomId = 'R3_SCD_EDIT_09_count';
				};
				// Sleeping [SLEEPING]
				if (cOpcode === '0a'){
					document.getElementById('R3_SCD_EDIT_0a_count').value = 0;
					focusDomId = 'R3_SCD_EDIT_0a_count';
				};
				// For [FOR]
				if (cOpcode === '0d'){
					document.getElementById('R3_SCD_EDIT_0d_length').value = 2;
					document.getElementById('R3_SCD_EDIT_0d_loop').value = 2;
					R3_SCD_FUNCTION_CHECK_LENGTH_GENERATOR_SPECIAL('0d');
					focusDomId = 'R3_SCD_EDIT_0d_length';
				};
				// Run Script [GO_SUB]
				if (cOpcode === '19'){
					R3_SCD_TEMP_GOSUB_VALUE = 1;
					document.getElementById('R3_SCD_EDIT_19_scriptId').value = 1;
					document.getElementById('R3_SCD_EDIT_19_scriptId').max = parseInt(R3_SCD_TOTAL_SCRITPS - 1);
					focusDomId = 'R3_SCD_EDIT_19_scriptId';
					R3_SCD_FUNCTION_GO_SUB_PREVIEW();
				};
				// Set Timer / Value [SET_TIMER]
				if (cOpcode === '1e'){
					TMS.append('R3_SCD_EDIT_1e_target', INCLUDE_EDIT_SCD_SET_TIMER_TARGET);
					document.getElementById('R3_SCD_EDIT_1e_target').value = '29';
					document.getElementById('R3_SCD_EDIT_1e_hex').innerHTML = '0000';
					document.getElementById('R3_SCD_EDIT_1e_timeHH').value = '0';
					document.getElementById('R3_SCD_EDIT_1e_timeMM').value = '0';
					document.getElementById('R3_SCD_EDIT_1e_timeSS').value = '0';
					document.getElementById('R3_SCD_EDIT_1e_varInt').value = '0';
					R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();
					R3_SCD_FUNCTIONEDIT_UPDATE_SET_TIMER();
					focusDomId = 'R3_SCD_EDIT_1e_target';
				};
				// Execute Calculation [CALC_OP]
				if (cOpcode === '20'){
					TMS.append('R3_SCD_EDIT_20_operation', INCLUDE_EDIT_SCD_CALC_OP_OPERATIONS);
					document.getElementById('R3_SCD_EDIT_20_unk0').value = '00';
					document.getElementById('R3_SCD_EDIT_20_operation').value = '00';
					document.getElementById('R3_SCD_EDIT_20_accmId').value = '00';
					document.getElementById('R3_SCD_EDIT_20_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_20_accmId';
				};
				// [EVT_CUT]
				if (cOpcode === '22'){
					document.getElementById('R3_SCD_EDIT_22_value').value = '00';
					focusDomId = 'R3_SCD_EDIT_22_value';
				};
				// Open Map [MAP_OPEN]
				if (cOpcode === '25'){
					document.getElementById('R3_SCD_EDIT_25_id').value = '00';
					document.getElementById('R3_SCD_EDIT_25_room').value = '100';
					focusDomId = 'R3_SCD_EDIT_25_id';
				};
				// [POINT_ADD]
				if (cOpcode === '26'){
					document.getElementById('R3_SCD_EDIT_26_data0').value = '0000';
					document.getElementById('R3_SCD_EDIT_26_data1').value = '0000';
					focusDomId = 'R3_SCD_EDIT_26_data0';
				};
				// [DIR_CK]
				if (cOpcode === '29'){
					document.getElementById('R3_SCD_EDIT_29_data0').value = '0000';
					document.getElementById('R3_SCD_EDIT_29_data1').value = '0000';
					document.getElementById('R3_SCD_EDIT_29_data2').value = '0000';
					focusDomId = 'R3_SCD_EDIT_29_data0';
				};
				// [PARTS_SET]
				if (cOpcode === '2a'){
					document.getElementById('R3_SCD_EDIT_2a_id').value = '00';
					document.getElementById('R3_SCD_EDIT_2a_type').value = '00';
					document.getElementById('R3_SCD_EDIT_2a_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_2a_id';
				};
				// [VLOOP_SET]
				if (cOpcode === '2b'){
					document.getElementById('R3_SCD_EDIT_2b_value').value = '00';
					focusDomId = 'R3_SCD_EDIT_2b_value';
				};
				// [OTA_BE_SET]
				if (cOpcode === '2c'){
					TMS.append('R3_SCD_EDIT_2c_flag', INCLUDE_EDIT_SCD_FLAGS);
					document.getElementById('R3_SCD_EDIT_2c_data0').value = '00';
					document.getElementById('R3_SCD_EDIT_2c_data1').value = '00';
					document.getElementById('R3_SCD_EDIT_2c_flag').value = '00';
					focusDomId = 'R3_SCD_EDIT_2c_data0';
				};
				// [LINE_START]
				if (cOpcode === '2d'){
					document.getElementById('R3_SCD_EDIT_2d_id').value = '00';
					document.getElementById('R3_SCD_EDIT_2d_value').value = '00';
					focusDomId = 'R3_SCD_EDIT_2d_id';
				};
				// Set LIT Position [LIGHT_POS_SET]
				if (cOpcode === '30'){
					document.getElementById('R3_SCD_EDIT_30_id').value = '00';
					document.getElementById('R3_SCD_EDIT_30_posX').value = '0000';
					document.getElementById('R3_SCD_EDIT_30_posY').value = '0000';
					focusDomId = 'R3_SCD_EDIT_30_id';
				};
				// Set LIT Color [LIGHT_COLOR_SET]
				if (cOpcode === '32'){
					document.getElementById('R3_SCD_EDIT_32_colorR').value = 255;
					document.getElementById('R3_SCD_EDIT_32_colorG').value = 255;
					document.getElementById('R3_SCD_EDIT_32_colorB').value = 255;
					R3_SCD_FUNCTION_UPDATE_RGB('32');
					focusDomId = 'R3_SCD_EDIT_32_colorR';
				};
				// [AHEAD_ROOM_SET]
				if (cOpcode === '33'){
					document.getElementById('R3_SCD_EDIT_33_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_33_value';
				};
				// [BGM_TBL_CK]
				if (cOpcode === '35'){
					document.getElementById('R3_SCD_EDIT_35_data0').value = '00';
					document.getElementById('R3_SCD_EDIT_35_data1').value = '00';
					document.getElementById('R3_SCD_EDIT_35_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_35_data0';
				};
				// [ITEM_GET_CK]
				if (cOpcode === '36'){
					TMS.append('R3_SCD_EDIT_36_itemCode', INCLUDE_EDIT_ITEM);
					document.getElementById('R3_SCD_EDIT_36_itemCode').value = '00';
					document.getElementById('R3_SCD_EDIT_36_quant').value = 1;
					R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_36_itemCode', 'R3_SCD_EDIT_36_itemPreview');
					focusDomId = 'R3_SCD_EDIT_36_itemCode';
				};
				// [OM_REV]
				if (cOpcode === '37'){
					document.getElementById('R3_SCD_EDIT_37_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_37_id';
				}
				// [CHASER_LIFE_INIT]
				if (cOpcode === '38'){
					document.getElementById('R3_SCD_EDIT_38_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_38_id';
				};
				// [CHASER_ITEM_SET]
				if (cOpcode === '3b'){
					document.getElementById('R3_SCD_EDIT_3b_emId').value = '00';
					document.getElementById('R3_SCD_EDIT_3b_objId').value = '00';
					focusDomId = 'R3_SCD_EDIT_3b_emId';
				};
				// [SEL_EVT_ON]
				if (cOpcode === '3d'){
					document.getElementById('R3_SCD_EDIT_3d_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_3d_id';
				};
				// Remove Item [ITEM_LOST]
				if (cOpcode === '3e'){
					TMS.append('R3_SCD_EDIT_3e_item', INCLUDE_EDIT_ITEM);
					document.getElementById('R3_SCD_EDIT_3e_item').value = '00';
					R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_3e_item', 'R3_SCD_EDIT_3e_itemIconPrev');
					focusDomId = 'R3_SCD_EDIT_3e_itemSeek';
				};
				// [FLR_SET]
				if (cOpcode === '3f'){
					TMS.append('R3_SCD_EDIT_3f_flag', INCLUDE_EDIT_SCD_FLAGS);
					document.getElementById('R3_SCD_EDIT_3f_id').value = '00';
					document.getElementById('R3_SCD_EDIT_3f_flag').value = '00';
					focusDomId = 'R3_SCD_EDIT_3f_flag';
				};
				// Set Variable [MEMB_SET]
				if (cOpcode === '40'){
					document.getElementById('R3_SCD_EDIT_40_id').value = '00';
					document.getElementById('R3_SCD_EDIT_40_var').value = '0000';
					focusDomId = 'R3_SCD_EDIT_40_var';
				};
				// [MEMB_SET2]
				if (cOpcode === '41'){
					document.getElementById('R3_SCD_EDIT_41_id').value = '00';
					document.getElementById('R3_SCD_EDIT_41_variable').value = '0000';
					focusDomId = 'R3_SCD_EDIT_41_variable';
				};
				// Set Fade [FADE_SET]
				if (cOpcode === '46'){
					TMS.append('R3_SCD_EDIT_46_type', INCLUDE_EDIT_SCD_FADE_TYPES);
					document.getElementById('R3_SCD_EDIT_46_id').value = '00';
					document.getElementById('R3_SCD_EDIT_46_unk0').value = '00';
					document.getElementById('R3_SCD_EDIT_46_type').value = '00';
					document.getElementById('R3_SCD_EDIT_46_colorR').value = 255;
					document.getElementById('R3_SCD_EDIT_46_colorG').value = 255;
					document.getElementById('R3_SCD_EDIT_46_colorB').value = 255;
					document.getElementById('R3_SCD_EDIT_46_colorC').value = 0;
					document.getElementById('R3_SCD_EDIT_46_colorM').value = 0;
					document.getElementById('R3_SCD_EDIT_46_colorY').value = 0;
					document.getElementById('R3_SCD_EDIT_46_duration').value = 40;
					R3_SCD_FUNCTION_UPDATE_RGB('46');
					R3_SCD_FUNCTION_UPDATE_CMY('46');
					R3_SCD_FUNCTION_UPDATE_RANGE_RGB('46');
					R3_SCD_FUNCTION_UPDATE_RANGE_CMY('46');
					focusDomId = 'R3_SCD_EDIT_46_id';
				};
				// Char Trigger [WORK_SET]
				if (cOpcode === '47'){
					TMS.append('R3_SCD_EDIT_47_target', INCLUDE_EDIT_SCD_WORK_SET_TARGET);
					document.getElementById('R3_SCD_EDIT_47_target').value = '01';
					document.getElementById('R3_SCD_EDIT_47_value').value = '00';
					focusDomId = 'R3_SCD_EDIT_47_target';
				};
				// [SPD_SET]
				if (cOpcode === '48'){
					document.getElementById('R3_SCD_EDIT_48_id').value = '00';
					document.getElementById('R3_SCD_EDIT_48_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_48_value';
				};
				// Check Boolean [CK]
				if (cOpcode === '4c'){
					TMS.append('R3_SCD_EDIT_4c_event', INCLUDE_EDIT_SCD_CK_TYPES);
					TMS.append('R3_SCD_EDIT_4c_flag', INCLUDE_EDIT_SCD_FLAGS + INCLUDE_EDIT_SCD_CK_SPECIAL);
					document.getElementById('R3_SCD_EDIT_4c_event').value = '03';
					document.getElementById('R3_SCD_EDIT_4c_value').value = '00';
					document.getElementById('R3_SCD_EDIT_4c_flag').value = '00';
					focusDomId = 'R3_SCD_EDIT_4c_event';
				}
				// Set Event Value [SET]
				if (cOpcode === '4d'){
					TMS.append('R3_SCD_EDIT_4d_var', INCLUDE_EDIT_SCD_SET_VALUES);
					TMS.append('R3_SCD_EDIT_4d_boolean', INCLUDE_EDIT_SCD_FLAGS);
					document.getElementById('R3_SCD_EDIT_4d_var').value = '1c';
					document.getElementById('R3_SCD_EDIT_4d_boolean').value = '01';
					focusDomId = 'R3_SCD_EDIT_4d_id';
				}
				// Chamge Camera [CUT_CHG]
				if (cOpcode === '50'){
					document.getElementById('R3_SCD_EDIT_50_id').value = '0';
					R3_SCD_FUNCTION_CAM_PREVIEW('R3_SCD_EDIT_50_id', 'R3_SCD_function_50_camPreview');
					focusDomId = 'R3_SCD_EDIT_50_id';
				}
				// Lock Camera [CUT_AUTO]
				if (cOpcode === '52'){
					TMS.append('R3_SCD_EDIT_52_flag', INCLUDE_EDIT_SCD_FLAGS);
					document.getElementById('R3_SCD_EDIT_52_flag').value = '00';
					focusDomId = 'R3_SCD_EDIT_52_flag';
				}
				// Swap Camera [CUT_REPLACE]
				if (cOpcode === '53'){
					document.getElementById('R3_SCD_EDIT_53_prevCamValue').value = 0;
					document.getElementById('R3_SCD_EDIT_53_nextCamValue').value = 0;
					focusDomId = 'R3_SCD_EDIT_53_prevCamValue';
					R3_SCD_FUNCTION_EDIT_updateCutReplace();
				}
				// [CUT_BE_SET]
				if (cOpcode === '54'){
					TMS.append('R3_SCD_EDIT_54_flag', INCLUDE_EDIT_SCD_FLAGS);
					document.getElementById('R3_SCD_EDIT_54_id').value = '00';
					document.getElementById('R3_SCD_EDIT_54_value').value = '00';
					document.getElementById('R3_SCD_EDIT_54_flag').value = '00';
					focusDomId = 'R3_SCD_EDIT_54_flag';
				};
				// Set Target Position [POS_SET]
				if (cOpcode === '55'){
					document.getElementById('R3_SCD_EDIT_55_target').value = '00';
					document.getElementById('R3_SCD_EDIT_55_posX').value = '0000';
					document.getElementById('R3_SCD_EDIT_55_posY').value = '0000';
					document.getElementById('R3_SCD_EDIT_55_posZ').value = '0000';
					focusDomId = 'R3_SCD_EDIT_55_target';
				};
				// [DIR_SET]
				if (cOpcode === '56'){
					document.getElementById('R3_SCD_EDIT_56_target').value = '00';
					document.getElementById('R3_SCD_EDIT_56_posX').value = '0000';
					document.getElementById('R3_SCD_EDIT_56_posY').value = '0000';
					document.getElementById('R3_SCD_EDIT_56_posZ').value = '0000';
					focusDomId = 'R3_SCD_EDIT_56_target';
				};
				// [SET_VIB0]
				if (cOpcode === '57'){
					document.getElementById('R3_SCD_EDIT_57_data0').value = '0000';
					document.getElementById('R3_SCD_EDIT_57_data1').value = '0000';
					focusDomId = 'R3_SCD_EDIT_57_data0';
				};
				// [SET_VIB1]
				if (cOpcode === '58'){
					document.getElementById('R3_SCD_EDIT_58_id').value = '00';
					document.getElementById('R3_SCD_EDIT_58_data0').value = '0000';
					document.getElementById('R3_SCD_EDIT_58_data1').value = '0000';
					focusDomId = 'R3_SCD_EDIT_58_id';
				};
				// RBJ Trigger [RBJ_SET]
				if (cOpcode === '5a'){
					document.getElementById('R3_SCD_EDIT_5a_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_5a_id';
				};
				// Display Message [MESSAGE_ON]
				if (cOpcode === '5b'){
					TMS.append('R3_SCD_EDIT_5b_displayMode', INCLUDE_EDIT_SCD_MSG_DISPLAYMODE);
					document.getElementById('R3_SCD_EDIT_5b_id').value = 0;
					document.getElementById('R3_SCD_EDIT_5b_data0').value = '0000';
					document.getElementById('R3_SCD_EDIT_5b_displayMode').value = '0000';
					focusDomId = 'R3_SCD_EDIT_5b_id';
					R3_SCD_FUNCION_displayMsgPreview();
				};
				// [RAIN_SET]
				if (cOpcode === '5c'){
					document.getElementById('R3_SCD_EDIT_5c_flag').value = '00';
					focusDomId = 'R3_SCD_EDIT_5c_flag';
				};
				// [SHAKE_ON]
				if (cOpcode === '5e'){
					document.getElementById('R3_SCD_EDIT_5e_id').value = '00';
					document.getElementById('R3_SCD_EDIT_5e_value').value = '00';
					focusDomId = 'R3_SCD_EDIT_5e_id';
				};
				// Change Weapon [WEAPON_CHG]
				if (cOpcode === '5f'){
					TMS.append('R3_SCD_EDIT_5f_weaponId', INCLUDE_EDIT_WEAPON);
					document.getElementById('R3_SCD_EDIT_5f_weaponId').value = '01';
					R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_5f_weaponId', 'R3_SCD_EDIT_5f_itemIconPrev');
					focusDomId = 'R3_SCD_EDIT_5f_weaponId';
				};
				// Set Door [DOOR_AOT_SET]
				if (cOpcode === '61'){
					TMS.append('R3_SCD_EDIT_61_displayText', INCLUDE_SCD_DOOR_TEXT);
					TMS.append('R3_SCD_EDIT_61_lockKey', INCLUDE_EDIT_ITEM + INCLUDE_SCD_DOOR_KEYFF);
					document.getElementById('R3_SCD_EDIT_61_id').value = R3_SCD_getFreeIdForFunction();
					document.getElementById('R3_SCD_EDIT_61_aot').value = '01210000';
					document.getElementById('R3_SCD_EDIT_61_stage').value = 1;
					document.getElementById('R3_SCD_EDIT_61_roomNumber').value = '00';
					document.getElementById('R3_SCD_EDIT_61_nextCam').value = 0;
					document.getElementById('R3_SCD_EDIT_61_zIndex').value = '00';
					document.getElementById('R3_SCD_EDIT_61_doorType').value = '00';
					document.getElementById('R3_SCD_EDIT_61_openOrient').value = '00';
					document.getElementById('R3_SCD_EDIT_61_unk0').value = '00';
					document.getElementById('R3_SCD_EDIT_61_lockFlag').value = '00';
					document.getElementById('R3_SCD_EDIT_61_lockKey').value = '00';
					document.getElementById('R3_SCD_EDIT_61_displayText').value = '00';
					R3_SCD_FUNCTIONEDIT_updateCamPreview('61');
					focusDomId = 'R3_SCD_EDIT_61_posX';
				};
				// Set Door 4P [DOOR_AOT_SET_4P]
				if (cOpcode === '62'){
					TMS.append('R3_SCD_EDIT_62_displayText', INCLUDE_SCD_DOOR_TEXT);
					TMS.append('R3_SCD_EDIT_62_lockKey', INCLUDE_EDIT_ITEM + INCLUDE_SCD_DOOR_KEYFF);
					document.getElementById('R3_SCD_EDIT_62_id').value = R3_SCD_getFreeIdForFunction();
					document.getElementById('R3_SCD_EDIT_62_aot').value = '000000';
					document.getElementById('R3_SCD_EDIT_62_4P').value = '0000000000000000';
					document.getElementById('R3_SCD_EDIT_62_stage').value = 1;
					document.getElementById('R3_SCD_EDIT_62_roomNumber').value = '00';
					document.getElementById('R3_SCD_EDIT_62_nextCam').value = 0;
					document.getElementById('R3_SCD_EDIT_62_zIndex').value = '00';
					document.getElementById('R3_SCD_EDIT_62_doorType').value = '00';
					document.getElementById('R3_SCD_EDIT_62_openOrient').value = '00';
					document.getElementById('R3_SCD_EDIT_62_unk0').value = '00';
					document.getElementById('R3_SCD_EDIT_62_lockFlag').value = '00';
					document.getElementById('R3_SCD_EDIT_62_lockKey').value = '00';
					document.getElementById('R3_SCD_EDIT_62_displayText').value = '00';
					R3_SCD_FUNCTIONEDIT_updateCamPreview('62');
					focusDomId = 'R3_SCD_EDIT_62_posX';
				};
				// Set Interactive Object [AOT_SET]
				if (cOpcode === '63'){
					TMS.append('R3_SCD_EDIT_63_aot', INCLUDE_EDIT_AOT_TYPES);
					TMS.append('R3_SCD_EDIT_63_displayMode', INCLUDE_EDIT_SCD_MSG_DISPLAYMODE);
					document.getElementById('R3_SCD_EDIT_63_id').value = R3_SCD_getFreeIdForFunction();
					document.getElementById('R3_SCD_EDIT_63_aot').value = '04';
					document.getElementById('R3_SCD_EDIT_63_type').value = '00';
					document.getElementById('R3_SCD_EDIT_63_nFloor').value = '00';
					document.getElementById('R3_SCD_EDIT_63_super').value = '00';
					document.getElementById('R3_SCD_EDIT_63_posX').value = '0000';
					document.getElementById('R3_SCD_EDIT_63_posY').value = '0000';
					document.getElementById('R3_SCD_EDIT_63_width').value = '0000';
					document.getElementById('R3_SCD_EDIT_63_height').value = '0000';
					document.getElementById('R3_SCD_EDIT_63_data0').value = '00';
					document.getElementById('R3_SCD_EDIT_63_data1').value = '00';
					document.getElementById('R3_SCD_EDIT_63_data2').value = '00';
					document.getElementById('R3_SCD_EDIT_63_data3').value = '00';
					document.getElementById('R3_SCD_EDIT_63_displayMode').value = '0000';
					R3_SCD_FUNCTIONEDIT_updateAotSetLabels();
					focusDomId = 'R3_SCD_EDIT_63_id';
				};
				// [AOT_RESET]
				if (cOpcode === '65'){
					document.getElementById('R3_SCD_EDIT_65_id').value = '00';
					document.getElementById('R3_SCD_EDIT_65_aot').value = '00';
					document.getElementById('R3_SCD_EDIT_65_type').value = '00';
					document.getElementById('R3_SCD_EDIT_65_unk3').value = '00';
					document.getElementById('R3_SCD_EDIT_65_unk0').value = '00';
					document.getElementById('R3_SCD_EDIT_65_num').value = '00';
					document.getElementById('R3_SCD_EDIT_65_unk1').value = '00';
					document.getElementById('R3_SCD_EDIT_65_flag').value = '00';
					document.getElementById('R3_SCD_EDIT_65_unk2').value = '00';
					focusDomId = 'R3_SCD_EDIT_65_id';
				}
				// Run Interactive Object [AOT_ON]
				if (cOpcode === '66'){
					document.getElementById('R3_SCD_EDIT_66_id').value = '00';
					R3_SCD_FUNCTION_updateAotOnPreview();
				};
				// Set Item [ITEM_AOT_SET]
				if (cOpcode === '67'){
					TMS.append('R3_SCD_EDIT_67_attr', INCLUDE_EDIT_ATTR);
					TMS.append('R3_SCD_EDIT_67_blinkColor', INCLUDE_EDIT_SCD_ITEM_AOT_SET_BLINK_COLOR);
					TMS.append('R3_SCD_EDIT_67_item', INCLUDE_EDIT_ITEM + INCLUDE_EDIT_FILE + INCLUDE_EDIT_MAP);
					document.getElementById('R3_SCD_EDIT_67_id').value = R3_SCD_getFreeIdForFunction();
					document.getElementById('R3_SCD_EDIT_67_aot').value = '02310000';
					document.getElementById('R3_SCD_EDIT_67_item').value = '00';
					document.getElementById('R3_SCD_EDIT_67_quant').value = 1;
					document.getElementById('R3_SCD_EDIT_67_iFlag').value = '00';
					document.getElementById('R3_SCD_EDIT_67_modelId').value = '00';
					document.getElementById('R3_SCD_EDIT_67_blinkColor').value = '0';
					document.getElementById('R3_SCD_EDIT_67_playerCrouch').checked = false;
					R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_67_item', 'R3_SCD_EDIT_67_itemIconPrev');
					focusDomId = 'R3_SCD_EDIT_67_itemSeek';
				};
				// Set Item 4P [ITEM_AOT_SET_4P]
				if (cOpcode === '68'){
					TMS.append('R3_SCD_EDIT_68_attr', INCLUDE_EDIT_ATTR);
					TMS.append('R3_SCD_EDIT_68_blinkColor', INCLUDE_EDIT_SCD_ITEM_AOT_SET_BLINK_COLOR);
					TMS.append('R3_SCD_EDIT_68_item', INCLUDE_EDIT_ITEM + INCLUDE_EDIT_FILE + INCLUDE_EDIT_MAP);
					document.getElementById('R3_SCD_EDIT_68_id').value = R3_SCD_getFreeIdForFunction();
					document.getElementById('R3_SCD_EDIT_68_aot').value = '02310000';
					document.getElementById('R3_SCD_EDIT_68_4P').value = '0000000000000000';
					document.getElementById('R3_SCD_EDIT_68_item').value = '00';
					document.getElementById('R3_SCD_EDIT_68_quant').value = 1;
					document.getElementById('R3_SCD_EDIT_68_iFlag').value = '00';
					document.getElementById('R3_SCD_EDIT_68_modelId').value = '00';
					document.getElementById('R3_SCD_EDIT_68_blinkColor').value = '0';
					document.getElementById('R3_SCD_EDIT_68_playerCrouch').checked = false;
					R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_68_item', 'R3_SCD_EDIT_68_itemIconPrev');
					focusDomId = 'R3_SCD_EDIT_68_itemSeek';
				};
				// [SUPER_SET]
				if (cOpcode === '6a'){
					document.getElementById('R3_SCD_EDIT_6a_aot').value = '00';
					document.getElementById('R3_SCD_EDIT_6a_id').value = '00';
					document.getElementById('R3_SCD_EDIT_6a_data0').value = '0000';
					document.getElementById('R3_SCD_EDIT_6a_data1').value = '0000';
					document.getElementById('R3_SCD_EDIT_6a_data2').value = '0000';
					document.getElementById('R3_SCD_EDIT_6a_posX').value = '0000';
					document.getElementById('R3_SCD_EDIT_6a_posY').value = '0000';
					document.getElementById('R3_SCD_EDIT_6a_posZ').value = '0000';
					focusDomId = 'R3_SCD_EDIT_6a_aot';
				};
				// Check Item [KEEP_ITEM_CK]
				if (cOpcode === '6b'){
					TMS.append('R3_SCD_EDIT_6b_item', INCLUDE_EDIT_ITEM);
					document.getElementById('R3_SCD_EDIT_6b_item').value = '00';
					R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_6b_item', 'R3_SCD_EDIT_6b_itemIconPrev');
					focusDomId = 'R3_SCD_EDIT_6b_itemSeek';
				};
				// [KEY_CK]
				if (cOpcode === '6c'){
					TMS.append('R3_SCD_EDIT_6c_flag', INCLUDE_EDIT_SCD_FLAGS);
					document.getElementById('R3_SCD_EDIT_6c_flag').value = '00';
					document.getElementById('R3_SCD_EDIT_6c_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_6c_flag';
				};
				// [TRG_CK]
				if (cOpcode === '6d'){
					document.getElementById('R3_SCD_EDIT_6d_flag').value = '00';
					document.getElementById('R3_SCD_EDIT_6d_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_6d_flag';
				};
				// [SCA_ID_SET]
				if (cOpcode === '6e'){
					document.getElementById('R3_SCD_EDIT_6e_id').value = '00';
					document.getElementById('R3_SCD_EDIT_6e_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_6e_id';
				};
				// [OM_BOMB]
				if (cOpcode === '6f'){
					document.getElementById('R3_SCD_EDIT_6f_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_6f_id';
				};
				// [ESPR_KILL2]
				if (cOpcode === '75'){
					document.getElementById('R3_SCD_EDIT_75_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_75_id';
				};
				// [ESPR_KILL_ALL]
				if (cOpcode === '76'){
					document.getElementById('R3_SCD_EDIT_76_id').value = '00';
					document.getElementById('R3_SCD_EDIT_76_value').value = '00';
					focusDomId = 'R3_SCD_EDIT_76_id';
				};
				// Play SE [SE_ON]
				if (cOpcode === '77'){
					document.getElementById('R3_SCD_EDIT_77_id').value = '00';
					document.getElementById('R3_SCD_EDIT_77_type').value = '00';
					document.getElementById('R3_SCD_EDIT_77_data1').value = '00';
					document.getElementById('R3_SCD_EDIT_77_work').value = '00';
					document.getElementById('R3_SCD_EDIT_77_data3').value = '00';
					document.getElementById('R3_SCD_EDIT_77_posX').value = '0000';
					document.getElementById('R3_SCD_EDIT_77_posY').value = '0000';
					document.getElementById('R3_SCD_EDIT_77_posZ').value = '0000';
					focusDomId = 'R3_SCD_EDIT_77_id';
				};
				// [BGM_CTL]
				if (cOpcode === '78'){
					document.getElementById('R3_SCD_EDIT_78_id').value = '00';
					document.getElementById('R3_SCD_EDIT_78_op').value = '00';
					document.getElementById('R3_SCD_EDIT_78_type').value = '00';
					document.getElementById('R3_SCD_EDIT_78_value').value = '00';
					document.getElementById('R3_SCD_EDIT_78_volume').value = 127;
					R3_DESIGN_UPDATE_RANGES('R3_SCD_EDIT_78_volume', 'R3_SCD_EDIT_78_lblVolume', true, 255);
					focusDomId = 'R3_SCD_EDIT_78_id';
				};
				// [XA_ON]
				if (cOpcode === '79'){
					document.getElementById('R3_SCD_EDIT_79_id').value = '00';
					document.getElementById('R3_SCD_EDIT_79_data').value = '0000';
					focusDomId = 'R3_SCD_EDIT_79_id';
				};
				// Call Cinematic [MOVIE_ON]
				if (cOpcode === '7a'){
					document.getElementById('R3_SCD_EDIT_7a_movieId').value = '01';
					focusDomId = 'R3_SCD_EDIT_7a_movieId';
				};
				// [BGM_TBL_SET]
				if (cOpcode === '7b'){
					document.getElementById('R3_SCD_EDIT_7b_id0').value = '00';
					document.getElementById('R3_SCD_EDIT_7b_id1').value = '00';
					document.getElementById('R3_SCD_EDIT_7b_type').value = '0000';
					focusDomId = 'R3_SCD_EDIT_7b_id0';
				};
				// Set Enemy / NPC [EM_SET]
				if (cOpcode === '7d'){
					TMS.append('R3_SCD_EDIT_7d_type', INCLUDE_EDIT_SCD_EM_SET_TYPES);
					TMS.append('R3_SCD_EDIT_7d_pose', INCLUDE_EDIT_SCD_EM_SET_POSE);
					focusDomId = 'R3_SCD_EDIT_7d_type';
				};
				// [MIZU_DIV]
				if (cOpcode === '7e'){
					document.getElementById('R3_SCD_EDIT_7e_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_7e_id';
				};
				// Set 3D Object [OM_SET]
				if (cOpcode === '7f'){
					TMS.append('R3_SCD_EDIT_7f_AOT', INCLUDE_EDIT_SCD_OM_SET_TYPE);
					TMS.append('R3_SCD_EDIT_7f_colType', INCLUDE_EDIT_SCD_OM_SET_COL_TYPE);
					document.getElementById('R3_SCD_EDIT_7f_id').value = R3_SCD_getFreeIdForFunction(1);
					document.getElementById('R3_SCD_EDIT_7f_setColission').value = '60';
					document.getElementById('R3_SCD_EDIT_7f_beFlag').value = 'ff';
				};
				// Motion Trigger [PLC_MOTION]
				if (cOpcode === '80'){
					document.getElementById('R3_SCD_EDIT_80_id').value = '00';
					document.getElementById('R3_SCD_EDIT_80_value').value = '00';
					document.getElementById('R3_SCD_EDIT_80_type').value = '00';
					focusDomId = 'R3_SCD_EDIT_80_id';
				};
				// Set Animation DEST [PLC_DEST]
				if (cOpcode === '81'){
					TMS.append('R3_SCD_EDIT_81_animation', INCLUDE_EDIT_SCD_PLC_DEST_ANIMATIONS);
					document.getElementById('R3_SCD_EDIT_81_animation').value = '04';
					document.getElementById('R3_SCD_EDIT_81_animModifier').value = '20';
					document.getElementById('R3_SCD_EDIT_81_dataA').value = '0000';
					document.getElementById('R3_SCD_EDIT_81_dataB').value = '0000';
					focusDomId = 'R3_SCD_EDIT_81_animation';
					R3_SCD_EDIT_FUNCTION_PLC_DEST();
				};
				// Set Head Animation [PLC_NECK]
				if (cOpcode === '82'){
					TMS.append('R3_SCD_EDIT_82_type', INCLUDE_EDIT_SCD_PLC_NECK_ANIMATIONS);
					document.getElementById('R3_SCD_EDIT_82_type').value = '02';
					document.getElementById('R3_SCD_EDIT_82_repeat').value = 0;
					document.getElementById('R3_SCD_EDIT_82_speed').value = 10;
					R3_SCD_EDIT_FUNCTION_PLC_NECK_updateLabels();
					focusDomId = 'R3_SCD_EDIT_82_type';
				};
				// [PLC_FLG]
				if (cOpcode === '84'){
					document.getElementById('R3_SCD_EDIT_84_id').value = '00';
					document.getElementById('R3_SCD_EDIT_84_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_84_id';
				};
				// [PLC_GUN]
				if (cOpcode === '85'){
					document.getElementById('R3_SCD_EDIT_85_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_85_id';
				};
				// [PLC_ROT]
				if (cOpcode === '88'){
					document.getElementById('R3_SCD_EDIT_88_id').value = '00';
					document.getElementById('R3_SCD_EDIT_88_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_88_id';
				};
				// [PLC_CNT]
				if (cOpcode === '89'){
					document.getElementById('R3_SCD_EDIT_89_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_89_id';
				};
				// [PLC_MOT_NUM]
				if (cOpcode === '8e'){
					document.getElementById('R3_SCD_EDIT_8e_id').value = '00';
					document.getElementById('R3_SCD_EDIT_8e_value').value = '0000';
					focusDomId = 'R3_SCD_EDIT_8e_id';
				};
				// Reset Enemy Animation [EM_RESET]
				if (cOpcode === '8f'){
					document.getElementById('R3_SCD_EDIT_8f_id').value = '00';
					focusDomId = 'R3_SCD_EDIT_8f_id';
				};
				/*
					End
				*/
				TMS.css('R3_SCD_BTN_APPLY', {'display': 'inline'});
				document.getElementById('R3_SCD_editFunction_pos').disabled = '';
				document.getElementById('R3_SCD_BTN_APPLY').onclick = function(){
					R3_SCD_FUNCTION_APPLY(false, undefined, false);
				};
				R3_SCD_openFunctionEdit(cOpcode, true);
				// Auto-focus
				if (focusDomId !== '' && R3_KEYPRESS_ALT !== true){
					setTimeout(function(){
						document.getElementById(focusDomId).focus();
					}, 60);
				};
			} else {
				document.getElementById('R3_SCD_EDITFUNCTION_HOLDER').innerHTML = INCLUDE_SCD_EDIT_WIP;
				document.getElementById('R3_SCD_editFunction_pos').disabled = 'disabled';
				TMS.css('R3_SCD_BTN_APPLY', {'display': 'none'});
				R3_SCD_openFunctionEdit(cOpcode, true);
			};
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to find SCD Opcode ' + cOpcode.toUpperCase() + '!');	
		};
	} else {
		if (R3_SCD_IS_EDITING === false && SCD_arquivoBruto === undefined){
			R3_SCD_NEW_FILE();
		};
	};
};
// Edit Functions
function R3_SCD_FUNCTION_EDIT(functionId){
	if (functionId !== undefined){
		var ask, focusDomId = '', errorReason = '', canEdit = true, fnId = parseInt(functionId), cFunction = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][fnId], cOpcode = cFunction.slice(0, 2), R3_SCD_DEC_DB = R3_SCD_DECOMPILER_DATABASE[cOpcode], opcodeForm = INCLUDE_SCD_EDIT_FUNCTIONS[cOpcode];
		R3_SCD_HIGHLIGHT_FUNCTION = functionId;
		if (opcodeForm === 'NO_EDIT'){
			canEdit = false;
			errorReason = 'This function can\'t be modified since it does not have any proprieties!';
		};
		if (R3_SCD_DATABASE[cOpcode] === undefined){
			canEdit = false;
			errorReason = 'Unable to find SCD Opcode ' + cOpcode + '!';
		};
		TMS.css('R3_SCD_editForm_bg_image', {'display': 'none'});
		if (opcodeForm !== '' && canEdit === true){
			document.getElementById('R3_SCD_editFunction_pos').max = parseInt(R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length + 1);
			document.getElementById('R3_SCD_EDITFUNCTION_HOLDER').innerHTML = opcodeForm;
			document.getElementById('R3_SCD_editFunction_pos').disabled = 'disabled';
			document.getElementById('R3_SCD_editFunction_pos').value = (fnId + 1);
			TMS.css('R3_SCD_BTN_APPLY', {'display': 'inline'});
			R3_SCD_CURRENT_FUNCTION = fnId;
			R3_SCD_currentOpcode = cOpcode;
			// Force it to render the new form
			if (R3_SCD_previousOpcode[(R3_SCD_previousOpcode.length - 1)] !== R3_SCD_currentOpcode){
				R3_DESIGN_MINIWINDOW_CLOSE(14);
			};
			R3_SCD_previousOpcode.push(R3_SCD_currentOpcode);
			R3_SCD_IS_EDITING = true;
			/*
				Extract functions
			*/
			// Execute Event [EVT_EXEC]
			if (cOpcode === '04'){
				var EVT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_04_id').value = EVT_id;
				focusDomId = 'R3_SCD_EDIT_04_id';
			};
			// Event Kill [EVT_KILL]
			if (cOpcode === '05'){
				var EVT_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]);
				document.getElementById('R3_SCD_EDIT_05_id').value = EVT_target;
				focusDomId = 'R3_SCD_EDIT_05_id';
			};
			// Else [ELSE]
			if (cOpcode === '07'){
				var ELSE_length = cFunction.slice(R3_SCD_DEC_DB.length[0], R3_SCD_DEC_DB.length[1]),
					ELSE_counts = R3_SCD_FUNCTION_READ_CHECK_LENGTH(ELSE_length, fnId, '07');
				document.getElementById('R3_SCD_EDIT_07_length').value = ELSE_counts;
				R3_SCD_FUNCTION_CHECK_LENGTH_GENERATOR('07');
				focusDomId = 'R3_SCD_EDIT_07_length';
			};
			// Sleep [SLEEP]
			if (cOpcode === '09'){
				var SLEEP_sleeping = cFunction.slice(R3_SCD_DEC_DB.sleeping[0], R3_SCD_DEC_DB.sleeping[1]),
					SLEEP_count    = cFunction.slice(R3_SCD_DEC_DB.count[0], R3_SCD_DEC_DB.count[1]);
				document.getElementById('R3_SCD_EDIT_09_sleeping').value = SLEEP_sleeping;
				document.getElementById('R3_SCD_EDIT_09_count').value = parseInt(R3_parseEndian(SLEEP_count), 16);
				focusDomId = 'R3_SCD_EDIT_09_count';
			};
			// Sleeping [SLEEPING]
			if (cOpcode === '0a'){
				var SLEEPING_count = cFunction.slice(R3_SCD_DEC_DB.count[0], R3_SCD_DEC_DB.count[1]);
				document.getElementById('R3_SCD_EDIT_0a_count').value = parseInt(R3_parseEndian(SLEEPING_count), 16);
				focusDomId = 'R3_SCD_EDIT_0a_count';
			};
			// For [FOR]
			if (cOpcode === '0d'){
				var FOR_length 		= cFunction.slice(R3_SCD_DEC_DB.length[0], R3_SCD_DEC_DB.length[1]),
					FOR_counts 		= R3_SCD_FUNCTION_READ_CHECK_LENGTH_SPECIAL(FOR_length, fnId, '0d'),
					FOR_loopCount   = cFunction.slice(R3_SCD_DEC_DB.loopCount[0], R3_SCD_DEC_DB.loopCount[1]),
					FOR_loopConvert = parseInt(R3_parseEndian(FOR_loopCount), 16);
				document.getElementById('R3_SCD_EDIT_0d_length').value = FOR_counts;
				document.getElementById('R3_SCD_EDIT_0d_loop').value = FOR_loopConvert;
				R3_SCD_FUNCTION_CHECK_LENGTH_GENERATOR_SPECIAL('0d');
				focusDomId = 'R3_SCD_EDIT_0d_length';
			};
			// Run Script [GO_SUB]
			if (cOpcode === '19'){
				var SUB_Id = cFunction.slice(R3_SCD_DEC_DB.scriptId[0], R3_SCD_DEC_DB.scriptId[1]);
				document.getElementById('R3_SCD_EDIT_19_scriptId').value = parseInt(SUB_Id, 16);
				document.getElementById('R3_SCD_EDIT_19_scriptId').max = parseInt(R3_SCD_TOTAL_SCRITPS - 1);
				R3_SCD_TEMP_GOSUB_VALUE = parseInt(SUB_Id, 16);
				R3_SCD_FUNCTION_GO_SUB_PREVIEW();
				focusDomId = 'R3_SCD_EDIT_19_scriptId';
			};
			// Set Timer / Value [SET_TIMER]
			if (cOpcode === '1e'){
				TMS.append('R3_SCD_EDIT_1e_target', INCLUDE_EDIT_SCD_SET_TIMER_TARGET);
				var SET_target 	  = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
					SET_timeHex	  = cFunction.slice(R3_SCD_DEC_DB.time[0],   R3_SCD_DEC_DB.time[1]);
					SET_timeArray = R3_TIME_parseHexTime(SET_timeHex, 1),
					SET_timeInt   = R3_TIME_parseHexTime(SET_timeHex, 4);
				document.getElementById('R3_SCD_EDIT_1e_target').value = SET_target;
				document.getElementById('R3_SCD_EDIT_1e_timeHH').value = SET_timeArray[0];
				document.getElementById('R3_SCD_EDIT_1e_timeMM').value = SET_timeArray[1];
				document.getElementById('R3_SCD_EDIT_1e_timeSS').value = SET_timeArray[2];
				document.getElementById('R3_SCD_EDIT_1e_hex').innerHTML = SET_timeHex.toUpperCase();
				document.getElementById('R3_SCD_EDIT_1e_varInt').value = SET_timeInt;
				R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();
				R3_SCD_FUNCTIONEDIT_UPDATE_SET_TIMER();
				if (SET_target === '29'){
					focusDomId = 'R3_SCD_EDIT_1e_target';
				} else {
					focusDomId = 'R3_SCD_EDIT_1e_varInt';
				};
			};
			// Execute Calculation [CALC_OP]
			if (cOpcode === '20'){
				TMS.append('R3_SCD_EDIT_20_operation', INCLUDE_EDIT_SCD_CALC_OP_OPERATIONS);
				var CALC_unk0 	   = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					CALC_operation = cFunction.slice(R3_SCD_DEC_DB.operation[0], R3_SCD_DEC_DB.operation[1]),
					CALC_accmId    = cFunction.slice(R3_SCD_DEC_DB.accumulatorId[0], R3_SCD_DEC_DB.accumulatorId[1]),
					CALC_value 	   = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_20_unk0').value = CALC_unk0;
				document.getElementById('R3_SCD_EDIT_20_operation').value = CALC_operation;
				document.getElementById('R3_SCD_EDIT_20_accmId').value = CALC_accmId;
				document.getElementById('R3_SCD_EDIT_20_value').value = CALC_value;
				focusDomId = 'R3_SCD_EDIT_20_accmId';
			};
			// [EVT_CUT]
			if (cOpcode === '22'){
				var EVT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_22_value').value = EVT_value;
				focusDomId = 'R3_SCD_EDIT_22_value';
			};
			// Open Map [MAP_OPEN]
			if (cOpcode === '25'){
				var MAP_Id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					MAP_room = cFunction.slice(R3_SCD_DEC_DB.room[0], R3_SCD_DEC_DB.room[1]);
				document.getElementById('R3_SCD_EDIT_25_id').value = MAP_Id;
				document.getElementById('R3_SCD_EDIT_25_room').value = MAP_room.slice(1, MAP_room.length);
				focusDomId = 'R3_SCD_EDIT_25_id';
			};
			// [POINT_ADD]
			if (cOpcode === '26'){
				var POINT_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					POINT_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
				document.getElementById('R3_SCD_EDIT_26_data0').value = POINT_data0;
				document.getElementById('R3_SCD_EDIT_26_data1').value = POINT_data1;
				focusDomId = 'R3_SCD_EDIT_26_data0';
			};
			// [DIR_CK]
			if (cOpcode === '29'){
				var	DIR_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					DIR_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
					DIR_data2 = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]);
				document.getElementById('R3_SCD_EDIT_29_data0').value = DIR_data0;
				document.getElementById('R3_SCD_EDIT_29_data1').value = DIR_data1;
				document.getElementById('R3_SCD_EDIT_29_data2').value = DIR_data2;
				focusDomId = 'R3_SCD_EDIT_29_data0';
			};
			// [PARTS_SET]
			if (cOpcode === '2a'){
				var PARTS_id	= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					PARTS_type  = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
					PARTS_value	= cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_2a_id').value = PARTS_id;
				document.getElementById('R3_SCD_EDIT_2a_type').value = PARTS_type;
				document.getElementById('R3_SCD_EDIT_2a_value').value = PARTS_value;
				focusDomId = 'R3_SCD_EDIT_2a_id';
			}
			// [VLOOP_SET]
			if (cOpcode === '2b'){
				var VLOOP_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_2b_value').value = VLOOP_value;
				focusDomId = 'R3_SCD_EDIT_2b_value';
			};
			// [OTA_BE_SET]
			if (cOpcode === '2c'){
				TMS.append('R3_SCD_EDIT_2c_flag', INCLUDE_EDIT_SCD_FLAGS);
				var OTA_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					OTA_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
					OTA_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
				document.getElementById('R3_SCD_EDIT_2c_data0').value = OTA_data0;
				document.getElementById('R3_SCD_EDIT_2c_data1').value = OTA_data1;
				document.getElementById('R3_SCD_EDIT_2c_flag').value = OTA_flag;
				focusDomId = 'R3_SCD_EDIT_2c_data0';
			};
			// [LINE_START]
			if (cOpcode === '2d'){
				var LINE_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					LINE_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_2d_id').value = LINE_id;
				document.getElementById('R3_SCD_EDIT_2d_value').value = LINE_value;
				focusDomId = 'R3_SCD_EDIT_2d_id';
			};
			// Set LIT Position [LIGHT_POS_SET]
			if (cOpcode === '30'){
				var LIGHT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					LIGHT_X  = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					LIGHT_Y  = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]);
				document.getElementById('R3_SCD_EDIT_30_id').value = LIGHT_id;
				document.getElementById('R3_SCD_EDIT_30_posX').value = LIGHT_X;
				document.getElementById('R3_SCD_EDIT_30_posY').value = LIGHT_Y;
				focusDomId = 'R3_SCD_EDIT_30_id';
			};
			// Set LIT Color [LIGHT_COLOR_SET]
			if (cOpcode === '32'){
				var LIGHT_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					LIGHT_unk0 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					LIGHT_R    = cFunction.slice(R3_SCD_DEC_DB.colorR[0], R3_SCD_DEC_DB.colorR[1]),
					LIGHT_G    = cFunction.slice(R3_SCD_DEC_DB.colorG[0], R3_SCD_DEC_DB.colorG[1]),
					LIGHT_B    = cFunction.slice(R3_SCD_DEC_DB.colorB[0], R3_SCD_DEC_DB.colorB[1]);
				document.getElementById('R3_SCD_EDIT_32_lightId').value = LIGHT_id;
				document.getElementById('R3_SCD_EDIT_32_unk0').value = LIGHT_unk0;
				document.getElementById('R3_SCD_EDIT_32_colorR').value = parseInt(LIGHT_R, 16);
				document.getElementById('R3_SCD_EDIT_32_colorG').value = parseInt(LIGHT_G, 16);
				document.getElementById('R3_SCD_EDIT_32_colorB').value = parseInt(LIGHT_B, 16);
				R3_SCD_FUNCTION_UPDATE_RGB('32');
				focusDomId = 'R3_SCD_EDIT_32_lightId';
			};
			// [AHEAD_ROOM_SET]
			if (cOpcode === '33'){
				var AHEAD_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_33_value').value = AHEAD_value; 
			};
			// [BGM_TBL_CK]
			if (cOpcode === '35'){
				var BGM_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					BGM_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
					BGM_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_35_data0').value = BGM_data0;
				document.getElementById('R3_SCD_EDIT_35_data1').value = BGM_data1;
				document.getElementById('R3_SCD_EDIT_35_value').value = BGM_value;
				focusDomId = 'R3_SCD_EDIT_35_data0';
			};
			// [ITEM_GET_CK]
			if (cOpcode === '36'){
				TMS.append('R3_SCD_EDIT_36_itemCode', INCLUDE_EDIT_ITEM);
				var ITEM_code  = cFunction.slice(R3_SCD_DEC_DB.itemId[0], R3_SCD_DEC_DB.itemId[1]),
					ITEM_quant = cFunction.slice(R3_SCD_DEC_DB.quant[0], R3_SCD_DEC_DB.quant[1]);
				document.getElementById('R3_SCD_EDIT_36_itemCode').value = ITEM_code;
				document.getElementById('R3_SCD_EDIT_36_quant').value = parseInt(ITEM_quant, 16);
				R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_36_itemCode', 'R3_SCD_EDIT_36_itemPreview');
				focusDomId = 'R3_SCD_EDIT_36_itemCode';
			};
			// [OM_REV]
			if (cOpcode === '37'){
				var OM_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_37_id').value = OM_id;
				focusDomId = 'R3_SCD_EDIT_37_id';
			};
			// [CHASER_LIFE_INIT]
			if (cOpcode === '38'){
				var CHASER_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_38_id').value = CHASER_id;
				focusDomId = 'R3_SCD_EDIT_38_id';
			};
			// [CHASER_ITEM_SET]
			if (cOpcode === '3b'){
				var CHASER_emId  = cFunction.slice(R3_SCD_DEC_DB.emId[0], R3_SCD_DEC_DB.emId[1]),
					CHASER_objId = cFunction.slice(R3_SCD_DEC_DB.objId[0], R3_SCD_DEC_DB.objId[1]);
				document.getElementById('R3_SCD_EDIT_3b_emId').value = CHASER_emId;
				document.getElementById('R3_SCD_EDIT_3b_objId').value = CHASER_objId;
				focusDomId = 'R3_SCD_EDIT_3b_emId';
			};
			// [SEL_EVT_ON]
			if (cOpcode === '3d'){
				var SEL_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_3d_id').value = SEL_id;
				focusDomId = 'R3_SCD_EDIT_3d_id';
			};
			// Remove Item [ITEM_LOST]
			if (cOpcode === '3e'){
				TMS.append('R3_SCD_EDIT_3e_item', INCLUDE_EDIT_ITEM);
				var ITEM_code = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]);
				document.getElementById('R3_SCD_EDIT_3e_item').value = ITEM_code;
				R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_3e_item', 'R3_SCD_EDIT_3e_itemIconPrev');
				focusDomId = 'R3_SCD_EDIT_3e_itemSeek';
			};
			// [FLR_SET]
			if (cOpcode === '3f'){
				TMS.append('R3_SCD_EDIT_3f_flag', INCLUDE_EDIT_SCD_FLAGS);
				var FLR_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					FLR_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
				document.getElementById('R3_SCD_EDIT_3f_id').value = FLR_id;
				document.getElementById('R3_SCD_EDIT_3f_flag').value = FLR_flag;
				focusDomId = 'R3_SCD_EDIT_3f_id';
			};
			// Set Variable [MEMB_SET]
			if (cOpcode === '40'){
				var MEMB_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					MEMB_variable = cFunction.slice(R3_SCD_DEC_DB.variable[0], R3_SCD_DEC_DB.variable[1]);
				document.getElementById('R3_SCD_EDIT_40_id').value = MEMB_id;
				document.getElementById('R3_SCD_EDIT_40_var').value = MEMB_variable;
				focusDomId = 'R3_SCD_EDIT_40_id';
			};
			// [MEMB_SET2]
			if (cOpcode === '41'){
				var	MEMB_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					MEMB_variable = cFunction.slice(R3_SCD_DEC_DB.variable[0], R3_SCD_DEC_DB.variable[1]);
				document.getElementById('R3_SCD_EDIT_41_variable').value = MEMB_variable;
				document.getElementById('R3_SCD_EDIT_41_id').value = MEMB_id;
				focusDomId = 'R3_SCD_EDIT_41_id';
			};
			// Set Fade [FADE_SET]
			if (cOpcode === '46'){
				TMS.append('R3_SCD_EDIT_46_type', INCLUDE_EDIT_SCD_FADE_TYPES);
				var FADE_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					FADE_unk0 	  = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					FADE_type 	  = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
					FADE_colorB   = cFunction.slice(R3_SCD_DEC_DB.colorB[0], R3_SCD_DEC_DB.colorB[1]),
					FADE_colorG   = cFunction.slice(R3_SCD_DEC_DB.colorG[0], R3_SCD_DEC_DB.colorG[1]),
					FADE_colorR   = cFunction.slice(R3_SCD_DEC_DB.colorR[0], R3_SCD_DEC_DB.colorR[1]),
					FADE_colorY   = cFunction.slice(R3_SCD_DEC_DB.colorY[0], R3_SCD_DEC_DB.colorY[1]),
					FADE_colorM   = cFunction.slice(R3_SCD_DEC_DB.colorM[0], R3_SCD_DEC_DB.colorM[1]),
					FADE_colorC   = cFunction.slice(R3_SCD_DEC_DB.colorC[0], R3_SCD_DEC_DB.colorC[1]),
					FADE_duration = cFunction.slice(R3_SCD_DEC_DB.duration[0], R3_SCD_DEC_DB.duration[1]);
				document.getElementById('R3_SCD_EDIT_46_id').value = FADE_id;
				document.getElementById('R3_SCD_EDIT_46_unk0').value = FADE_unk0;
				document.getElementById('R3_SCD_EDIT_46_type').value = FADE_type;
				document.getElementById('R3_SCD_EDIT_46_colorB').value = parseInt(FADE_colorB, 16);
				document.getElementById('R3_SCD_EDIT_46_colorG').value = parseInt(FADE_colorG, 16);
				document.getElementById('R3_SCD_EDIT_46_colorR').value = parseInt(FADE_colorR, 16);
				document.getElementById('R3_SCD_EDIT_46_colorY').value = parseInt(FADE_colorY, 16);
				document.getElementById('R3_SCD_EDIT_46_colorM').value = parseInt(FADE_colorM, 16);
				document.getElementById('R3_SCD_EDIT_46_colorC').value = parseInt(FADE_colorC, 16);
				document.getElementById('R3_SCD_EDIT_46_duration').value = parseInt(FADE_duration, 16);
				R3_SCD_FUNCTION_UPDATE_RGB('46');
				R3_SCD_FUNCTION_UPDATE_CMY('46');
				R3_SCD_FUNCTION_UPDATE_RANGE_RGB('46');
				R3_SCD_FUNCTION_UPDATE_RANGE_CMY('46');
				focusDomId = 'R3_SCD_EDIT_46_duration';
			};
			// Char Trigger [WORK_SET]
			if (cOpcode === '47'){
				TMS.append('R3_SCD_EDIT_47_target', INCLUDE_EDIT_SCD_WORK_SET_TARGET);
				var WORK_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
					WORK_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_47_target').value = WORK_target;
				document.getElementById('R3_SCD_EDIT_47_value').value = WORK_value;
				focusDomId = 'R3_SCD_EDIT_47_target';
			};
			// [SPD_SET]
			if (cOpcode === '48'){
				var SPD_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					SPD_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_48_id').value = SPD_id;
				document.getElementById('R3_SCD_EDIT_48_value').value = SPD_value;
				focusDomId = 'R3_SCD_EDIT_48_id';
			};
			// Check Boolean [CK]
			if (cOpcode === '4c'){
				TMS.append('R3_SCD_EDIT_4c_event', INCLUDE_EDIT_SCD_CK_TYPES);
				TMS.append('R3_SCD_EDIT_4c_flag', INCLUDE_EDIT_SCD_FLAGS + INCLUDE_EDIT_SCD_CK_SPECIAL);
				var CK_event = cFunction.slice(R3_SCD_DEC_DB.event[0], R3_SCD_DEC_DB.event[1]),
					CK_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
					CK_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
				document.getElementById('R3_SCD_EDIT_4c_event').value = CK_event;
				document.getElementById('R3_SCD_EDIT_4c_value').value = CK_value;
				document.getElementById('R3_SCD_EDIT_4c_flag').value = CK_flag;
				focusDomId = 'R3_SCD_EDIT_4c_event';
			};
			// Set Event Value [SET]
			if (cOpcode === '4d'){
				TMS.append('R3_SCD_EDIT_4d_boolean', INCLUDE_EDIT_SCD_FLAGS);
				TMS.append('R3_SCD_EDIT_4d_var', INCLUDE_EDIT_SCD_SET_VALUES);
				var SET_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					SET_var  = cFunction.slice(R3_SCD_DEC_DB.typeVar[0], R3_SCD_DEC_DB.typeVar[1]),
					SET_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
				document.getElementById('R3_SCD_EDIT_4d_id').value = SET_id;
				document.getElementById('R3_SCD_EDIT_4d_var').value = SET_var;
				document.getElementById('R3_SCD_EDIT_4d_boolean').value = SET_flag;
				focusDomId = 'R3_SCD_EDIT_4d_id';
			};
			// Change Camera [CUT_CHG]
			if (cOpcode === '50'){
				var CUT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_50_id').value = parseInt(CUT_id, 16);
				R3_SCD_FUNCTION_CAM_PREVIEW('R3_SCD_EDIT_50_id', 'R3_SCD_function_50_camPreview');
				focusDomId = 'R3_SCD_EDIT_50_id';
			};
			// Lock Camera [CUT_AUTO]
			if (cOpcode === '52'){
				TMS.append('R3_SCD_EDIT_52_flag', INCLUDE_EDIT_SCD_FLAGS);
				var CUT_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
				document.getElementById('R3_SCD_EDIT_52_flag').value = CUT_flag;
				focusDomId = 'R3_SCD_EDIT_52_flag';
			};
			// Swap Camera [CUT_REPLACE]
			if (cOpcode === '53'){
				var CUT_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					CUT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_53_prevCamValue').value = parseInt(CUT_id, 16);
				document.getElementById('R3_SCD_EDIT_53_nextCamValue').value = parseInt(CUT_value, 16);
				focusDomId = 'R3_SCD_EDIT_53_prevCamValue';
				R3_SCD_FUNCTION_EDIT_updateCutReplace();
			};
			// [CUT_BE_SET]
			if (cOpcode === '54'){
				TMS.append('R3_SCD_EDIT_54_flag', INCLUDE_EDIT_SCD_FLAGS);
				var CUT_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					CUT_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
					CUT_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]);
				document.getElementById('R3_SCD_EDIT_54_id').value = CUT_id;
				document.getElementById('R3_SCD_EDIT_54_value').value = CUT_value;
				document.getElementById('R3_SCD_EDIT_54_flag').value = CUT_flag;
				focusDomId = 'R3_SCD_EDIT_54_id';
			};
			// Set Target Position [POS_SET]
			if (cOpcode === '55'){
				var POS_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
					POS_X	   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					POS_Y	   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					POS_Z	   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
				document.getElementById('R3_SCD_EDIT_55_target').value = POS_target;
				document.getElementById('R3_SCD_EDIT_55_posX').value = POS_X;
				document.getElementById('R3_SCD_EDIT_55_posY').value = POS_Y;
				document.getElementById('R3_SCD_EDIT_55_posZ').value = POS_Z;
				focusDomId = 'R3_SCD_EDIT_55_target';
			};
			// [DIR_SET]
			if (cOpcode === '56'){
				var POS_target = cFunction.slice(R3_SCD_DEC_DB.target[0], R3_SCD_DEC_DB.target[1]),
					POS_X	   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					POS_Y	   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					POS_Z	   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
				document.getElementById('R3_SCD_EDIT_56_target').value = POS_target;
				document.getElementById('R3_SCD_EDIT_56_posX').value = POS_X;
				document.getElementById('R3_SCD_EDIT_56_posY').value = POS_Y;
				document.getElementById('R3_SCD_EDIT_56_posZ').value = POS_Z;
				focusDomId = 'R3_SCD_EDIT_56_target';
			};
			// [SET_VIB0]
			if (cOpcode === '57'){
				var SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
				document.getElementById('R3_SCD_EDIT_57_data0').value = SET_data0;
				document.getElementById('R3_SCD_EDIT_57_data1').value = SET_data1;
				focusDomId = 'R3_SCD_EDIT_57_data0';
			};
			// [SET_VIB1]
			if (cOpcode === '58'){
				var SET_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					SET_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					SET_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]);
				document.getElementById('R3_SCD_EDIT_58_id').value = SET_id;
				document.getElementById('R3_SCD_EDIT_58_data0').value = SET_data0;
				document.getElementById('R3_SCD_EDIT_58_data1').value = SET_data1;
				focusDomId = 'R3_SCD_EDIT_58_id';
			};
			// RBJ Trigger [RBJ_SET]
			if (cOpcode === '5a'){
				var RBJ_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_5a_id').value = RBJ_id;
				focusDomId = 'R3_SCD_EDIT_5a_id';
			};
			// Display Message [MESSAGE_ON]
			if (cOpcode === '5b'){
				TMS.append('R3_SCD_EDIT_5b_displayMode', INCLUDE_EDIT_SCD_MSG_DISPLAYMODE);
				var MESSAGE_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					MESSAGE_data0 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					MESSAGE_dMode = cFunction.slice(R3_SCD_DEC_DB.displayMode[0], R3_SCD_DEC_DB.displayMode[1]);
				document.getElementById('R3_SCD_EDIT_5b_id').value = parseInt(MESSAGE_id, 16);
				document.getElementById('R3_SCD_EDIT_5b_data0').value = MESSAGE_data0;
				document.getElementById('R3_SCD_EDIT_5b_displayMode').value = MESSAGE_dMode;
				focusDomId = 'R3_SCD_EDIT_5b_id';
				R3_SCD_FUNCION_displayMsgPreview();
			};
			// [RAIN_SET]
			if (cOpcode === '5c'){
				var RAIN_flag = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_5c_flag').value = RAIN_flag;
				focusDomId = 'R3_SCD_EDIT_5c_flag';
			}
			// [SHAKE_ON]
			if (cOpcode === '5e'){
				var SHAKE_id 	= cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					SHAKE_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_5e_id').value = SHAKE_id;
				document.getElementById('R3_SCD_EDIT_5e_value').value = SHAKE_value;
				focusDomId = 'R3_SCD_EDIT_5e_id';
			};
			// Change Weapon [WEAPON_CHG]
			if (cOpcode === '5f'){
				TMS.append('R3_SCD_EDIT_5f_weaponId', INCLUDE_EDIT_WEAPON);
				var WEAPON_id = cFunction.slice(R3_SCD_DEC_DB.weaponId[0], R3_SCD_DEC_DB.weaponId[1]);
				document.getElementById('R3_SCD_EDIT_5f_weaponId').value = WEAPON_id;
				R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_5f_weaponId', 'R3_SCD_EDIT_5f_itemIconPrev');
				focusDomId = 'R3_SCD_EDIT_5f_weaponId';
			};
			// Set Door [DOOR_AOT_SET]
			if (cOpcode === '61'){
				TMS.append('R3_SCD_EDIT_61_displayText', INCLUDE_SCD_DOOR_TEXT);
				TMS.append('R3_SCD_EDIT_61_lockKey', INCLUDE_EDIT_ITEM + INCLUDE_SCD_DOOR_KEYFF);
				var DOOR_Id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					DOOR_aot    = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					DOOR_XPos   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					DOOR_YPos   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					DOOR_ZPos   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
					DOOR_RPos   = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
					DOOR_nextX  = cFunction.slice(R3_SCD_DEC_DB.nextXpos[0], R3_SCD_DEC_DB.nextXpos[1]),
					DOOR_nextY  = cFunction.slice(R3_SCD_DEC_DB.nextYpos[0], R3_SCD_DEC_DB.nextYpos[1]),
					DOOR_nextZ  = cFunction.slice(R3_SCD_DEC_DB.nextZpos[0], R3_SCD_DEC_DB.nextZpos[1]),
					DOOR_nextR  = cFunction.slice(R3_SCD_DEC_DB.nextRpos[0], R3_SCD_DEC_DB.nextRpos[1]),
					DOOR_nStage = (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1])) + 1),
					DOOR_nRoom  = cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]),
					DOOR_nCam 	= cFunction.slice(R3_SCD_DEC_DB.nextCam[0], R3_SCD_DEC_DB.nextCam[1]),
					DOOR_zIndex = cFunction.slice(R3_SCD_DEC_DB.zIndex[0], R3_SCD_DEC_DB.zIndex[1]),
					DOOR_type 	= cFunction.slice(R3_SCD_DEC_DB.doorType[0], R3_SCD_DEC_DB.doorType[1]),
					DOOR_orient = cFunction.slice(R3_SCD_DEC_DB.openOrient[0], R3_SCD_DEC_DB.openOrient[1]),
					DOOR_unk0 	= cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					DOOR_lkFlag = cFunction.slice(R3_SCD_DEC_DB.lockFlag[0], R3_SCD_DEC_DB.lockFlag[1]),
					DOOR_lkKey  = cFunction.slice(R3_SCD_DEC_DB.lockKey[0], R3_SCD_DEC_DB.lockKey[1]),
					DOOR_dText  = cFunction.slice(R3_SCD_DEC_DB.displayText[0], R3_SCD_DEC_DB.displayText[1]);
				document.getElementById('R3_SCD_EDIT_61_id').value = DOOR_Id;
				document.getElementById('R3_SCD_EDIT_61_aot').value = DOOR_aot;
				document.getElementById('R3_SCD_EDIT_61_posX').value = DOOR_XPos;
				document.getElementById('R3_SCD_EDIT_61_posY').value = DOOR_YPos;
				document.getElementById('R3_SCD_EDIT_61_posZ').value = DOOR_ZPos;
				document.getElementById('R3_SCD_EDIT_61_posR').value = DOOR_RPos;
				document.getElementById('R3_SCD_EDIT_61_nextX').value = DOOR_nextX;
				document.getElementById('R3_SCD_EDIT_61_nextY').value = DOOR_nextY;
				document.getElementById('R3_SCD_EDIT_61_nextZ').value = DOOR_nextZ;
				document.getElementById('R3_SCD_EDIT_61_nextR').value = DOOR_nextR;
				document.getElementById('R3_SCD_EDIT_61_stage').value = DOOR_nStage;
				document.getElementById('R3_SCD_EDIT_61_roomNumber').value = DOOR_nRoom;
				document.getElementById('R3_SCD_EDIT_61_nextCam').value = parseInt(DOOR_nCam, 16);
				document.getElementById('R3_SCD_EDIT_61_zIndex').value = DOOR_zIndex;
				document.getElementById('R3_SCD_EDIT_61_doorType').value = DOOR_type;
				document.getElementById('R3_SCD_EDIT_61_openOrient').value = DOOR_orient;
				document.getElementById('R3_SCD_EDIT_61_unk0').value = DOOR_unk0;
				document.getElementById('R3_SCD_EDIT_61_lockFlag').value = DOOR_lkFlag;
				document.getElementById('R3_SCD_EDIT_61_lockKey').value = DOOR_lkKey;
				document.getElementById('R3_SCD_EDIT_61_displayText').value = DOOR_dText;
				R3_SCD_FUNCTIONEDIT_updateCamPreview('61');
				focusDomId = 'R3_SCD_EDIT_61_posX';
			};
			// Set Door 4P [DOOR_AOT_SET_4P]
			if (cOpcode === '62'){
				TMS.append('R3_SCD_EDIT_62_displayText', INCLUDE_SCD_DOOR_TEXT);
				TMS.append('R3_SCD_EDIT_62_lockKey', INCLUDE_EDIT_ITEM + INCLUDE_SCD_DOOR_KEYFF);
				var DOOR_Id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					DOOR_aot    = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					DOOR_XPos   = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					DOOR_YPos   = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					DOOR_ZPos   = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
					DOOR_RPos   = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
					DOOR_4P     = cFunction.slice(R3_SCD_DEC_DB.val4P[0], R3_SCD_DEC_DB.val4P[1]),
					DOOR_nextX  = cFunction.slice(R3_SCD_DEC_DB.nextXpos[0], R3_SCD_DEC_DB.nextXpos[1]),
					DOOR_nextY  = cFunction.slice(R3_SCD_DEC_DB.nextYpos[0], R3_SCD_DEC_DB.nextYpos[1]),
					DOOR_nextZ  = cFunction.slice(R3_SCD_DEC_DB.nextZpos[0], R3_SCD_DEC_DB.nextZpos[1]),
					DOOR_nextR  = cFunction.slice(R3_SCD_DEC_DB.nextRpos[0], R3_SCD_DEC_DB.nextRpos[1]),
					DOOR_nStage = (parseInt(cFunction.slice(R3_SCD_DEC_DB.nextStage[0], R3_SCD_DEC_DB.nextStage[1])) + 1),
					DOOR_nRoom  = cFunction.slice(R3_SCD_DEC_DB.nextRoom[0], R3_SCD_DEC_DB.nextRoom[1]),
					DOOR_nCam 	= cFunction.slice(R3_SCD_DEC_DB.nextCam[0], R3_SCD_DEC_DB.nextCam[1]),
					DOOR_zIndex = cFunction.slice(R3_SCD_DEC_DB.zIndex[0], R3_SCD_DEC_DB.zIndex[1]),
					DOOR_type 	= cFunction.slice(R3_SCD_DEC_DB.doorType[0], R3_SCD_DEC_DB.doorType[1]),
					DOOR_orient = cFunction.slice(R3_SCD_DEC_DB.openOrient[0], R3_SCD_DEC_DB.openOrient[1]),
					DOOR_unk0 	= cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					DOOR_lkFlag = cFunction.slice(R3_SCD_DEC_DB.lockFlag[0], R3_SCD_DEC_DB.lockFlag[1]),
					DOOR_lkKey  = cFunction.slice(R3_SCD_DEC_DB.lockKey[0], R3_SCD_DEC_DB.lockKey[1]),
					DOOR_dText  = cFunction.slice(R3_SCD_DEC_DB.displayText[0], R3_SCD_DEC_DB.displayText[1]);
				document.getElementById('R3_SCD_EDIT_62_id').value = DOOR_Id;
				document.getElementById('R3_SCD_EDIT_62_aot').value = DOOR_aot;
				document.getElementById('R3_SCD_EDIT_62_posX').value = DOOR_XPos;
				document.getElementById('R3_SCD_EDIT_62_posY').value = DOOR_YPos;
				document.getElementById('R3_SCD_EDIT_62_posZ').value = DOOR_ZPos;
				document.getElementById('R3_SCD_EDIT_62_posR').value = DOOR_RPos;
				document.getElementById('R3_SCD_EDIT_62_4P').value = DOOR_4P;
				document.getElementById('R3_SCD_EDIT_62_nextX').value = DOOR_nextX;
				document.getElementById('R3_SCD_EDIT_62_nextY').value = DOOR_nextY;
				document.getElementById('R3_SCD_EDIT_62_nextZ').value = DOOR_nextZ;
				document.getElementById('R3_SCD_EDIT_62_nextR').value = DOOR_nextR;
				document.getElementById('R3_SCD_EDIT_62_stage').value = DOOR_nStage;
				document.getElementById('R3_SCD_EDIT_62_roomNumber').value = DOOR_nRoom;
				document.getElementById('R3_SCD_EDIT_62_nextCam').value = parseInt(DOOR_nCam, 16);
				document.getElementById('R3_SCD_EDIT_62_zIndex').value = DOOR_zIndex;
				document.getElementById('R3_SCD_EDIT_62_doorType').value = DOOR_type;
				document.getElementById('R3_SCD_EDIT_62_openOrient').value = DOOR_orient;
				document.getElementById('R3_SCD_EDIT_62_unk0').value = DOOR_unk0;
				document.getElementById('R3_SCD_EDIT_62_lockFlag').value = DOOR_lkFlag;
				document.getElementById('R3_SCD_EDIT_62_lockKey').value = DOOR_lkKey;
				document.getElementById('R3_SCD_EDIT_62_displayText').value = DOOR_dText;
				R3_SCD_FUNCTIONEDIT_updateCamPreview('62');
				focusDomId = 'R3_SCD_EDIT_62_id';
			};
			// Set Interactive Object [AOT_SET]
			if (cOpcode === '63'){
				TMS.append('R3_SCD_EDIT_63_aot', INCLUDE_EDIT_AOT_TYPES);
				TMS.append('R3_SCD_EDIT_63_displayMode', INCLUDE_EDIT_SCD_MSG_DISPLAYMODE);
				var AOT_id 		 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					AOT_aot 	 = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					AOT_type 	 = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
					AOT_nFloor 	 = cFunction.slice(R3_SCD_DEC_DB.nFloor[0], R3_SCD_DEC_DB.nFloor[1]),
					AOT_aotSuper = cFunction.slice(R3_SCD_DEC_DB.aotSuper[0], R3_SCD_DEC_DB.aotSuper[1]),
					AOT_X		 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					AOT_Y		 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					AOT_W		 = cFunction.slice(R3_SCD_DEC_DB.posW[0], R3_SCD_DEC_DB.posW[1]),
					AOT_H		 = cFunction.slice(R3_SCD_DEC_DB.posH[0], R3_SCD_DEC_DB.posH[1]),
					AOT_data0 	 = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					AOT_data1 	 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
					AOT_data2 	 = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]),
					AOT_data3 	 = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]),
					AOT_dMode 	 = cFunction.slice(R3_SCD_DEC_DB.displayMode[0], R3_SCD_DEC_DB.displayMode[1]);
				document.getElementById('R3_SCD_EDIT_63_id').value = AOT_id;
				document.getElementById('R3_SCD_EDIT_63_aot').value = AOT_aot;
				document.getElementById('R3_SCD_EDIT_63_type').value = AOT_type;
				document.getElementById('R3_SCD_EDIT_63_nFloor').value = AOT_nFloor;
				document.getElementById('R3_SCD_EDIT_63_super').value = AOT_aotSuper;
				document.getElementById('R3_SCD_EDIT_63_posX').value = AOT_X;
				document.getElementById('R3_SCD_EDIT_63_posY').value = AOT_Y;
				document.getElementById('R3_SCD_EDIT_63_width').value = AOT_W;
				document.getElementById('R3_SCD_EDIT_63_height').value = AOT_H;
				document.getElementById('R3_SCD_EDIT_63_data0').value = AOT_data0;
				document.getElementById('R3_SCD_EDIT_63_data1').value = AOT_data1;
				document.getElementById('R3_SCD_EDIT_63_data2').value = AOT_data2;
				document.getElementById('R3_SCD_EDIT_63_data3').value = AOT_data3;
				document.getElementById('R3_SCD_EDIT_63_displayMode').value = AOT_dMode;
				R3_SCD_FUNCTIONEDIT_updateAotSetLabels();
				focusDomId = 'R3_SCD_EDIT_63_id';
				// console.info(AOT_dMode);
			};
			// [AOT_RESET]
			if (cOpcode === '65'){
				var AOT_aot  = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					AOT_id   = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					AOT_type = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
					AOT_unk3 = cFunction.slice(R3_SCD_DEC_DB.unk3[0], R3_SCD_DEC_DB.unk3[1]),
					AOT_unk0 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					AOT_num  = cFunction.slice(R3_SCD_DEC_DB.num[0], R3_SCD_DEC_DB.num[1]),
					AOT_unk1 = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
					AOT_flag = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
					AOT_unk2 = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]);
				document.getElementById('R3_SCD_EDIT_65_aot').value = AOT_aot;
				document.getElementById('R3_SCD_EDIT_65_id').value = AOT_id;
				document.getElementById('R3_SCD_EDIT_65_type').value = AOT_type;
				document.getElementById('R3_SCD_EDIT_65_unk3').value = AOT_unk3;
				document.getElementById('R3_SCD_EDIT_65_unk0').value = AOT_unk0;
				document.getElementById('R3_SCD_EDIT_65_num').value = AOT_num;
				document.getElementById('R3_SCD_EDIT_65_unk1').value = AOT_unk1;
				document.getElementById('R3_SCD_EDIT_65_flag').value = AOT_flag;
				document.getElementById('R3_SCD_EDIT_65_unk2').value = AOT_unk2;
				focusDomId = 'R3_SCD_EDIT_65_aot';
			};
			// Run Interactive Object [AOT_ON]
			if (cOpcode === '66'){
				var AOT_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_66_id').value = AOT_id;
				R3_SCD_FUNCTION_updateAotOnPreview();
				focusDomId = 'R3_SCD_EDIT_66_id';
			};
			// Set Item [ITEM_AOT_SET]
			if (cOpcode === '67'){
				TMS.append('R3_SCD_EDIT_67_blinkColor', INCLUDE_EDIT_SCD_ITEM_AOT_SET_BLINK_COLOR);
				TMS.append('R3_SCD_EDIT_67_item', INCLUDE_EDIT_ITEM + INCLUDE_EDIT_FILE + INCLUDE_EDIT_MAP);
				var ITEM_Id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					ITEM_aot 	 = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					ITEM_Xpos 	 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					ITEM_Ypos 	 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					ITEM_Zpos 	 = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
					ITEM_Rpos 	 = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
					ITEM_code 	 = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
					ITEM_unk0 	 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					ITEM_quant 	 = cFunction.slice(R3_SCD_DEC_DB.itemQuant[0], R3_SCD_DEC_DB.itemQuant[1]),
					ITEM_unk1 	 = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
					ITEM_unk2 	 = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]),
					ITEM_flag 	 = cFunction.slice(R3_SCD_DEC_DB.itemFlag[0], R3_SCD_DEC_DB.itemFlag[1]),
					ITEM_modelId = cFunction.slice(R3_SCD_DEC_DB.modelId[0], R3_SCD_DEC_DB.modelId[1]),
					ITEM_MP 	 = cFunction.slice(R3_SCD_DEC_DB.itemMP[0], R3_SCD_DEC_DB.itemMP[1]),
					ITEM_bColor  = ITEM_MP.slice(0, 1).toLowerCase(),
					item_uCrouch = ITEM_MP.slice(1, 2).toLowerCase();
				document.getElementById('R3_SCD_EDIT_67_id').value = ITEM_Id;
				document.getElementById('R3_SCD_EDIT_67_aot').value = ITEM_aot;
				document.getElementById('R3_SCD_EDIT_67_posX').value = ITEM_Xpos;
				document.getElementById('R3_SCD_EDIT_67_posY').value = ITEM_Ypos;
				document.getElementById('R3_SCD_EDIT_67_posZ').value = ITEM_Zpos;
				document.getElementById('R3_SCD_EDIT_67_posR').value = ITEM_Rpos;
				document.getElementById('R3_SCD_EDIT_67_item').value = ITEM_code;
				document.getElementById('R3_SCD_EDIT_67_unk0').value = ITEM_unk0;
				document.getElementById('R3_SCD_EDIT_67_quant').value = parseInt(ITEM_quant, 16);
				document.getElementById('R3_SCD_EDIT_67_unk1').value = ITEM_unk1;
				document.getElementById('R3_SCD_EDIT_67_unk2').value = ITEM_unk2;
				document.getElementById('R3_SCD_EDIT_67_iFlag').value = ITEM_flag;
				document.getElementById('R3_SCD_EDIT_67_modelId').value = ITEM_modelId;
				document.getElementById('R3_SCD_EDIT_67_blinkColor').value = ITEM_bColor;
				document.getElementById('R3_SCD_EDIT_67_playerCrouch').checked = R3_JS_COMPILER_parseCrouch(0, item_uCrouch);
				R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_67_item', 'R3_SCD_EDIT_67_itemIconPrev');
				focusDomId = 'R3_SCD_EDIT_67_itemSeek';
			};
			// Set Item 4P [ITEM_AOT_SET_4P]
			if (cOpcode === '68'){
				TMS.append('R3_SCD_EDIT_68_blinkColor', INCLUDE_EDIT_SCD_ITEM_AOT_SET_BLINK_COLOR);
				TMS.append('R3_SCD_EDIT_68_item', INCLUDE_EDIT_ITEM + INCLUDE_EDIT_FILE + INCLUDE_EDIT_MAP);
				var ITEM_Id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					ITEM_aot 	 = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					ITEM_Xpos 	 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					ITEM_Ypos 	 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					ITEM_Zpos 	 = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
					ITEM_Rpos 	 = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
					ITEM_4P 	 = cFunction.slice(R3_SCD_DEC_DB.val4P[0], R3_SCD_DEC_DB.val4P[1]),
					ITEM_code 	 = cFunction.slice(R3_SCD_DEC_DB.itemCode[0], R3_SCD_DEC_DB.itemCode[1]),
					ITEM_unk0 	 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					ITEM_quant 	 = cFunction.slice(R3_SCD_DEC_DB.itemQuant[0], R3_SCD_DEC_DB.itemQuant[1]),
					ITEM_unk1 	 = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
					ITEM_unk2 	 = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]),
					ITEM_flag 	 = cFunction.slice(R3_SCD_DEC_DB.itemFlag[0], R3_SCD_DEC_DB.itemFlag[1]),
					ITEM_modelId = cFunction.slice(R3_SCD_DEC_DB.modelId[0], R3_SCD_DEC_DB.modelId[1]),
					ITEM_MP 	 = cFunction.slice(R3_SCD_DEC_DB.itemMP[0], R3_SCD_DEC_DB.itemMP[1]),
					ITEM_bColor  = ITEM_MP.slice(0, 1).toLowerCase(),
					item_uCrouch = ITEM_MP.slice(1, 2).toLowerCase();
				document.getElementById('R3_SCD_EDIT_68_id').value = ITEM_Id;
				document.getElementById('R3_SCD_EDIT_68_aot').value = ITEM_aot;
				document.getElementById('R3_SCD_EDIT_68_posX').value = ITEM_Xpos;
				document.getElementById('R3_SCD_EDIT_68_posY').value = ITEM_Ypos;
				document.getElementById('R3_SCD_EDIT_68_posZ').value = ITEM_Zpos;
				document.getElementById('R3_SCD_EDIT_68_posR').value = ITEM_Rpos;
				document.getElementById('R3_SCD_EDIT_68_4P').value = ITEM_4P;
				document.getElementById('R3_SCD_EDIT_68_item').value = ITEM_code;
				document.getElementById('R3_SCD_EDIT_68_unk0').value = ITEM_unk0;
				document.getElementById('R3_SCD_EDIT_68_quant').value = parseInt(ITEM_quant, 16);
				document.getElementById('R3_SCD_EDIT_68_unk1').value = ITEM_unk1;
				document.getElementById('R3_SCD_EDIT_68_unk2').value = ITEM_unk2;
				document.getElementById('R3_SCD_EDIT_68_iFlag').value = ITEM_flag;
				document.getElementById('R3_SCD_EDIT_68_modelId').value = ITEM_modelId;
				document.getElementById('R3_SCD_EDIT_68_blinkColor').value = ITEM_bColor;
				document.getElementById('R3_SCD_EDIT_68_playerCrouch').checked = R3_JS_COMPILER_parseCrouch(0, item_uCrouch);
				R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_68_item', 'R3_SCD_EDIT_68_itemIconPrev');
				focusDomId = 'R3_SCD_EDIT_68_itemSeek';
			};
			// [SUPER_SET]
			if (cOpcode === '6a'){
				var SUPER_aot 	 = cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					SUPER_id 	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					SUPER_data0  = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					SUPER_data1  = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
					SUPER_data2  = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]),
					SUPER_X 	 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					SUPER_Y 	 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					SUPER_Z 	 = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]);
				document.getElementById('R3_SCD_EDIT_6a_aot').value = SUPER_aot;
				document.getElementById('R3_SCD_EDIT_6a_id').value = SUPER_id;
				document.getElementById('R3_SCD_EDIT_6a_data0').value = SUPER_data0;
				document.getElementById('R3_SCD_EDIT_6a_data1').value = SUPER_data1;
				document.getElementById('R3_SCD_EDIT_6a_data2').value = SUPER_data2;
				document.getElementById('R3_SCD_EDIT_6a_posX').value = SUPER_X;
				document.getElementById('R3_SCD_EDIT_6a_posY').value = SUPER_Y;
				document.getElementById('R3_SCD_EDIT_6a_posZ').value = SUPER_Z;
				focusDomId = 'R3_SCD_EDIT_6a_aot';
			};
			// Check Item [KEEP_ITEM_CK]
			if (cOpcode === '6b'){
				TMS.append('R3_SCD_EDIT_6b_item', INCLUDE_EDIT_ITEM);
				var ITEM_code = cFunction.slice(R3_SCD_DEC_DB.itemId[0], R3_SCD_DEC_DB.itemId[1]);
				document.getElementById('R3_SCD_EDIT_6b_item').value = ITEM_code;
				R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_6b_item', 'R3_SCD_EDIT_6b_itemIconPrev');
				focusDomId = 'R3_SCD_EDIT_6b_itemSeek';
			};
			// [KEY_CK]
			if (cOpcode === '6c'){
				TMS.append('R3_SCD_EDIT_6c_flag', INCLUDE_EDIT_SCD_FLAGS);
				var KEY_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
					KEY_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_6c_flag').value = KEY_flag;
				document.getElementById('R3_SCD_EDIT_6c_value').value = KEY_value;
				focusDomId = 'R3_SCD_EDIT_6c_flag';
			};
			// [TRG_CK]
			if (cOpcode === '6d'){
				var TRG_flag  = cFunction.slice(R3_SCD_DEC_DB.flag[0], R3_SCD_DEC_DB.flag[1]),
					TRG_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_6d_flag').value = TRG_flag;
				document.getElementById('R3_SCD_EDIT_6d_value').value = TRG_value;
				focusDomId = 'R3_SCD_EDIT_6d_flag';
			};
			// [SCA_ID_SET]
			if (cOpcode === '6e'){
				var SCA_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					SCA_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_6e_id').value = SCA_id;
				document.getElementById('R3_SCD_EDIT_6e_value').value = SCA_value;
				focusDomId = 'R3_SCD_EDIT_6e_id';
			};
			// [OM_BOMB]
			if (cOpcode === '6f'){
				var OM_id = cFunction.slice(R3_SCD_DEC_DB.omId[0], R3_SCD_DEC_DB.omId[1]);
				document.getElementById('R3_SCD_EDIT_6f_id').value = OM_id;
				focusDomId = 'R3_SCD_EDIT_6f_id';
			};
			// [ESPR_KILL2]
			if (cOpcode === '75'){
				var ESPR_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_75_id').value = ESPR_id;
				focusDomId = 'R3_SCD_EDIT_75_id';
			};
			// [ESPR_KILL_ALL]
			if (cOpcode === '76'){
				var ESPR_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					ESPR_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_76_id').value = ESPR_id;
				document.getElementById('R3_SCD_EDIT_76_value').value = ESPR_value;
				focusDomId = 'R3_SCD_EDIT_76_id';
			};
			// Play SE [SE_ON]
			if (cOpcode === '77'){
				var SE_id  	 = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					SE_type  = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
					SE_data1 = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
					SE_work  = cFunction.slice(R3_SCD_DEC_DB.work[0], R3_SCD_DEC_DB.work[1]),
					SE_data3 = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]),
					SE_X 	 = cFunction.slice(R3_SCD_DEC_DB.seX[0], R3_SCD_DEC_DB.seX[1]),
					SE_Y 	 = cFunction.slice(R3_SCD_DEC_DB.seY[0], R3_SCD_DEC_DB.seY[1]),
					SE_Z 	 = cFunction.slice(R3_SCD_DEC_DB.seZ[0], R3_SCD_DEC_DB.seZ[1]);
				document.getElementById('R3_SCD_EDIT_77_id').value = SE_id;
				document.getElementById('R3_SCD_EDIT_77_type').value = SE_type;
				document.getElementById('R3_SCD_EDIT_77_data1').value = SE_data1;
				document.getElementById('R3_SCD_EDIT_77_work').value = SE_work;
				document.getElementById('R3_SCD_EDIT_77_data3').value = SE_data3;
				document.getElementById('R3_SCD_EDIT_77_posX').value = SE_X;
				document.getElementById('R3_SCD_EDIT_77_posY').value = SE_Y;
				document.getElementById('R3_SCD_EDIT_77_posZ').value = SE_Z;
				focusDomId = 'R3_SCD_EDIT_77_id';
			};
			// [BGM_CTL]
			if (cOpcode === '78'){
				var BGM_id     = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					BGM_op 	   = cFunction.slice(R3_SCD_DEC_DB.op[0], R3_SCD_DEC_DB.op[1]),
					BGM_type   = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
					BGM_value  = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
					BGM_volume = parseInt(cFunction.slice(R3_SCD_DEC_DB.volume[0], R3_SCD_DEC_DB.volume[1]), 16);
				document.getElementById('R3_SCD_EDIT_78_id').value = BGM_id;
				document.getElementById('R3_SCD_EDIT_78_op').value = BGM_op;
				document.getElementById('R3_SCD_EDIT_78_type').value = BGM_type;
				document.getElementById('R3_SCD_EDIT_78_value').value = BGM_value;
				document.getElementById('R3_SCD_EDIT_78_volume').value = BGM_volume;
				R3_DESIGN_UPDATE_RANGES('R3_SCD_EDIT_78_volume', 'R3_SCD_EDIT_78_lblVolume', true, 255);
				focusDomId = 'R3_SCD_EDIT_78_id';
			};
			// [XA_ON]
			if (cOpcode === '79'){
				var XA_Id = cFunction.slice(R3_SCD_DEC_DB.xaId[0], R3_SCD_DEC_DB.xaId[1]),
					XA_Data = cFunction.slice(R3_SCD_DEC_DB.xaData[0], R3_SCD_DEC_DB.xaData[1]);
				document.getElementById('R3_SCD_EDIT_79_id').value = XA_Id;
				document.getElementById('R3_SCD_EDIT_79_data').value = XA_Data;
				focusDomId = 'R3_SCD_EDIT_79_id';
			};
			// Call Cinematic [MOVIE_ON]
			if (cOpcode === '7a'){
				var MOVIE_id = cFunction.slice(R3_SCD_DEC_DB.movieId[0], R3_SCD_DEC_DB.movieId[1]);
				document.getElementById('R3_SCD_EDIT_7a_movieId').value = MOVIE_id;
				focusDomId = 'R3_SCD_EDIT_7a_movieId';
			};
			// [BGM_TBL_SET]
			if (cOpcode === '7b'){
				var BGM_id0  = cFunction.slice(R3_SCD_DEC_DB.id0[0], R3_SCD_DEC_DB.id0[1]),
					BGM_id1  = cFunction.slice(R3_SCD_DEC_DB.id1[0], R3_SCD_DEC_DB.id1[1]),
					BGM_type = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]);
				document.getElementById('R3_SCD_EDIT_7b_id0').value = BGM_id0;
				document.getElementById('R3_SCD_EDIT_7b_id1').value = BGM_id1;
				document.getElementById('R3_SCD_EDIT_7b_type').value = BGM_type;
				focusDomId = 'R3_SCD_EDIT_7b_id0';
			};
			// Set Enemy / NPC [EM_SET]
			if (cOpcode === '7d'){
				TMS.append('R3_SCD_EDIT_7d_type', INCLUDE_EDIT_SCD_EM_SET_TYPES);
				TMS.append('R3_SCD_EDIT_7d_pose', INCLUDE_EDIT_SCD_EM_SET_POSE);
				var EM_unk0 	 = cFunction.slice(R3_SCD_DEC_DB.unk0[0], R3_SCD_DEC_DB.unk0[1]),
					EM_enemyId   = cFunction.slice(R3_SCD_DEC_DB.enemyId[0], R3_SCD_DEC_DB.enemyId[1]),
					EM_enemyType = cFunction.slice(R3_SCD_DEC_DB.enemyType[0], R3_SCD_DEC_DB.enemyType[1]),
					EM_enemyPose = cFunction.slice(R3_SCD_DEC_DB.enemyPose[0], R3_SCD_DEC_DB.enemyPose[1]),
					EM_unk1 	 = cFunction.slice(R3_SCD_DEC_DB.unk1[0], R3_SCD_DEC_DB.unk1[1]),
					EM_unk2 	 = cFunction.slice(R3_SCD_DEC_DB.unk2[0], R3_SCD_DEC_DB.unk2[1]),
					EM_soundSet  = cFunction.slice(R3_SCD_DEC_DB.soundSet[0], R3_SCD_DEC_DB.soundSet[1]),
					EM_texture 	 = cFunction.slice(R3_SCD_DEC_DB.texture[0], R3_SCD_DEC_DB.texture[1]),
					EM_flag 	 = cFunction.slice(R3_SCD_DEC_DB.enemyFlag[0], R3_SCD_DEC_DB.enemyFlag[1]),
					EM_X 		 = cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					EM_Y 		 = cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					EM_Z 		 = cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
					EM_R 		 = cFunction.slice(R3_SCD_DEC_DB.posR[0], R3_SCD_DEC_DB.posR[1]),
					EM_motion	 = cFunction.slice(R3_SCD_DEC_DB.motion[0], R3_SCD_DEC_DB.motion[1]),
					EM_ctrlFlag	 = cFunction.slice(R3_SCD_DEC_DB.ctrlFlag[0], R3_SCD_DEC_DB.ctrlFlag[1]);
				document.getElementById('R3_SCD_EDIT_7d_unk0').value = EM_unk0;
				document.getElementById('R3_SCD_EDIT_7d_id').value = EM_enemyId;
				document.getElementById('R3_SCD_EDIT_7d_type').value = EM_enemyType;
				document.getElementById('R3_SCD_EDIT_7d_pose').value = EM_enemyPose;
				document.getElementById('R3_SCD_EDIT_7d_unk1').value = EM_unk1;
				document.getElementById('R3_SCD_EDIT_7d_unk2').value = EM_unk2;
				document.getElementById('R3_SCD_EDIT_7d_soundSet').value = EM_soundSet;
				document.getElementById('R3_SCD_EDIT_7d_texture').value = EM_texture;
				document.getElementById('R3_SCD_EDIT_7d_flag').value = EM_flag;
				document.getElementById('R3_SCD_EDIT_7d_posX').value = EM_X;
				document.getElementById('R3_SCD_EDIT_7d_posY').value = EM_Y;
				document.getElementById('R3_SCD_EDIT_7d_posZ').value = EM_Z;
				document.getElementById('R3_SCD_EDIT_7d_posR').value = EM_R;
				document.getElementById('R3_SCD_EDIT_7d_motion').value = EM_motion;
				document.getElementById('R3_SCD_EDIT_7d_ctrlFlag').value = EM_ctrlFlag;
				focusDomId = 'R3_SCD_EDIT_7d_type';
			};
			// [MIZU_DIV]
			if (cOpcode === '7e'){
				var MIZU_id = cFunction.slice(R3_SCD_DEC_DB.mizuId[0], R3_SCD_DEC_DB.mizuId[1]);
				document.getElementById('R3_SCD_EDIT_7e_id').value = MIZU_id;
			};
			// Set 3D Object [OM_SET] // WIP
			if (cOpcode === '7f'){
				TMS.append('R3_SCD_EDIT_7f_AOT', INCLUDE_EDIT_SCD_OM_SET_TYPE);
				TMS.append('R3_SCD_EDIT_7f_colType', INCLUDE_EDIT_SCD_OM_SET_COL_TYPE);
				var OM_id  		= cFunction.slice(R3_SCD_DEC_DB.objId[0], R3_SCD_DEC_DB.objId[1]),
					OM_AOT 		= cFunction.slice(R3_SCD_DEC_DB.aot[0], R3_SCD_DEC_DB.aot[1]),
					OM_moveType = cFunction.slice(R3_SCD_DEC_DB.moveType[0], R3_SCD_DEC_DB.moveType[1]),
					OM_pattern  = cFunction.slice(R3_SCD_DEC_DB.pattern[0], R3_SCD_DEC_DB.pattern[1]),
					OM_data0 	= cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					OM_speed 	= cFunction.slice(R3_SCD_DEC_DB.speed[0], R3_SCD_DEC_DB.speed[1]),
					OM_zIndex 	= cFunction.slice(R3_SCD_DEC_DB.zIndex[0], R3_SCD_DEC_DB.zIndex[1]),
					OM_superId  = cFunction.slice(R3_SCD_DEC_DB.superId[0], R3_SCD_DEC_DB.superId[1]),
					OM_setFlag  = cFunction.slice(R3_SCD_DEC_DB.setFlag[0], R3_SCD_DEC_DB.setFlag[1]),
					OM_beFlag   = cFunction.slice(R3_SCD_DEC_DB.beFlag[0], R3_SCD_DEC_DB.beFlag[1]),
					OM_boolType = cFunction.slice(R3_SCD_DEC_DB.boolType[0], R3_SCD_DEC_DB.boolType[1]),
					OM_setCol   = cFunction.slice(R3_SCD_DEC_DB.setCol[0], R3_SCD_DEC_DB.setCol[1]),
					OM_visib    = cFunction.slice(R3_SCD_DEC_DB.visib[0], R3_SCD_DEC_DB.visib[1]),
					OM_colType  = cFunction.slice(R3_SCD_DEC_DB.colType[0], R3_SCD_DEC_DB.colType[1]),
					OM_posX 	= cFunction.slice(R3_SCD_DEC_DB.posX[0], R3_SCD_DEC_DB.posX[1]),
					OM_posY 	= cFunction.slice(R3_SCD_DEC_DB.posY[0], R3_SCD_DEC_DB.posY[1]),
					OM_posZ 	= cFunction.slice(R3_SCD_DEC_DB.posZ[0], R3_SCD_DEC_DB.posZ[1]),
					OM_dirX 	= cFunction.slice(R3_SCD_DEC_DB.dirX[0], R3_SCD_DEC_DB.dirX[1]),
					OM_dirY 	= cFunction.slice(R3_SCD_DEC_DB.dirY[0], R3_SCD_DEC_DB.dirY[1]),
					OM_dirZ 	= cFunction.slice(R3_SCD_DEC_DB.dirZ[0], R3_SCD_DEC_DB.dirZ[1]),
					OM_colPosX 	= cFunction.slice(R3_SCD_DEC_DB.colPosX[0], R3_SCD_DEC_DB.colPosX[1]),
					OM_colPosY 	= cFunction.slice(R3_SCD_DEC_DB.colPosY[0], R3_SCD_DEC_DB.colPosY[1]),
					OM_colPosZ 	= cFunction.slice(R3_SCD_DEC_DB.colPosZ[0], R3_SCD_DEC_DB.colPosZ[1]),
					OM_colDirX 	= cFunction.slice(R3_SCD_DEC_DB.colDirX[0], R3_SCD_DEC_DB.colDirX[1]),
					OM_colDirY 	= cFunction.slice(R3_SCD_DEC_DB.colDirY[0], R3_SCD_DEC_DB.colDirY[1]),
					OM_colDirZ 	= cFunction.slice(R3_SCD_DEC_DB.colDirZ[0], R3_SCD_DEC_DB.colDirZ[1]);
				document.getElementById('R3_SCD_EDIT_7f_id').value = OM_id;
				document.getElementById('R3_SCD_EDIT_7f_AOT').value = OM_AOT;
				document.getElementById('R3_SCD_EDIT_7f_moveType').value = OM_moveType;
				document.getElementById('R3_SCD_EDIT_7f_pattern').value = OM_pattern;
				document.getElementById('R3_SCD_EDIT_7f_data0').value = OM_data0;
				document.getElementById('R3_SCD_EDIT_7f_speed').value = OM_speed;
				document.getElementById('R3_SCD_EDIT_7f_zIndex').value = OM_zIndex;
				document.getElementById('R3_SCD_EDIT_7f_superID').value = OM_superId;
				document.getElementById('R3_SCD_EDIT_7f_setFlag').value = OM_setFlag;
				document.getElementById('R3_SCD_EDIT_7f_beFlag').value = OM_beFlag;
				document.getElementById('R3_SCD_EDIT_7f_boolType').value = OM_boolType;
				document.getElementById('R3_SCD_EDIT_7f_setColission').value = OM_setCol;
				document.getElementById('R3_SCD_EDIT_7f_visibility').value = OM_visib;
				document.getElementById('R3_SCD_EDIT_7f_colType').value = OM_colType;
				document.getElementById('R3_SCD_EDIT_7f_xPos').value = OM_posX;
				document.getElementById('R3_SCD_EDIT_7f_yPos').value = OM_posY;
				document.getElementById('R3_SCD_EDIT_7f_zPos').value = OM_posZ;
				document.getElementById('R3_SCD_EDIT_7f_xDir').value = OM_dirX;
				document.getElementById('R3_SCD_EDIT_7f_yDir').value = OM_dirY;
				document.getElementById('R3_SCD_EDIT_7f_zDir').value = OM_dirZ;
				document.getElementById('R3_SCD_EDIT_7f_xColPos').value = OM_colPosX;
				document.getElementById('R3_SCD_EDIT_7f_yColPos').value = OM_colPosY;
				document.getElementById('R3_SCD_EDIT_7f_zColPos').value = OM_colPosZ;
				document.getElementById('R3_SCD_EDIT_7f_xColDir').value = OM_colDirX;
				document.getElementById('R3_SCD_EDIT_7f_yColDir').value = OM_colDirY;
				document.getElementById('R3_SCD_EDIT_7f_zColDir').value = OM_colDirZ;
				focusDomId = 'R3_SCD_EDIT_7f_id';
			};
			// Motion Trigger [PLC_MOTION]
			if (cOpcode === '80'){
				var PLC_id    = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]),
					PLC_type  = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]);
				document.getElementById('R3_SCD_EDIT_80_id').value = PLC_id;
				document.getElementById('R3_SCD_EDIT_80_value').value = PLC_value;
				document.getElementById('R3_SCD_EDIT_80_type').value = PLC_type;
				focusDomId = 'R3_SCD_EDIT_80_id';
			};
			// Set Animation DEST [PLC_DEST]
			if (cOpcode === '81'){
				TMS.append('R3_SCD_EDIT_81_animation', INCLUDE_EDIT_SCD_PLC_DEST_ANIMATIONS);
				var PLC_animation	 = cFunction.slice(R3_SCD_DEC_DB.animation[0], R3_SCD_DEC_DB.animation[1]),
					PLC_animModifier = cFunction.slice(R3_SCD_DEC_DB.animModifier[0], R3_SCD_DEC_DB.animModifier[1]),
					PLC_dataA		 = cFunction.slice(R3_SCD_DEC_DB.dataA[0], R3_SCD_DEC_DB.dataA[1]),
					PLC_dataB		 = cFunction.slice(R3_SCD_DEC_DB.dataB[0], R3_SCD_DEC_DB.dataB[1]);
				document.getElementById('R3_SCD_EDIT_81_animation').value = PLC_animation;
				document.getElementById('R3_SCD_EDIT_81_animModifier').value = PLC_animModifier;
				document.getElementById('R3_SCD_EDIT_81_dataA').value = PLC_dataA;
				document.getElementById('R3_SCD_EDIT_81_dataB').value = PLC_dataB;
				R3_SCD_EDIT_FUNCTION_PLC_DEST();
				focusDomId = 'R3_SCD_EDIT_81_animation';
			};
			// Set Head Animation [PLC_NECK]
			if (cOpcode === '82'){
				TMS.append('R3_SCD_EDIT_82_type', INCLUDE_EDIT_SCD_PLC_NECK_ANIMATIONS);
				var PLC_type   = cFunction.slice(R3_SCD_DEC_DB.type[0], R3_SCD_DEC_DB.type[1]),
					PLC_repeat = cFunction.slice(R3_SCD_DEC_DB.repeat[0], R3_SCD_DEC_DB.repeat[1]),
					PLC_data0  = cFunction.slice(R3_SCD_DEC_DB.data0[0], R3_SCD_DEC_DB.data0[1]),
					PLC_data1  = cFunction.slice(R3_SCD_DEC_DB.data1[0], R3_SCD_DEC_DB.data1[1]),
					PLC_data2  = cFunction.slice(R3_SCD_DEC_DB.data2[0], R3_SCD_DEC_DB.data2[1]),
					PLC_data3  = cFunction.slice(R3_SCD_DEC_DB.data3[0], R3_SCD_DEC_DB.data3[1]),
					PLC_speed  = cFunction.slice(R3_SCD_DEC_DB.speed[0], R3_SCD_DEC_DB.speed[1]);
				document.getElementById('R3_SCD_EDIT_82_type').value = PLC_type;
				document.getElementById('R3_SCD_EDIT_82_repeat').value = parseInt(PLC_repeat, 16);
				document.getElementById('R3_SCD_EDIT_82_DATA_0').value = PLC_data0;
				document.getElementById('R3_SCD_EDIT_82_DATA_1').value = PLC_data1;
				document.getElementById('R3_SCD_EDIT_82_DATA_2').value = PLC_data2;
				document.getElementById('R3_SCD_EDIT_82_DATA_3').value = PLC_data3;
				document.getElementById('R3_SCD_EDIT_82_speed').value = parseInt(PLC_speed, 16);
				R3_SCD_EDIT_FUNCTION_PLC_NECK_updateLabels();
				focusDomId = 'R3_SCD_EDIT_82_type';
			};
			// [PLC_FLG]
			if (cOpcode === '84'){
				var PLC_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_84_id').value = PLC_id;
				document.getElementById('R3_SCD_EDIT_84_value').value = PLC_value;
				focusDomId = 'R3_SCD_EDIT_84_id';
			};
			// [PLC_GUN]
			if (cOpcode === '85'){
				var PLC_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_85_id').value = PLC_Id;
				focusDomId = 'R3_SCD_EDIT_85_id';
			};
			// [PLC_ROT]
			if (cOpcode === '88'){
				var PLC_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_88_id').value = PLC_id;
				document.getElementById('R3_SCD_EDIT_88_value').value = PLC_value;
				focusDomId = 'R3_SCD_EDIT_88_id';
			};
			// [PLC_CNT]
			if (cOpcode === '89'){
				var PLC_Id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_89_id').value = PLC_Id;
				focusDomId = 'R3_SCD_EDIT_89_id';
			};
			// [PLC_MOT_NUM]
			if (cOpcode === '8e'){
				var PLC_id 	  = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]),
					PLC_value = cFunction.slice(R3_SCD_DEC_DB.value[0], R3_SCD_DEC_DB.value[1]);
				document.getElementById('R3_SCD_EDIT_8e_id').value = PLC_id;
				document.getElementById('R3_SCD_EDIT_8e_value').value = PLC_value;
				focusDomId = 'R3_SCD_EDIT_8e_id';
			};
			// Reset Enemy Animation [EM_RESET]
			if (cOpcode === '8f'){
				var EM_id = cFunction.slice(R3_SCD_DEC_DB.id[0], R3_SCD_DEC_DB.id[1]);
				document.getElementById('R3_SCD_EDIT_8f_id').value = EM_id;
				focusDomId = 'R3_SCD_EDIT_8f_id';
			};
			/*
				End
			*/
			document.getElementById('R3_SCD_BTN_APPLY').onclick = function(){
				R3_SCD_FUNCTION_APPLY(false, undefined, true);
			};
			R3_SCD_openFunctionEdit(cOpcode, false);
			// Auto-focus
			if (focusDomId !== ''){
				setTimeout(function(){
					document.getElementById(focusDomId).focus();
				}, 10);
			};
		} else {
			// Check if can edit function
			if (canEdit === false){
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to edit function ' + functionId + '! <br>Reason: ' + errorReason);
			} else {
				document.getElementById('R3_SCD_EDITFUNCTION_HOLDER').innerHTML = INCLUDE_SCD_EDIT_WIP;
				document.getElementById('R3_SCD_BTN_APPLY').onclick = undefined;
				TMS.css('R3_SCD_BTN_APPLY', {'display': 'none'});
				R3_SCD_openFunctionEdit(cOpcode, false);
			};
		};
	};
};
// Insert Function without options
function R3_SCD_FUNCTION_AUTOINSERT(cOpcode, isHexPreview){
	if (R3_SCD_IS_EDITING === false && SCD_arquivoBruto !== undefined){
		if (R3_SCD_DATABASE[cOpcode.slice(0, 2)] !== undefined){
			R3_SCD_FUNCTION_APPLY(true, cOpcode, false);
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable insert this function because it does not exist!');
		};
	} else {
		if (R3_SCD_IS_EDITING === false && SCD_arquivoBruto === undefined){
			R3_SCD_NEW_FILE();
		};
	};
};
// Apply Function
function R3_SCD_FUNCTION_APPLY(autoInsert, hex, isEdit, isHexPreview){
	var c = 0, SCD_CAN_APPLY = SCD_SHOW_REASON = true, SCD_REASON = SWAP_function = HEX_FINAL = '', SCD_scriptLoc = parseInt(document.getElementById('R3_SCD_editFunction_pos').value - 1);
	/*
		Compile opcodes
	*/
	// Execute Event [EVT_EXEC]
	if (R3_SCD_currentOpcode === '04'){
		var EVT_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_04_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + EVT_id;
	};
	// Event Kill [EVT_KILL]
	if (R3_SCD_currentOpcode === '05'){
		var EVT_target = R3_fixVars(document.getElementById('R3_SCD_EDIT_05_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + EVT_target;
	};
	/*
		If [IF] 
		WHAT IS GOING ON HERE?
	*/
	if (R3_SCD_currentOpcode === '06'){
		HEX_FINAL = R3_SCD_currentOpcode + '000000';
	};
	/*
		Else [ELSE] 
		I will skip that zAlign!
	*/
	if (R3_SCD_currentOpcode === '07'){
		var ELSE_length = R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH('07');
		HEX_FINAL = R3_SCD_currentOpcode + '00' + ELSE_length;
	};
	// Sleep [SLEEP]
	if (R3_SCD_currentOpcode === '09'){
		var SLEEP_sleeping = document.getElementById('R3_SCD_EDIT_09_sleeping').value;
			SLEEP_count = R3_parseEndian(R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_09_count').value).toString(16), 4));
		if (document.getElementById('R3_SCD_EDIT_09_count').value === 0){
			SLEEP_count = '01';
		};
		HEX_FINAL = R3_SCD_currentOpcode + SLEEP_sleeping + SLEEP_count;
	};
	// Sleeping [SLEEPING]
	if (R3_SCD_currentOpcode === '0a'){
		var SLEEPING_count = R3_parseEndian(R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_0a_count').value).toString(16), 4));
		HEX_FINAL = R3_SCD_currentOpcode + SLEEPING_count;
	};
	// For [FOR]
	if (R3_SCD_currentOpcode === '0d'){
		var FOR_length = R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH_SPECIAL('0d'),
			FOR_loopCount = R3_parseEndian(R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_0d_loop').value).toString(16), 4));
		HEX_FINAL = R3_SCD_currentOpcode + '00' + FOR_length + FOR_loopCount;
	};
	// Run Script [GO_SUB]
	if (R3_SCD_currentOpcode === '19'){
		var nPos, subLoopCheck = true, askSub, SUB_Id = document.getElementById('R3_SCD_EDIT_19_scriptId').value, SUB_final;
		if (SUB_Id === 0){
			SUB_Id = 1;
		};
		if (SUB_Id > (Object.keys(R3_SCD_SCRIPTS_LIST).length - 1)){
			nPos = (Object.keys(R3_SCD_SCRIPTS_LIST).length - 1);
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (SCD Compiler) - Setting (' + (SCD_scriptLoc + 1) + ') Run Script [GO_SUB] target to ' + nPos + ' due original target does not exists! (Original: ' + SUB_Id + ')');
			SUB_Id = nPos;
		};
		if (parseInt(SUB_Id) === R3_SCD_CURRENT_SCRIPT){
			askSub = R3_SYSTEM_CONFIRM('WARN: The current target leads to the same script this function is running!\n\nThis can cause an infinite loop, probably making the game crash. You can compile this function without any problem if you are aware of what you are doing.\n\nAre you sure you want to continue?');
			subLoopCheck = askSub;
		};
		// End
		if (subLoopCheck === true){
			SUB_final = R3_fixVars(parseInt(SUB_Id).toString(16), 2);
		} else {
			SUB_final = R3_fixVars(parseInt(R3_SCD_TEMP_GOSUB_VALUE).toString(16), 2);
		};
		HEX_FINAL = R3_SCD_currentOpcode + SUB_final;
	};
	// Set Timer / Value [SET_TIMER]
	if (R3_SCD_currentOpcode === '1e'){
		var SET_target = document.getElementById('R3_SCD_EDIT_1e_target').value,
			SET_time   = R3_fixVars(document.getElementById('R3_SCD_EDIT_1e_hex').innerHTML, 4);
		HEX_FINAL = R3_SCD_currentOpcode + SET_target + SET_time;
	};
	// Execute Calculation [CALC_OP]
	if (R3_SCD_currentOpcode === '20'){
		var CALC_unk0 	   = R3_fixVars(document.getElementById('R3_SCD_EDIT_20_unk0').value, 2),
			CALC_operation = document.getElementById('R3_SCD_EDIT_20_operation').value,
			CALC_accmId    = R3_fixVars(document.getElementById('R3_SCD_EDIT_20_accmId').value, 2),
			CALC_value 	   = R3_fixVars(document.getElementById('R3_SCD_EDIT_20_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + CALC_unk0 + CALC_operation + CALC_accmId + CALC_value;
	};
	// [EVT_CUT]
	if (R3_SCD_currentOpcode === '22'){
		var EVT_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_22_value').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + EVT_value;
	};
	// [CHASER_EVT_CLR]
	if (R3_SCD_currentOpcode === '24'){
		HEX_FINAL = R3_SCD_currentOpcode + '00';
	};
	// Open Map [MAP_OPEN]
	if (R3_SCD_currentOpcode === '25'){
		var MAP_Id = R3_fixVars(document.getElementById('R3_SCD_EDIT_25_id').value, 2),
			MAP_room = R3_fixVars(document.getElementById('R3_SCD_EDIT_25_room').value, 4);
		if (MAP_room === '0000'){
			MAP_room = '0100';
		};
		HEX_FINAL = R3_SCD_currentOpcode + MAP_Id + MAP_room;
	};
	/*
		[POINT_ADD]
		Skip Z-Align!
	*/
	if (R3_SCD_currentOpcode === '26'){
		var POINT_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_26_data0').value, 4),
			POINT_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_26_data1').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + POINT_data0 + POINT_data1;
	};
	// [DIR_CK] - No more Z-Aling!
	if (R3_SCD_currentOpcode === '29'){
		var DIR_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_29_data0').value, 4),
			DIR_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_29_data1').value, 4),
			DIR_data2 = R3_fixVars(document.getElementById('R3_SCD_EDIT_29_data2').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + DIR_data0 + DIR_data1 + DIR_data2;
	};
	// [PARTS_SET]
	if (R3_SCD_currentOpcode === '2a'){
		var PARTS_id	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_2a_id').value, 2),
			PARTS_type   = R3_fixVars(document.getElementById('R3_SCD_EDIT_2a_type').value, 2),
			PARTS_value	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_2a_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + PARTS_id + PARTS_type + PARTS_value;
	};
	// [VLOOP_SET]
	if (R3_SCD_currentOpcode === '2b'){
		var VLOOP_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_2b_value').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + VLOOP_value;
	};
	// [OTA_BE_SET]
	if (R3_SCD_currentOpcode === '2c'){
		var OTA_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_2c_data0').value, 2),
			OTA_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_2c_data1').value, 2),
			OTA_flag  = R3_fixVars(document.getElementById('R3_SCD_EDIT_2c_flag').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + OTA_data0 + OTA_data1 + OTA_flag;
	};
	// [LINE_START]
	if (R3_SCD_currentOpcode === '2d'){
		var LINE_id    = R3_fixVars(document.getElementById('R3_SCD_EDIT_2d_id').value, 2),
			LINE_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_2d_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + LINE_id + LINE_value;
	};
	// [LINE_END]
	if (R3_SCD_currentOpcode === '2f'){
		HEX_FINAL = R3_SCD_currentOpcode + '00';
	};
	// Set LIT Position [LIGHT_POS_SET]
	if (R3_SCD_currentOpcode === '30'){
		var LIGHT_id  = R3_fixVars(document.getElementById('R3_SCD_EDIT_30_id').value, 2),
			LIGHT_X   = R3_fixVars(document.getElementById('R3_SCD_EDIT_30_posX').value, 4),
			LIGHT_Y   = R3_fixVars(document.getElementById('R3_SCD_EDIT_30_posY').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + LIGHT_id + LIGHT_X + LIGHT_Y;
	};
	// Set LIT Color [LIGHT_COLOR_SET]
	if (R3_SCD_currentOpcode === '32'){
		var LIGHT_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_32_lightId').value, 2),
			LIGHT_unk0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_32_unk0').value, 2),
			LIGHT_R = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_32_colorR').value).toString(16), 2),
			LIGHT_G = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_32_colorG').value).toString(16), 2),
			LIGHT_B = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_32_colorB').value).toString(16), 2);
		if (parseInt(document.getElementById('R3_SCD_EDIT_32_colorR').value) > 255){
			LIGHT_R = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_32_colorG').value) > 255){
			LIGHT_G = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_32_colorB').value) > 255){
			LIGHT_B = 'ff';
		};
		HEX_FINAL = R3_SCD_currentOpcode + LIGHT_id + LIGHT_unk0 + LIGHT_R + LIGHT_G + LIGHT_B;
	};
	// [AHEAD_ROOM_SET]
	if (R3_SCD_currentOpcode === '33'){
		var AHEAD_value  = R3_fixVars(document.getElementById('R3_SCD_EDIT_33_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + AHEAD_value;
	};
	/*
		[BGM_TBL_CK]
		Skipping zAlign!
	*/
	if (R3_SCD_currentOpcode === '35'){
		var BGM_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_35_data0').value, 2),
			BGM_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_35_data1').value, 2),
			BGM_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_35_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + BGM_data0 + BGM_data1 + BGM_value;
	};
	// [ITEM_GET_CK]
	if (R3_SCD_currentOpcode === '36'){
		var ITEM_code = R3_fixVars(document.getElementById('R3_SCD_EDIT_36_itemCode').value, 2),
			ITEM_quant = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_36_quant').value).toString(16), 2);
		HEX_FINAL = R3_SCD_currentOpcode + ITEM_code + ITEM_quant;
	};
	// [OM_REV]
	if (R3_SCD_currentOpcode === '37'){
		var OM_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_37_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + OM_id;
	};
	// [CHASER_LIFE_INIT]
	if (R3_SCD_currentOpcode === '38'){
		var CHASER_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_38_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + CHASER_id;
	};
	// [CHASER_ITEM_SET]
	if (R3_SCD_currentOpcode === '3b'){
		var CHASER_emId  = R3_fixVars(document.getElementById('R3_SCD_EDIT_3b_emId').value, 2),
			CHASER_objId = R3_fixVars(document.getElementById('R3_SCD_EDIT_3b_objId').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + CHASER_emId + CHASER_objId;
	};
	// [SEL_EVT_ON]
	if (R3_SCD_currentOpcode === '3d'){
		var SEL_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_3d_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + SEL_id;
	};
	// Remove Item [ITEM_LOST]
	if (R3_SCD_currentOpcode === '3e'){
		var ITEM_code = R3_fixVars(document.getElementById('R3_SCD_EDIT_3e_item').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + ITEM_code;
	};
	// [FLR_SET]
	if (R3_SCD_currentOpcode === '3f'){
		var FLR_id   = R3_fixVars(document.getElementById('R3_SCD_EDIT_3f_id').value, 2),
			FLR_flag = R3_fixVars(document.getElementById('R3_SCD_EDIT_3f_flag').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + FLR_id + FLR_flag;
	};
	// Set Variable [MEMB_SET]
	if (R3_SCD_currentOpcode === '40'){
		var MEMB_id 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_40_id').value, 2),
			MEMB_variable = R3_fixVars(document.getElementById('R3_SCD_EDIT_40_var').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + MEMB_id + MEMB_variable;
	};
	// Set Variable 2 [MEMB_SET2]
	if (R3_SCD_currentOpcode === '41'){
		var MEMB_id 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_41_id').value, 2),
			MEMB_variable = R3_fixVars(document.getElementById('R3_SCD_EDIT_41_variable').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + MEMB_id + MEMB_variable;
	};
	// Set Fade [FADE_SET]
	if (R3_SCD_currentOpcode === '46'){
		var FADE_id 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_46_id').value, 2),
			FADE_unk0 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_46_unk0').value, 2),
			FADE_type 	  = document.getElementById('R3_SCD_EDIT_46_type').value,
			FADE_colorB   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_46_colorB').value).toString(16), 2),
			FADE_colorG   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_46_colorG').value).toString(16), 2),
			FADE_colorR   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_46_colorR').value).toString(16), 2),
			FADE_colorY   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_46_colorY').value).toString(16), 2),
			FADE_colorM   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_46_colorM').value).toString(16), 2),
			FADE_colorC   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_46_colorC').value).toString(16), 2),
			FADE_duration = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_46_duration').value).toString(16), 2);
		if (parseInt(document.getElementById('R3_SCD_EDIT_46_colorB').value) > 255){
			FADE_colorB = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_46_colorG').value) > 255){
			FADE_colorG = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_46_colorR').value) > 255){
			FADE_colorR = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_46_colorY').value) > 255){
			FADE_colorY = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_46_colorM').value) > 255){
			FADE_colorM = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_46_colorC').value) > 255){
			FADE_colorC = 'ff';
		};
		if (parseInt(document.getElementById('R3_SCD_EDIT_46_duration').value) > 255){
			FADE_duration = 'ff';
		};
		HEX_FINAL = R3_SCD_currentOpcode + FADE_id + FADE_unk0 + FADE_type + FADE_colorB + FADE_colorG + FADE_colorR + FADE_colorY + 
					FADE_colorM + FADE_colorC + FADE_duration;
	};
	// Char Trigger [WORK_SET]
	if (R3_SCD_currentOpcode === '47'){
		var WORK_target = R3_fixVars(document.getElementById('R3_SCD_EDIT_47_target').value, 2),
			WORK_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_47_value').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + WORK_target + WORK_value;
	};
	// [SPD_SET]
	if (R3_SCD_currentOpcode === '48'){
		var SPD_id    = R3_fixVars(document.getElementById('R3_SCD_EDIT_48_id').value, 2),
			SPD_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_48_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + SPD_id + SPD_value;
	};
	// Check Boolean [CK]
	if (R3_SCD_currentOpcode === '4c'){
		var CK_event = document.getElementById('R3_SCD_EDIT_4c_event').value;
			CK_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_4c_value').value, 2);
			CK_flag  = document.getElementById('R3_SCD_EDIT_4c_flag').value;
		HEX_FINAL = R3_SCD_currentOpcode + CK_event + CK_value + CK_flag;
	};
	// Set Event Value [SET]
	if (R3_SCD_currentOpcode === '4d'){
		var SET_id   = R3_fixVars(document.getElementById('R3_SCD_EDIT_4d_id').value, 2),
			SET_var  = document.getElementById('R3_SCD_EDIT_4d_var').value,
			SET_flag = document.getElementById('R3_SCD_EDIT_4d_boolean').value;
		HEX_FINAL = R3_SCD_currentOpcode + SET_id + SET_var + SET_flag;
	};
	// Change Camera [CUT_CHG]
	if (R3_SCD_currentOpcode === '50'){
		var CUT_id = parseInt(document.getElementById('R3_SCD_EDIT_50_id').value).toString(16);
		if (CUT_id === NaN){
			CUT_id = '00';
		} else {
			CUT_id = R3_fixVars(CUT_id, 2);
		};
		HEX_FINAL = R3_SCD_currentOpcode + CUT_id;
	};
	// Lock Camera [CUT_AUTO]
	if (R3_SCD_currentOpcode === '52'){
		var CUT_flag = R3_fixVars(document.getElementById('R3_SCD_EDIT_52_flag').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + CUT_flag;
	};
	// Swap Camera [CUT_REPLACE]
	if (R3_SCD_currentOpcode === '53'){
		var CUT_id = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_53_prevCamValue').value).toString(16), 2),
			CUT_value = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_53_nextCamValue').value).toString(16), 2);
		HEX_FINAL = R3_SCD_currentOpcode + CUT_id + CUT_value;
	};
	// [CUT_BE_SET]
	if (R3_SCD_currentOpcode === '54'){
		var CUT_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_54_id').value, 2),
			CUT_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_54_value').value, 2),
			CUT_flag = R3_fixVars(document.getElementById('R3_SCD_EDIT_54_flag').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + CUT_id + CUT_value + CUT_flag;
	};
	// Set Target Position [POS_SET]
	if (R3_SCD_currentOpcode === '55'){
		var POS_target = R3_fixVars(document.getElementById('R3_SCD_EDIT_55_target').value, 2),
			POS_X =	R3_fixVars(document.getElementById('R3_SCD_EDIT_55_posX').value, 4),
			POS_Y = R3_fixVars(document.getElementById('R3_SCD_EDIT_55_posY').value, 4),
			POS_Z = R3_fixVars(document.getElementById('R3_SCD_EDIT_55_posZ').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + POS_target + POS_X + POS_Z + POS_Y;
	};
	// [DIR_SET]
	if (R3_SCD_currentOpcode === '56'){
		var DIR_target = R3_fixVars(document.getElementById('R3_SCD_EDIT_56_target').value, 2),
			DIR_X =	R3_fixVars(document.getElementById('R3_SCD_EDIT_56_posX').value, 4),
			DIR_Y = R3_fixVars(document.getElementById('R3_SCD_EDIT_56_posY').value, 4),
			DIR_Z = R3_fixVars(document.getElementById('R3_SCD_EDIT_56_posZ').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + DIR_target + DIR_X + DIR_Z + DIR_Y;
	};
	/*
		[SET_VIB0]
		No more zAlign!
	*/
	if (R3_SCD_currentOpcode === '57'){
		var SET_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_57_data0').value, 4),
			SET_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_57_data1').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + SET_data0 + SET_data1;
	};
	// [SET_VIB1]
	if (R3_SCD_currentOpcode === '58'){
		var SET_id 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_58_id').value, 2),
			SET_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_58_data0').value, 4),
			SET_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_58_data1').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + SET_id + SET_data0 + SET_data1;
	};
	// RBJ Trigger [RBJ_SET]
	if (R3_SCD_currentOpcode === '5a'){
		var RBJ_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_5a_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + RBJ_id;
	};
	// Display Message [MESSAGE_ON]
	if (R3_SCD_currentOpcode === '5b'){
		var MESSAGE_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_5b_id').value.toString(16), 2);
			MESSAGE_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_5b_data0').value, 4);
			MESSAGE_dMode = document.getElementById('R3_SCD_EDIT_5b_displayMode').value;
		if (MESSAGE_id === NaN){
			MESSAGE_id = '00';
		};
		HEX_FINAL = R3_SCD_currentOpcode + MESSAGE_id + MESSAGE_data0 + MESSAGE_dMode;
	};
	// [RAIN_SET]
	if (R3_SCD_currentOpcode === '5c'){
		var RAIN_flag = R3_fixVars(document.getElementById('R3_SCD_EDIT_5c_flag').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + RAIN_flag;
	};
	// [SHAKE_ON]
	if (R3_SCD_currentOpcode === '5e'){
		var SHAKE_id 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_5e_id').value, 2),
			SHAKE_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_5e_value').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + SHAKE_id + SHAKE_value;
	};
	// Change Weapon [WEAPON_CHG]
	if (R3_SCD_currentOpcode === '5f'){
		var WEAPON_id = document.getElementById('R3_SCD_EDIT_5f_weaponId').value;
		HEX_FINAL = R3_SCD_currentOpcode + WEAPON_id;
	};
	// Set Door [DOOR_AOT_SET]
	if (R3_SCD_currentOpcode === '61'){
		var door_Id     = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_id').value, 2),
			door_aot 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_61_aot').value, 8),
			door_XPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_posX').value, 4),
			door_YPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_posY').value, 4),
			door_ZPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_posZ').value, 4),
			door_RPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_posR').value, 4),
			door_nextX  = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_nextX').value, 4),
			door_nextY  = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_nextY').value, 4),
			door_nextZ  = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_nextZ').value, 4),
			door_nextR  = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_nextR').value, 4),
			door_nStage = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_61_stage').value - 1).toString(16), 2),
			door_nRoom  = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_roomNumber').value, 2),
			door_nCam   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_61_nextCam').value).toString(16), 2),
			door_zIndex = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_zIndex').value, 2),
			door_type   = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_doorType').value, 2),
			door_orient = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_openOrient').value, 2),
			door_unk0 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_61_unk0').value, 2),
			door_lkFlag = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_lockFlag').value, 2),
			door_lkKey  = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_lockKey').value, 2),
			door_dText  = R3_fixVars(document.getElementById('R3_SCD_EDIT_61_displayText').value, 2),
			// Magic Door
			R3_MAGIC_DOOR = document.getElementById('R3_SCD_EDIT_61_checkMagicDoor').checked;
		if (R3_MAGIC_DOOR === true){
			door_orient = '05';
		};
		// End
		HEX_FINAL = R3_SCD_currentOpcode + door_Id + door_aot + door_XPos + door_YPos + door_ZPos + door_RPos + door_nextX + door_nextZ + door_nextY + door_nextR + door_nStage + 
					door_nRoom + door_nCam + door_zIndex + door_type + door_orient + door_unk0 + door_lkFlag + door_lkKey + door_dText;
	};
	// Set Door 4P [DOOR_AOT_SET_4P]
	if (R3_SCD_currentOpcode === '62'){
		var door_Id     = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_id').value, 2),
			door_aot 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_62_aot').value, 8),
			door_XPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_posX').value, 4),
			door_YPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_posY').value, 4),
			door_ZPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_posZ').value, 4),
			door_RPos   = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_posR').value, 4),
			door_4P 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_62_4P').value, 16),
			door_nextX  = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_nextX').value, 4),
			door_nextY  = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_nextY').value, 4),
			door_nextZ  = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_nextZ').value, 4),
			door_nextR  = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_nextR').value, 4),
			door_nStage = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_62_stage').value - 1).toString(16), 2),
			door_nRoom  = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_roomNumber').value, 2),
			door_nCam   = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_62_nextCam').value).toString(16), 2),
			door_zIndex = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_zIndex').value, 2),
			door_type   = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_doorType').value, 2),
			door_orient = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_openOrient').value, 2),
			door_unk0 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_62_unk0').value, 2),
			door_lkFlag = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_lockFlag').value, 2),
			door_lkKey  = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_lockKey').value, 2),
			door_dText  = R3_fixVars(document.getElementById('R3_SCD_EDIT_62_displayText').value, 2),
			// Magic Door
			R3_MAGIC_DOOR = document.getElementById('R3_SCD_EDIT_62_checkMagicDoor').checked;
		if (R3_MAGIC_DOOR === true){
			door_orient = '05';
		};
		HEX_FINAL = R3_SCD_currentOpcode + door_Id + door_aot + door_XPos + door_YPos + door_ZPos + door_RPos + door_4P +  door_nextX + door_nextY + door_nextZ + 
					door_nextR + door_nStage + door_nRoom + door_nCam + door_zIndex + door_type + door_orient + door_unk0 + door_lkFlag + door_lkKey + door_dText;
	};
	// Set Interactive Object [AOT_SET]
	if (R3_SCD_currentOpcode === '63'){
		var AOT_id 		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_id').value, 2),
			AOT_aot 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_aot').value, 2),
			AOT_type 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_type').value, 2),
			AOT_nFloor 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_nFloor').value, 2),
			AOT_aotSuper = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_super').value, 2),
			AOT_X		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_posX').value, 4),
			AOT_Y		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_posY').value, 4),
			AOT_W		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_width').value, 4),
			AOT_H		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_height').value, 4),
			AOT_data0 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_data0').value, 2),
			AOT_data1 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_data1').value, 2),
			AOT_data2 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_data2').value, 2),
			AOT_data3 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_data3').value, 2),
			AOT_dMode 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_63_displayMode').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + AOT_id + AOT_aot + AOT_type + AOT_nFloor + AOT_aotSuper + AOT_X + AOT_Y + AOT_W + AOT_H + AOT_data0 + AOT_data1 +
					AOT_data2 + AOT_data3 + AOT_dMode;
	};
	// [AOT_RESET]
	if (R3_SCD_currentOpcode === '65'){
		var AOT_aot    = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_aot').value, 2),
			AOT_id     = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_id').value, 2),
			AOT_type   = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_type').value, 2),
			AOT_unk3   = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_unk3').value, 2),
			AOT_unk0   = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_unk0').value, 2),
			AOT_num    = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_num').value, 2),
			AOT_unk1   = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_unk1').value, 2),
			AOT_flag   = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_flag').value, 2),
			AOT_unk2   = R3_fixVars(document.getElementById('R3_SCD_EDIT_65_unk2').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + AOT_aot + AOT_id + AOT_type + AOT_unk3 + AOT_unk0 + AOT_num + AOT_unk1 + AOT_flag + AOT_unk2;
	};
	// Run Interactive Object [AOT_ON]
	if (R3_SCD_currentOpcode === '66'){
		var AOT_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_66_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + AOT_id;
	};
	// Set Item [ITEM_AOT_SET]
	if (R3_SCD_currentOpcode === '67'){
		var item_Id 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_id').value, 2),
			item_aot 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_aot').value, 8),
			item_Xpos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_posX').value, 4),
			item_Ypos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_posY').value, 4),
			item_Zpos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_posZ').value, 4),
			item_Rpos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_posR').value, 4),
			item_code 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_item').value, 2),
			item_unk0 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_unk0').value, 2),
			item_quant 	 = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_67_quant').value).toString(16), 2),
			item_unk1 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_unk1').value, 2),
			item_unk2 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_unk2').value, 2),
			item_flag 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_iFlag').value, 2),
			item_modelId = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_modelId').value, 2),
			item_MP 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_67_blinkColor').value + R3_JS_COMPILER_parseCrouch(1, 'R3_SCD_EDIT_67_playerCrouch'), 2);
		HEX_FINAL = R3_SCD_currentOpcode + item_Id + item_aot + item_Xpos + item_Ypos + item_Zpos + item_Rpos + item_code + item_unk0 + item_quant + 
					item_unk1 + item_unk2 + item_flag + item_modelId + item_MP;
	}
	// Set Item 4P [ITEM_AOT_SET_4P]
	if (R3_SCD_currentOpcode === '68'){
		var item_Id 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_id').value, 2),
			item_aot 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_aot').value, 8),
			item_Xpos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_posX').value, 4),
			item_Ypos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_posY').value, 4),
			item_Zpos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_posZ').value, 4),
			item_Rpos 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_posR').value, 4),
			item_4P 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_4P').value, 16),
			item_code 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_item').value, 2),
			item_unk0 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_unk0').value, 2),
			item_quant 	 = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_68_quant').value).toString(16), 2),
			item_unk1 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_unk1').value, 2),
			item_unk2 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_unk2').value, 2),
			item_flag 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_iFlag').value, 2),
			item_modelId = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_modelId').value, 2),
			item_MP 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_68_blinkColor').value + R3_JS_COMPILER_parseCrouch(1, 'R3_SCD_EDIT_68_playerCrouch'), 2);
		HEX_FINAL = R3_SCD_currentOpcode + item_Id + item_aot + item_Xpos + item_Ypos + item_Zpos + item_Rpos + item_4P + item_code + item_unk0 + item_quant + 
					item_unk1 + item_unk2 + item_flag + item_modelId + item_MP;
	};
	// [SUPER_SET] - No More Z-Align
	if (R3_SCD_currentOpcode === '6a'){
		var SUPER_aot 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_aot').value, 2),
			SUPER_id 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_id').value, 2),
			SUPER_data0  = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_data0').value, 4),
			SUPER_data1  = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_data1').value, 4),
			SUPER_data2  = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_data2').value, 4),
			SUPER_X 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_posX').value, 4),
			SUPER_Y 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_posY').value, 4),
			SUPER_Z 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_6a_posZ').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + SUPER_aot + SUPER_id + SUPER_data0 + SUPER_data1 + SUPER_data2 + SUPER_X + SUPER_Y + SUPER_Z;
	};
	// Check Item [KEEP_ITEM_CK]
	if (R3_SCD_currentOpcode === '6b'){
		var item_code = document.getElementById('R3_SCD_EDIT_6b_item').value;
		HEX_FINAL = R3_SCD_currentOpcode + item_code;
	};
	// [KEY_CK]
	if (R3_SCD_currentOpcode === '6c'){
		var KEY_flag = document.getElementById('R3_SCD_EDIT_6c_flag').value,
			KEY_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_6c_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + KEY_flag + KEY_value;
	};
	// [TRG_CK]
	if (R3_SCD_currentOpcode === '6d'){
		var TRG_flag = R3_fixVars(document.getElementById('R3_SCD_EDIT_6d_flag').value, 2),
			TRG_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_6d_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + TRG_flag + TRG_value;
	};
	// [SCA_ID_SET]
	if (R3_SCD_currentOpcode === '6e'){
		var SCA_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_6e_id').value, 2),
			SCA_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_6e_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + SCA_id + SCA_value;
	};
	// [OM_BOMB]
	if (R3_SCD_currentOpcode === '6f'){
		var OM_id = document.getElementById('R3_SCD_EDIT_6f_id').value;
		HEX_FINAL = R3_SCD_currentOpcode + OM_id;
	};
	// [ESPR_KILL2]
	if (R3_SCD_currentOpcode === '75'){
		var ESPR_Id = R3_fixVars(document.getElementById('R3_SCD_EDIT_75_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + ESPR_Id;
	};
	// [ESPR_KILL_ALL]
	if (R3_SCD_currentOpcode === '76'){
		var ESPR_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_76_id').value, 2),
			ESPR_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_76_value').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + ESPR_id + ESPR_value;
	};
	// Play SE [SE_ON]
	if (R3_SCD_currentOpcode === '77'){
		var SE_id  	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_id').value, 2),
			SE_type  = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_type').value, 2),
			SE_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_data1').value, 2),
			SE_work  = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_work').value, 2),
			SE_data3 = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_data3').value, 2),
			SE_X 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_posX').value, 4),
			SE_Y 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_posY').value, 4),
			SE_Z 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_77_posZ').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + SE_id + SE_type + SE_data1 + SE_work + SE_data3 + SE_X + SE_Y + SE_Z;
	};
	// [BGM_CTL]
	if (R3_SCD_currentOpcode === '78'){
		var BGM_id     = R3_fixVars(document.getElementById('R3_SCD_EDIT_78_id').value, 2),
			BGM_op 	   = R3_fixVars(document.getElementById('R3_SCD_EDIT_78_op').value, 2),
			BGM_type   = R3_fixVars(document.getElementById('R3_SCD_EDIT_78_type').value, 2),
			BGM_value  = R3_fixVars(document.getElementById('R3_SCD_EDIT_78_value').value, 2);
			BGM_volume = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_78_volume').value).toString(16), 2);
		HEX_FINAL = R3_SCD_currentOpcode + BGM_id + BGM_op + BGM_type + BGM_value + BGM_volume;
	};
	// [XA_ON]
	if (R3_SCD_currentOpcode === '79'){
		var XA_Id   = R3_fixVars(document.getElementById('R3_SCD_EDIT_79_id').value, 2),
			XA_data = R3_fixVars(document.getElementById('R3_SCD_EDIT_79_data').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + XA_Id + XA_data;
	};
	// Call Cinematic [MOVIE_ON]
	if (R3_SCD_currentOpcode === '7a'){
		var MOVIE_id = document.getElementById('R3_SCD_EDIT_7a_movieId').value;
		HEX_FINAL = R3_SCD_currentOpcode + MOVIE_id;
	};
	// [BGM_TBL_SET]
	if (R3_SCD_currentOpcode === '7b'){
		var BGM_id0  = R3_fixVars(document.getElementById('R3_SCD_EDIT_7b_id0').value, 2),
			BGM_id1  = R3_fixVars(document.getElementById('R3_SCD_EDIT_7b_id1').value, 2),
			BGM_type = R3_fixVars(document.getElementById('R3_SCD_EDIT_7b_type').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + BGM_id0 + BGM_id1 + BGM_type;
	};
	// Set Enemy / NPC [EM_SET]
	if (R3_SCD_currentOpcode === '7d'){
		var EM_unk0 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_unk0').value, 2),
			EM_enemyId   = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_id').value, 2),
			EM_enemyType = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_type').value, 2),
			EM_enemyPose = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_pose').value, 2),
			EM_unk1 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_unk1').value, 2),
			EM_unk2 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_unk2').value, 6),
			EM_soundSet  = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_soundSet').value, 2),
			EM_texture 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_texture').value, 2),
			EM_flag 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_flag').value, 2),
			EM_X 		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_posX').value, 4),
			EM_Y 		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_posY').value, 4),
			EM_Z 		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_posZ').value, 4),
			EM_R 		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_posR').value, 4),
			EM_motion 	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_motion').value, 4),
			EM_ctrlFlag  = R3_fixVars(document.getElementById('R3_SCD_EDIT_7d_ctrlFlag').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + EM_unk0 + EM_enemyId + EM_enemyType + EM_enemyPose + EM_unk1 + EM_unk2 + EM_soundSet + EM_texture + 
					EM_flag + EM_X + EM_Y + EM_Z + EM_R + EM_motion + EM_ctrlFlag;
	};
	// [MIZU_DIV]
	if (R3_SCD_currentOpcode === '7e'){
		var MIZU_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_7e_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + MIZU_id;
	};
	// Set 3D Object [OM_SET]
	if (R3_SCD_currentOpcode === '7f'){
		var OM_id  		= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_id').value, 2),
			OM_AOT 		= document.getElementById('R3_SCD_EDIT_7f_AOT').value,
			OM_moveType = R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_moveType').value, 2),
			OM_pattern  = R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_pattern').value, 4),
			OM_data0 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_data0').value, 2),
			OM_speed 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_speed').value, 2),
			OM_zIndex 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_zIndex').value, 2),
			OM_superId  = R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_superID').value, 2),
			OM_setFlag  = R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_setFlag').value, 2),
			OM_beFlag   = R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_beFlag').value, 2),
			OM_boolType = R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_boolType').value, 2),
			OM_setCol   = R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_setColission').value, 2),
			OM_visib 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_visibility').value, 2),
			OM_colType  = document.getElementById('R3_SCD_EDIT_7f_colType').value,
			OM_posX 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_xPos').value, 4),
			OM_posY 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_yPos').value, 4),
			OM_posZ 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_zPos').value, 4),
			OM_dirX 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_xDir').value, 4),
			OM_dirY 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_yDir').value, 4),
			OM_dirZ 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_zDir').value, 4),
			OM_colPosX 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_xColPos').value, 4),
			OM_colPosY 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_yColPos').value, 4),
			OM_colPosZ 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_zColPos').value, 4),
			OM_colDirX 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_xColDir').value, 4),
			OM_colDirY 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_yColDir').value, 4),
			OM_colDirZ 	= R3_fixVars(document.getElementById('R3_SCD_EDIT_7f_zColDir').value, 4);
	HEX_FINAL = R3_SCD_currentOpcode + OM_id + OM_AOT + OM_moveType + OM_pattern + OM_data0 + OM_speed + OM_zIndex + OM_superId + OM_setFlag + OM_beFlag +
				OM_boolType + OM_setCol + OM_visib + OM_colType + OM_posX + OM_posZ + OM_posY + OM_dirX + OM_dirY + OM_dirZ + OM_colPosX + OM_colPosY + OM_colPosZ +
				OM_colDirX + OM_colDirY + OM_colDirZ;
	};
	// Motion Trigger [PLC_MOTION]
	if (R3_SCD_currentOpcode === '80'){
		var PLC_id    = R3_fixVars(document.getElementById('R3_SCD_EDIT_80_id').value, 2),
			PLC_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_80_value').value, 2),
			PLC_type  = R3_fixVars(document.getElementById('R3_SCD_EDIT_80_type').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + PLC_id + PLC_value + PLC_type;
	};
	/*
		Set Animation Dest [PLC_DEST]
		Skip zAlign
	*/
	if (R3_SCD_currentOpcode === '81'){
		var PLC_animation	 = R3_fixVars(document.getElementById('R3_SCD_EDIT_81_animation').value, 2),
			PLC_animModifier = R3_fixVars(document.getElementById('R3_SCD_EDIT_81_animModifier').value, 2),
			PLC_dataA		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_81_dataA').value, 4),
			PLC_dataB		 = R3_fixVars(document.getElementById('R3_SCD_EDIT_81_dataB').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + '00' + PLC_animation + PLC_animModifier + PLC_dataA + PLC_dataB;
	};
	// Set Head Animation [PLC_NECK]
	if (R3_SCD_currentOpcode === '82'){
		var PLC_type = document.getElementById('R3_SCD_EDIT_82_type').value,
			PLC_repeat = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_82_repeat').value).toString(16), 2),
			PLC_data0 = R3_fixVars(document.getElementById('R3_SCD_EDIT_82_DATA_0').value, 2),
			PLC_data1 = R3_fixVars(document.getElementById('R3_SCD_EDIT_82_DATA_1').value, 4),
			PLC_data2 = R3_fixVars(document.getElementById('R3_SCD_EDIT_82_DATA_2').value, 4),
			PLC_data3 = R3_fixVars(document.getElementById('R3_SCD_EDIT_82_DATA_3').value, 2),
			PLC_speed = R3_fixVars(parseInt(document.getElementById('R3_SCD_EDIT_82_speed').value).toString(16), 2);
		HEX_FINAL = R3_SCD_currentOpcode + PLC_type + PLC_repeat + PLC_data0 + PLC_data1 + PLC_data2 + PLC_data3 + PLC_speed;
	};
	// [PLC_FLG]
	if (R3_SCD_currentOpcode === '84'){
		var PLC_id 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_84_id').value, 2),
			PLC_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_84_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + PLC_id + PLC_value;
	};
	// [PLC_GUN]
	if (R3_SCD_currentOpcode === '85'){
		var PLC_Id = R3_fixVars(document.getElementById('R3_SCD_EDIT_85_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + PLC_Id;
	};
	// [PLC_ROT]
	if (R3_SCD_currentOpcode === '88'){
		var PLC_id 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_88_id').value, 2),
			PLC_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_88_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + PLC_id + PLC_value;
	};
	// [PLC_CNT]
	if (R3_SCD_currentOpcode === '89'){
		var PLC_Id = R3_fixVars(document.getElementById('R3_SCD_EDIT_89_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + PLC_Id;
	};
	// [PLC_MOT_NUM]
	if (R3_SCD_currentOpcode === '8e'){
		var PLC_id 	  = R3_fixVars(document.getElementById('R3_SCD_EDIT_8e_id').value, 2),
			PLC_value = R3_fixVars(document.getElementById('R3_SCD_EDIT_8e_value').value, 4);
		HEX_FINAL = R3_SCD_currentOpcode + PLC_id + PLC_value;
	};
	// Reset Enemy Animation [EM_RESET]
	if (R3_SCD_currentOpcode === '8f'){
		var EM_id = R3_fixVars(document.getElementById('R3_SCD_EDIT_8f_id').value, 2);
		HEX_FINAL = R3_SCD_currentOpcode + EM_id;
	};
	/*
		End
	*/
	if (SCD_scriptLoc === NaN || SCD_scriptLoc < 0){
		SCD_scriptLoc = 0;
	};
	if (SCD_scriptLoc > (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length + 1)){
		SCD_scriptLoc = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length;
	};
	// Auto-Insert Values
	if (autoInsert === true && hex !== undefined){
		if (R3_KEYPRESS_CONTROL === false){
			SCD_scriptLoc = (R3_SCD_HIGHLIGHT_FUNCTION + 1);
			R3_SCD_HIGHLIGHT_FUNCTION++;
			// SCD_scriptLoc = (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length - 1);
		} else {
			ask = R3_SYSTEM_PROMPT('Please insert where you want to add ' + R3_SCD_DATABASE[hex.slice(0, 2)][1] + ' below:');
			if (ask !== null && ask !== ''){
				SCD_scriptLoc = (parseInt(ask) - 1);
				if (SCD_scriptLoc > (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length + 1)){
					SCD_scriptLoc = (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length - 1);
				};
			} else {
				SCD_CAN_APPLY = false;
				SCD_SHOW_REASON = false;
			};
		};
		HEX_FINAL = hex;
		// Fix for control
		R3_KEYPRESS_releaseKeys();
	};
	if (SCD_CAN_APPLY === true){
		//console.info(HEX_FINAL);
		// SCD Hex Preview
		if (isHexPreview === true && R3_SCD_IS_EDITING === true && R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			if (R3_SCD_currentOpcode !== ''){
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: SCD Hex Preview for ' + R3_SCD_DATABASE[R3_SCD_currentOpcode][1] + ': <font class="user-can-select">' + R3_unsolveHEX(HEX_FINAL).toUpperCase() + '</font>');
				R3_DESIGN_MINIWINDOW_OPEN(0);
			} else {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: The preview for this opcode is not ready yet!');
			};
		} else {
			if (isEdit === false){
				if (R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].length === 1){
					R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT] = [];
					R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].push(HEX_FINAL);
					R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].push('0100');
				} else {
					R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].splice(SCD_scriptLoc, 0, HEX_FINAL);
					R3_SCD_HIGHLIGHT_FUNCTION++;
				};
			} else {
				R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][SCD_scriptLoc] = HEX_FINAL;
			};
			// console.info(R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT]);
			R3_SCD_cancelFunctionEdit(true);
			R3_SCD_TEMP_SCRIPT = [];
			R3_SCD_COMPILER_checkConditionalOpcodes(3);
			// R3_SCD_COMPILE(3);
			R3_SCD_scrollScriptList();
		};
	} else {
		if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 1){
			SCD_REASON = SCD_REASON + ' <br>You aren\'t on list editor mode!';
		};
		if (SCD_SHOW_REASON === true){
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to apply function! <br>Reason: ' + SCD_REASON);
			R3_SYSTEM_ALERT('WARN: Unable to apply function!\nReson: ' + SCD_REASON);
		};
	};
};
// Remove Function
function R3_SCD_FUNCTION_REMOVE(functionId){
	if (SCD_arquivoBruto !== undefined){
		var cFunction, functionCode, functionOpcode, requireFocus = false;
		if (functionId !== undefined){
			// Normal usage
			cFunction = parseInt(functionId);
		} else {
			// Focused function
			cFunction = R3_SCD_HIGHLIGHT_FUNCTION;
			requireFocus = true;
		};
		// Check what function is
		functionCode = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][cFunction];
		if (functionCode !== undefined){
			functionOpcode = functionCode.slice(0, 2);
			if (functionOpcode !== '01' && R3_SCD_TOTAL_FUNCTIONS !== 1){
				// End
				R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT].splice(cFunction, 1);
				R3_SCD_COMPILER_checkConditionalOpcodes(3);
				// Focus
				if (requireFocus === true){
					R3_SCD_navigateFunctions(2);
				};
			};
		};
	} else {
		R3_SCD_NEW_FILE();
	};
};
/*
	SCD Edit Internal functions
	This section will hold functions related to edit opcodes
*/
// Use Player Pos
function R3_SCD_EDIT_FUNCTION_usePlayerPos(where){
	// 61 Door Pos.
	if (where === 0){
		document.getElementById('R3_SCD_EDIT_61_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_61_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_61_posZ').value = REALTIME_Z_Pos;
		document.getElementById('R3_SCD_EDIT_61_posR').value = REALTIME_R_Pos;
	};
	// 61 Spawn Pos.
	if (where === 1){
		document.getElementById('R3_SCD_EDIT_61_nextX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_61_nextY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_61_nextZ').value = REALTIME_Z_Pos;
		document.getElementById('R3_SCD_EDIT_61_nextR').value = REALTIME_R_Pos;
		document.getElementById('R3_SCD_EDIT_61_zIndex').value = REALTIME_zIndex;
		document.getElementById('R3_SCD_EDIT_61_nextCam').value = REALTIME_CurrentCam;
		document.getElementById('R3_SCD_EDIT_61_stage').value = parseInt(REALTIME_CurrentStage);
		document.getElementById('R3_SCD_EDIT_61_roomNumber').value = REALTIME_CurrentRoomNumber;
		R3_SCD_FUNCTIONEDIT_updateCamPreview('61');
	};
	// 62 Door Pos.
	if (where === 2){
		document.getElementById('R3_SCD_EDIT_62_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_62_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_62_posZ').value = REALTIME_Z_Pos;
		document.getElementById('R3_SCD_EDIT_62_posR').value = REALTIME_R_Pos;
	};
	// 62 Spawn Pos.
	if (where === 3){
		document.getElementById('R3_SCD_EDIT_62_nextX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_62_nextY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_62_nextZ').value = REALTIME_Z_Pos;
		document.getElementById('R3_SCD_EDIT_62_nextR').value = REALTIME_R_Pos;
		document.getElementById('R3_SCD_EDIT_62_zIndex').value = REALTIME_zIndex;
		document.getElementById('R3_SCD_EDIT_62_nextCam').value = REALTIME_CurrentCam;
		document.getElementById('R3_SCD_EDIT_62_stage').value = parseInt(REALTIME_CurrentStage);
		document.getElementById('R3_SCD_EDIT_62_roomNumber').value = REALTIME_CurrentRoomNumber;
		R3_SCD_FUNCTIONEDIT_updateCamPreview('62');
	};
	// 55 POS_SET XYZ
	if (where === 4){
		document.getElementById('R3_SCD_EDIT_55_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_55_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_55_posZ').value = REALTIME_Z_Pos;
	};
	// 56 DIR_SET XYZ
	if (where === 5){
		document.getElementById('R3_SCD_EDIT_56_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_56_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_56_posZ').value = REALTIME_Z_Pos;
	};
	// 67 Set Item [ITEM_AOT_SET]
	if (where === 6){
		document.getElementById('R3_SCD_EDIT_67_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_67_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_67_posZ').value = REALTIME_Z_Pos;
		document.getElementById('R3_SCD_EDIT_67_posR').value = REALTIME_R_Pos;
	};
	// 77 Play SE [SE_ON]
	if (where === 7){
		document.getElementById('R3_SCD_EDIT_77_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_77_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_77_posZ').value = REALTIME_Z_Pos;
	}
	// 81 Set Animation DEST [PLC_DEST] XY DataA and DataB
	if (where === 8){
		document.getElementById('R3_SCD_EDIT_81_dataA').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_81_dataB').value = REALTIME_Y_Pos;
	};
	// 81 Set Animation DEST [PLC_DEST] R DataA
	if (where === 9){
		document.getElementById('R3_SCD_EDIT_81_dataA').value = REALTIME_R_Pos;
	};
	// 68 Set Item 4P [ITEM_AOT_SET_4P]
	if (where === 10){
		document.getElementById('R3_SCD_EDIT_68_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_68_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_68_posZ').value = REALTIME_Z_Pos;
		document.getElementById('R3_SCD_EDIT_68_posR').value = REALTIME_R_Pos;
	};
	// 7D Set Enemy / NPC [EM_SET]
	if (where === 11){
		document.getElementById('R3_SCD_EDIT_7d_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_7d_posY').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_7d_posZ').value = REALTIME_Z_Pos;
		document.getElementById('R3_SCD_EDIT_7d_posR').value = REALTIME_R_Pos;
	};
	// 63 Set Interactive Object [AOT_SET]
	if (where === 12){
		document.getElementById('R3_SCD_EDIT_63_posX').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_63_posY').value = REALTIME_Y_Pos;
	};
	// 7F Set 3D Object [OM_SET] - Object Position
	if (where === 13){
		document.getElementById('R3_SCD_EDIT_7f_xPos').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_7f_yPos').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_7f_zPos').value = REALTIME_Z_Pos;
	};
	// 7F Set 3D Object [OM_SET] - Object Direction
	if (where === 14){
		document.getElementById('R3_SCD_EDIT_7f_xDir').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_7f_yDir').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_7f_zDir').value = REALTIME_Z_Pos;
	};
	// 7F Set 3D Object [OM_SET] - Colission Position
	if (where === 15){
		document.getElementById('R3_SCD_EDIT_7f_xColPos').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_7f_yColPos').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_7f_zColPos').value = REALTIME_Z_Pos;
	};
	// 7F Set 3D Object [OM_SET] - Colission Direction
	if (where === 16){
		document.getElementById('R3_SCD_EDIT_7f_xColDir').value = REALTIME_X_Pos;
		document.getElementById('R3_SCD_EDIT_7f_yColDir').value = REALTIME_Y_Pos;
		document.getElementById('R3_SCD_EDIT_7f_zColDir').value = REALTIME_Z_Pos;
	};
	R3_SCD_FUNCTIONEDIT_showUsePlayerPos(1);
};
// Seek item by opcode
function R3_SCD_EDIT_FUNCTION_seekItem(id){
	var c = 0, seekItem = document.getElementById('R3_SCD_EDIT_' + id + '_itemSeek').value, tempCheck = seekItem, itemCheck;
	R3_HEX_FORMAT_EXCLUDE.forEach(function(cItem){
		tempCheck = tempCheck.replace(RegExp(cItem, 'gi'), '');
	});
	if (seekItem.length === 2){
		document.getElementById('R3_SCD_EDIT_' + id + '_itemSeek').value = '';
		itemCheck = DATABASE_ITEM[seekItem];
		if (itemCheck !== undefined){
			document.getElementById('R3_SCD_EDIT_' + id + '_item').value = seekItem;
			R3_SCD_FUNCTIONEDIT_updateItemPreview('R3_SCD_EDIT_' + id + '_item', 'R3_SCD_EDIT_' + id + '_itemIconPrev');
		} else {
			document.getElementById('R3_SCD_EDIT_' + id + '_itemIconPrev').src = 'img/items/details/87.png';
		};
	};
};
// Set Animation DEST [PLC_DEST] Change Form
function R3_SCD_EDIT_FUNCTION_PLC_DEST(){
	try {
		document.getElementById('R3_SCD_EDIT_81_extraDiv').innerHTML = '';
		var animType = document.getElementById('R3_SCD_EDIT_81_animation').value,
			dataLabelA = R3_SCD_PLC_DEST_ANIMATIONS[animType][1],
			dataLabelB = R3_SCD_PLC_DEST_ANIMATIONS[animType][2],
			dataExtraEdit = R3_SCD_PLC_DEST_ANIMATIONS[animType][3];
		document.getElementById('R3_SCD_EDIT_81_labelDataA').innerHTML = dataLabelA;
		document.getElementById('R3_SCD_EDIT_81_labelDataB').innerHTML = dataLabelB;
		document.getElementById('R3_SCD_EDIT_81_extraDiv').innerHTML = dataExtraEdit;
	} catch (err) {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to open edit form! <br>Reason: ' + err + ' <br>(Probably this is happening due this animation is not implemented yet!)');
		R3_SYSTEM_ALERT('WARN: Unable to open edit form!\nReason: ' + err + '\n\nProbably this is happening due this animation is not implemented on R3ditor V2 Database!');
		setTimeout(function(){
			R3_SCD_cancelFunctionEdit(true);
		}, 100);
	};
};
// Check function length generator
function R3_SCD_FUNCTION_CHECK_LENGTH_GENERATOR(outputId){
	if (outputId !== undefined){
		var nFunctionHex, nFunction, TEMP_HTML = '', c = R3_SCD_CURRENT_FUNCTION, tFunctions = (parseInt(document.getElementById('R3_SCD_EDIT_' + outputId + '_length').value) + c);
		while (c < tFunctions){
			nFunction = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][c];
			if (nFunction !== undefined){
				nFunctionHex = nFunction.slice(0, 2);
				TEMP_HTML = TEMP_HTML + '<div class="R3_SCD_EDIT_DEMO_NEXTFN R3_SCD_function_' + R3_SCD_DATABASE[nFunctionHex][2] + ' monospace"><div class="R3_SCD_INSERT_LBL_FIX">' + R3_SCD_DATABASE[nFunctionHex][1] + '</div></div>';
			} else {
				TEMP_HTML = TEMP_HTML + '<div class="R3_SCD_EDIT_DEMO_NEXTFN R3_SCD_function_14 monospace"><div class="R3_SCD_INSERT_LBL_FIX">Unknown Function (Out of bounds!)</div></div>';
			};
			c++;
		};
		document.getElementById('R3_SCD_EDIT_' + outputId + '_fnInside').innerHTML = TEMP_HTML;
	};
};
// Check Function length OG
function R3_SCD_FUNCTION_READ_CHECK_LENGTH(hex, start){
	if (hex !== undefined && start !== undefined){
		// console.info(hex.toUpperCase() + ' - ' + start);
		var counter = 0, fProcess = false, hexTemp = '0000', tempCounter = 0;

		while (fProcess !== true){
			if (hexTemp !== hex){
				var cFunctionHex = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][start];
				if (cFunctionHex !== undefined){
					var cOpcode = cFunctionHex.slice(0, 2),
						cLength = R3_SCD_DATABASE[cOpcode][0];
					tempCounter = parseInt(tempCounter + cLength);
					hexTemp = R3_parseEndian(R3_fixVars(tempCounter.toString(16), 4));
					start++;
					counter++;
				} else {
					// Error
					fProcess = true;
				};
			} else {
				// OK
				fProcess = true;
			}
		};

		return counter;
	};
};
/*
	Check function length after itself
*/
function R3_SCD_FUNCTION_READ_CHECK_LENGTH_SPECIAL(hex, start, parentOpcode){
	if (hex !== undefined && start !== undefined && parentOpcode !== undefined){
		var cFunction, cOpcode, cStart = parseInt(start + 1), desire = (parseInt(R3_parseEndian(hex), 16) * 2), counter = 0, current = 0, done = false;
		while (done === false){
			cStart++;
			counter++;
			cFunction = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][cStart];
			if (cFunction !== undefined){
				cOpcode = cFunction.slice(0, 2),
				current = parseInt(current + (R3_SCD_DATABASE[cOpcode][0] * 2));
				if (current === desire || current > desire){
					done = true;
				};
			} else {
				done = true;
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to get function check length! (Special) <br>Parent Opcode: ' + parentOpcode.toUpperCase() + ' (' + R3_SCD_DATABASE[parentOpcode][1] + ') Request: ' + hex.toUpperCase() + ' (' + desire + ')');
			};
		};
		return counter;
	};
};
/*
	Generate Template
	REWORK THIS THING
*/
function R3_SCD_FUNCTION_CHECK_LENGTH_GENERATOR_SPECIAL(outputId){
	if (outputId !== undefined){
		var nFunction, nFunctionHex, TEMP_HTML = '', c = (parseInt(document.getElementById('R3_SCD_editFunction_pos').value) + 1), tFunctions = (parseInt(document.getElementById('R3_SCD_EDIT_' + outputId + '_length').value) + c);
		while (c < tFunctions){
			nFunction = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][c];
			if (nFunction !== undefined){
				nFunctionHex = nFunction.slice(0, 2);
				TEMP_HTML = TEMP_HTML + '<div class="R3_SCD_EDIT_DEMO_NEXTFN R3_SCD_function_' + R3_SCD_DATABASE[nFunctionHex][2] + ' monospace"><div class="R3_SCD_INSERT_LBL_FIX">' + R3_SCD_DATABASE[nFunctionHex][1] + '</div></div>';
			} else {
				TEMP_HTML = TEMP_HTML + '<div class="R3_SCD_EDIT_DEMO_NEXTFN R3_SCD_function_14 monospace"><div class="R3_SCD_INSERT_LBL_FIX">Unknown Function (Out of bounds!)</div></div>';
			};
			c++;
		};
		document.getElementById('R3_SCD_EDIT_' + outputId + '_fnInside').innerHTML = TEMP_HTML;
	};
};
// Generate Length Special
function R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH_SPECIAL(source){
	if (source !== undefined){
		var cMax = ((R3_SCD_CURRENT_FUNCTION + 1) + parseInt(document.getElementById('R3_SCD_EDIT_' + source + '_length').value)),
			cFunction = (R3_SCD_CURRENT_FUNCTION + 1), tempLength = 0;
		while (cFunction < cMax){
			var cOpcode = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][cFunction].slice(0, 2),
				tempLength = (tempLength + parseInt(R3_SCD_DATABASE[cOpcode][0] * 2));
			cFunction++;
		};
		return R3_parseEndian(R3_fixVars((tempLength / 2).toString(16), 4));
	};
};
// Update RGB
function R3_SCD_FUNCTION_UPDATE_RGB(cOpcode){
	if (cOpcode !== undefined){
		var cR = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorR').value),
			cG = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorG').value),
			cB = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorB').value),
			finalR, finalG, finalB;
		if (cR > 255){
			cR = 255;
			document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorR').value = 255;
		};
		if (cG > 255){
			cG = 255;
			document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorG').value = 255;
		};
		if (cB > 255){
			cB = 255;
			document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorB').value = 255;
		};
		// Update Ranges
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorR_range').value = cR;
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorG_range').value = cG;
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorB_range').value = cB;
		// End
		finalR = R3_fixVars(parseInt(cR).toString(16), 2);
		finalG = R3_fixVars(parseInt(cG).toString(16), 2);
		finalB = R3_fixVars(parseInt(cB).toString(16), 2);
		if (document.getElementById('R3_SCD_EDIT_' + cOpcode + '_rgbDivPreview') !== null){
			TMS.css('R3_SCD_EDIT_' + cOpcode + '_rgbDivPreview', {'background-color': '#' + finalR + finalG + finalB});
		};
	};
};
// Update Range RGB
function R3_SCD_FUNCTION_UPDATE_RANGE_RGB(cOpcode){
	if (cOpcode !== undefined){
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorR').value = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorR_range').value);
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorG').value = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorG_range').value);
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorB').value = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorB_range').value);
		R3_SCD_FUNCTION_UPDATE_RGB(cOpcode);
	};
};
// Update CMY
function R3_SCD_FUNCTION_UPDATE_CMY(cOpcode){
	if (cOpcode !== undefined){
		var cC = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorC').value),
			cM = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorM').value),
			cY = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorY').value),
			finalC, finalM, finalY;
		if (cC > 255){
			cC = 255;
			document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorC').value = 255;
		};
		if (cM > 255){
			cM = 255;
			document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorM').value = 255;
		};
		if (cY > 255){
			cY = 255;
			document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorY').value = 255;
		};
		// Update Ranges
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorC_range').value = cC;
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorM_range').value = cM;
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorY_range').value = cY;
		/*
			End
			Sadly i dunno how to convert CMY to RGB or something like so... no support for it now. :( #SadFace
		*/
	};
};
// Update Range CMY
function R3_SCD_FUNCTION_UPDATE_RANGE_CMY(cOpcode){
	if (cOpcode !== undefined){
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorC').value = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorC_range').value);
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorM').value = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorM_range').value);
		document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorY').value = parseInt(document.getElementById('R3_SCD_EDIT_' + cOpcode + '_colorY_range').value);
		R3_SCD_FUNCTION_UPDATE_CMY(cOpcode);
	};
};
// Show [GO_SUB] Script Preview
function R3_SCD_FUNCTION_GO_SUB_PREVIEW(){
	if (SCD_arquivoBruto !== undefined){
		var TEMP_HTML = '', scriptId = document.getElementById('R3_SCD_EDIT_19_scriptId').value;
		document.getElementById('R3_SCD_EDIT_19_LBL_scriptId').innerHTML = scriptId;
		if (R3_SCD_SCRIPTS_LIST[scriptId] !== undefined){
			document.getElementById('R3_SCD_EDIT_19_scriptPreview').innerHTML = '';
			R3_SCD_SCRIPTS_LIST[scriptId].forEach(function(cItem, cIndex){
				var cFunction = cItem.slice(0, 2),
					fName = R3_SCD_DATABASE[cFunction][1],
					fColor = R3_SCD_DATABASE[cFunction][2],
					fTitle = R3_SCD_INFO_DATABASE[cFunction];
				TEMP_HTML = TEMP_HTML + '<div class="R3_SCD_EDIT_DEMO_NEXTFN R3_SCD_function_' + fColor + ' monospace" title="' + fTitle + '"><div class="R3_SCD_INSERT_LBL_FIX">' + fName + '</div></div>';
			});
			document.getElementById('R3_SCD_EDIT_19_scriptPreview').innerHTML = TEMP_HTML;
		} else {
			document.getElementById('R3_SCD_EDIT_19_scriptPreview').innerHTML = '<br><u>Caution</u> - This script are not available!';
		};
	};
};
// Update PLC_NECK labels
function R3_SCD_EDIT_FUNCTION_PLC_NECK_updateLabels(){
	var PLC_animType = document.getElementById('R3_SCD_EDIT_82_type').value;
	document.getElementById('R3_SCD_EDIT_82_lbl_DATA_0').innerHTML = R3_SCD_PLC_NECK_ANIMATIONS[PLC_animType][1];
	document.getElementById('R3_SCD_EDIT_82_lbl_DATA_1').innerHTML = R3_SCD_PLC_NECK_ANIMATIONS[PLC_animType][2];
	document.getElementById('R3_SCD_EDIT_82_lbl_DATA_2').innerHTML = R3_SCD_PLC_NECK_ANIMATIONS[PLC_animType][3];
	document.getElementById('R3_SCD_EDIT_82_lbl_DATA_3').innerHTML = R3_SCD_PLC_NECK_ANIMATIONS[PLC_animType][4];
};
// Recompile SET_TIMER countdown to hex
function R3_SCD_EDIT_FUNCTION_SET_TIMER_CONVERT(){
	var editMode = document.getElementById('R3_SCD_EDIT_1e_target').value;
	if (editMode === '29'){
		var c0x00, c0x01 = 0,
			HH = parseInt(R3_fixVars(document.getElementById('R3_SCD_EDIT_1e_timeHH').value, 2)),
			MM = parseInt(R3_fixVars(document.getElementById('R3_SCD_EDIT_1e_timeMM').value, 2)),
			SS = parseInt(R3_fixVars(document.getElementById('R3_SCD_EDIT_1e_timeSS').value, 2));
		if (HH > 18){
			HH = 18;
			document.getElementById('R3_SCD_EDIT_1e_timeHH').value = HH;
		};
		if (MM > 59){
			MM = 59;
			document.getElementById('R3_SCD_EDIT_1e_timeMM').value = MM;
		};
		if (SS > 59){
			SS = 59;
			document.getElementById('R3_SCD_EDIT_1e_timeSS').value = SS;
		};
		var cH = (HH * 60 * 60), cM = (MM * 60), totalSec = parseInt(SS + cM + cH);
		while (totalSec > 255){
			totalSec = parseInt(totalSec - 256);
			c0x01++;
		};
		c0x00 = totalSec;
		// End
		return R3_fixVars(parseInt(c0x00).toString(16), 2).toUpperCase() + R3_fixVars(parseInt(c0x01).toString(16), 2).toUpperCase();
	} else {
		var initialIntValue = document.getElementById('R3_SCD_EDIT_1e_varInt').value;
		if (initialIntValue === '' || parseInt(initialIntValue) === NaN || parseInt(initialIntValue) < 0){
			initialIntValue = 0;
			document.getElementById('R3_SCD_EDIT_1e_varInt').value = initialIntValue;
		};
		if (initialIntValue > 32767){
			initialIntValue = 32767;
			document.getElementById('R3_SCD_EDIT_1e_varInt').value = initialIntValue;
		};
		var c0x00, c0x01 = 0;
		while (initialIntValue > 255){
			initialIntValue = parseInt(initialIntValue - 256);
			c0x01++;
		};
		c0x00 = initialIntValue;
		// End
		return R3_fixVars(parseInt(c0x00).toString(16), 2).toUpperCase() + R3_fixVars(parseInt(c0x01).toString(16), 2).toUpperCase();
	};
};
// Search hex for Set Event Value [SET]
function R3_SCD_FUNCTION_SEARCH_SETVAR(){
	if (SCD_arquivoBruto !== undefined){
		var hexSearch = R3_cleanHex(document.getElementById('R3_SCD_EDIT_4d_varSearch').value);
		document.getElementById('R3_SCD_EDIT_4d_varSearch').value = hexSearch;
		if (hexSearch.length > 1){
			document.getElementById('R3_SCD_EDIT_4d_varSearch').value = '';
			if (R3_SCD_SET_VALUES[hexSearch] !== undefined){
				document.getElementById('R3_SCD_EDIT_4d_var').value = hexSearch;
			};
		};
	};
};
// Color Picker for Set LIT Color [LIGHT_COLOR_SET]
function R3_SCD_FUNCTION_LIT_COLOR_PICKER(opcodeId){
	if (opcodeId !== undefined){
		var colorR = document.getElementById('R3_SCD_EDIT_' + opcodeId + '_colorR').value;
			colorG = document.getElementById('R3_SCD_EDIT_' + opcodeId + '_colorG').value;
			colorB = document.getElementById('R3_SCD_EDIT_' + opcodeId + '_colorB').value;
		R3_SYS_COLOR_PICKER([colorR, colorG, colorB], false, function(nColor){
			document.getElementById('R3_SCD_EDIT_' + opcodeId + '_colorR').value = nColor[0];
			document.getElementById('R3_SCD_EDIT_' + opcodeId + '_colorG').value = nColor[1];
			document.getElementById('R3_SCD_EDIT_' + opcodeId + '_colorB').value = nColor[2];
			R3_SCD_FUNCTION_UPDATE_RGB(opcodeId);
		});
	};
};
// Update camera preview in a few opcodes
function R3_SCD_FUNCTION_CAM_PREVIEW(domId, imgId){
	if (R3_RDT_mapName !== '' && R3_WEBMODE === false){
		var camId = R3_fixVars(parseInt(document.getElementById(domId).value).toString(16), 2).toUpperCase(), imgFix = '';
			fPath = R3_MOD_PATH + '/DATA_A/BSS/' + R3_RDT_mapName + camId.toUpperCase() + '.JPG';
		if (APP_FS.existsSync(fPath) === true){
			document.getElementById(imgId).src = fPath;
		} else {
			fPath = 'img/404.png';
			if (process.platform !== 'win32'){
				imgFix = 'file://';
			};
			document.getElementById(imgId).src = imgFix + fPath;
		};
		if (fPath !== 'img/404.png'){
			TMS.css('R3_SCD_editForm_bg_image', {'display': 'inline', 'background-image': 'url(' + fPath + ')'});
		} else {
			TMS.css('R3_SCD_editForm_bg_image', {'display': 'inline', 'background-image': 'linear-gradient(0deg, #0000, #0000)'});
		};
		TMS.css('R3_SCD_CAMERA_PREVIEW', {'display': 'inline'});
	} else {
		TMS.css('R3_SCD_CAMERA_PREVIEW', {'display': 'none'});
	};
};
// Update / Show Msg Preview on Display Message [MESSAGE_ON] / Set Interactive Object [AOT_SET]
function R3_SCD_FUNCION_displayMsgPreview(messageId){
	if (R3_SCD_IS_EDITING === true){
		var msgFinalText = 'No Preview available!', msgId;
		if (RDT_arquivoBruto !== undefined){
			if (messageId !== undefined){
				msgId = parseInt(messageId, 16);
			} else {
				msgId = parseInt(document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_id').value, 16);
			};
			if (msgId === NaN){
				msgId = 0;
			};
			// Temp fix
			if (R3_SCD_currentOpcode === '5b' && msgId > 255){
				msgId = 255;
				document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_id').value = 255; 
			};
			if (R3_MSG_RDT_MESSAGES_PREVIEW[msgId] !== undefined){
				msgFinalText = R3_MSG_RDT_MESSAGES_PREVIEW[msgId];
			};
		};
		document.getElementById('R3_SCD_EDIT_' + R3_SCD_currentOpcode + '_msgPrev').innerHTML = msgFinalText.replace(RegExp('[(]Line Break[)]<br>', 'gi'), '<br>');
	};
};
// Update Run Interactive Object [AOT_ON] preview
function R3_SCD_FUNCTION_updateAotOnPreview(){
	var txtInput = document.getElementById('R3_SCD_EDIT_66_id').value,
		aotId = 'No preview available';
	if (txtInput.length > 1 && R3_SCD_ID_LIST_ENTRIES[R3_fixVars(txtInput, 2).toLowerCase()] !== undefined){
		aotId = R3_SCD_ID_LIST_ENTRIES[R3_fixVars(txtInput, 2).toLowerCase()][2];
	};
	document.getElementById('R3_SCD_EDIT_66_lblTarget').innerHTML = aotId;
};
/*
	Get valid ID for functions
	This function will return a free ID slot for functions like doors, items and objects!

	Mode:
	0 = General Functions
	1 = Set 3D Object [OM_SET]
*/
function R3_SCD_getFreeIdForFunction(mode){
	if (SCD_arquivoBruto !== undefined){
		var c = 0, cId, canFinish = false, seekObject, freeSlot;
		if (mode === 0 || mode === undefined){
			seekObject = R3_SCD_ID_LIST_ENTRIES;
		};
		if (mode === 1){
			seekObject = R3_SCD_ID_OM_SET_ENTRIES;
		};
		// Start
		while (canFinish === false){
			cId = R3_fixVars(c, 2);
			if (seekObject[cId] !== undefined){
				c++;
			} else {
				canFinish = true;
			};
		};
		return cId;
	};
};
/*
	Utility SCD Functions
*/
/*
	Get door data from Set Door [DOOR_AOT_SET] and Set Door 4P [DOOR_AOT_SET_4P]

	Mode: 0 = Set Door [DOOR_AOT_SET]
		  1 = Set Door 4P [DOOR_AOT_SET_4P]
	sLocation: Target Script
	sFunction: Target Function
*/
function R3_SCD_getDoorParams(mode, sLocation, sFunction){
	if (SCD_arquivoBruto !== undefined){
		var decDb = R3_SCD_DECOMPILER_DATABASE[61], cFunction = R3_SCD_SCRIPTS_LIST[sLocation][sFunction];
		if (mode !== 0){
			decDb = R3_SCD_DECOMPILER_DATABASE[62];
		};
		var DOOR_xPos 	 = cFunction.slice(decDb.nextXpos[0],  decDb.nextXpos[1]),
			DOOR_yPos 	 = cFunction.slice(decDb.nextYpos[0],  decDb.nextYpos[1]),
			DOOR_zPos 	 = cFunction.slice(decDb.nextZpos[0],  decDb.nextZpos[1]),
			DOOR_rPos 	 = cFunction.slice(decDb.nextRpos[0],  decDb.nextRpos[1]),
			DOOR_zIndex  = cFunction.slice(decDb.zIndex[0],    decDb.zIndex[1]),
			DOOR_stage 	 = cFunction.slice(decDb.nextStage[0], decDb.nextStage[1]),
			DOOR_rNumber = cFunction.slice(decDb.nextRoom[0],  decDb.nextRoom[1]),
			DOOR_nCam 	 = cFunction.slice(decDb.nextCam[0],   decDb.nextCam[1]),
			nFile = 'R' + (parseInt(DOOR_stage) + 1) + R3_fixVars(DOOR_rNumber, 2).toUpperCase();
		return [nFile, DOOR_xPos, DOOR_yPos, DOOR_zPos, DOOR_rPos, DOOR_zIndex, DOOR_stage, DOOR_rNumber, DOOR_nCam, R3_RDT_mapName];
	};
};
/*
	Danger messages
*/
function R3_SCD_WARN(msg, txtVar){
	if (msg === 0){
		R3_DESIGN_MINIWINDOW_OPEN(0);
		R3_SYSTEM_LOG('separator');
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (SCD) Unable to jump to script ' + txtVar + ' because it does not exist! <br><u>WARNING</u>: If you are seeing this message, this <i>(probably)</i> means this code is broken! ' + 
							  '<br>Create script ' + txtVar + ' before saving this code on RDT!');
	};
};
/*
	SCD JS Compiler
	Make JS code to SCD Opcodes by doing magic

	Remove js comments from string - original source: 
	https://stackoverflow.com/questions/37051797/remove-comments-from-string-with-javascript-using-javascript
*/
function R3_SCD_JS_START_COMPILER(){
	try {
		var previousCode, cLine, codeCompiled, cUpperCase, canProcessFunction = true, canFinalize = true, errorReason = '', finalCodeArray = [], codeList = [], 
			textScript = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').split('\n').forEach(function(codeLine){
				cLine = codeLine.replace(new RegExp('	', 'gi'), '');
				if (cLine !== ''){
					codeList.push(cLine);
				};
			});
		if (R3_SETTINGS.SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE === true){
			previousCode = document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value;
		};
		/*
			Start compiler
		*/
		R3_SYSTEM_LOG('separator');
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Start SCD Compiler...');
		/*
			Code Checks
			1 / 2
		*/
		// Closing function - [EVT_END]
		if (codeList[parseInt(codeList.length - 1)] !== 'EVT_END();'){
			canFinalize = false;
			errorReason = errorReason + '\n\nYou need to insert End Script function [EVT_END();] at the end to close this script!';
		};
		// Check if can start compiling
		if (canFinalize === true){
			codeList.forEach(function(cFunction){
				cUpperCase = cFunction.toUpperCase();
				// Skipping variables
				INCLUDE_SCD_CODE_VARIABLE.forEach(function(cItem){
					if (cFunction.indexOf(cItem) !== -1){
						canProcessFunction = false;
						R3_SYSTEM_LOG('separator');
						R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (Compiler) You can\'t declare variables using \"var\", \"let\" or \"const\"! <br>Use internal variable functions to store data instead.');
						R3_SYSTEM_LOG('separator');
					};
				});
				// End
				if (canProcessFunction === true){
					console.info(cFunction.replace(');', ')'));
					finalCodeArray.push(Function('"use strict";return (R3_JS_COMPILER_' + cFunction.replace(');', ')') + ')')());
				};
			});
		};
		/*
			Code Checks
			2 / 2
		*/
		// If script are empty
		if (finalCodeArray === []){
			canFinalize = false;
			errorReason = errorReason + '\n\nThe script is empty!\nYou at least need to insert \"EVT_END();\" to compile properly!';
		};
		// Check if last function is End Script [EVT_END]
		if (finalCodeArray[(finalCodeArray.length - 1)] !== '0100'){
			canFinalize = false;
			errorReason = errorReason + '\n\nThe last function on script must be \"EVT_END();\"';
		};
		/*
			End
		*/
		if (canFinalize === true){
			// console.info(finalCodeArray);
			R3_SYSTEM_LOG('separator');
			codeCompiled = R3_unsolveHEX(finalCodeArray.toString().replace(new RegExp(',', 'gi'), ''));
			R3_SYSTEM_ALERT('INFO: The JS compiler run sucessfully!');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: The JS compiler run sucessfully! <br>Compiled Hex: <font class="user-can-select">' + codeCompiled + '</font>');
			R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT] = finalCodeArray;
			R3_SYSTEM_LOG('separator');
			// Fix control hold
			R3_KEYPRESS_releaseKeys();
			// Compile using final compiler!
			R3_SCD_COMPILE(3);
			if (R3_SETTINGS.SETTINGS_SCD_JS_COMPILER_KEEP_ORIGINAL_FILE === true){
				setTimeout(function(){
					document.getElementById('R3_SCD_CODE_EDITOR_TEXTAREA').value = previousCode;
				}, 20);
			};
		} else {
			R3_SYSTEM_LOG('separator');
			R3_SYSTEM_ALERT('ERROR: Unable to compile SCD Script!\nReason: (Compiler Error) ' + errorReason);
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to compile SCD Script! <br>Reason: (Compiler Error) ' + errorReason);
		};
	} catch (errTry){
		R3_SYSTEM_LOG('separator');
		R3_SYSTEM_ALERT('ERROR: Unable to compile SCD Script!\nReason: (R3V2 Internal Error) ' + errTry);
		R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to compile SCD Script! <br>Reason: (Internal Error) ' + errTry);
	};
};
/*
	SCD Check Length Generator
	This function will update all conditional checks inside current script
*/
function R3_SCD_COMPILER_checkConditionalOpcodes(mode){
	if (SCD_arquivoBruto !== undefined){
		var c = 0, makeFunctionLength, cOpcodeList = [], cFunction, cOpcode, endList = [], checkList = [], processList, cScript = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT];
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (SCD) Generating conditional opcode list...');
		while (c < cScript.length){
			cFunction = cScript[c];
			cOpcode   = cFunction.slice(0, 2);
			cOpcodeList.push(cOpcode);
			// If opcode are a check function
			if (R3_SCD_CHECK_DATABASE.indexOf(cOpcode) !== -1){
				checkList.push(c);
			};
			// End functions
			if (R3_SCD_CHECK_CLOSING.indexOf(cOpcode) !== -1){
				endList.push(c);
			};
			c++;
		};
		// Start the fix
		if (checkList !== []){
			c = 0;
			cFunction = cOpcode = undefined;
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (SCD) Updating check functions length...');
			processList = checkList.reverse();
			// This is where things goes nuts
			makeFunctionLength = function(fPosition){
				var lengthHex = '0000', sliceList = cOpcodeList.slice(fPosition);
				cFunction = cScript[fPosition];
				cOpcode = cOpcodeList[fPosition];
				/*
					Here is where all checks will be fixed!
				*/
				// If [IF]
				if (cOpcode === '06'){
					var elsePos = sliceList.indexOf('07'),
						endPos  = sliceList.indexOf('08');
					// Match to End Script [EVT_END] 
					if (elsePos === -1 && endPos === -1){
						lengthHex = R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH(cOpcode, '01', fPosition, true);
					} else {
						// Close on Else [ELSE]
						if (endPos < elsePos){
							lengthHex = R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH(cOpcode, '07', fPosition, true);
						};
						// Close on End If [END_IF]
						if (elsePos < endPos){
							lengthHex = R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH(cOpcode, '08', fPosition);
						};
					};
					// End
					R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][fPosition] = '0600' + lengthHex;
				};
			};
			// Fix conditional functions
			while (c < processList.length){
				makeFunctionLength(processList[c]);
				c++;
			};
		};
		/*
			Start final compiler
		*/
		if (R3_SETTINGS.SETTINGS_SCD_EDITOR_MODE === 0){
			R3_SCD_COMPILE(mode);
		};
	};
};
/*
	Generate Check Function Length
	REWORK - THIS IS UNSTABLE
*/
function R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH(source, endOpcode, cIndex, finishBefore){
	if (source !== undefined){
		// cIndex = (parseInt(document.getElementById('R3_SCD_editFunction_pos').value) - 1);
		var tempLength = 0, fProcess = false, finalHex = '0000';
		while (fProcess === false){
			var cFunction = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][cIndex],
				nFunction = R3_SCD_SCRIPTS_LIST[R3_SCD_CURRENT_SCRIPT][(cIndex + 1)];
			if (cFunction !== undefined){
				var nOpcode, endBefore = false, cOpcode = cFunction.slice(0, 2),
					cLength = R3_SCD_DATABASE[cOpcode][0];
				if (nFunction !== undefined){
					nOpcode = nFunction.slice(0, 2);
				};
				// Check if must stop before requested opcode
				if (finishBefore === true && nOpcode === endOpcode){
					endBefore = true;
				};
				tempLength = (tempLength + cLength);
				finalHex = R3_parseEndian(R3_fixVars(tempLength.toString(16), 4));
				cIndex++;
				// Finish this shit
				if (cOpcode === endOpcode || endBefore === true){
					fProcess = true;
				};
			} else {
				R3_DESIGN_CRITIAL_ERROR('R3_SCD_FUNCTION_GENERATE_CHECK_LENGTH failed since current function are undefined!');
				// Error
				fProcess = true;
			};
		};
		return finalHex;
	};
};
/*
	SCD Final Compiler

	Modes:
	0: Save
	1: Save As
	2: Inject to RDT and GOTO RDT
	3: Just Compile
	4: Compile and inject to RDT
*/
function R3_SCD_COMPILE(mode){
	if (Object.keys(R3_SCD_SCRIPTS_LIST).length !== 0){
		var cScript = pointersLength = 0, d = 1, tempHex = pHex = '', FINAL_HEX, gotoScript = R3_SCD_CURRENT_SCRIPT, fPath = R3_SCD_fileName;
		if (mode === undefined){
			mode = 0;
		};
		// Generate Pointers
		R3_SCD_POINTERS.forEach(function(cPointer){
			tempHex = tempHex + R3_parseEndian(cPointer);
		});
		pointersLength = tempHex.length;
		R3_SCD_POINTERS[0] = R3_parseEndian(R3_fixVars((pointersLength / 2).toString(16), 4));
		// Calc Script Length
		tempHex = '';
		while (d < R3_SCD_POINTERS.length){
			tempHex = R3_SCD_SCRIPTS_LIST[cScript].toString().replace(RegExp(',', 'gi'), '');
			pointersLength = (tempHex.length + pointersLength);
			R3_SCD_POINTERS[d] = R3_parseEndian(R3_fixVars((pointersLength / 2).toString(16), 4));
			cScript++;
			d++;
		};
		tempHex = '';
		pHex = R3_SCD_POINTERS.toString().replace(RegExp(',', 'gi'), '');
		// Now, let's add the scripts
		Object.keys(R3_SCD_SCRIPTS_LIST).forEach(function(scr, cIndex){
			tempHex = tempHex + R3_SCD_SCRIPTS_LIST[cIndex].toString().replace(RegExp(',', 'gi'), '');
		});
		FINAL_HEX = pHex + tempHex;
		// Save / Inject
		try {
			// Save
			if (mode === 0){
				if (R3_SCD_path === ''){
					mode = 1;
				} else {
					APP_FS.writeFileSync(R3_SCD_path, FINAL_HEX, 'hex');
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Save Successful! File: <font class="user-can-select">' + R3_SCD_path + '</font>');
				};
			};
			// Save As
			if (mode === 1){
				R3_FILE_SAVE(R3_SCD_fileName + '.SCD', FINAL_HEX, 'hex', '.SCD', function(newLoc){
					R3_SCD_path = newLoc;
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Save Successful! File: <font class="user-can-select">' + R3_SCD_path + '</font>');
				});
			};
			// Inject to RDT and GOTO RDT Menu
			if (mode === 2){
				R3_RDT_RAWSECTION_SCD = FINAL_HEX;
				R3_SHOW_MENU(10);
			};
			// Just Compile
			if (mode === 3){
				if (R3_SETTINGS.SETTINGS_SCD_DECOMPILER_ENABLE_LOG === true){
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Updating SCD...');
				};
			};
			// Just Inject to RDT
			if (mode === 4){
				R3_RDT_RAWSECTION_SCD = FINAL_HEX;
			};
			/*
				End
			*/
			R3_DESIGN_CLEAN_SCD();
			R3_UTILS_VAR_CLEAN_SCD();
			// Set some variabled back again
			R3_SCD_fileName = fPath;
			SCD_arquivoBruto = FINAL_HEX;
			R3_SCD_START_DECOMPILER(FINAL_HEX);
			R3_SCD_displayScript(gotoScript);
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to Compile / Save SCD! <br>Reason: ' + err);
			alert('ERROR: Unable to Save / Recompile SCD!\nReason: ' + err);
		};
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: You need to open or create a new file beafore saving!');
	};
};