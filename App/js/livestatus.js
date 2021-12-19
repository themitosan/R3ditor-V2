/*
	*******************************************************************************
	R3ditor V2 - livestatus.js
	By TheMitoSan
	 
	This file is responsible for storing all functions and database for RE3 
	Livestatus - reading ingame data to be used on modding / cheats and etc.
	*******************************************************************************
*/
var TEMP_ITEMBOX, RE3_LIVE_POS, RE3_LIVE_CAM, RE3_LIVE_PLAYER, RE3_LIVE_MAP, R3_LIVE_CAM = '', RE3_LIVE_INVENT = '';

tempFn_R3_LIVESTATUS = {
	// GUI
	renderToolbar: false,
	enableKeyPress: false,
	// Map
	currentCam: '00',
	currentRDT: 'R100',
	currentStage: '01',
	currentRoomNumber: '00',
	// Player
	currentHP: '0000',
	currentWeapon: '00',
	currentPlayer: '00',
	// Position
	playerXPos: '0000',
	playerYPos: '0000',
	playerZPos: '0000',
	playerRPos: '0000',
	playerzIndex: '00',
	// Inventory / Item Box
	playerItemBox: '',
	playerInventory: '',
	// Seek game interval (R3_MEMJS.checkIfGameIsRunning)
	seekGameInterval: undefined,
	// Copy / Paste Variables
	tempXPos: '0000',
	tempYPos: '0000',
	tempZPos: '0000',
	tempRPos: '0000',
	/*
		Current mod is the version of the game. (R3_LIVESTATUS.currentMode)
		To add support to other versions, increase this number and add the vars in database.js
		
		The first version is Sourcenext US (Eidos), Second is Xplosiv, Third pSX with USA version and goes on...
	*/
	currentMode: 0,
};
/*
	General functions
*/
// GOTO Title Screen R3_LIVESTATUS_gotoTitleScreen
tempFn_R3_LIVESTATUS['gotoTitleScreen'] = function(){
	if (DEBUG_LOCKRENDER === false && R3_MEMJS.processObj !== undefined && R3_GAME.gameRunning === true && R3_MEMJS.canRender === true){
		if (R3_LIVESTATUS.currentMode === 0){
			R3_MEMJS.writeValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cPlayer, '00', 'hex');
			R3_MEMJS.writeValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].miscGotoTitle, '28', 'hex');
			R3_MEMJS.writeValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].miscGotoTitle, 3), '00', 'hex');
		} else {
			R3_SYSTEM.alert('WARN: This option is not available on this game version.');
		};
	};
};
// Infinite HP R3_LIVESTATUS_infiniteHP
tempFn_R3_LIVESTATUS['infiniteHP'] = function(){
	if (DEBUG_LOCKRENDER === false && R3_MEMJS.processObj !== undefined && R3_GAME.gameRunning === true && R3_MEMJS.canRender === true){
		if (R3_LIVESTATUS.currentHP.toLowerCase() !== 'c800'){
			R3_MEMJS.writeValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cHP, 'C8', 'hex');
			R3_MEMJS.writeValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cHP, 1), '00', 'hex');
		};
	};
};
// Add 30K HP (God Mode) R3_LIVESTATUS_addGodHp
tempFn_R3_LIVESTATUS['addGodHp'] = function(){
	if (DEBUG_LOCKRENDER === false && R3_MEMJS.processObj !== undefined && R3_GAME.gameRunning === true && R3_MEMJS.canRender === true){
		document.getElementById('R3_LIVESTATUS_OPTION_INFINITE_HP').checked = false;
		R3_MEMJS.writeValue(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cHP, '30', 'hex');
		R3_MEMJS.writeValue(R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].cHP, 1), '75', 'hex');
	};
};
// Apply Item On Invent R3_LIVESTATUS_APPLYITEM
tempFn_R3_LIVESTATUS['applyInventItem'] = function(slotID){
	if (DEBUG_LOCKRENDER === false && R3_MEMJS.processObj !== undefined && R3_GAME.gameRunning === true && R3_MEMJS.canRender === true){
		var inventStartPos, tempInvent, finalInvent, IT, AT, cPlayer = 'J', QT = parseInt(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_QT').value);
		if (QT === '' || QT === NaN || QT < 0){
			QT = 1;
		};
		if (QT > 255){
			QT = 255;
		};
		if (R3_LIVESTATUS.currentPlayer === '02'){
			cPlayer = 'C';
		};
		inventStartPos = R3_gameVersionDatabase[R3_LIVESTATUS.currentMode]['player' + cPlayer].invtLocation;
		IT = R3_tools.fixVars(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value, 2);
		AT = R3_tools.fixVars(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_AT').value, 2);
		tempInvent = localStorage.getItem('REALTIME_INVENTORY').match(/.{8,8}/g);
		// Set item to invent
		tempInvent[(slotID - 1)] = IT + R3_tools.fixVars(QT.toString(16), 2) + AT + '00';
		finalInvent = tempInvent.toString().replace(new RegExp(',', 'gi'), '').match(/.{2,2}/g);
		// Apply code to game
		finalInvent.forEach(function(cItem, cIndex){
			R3_MEMJS.writeValue(inventStartPos.toString(16), finalInvent[cIndex], 'hex');
			inventStartPos++;
		});
		// End
		R3_LIVESTATUS_EDIT_INVENT_CANCEL();
	};
};
// Apply Item on ItemBox R3_LIVESTATUS_APPLYITEMBOX
tempFn_R3_LIVESTATUS['applyBoxItem'] = function(itemId){
	var tempFinalHex = '', cPlayer = 'J', R3_IBOX_TEMP = R3_LIVESTATUS.playerItemBox.match(/.{8,8}/g),
		cLocation = R3_gameVersionDatabase[R3_LIVESTATUS.currentMode]['player' + cPlayer].itemBoxStart,
		AT = document.getElementById('R3_LIVESTATUS_SELECT_ITEM_AT').value,
		IT = document.getElementById('R3_LIVESTATUS_SELECT_ITEM_HEX').value,
		QT = parseInt(document.getElementById('R3_LIVESTATUS_SELECT_ITEM_QT').value);
	if (QT === '' || QT === NaN || QT < 0){
		QT = 1;
	};
	if (QT > 255){
		QT = 255;
	};
	if (R3_LIVESTATUS.currentPlayer === '02'){
		cPlayer = 'C';
	};
	R3_IBOX_TEMP[itemId] = IT + R3_tools.fixVars(QT.toString(16), 2) + AT + '00';
	for (var i = 0; i < 64; i++){
		tempFinalHex = tempFinalHex + R3_IBOX_TEMP[i];
	};
	tempFinalHex = tempFinalHex.match(/.{2,2}/g);
	for (var i = 0; i < 255; i++){
		R3_MEMJS.writeValue(cLocation.toString(16), tempFinalHex[i], 'hex');
		cLocation++;
	};
	// End
	R3_LIVESTATUS_EDIT_INVENT_CANCEL();
};
// Apply Player Pos. R3_LIVESTATUS_APPLY_PLAYERPOS
tempFn_R3_LIVESTATUS['applyPlayerPos'] = function(){
	if (R3_GAME.gameRunning === true && R3_MEMJS.processObj !== undefined){
		const newX = R3_tools.fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value, 4).match(/.{2,2}/g),
			newY = R3_tools.fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value, 4).match(/.{2,2}/g),
			newZ = R3_tools.fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value, 4).match(/.{2,2}/g),
			newR = R3_tools.fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value, 4).match(/.{2,2}/g),
			posArray = [...newX, ...newY, ...newZ, ...newR, R3_tools.fixVars(document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value, 2)],
			memArray = [
				R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].xPos[0],
				R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].xPos, 1),
				R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].yPos[0],
				R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].yPos, 1),
				R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].zPos[0],
				R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].zPos, 1),
				R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].rPos[0],
				R3_tools.hexSum(R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].rPos, 1),
				R3_gameVersionDatabase[R3_LIVESTATUS.currentMode].zIndex[0]
			];
		// End
		R3_MEMJS.writeArray(memArray, posArray);
	};
};
// Open current map on RDT Editor R3_LIVESTATUS_openCurrentMap
tempFn_R3_LIVESTATUS['openCurrentMap'] = function(){
	if (R3_GAME.gameRunning === true && R3_MOD.enableMod === true){
		const fPath = R3_tools.getMapPath()[1] + 'R' + REALTIME_CurrentStage + REALTIME_CurrentRoomNumber + '.RDT';
		if (R3_MODULES.fs.existsSync(fPath) === true){
			R3_SHOW_MENU(10);
			R3_RDT.loadFile(fPath, true);
		};
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to load file! Reason: File not found! (404)');
	};
};
/*
	END
*/
const R3_LIVESTATUS = tempFn_R3_LIVESTATUS;
delete tempFn_R3_LIVESTATUS;