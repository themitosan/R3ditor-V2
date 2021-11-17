/*
	*******************************************************************************
	R3ditor V2 - obj.js
	By TheMitoSan

	This file is responsible for handling TIM / OBJ files extracted from RDT
	maps.
	*******************************************************************************
*/
tempFn_R3_rdtOBJ = {};
tempFn_R3_objManager = {};
/*
	Functions
*/
// Extract OBJ From String OBJ_extractObjFromString
tempFn_R3_rdtOBJ['extractObjFromString'] = function(hexString, cObject, location){
	var finalObj = '', tempHeaderLength, tempHeader, tempObjLength;
	if (location !== 0){
		tempHeaderLength = (parseInt(R3_tools.parseEndian(hexString.slice(location, (location + 8))), 16) * 2);
		tempHeader = hexString.slice(location, (location + tempHeaderLength));
		tempObjLength = (parseInt(R3_tools.parseEndian(hexString.slice((location + tempHeaderLength), ((location + tempHeaderLength) + 8))), 16) * 2);
		finalObj = tempHeader + hexString.slice((location + tempHeaderLength), ((location + tempHeaderLength) + tempObjLength));
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to read 3D Object ' + cObject + ' because it\'s location are null! (Location: 0)');
	};
	return finalObj;
};
/*
	OBJ Manager Functions R3_OBJ_MANAGER_importExport
*/
// Import OBJ
tempFn_R3_objManager['import'] = function(){
	R3_fileManager.loadFile('.obj', function(fPath, hexData){
		var finalPath = '';
		if (R3_WEBMODE === false){
			finalPath = 'Path: <font class="user-can-select">' + fPath + '</font>';
		};
		R3_RDT_ARRAY_OBJ[R3_RDT_currentObjFile] = hexData;
		R3_SYSTEM.log('separator');
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (OBJ Manager) Import Successful! ' + finalPath);
		R3_SYSTEM.alert('INFO: (OBJ Manager) Import Successful!');
	});
};
// Export OBJ
tempFn_R3_objManager['export'] = function(){
	if (RDT_arquivoBruto !== undefined){
		R3_fileManager.saveFile('OBJ_' + R3_RDT_mapName + '_' + (R3_RDT_currentObjFile + 1) + '.obj', R3_RDT_rawSections.ARRAY_OBJ[R3_RDT_currentObjFile], 'hex', '.obj', function(fName){
			var finalPath = '';
			if (R3_WEBMODE === false){
				finalPath = 'Path: <font class="user-can-select">' + fPath + '</font>';
			};
			R3_SYSTEM.log('separator');
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (OBJ Manager) Export Successful! ' + finalPath);
			R3_SYSTEM.alert('INFO: (OBJ Manager) Export Successful!');
		});
	};
};
/*
	END
*/
tempFn_R3_rdtOBJ['manager'] = tempFn_R3_objManager;
delete tempFn_R3_objManager;