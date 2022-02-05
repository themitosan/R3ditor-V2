/*
	*******************************************************************************
	R3ditor V2 - scd_js.js
	By TheMitoSan

	This file contains all SCD functions converted to JS and should be used to 
	compile scripts on JS Editor mode.
	*******************************************************************************
*/
tempFn_R3_SCD_JS = {};
tempFn_R3_SCD_JS_tools = {};
/*
	Compiler Tools
*/
// Parse Flags
tempFn_R3_SCD_JS_tools['parseFlag'] = function(flag){
	if (flag !== undefined){
		if (flag === false){
			return '00';
		} else {
			return '01';
		};
	} else {
		return '00';
	};
};
// Parse Number
tempFn_R3_SCD_JS_tools['parseNumber'] = function(n, numLimit, hexLength){
	if (n !== undefined && numLimit !== undefined && hexLength !== undefined){
		var nm = parseInt(n), lm = parseInt(numLimit);
		if (nm > lm){
			nm = lm;
		};
		return R3_tools.fixVars(nm.toString(16), hexLength);
	} else {
		return '00';
	};
};
/*
	Parse Crouch - For Set Item [ITEM_AOT_SET] R3_JS_COMPILER_parseCrouch

	Modes: 0 = Hex to Bool
		   1 = Bool to Hex
*/
tempFn_R3_SCD_JS_tools['parseCrouch'] = function(mode, input){
	var output = false;
	if (mode === 0){
		if (input !== undefined){
			output = parseInt(input);
			if (output !== 0){
				output = true;
			};
		};
	} else {
		output = '0';
		if (JSON.parse(document.getElementById(input).checked) === true){
			output = '1';
		};
	};
	return output;
};
/*
	Resident Evil 3 Opcodes Functions
	Important: If there is no flag attached, it will return default value.
*/
// 00 - Null Function [NOP]
tempFn_R3_SCD_JS['NOP'] = function(){
	return '00';
};
// 01 - End Script [EVT_END]
tempFn_R3_SCD_JS['EVT_END'] = function(){
	return '0100';
};
// 02 - Next Event [EVT_NEXT]
tempFn_R3_SCD_JS['EVT_NEXT'] = function(){
	return '02';
};
// 03 - Event Chain [EVT_CHAIN]
tempFn_R3_SCD_JS['EVT_CHAIN'] = function(){
	return '0300';
};
// 04 - Execute Event [EVT_EXEC]
tempFn_R3_SCD_JS['EVT_EXEC'] = function(evtId){
	if (evtId !== undefined){
		return '04' + R3_tools.fixVars(evtId, 2);
	} else {
		return '04ff';
	};
};
// 05 - Kill Event [EVT_KILL]
tempFn_R3_SCD_JS['EVT_KILL'] = function(evtTarget){
	return '05' + R3_tools.fixVars(evtTarget, 2);
};
// 09 - Sleep [SLEEP]
tempFn_R3_SCD_JS['SLEEP'] = function(sleeping, ticks){
	if (sleeping !== undefined && ticks !== undefined){
		return '09' + R3_tools.fixVars(sleeping, 2) + R3_tools.fixVars(ticks, 4);
	} else {
		return '090a1000';
	};
};
// 0A - Sleeping [SLEEPING]
tempFn_R3_SCD_JS['SLEEPING'] = function(ticks){
	if (ticks !== undefined){
		return '0a' + R3_tools.fixVars(ticks, 4);
	} else {
		return '0a1000';
	};
};
// 19 - Run Script [GO_SUB]
tempFn_R3_SCD_JS['GO_SUB'] = function(nextScript){
	if (nextScript !== undefined){
		var scriptId = parseInt(nextScript);
		if (scriptId > 255){
			return '19ff';
		} else {
			return '19' + R3_tools.fixVars(nextScript.toString(16).toLowerCase(), 2);
		};
	} else {
		return '1902';
	};
};
// 1C - [BREAK_POINT]
tempFn_R3_SCD_JS['BREAK_POINT'] = function(){
	return '1c';
};
// 1E - Set Timer / Value [SET_TIMER]
tempFn_R3_SCD_JS['SET_TIMER'] = function(type, value){
	return '1e' + R3_tools.fixVars(type, 2) + R3_tools.fixVars(value, 4);
};
// 20 - Execute Calculation [CALC_OP]
tempFn_R3_SCD_JS['CALC_OP'] = function(unk0, op, accmId, value){
	return '20' + R3_tools.fixVars(unk0, 2) + R3_tools.fixVars(op, 2) + R3_tools.fixVars(accmId, 2) + R3_tools.fixVars(value, 4);
};
// 22 - [EVT_CUT]
tempFn_R3_SCD_JS['EVT_CUT'] = function(value){
	return '22' + R3_tools.fixVars(value, 2);
};
// 24 - [CHASER_EVT_CLR]
tempFn_R3_SCD_JS['CHASER_EVT_CLR'] = function(){
	return '2400';
};
// 25 - Open Map [MAP_OPEN]
tempFn_R3_SCD_JS['MAP_OPEN'] = function(mapId, mapRoom){
	if (mapId !== undefined && mapRoom !== undefined){
		return '25' + R3_tools.fixVars(mapId, 2) + R3_tools.fixVars(mapRoom, 4);
	} else {
		return '25000100';
	};
};
// 26 - [POINT_ADD]
tempFn_R3_SCD_JS['POINT_ADD'] = function(data0, data1){
	return '2600' + R3_tools.fixVars(data0, 4) + R3_tools.fixVars(data1, 4);
};
// 28 - Game Over [DIEDEMO_ON]
tempFn_R3_SCD_JS['DIEDEMO_ON'] = function(){
	return '28';
};
// 2A - [PARTS_SET]
tempFn_R3_SCD_JS['PARTS_SET'] = function(id, type, value){
	return '2a00' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(type, 2) + R3_tools.fixVars(value, 4);
};
// 2B - [VLOOP_SET]
tempFn_R3_SCD_JS['VLOOP_SET'] = function(value){
	return '2b' + R3_tools.fixVars(value, 2);
};
// 2C - [OTA_BE_SET]
tempFn_R3_SCD_JS['OTA_BE_SET'] = function(data0, data1, flag){
	return '2c' + R3_tools.fixVars(data0, 2) + R3_tools.fixVars(data1, 2) + R3_SCD_JS.tools.parseFlag(flag);
};
// 2D - [LINE_START]
tempFn_R3_SCD_JS['LINE_START'] = function(id, value){
	return '2d' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(value, 4);
};
// 2F - [LINE_END]
tempFn_R3_SCD_JS['LINE_END'] = function(){
	return '2f00';
};
// 32 - Set LIT Color [LIGHT_COLOR_SET]
tempFn_R3_SCD_JS['LIGHT_COLOR_SET'] = function(litId, unk0, colorR, colorG, colorB){
	return '32' + R3_tools.fixVars(litId, 2) + R3_tools.fixVars(unk0, 2) + R3_SCD_JS.tools.parseNumber(colorR, 255, 2) + R3_SCD_JS.tools.parseNumber(colorG, 255, 2) + R3_SCD_JS.tools.parseNumber(colorB, 255, 2);
};
// 33 - [AHEAD_ROOM_SET]
tempFn_R3_SCD_JS['AHEAD_ROOM_SET'] = function(value){
	return '3300' + R3_tools.fixVars(value, 4);
};
// 37 - [OM_REV]
tempFn_R3_SCD_JS['OM_REV'] = function(omId){
	return '37' + R3_tools.fixVars(omId, 2);
};
// 38 - [CHASER_LIFE_INIT]
tempFn_R3_SCD_JS['CHASER_LIFE_INIT'] = function(id){
	return '38' + R3_tools.fixVars(id, 2);
};
// 3B - [CHASER_ITEM_SET]
tempFn_R3_SCD_JS['CHASER_ITEM_SET'] = function(emId, objId){
	return '3b' + R3_tools.fixVars(emId, 2) + R3_tools.fixVars(objId, 2);
};
// 3C - [WEAPON_CHG_OLD]
tempFn_R3_SCD_JS['WEAPON_CHG_OLD'] = function(){
	return '3c';
};
// 3D - [SEL_EVT_ON]
tempFn_R3_SCD_JS['SEL_EVT_ON'] = function(id){
	return '3d' + R3_tools.fixVars(id, 2);
};
// 3E - Remove Item [ITEM_LOST]
tempFn_R3_SCD_JS['ITEM_LOST'] = function(itemId){
	if (itemId !== undefined){
		var iId = parseInt(itemId, 16);
		if (iId > 143){
			itemId = '00';
		};
		return '3e' + R3_tools.fixVars(itemId, 2);
	} else {
		return '3e00';
	};
};
// 3F - [FLR_SET]
tempFn_R3_SCD_JS['FLR_SET'] = function(id, flag){
	return '3f' + R3_tools.fixVars(id, 2) + R3_SCD_JS.tools.parseFlag(flag);
};
// 40 - Set Variable [MEMB_SET]
tempFn_R3_SCD_JS['MEMB_SET'] = function(id, value){
	return '40' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(value, 4);
};
// 41 - Set Variable 2 [MEMB_SET2]
tempFn_R3_SCD_JS['MEMB_SET2'] = function(id, value){
	return '41' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(value, 4);
};
// 47 - Char Trigger [WORK_SET]
tempFn_R3_SCD_JS['WORK_SET'] = function(target, id){
	return '47' + R3_tools.fixVars(target, 2) + R3_tools.fixVars(id, 2);
};
// 48 - [SPD_SET]
tempFn_R3_SCD_JS['SPD_SET'] = function(id, value){
	return '48' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(value, 4);
};
// 49 - [ADD_SPD]
tempFn_R3_SCD_JS['ADD_SPD'] = function(){
	return '49';
};
// 4A - [ADD_ASPD]
tempFn_R3_SCD_JS['ADD_ASPD'] = function(){
	return '4a';
};
// 4B - [ADD_VSPD]
tempFn_R3_SCD_JS['ADD_VSPD'] = function(){
	return '4b';
};
// 4D - Set Event Value [SET]
tempFn_R3_SCD_JS['SET'] = function(evTrack, variable, flag){
	return '4d' + R3_tools.fixVars(evTrack, 2) + R3_tools.fixVars(variable, 2) + R3_SCD_JS.tools.parseFlag(flag);
};
// 50 - Change Camera [CUT_CHG]
tempFn_R3_SCD_JS['CUT_CHG'] = function(newCamera){
	if (newCamera !== undefined){
		return '50' + R3_tools.fixVars(parseInt(newCamera).toString(16), 2);
	} else {
		return '5000';
	};
};
// 51 - [CUT_OLD]
tempFn_R3_SCD_JS['CUT_OLD'] = function(){
	return '51';
};
// 52 - Lock Camera [CUT_AUTO]
tempFn_R3_SCD_JS['CUT_AUTO'] = function(lockStataus){
	if (lockStataus !== undefined){
		return '52' + R3_SCD_JS.tools.parseFlag(lockStataus);
	} else {
		return '5200';
	};
};
// 53 - Swap Camera [CUT_REPLACE]
tempFn_R3_SCD_JS['CUT_REPLACE'] = function(oldCamera, newCamera){
	if (oldCamera !== undefined && newCamera !== undefined){
		return '53' + R3_tools.fixVars(parseInt(oldCamera).toString(16), 2) + R3_tools.fixVars(parseInt(newCamera).toString(16), 2);
	} else {
		return '530000';
	};
};
// 54 - [CUT_BE_SET]
tempFn_R3_SCD_JS['CUT_BE_SET'] = function(id, value, flag){
	return '54' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(value, 2) + R3_SCD_JS.tools.parseFlag(flag);
};
// 55 - Set Target Position [POS_SET]
tempFn_R3_SCD_JS['POS_SET'] = function(target, xPos, yPos, zPos){
	return '55' + R3_tools.fixVars(target, 2) + R3_tools.fixVars(xPos, 4) + R3_tools.fixVars(zPos, 4) + R3_tools.fixVars(yPos, 4);
};
// 56 - [DIR_SET]
tempFn_R3_SCD_JS['DIR_SET'] = function(target, xPos, yPos, zPos){
	return '56' + R3_tools.fixVars(target, 2) + R3_tools.fixVars(xPos, 4) + R3_tools.fixVars(zPos, 4) + R3_tools.fixVars(yPos, 4);
};
// 57 - [SET_VIB0]
tempFn_R3_SCD_JS['SET_VIB0'] = function(data0, data1){
	return '5700' + R3_tools.fixVars(data0, 4) + R3_tools.fixVars(data1, 4);
};
// 58 - [SET_VIB1]
tempFn_R3_SCD_JS['SET_VIB1'] = function(id, data0, data1){
	return '58' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(data0, 4) + R3_tools.fixVars(data1, 4);
};
// 5A - RBJ Trigger [RBJ_SET]
tempFn_R3_SCD_JS['RBJ_SET'] = function(rbjId){
	if (rbjId !== undefined){
		return '5a' + R3_tools.fixVars(rbjId, 2);
	} else {
		return '5a00';
	};
};
// 5B - Display Message [MESSAGE_ON]
tempFn_R3_SCD_JS['MESSAGE_ON'] = function(messageId, msgData0, displayMode){
	if (messageId !== undefined && msgData0 !== undefined && displayMode !== undefined){
		if (parseInt(messageId) === NaN || parseInt(messageId) > 255){
			messageId = 0;
		};
		return '5b' + R3_tools.fixVars(messageId.toString(16), 2) + R3_tools.fixVars(msgData0, 4) + R3_tools.fixVars(displayMode, 4).toLowerCase();
	} else {
		return '5b000000ffff';
	};
};
// 5C - [RAIN_SET]
tempFn_R3_SCD_JS['RAIN_SET'] = function(rainFlag){
	return '5c' + R3_SCD_JS.tools.parseFlag(rFlag);
};
// 5D - [MESSAGE_OFF]
tempFn_R3_SCD_JS['MESSAGE_OFF'] = function(){
	return '5d';
};
// 5E - [SHAKE_ON]
tempFn_R3_SCD_JS['SHAKE_ON'] = function(shakeId, shakeValue){
	return '5e' + R3_tools.fixVars(shakeId, 2) + R3_tools.fixVars(shakeValue, 2);
};
// 5F - Change Weapon [WEAPON_CHG]
tempFn_R3_SCD_JS['WEAPON_CHG'] = function(weaponId){
	return '5f' + R3_tools.fixVars(weaponId, 2);
};
// 61 - Set Door [DOOR_AOT_SET]
tempFn_R3_SCD_JS['DOOR_AOT_SET'] = function(id, aot, XPos, YPos, ZPos, RPos, nextX, nextY, nextZ, nextR, nStage, nRoom, nCam, zIndex, type, orient, unk0, lkFlag, lkKey, dText){
	if (id !== undefined && aot !== undefined && XPos !== undefined && YPos !== undefined && ZPos !== undefined && RPos !== undefined && nextX !== undefined && nextY !== undefined && nextZ !== undefined && nextR !== undefined && nStage !== undefined && nRoom !== undefined && nCam !== undefined && zIndex !== undefined && type !== undefined && orient !== undefined && unk0 !== undefined && lkFlag !== undefined && lkKey !== undefined && dText !== undefined){
		return '61' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(aot, 8) + R3_tools.fixVars(XPos, 4) + R3_tools.fixVars(YPos, 4) + R3_tools.fixVars(ZPos, 4) +
			   R3_tools.fixVars(RPos, 4) + R3_tools.fixVars(nextX, 4) + R3_tools.fixVars(nextY, 4) + R3_tools.fixVars(nextZ, 4) + R3_tools.fixVars(nextR, 4) +
			   R3_tools.fixVars(parseInt((nStage) - 1).toString(16), 2) + R3_tools.fixVars(nRoom, 2) + R3_tools.fixVars(parseInt(nCam).toString(16), 2) + R3_tools.fixVars(zIndex, 2) +
			   R3_tools.fixVars(type, 2) + R3_tools.fixVars(orient, 2) + R3_tools.fixVars(unk0, 2) + R3_tools.fixVars(lkFlag, 2) + R3_tools.fixVars(lkKey, 2) + R3_tools.fixVars(dText, 2);
	} else {
		return '61' + R3_SCD_getFreeIdForFunction() + '012100000000000000000000000000000000000000000000000000000000';
	};
};
// 62 - Set Door 4P [DOOR_AOT_SET_4P]
tempFn_R3_SCD_JS['DOOR_AOT_SET_4P'] = function(id, aot, XPos, YPos, ZPos, RPos, D4P, nextX, nextY, nextZ, nextR, nStage, nRoom, nCam, zIndex, type, orient, unk0, lkFlag, lkKey, dText){
	if (id !== undefined && aot !== undefined && XPos !== undefined && YPos !== undefined && ZPos !== undefined && RPos !== undefined && D4P !== undefined && nextX !== undefined && nextY !== undefined && nextZ !== undefined && nextR !== undefined && nStage !== undefined && nRoom !== undefined && nCam !== undefined && zIndex !== undefined && type !== undefined && orient !== undefined && unk0 !== undefined && lkFlag !== undefined && lkKey !== undefined && dText !== undefined){
		return '62' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(aot, 8) + R3_tools.fixVars(XPos, 4) + R3_tools.fixVars(YPos, 4) + R3_tools.fixVars(ZPos, 4) +
					  R3_tools.fixVars(RPos, 4) + R3_tools.fixVars(D4P, 16) + R3_tools.fixVars(nextX, 4) + R3_tools.fixVars(nextY, 4) + R3_tools.fixVars(nextZ, 4) +
					  R3_tools.fixVars(nextR, 4) + R3_tools.fixVars(parseInt((nStage) - 1).toString(16), 2) + R3_tools.fixVars(nRoom, 2) + R3_tools.fixVars(parseInt(nCam).toString(16), 2) +
					  R3_tools.fixVars(zIndex, 2) + R3_tools.fixVars(type, 2) + R3_tools.fixVars(orient, 2) + R3_tools.fixVars(unk0, 2) + R3_tools.fixVars(lkFlag, 2) + R3_tools.fixVars(lkKey, 2) + R3_tools.fixVars(dText, 2);
	} else {
		return '62' + R3_SCD_getFreeIdForFunction() + '0000000000000000000000000000000000000000000000000000000000000000000000000000';
	};
};
// 66 - Run Interactive Object [AOT_ON]
tempFn_R3_SCD_JS['AOT_ON'] = function(aotId){
	if (aotId !== undefined){
		return '66' + R3_tools.fixVars(aotId, 2);
	} else {
		return '6600';
	};
};
// 67 - Set Item [ITEM_AOT_SET]
tempFn_R3_SCD_JS['ITEM_AOT_SET'] = function(id, aot, itemX, itemY, itemZ, itemR, itemCode, itemQuant, itemFlag, modelId, itemMp){
	if (id !== undefined && aot !== undefined && itemX !== undefined && itemY !== undefined && itemZ !== undefined && itemR !== undefined && itemCode !== undefined && itemQuant !== undefined && itemFlag !== undefined && modelId !== undefined && itemMp !== undefined){
		return '67' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(aot, 8) + R3_tools.fixVars(itemX, 4) + R3_tools.fixVars(itemY, 4) + R3_tools.fixVars(itemZ, 4) +
			   R3_tools.fixVars(itemR, 4) + R3_tools.fixVars(itemCode, 2) + '00' + R3_SCD_JS.tools.parseNumber(itemQuant, 255, 2) + '0000' + R3_tools.fixVars(itemFlag, 2) +
			   R3_tools.fixVars(modelId, 2) + R3_tools.fixVars(itemMp, 2);
	} else {
		return '67' + R3_SCD_getFreeIdForFunction() + '0231000000000000000000000100010000000000';
	};
};
// 68 - Set Item 4P [ITEM_AOT_SET]
tempFn_R3_SCD_JS['ITEM_AOT_SET_4P'] = function(id, aot, itemX, itemY, itemZ, itemR, item4P, itemCode, itemQuant, itemFlag, modelId, itemMp){
	if (id !== undefined && aot !== undefined && itemX !== undefined && itemY !== undefined && itemZ !== undefined && itemR !== undefined && item4P !== undefined && itemCode !== undefined && itemQuant !== undefined && itemFlag !== undefined && modelId !== undefined && itemMp !== undefined){
		return '68' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(aot, 8) + R3_tools.fixVars(itemX, 4) + R3_tools.fixVars(itemY, 4) + R3_tools.fixVars(itemZ, 4) +
			   R3_tools.fixVars(itemR, 4) + R3_tools.fixVars(item4P, 16) + R3_tools.fixVars(itemCode, 2) + '00' + R3_SCD_JS.tools.parseNumber(itemQuant, 255, 2) + '0000' +
			   R3_tools.fixVars(itemFlag, 2) + R3_tools.fixVars(modelId, 2) + R3_tools.fixVars(itemMp, 2);
	} else {
		return '68' + R3_SCD_getFreeIdForFunction() + '02310000000000000000000000000000000000000100010000000000';
	};
};
// 6E - [SCA_ID_SET]
tempFn_R3_SCD_JS['SCA_ID_SET'] = function(id, value){
	return '6e' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(value, 4);
};
// 75 - [ESPR_KILL2]
tempFn_R3_SCD_JS['ESPR_KILL2'] = function(esprId){
	return '75' + R3_tools.fixVars(esprId, 2);
};
// 76 - [ESPR_KILL_ALL]
tempFn_R3_SCD_JS['ESPR_KILL_ALL'] = function(esprId, esprValue){
	return '76' + R3_tools.fixVars(esprId, 2) + R3_tools.fixVars(esprValue, 2);
};
// 78 - [BGM_CTL]
tempFn_R3_SCD_JS['BGM_CTL'] = function(id, op, type, value, volume){
	return '78' + R3_tools.fixVars(id, 2) + R3_tools.fixVars(op, 2) + R3_tools.fixVars(type, 2) + R3_tools.fixVars(value, 2) + R3_tools.fixVars(volume.toString(16), 2);
};
// 79 - [XA_ON]
tempFn_R3_SCD_JS['XA_ON'] = function(xaId, xaData){
	return '79' + R3_tools.fixVars(xaId, 2) + R3_tools.fixVars(xaData, 4);
};
// 7A - Call Cinematic [MOVIE_ON]
tempFn_R3_SCD_JS['MOVIE_ON'] = function(movieId){
	if (movieId !== undefined){
		return '7a' + R3_tools.fixVars(movieId, 2);
	} else {
		return '7a00';
	};
};
// 7B - [BGM_TBL_SET]
tempFn_R3_SCD_JS['BGM_TBL_SET'] = function(id0, id1, type){
	return '7b00' + R3_tools.fixVars(id0, 2) + R3_tools.fixVars(id1, 2) + R3_tools.fixVars(type, 4);
};
// 7C - Open Inventory [STATUS_ON]
tempFn_R3_SCD_JS['STATUS_ON'] = function(){
	return '7c';
};
// 7E - [MIZU_DIV]
tempFn_R3_SCD_JS['MIZU_DIV'] = function(mizuId){
	if (mizuId !== undefined){
		return '7e' + R3_tools.fixVars(mizuId, 2);
	} else {
		return '7e00';
	};
};
// 80 - Motion Trigger [PLC_MOTION]
tempFn_R3_SCD_JS['PLC_MOTION'] = function(plcId, plcValue, plcType){
	return '80' + R3_tools.fixVars(plcId, 2) + R3_tools.fixVars(plcValue, 2) + R3_tools.fixVars(plcType, 2);
};
// 81 - Set Animation DEST [PLC_DEST]
tempFn_R3_SCD_JS['PLC_DEST'] = function(animType, animMod, data0, data1){
	if (animType !== undefined && animMod !== undefined && data0 !== undefined && data1 !== undefined){
		return '8100' + R3_tools.fixVars(animType, 2) + R3_tools.fixVars(animMod, 2) + R3_tools.fixVars(data0, 4) + R3_tools.fixVars(data1, 4);
	} else {
		return '8100042000000000';
	};
};
// 82 - Set Head Animation [PLC_NECK]
tempFn_R3_SCD_JS['PLC_NECK'] = function(animType, animRepeat, data0, data1, data2, data3, animSpeed){
	return '82' + R3_tools.fixVars(animType, 2) + R3_tools.fixVars(animRepeat, 2) + R3_tools.fixVars(data0, 2) + R3_tools.fixVars(data1, 4) + R3_tools.fixVars(data2, 4) + R3_tools.fixVars(data3, 2) + R3_tools.fixVars(animSpeed, 2);
};
// 83 - Player Return [PLC_RET]
tempFn_R3_SCD_JS['PLC_RET'] = function(){
	return '83';
};
// 84 - [PLC_FLG]
tempFn_R3_SCD_JS['PLC_FLG'] = function(plcId, plcValue){
	return '84' + R3_tools.fixVars(plcId, 2) + R3_tools.fixVars(plcValue, 4);
};
// 85 - [PLC_GUN]
tempFn_R3_SCD_JS['PLC_GUN'] = function(plcId){
	return '85' + R3_tools.fixVars(plcId, 2);
};
// 86 - [PLC_GUN_EFF]
tempFn_R3_SCD_JS['PLC_GUN_EFF'] = function(){
	return '86';
};
// 87 - [PLC_STOP]
tempFn_R3_SCD_JS['PLC_STOP'] = function(){
	return '87';
};
// 88 - [PLC_ROT]
tempFn_R3_SCD_JS['PLC_ROT'] = function(plcId, plcValue){
	return '88' + R3_tools.fixVars(plcId, 2) + R3_tools.fixVars(plcValue, 4);
};
// 89 - [PLC_CNT]
tempFn_R3_SCD_JS['PLC_CNT'] = function(targetId){
	return '89' + R3_tools.fixVars(targetId, 2);
};
// 8A - [SLPC_RET]
tempFn_R3_SCD_JS['SLPC_RET'] = function(){
	return '8a';
};
// 8B - [SLPC_SCD]
tempFn_R3_SCD_JS['SLPC_SCD'] = function(){
	return '8b';
};
// 8C - [PLC_SCE]
tempFn_R3_SCD_JS['PLC_SCE'] = function(){
	return '8c';
};
// 8D - [SPL_WEAPON_CHG]
tempFn_R3_SCD_JS['SPL_WEAPON_CHG'] = function(){
	return '8d';
};
// 8E - [PLC_MOT_NUM]
tempFn_R3_SCD_JS['PLC_MOT_NUM'] = function(plcId, plcValue){
	return '8e' + R3_tools.fixVars(plcId, 2) + R3_tools.fixVars(plcValue, 4);
};
// 8F - Reset Enemy Animation [EM_RESET]
tempFn_R3_SCD_JS['EM_RESET'] = function(targetId){
	return '8f' + R3_tools.fixVars(targetId, 2);
};
/*
	End
*/
tempFn_R3_SCD_JS['tools'] = tempFn_R3_SCD_JS_tools;
const R3_SCD_JS = tempFn_R3_SCD_JS;
delete tempFn_R3_SCD_JS;
delete tempFn_R3_SCD_JS_tools;