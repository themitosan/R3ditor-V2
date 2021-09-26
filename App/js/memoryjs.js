/*
	R3ditor V2 - configs.js
	By TheMitoSan
	
	Man... why?

	Node.js plugin written by Rob-- (https://github.com/Rob--)
	MemoryJS official page: https://github.com/Rob--/memoryjs
*/
var R3_MEMJS_PROCESS_OBJ;
tempMEMJS = {};
/*
	Functions
*/
/*
	R3_MEMJS.seekProcess
	Read host processes
*/
tempMEMJS['seekProcess'] = function(){
	if (MEM_JS_requreSucess === true && R3_WEBMODE === false){
		R3_MEMJS_PROCESS_OBJ = undefined;
		clearInterval(R3_CHECK_ifStillOpenInterval);
		var hostProcessList = APP_MEMJS.getProcesses(), processName = R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][3]; // MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_execName'];
		for (var c = 0; c < hostProcessList.length; c++){
			if (hostProcessList[c]['szExeFile'] === processName){ // ResidentEvil3.exe, psfin.exe...
				p_info = hostProcessList[c];
				R3_SYSTEM.log('separator');
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (MemoryJS) Load Process Done! <br>(Game Mode: ' + RE3_LIVE_CURRENTMOD + ', Executable Name: ' + processName + ' - PID: <font class="user-can-select">' + p_info['th32ProcessID'] + '</font>)');
				R3_MEMJS_PROCESS_OBJ = APP_MEMJS.openProcess(p_info['th32ProcessID']);
				if (RE3_RUNNING === false){
					EXTERNAL_APP_PID = p_info['th32ProcessID'];
					RE3_PID = EXTERNAL_APP_PID;
					if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === false){
						R3_LIVESTATUS_OPEN_BAR();
					} else {
						TMS.css('BTN_PS1_HOOK', {'display': 'inline-flex'});
					};
					MEM_JS_canRender = true;
					RE3_RUNNING = true;
				};
				// Add process info
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_HANDLE').innerHTML = R3_MEMJS_PROCESS_OBJ['handle'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_PID').innerHTML = R3_MEMJS_PROCESS_OBJ['th32ProcessID'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_THREADS').innerHTML = R3_MEMJS_PROCESS_OBJ['cntThreads'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_PARENT').innerHTML = R3_MEMJS_PROCESS_OBJ['th32ParentProcessID'];
				document.getElementById('BTN_MAIN_20').onclick = function(){
					R3_killExternalSoftware(R3_MEMJS_PROCESS_OBJ['th32ProcessID']);
					R3_MINIWINDOW.close(19);
				};
				// Start Render
				if (R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === false){
					R3_MEMORY_JS_checkStillOpen();
					MEM_JS_updatePosTimer = setInterval(function(){
						R3_MEMORY_JS_readGame();
					}, R3_SETTINGS.RE3_LIVE_RENDER_TIME);
				} else {
					DEBUG_LOCKRENDER = true;
				};
				break;
			};	
		};	
	};
};
/*
	R3_MEMJS.HOOK_EMU
	Hook on running emulators
	
	This function will seek some values inside emulators (ePSXe, pSX...) process to find livestatus data.
	How it works: Open the game, go to warehouse save room (hard) and run this function (without moving player)
*/
tempMEMJS['HOOK_EMU'] = function(){
	if (R3_WEBMODE === false && R3_MEMJS_PROCESS_OBJ !== undefined && R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][2] === true){
		var foundPos = false, cLocation, ramLimit = 0x7FFFFFFFFFFF, askConf = R3_SYSTEM.confirm('IMPORTANT: To read in-game data, make sure you are exactly on Spawn Pos. of Warehouse Save Room (R100.RDT).\n\nIf so, click on OK and wait.\n\nPS: This probably will consume your CPU Power!');
		if (askConf === true){
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Start reading Emulator RAM - Please wait...');
			cLocation = R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][4]; // Cheat Engine Limit
			while (foundPos === false){
				// console.log('Looking on ' + cLocation + ' (Hex: 0x' + parseInt(cLocation).toString(16).toUpperCase() + ')');
				/*
					Check Variables
					On Warehouse Save room: (R100)
	
					xPos must be 50B0
					yPos must be CAAE
					zPos must be 0000
					rPos must be 0008
				*/
				var xPos = R3_MEMJS.readValue(cLocation, 		2, 'hex') + R3_MEMJS.readValue((cLocation + 1),  2, 'hex'),
					yPos = R3_MEMJS.readValue((cLocation + 8),  2, 'hex') + R3_MEMJS.readValue((cLocation + 9),  2, 'hex'),
					zPos = R3_MEMJS.readValue((cLocation + 4),  2, 'hex') + R3_MEMJS.readValue((cLocation + 5),  2, 'hex'),
					rPos = R3_MEMJS.readValue((cLocation + 58), 2, 'hex') + R3_MEMJS.readValue((cLocation + 59), 2, 'hex');
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
						R3_SYSTEM.log('separator');
						R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Hook Complete! The sync was done on location <font class="user-can-select">0x' + parseInt(cLocation).toString(16).toUpperCase() + '</font>!');
						$('#BTN_PS1_HOOK').css({'display': 'none'});
						DEBUG_LOCKRENDER = false;
						R3_LIVESTATUS_OPEN_BAR();
						MEM_JS_updatePosTimer = setInterval(function(){
							R3_MEMORY_JS_readGame();
						}, R3_SETTINGS.RE3_LIVE_RENDER_TIME);
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
/*
	R3_MEMJS.readValue
	
	ramPos: RAM Position
	limit:  Limit length res
	mode:
		'hex': Read / return values in hex	
		'int': Read / return values in int
*/
tempMEMJS['readValue'] = function(ramPos, limit, mode){
	var res = '00';
	if (ramPos !== undefined && MEM_JS_requreSucess === true){
		if (limit !== undefined || parseInt(limit) === NaN){
			limit = 2;
		};
		if (mode === undefined || mode === 'int'){
			res = APP_MEMJS.readMemory(R3_MEMJS_PROCESS_OBJ.handle, parseInt(ramPos), APP_MEMJS.BYTE);
		};
		if (mode === 'hex'){
			res = R3_fixVars(APP_MEMJS.readMemory(R3_MEMJS_PROCESS_OBJ.handle, parseInt(ramPos.toString().replace('0x', ''), 16), APP_MEMJS.BYTE).toString(16), limit).toUpperCase();
		};
	};
	return res;
};
/*
	R3_MEMJS.writeValue

	ramPos: RAM Position
	value: value to be written
	mode:
		'hex': Read / return values in hex	
		'int': Read / return values in int
*/
tempMEMJS['writeValue'] = function(ramPos, value, mode){
	if (ramPos !== undefined && MEM_JS_requreSucess === true && ramPos !== undefined){
		if (value === undefined || value === ''){
			value = 0;
		};
		if (mode === undefined || mode === 'int'){
			value = parseInt(value);
		};
		if (mode === 'hex'){
			value = parseInt(value, 16);
		};
		APP_MEMJS.writeMemory(R3_MEMJS_PROCESS_OBJ.handle, parseInt(ramPos.toString().replace('0x', ''), 16), value, APP_MEMJS.BYTE);
	};
};
/*
	R3_MEMJS.writeArray
	Works only on hex mode

	ramPos: Array with RAM Positions
	values: Array with values
*/
tempMEMJS['writeArray'] = function(ramPos, values){
	if (ramPos !== undefined && values !== undefined && MEM_JS_requreSucess === true && ramPos.length === values.length){
		var cValue;
		ramPos.forEach(function(cPosition, cIndex){
			cValue = values[cIndex];
			if (typeof cValue === 'number'){
				cValue = R3_fixVars(cValue.toString(16), 2);
			};
			APP_MEMJS.writeMemory(R3_MEMJS_PROCESS_OBJ.handle, parseInt(cPosition.toString().replace('0x', ''), 16), parseInt(cValue, 16), APP_MEMJS.BYTE);
		});
	};
};
/*
	End
*/
const R3_MEMJS = tempMEMJS;
delete(tempMEMJS);