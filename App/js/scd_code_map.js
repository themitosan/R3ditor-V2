/*
	R3ditor V2 - scd_code_map.js
	Okay... This is experimental!

	This file contains all SCD functions converted to JS and should be used to compile scripts.

	JS Compiler Utils
*/
// Parse Flags
function R3_JS_COMPILER_parseFlag(flag){
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
function R3_JS_COMPILER_parseNumber(n, numLimit, hexLength){
	if (n !== undefined && numLimit !== undefined && hexLength !== undefined){
		var nm = parseInt(n), lm = parseInt(numLimit);
		if (nm > lm){
			nm = lm;
		};
		return MEMORY_JS_fixVars(nm.toString(16), hexLength);
	} else {
		return '00';
	};
};
/*
	Parse Crouch - For Set Item [ITEM_AOT_SET]

	Modes: 0 = Hex to Bool
		   1 = Bool to Hex
*/
function R3_JS_COMPILER_parseCrouch(mode, input){
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
	Important: If there is no flag attached, it will return default value 
*/
// 00 - Null Function [NOP]
function R3_NOP(){
	return '00';
};
// 01 - End Script [EVT_END]
function R3_EVT_END(){
	return '0100';
};
// 02 - Next Event [EVT_NEXT]
function R3_EVT_NEXT(){
	return '02';
};
// 03 - Event Chain [EVT_CHAIN]
function R3_EVT_CHAIN(){
	return '0300';
};
// 04 - Execute Event [EVT_EXEC]
function R3_EVT_EXEC(evtId){
	if (evtId !== undefined){
		return '04' + MEMORY_JS_fixVars(evtId, 2);
	} else {
		return '04ff';
	};
};
// 05 - Kill Event [EVT_KILL]
function R3_EVT_KILL(evtTarget){
	return '05' + MEMORY_JS_fixVars(evtTarget, 2);
};
// 09 - Sleep [SLEEP]
function R3_SLEEP(sleeping, ticks){
	if (sleeping !== undefined && ticks !== undefined){
		return '09' + MEMORY_JS_fixVars(sleeping, 2) + MEMORY_JS_fixVars(ticks, 4);
	} else {
		return '090a1000';
	};
};
// 0A - Sleeping [SLEEPING]
function R3_SLEEPING(ticks){
	if (ticks !== undefined){
		return '0a' + MEMORY_JS_fixVars(ticks, 4);
	} else {
		return '0a1000';
	};
};
// 19 - Run Script [GO_SUB]
function R3_GO_SUB(nextScript){
	if (nextScript !== undefined){
		var scriptId = parseInt(nextScript);
		if (scriptId > 255){
			return '19ff';
		} else {
			return '19' + MEMORY_JS_fixVars(nextScript.toString(16).toLowerCase(), 2);
		};
	} else {
		return '1902';
	};
};
// 1C - [BREAK_POINT]
function R3_BREAK_POINT(){
	return '1c';
};
// 1E - Set Timer / Value [SET_TIMER]
function R3_SET_TIMER(type, value){
	return '1e' + MEMORY_JS_fixVars(type, 2) + MEMORY_JS_fixVars(value, 4);
};
// 20 - Execute Calculation [CALC_OP]
function R3_CALC_OP(unk0, op, accmId, value){
	return '20' + MEMORY_JS_fixVars(unk0, 2) + MEMORY_JS_fixVars(op, 2) + MEMORY_JS_fixVars(accmId, 2) + MEMORY_JS_fixVars(value, 4);
};
// 22 - [EVT_CUT]
function R3_EVT_CUT(value){
	return '22' + MEMORY_JS_fixVars(value, 2);
};
// 24 - [CHASER_EVT_CLR]
function R3_CHASER_EVT_CLR(){
	return '2400';
};
// 25 - Open Map [MAP_OPEN]
function R3_MAP_OPEN(mapId, mapRoom){
	if (mapId !== undefined && mapRoom !== undefined){
		return '25' + MEMORY_JS_fixVars(mapId, 2) + MEMORY_JS_fixVars(mapRoom, 4);
	} else {
		return '25000100';
	};
};
// 26 - [POINT_ADD]
function R3_POINT_ADD(data0, data1){
	return '2600' + MEMORY_JS_fixVars(data0, 4) + MEMORY_JS_fixVars(data1, 4);
};
// 28 - Game Over [DIEDEMO_ON]
function R3_DIEDEMO_ON(){
	return '28';
};
// 2A - [PARTS_SET]
function R3_PARTS_SET(id, type, value){
	return '2a00' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(type, 2) + MEMORY_JS_fixVars(value, 4);
};
// 2B - [VLOOP_SET]
function R3_VLOOP_SET(value){
	return '2b' + MEMORY_JS_fixVars(value, 2);
};
// 2C - [OTA_BE_SET]
function R3_OTA_BE_SET(data0, data1, flag){
	return '2c' + MEMORY_JS_fixVars(data0, 2) + MEMORY_JS_fixVars(data1, 2) + R3_JS_COMPILER_parseFlag(flag);
};
// 2D - [LINE_START]
function R3_LINE_START(id, value){
	return '2d' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(value, 4);
};
// 2F - [LINE_END]
function R3_LINE_END(){
	return '2f00';
};
// 32 - Set LIT Color [LIGHT_COLOR_SET]
function R3_LIGHT_COLOR_SET(litId, unk0, colorR, colorG, colorB){
	return '32' + MEMORY_JS_fixVars(litId, 2) + MEMORY_JS_fixVars(unk0, 2) + R3_JS_COMPILER_parseNumber(colorR, 255, 2) + R3_JS_COMPILER_parseNumber(colorG, 255, 2) + R3_JS_COMPILER_parseNumber(colorB, 255, 2);
};
// 33 - [AHEAD_ROOM_SET]
function R3_AHEAD_ROOM_SET(value){
	return '3300' + MEMORY_JS_fixVars(value, 4);
};
// 37 - [OM_REV]
function R3_OM_REV(omId){
	return '37' + MEMORY_JS_fixVars(omId, 2);
};
// 38 - [CHASER_LIFE_INIT]
function R3_CHASER_LIFE_INIT(id){
	return '38' + MEMORY_JS_fixVars(id, 2);
};
// 3B - [CHASER_ITEM_SET]
function R3_CHASER_ITEM_SET(emId, objId){
	return '3b' + MEMORY_JS_fixVars(emId, 2) + MEMORY_JS_fixVars(objId, 2);
};
// 3C - [WEAPON_CHG_OLD]
function R3_WEAPON_CHG_OLD(){
	return '3c';
};
// 3D - [SEL_EVT_ON]
function R3_SEL_EVT_ON(id){
	return '3d' + MEMORY_JS_fixVars(id, 2);
};
// 3E - Remove Item [ITEM_LOST]
function R3_ITEM_LOST(itemId){
	if (itemId !== undefined){
		var iId = parseInt(itemId, 16);
		if (iId > 143){
			itemId = '00';
		};
		return '3e' + MEMORY_JS_fixVars(itemId, 2);
	} else {
		return '3e00';
	};
};
// 3F - [FLR_SET]
function R3_FLR_SET(id, flag){
	return '3f' + MEMORY_JS_fixVars(id, 2) + R3_JS_COMPILER_parseFlag(flag);
};
// 40 - Set Variable [MEMB_SET]
function R3_MEMB_SET(id, value){
	return '40' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(value, 4);
};
// 41 - Set Variable 2 [MEMB_SET2]
function R3_MEMB_SET2(id, value){
	return '41' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(value, 4);
};
// 47 - Char Trigger [WORK_SET]
function R3_WORK_SET(target, id){
	return '47' + MEMORY_JS_fixVars(target, 2) + MEMORY_JS_fixVars(id, 2);
};
// 48 - [SPD_SET]
function R3_SPD_SET(id, value){
	return '48' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(value, 4);
};
// 49 - [ADD_SPD]
function R3_ADD_SPD(){
	return '49';
};
// 4A - [ADD_ASPD]
function R3_ADD_ASPD(){
	return '4a';
};
// 4B - [ADD_VSPD]
function R3_ADD_VSPD(){
	return '4b';
};
// 4D - Set Event Value [SET]
function R3_SET(evTrack, variable, flag){
	return '4d' + MEMORY_JS_fixVars(evTrack, 2) + MEMORY_JS_fixVars(variable, 2) + R3_JS_COMPILER_parseFlag(flag);
};
// 50 - Change Camera [CUT_CHG]
function R3_CUT_CHG(newCamera){
	if (newCamera !== undefined){
		return '50' + MEMORY_JS_fixVars(parseInt(newCamera).toString(16), 2);
	} else {
		return '5000';
	};
};
// 51 - [CUT_OLD]
function R3_CUT_OLD(){
	return '51';
};
// 52 - Lock Camera [CUT_AUTO]
function R3_CUT_AUTO(lockStataus){
	if (lockStataus !== undefined){
		return '52' + R3_JS_COMPILER_parseFlag(lockStataus);
	} else {
		return '5200';
	};
};
// 53 - Swap Camera [CUT_REPLACE]
function R3_CUT_REPLACE(oldCamera, newCamera){
	if (oldCamera !== undefined && newCamera !== undefined){
		return '53' + MEMORY_JS_fixVars(parseInt(oldCamera).toString(16), 2) + MEMORY_JS_fixVars(parseInt(newCamera).toString(16), 2);
	} else {
		return '530000';
	};
};
// 54 - [CUT_BE_SET]
function R3_CUT_BE_SET(id, value, flag){
	return '54' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(value, 2) + R3_JS_COMPILER_parseFlag(flag);
};
// 55 - Set Target Position [POS_SET]
function R3_POS_SET(target, xPos, yPos, zPos){
	return '55' + MEMORY_JS_fixVars(target, 2) + MEMORY_JS_fixVars(xPos, 4) + MEMORY_JS_fixVars(zPos, 4) + MEMORY_JS_fixVars(yPos, 4);
};
// 56 - [DIR_SET]
function R3_DIR_SET(target, xPos, yPos, zPos){
	return '56' + MEMORY_JS_fixVars(target, 2) + MEMORY_JS_fixVars(xPos, 4) + MEMORY_JS_fixVars(zPos, 4) + MEMORY_JS_fixVars(yPos, 4);
};
// 57 - [SET_VIB0]
function R3_SET_VIB0(data0, data1){
	return '5700' + MEMORY_JS_fixVars(data0, 4) + MEMORY_JS_fixVars(data1, 4);
};
// 58 - [SET_VIB1]
function R3_SET_VIB1(id, data0, data1){
	return '58' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(data0, 4) + MEMORY_JS_fixVars(data1, 4);
};
// 5A - RBJ Trigger [RBJ_SET]
function R3_RBJ_SET(rbjId){
	if (rbjId !== undefined){
		return '5a' + MEMORY_JS_fixVars(rbjId, 2);
	} else {
		return '5a00';
	};
};
// 5B - Display Message [MESSAGE_ON]
function R3_MESSAGE_ON(messageId, msgData0, displayMode){
	if (messageId !== undefined && msgData0 !== undefined && displayMode !== undefined){
		if (parseInt(messageId) === NaN || parseInt(messageId) > 255){
			messageId = 0;
		};
		return '5b' + MEMORY_JS_fixVars(messageId.toString(16), 2) + MEMORY_JS_fixVars(msgData0, 4) + MEMORY_JS_fixVars(displayMode, 4).toLowerCase();
	} else {
		return '5b000000ffff';
	};
};
// 5C - [RAIN_SET]
function R3_RAIN_SET(rainFlag){
	return '5c' + R3_JS_COMPILER_parseFlag(rFlag);
};
// 5D - [MESSAGE_OFF]
function R3_MESSAGE_OFF(){
	return '5d';
};
// 5E - [SHAKE_ON]
function R3_SHAKE_ON(shakeId, shakeValue){
	return '5e' + MEMORY_JS_fixVars(shakeId, 2) + MEMORY_JS_fixVars(shakeValue, 2);
};
// 5F - Change Weapon [WEAPON_CHG]
function R3_WEAPON_CHG(weaponId){
	return '5f' + MEMORY_JS_fixVars(weaponId, 2);
};
// 61 - Set Door [DOOR_AOT_SET]
function R3_DOOR_AOT_SET(id, aot, XPos, YPos, ZPos, RPos, nextX, nextY, nextZ, nextR, nStage, nRoom, nCam, zIndex, type, orient, unk0, lkFlag, lkKey, dText){
	if (id !== undefined && aot !== undefined && XPos !== undefined && YPos !== undefined && ZPos !== undefined && RPos !== undefined && nextX !== undefined && nextY !== undefined && nextZ !== undefined && nextR !== undefined && nStage !== undefined && nRoom !== undefined && nCam !== undefined && zIndex !== undefined && type !== undefined && orient !== undefined && unk0 !== undefined && lkFlag !== undefined && lkKey !== undefined && dText !== undefined){
		return '61' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(aot, 8) + MEMORY_JS_fixVars(XPos, 4) + MEMORY_JS_fixVars(YPos, 4) + MEMORY_JS_fixVars(ZPos, 4) +
			   MEMORY_JS_fixVars(RPos, 4) + MEMORY_JS_fixVars(nextX, 4) + MEMORY_JS_fixVars(nextY, 4) + MEMORY_JS_fixVars(nextZ, 4) + MEMORY_JS_fixVars(nextR, 4) +
			   MEMORY_JS_fixVars(parseInt((nStage) - 1).toString(16), 2) + MEMORY_JS_fixVars(nRoom, 2) + MEMORY_JS_fixVars(parseInt(nCam).toString(16), 2) + MEMORY_JS_fixVars(zIndex, 2) +
			   MEMORY_JS_fixVars(type, 2) + MEMORY_JS_fixVars(orient, 2) + MEMORY_JS_fixVars(unk0, 2) + MEMORY_JS_fixVars(lkFlag, 2) + MEMORY_JS_fixVars(lkKey, 2) + MEMORY_JS_fixVars(dText, 2);
	} else {
		return '61' + R3_SCD_getFreeIdForFunction() + '012100000000000000000000000000000000000000000000000000000000';
	};
};
// 62 - Set Door 4P [DOOR_AOT_SET_4P]
function R3_DOOR_AOT_SET_4P(id, aot, XPos, YPos, ZPos, RPos, D4P, nextX, nextY, nextZ, nextR, nStage, nRoom, nCam, zIndex, type, orient, unk0, lkFlag, lkKey, dText){
	if (id !== undefined && aot !== undefined && XPos !== undefined && YPos !== undefined && ZPos !== undefined && RPos !== undefined && D4P !== undefined && nextX !== undefined && nextY !== undefined && nextZ !== undefined && nextR !== undefined && nStage !== undefined && nRoom !== undefined && nCam !== undefined && zIndex !== undefined && type !== undefined && orient !== undefined && unk0 !== undefined && lkFlag !== undefined && lkKey !== undefined && dText !== undefined){
		return '62' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(aot, 8) + MEMORY_JS_fixVars(XPos, 4) + MEMORY_JS_fixVars(YPos, 4) + MEMORY_JS_fixVars(ZPos, 4) +
					  MEMORY_JS_fixVars(RPos, 4) + MEMORY_JS_fixVars(D4P, 16) + MEMORY_JS_fixVars(nextX, 4) + MEMORY_JS_fixVars(nextY, 4) + MEMORY_JS_fixVars(nextZ, 4) +
					  MEMORY_JS_fixVars(nextR, 4) + MEMORY_JS_fixVars(parseInt((nStage) - 1).toString(16), 2) + MEMORY_JS_fixVars(nRoom, 2) + MEMORY_JS_fixVars(parseInt(nCam).toString(16), 2) +
					  MEMORY_JS_fixVars(zIndex, 2) + MEMORY_JS_fixVars(type, 2) + MEMORY_JS_fixVars(orient, 2) + MEMORY_JS_fixVars(unk0, 2) + MEMORY_JS_fixVars(lkFlag, 2) + MEMORY_JS_fixVars(lkKey, 2) + MEMORY_JS_fixVars(dText, 2);
	} else {
		return '62' + R3_SCD_getFreeIdForFunction() + '0000000000000000000000000000000000000000000000000000000000000000000000000000';
	};
};
// 66 - Run Interactive Object [AOT_ON]
function R3_AOT_ON(aotId){
	if (aotId !== undefined){
		return '66' + MEMORY_JS_fixVars(aotId, 2);
	} else {
		return '6600';
	};
};
// 67 - Set Item [ITEM_AOT_SET]
function R3_ITEM_AOT_SET(id, aot, itemX, itemY, itemZ, itemR, itemCode, itemQuant, itemFlag, modelId, itemMp){
	if (id !== undefined && aot !== undefined && itemX !== undefined && itemY !== undefined && itemZ !== undefined && itemR !== undefined && itemCode !== undefined && itemQuant !== undefined && itemFlag !== undefined && modelId !== undefined && itemMp !== undefined){
		return '67' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(aot, 8) + MEMORY_JS_fixVars(itemX, 4) + MEMORY_JS_fixVars(itemY, 4) + MEMORY_JS_fixVars(itemZ, 4) +
			   MEMORY_JS_fixVars(itemR, 4) + MEMORY_JS_fixVars(itemCode, 2) + '00' + R3_JS_COMPILER_parseNumber(itemQuant, 255, 2) + '0000' + MEMORY_JS_fixVars(itemFlag, 2) +
			   MEMORY_JS_fixVars(modelId, 2) + MEMORY_JS_fixVars(itemMp, 2);
	} else {
		return '67' + R3_SCD_getFreeIdForFunction() + '0231000000000000000000000100010000000000';
	};
};
// 68 - Set Item 4P [ITEM_AOT_SET]
function R3_ITEM_AOT_SET_4P(id, aot, itemX, itemY, itemZ, itemR, item4P, itemCode, itemQuant, itemFlag, modelId, itemMp){
	if (id !== undefined && aot !== undefined && itemX !== undefined && itemY !== undefined && itemZ !== undefined && itemR !== undefined && item4P !== undefined && itemCode !== undefined && itemQuant !== undefined && itemFlag !== undefined && modelId !== undefined && itemMp !== undefined){
		return '68' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(aot, 8) + MEMORY_JS_fixVars(itemX, 4) + MEMORY_JS_fixVars(itemY, 4) + MEMORY_JS_fixVars(itemZ, 4) +
			   MEMORY_JS_fixVars(itemR, 4) + MEMORY_JS_fixVars(item4P, 16) + MEMORY_JS_fixVars(itemCode, 2) + '00' + R3_JS_COMPILER_parseNumber(itemQuant, 255, 2) + '0000' +
			   MEMORY_JS_fixVars(itemFlag, 2) + MEMORY_JS_fixVars(modelId, 2) + MEMORY_JS_fixVars(itemMp, 2);
	} else {
		return '68' + R3_SCD_getFreeIdForFunction() + '02310000000000000000000000000000000000000100010000000000';
	};
};
// 6E - [SCA_ID_SET]
function R3_SCA_ID_SET(id, value){
	return '6e' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(value, 4);
};
// 75 - [ESPR_KILL2]
function R3_ESPR_KILL2(esprId){
	return '75' + MEMORY_JS_fixVars(esprId, 2);
};
// 76 - [ESPR_KILL_ALL]
function R3_ESPR_KILL_ALL(esprId, esprValue){
	return '76' + MEMORY_JS_fixVars(esprId, 2) + MEMORY_JS_fixVars(esprValue, 2);
};
// 78 - [BGM_CTL]
function R3_BGM_CTL(id, op, type, value, volume){
	return '78' + MEMORY_JS_fixVars(id, 2) + MEMORY_JS_fixVars(op, 2) + MEMORY_JS_fixVars(type, 2) + MEMORY_JS_fixVars(value, 2) + MEMORY_JS_fixVars(volume.toString(16), 2);
};
// 79 - [XA_ON]
function R3_XA_ON(xaId, xaData){
	return '79' + MEMORY_JS_fixVars(xaId, 2) + MEMORY_JS_fixVars(xaData, 4);
};
// 7A - Call Cinematic [MOVIE_ON]
function R3_MOVIE_ON(movieId){
	if (movieId !== undefined){
		return '7a' + MEMORY_JS_fixVars(movieId, 2);
	} else {
		return '7a00';
	};
};
// 7B - [BGM_TBL_SET]
function R3_BGM_TBL_SET(id0, id1, type){
	return '7b00' + MEMORY_JS_fixVars(id0, 2) + MEMORY_JS_fixVars(id1, 2) + MEMORY_JS_fixVars(type, 4);
};
// 7C - Open Inventory [STATUS_ON]
function R3_STATUS_ON(){
	return '7c';
};
// 7E - [MIZU_DIV]
function R3_MIZU_DIV(mizuId){
	if (mizuId !== undefined){
		return '7e' + MEMORY_JS_fixVars(mizuId, 2);
	} else {
		return '7e00';
	};
};
// 80 - Motion Trigger [PLC_MOTION]
function R3_PLC_MOTION(plcId, plcValue, plcType){
	return '80' + MEMORY_JS_fixVars(plcId, 2) + MEMORY_JS_fixVars(plcValue, 2) + MEMORY_JS_fixVars(plcType, 2);
};
// 81 - Set Animation DEST [PLC_DEST]
function R3_PLC_DEST(animType, animMod, data0, data1){
	if (animType !== undefined && animMod !== undefined && data0 !== undefined && data1 !== undefined){
		return '8100' + MEMORY_JS_fixVars(animType, 2) + MEMORY_JS_fixVars(animMod, 2) + MEMORY_JS_fixVars(data0, 4) + MEMORY_JS_fixVars(data1, 4);
	} else {
		return '8100042000000000';
	};
};
// 82 - Set Head Animation [PLC_NECK]
function R3_PLC_NECK(animType, animRepeat, data0, data1, data2, data3, animSpeed){
	return '82' + MEMORY_JS_fixVars(animType, 2) + MEMORY_JS_fixVars(animRepeat, 2) + MEMORY_JS_fixVars(data0, 2) + MEMORY_JS_fixVars(data1, 4) + MEMORY_JS_fixVars(data2, 4) + MEMORY_JS_fixVars(data3, 2) + MEMORY_JS_fixVars(animSpeed, 2);
};
// 83 - Player Return [PLC_RET]
function R3_PLC_RET(){
	return '83';
};
// 84 - [PLC_FLG]
function R3_PLC_FLG(plcId, plcValue){
	return '84' + MEMORY_JS_fixVars(plcId, 2) + MEMORY_JS_fixVars(plcValue, 4);
};
// 85 - [PLC_GUN]
function R3_PLC_GUN(plcId){
	return '85' + MEMORY_JS_fixVars(plcId, 2);
};
// 86 - [PLC_GUN_EFF]
function R3_PLC_GUN_EFF(){
	return '86';
};
// 87 - [PLC_STOP]
function R3_PLC_STOP(){
	return '87';
};
// 88 - [PLC_ROT]
function R3_PLC_ROT(plcId, plcValue){
	return '88' + MEMORY_JS_fixVars(plcId, 2) + MEMORY_JS_fixVars(plcValue, 4);
};
// 89 - [PLC_CNT]
function R3_PLC_CNT(targetId){
	return '89' + MEMORY_JS_fixVars(targetId, 2);
};
// 8A - [SLPC_RET]
function R3_SLPC_RET(){
	return '8a';
};
// 8B - [SLPC_SCD]
function R3_SLPC_SCD(){
	return '8b';
};
// 8C - [PLC_SCE]
function R3_PLC_SCE(){
	return '8c';
};
// 8D - [SPL_WEAPON_CHG]
function R3_SPL_WEAPON_CHG(){
	return '8d';
};
// 8E - [PLC_MOT_NUM]
function R3_PLC_MOT_NUM(plcId, plcValue){
	return '8e' + MEMORY_JS_fixVars(plcId, 2) + MEMORY_JS_fixVars(plcValue, 4);
};
// 8F - Reset Enemy Animation [EM_RESET]
function R3_EM_RESET(targetId){
	return '8f' + MEMORY_JS_fixVars(targetId, 2);
};