/*
	R3ditor V2 - livestatus.js
	Por mitosan/mscore/misto_quente/mscorehdr/help
	Hullo Hullo... again!
	
	Node.js plugin written by Rob-- (https://github.com/Rob--)
	MemoryJS official page: https://github.com/Rob--/memoryjs

	PS: I need to remake some few things about this file!
*/
// Lock Livestatus Render
var DEBUG_LOCKRENDER = false,
	MEM_JS_canRender = false,
	RE3_LIVE_RENDER_TIME = 60,
	REALTIME_CurrentCam = '00',
	REALTIME_CurrentHP = '0000',
	MEM_JS_requreSucess = false,
	REALTIME_CurrentRDT = '0000',
	REALTIME_CurrentStage = '01',
	REALTIME_CurrentWeapon = '00',
	REALTIME_CurrentPlayer = '00',
	REALTIME_renderToolbar = false,
	RE3_LIVE_keyPress_enable = false,
	REALTIME_CurrentRoomNumber = '00',
	MEM_JS_updatePosTimer, MEM_JS_discInterval, PROCESS_OBJ, R3_CHECK_GAME_INTERVAL, R3_CHECK_ifStillOpenInterval,
	TEMP_ITEMBOX, REALTIME_X_Pos = REALTIME_Y_Pos = REALTIME_Z_Pos = REALTIME_R_Pos = '0000', REALTIME_zIndex = '00',
	RE3_LIVE_POS, RE3_LIVE_CAM, RE3_LIVE_PLAYER, RE3_LIVE_MAP, RE3_LIVE_BOX = '', R3_LIVE_CAM = '', RE3_LIVE_INVENT = '',
	/*
		Current mod is the version of the game.
		To add support to other versions, increase this number and add the vars in database.js
		
		The first version is Sourcenext US (Eidos), Second is Xplosiv, Third pSX with USA version and goes on...
	*/
	RE3_LIVE_CURRENTMOD = 0;
