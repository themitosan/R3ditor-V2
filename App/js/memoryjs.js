/*
	*******************************************************************************
	R3ditor V2 - memoryjs.js
	By TemmieHeartz

	This file is responsible for creating functions that allows MemoryJS read and
	write RAM from / to RE3 main process, allowing cheats and debug process while
	creating mods.

	Node.js plugin written by Rob-- (https://github.com/Rob--)
	MemoryJS official page: https://github.com/Rob--/memoryjs
	*******************************************************************************
*/
tempFn_MEMJS = {
	canRender: false,
	requireSucess: false,
	processObj: undefined,
	discInterval: undefined,
	updatePosTimer: undefined,
	checkGameInterval: undefined
};
/*
	Internal Functions
*/
// Detect if game / emu is running R3_CHECK_GAME_IS_RUNNING
tempFn_MEMJS['checkIfGameIsRunning'] = function(){
	if (R3_SETTINGS.SETTINGS_LIVESTATUS_ENABLE_GAME_DISCOVER === true){
		R3_LIVESTATUS.seekGameInterval = setInterval(function(){ // R3_CHECK_GAME_INTERVAL
			if (R3_MEMJS.requireSucess === true && R3_SYSTEM.web.isBrowser === false && R3_GAME.gameRunning === false){
				R3_MEMJS.seekProcess();
			};
		}, 200);
	};
};
/*
	R3_MEMJS.seekProcess
	Read host processes
*/
tempFn_MEMJS['seekProcess'] = function(){
	if (R3_MEMJS.requireSucess === true && R3_SYSTEM.web.isBrowser === false){
		R3_MEMJS.processObj = undefined;
		clearInterval(R3_MEMJS.checkGameInterval);
		var hostProcessList = R3_MODULES.memoryjs.getProcesses(),
			processName = R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].gameData.processName; // MEMJS_HEXPOS['RE3_mode_' + R3_LIVESTATUS.currentMode + '_execName'];
		for (var c = 0; c < hostProcessList.length; c++){
			if (hostProcessList[c]['szExeFile'] === processName){ // ResidentEvil3.exe, psfin.exe...
				p_info = hostProcessList[c];
				R3_SYSTEM.log('separator');
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (MemoryJS) Load Process Done! <br>(Game Mode: ' + R3_LIVESTATUS.currentMode + ', Executable Name: ' + processName + ' - PID: <font class="user-can-select">' + p_info['th32ProcessID'] + '</font>)');
				R3_MEMJS.processObj = R3_MODULES.memoryjs.openProcess(p_info['th32ProcessID']);
				if (R3_GAME.gameRunning === false){
					R3_SYSTEM.externalSoftware.processPID = p_info['th32ProcessID'];
					R3_GAME.gamePID = R3_SYSTEM.externalSoftware.processPID;
					if (R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].gameData.isConsole === false){
						R3_LIVESTATUS_OPEN_BAR();
					} else {
						TMS.css('BTN_PS1_HOOK', {'display': 'inline-flex'});
					};
					R3_MEMJS.canRender = true;
					R3_GAME.gameRunning = true;
				};
				// Add process info
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_HANDLE').innerHTML = R3_MEMJS.processObj['handle'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_PID').innerHTML = R3_MEMJS.processObj['th32ProcessID'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_THREADS').innerHTML = R3_MEMJS.processObj['cntThreads'];
				document.getElementById('R3_LIVESTATUS_LBL_PROCESS_PARENT').innerHTML = R3_MEMJS.processObj['th32ParentProcessID'];
				document.getElementById('BTN_MAIN_20').onclick = function(){
					R3_SYSTEM.externalSoftware.killPID(R3_MEMJS.processObj['th32ProcessID']);
					R3_MINIWINDOW.close(19);
				};
				// Start Render
				if (R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].gameData.isConsole === false){
					R3_MEMJS.checkGameProcess();
					R3_MEMJS.updatePosTimer = setInterval(function(){
						R3_MEMJS.readGame();
					}, R3_SETTINGS.RE3_LIVE_RENDER_TIME);
				} else {
					DEBUG_LOCKRENDER = true;
				};
				clearInterval(R3_LIVESTATUS.seekGameInterval);
				break;
			};	
		};	
	};
};
/*
	R3_MEMJS.HOOK_EMU - WIP
	Hook on running emulators
	
	This function will seek some values inside emulators (like pSX) process to find livestatus data.
	How it works: Open the game, go to warehouse save room (hard) and run this function (without moving player)
*/
tempFn_MEMJS['HOOK_EMU'] = function(){
	R3_SYSTEM.WIP();
};
/*
	R3_MEMJS.readValue
	
	ramPos: RAM Position
	limit:  Limit length res
	mode:
		'hex': Read / return values in hex	
		'int': Read / return values in int
*/
tempFn_MEMJS['readValue'] = function(ramPos, limit, mode){
	var res = '00';
	if (ramPos !== undefined && R3_MEMJS.requireSucess === true){
		if (limit !== undefined || parseInt(limit) === NaN){
			limit = 2;
		};
		if (mode === undefined || mode === 'int'){
			res = R3_MODULES.memoryjs.readMemory(R3_MEMJS.processObj.handle, parseInt(ramPos), R3_MODULES.memoryjs.BYTE);
		};
		if (mode === 'hex'){
			res = R3_tools.fixVars(R3_MODULES.memoryjs.readMemory(R3_MEMJS.processObj.handle, parseInt(ramPos.toString().replace('0x', ''), 16), R3_MODULES.memoryjs.BYTE).toString(16), limit).toUpperCase();
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
tempFn_MEMJS['writeValue'] = function(ramPos, value, mode){
	if (ramPos !== undefined && R3_MEMJS.requireSucess === true && ramPos !== undefined){
		if (value === undefined || value === ''){
			value = 0;
		};
		if (mode === undefined || mode === 'int'){
			value = parseInt(value);
		};
		if (mode === 'hex'){
			value = parseInt(value, 16);
		};
		R3_MODULES.memoryjs.writeMemory(R3_MEMJS.processObj.handle, parseInt(ramPos.toString().replace('0x', ''), 16), value, R3_MODULES.memoryjs.BYTE);
	};
};
/*
	R3_MEMJS.writeArray
	Works only on hex mode

	ramPos: Array with RAM Positions
	values: Array with values
*/
tempFn_MEMJS['writeArray'] = function(ramPos, values){
	if (ramPos !== undefined && values !== undefined && R3_MEMJS.requireSucess === true && ramPos.length === values.length){
		var cValue;
		ramPos.forEach(function(cPosition, cIndex){
			cValue = values[cIndex];
			if (typeof cValue === 'number'){
				cValue = R3_tools.fixVars(cValue.toString(16), 2);
			};
			R3_MODULES.memoryjs.writeMemory(R3_MEMJS.processObj.handle, parseInt(cPosition.toString().replace('0x', ''), 16), parseInt(cValue, 16), R3_MODULES.memoryjs.BYTE);
		});
	};
};

/*
	General functions
*/

// Check if game still running
tempFn_MEMJS['checkGameProcess'] = function(){
	R3_MEMJS.checkGameInterval = setInterval(function(){
		if (R3_MEMJS.processObj !== undefined){
			const PROCESSES = R3_MODULES.memoryjs.getProcesses(), processName = R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].gameData.processName;
			var isOpen = false;
			for (var c = 0; c < PROCESSES.length; c++){
				if (PROCESSES[c]['szExeFile'] === processName){
					isOpen = true;
				};
			};
			// End
			if (isOpen === false){
				R3_SYSTEM.log('separator');
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Closing Livestatus / MemoryJS because the game is not running anymore!');
				R3_LIVESTATUS_CLOSE_BAR();
				R3_GAME.gameRunning = false;
				R3_MEMJS.processObj = undefined;
				clearInterval(R3_MEMJS.updatePosTimer);
				clearInterval(R3_MEMJS.checkGameInterval);
			};
		};
	}, 2000);
};

// Read main game variables
tempFn_MEMJS['readGame'] = function(){
	// Stage
	R3_LIVESTATUS.currentStage 		= parseInt(R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cStage, 2, 'hex') + 1).toString();
	R3_LIVESTATUS.currentRoomNumber = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cRoomNumber, 2, 'hex');
	R3_LIVESTATUS.currentCam 		= R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cCam, 2, 'hex');
	R3_LIVESTATUS.currentRDT		= 'R' + R3_LIVESTATUS.currentStage + R3_LIVESTATUS.currentRoomNumber;
	
	// Player Coords
	R3_LIVESTATUS.playerXPos   = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].xPos, 2, 'hex') + R3_MEMJS.readValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].xPos, 1), 2, 'hex');
	R3_LIVESTATUS.playerYPos   = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].yPos, 2, 'hex') + R3_MEMJS.readValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].yPos, 1), 2, 'hex');
	R3_LIVESTATUS.playerZPos   = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].zPos, 2, 'hex') + R3_MEMJS.readValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].zPos, 1), 2, 'hex');
	R3_LIVESTATUS.playerRPos   = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].rPos, 2, 'hex') + R3_MEMJS.readValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].rPos, 1), 2, 'hex');
	R3_LIVESTATUS.playerzIndex = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].zIndex, 2, 'hex');
	
	// Inventory
	var cPlayer = 'J', tempInventory = '', inventPos = parseInt(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode]['player' + cPlayer].invtLocation);
	R3_LIVESTATUS.currentPlayer = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cPlayer, 2, 'hex');
	if (R3_LIVESTATUS.currentPlayer === '02'){
		cPlayer = 'C';
	};
	for (var i = 0; i < 40; i++){
		tempInventory = tempInventory + R3_MEMJS.readValue(inventPos.toString(16), 2, 'hex');
		inventPos++;
	};

	// Current Status / Weapon
	R3_LIVESTATUS.currentHP = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cHP, 2, 'hex') + R3_MEMJS.readValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cHP, 1), 2, 'hex');
	R3_LIVESTATUS.currentWeapon = R3_MEMJS.readValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode]['player' + cPlayer].currentWeapon, 2, 'hex').toLowerCase();
	localStorage.setItem('REALTIME_INVENTORY', tempInventory);

	// Item Box
	var cHex = '', cLocation = parseInt(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode]['player' + cPlayer].itemBoxStart);
	for (var i = 0; i < 255; i++){ // 255 = (64 * 4 Parameter per slot)
		cHex = cHex + R3_MEMJS.readValue(cLocation.toString(16), 2, 'hex');
		cLocation++;
	};
	R3_LIVESTATUS.playerItemBox = cHex;

	// End
	if (DEBUG_LOCKRENDER !== true){
		R3_LIVETSTATUS_RENDER();
	};
};
/*
	END
*/
const R3_MEMJS = tempFn_MEMJS;
delete(tempFn_MEMJS);