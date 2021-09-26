/*
	R3ditor V2 - rid.js
	Agora vai mah!
*/
var RID_arquivoBruto,
	RID_cameraList = [],
	RID_currentCamera = 0;
/*
	Functions
*/
/*
	Start Decompiler
*/
function R3_RID_START_DECOMPILER(){
	if (RID_arquivoBruto !== undefined){
		var tempCamList = RID_cameraList, tempHex = HTML_TEMPLATE = '';
		R3_DESIGN_CLEAN_RID();
		R3_UTILS_VAR_CLEAN_RID();
		RID_cameraList = tempCamList;
		// Add Cameras on Interface
		RID_cameraList.forEach(function(cItem, cIndex){
			tempHex = tempHex + cItem;
			HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_SCRIPT_LIST_ITEM R3_SCRIPT_LIST_ITEM_NORMAL" id="R3_RID_CAM_' + cIndex + '">Camera ' + cIndex + 
							'<input type="button" value="Load Camera" onclick="R3_RID_OPEN_CAMERA(' + cIndex + ');" class="BTN_R3CLASSIC R3_SCRIPT_LIST_ITEM_BTN" ' +
							'title="Click here to edit camera ' + cIndex + '"></div>';
		});
		RID_arquivoBruto = tempHex;
		document.getElementById('R3_RID_CAMERA_LIST_HOLDER').innerHTML = HTML_TEMPLATE;
		// End
		R3_RID_OPEN_CAMERA(0);
	} else {
		R3_SYSTEM.log('error', 'R3ditor V2 - WARN: Unable to read RID! <br>Reason: RID is not defined!');
	};
};
// Extract Camera
function R3_RID_OPEN_CAMERA(cameraId){
	if (cameraId !== undefined){
		var cId = parseInt(cameraId), RID_rawCam = RID_cameraList[cId],
			RID_type = RID_rawCam.slice(R3_RID_DEC_DB.type[0], R3_RID_DEC_DB.type[1]),
			RID_unk0 = RID_rawCam.slice(R3_RID_DEC_DB.unk0[0], R3_RID_DEC_DB.unk0[1]),
			RID_X = parseInt(R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.posX[0], R3_RID_DEC_DB.posX[1])).toString(), 16),
			RID_Y = parseInt(R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.posY[0], R3_RID_DEC_DB.posY[1])).toString(), 16),
			RID_Z = parseInt(R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.posZ[0], R3_RID_DEC_DB.posZ[1])).toString(), 16),
			RID_R = parseInt(R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.posR[0], R3_RID_DEC_DB.posR[1])).toString(), 16),
			RID_unk1 = R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.unk1[0], R3_RID_DEC_DB.unk1[1])),
			RID_unk2 = R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.unk2[0], R3_RID_DEC_DB.unk2[1])),
			RID_unk3 = R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.unk3[0], R3_RID_DEC_DB.unk3[1])),
			RID_unk4 = R3_parseEndian(RID_rawCam.slice(R3_RID_DEC_DB.unk4[0], R3_RID_DEC_DB.unk4[1]));
		document.getElementById('R3_RID_lblHex').innerHTML = RID_rawCam.match(/.{4,4}/g).toString().replace(new RegExp(',', 'gi'), ' ').toUpperCase();
		// Add the values to form
		document.getElementById('R3_RID_EDIT_camType').value = RID_type;
		document.getElementById('R3_RID_EDIT_unk0').value = RID_unk0;
		document.getElementById('R3_RID_EDIT_posX').value = R3_processBIO3PosNumbers(RID_X, 0);
		document.getElementById('R3_RID_EDIT_posY').value = R3_processBIO3PosNumbers(RID_Y, 0);
		document.getElementById('R3_RID_EDIT_posZ').value = R3_processBIO3PosNumbers(RID_Z, 0);
		document.getElementById('R3_RID_EDIT_posR').value = R3_processBIO3PosNumbers(RID_R, 0);
		// Unk
		document.getElementById('R3_RID_EDIT_unk1').value = RID_unk1;
		document.getElementById('R3_RID_EDIT_unk2').value = RID_unk2;
		document.getElementById('R3_RID_EDIT_unk3').value = RID_unk3;
		document.getElementById('R3_RID_EDIT_unk4').value = RID_unk4;
		R3_DESIGN_RID_updateRange();
		/*
			End
		*/
		R3_DESIGN_RID_updateCamSelected(cId);
	};
};
/*
	Add / Remove Camera
*/
function R3_RID_addCamera(){
	if (RID_arquivoBruto !== undefined){
		RID_cameraList.push('0000b7730000ffff0000ffff0000ffff0000ffff0000ffff0000ffff000000000');
		R3_RID_START_DECOMPILER();
		R3_RID_OPEN_CAMERA(parseInt(RID_cameraList.length - 1));
	};
};
function R3_RID_removeCamera(){
	if (RID_arquivoBruto !== undefined){
		RID_cameraList.splice(RID_currentCamera, 1);
		R3_RID_START_DECOMPILER();
		R3_RID_OPEN_CAMERA(parseInt(RID_cameraList.length - 1));
	};
};
/*
	Recompile / Apply RID
*/
function R3_RID_recompile(){
	if (RID_arquivoBruto !== undefined){
		var newPointer, cCam, RID_currentCamera, RID_type = document.getElementById('R3_RID_EDIT_camType').value,
			RID_unk0 = R3_fixVars(document.getElementById('R3_RID_EDIT_unk0').value, 4),
			RID_X	 = R3_parseEndian(R3_convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posX').value))),
			RID_Y	 = R3_parseEndian(R3_convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posY').value))),
			RID_Z	 = R3_parseEndian(R3_convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posZ').value))),
			RID_R	 = R3_parseEndian(R3_convertPosIntToHex(parseInt(document.getElementById('R3_RID_EDIT_posR').value))),
			RID_unk1 = R3_parseEndian(R3_fixVars(document.getElementById('R3_RID_EDIT_unk1').value, 4)),
			RID_unk2 = R3_parseEndian(R3_fixVars(document.getElementById('R3_RID_EDIT_unk2').value, 4)),
			RID_unk3 = R3_parseEndian(R3_fixVars(document.getElementById('R3_RID_EDIT_unk3').value, 4)),
			RID_unk4 = R3_parseEndian(R3_fixVars(document.getElementById('R3_RID_EDIT_unk4').value, 4)),
			RID_camCompiled = RID_type + RID_unk0 + RID_R + 'ffff' + RID_Z + 'ffff' + RID_Y + 'ffff' + RID_X + 'ffff' + RID_unk1 + 'ffff' + 
							  RID_unk2 + 'ffff' + RID_unk3 + RID_unk4;
		RID_cameraList[RID_currentCamera] = RID_camCompiled;
		/*
			Pass all info to RDT
			This also will increase the number of total cameras on RDT pointers
		*/
		R3_RDT_RAWSECTION_RID = RID_cameraList.toString().replace(RegExp(',', 'gi'), '');
		newPointer = R3_fixVars(parseInt(RID_cameraList.length).toString(16), 4) + R3_RDT_MAP_HEADER_POINTERS[0].slice(4, R3_RDT_MAP_HEADER_POINTERS[0].length);
		R3_RDT_MAP_HEADER_POINTERS[0] = newPointer;
		/*
			End
		*/
		R3_RID_START_DECOMPILER();
		R3_RID_OPEN_CAMERA(cCam);
	};
};