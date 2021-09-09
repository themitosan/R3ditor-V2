/*
	R3ditor V2 - livestatus.js
	Por mitosan/mscore/misto_quente/mscorehdr/help
	Hullo Hullo... again!

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
	MEM_JS_updatePosTimer, MEM_JS_discInterval, R3_CHECK_GAME_INTERVAL, R3_CHECK_ifStillOpenInterval,
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
				R3_MEMJS_seekProcess();
			};
		}, 200);
	};
};
// Check if process still open
function R3_MEMORY_JS_checkStillOpen(){
	R3_CHECK_ifStillOpenInterval = setInterval(function(){
		if (R3_MEMJS_PROCESS_OBJ !== undefined){
			var PROCESSES = APP_MEMJS.getProcesses(), processName = R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][3], isOpen = false;
			for (var c = 0; c < PROCESSES.length; c++){
				if (PROCESSES[c]['szExeFile'] === processName){
					isOpen = true;
				};
			};
			// End
			if (isOpen === false){
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Closing Livestatus / MemoryJS because the game is not running anymore!');
				R3_LIVESTATUS_CLOSE_BAR();
				RE3_RUNNING = false;
				R3_MEMJS_PROCESS_OBJ = undefined;
				clearInterval(MEM_JS_updatePosTimer);
				clearInterval(R3_CHECK_ifStillOpenInterval);
			};
		};
	}, 2000);
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
	if (MEM_JS_requreSucess === true && R3_MEMJS_PROCESS_OBJ !== undefined && RE3_RUNNING === true){
		// Stage
		REALTIME_CurrentStage 	   = parseInt(R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_Stage'][0], 2, 'hex') + 1).toString();
		REALTIME_CurrentRoomNumber = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentRoomNumber'][0], 2, 'hex');
		REALTIME_CurrentCam 	   = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentCam'][0], 2, 'hex');
		REALTIME_CurrentRDT 	   = 'R' + REALTIME_CurrentStage + REALTIME_CurrentRoomNumber;
		// Player Coords
		REALTIME_X_Pos  = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][0], 2, 'hex') + R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][1], 2, 'hex');
		REALTIME_Y_Pos  = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][0], 2, 'hex') + R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][1], 2, 'hex');
		REALTIME_Z_Pos  = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][0], 2, 'hex') + R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][1], 2, 'hex');
		REALTIME_R_Pos  = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][0], 2, 'hex') + R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][1], 2, 'hex');
		REALTIME_zIndex = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zIndex'][0], 2, 'hex');
	};
};
// Read inventory
function R3_MEMORY_JS_readInventory(){
	if (MEM_JS_requreSucess === true && R3_MEMJS_PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		var cPlayer = 'J', tempInventory = '', inventPos = parseInt(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_invent_item-1'][0]);
		REALTIME_CurrentPlayer = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentPlayer'][0], 2, 'hex');
		// Inventory
		if (REALTIME_CurrentPlayer === '02'){
			cPlayer = 'C';
		};
		for (var i = 0; i < 40; i++){
			tempInventory = tempInventory + R3_MEMJS_readValue(inventPos.toString(16), 2, 'hex');
			inventPos++;
		};
		// Current Status / Weapon
		REALTIME_CurrentHP = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][0], 2, 'hex') + R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][1], 2, 'hex');
		REALTIME_CurrentWeapon = R3_MEMJS_readValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_currentWeapon'][0], 2, 'hex');
		/*
			End
		*/
		localStorage.setItem('REALTIME_INVENTORY', tempInventory);
	};
};
// Read Item Box
function R3_MEMORY_JS_readItemBox(){
	var cPlayer = 'J', cHex = '', cLocation = parseInt(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_iBox_Start'][0]);
	if (REALTIME_CurrentPlayer === '02'){
		cPlayer = 'C';
	};
	for (var i = 0; i < 255; i++){ // 255 = (64 * 4 Parameter per slot)
		cHex = cHex + R3_MEMJS_readValue(cLocation.toString(16), 2, 'hex');
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
	if (DEBUG_LOCKRENDER === false && R3_MEMJS_PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		if (RE3_LIVE_CURRENTMOD === 0){
			APP_MEMJS.writeMemory(R3_MEMJS_PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_goto_titleScreen'][0], 40, APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(R3_MEMJS_PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_goto_titleScreen'][1], 0, APP_MEMJS.BYTE);
			APP_MEMJS.writeMemory(R3_MEMJS_PROCESS_OBJ.handle, MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_currentPlayer'][0],    0, APP_MEMJS.BYTE);
		} else {
			R3_SYSTEM_ALERT('WARN: This option is not available on this game version.');
		};
	};
};
// Infinite HP
function R3_LIVESTATUS_infiniteHP(){
	if (DEBUG_LOCKRENDER === false && R3_MEMJS_PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		if (REALTIME_CurrentHP.toLowerCase() !== 'c800'){
			R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][0], 'C8', 'hex');
			R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][1], '00', 'hex');
		};
	};
};
// Add 30K HP (God Mode)
function R3_LIVESTATUS_addGodHp(){
	if (DEBUG_LOCKRENDER === false && R3_MEMJS_PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
		document.getElementById('R3_LIVESTATUS_OPTION_INFINITE_HP').checked = false;
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][0], 48, 'int');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_HP'][1], 117, 'int');
	};
};
// Apply Item On Invent
function R3_LIVESTATUS_APPLYITEM(slotID){
	if (DEBUG_LOCKRENDER === false && R3_MEMJS_PROCESS_OBJ !== undefined && RE3_RUNNING === true && MEM_JS_canRender === true){
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
			R3_MEMJS_writeValue(inventStartPos.toString(16), finalInvent[cIndex], 'hex');
			inventStartPos++;
		});
		// End
		R3_LIVESTATUS_EDIT_INVENT_CANCEL();
	};
};
// Apply Item on ItemBox
function R3_LIVESTATUS_APPLYITEMBOX(itemId){
	var tempFinalHex = '', cPlayer = 'J', R3_IBOX_TEMP = RE3_LIVE_BOX.match(/.{8,8}/g),
		cLocation = MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_' + cPlayer + '_iBox_Start'][0],
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
	for (var i = 0; i < 255; i++){
		R3_MEMJS_writeValue(cLocation.toString(16), tempFinalHex[i], 'hex');
		cLocation++;
	};
	// End
	R3_LIVESTATUS_EDIT_INVENT_CANCEL();
};
// Apply Player Pos.
function R3_LIVESTATUS_APPLY_PLAYERPOS(){
	if (RE3_RUNNING === true && R3_MEMJS_PROCESS_OBJ !== undefined){
		var reason, canChange = true,
			newX  = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value, 4).toLowerCase().match(/.{2,2}/g),
			newY  = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value, 4).toLowerCase().match(/.{2,2}/g),
			newZ  = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value, 4).toLowerCase().match(/.{2,2}/g),
			newR  = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value, 4).toLowerCase().match(/.{2,2}/g),
			newZI = R3_fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value, 2).toLowerCase();
		// End
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][0], newX[0], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_xPosition'][1], newX[1], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][0], newY[0], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_yPosition'][1], newY[1], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][0], newZ[0], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zPosition'][1], newZ[1], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][0], newR[0], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_rPosition'][1], newR[1], 'hex');
		R3_MEMJS_writeValue(MEMJS_HEXPOS['RE3_mode_' + RE3_LIVE_CURRENTMOD + '_zIndex'][0], newZI, 'hex');
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
	if (RE3_RUNNING === true && R3_MEMJS_PROCESS_OBJ !== undefined){
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value = R3_TEMP_X;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value = R3_TEMP_Y;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value = R3_TEMP_Z;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value = R3_TEMP_R;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value = R3_TEMP_zI;
		R3_LIVESTATUS_APPLY_PLAYERPOS();
	};
};
function RE3_LIVE_COPY_PASTE_LOCATION(mode){
	if (RE3_RUNNING === true && R3_MEMJS_PROCESS_OBJ !== undefined){
		if (mode === 0){
			TEMP_X_Pos = REALTIME_X_Pos;
			TEMP_Y_Pos = REALTIME_Y_Pos;
			TEMP_Z_Pos = REALTIME_Z_Pos;
			TEMP_R_Pos = REALTIME_R_Pos;
			R3_SYS_copyText('[CURRENT LOCATION]\nCurrent Map: R' + parseInt(REALTIME_CurrentStage) + REALTIME_CurrentRoomNumber + '.RDT\nX Pos: ' + REALTIME_X_Pos + '\nY Pos: ' + REALTIME_Y_Pos + '\nZ Pos: ' + REALTIME_Z_Pos + '\nR Pos: ' + REALTIME_R_Pos);
			TMS.css('RE3_LIVESTATUS_stageOptions_pastePos', {'display': 'inline'});
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