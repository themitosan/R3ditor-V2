/*
	R3ditor V2 - obj.js
	It's about time?

	Functions
*/
// Extract OBJ From String
function OBJ_extractObjFromString(hexString, cObject, location){
	var finalObj = '', tempHeaderLength, tempHeader, tempObjLength;
	if (location !== 0){
		tempHeaderLength = (parseInt(R3_parseEndian(hexString.slice(location, (location + 8))), 16) * 2);
		tempHeader = hexString.slice(location, (location + tempHeaderLength));
		tempObjLength = (parseInt(R3_parseEndian(hexString.slice((location + tempHeaderLength), ((location + tempHeaderLength) + 8))), 16) * 2);
		finalObj = tempHeader + hexString.slice((location + tempHeaderLength), ((location + tempHeaderLength) + tempObjLength));
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to read 3D Object ' + cObject + ' because it\'s location are null! (Location: 0)');
	};
	return finalObj;
};
/*
	OBJ Manager Functions
	Import / Export OBJ
	
	Mode: 0 - Import
		  1 - Export
*/
function R3_OBJ_MANAGER_importExport(mode){
	if (RDT_arquivoBruto !== undefined && mode !== undefined){
		if (mode === 0){
			R3_FILE_LOAD('.obj', function(fPath, hexData){
				R3_RDT_ARRAY_OBJ[R3_RDT_currentObjFile] = hexData;
				R3_SYSTEM_ALERT('INFO: (OBJ Manager) Import Successful!');
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (OBJ Manager) Import Successful!');
				if (R3_WEBMODE === false){
					R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + fPath + '</font>');
				};
			});
		} else {
			R3_FILE_SAVE('OBJ_' + R3_RDT_mapName + '_' + (R3_RDT_currentObjFile + 1) + '.obj', R3_RDT_rawSections.ARRAY_OBJ[R3_RDT_currentObjFile], 'hex', '.obj', function(fName){
				R3_SYSTEM_ALERT('INFO: (OBJ Manager) Export Successful!');
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (OBJ Manager) Export Successful!');
				if (R3_WEBMODE === false){
					R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + fName + '</font>');
				};
			});
		};
	};
};