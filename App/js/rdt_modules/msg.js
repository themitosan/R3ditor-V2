/*
	*******************************************************************************
	R3ditor V2 - msg.js
	By TemmieHeartz

	This file is responsible for reading and writting text messages (MSG) data 
	extracted from RDT maps
	*******************************************************************************
*/
var R3_MSG_fPath,
	R3_MSG_tempHex,
	MSG_arquivoBruto, 
	R3_MSG_textMode = '', 
	R3_MSG_commands = {}, 
	R3_msgCurrentDatabase,
	R3_MSG_RDT_POINTERS = [],
	R3_MSG_RDT_MESSAGES = [],
	R3_MSG_totalCommands = 0,
	R3_MSG_IS_EDITING = false,
	R3_MSG_currentMessage = 0,
	R3_MSG_RDT_MESSAGES_PREVIEW = [],
	// MSG Color Vars
	R3_MSG_enableColorChange = false;
/*
	Functions
*/
// New File
function R3_MSG_NEW_FILE(){
	R3_UTILS_VAR_CLEAN();
	R3_UTILS_CLEANTOOLS();
	MSG_arquivoBruto = 'fa02fcfe00';
	R3_MSG_DECOMPILER_START(MSG_arquivoBruto);
	document.title = R3_SYSTEM.appTitle + ' - MSG Editor - File: Untitled.MSG';
};
// Load MSG File
function R3_MSG_LOADFILE(){
	R3_fileManager.loadFile('.msg', function(fPath){
		R3_UTILS_VAR_CLEAN();
		R3_UTILS_CLEANTOOLS();
		R3_MSG_startLoadMsg(fPath);
	});
};
// Start Loading MSG
function R3_MSG_startLoadMsg(fPath){
	R3_MSG_fPath = fPath;
	R3_fileManager.originalFilename = fPath;
	MSG_arquivoBruto = R3_MODULES.fs.readFileSync(fPath, 'hex');
	var fileName, loaderInterval = setInterval(function(){
		if (MSG_arquivoBruto !== undefined && MSG_arquivoBruto !== ''){
			if (R3_SYSTEM.web.isBrowser === false){
				fileName = R3_tools.getFileName(fPath);
			} else {
				fileName = R3_tools.getFileName(fPath.name);
			};
			document.title = R3_SYSTEM.appTitle + ' - MSG Editor - File: ' + fileName + '.MSG';
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (MSG) Loading file: <font class="user-can-select">' + fPath + '</font>');
			R3_MSG_DECOMPILER_START(MSG_arquivoBruto);
			// End
			R3_LATEST_SET_FILE(fileName + '.MSG', 1, R3_fileManager.originalFilename);
			clearInterval(loaderInterval);
		} else {
			if (R3_SYSTEM.web.isBrowser === true){
				MSG_arquivoBruto = R3_SYSTEM.web.FILE_BRIDGE;
			};
		};
	}, 100);
};
// Decompile MSG From RDT
function R3_MSG_decompileRDT(openEditor){
	if (RDT_arquivoBruto !== undefined && R3_RDT_rawSections.RAWSECTION_MSG !== undefined){
		R3_DESIGN_CLEAN_MSG();
		R3_UTILS_VAR_CLEAN_MSG();
		if (R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE !== 3){
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: MSG Read mode was changed from Resident Evil ' + R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE + ' to Resident Evil 3!');
			R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE = 3;
			R3_SAVE_SETTINGS(false);
		};
		var pointersLength = (parseInt(R3_tools.parseEndian(R3_RDT_rawSections.RAWSECTION_MSG.slice(0, 2)), 16) * 2),
			R3_MSG_RDT_POINTERS_TEMP = R3_RDT_rawSections.RAWSECTION_MSG.slice(0, pointersLength).match(/.{4,4}/g).forEach(function(tmpPointer){
			R3_MSG_RDT_POINTERS.push(R3_tools.parseEndian(tmpPointer));
		});
		// Push all messages to MSG List
		R3_MSG_RDT_POINTERS.forEach(function(cItem, cIndex){
			R3_MSG_addToMSGList(cIndex, openEditor);
		});
		// End
		R3_MSG_currentMessage = 0;
		if (openEditor === true){
			R3_MSG_readMessage(0);
			R3_SHOW_MENU(7);
		};
	};
};
// GOTO MSG
function R3_MSG_GOTO_MESSAGE(){
	if (RDT_arquivoBruto !== undefined){
		var msgId, askMessage = R3_SYSTEM.prompt('Please, insert the message you want to jump:');
		if (askMessage !== null && askMessage !== ''){
			msgId = parseInt(askMessage);
			if (msgId !== NaN && msgId > 0){
				R3_MSG_readMessage(parseInt(msgId - 1));
			} else {
				R3_MSG_readMessage(0);
			};
		};
	};
};
// Read MSG From List
function R3_MSG_readMessage(msgId){
	if (R3_MSG_RDT_MESSAGES[msgId] !== undefined){
		document.getElementById('R3_MSG_EDIT_TEXTAREA').value = '';
		MSG_arquivoBruto = R3_MSG_RDT_MESSAGES[msgId];
		R3_MSG_DECOMPILER_START(MSG_arquivoBruto);
		R3_MSG_DESIGN_updateMsgList(msgId);
		R3_MSG_currentMessage = msgId;
		R3_MSG_updateLabels(msgId);
		document.getElementById('R3_MSG_EDIT_TEXTAREA').focus();
	};
};
// Add MSG ID to MSG List
function R3_MSG_addToMSGList(msgId, openEditor){
	if (msgId < R3_MSG_RDT_POINTERS.length){
		var tmpMsgRaw = R3_RDT_rawSections.RAWSECTION_MSG,
			pointersLength = (parseInt(R3_MSG_RDT_POINTERS[msgId], 16) * 2),
			msgStart = tmpMsgRaw.slice(pointersLength, tmpMsgRaw.length),
			msgFinal = msgStart.slice(0, (msgStart.indexOf('fe') + 4));
		// Add if Open editor is true
		if (openEditor === true){
			const HTML_TEMPLATE = '<div class="R3_SCRIPT_LIST_ITEM R3_SCRIPT_LIST_ITEM_NORMAL" id="R3_MSG_MESSAGE_ID_' + msgId + '">Message ' + parseInt(msgId + 1) +
							'<input type="button" class="BTN_R3CLASSIC R3_SCRIPT_LIST_ITEM_BTN" value="Load Message" onclick="R3_MSG_readMessage(' + msgId + ');"></div>';
			TMS.append('R3_MSG_SCRIPT_LISTS', HTML_TEMPLATE);
		};
		// End
		R3_MSG_RDT_MESSAGES.push(msgFinal);
	};
};
// Add / Remove Text Message
function R3_MSG_addMessage(){
	if (RDT_arquivoBruto !== undefined){
		R3_MSG_RDT_MESSAGES.push('fa02fcfe00');
		R3_MSG_RDT_POINTERS.push(R3_tools.fixVars((R3_RDT_rawSections.RAWSECTION_MSG.length / 2).toString(16), 4));
		R3_MSG_recompileWithPointers(1);
		R3_MSG_readMessage((R3_MSG_RDT_MESSAGES.length - 1));
	};
};
// Remove Message
function R3_MSG_removeMessage(){
	if (R3_MSG_currentMessage > 1){
		var tmpCurrentMsg = (R3_MSG_currentMessage - 1);
		R3_MSG_RDT_MESSAGES.splice(R3_MSG_currentMessage, 1);
		R3_MSG_RDT_POINTERS.splice(R3_MSG_currentMessage, 1);
		R3_MSG_recompileWithPointers(1);
		R3_MSG_readMessage(tmpCurrentMsg);
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: You can\'t delete this message!');
	};
};
/*
	Previous / Next Script

	0: Previous Messge
	1: Next Message
*/
function R3_MSG_SKIPSCRIPT(mode){
	if (RDT_arquivoBruto !== undefined && MSG_arquivoBruto !== undefined){
		var nextMsg = 0;
		if (mode === 0){
			nextMsg = (R3_MSG_currentMessage - 1);
		} else {
			nextMsg = (R3_MSG_currentMessage + 1);
		};
		if (nextMsg < 0){
			nextMsg = 0;
		};
		if (nextMsg > (R3_MSG_RDT_MESSAGES.length - 1)){
			nextMsg = (R3_MSG_RDT_MESSAGES.length - 1);
		};
		R3_MSG_readMessage(nextMsg);
	};
};
// Clear Script
function R3_MSG_clearScript(){
	R3_UTILS_VAR_CLEAN_MSG();
	R3_DESIGN_CLEAN_MSG();
};
// MSG Text Decompiler
function R3_MSG_DECOMPILER_START(hex, compileMode){
	if (hex !== undefined && hex !== ''){
		var hexLen = (hex.length / 2);
		if (R3_tools.isInteger(hexLen) !== false){
			R3_MSG_textMode = '';
			R3_MSG_commands = {};
			R3_MSG_totalCommands = 0;
			// Reading Mode
			if (R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE === 3){
				R3_msgCurrentDatabase = MSG_RE3_DATABASE;
			};
			var d = c = 0, cLength, tempFunc, currentText = '', formatHex = R3_tools.solveHex(hex), RAW_DATA = formatHex.match(/.{1,2}/g), currentCommand, needReleaseText = false;
			while (c < RAW_DATA.length){
				currentCommand = RAW_DATA[c];
				// console.info(currentCommand);
				/*
					If is function or not
				*/
				if (R3_msgCurrentDatabase[currentCommand][0] !== false){
					R3_MSG_totalCommands++;
					if (needReleaseText === false){
						d = 0;
						tempFunc = '';
						cLength = R3_msgCurrentDatabase[currentCommand][3];
						while (d < cLength){
							tempFunc = tempFunc + RAW_DATA[(c + d)];
							d++;
						};
						// Fix for missing args
						if (tempFunc.indexOf('undefined') === -1){
							R3_MSG_commands[R3_MSG_totalCommands] = [R3_msgCurrentDatabase[currentCommand][2], tempFunc];
						} else {
							R3_MSG_commands[R3_MSG_totalCommands] = [R3_msgCurrentDatabase[currentCommand][2], tempFunc.replace('undefined', '00')];
						};
						c = (c + d);
					} else {
						R3_MSG_commands[R3_MSG_totalCommands] = [0, currentText];
						needReleaseText = false;
						currentText = '';
					};
				} else {
					currentText = currentText + currentCommand;
					needReleaseText = true;
					c++;
				};
			};
			if (needReleaseText !== false){
				R3_MSG_totalCommands++;
				R3_MSG_commands[R3_MSG_totalCommands] = [0, currentText];
				currentText = '';
			};
			/*
				End
			*/
			R3_MSG_renderCommands();
			if (compileMode !== undefined){
				R3_MSG_COMPILE(compileMode);
			};
		};
	};
};
// Render Commands
function R3_MSG_renderCommands(){
	var c = 1;
	R3_MSG_tempHex = R3_MSG_textMode = '';
	while (c < (R3_MSG_totalCommands + 1)){
		R3_MSG_RENDER_FUNCTION(R3_MSG_commands[c][0], R3_MSG_commands[c][1], c);
		R3_MSG_tempHex = R3_MSG_tempHex + R3_MSG_commands[c][1];
		c++;
	};
	R3_MSG_updateLabels(R3_MSG_currentMessage);
};
// Translate Hex
function R3_MSG_translateHex(){
	document.getElementById('R3_MSG_EDIT_TEXTAREA').value = '';
	var c = 0, fHex = R3_tools.solveHex(document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').value.replace(new RegExp('\n', 'gi'), ''));
	if (fHex !== ''){
		Object.keys(R3_HEX_FORMAT_EXCLUDE).forEach(function(cItem){
			fHex = fHex.replace(new RegExp(cItem, 'gi'), '').replace(/[^a-z0-9]/gi,'');
		});
		R3_MSG_DECOMPILER_START(fHex);
	} else {
		R3_MSG_NEW_FILE();
	};
	document.getElementById('R3_MSG_TRANSLATE_TEXTAREA').value = R3_tools.unsolveHex(R3_tools.solveHex(fHex), 0);
};
// Convert msg hex text to decoded text
function R3_MSG_convertHexToPureText(hex, isMsgEditor){
	var tmp, textDecoded = '', textRaw, c = 0, excludeList = [
		'ea', // Show Special Char
		'f8', // Show Item Name
		'f9'  // Change text color
	];
	if (hex !== undefined && hex !== ''){
		textRaw = hex.match(/.{1,2}/g);
		while (c < textRaw.length){
			// Is text / function
			if (R3_msgCurrentDatabase[textRaw[c]][0] === false){
				textDecoded = textDecoded + R3_msgCurrentDatabase[textRaw[c]][1].replace('"', '/');
				c++;
			} else {
				// Exclude text description
				if (R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE === 3 && excludeList.indexOf(textRaw[c]) === -1){
					textDecoded = textDecoded + '<font class="monospace mono_xyzr">' + R3_msgCurrentDatabase[textRaw[c]][1] + ' ' + textRaw[c + 1] + ')</font>';
				};
				// Show Item Name
				if (R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE === 3 && textRaw[c] === 'f8'){
					tmp = DATABASE_ITEM[textRaw[c + 1]];
					if (tmp === undefined){
						tmp = DATABASE_ITEM['00'][0];
					} else {
						tmp = DATABASE_ITEM[textRaw[c + 1]][0]
					};
					textDecoded = textDecoded + tmp;
				};
				// Show Special Char
				if (R3_SETTINGS.SETTINGS_MSG_DECOMPILER_MODE === 3 && textRaw[c] === 'ea'){
					tmp = MSG_RE3_SPECIAL_CHAR_LIST[textRaw[c + 1]];
					if (tmp === undefined){
						tmp = '(Special Char: ' + textRaw[c + 1].toUpperCase() + ')';
					};
					textDecoded = textDecoded + tmp;
				};
				c = (c + 2);
			};
		};
		// If is MSG Editor
		if (isMsgEditor === true){
			Object.keys(MSG_formatExclude).forEach(function(cItem, cIndex){
				textDecoded = textDecoded.replace(RegExp(MSG_formatExclude[cIndex][0], 'gi'), MSG_formatExclude[cIndex][1]);
			});
		};
	};
	return textDecoded;
};
// Insert function from list
function R3_MSG_insertFn(fnId){
	if (R3_MENU_CURRENT === 7){
		var prevText = document.getElementById('R3_MSG_EDIT_TEXTAREA').value;
		if (fnId === undefined){
			fnId = 1;
		};
		document.getElementById('R3_MSG_EDIT_TEXTAREA').value = prevText + '{' + MSG_functionTypes[fnId][1] + '00}';
	};
};
/*
	Extract Message (REWORK)
	This will look more or less like Leo's approach on his RE1 Tool!
*/
function R3_MSG_RENDER_FUNCTION(cmdType, hex, id){
	// Variables
	var finalText = '', colorStart = '', colorEnd = '', functionPrefix = '{',
		previousValue = document.getElementById('R3_MSG_EDIT_TEXTAREA').value;
	if (MSG_functionTypes[cmdType] !== undefined){
		// If it is Show Message
		if (cmdType === 0){
			finalText = R3_MSG_convertHexToPureText(hex, true);
		} else {
			// Change preview color
			if (cmdType === 9){
				if (hex.slice(2) !== '00'){
					colorEnd = '';
					colorStart = '<font class="R3_MSG_color_' + hex.slice(2) + '">';
				};
				if (hex.slice(2) === '00'){
					colorStart = '';
					colorEnd = '</font>';
				};
			};
			finalText = functionPrefix + MSG_functionTypes[cmdType][1] + hex.slice(2) + '}';
		};
	} else {
		finalText = functionPrefix + 'HEX:' + hex.slice(0, 2) + '}';
	};
	/*
		End
	*/
	R3_MSG_textMode = R3_MSG_textMode + colorStart + R3_MSG_convertHexToPureText(hex) + colorEnd;
	document.getElementById('R3_MSG_EDIT_TEXTAREA').value = previousValue + finalText;
};
/*
	Apply changes to code
	EDIT: This will be simplefied soon...
*/
function R3_MSG_EDIT_APPLY(mode){
	// Variables
	var c = 0, finalHex = '', textArray = [], textInput = document.getElementById('R3_MSG_EDIT_TEXTAREA').value;
	if (textInput === ''){
		textInput = '{S:02}@{E:00}';
	};
	// Here we go...
	textArray = textInput.match(/.{1,1}/g);
	while (c < textArray.length){
		// If current char is function
		if (textArray[c] === '{'){
			var cNextPos = c + (textArray.slice(c).indexOf('}') + 1),
				cFunctionHex = textArray.slice(c, cNextPos).toString().replace(RegExp(',', 'gi'), '').toUpperCase(),
				cFunction = cFunctionHex.slice(1, cFunctionHex.indexOf(':')),
				cArgs = R3_tools.fixVars(cFunctionHex.slice((cFunctionHex.indexOf(':') + 1), cFunctionHex.indexOf('}')), 2);
			// console.info('Function: ' + cFunctionHex);
			if (cArgs === ''){
				cArgs = '00';
			};
			finalHex = finalHex + R3_MSG_FUNCTIONS[cFunction] + cArgs;
			c = cNextPos;
		} else {
			finalHex = finalHex + R3_MSG_COMPILER_CHAR_DATABASE[textArray[c]];
			c++;
		};
	};
	// End
	document.getElementById('R3_MSG_EDIT_TEXTAREA').value = '';
	R3_MSG_RDT_MESSAGES[R3_MSG_currentMessage] = finalHex;
	if (MSG_arquivoBruto !== undefined){
		R3_MSG_COMPILE(mode);
	} else {
		R3_MSG_DECOMPILER_START(finalHex, mode);
	};
};
/*
	Compile MSG

	~~~~~~~~~~~~
	|   Modes  |
	~~~~~~~~~~~~
	0: Save
	1: Save As
	2: Inject in RDT
	3: Just compile
*/
function R3_MSG_COMPILE(mode){
	if (R3_MSG_totalCommands !== 0){
		var HEX_FINAL = '', c = 1, fName = 'Untitled';
		while (c < (R3_MSG_totalCommands + 1)){
			HEX_FINAL = HEX_FINAL + R3_MSG_commands[c][1];
			c++;
		};
		MSG_arquivoBruto = HEX_FINAL;
		// Save
		if (mode === 0 && R3_SYSTEM.web.isBrowser === true){
			mode = 1;
		};
		if (mode === 0){
			if (R3_MSG_fPath !== undefined){
				try {
					R3_MODULES.fs.writeFileSync(R3_MSG_fPath, HEX_FINAL, 'hex');
				} catch (err) {
					R3_SYSTEM.log('error', 'ERROR - Unable to save MSG file!\nReason: ' + err);
				};
			} else {
				mode = 1;
			};
		};
		// Save As
		if (mode === 1){
			if (RDT_arquivoBruto !== undefined){
				fName = R3_RDT_mapName + '_MSG_' + R3_tools.fixVars(R3_MSG_currentMessage, 2);
			}
			R3_fileManager.saveFile(fName + '.msg', HEX_FINAL, 'hex', '.msg', function(loc){
				R3_MSG_fPath = loc;
			});
		};
		// Inject in RDT
		if (mode === 2){
			R3_MSG_recompileWithPointers(0);
		};
		// Just compile
		if (mode === 3){
			R3_MSG_DECOMPILER_START(HEX_FINAL);
			R3_MSG_updateLabels(R3_MSG_currentMessage);
			R3_MSG_readMessage(R3_MSG_currentMessage);
		};
	};
};
/*
	Compile MSG Section With Pointers

	Mode:
	0: Insert to RDT
	1: Just compile
	2: Log FINAL_HEX (Debug)
	3: HACK (Later will be the auto-save)
*/
function R3_MSG_recompileWithPointers(mode){
	R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (MSG) Compiling new MSG pointers...');
	var c = 1, HEX_FINAL = '', endianPointers = '', cMessage = R3_MSG_currentMessage,
		MSG_FINAL_POINTERS_TEMP = [R3_tools.fixVars((R3_MSG_RDT_MESSAGES.length * 2).toString(16), 4)],
		finalPointerLength = (parseInt(MSG_FINAL_POINTERS_TEMP[0], 16) * 2),
		tempMsgHex = R3_MSG_RDT_MESSAGES[0];
	MSG_FINAL_POINTERS_TEMP.push(R3_tools.fixVars((parseInt(tempMsgHex.length + finalPointerLength) / 2).toString(16), 4));
	while (c < R3_MSG_RDT_MESSAGES.length){
		tempMsgHex = tempMsgHex + R3_MSG_RDT_MESSAGES[c];
		if (c !== (R3_MSG_RDT_MESSAGES.length - 1)){
			MSG_FINAL_POINTERS_TEMP.push(R3_tools.fixVars((parseInt(tempMsgHex.length + finalPointerLength) / 2).toString(16), 4));
		};
		c++;
	};
	// Let's fix the pointers to endian
	MSG_FINAL_POINTERS_TEMP.forEach(function(cPointer){
		R3_tools.parseEndian(cPointer);
		endianPointers = endianPointers + R3_tools.parseEndian(cPointer);
	});
	HEX_FINAL = endianPointers + tempMsgHex;
	/*
		Small Fix:
		Check if the last message ends the section
	*/
	if (HEX_FINAL.slice((HEX_FINAL.length - 4), (HEX_FINAL.length - 2)) !== 'fe'){
		HEX_FINAL = HEX_FINAL + 'fe00';
	};
	// console.info(HEX_FINAL);
	/*
		End
	*/
	if (mode === undefined){
		mode = 0;
	};
	if (mode === 0){
		R3_RDT_rawSections.RAWSECTION_MSG = HEX_FINAL;
		R3_SHOW_MENU(10);
		R3_RDT.sections.generateMsgPreview();
	};
	if (mode === 1){
		R3_RDT_rawSections.RAWSECTION_MSG = HEX_FINAL;
		R3_MSG_decompileRDT(true);
		R3_RDT.sections.generateMsgPreview();
	};
	if (mode === 2){
		console.info(HEX_FINAL);
	};
	if (mode === 3){
		R3_RDT_rawSections.RAWSECTION_MSG = HEX_FINAL;
		R3_RDT.scdHack.applyHack(true);
		R3_MSG_decompileRDT(true);
		R3_RDT.sections.generateMsgPreview();
	};
	R3_MSG_readMessage(cMessage);
};