/*
	Functions
*/
// Detect if game / emu is running
function R3_CHECK_GAME_IS_RUNNING(){
	if (SETTINGS_LIVESTATUS_ENABLE_GAME_DISCOVER === true){
		R3_CHECK_GAME_INTERVAL = setInterval(function(){
			if (MEM_JS_requreSucess === true && R3_WEBMODE === false && RE3_RUNNING === false){
				R3_MEMORY_JS_initMemoryJs();
			};
		}, 200);
	};
};
// Init MemoryJS
function R3_MEMORY_JS_initMemoryJs(){
	if (MEM_JS_requreSucess === true && R3_WEBMODE === false){
		PROCESS_OBJ = undefined;
		clearInterval(R3_CHECK_ifStillOpenInterval);
		var c = 0, p_info, PROCESSES = APP_MEMJS.getProcesses(), processName = R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][3]; // MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_execName'];
		while (c < PROCESSES.length){
			if (PROCESSES[c]['szExeFile'] === processName){ // ResidentEvil3.exe, psfin.exe...
				p_info = PROCESSES[c];
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (MemoryJS) Load Process Done! <br>(Game Mode: ' + RE3_LIVE_CURRENTMOD + ', Executable Name: ' + processName + ' - PID: <font class="user-can-select">' + p_info['th32ProcessID'] + '</font>)');
				PROCESS_OBJ = APP_MEMJS.openProcess(p_info['th32ProcessID']);
				if (RE3_RUNNING === false){
					EXTERNAL_APP_PID = p_info['th32ProcessID'];
					RE3_PID = EXTERNAL_APP_PID;
					if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === false){
						R3_LIVESTATUS_OPEN_BAR();
					} else {
						$('#BTN_PS1_HOOK').css({'display': 'inline-flex'});
					};
					MEM_JS_canRender = true;
					RE3_RUNNING = true;
				};
				// Add process info
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_HANDLE').innerHTML = PROCESS_OBJ['handle'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_PID').innerHTML = PROCESS_OBJ['th32ProcessID'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_THREADS').innerHTML = PROCESS_OBJ['cntThreads'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_PARENT').innerHTML = PROCESS_OBJ['th32ParentProcessID'];
				document.getElementById('BTN_MAIN_20').onclick = function(){
					R3_killExternalSoftware(PROCESS_OBJ['th32ProcessID']);
					R3_DESIGN_MINIWINDOW_CLOSE(19);
				};
				// Start Render
				if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === false){
					R3_MEMORY_JS_checkStillOpen();
					MEM_JS_updatePosTimer = setInterval(function(){
						R3_MEMORY_JS_readGame();
					}, RE3_LIVE_RENDER_TIME);
				} else {
					DEBUG_LOCKRENDER = true;
				};
				break;
			} else {
				c++;
			};
		};
	};
};
// Check if process still open
function R3_MEMORY_JS_checkStillOpen(){
	R3_CHECK_ifStillOpenInterval = setInterval(function(){
		if (PROCESS_OBJ !== undefined){
			var c = 0, PROCESSES = APP_MEMJS.getProcesses(), processName = R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][3], isOpen = false;
			while (c < PROCESSES.length){
				if (PROCESSES[c]['szExeFile'] === processName){
					isOpen = true;
					c = (PROCESSES.length + 1);
				} else {
					c++;
				};
			};
			// End
			if (isOpen === false){
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Closing Livestatus / MemoryJS because the game is not running anymore!');
				R3_LIVESTATUS_CLOSE_BAR();
				RE3_RUNNING = false;
				PROCESS_OBJ = undefined;
				clearInterval(MEM_JS_updatePosTimer);
				clearInterval(R3_CHECK_ifStillOpenInterval);
			};
		};
	}, 2000);
};
/*
	R3_MEMORY_JS_HOOK_EMU - Hook on emulators
	This function will seek some values inside emulators (ePSXe, pSX...) process to find livestatus data.

	How it works:
	Open the game, go to warehouse save room (hard) and run this function (without moving player)
*/
function R3_MEMORY_JS_HOOK_EMU(){
	if (R3_WEBMODE === false && PROCESS_OBJ !== undefined && R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === true){
		var foundPos = false, cLocation, ramLimit = 0x7FFFFFFFFFFF, askConf = R3_SYSTEM_CONFIRM('IMPORTANT: To read in-game data, make sure you are exactly on Spawn Pos. of Warehouse Save Room (R100.RDT).\n\nIf so, click on OK and wait.\n\nPS: This probably will consume your CPU Power!');
		if (askConf === true){
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Start reading Emulator RAM - Please wait...');
			cLocation = R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][4]; // Cheat Engine Limit
			while (foundPos === false){
				// console.log('Looking on ' + cLocation + ' (Hex: 0x' + parseInt(cLocation).toString(16).toUpperCase() + ')');
				/*
					Check Variables
					On Warehouse save room:
	
					xPos must be 50B0
					yPos must be CAAE
					zPos must be 0000
					rPos must be 0008
				*/
				var xPos = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, cLocation, APP_MEMJS.BYTE).toString(16).toUpperCase(), 2) + R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, (cLocation + 1), APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
					yPos = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, (cLocation + 8), APP_MEMJS.BYTE).toString(16).toUpperCase(), 2) + R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, ((cLocation + 8) + 1), APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
					zPos = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, (cLocation + 4), APP_MEMJS.BYTE).toString(16).toUpperCase(), 2) + R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, ((cLocation + 4) + 1), APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
					rPos = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, (cLocation + 58), APP_MEMJS.BYTE).toString(16).toUpperCase(), 2) + R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, ((cLocation + 58) + 1), APP_MEMJS.BYTE).toString(16).toUpperCase(), 2);
				if (cLocation < ramLimit){
					if (xPos === '50B0' && yPos === 'CAAE' && zPos === '0000' && rPos === '0008'){
						console.info('Found!\nPos: ' + cLocation + ' (Hex: 0x' + parseInt(cLocation).toString(16).toUpperCase() + ')');
						/*
							Update Variables on MEMJS_HEXPOS
						*/
						// Item Box
						MEMJS_HEXPOS['RE3_mode_2_J_iBox_Start'] = [(cLocation + 21860)];
						MEMJS_HEXPOS['RE3_mode_2_C_iBox_Start'] = [(cLocation + 22180)];
						// Jill Inventory
						MEMJS_HEXPOS['RE3_mode_2_J_invent_item-1'] = [(cLocation + 21820)];
						// Carlos Inventory
						MEMJS_HEXPOS['RE3_mode_2_C_invent_item-1'] = [(cLocation + 22140)];
						// Player Hex Pos.
						MEMJS_HEXPOS['RE3_mode_2_xPosition'] = [cLocation, (cLocation + 1)];
						MEMJS_HEXPOS['RE3_mode_2_yPosition'] = [(cLocation + 8), ((cLocation + 8) + 1)];
						MEMJS_HEXPOS['RE3_mode_2_zPosition'] = [(cLocation + 4), ((cLocation + 4) + 1)];
						MEMJS_HEXPOS['RE3_mode_2_rPosition'] = [(cLocation + 58), ((cLocation + 58) + 1)];
						MEMJS_HEXPOS['RE3_mode_2_zIndex'] = [(cLocation - 43)]; // This is before X Pos.
						// Current Stage, Room number & Cam
						MEMJS_HEXPOS['RE3_mode_2_Stage'] = [(cLocation + 21374)]; // This is a guess... must test
						MEMJS_HEXPOS['RE3_mode_2_currentCam'] = [(cLocation - 58)]; // This is before X Pos.
						MEMJS_HEXPOS['RE3_mode_2_currentRoomNumber'] = [(cLocation + 21376)];
						// HP
						MEMJS_HEXPOS['RE3_mode_2_HP'] = [(cLocation + 152), (cLocation + 153)];
						// Player current weapon
						MEMJS_HEXPOS['RE3_mode_2_J_currentWeapon'] = [(cLocation + 22117)];
						MEMJS_HEXPOS['RE3_mode_2_C_currentWeapon'] = [(cLocation + 22437)];
						// Current Player
						MEMJS_HEXPOS['RE3_mode_2_currentPlayer'] = [(cLocation + 1038121)]; // This is other guess... must test too!
						/*
							End
						*/
						R3_SYSTEM_LOG('separator');
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Hook Complete! The sync was done on location <font class="user-can-select">0x' + parseInt(cLocation).toString(16).toUpperCase() + '</font>!');
						$('#BTN_PS1_HOOK').css({'display': 'none'});
						DEBUG_LOCKRENDER = false;
						R3_LIVESTATUS_OPEN_BAR();
						MEM_JS_updatePosTimer = setInterval(function(){
							R3_MEMORY_JS_readGame();
						}, RE3_LIVE_RENDER_TIME);
						foundPos = true;
					} else {
						cLocation++;
					};
				} else {
					foundPos = true;
					console.warn('Unable to find data!');
				};
			};
		};
	};
};
// Start Reading Variables
function R3_MEMORY_JS_readGame(){
	R3_MEMORY_JS_readItemBox();
	R3_MEMORY_JS_readPosition();
	R3_MEMORY_JS_readInventory();
	// End
	if (DEBUG_LOCKRENDER !== true){
		R3_LIVETSTATUS_RENDER();
	};
};
// Read Positions
function R3_MEMORY_JS_readPosition(){
	if (MEM_JS_requreSucess === true && PROCESS_OBJ !== undefined && RE3_RUNNING === true){
		// Stage
		REALTIME_CurrentStage 	   = parseInt(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_Stage'][0], APP_MEMJS.BYTE) + 1).toString();
		REALTIME_CurrentRoomNumber = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentRoomNumber'][0], APP_MEMJS.BYTE).toString(16), 2).toUpperCase();
		REALTIME_CurrentCam 	   = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentCam'][0], APP_MEMJS.BYTE).toString(16), 2).toUpperCase();
		REALTIME_CurrentRDT 	   = 'R' + REALTIME_CurrentStage + REALTIME_CurrentRoomNumber;
		// XYZR
		var X1 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][0], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
			X2 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][1], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
			Y1 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][0], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
			Y2 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][1], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
			Z1 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][0], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
			Z2 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][1], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
			R1 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][0], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2),
			R2 = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][1], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2);
		REALTIME_zIndex = APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zIndex'][0], APP_MEMJS.BYTE).toString(16).toUpperCase();
		if (parseInt(REALTIME_zIndex, 16) < 16){
			REALTIME_zIndex = '0' + REALTIME_zIndex;
		};
		REALTIME_X_Pos = X1 + X2;
		REALTIME_Y_Pos = Y1 + Y2;
		REALTIME_Z_Pos = Z1 + Z2;
		REALTIME_R_Pos = R1 + R2;
	};
};
// Read inventory
function R3_MEMORY_JS_readInventory(){
	if (MEM_JS_requreSucess === true && PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		var cPlayer = 'J';
		REALTIME_CurrentPlayer = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentPlayer'][0], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2);
		// Inventory
		if (REALTIME_CurrentPlayer === '02'){
			cPlayer = 'C';
		};
		var tempInventory = '', inventStartPos = MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_invent_item-1'][0];
		for (var i = 0; i < 40; i++){
			tempInventory = tempInventory + R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, inventStartPos, APP_MEMJS.BYTE).toString(16).toUpperCase(), 2);
			inventStartPos++;
		};
		localStorage.setItem('REALTIME_INVENTORY', tempInventory); // Status
		REALTIME_CurrentHP = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][0], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2) + R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][1], APP_MEMJS.BYTE).toString(16).toUpperCase(), 2);
		// Current Weapon
		REALTIME_CurrentWeapon = R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_currentWeapon'][0], APP_MEMJS.BYTE).toString(16), 2);
	};
};
// Read Item Box
function R3_MEMORY_JS_readItemBox(){
	var cPlayer = 'J', cHex = '', cLocation;
	if (REALTIME_CurrentPlayer === '02'){
		cPlayer = 'C';
	};
	cLocation = MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_iBox_Start'][0];
	for (var i = 0; i < 255; i++){ // 255 = (64 * 4 Parameter per slot)
		cHex = cHex + R3_fixVars(APP_MEMJS.readMemory(PROCESS_OBJ.handle, cLocation, APP_MEMJS.BYTE).toString(16), 2);
		cLocation++;
	};
	RE3_LIVE_BOX = cHex;
};
/*
	Utils Functions
	Let's hope the last changes don't break anything!²
*/
// GOTO Title Screen
function R3_LIVESTATUS_gotoTitleScreen(){
	if (DEBUG_LOCKRENDER === false && PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		if (RE3_LIVE_CURRENTMOD === 0){
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_goto_titleScreen'][0], 40, APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_goto_titleScreen'][1], 0, APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentPlayer'][0],    0, APP_MEMJS.BYTE);
		} else {
			R3_SYSTEM_ALERT('WARN: This option is not available on this game version.');
		};
	};
};
// Infinite HP
function R3_LIVESTATUS_infiniteHP(){
	if (DEBUG_LOCKRENDER === false && PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		if (REALTIME_CurrentHP.toLowerCase() !== 'c800'){
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][0], 200, APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][1], 0, APP_MEMJS.BYTE);
		};
	};
};
// Add 30K HP (God Mode)
function R3_LIVESTATUS_addGodHp(){
	if (DEBUG_LOCKRENDER === false && PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		document.getElementById('R3_LIVESTATUS_OPTION_INFINITE_HP').checked = false;
		APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][0], 48, APP_MEMJS.BYTE);
		APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][1], 117, APP_MEMJS.BYTE);
	};
};
// Apply Item On Invent
function R3_LIVESTATUS_APPLYITEM(slotID){
	if (DEBUG_LOCKRENDER === false && PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		var cPlayer = 'J', QT = parseInt(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_QT').value);
		if (QT === '' || QT === NaN || QT < 0){
			QT = 1;
		};
		if (QT > 255){
			QT = 255;
		};
		if (REALTIME_CurrentPlayer === '02'){
			cPlayer = 'C';
		};
		var inventStartPos = MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_invent_item-1'][0],
			IT = R3_fixVars(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value, 2), 
			AT = R3_fixVars(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_AT').value, 2),
			tempInvent = localStorage.getItem('REALTIME_INVENTORY').match(/.{8,8}/g);
		// Set item to invent
		tempInvent[(slotID - 1)] = IT + R3_fixVars(QT.toString(16), 2) + AT + '00';
		var finalInvent = tempInvent.toString().replace(new RegExp(',', 'gi'), '').match(/.{2,2}/g);
		// Apply code to game
		finalInvent.forEach(function(cItem, cIndex){
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, inventStartPos, parseInt(finalInvent[cIndex], 16), APP_MEMJS.BYTE);
			inventStartPos++;
		});
		// End
		R3_LIVESTATUS_EDIT_INVENT_CANCEL();
	};
};
// Apply Item on ItemBox
function R3_LIVESTATUS_APPLYITEMBOX(itemId){
	var cLocation, tempFinalHex = '', cPlayer = 'J', R3_IBOX_TEMP = RE3_LIVE_BOX.match(/.{1,8}/g),
		AT = document.getElementById('R3_LIVESTATUS_SELECT_ITEM_AT').value,
		IT = document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value,
		QT = parseInt(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_QT').value);
	if (QT === '' || QT === NaN || QT < 0){
		QT = 1;
	};
	if (QT > 255){
		QT = 255;
	};
	if (REALTIME_CurrentPlayer === '02'){
		cPlayer = 'C';
	};
	R3_IBOX_TEMP[itemId] = IT + R3_fixVars(QT.toString(16), 2) + AT + '00';
	for (var i = 0; i < 64; i++){
		tempFinalHex = tempFinalHex + R3_IBOX_TEMP[i];
	};
	tempFinalHex = tempFinalHex.match(/.{2,2}/g);
	cLocation = MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_iBox_Start'][0];
	for (var i = 0; i < 255; i++){
		APP_MEMJS.writeMemory(PROCESS_OBJ.handle, cLocation, parseInt(tempFinalHex[i], 16), APP_MEMJS.BYTE);
		cLocation++;
	};
	// End
	R3_LIVESTATUS_EDIT_INVENT_CANCEL();
};
// Apply Player Pos.
function R3_LIVESTATUS_APPLY_PLAYERPOS(){
	if (RE3_RUNNING === true && PROCESS_OBJ !== undefined){
		var reason, canChange = true,
			newX = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value, 4).toLowerCase(),
			newY = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value, 4).toLowerCase(),
			newZ = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value, 4).toLowerCase(),
			newR = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value, 4).toLowerCase(),
			newZI = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value, 2).toLowerCase();
		// End
		if (canChange === true){
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][0], parseInt(newX.slice(0, 2), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][1], parseInt(newX.slice(2, 4), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][0], parseInt(newY.slice(0, 2), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][1], parseInt(newY.slice(2, 4), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][0], parseInt(newZ.slice(0, 2), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][1], parseInt(newZ.slice(2, 4), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][0], parseInt(newR.slice(0, 2), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][1], parseInt(newR.slice(2, 4), 16), APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zIndex'][0],    parseInt(newZI, 16),            APP_MEMJS.BYTE);
		} else {
			R3_SYSTEM_LOG('warn', 'WARN - Unable to set new location!\nReason: ' + reason);
		};
	};
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
			document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis).value = R3_parseEndian(R3_convertPosIntToHex(newPos)).toUpperCase();
		} else {
			newPos = parseInt(document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_INT').value);
			if (document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_INT').value === ''){
				newPos = 0;
			};
			document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis + '_RANGE').value = newPos;
			document.getElementById('R3_LIVESTATUS_EDIT_POS_' + axis).value = R3_parseEndian(R3_convertPosIntToHex(newPos)).toUpperCase();
		};
	};
};
function R3_LIVESTATUS_APPLY_PLAYERPOS_BAR(){
	if (RE3_RUNNING === true && PROCESS_OBJ !== undefined){
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value = R3_TEMP_X;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value = R3_TEMP_Y;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value = R3_TEMP_Z;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value = R3_TEMP_R;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value = R3_TEMP_zI;
		R3_LIVESTATUS_APPLY_PLAYERPOS();
	};
};
function RE3_LIVE_COPY_PASTE_LOCATION(mode){
	if (RE3_RUNNING === true && PROCESS_OBJ !== undefined){
		if (mode === 0){
			TEMP_X_Pos = REALTIME_X_Pos;
			TEMP_Y_Pos = REALTIME_Y_Pos;
			TEMP_Z_Pos = REALTIME_Z_Pos;
			TEMP_R_Pos = REALTIME_R_Pos;
			R3_SYS_copyText('[CURRENT LOCATION]\nCurrent Map: R' + parseInt(REALTIME_CurrentStage) + REALTIME_CurrentRoomNumber + '.RDT\nX Pos: ' + REALTIME_X_Pos + '\nY Pos: ' + REALTIME_Y_Pos + '\nZ Pos: ' + REALTIME_Z_Pos + '\nR Pos: ' + REALTIME_R_Pos);
			$('#RE3_LIVESTATUS_stageOptions_pastePos').css({'display': 'inline'});
		} else {
			document.getElementById('RE3_LIVESTATUS_edit_X').value = TEMP_X_Pos;
			document.getElementById('RE3_LIVESTATUS_edit_Y').value = TEMP_Y_Pos;
			document.getElementById('RE3_LIVESTATUS_edit_Z').value = TEMP_Z_Pos;
			document.getElementById('RE3_LIVESTATUS_edit_R').value = TEMP_R_Pos;
		};
	};
};
// Open current map on RDT Editor
function R3_LIVESTATUS_openCurrentMap(){
	if (RE3_RUNNING === true && APP_ENABLE_MOD === true){
		var fPath = R3_getMapPath()[1] + 'R' + REALTIME_CurrentStage + REALTIME_CurrentRoomNumber + '.RDT';
		if (APP_FS.existsSync(fPath) === true){
			R3_SHOW_MENU(10);
			R3_RDT_LOAD(fPath, true);
		};
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to load file! Reason: File not found! (404)');
	};
};