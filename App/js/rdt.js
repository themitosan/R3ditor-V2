/*
	R3ditor V2 - rdt.js
	Let's see how big this file will be!
*/
// General Vars
var RDT_arquivoBruto,
	R3_RDT_mapName = '',
	// Header
	R3_RDT_MAP_HEADER,
	R3_RDT_MAP_totalCams,
	R3_RDT_LOADED = false,
	R3_RDT_currentTimFile = 0,
	R3_RDT_currentObjFile = 0,
	R3_RDT_SCD_HACK_ENABLED = false,
	R3_RDT_MAP_HEADER_POINTERS = [],
	/*
		RDT Positions [WIP]
		Header Positions (R3_RDT_MAP_HEADER_POINTERS)
	
		00: RID + OBJ - Total Cameras and Objects
		01: ???		  - Unk Data (That seems to be some variable)
		02: VB		  - VAB Data (The diff with 03 is always 192)
		03: VH		  - Sound Database (i guess)
		04: VH		  - Sound Database (i guess)
		05: ???		  - Unk Data
		06: ???		  - Unk Data
		07: ???		  - Unk Data
		08: SCA		  - Colission / Boundaries
		09: RID		  - Camera Angle (Always at 60h)
		10: RVD		  - Camera Triggers
		11: LIT + PRI - Lights and Masks Data
		12: OBJ + TIM - 3D Objects / TIM
		13: FLR 	  - Floor Data
		14: BLK 	  - BLK AI Path-finding
		15: MSG		  - Text Messages
		16: RBJ		  - Animation Data
		17: ???		  - Unk Data
		18: SCD		  - Script Code Database
		19: EFF		  - Effects Data
		20: SND		  - Sound Data
		21: EFFSPR    - Sprite Effects
		22: TIM		  - TIM Location?
		23: ???		  - Unk / Unused Data
	*/
	R3_RDT_rawSections = {
		RAWSECTION_VB: '', 	   ORIGINAL_VB: '',
		RAWSECTION_SCA: '',    ORIGINAL_SCA: '',
		RAWSECTION_RID: '',    ORIGINAL_RID: '',
		RAWSECTION_RVD: '',    ORIGINAL_RVD: '',
		RAWSECTION_OBJ: '',    ORIGINAL_OBJ: '',
		RAWSECTION_LIT: '',    ORIGINAL_LIT: '',
		RAWSECTION_PRI: '',    ORIGINAL_PRI: '',
		RAWSECTION_FLR: '',    ORIGINAL_FLR: '',
		RAWSECTION_MSG: '',    ORIGINAL_MSG: '',
		RAWSECTION_SCD: '',    ORIGINAL_SCD: '',
		RAWSECTION_EFF: '',    ORIGINAL_EFF: '',
		RAWSECTION_SND: '',    ORIGINAL_SND: '',
		RAWSECTION_BLK: '',    ORIGINAL_BLK: '',
		RAWSECTION_RBJ: '',    ORIGINAL_RBJ: '',
		RAWSECTION_EFFSPR: '', ORIGINAL_EFFSPR: '',
		ARRAY_TIM: [],
		ARRAY_OBJ: []
	};
// Temp Objects
tempFn_R3_RDT = {};
tempFn_scdHack = {};
tempFn_sections = {};
/*
	Functions
*/
// New file [This will take a long time...]
tempFn_R3_RDT['newFile'] = function(){
	R3_WIP();
};
// Load files R3_RDT_loadFile
tempFn_R3_RDT['loadFile'] = function(){
	R3_FILE_LOAD('.rdt', function(rdtFile, hFile){
		R3_RDT.readMap(rdtFile, true, hFile);
	});
};
// Check before open R3_RDT_LOAD
tempFn_R3_RDT['readMap'] = function(rdtFile, showInterface, hexFile){
	var headersTemp, fName, loaderInterval, errMsg, mapPath = '';
	// Web fix
	if (R3_WEBMODE === false){
		fName = R3_getFileExtension(rdtFile).toLowerCase();
	} else {
		fName = R3_getFileExtension(rdtFile.name).toLowerCase();
	};
	// Moving on...
	if (fName !== 'rdt' && fName !== 'ard'){
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (RDT) This is not a valid RDT file!');
	} else {
		if (fName === 'ard'){
			errMsg = 'WARN: PlayStation ARD files are not compatible with RDT Editor.\n\nIn order to open these files: Run ARD Extract first and then, open extracted RDT.';
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - ' + errMsg);
			R3_SYSTEM_ALERT(errMsg);
		};
		if (fName === 'rdt'){
			if (R3_WEBMODE === false){
				mapPath = rdtFile;
				R3_RDT_mapName = R3_getFileName(rdtFile).toUpperCase();
			} else {
				mapPath = rdtFile.name;
				R3_RDT_mapName = rdtFile.name.toUpperCase().replace('.RDT', '');
			};
			if (R3_DOORLINK_RUNNING !== true){
				R3_SYSTEM_LOG('separator');
				document.title = APP_TITLE + ' - RDT Editor - File: ' + R3_RDT_mapName + '.RDT (' + RDT_locations[R3_RDT_mapName][0] + ', ' + RDT_locations[R3_RDT_mapName][1] + ')';
				R3_SYSTEM_LOG('log', 'R3ditor V2 - (RDT) Loading file: <font class="user-can-select">' + mapPath + '</font>');
				R3_SYSTEM_LOG('separator');
			};
			// Start
			R3_UTILS_VAR_CLEAN();
			R3_RDT_LOADED = false;
			ORIGINAL_FILENAME = rdtFile;
			R3_DESIGN_RDT_LOADLOCK = true;
			R3_RDT_DESIGN_resetInterface();
			if (hexFile !== undefined){
				RDT_arquivoBruto = hexFile;
			} else {
				RDT_arquivoBruto = APP_FS.readFileSync(rdtFile, 'hex');
			};
			/*
				Start Decompiler
			*/
			try {
				R3_RDT_MAP_HEADER = RDT_arquivoBruto.slice(0, 192);
				headersTemp = R3_RDT_MAP_HEADER.match(/.{8,8}/g);
				/*
					TEMP Information
					Only the first 8 bytes of the header will be kept as Endian
				*/ 
				headersTemp.forEach(function(a, b){
					if (b === 0){
						R3_RDT_MAP_HEADER_POINTERS.push(a);
					} else {
						R3_RDT_MAP_HEADER_POINTERS.push(R3_parseEndian(a));
					};
				});
				/*
					Get Extra Info From RDT
				*/
				R3_RDT_MAP_totalCams = parseInt(R3_RDT_MAP_HEADER_POINTERS[0].slice(0, 4), 16);
				/*
					Extract Sections
					Note: PRI extraction function will be executed inside LIT.
				*/
				if (R3_DOORLINK_RUNNING === false){
					R3_RDT.sections.readVB();
					R3_RDT.sections.readSCA();
					R3_RDT.sections.readOBJ();
					R3_RDT.sections.readRID();
					R3_RDT.sections.readRVD();
					R3_RDT.sections.readLIT();
					R3_RDT.sections.readBLK();
					R3_RDT.sections.readMSG();
					R3_RDT.sections.readFLR();
					R3_RDT.sections.readEFF();
				};
				R3_RDT.sections.readSCD();
				/*
					End
				*/
				R3_RDT_LOADED = true;
				// Skip some stuff
				if (R3_DOORLINK_RUNNING === false){
					R3_RDT.backupSections();
					R3_RDT.scdHack.checkHack();
					R3_LATEST_SET_FILE(R3_RDT_mapName + '.RDT', 0, ORIGINAL_FILENAME);
					R3_RDT_DESIGN_enableInterface(showInterface);
					R3_SYSTEM_LOG('separator');
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) ' + R3_RDT_mapName + ' - Loading Complete!');
				};
			} catch (err) {
				console.error(err);
				R3_DESIGN_CRITIAL_ERROR(err);
			};
		};
	};
};
// Make a copy of all original sections R3_RDT_COPY_ORIGINALS
tempFn_R3_RDT['backupSections'] = function(){
	if (RDT_arquivoBruto !== undefined){
		R3_RDT_rawSections.ORIGINAL_VB = R3_RDT_rawSections.RAWSECTION_VB;
		R3_RDT_rawSections.ORIGINAL_SCA = R3_RDT_rawSections.RAWSECTION_SCA;
		R3_RDT_rawSections.ORIGINAL_RID = R3_RDT_rawSections.RAWSECTION_RID;
		R3_RDT_rawSections.ORIGINAL_RVD = R3_RDT_rawSections.RAWSECTION_RVD;
		R3_RDT_rawSections.ORIGINAL_OBJ = R3_RDT_rawSections.RAWSECTION_OBJ;
		R3_RDT_rawSections.ORIGINAL_LIT = R3_RDT_rawSections.RAWSECTION_LIT;
		R3_RDT_rawSections.ORIGINAL_PRI = R3_RDT_rawSections.RAWSECTION_PRI;
		R3_RDT_rawSections.ORIGINAL_FLR = R3_RDT_rawSections.RAWSECTION_FLR;
		R3_RDT_rawSections.ORIGINAL_MSG = R3_RDT_rawSections.RAWSECTION_MSG;
		R3_RDT_rawSections.ORIGINAL_SCD = R3_RDT_rawSections.RAWSECTION_SCD;
		R3_RDT_rawSections.ORIGINAL_EFF = R3_RDT_rawSections.RAWSECTION_EFF;
		R3_RDT_rawSections.ORIGINAL_SND = R3_RDT_rawSections.RAWSECTION_SND;
		R3_RDT_rawSections.ORIGINAL_BLK = R3_RDT_rawSections.RAWSECTION_BLK;
		R3_RDT_rawSections.ORIGINAL_RBJ = R3_RDT_rawSections.RAWSECTION_RBJ;
		R3_RDT_rawSections.ORIGINAL_EFFSPR = R3_RDT_rawSections.RAWSECTION_EFFSPR;
		// Extract PRI
		R3_RDT.sections.readPRI();
		R3_RDT_rawSections.ORIGINAL_PRI = R3_RDT_rawSections.RAWSECTION_PRI;
	};
};
// Blank section error message R3_RDT_ERROR_POINTER_BLANK
tempFn_R3_RDT['errorBlankSection'] = function(section){
	if (RDT_arquivoBruto !== undefined && section !== undefined){
		R3_SYSTEM_LOG('separator');
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to extract ' + section + ' since the pointers are blank! (<font class="user-can-select">00000000</font>) <br>Check pointers array [R3_RDT_MAP_HEADER_POINTERS] to know more about.');
		R3_SYSTEM_LOG('separator');
	};
};

/*
	=================================
	|  Extract / Read RDT Sections  |
	=================================
*/

/*
	FLR
	Floor Data
*/
// Extract FLR from RDT R3_RDT_EXTRACT_FLR
tempFn_sections['readFLR'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading FLR...');
		if (R3_RDT_MAP_HEADER_POINTERS[13] !== '00000000'){
			// It seems to always ends on SCD Start
			const flrStart = (parseInt(R3_RDT_MAP_HEADER_POINTERS[13], 16) * 2),
				flrEnd = RDT_arquivoBruto.indexOf(R3_RDT_rawSections.RAWSECTION_SCD);
			R3_RDT_rawSections.RAWSECTION_FLR = RDT_arquivoBruto.slice(flrStart, flrEnd);
		} else {
			R3_RDT.errorBlankSection('FLR');
		};
	};
};
// Open FLR R3_RDT_OPEN_FLR
tempFn_sections['openFLR'] = function(){
	R3_WIP();
};
/*
	BLK
	AI Path Finding [WIP]
*/
// Extract BLK from RDT R3_RDT_EXTRACT_BLK
tempFn_sections['readBLK'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading BLK...');
		if (R3_RDT_MAP_HEADER_POINTERS[14] !== '00000000'){
			var blkArray 	 = [],
				blkStart 	 = (parseInt(R3_RDT_MAP_HEADER_POINTERS[14], 16) * 2),
				blkCounter   = RDT_arquivoBruto.slice(blkStart, (blkStart + 4)),
				headerLength = RDT_arquivoBruto.slice((blkStart + 4), (blkStart + 8)),
				blkHeader 	 = RDT_arquivoBruto.slice(blkStart, (blkStart + (parseInt(R3_parseEndian(headerLength), 16) * 2))),
				totalBlk	 = parseInt(R3_parseEndian(blkCounter), 16),
				blkStartPos  = parseInt(blkStart + (parseInt(R3_parseEndian(headerLength), 16) * 2));
			// Start
			for (var i = 0; i < totalBlk; i++){
				blkStart = RDT_arquivoBruto.slice(blkStartPos);
				blkArray.push(blkStart.slice(0, 96));
				blkStartPos = (blkStartPos + 96); // Update Pos.
			};
			// End
			R3_RDT_rawSections.RAWSECTION_BLK = blkHeader + blkArray.toString().replace(RegExp(',', 'gi'), '');
		} else {
			R3_RDT.errorBlankSection('BLK');
		};
	};
};
// Open BLK R3_RDT_OPEN_BLK
tempFn_sections['openBLK'] = function(){
	R3_WIP();
};
/*
	VB
	Sound Data [WIP]
*/
// Extract VB from RDT R3_RDT_EXTRACT_VB
tempFn_sections['readVB'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading VB... [WIP]');
		if (R3_RDT_MAP_HEADER_POINTERS[2] !== '00000000'){
			var VB_headerHex, VB_dataCounter, VB_useCounter, VB_dataHex,
				VB_location_A  = (parseInt(R3_RDT_MAP_HEADER_POINTERS[2], 16) * 2),
				VB_locationEnd = ((parseInt(R3_RDT_MAP_HEADER_POINTERS[3], 16) * 2) + 16), // It seems length is always C8 (200)
				VB_idListHex   = RDT_arquivoBruto.slice(VB_location_A, VB_locationEnd),
				VB_startHeader = RDT_arquivoBruto.slice(VB_locationEnd);
				VB_firstIndex  = VB_startHeader.indexOf('0000b1b2');
			// Check if exist 0x0000B1B2
			if (VB_firstIndex !== -1){ // This is the start of first VB Data
				VB_headerHex   = VB_startHeader.slice(0, VB_startHeader.indexOf('0000b1b2'));
				VB_dataCounter = parseInt(R3_parseEndian(VB_headerHex.slice(40, 44)), 16);
				VB_useCounter  = parseInt(R3_parseEndian(VB_headerHex.slice(44, 48)), 16);
				VB_dataHex 	   = VB_startHeader.slice(VB_firstIndex, (VB_firstIndex + (64 * VB_dataCounter)));
				// End
				R3_RDT_rawSections.RAWSECTION_VB = VB_idListHex + VB_headerHex + VB_dataHex;
			} else {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to find VB Header database (<font class="user-can-select">0x0000B1B2</font>)');
			};	
		} else {
			R3_RDT.errorBlankSection('VB');
		};
	};
};
// Open match VB on Hex Editor
tempFn_R3_RDT['openVbOnHex'] = function(){
	if (R3_WEBMODE === false){
		if (RDT_arquivoBruto !== undefined && APP_ENABLE_MOD === true && APP_FS.existsSync(R3_SETTINGS.R3_HEX_PATH) === true){
			const fPath = APP_PATH + '/Assets/DATA/SOUND/R_' + R3_RDT_mapName.replace('R', '') + '.VB';
			if (APP_FS.existsSync(fPath) === true){
				R3_runExec(R3_SETTINGS.R3_HEX_PATH, [fPath]);
			} else {
				R3_SYSTEM_ALERT('ERROR: Unable to open VB file because it does not exist! (404)');
			};
		};
	} else {
		R3_WEBWARN();
	};
};
/*
	RVD
	Camera Trigger [WIP]
*/
// Extract RVD from RDT R3_RDT_EXTRACT_RVD
tempFn_sections['readRVD'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading RVD...');
		if (R3_RDT_MAP_HEADER_POINTERS[10] !== '00000000'){
			const RVD_location = (parseInt(R3_RDT_MAP_HEADER_POINTERS[10], 16) * 2),
				tempRVD = RDT_arquivoBruto.slice(RVD_location);
			R3_RDT_rawSections.RAWSECTION_RVD = tempRVD.slice(0, tempRVD.indexOf('ffffffff'));
		} else {
			R3_RDT.errorBlankSection('RVD');
		};
	};
};
// Open RVD
tempFn_sections['openRVD'] = function(){
	R3_WIP();
};
/*
	OBJ
	TIM / 3D Objects
*/
// Extract TIM / OBJ from RDT R3_RDT_EXTRACT_OBJ
tempFn_sections['readOBJ'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading OBJ / TIM...');
		if (R3_RDT_MAP_HEADER_POINTERS[12] !== '00000000'){
			const OBJ_location = (parseInt(R3_RDT_MAP_HEADER_POINTERS[12], 16) * 2),
				totalObjects = parseInt(R3_RDT_MAP_HEADER_POINTERS[0].slice(4, 6), 16);
			var	tempTim, temp3dObj, tempRDT = RDT_arquivoBruto.slice(OBJ_location, RDT_arquivoBruto.length).match(/.{16,16}/g);
			if (totalObjects !== 0){
				R3_RDT_rawSections.RAWSECTION_OBJ = tempRDT.slice(0, totalObjects).toString().replace(new RegExp(',', 'gi'), '');
				// Get all TIM / OBJ Files
				tempRDT = R3_RDT_rawSections.RAWSECTION_OBJ.match(/.{16,16}/g).forEach(function(cItem, cIndex){
					tempTim = R3_TIM.getTimFromString(RDT_arquivoBruto, (parseInt(R3_parseEndian(cItem.slice(0, 8)), 16) * 2));
					temp3dObj = R3_RDT.obj.extractObjFromString(RDT_arquivoBruto, cIndex, (parseInt(R3_parseEndian(cItem.slice(8, 16)), 16) * 2));
					if (R3_RDT_rawSections.ARRAY_TIM.indexOf(tempTim) === -1){
						console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading TIM file ' + cIndex);
						R3_RDT_rawSections.ARRAY_TIM.push(tempTim);
					};
					if (R3_RDT_rawSections.ARRAY_OBJ.indexOf(temp3dObj) === -1){
						console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading 3D OBJ file ' + cIndex);
						R3_RDT_rawSections.ARRAY_OBJ.push(temp3dObj);
					};
				});
			} else {
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: ' + R3_RDT_mapName + ' does not have any TIM / OBJ file!');
			};
		} else {
			R3_RDT.errorBlankSection('OBJ');
		};
	};
};
// Open TIM Manager R3_RDT_OPEN_TIM
tempFn_sections['openTimManager'] = function(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_rawSections.ARRAY_TIM !== []){
		var HTML_TEMPLATE = '';
		R3_RDT_rawSections.ARRAY_TIM.forEach(function(cItem, cIndex){
			HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + cIndex + '">TIM File ' + (cIndex + 1) + '</option>';
		});
		document.getElementById('R3_RDT_timManagerList').innerHTML = HTML_TEMPLATE;
		// End
		R3_DESIGN_MINIWINDOW_OPEN(16);
	};
};
// Open OBJ Manager R3_RDT_OPEN_OBJ
tempFn_sections['openObjManager'] = function(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_rawSections.ARRAY_OBJ !== []){
		var HTML_TEMPLATE = '';
		R3_RDT_rawSections.ARRAY_OBJ.forEach(function(cItem, cIndex){
			if (cItem !== ''){
				HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + cIndex + '">OBJ File ' + (cIndex + 1) + '</option>';
			} else {
				HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + cIndex + '" disabled="disabled" title="This OBJ is disabled because it haves a null location (0)">OBJ File ' + (cIndex + 1) + '</option>';
			};
		});
		document.getElementById('R3_RDT_objManagerList').innerHTML = HTML_TEMPLATE;
		// End
		R3_DESIGN_MINIWINDOW_OPEN(17);
	};
};
/*
	SCA
	Colission / Boundaries
*/
// Extract SCA from RDT R3_RDT_EXTRACT_SCA
tempFn_sections['readSCA'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading SCA...');
		if (R3_RDT_MAP_HEADER_POINTERS[8] !== '00000000'){
			const SCA_location = (parseInt(R3_RDT_MAP_HEADER_POINTERS[8], 16) * 2),
				SCA_itemStart = parseInt(SCA_location + 32),
				SCA_unkArrayStart = parseInt(SCA_location + 8),
				SCA_totalItems = parseInt(R3_parseEndianToInt(R3_parseEndian(RDT_arquivoBruto.slice(SCA_location, SCA_unkArrayStart))) - 1),
				SCA_header = RDT_arquivoBruto.slice(SCA_location, SCA_itemStart),
				SCA_boundaries = RDT_arquivoBruto.slice(SCA_itemStart, parseInt(SCA_itemStart + (SCA_totalItems * 32))); // 32 = Length per colission
			R3_RDT_rawSections.RAWSECTION_SCA = SCA_header + SCA_boundaries;
		} else {
			R3_RDT.errorBlankSection('SCA');
		};
	};
};
// Open SCA R3_RDT_OPEN_SCA
tempFn_sections['openSCA'] = function(){
	R3_WIP();
};
/*
	RID
	Camera Angles / Positions
*/
// Extract RID from RDT R3_RDT_EXTRACT_RID
tempFn_sections['readRID'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading RID...');
		const RID_totalCameras = parseInt(R3_RDT_MAP_HEADER_POINTERS[0].slice(2, 4), 16),
			RID_startLocation = (parseInt(R3_RDT_MAP_HEADER_POINTERS[9], 16) * 2);
		R3_RDT_rawSections.RAWSECTION_RID = RDT_arquivoBruto.slice(RID_startLocation, parseInt(RID_startLocation + parseInt(64 * RID_totalCameras)));
	};
};
// Open RID from RDT R3_RDT_OPEN_RID
tempFn_sections['openRID'] = function(){
	if (RDT_arquivoBruto !== undefined){
		R3_DESIGN_MINIWINDOW_CLOSE([16, 17]);
		R3_UTILS_VAR_CLEAN_RID();
		RID_arquivoBruto = R3_RDT_rawSections.RAWSECTION_RID;
		RID_cameraList = RID_arquivoBruto.match(/.{64,64}/g);
		R3_RID_START_DECOMPILER();
		R3_DESIGN_MINIWINDOW_OPEN(6, 'center');
	};
};
/*
	LIT
	Light Source Infos

	Light Info Length 28h (HEX) [WIP]
*/
// Extract LIT from RDT R3_RDT_EXTRACT_LIT
tempFn_sections['readLIT'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading LIT...');
		var c = 0, reachEnd = false, LIT_TEMP = '', LIT_startPos = (parseInt(R3_RDT_MAP_HEADER_POINTERS[11], 16) * 2),
			LIT_pointerLength = RDT_arquivoBruto.slice(LIT_startPos, parseInt(LIT_startPos + 4)),
			LIT_pointers = RDT_arquivoBruto.slice(LIT_startPos, parseInt(LIT_startPos + (parseInt(R3_parseEndian(LIT_pointerLength), 16) * 2))),
			LIT_tempLightsArray = RDT_arquivoBruto.slice(parseInt(LIT_startPos + LIT_pointers.length), RDT_arquivoBruto.length).match(/.{80,80}/g);
		/*
			This does not feels fine for me but... Will do the trick. (For now)
		*/
		while (reachEnd === false){
			if (c < LIT_tempLightsArray.length){
				if (LIT_tempLightsArray[c].slice(0, 8).toLowerCase() !== 'ffffffff'){
					LIT_TEMP = LIT_TEMP + LIT_tempLightsArray[c];
					c++;
				} else {
					reachEnd = true;
				};
			} else {
				reachEnd = true;
				R3_SYSTEM_LOG('warn', 'RDT - WARN: Unable to extract LIT section! <br>Reason: Reach the end of the file!');
			};
		};
		// End
		R3_RDT_rawSections.RAWSECTION_LIT = LIT_pointers + LIT_TEMP;
	};
};
// Open LIT on LIT Editor R3_RDT_OPEN_LIT
tempFn_sections['openLIT'] = function(){
	if (RDT_arquivoBruto !== undefined){
		R3_UTILS_VAR_CLEAN_LIT();
		LIT_arquivoBruto = R3_RDT_rawSections.RAWSECTION_LIT;
		R3_LIT_DECOMPILE();
	};
};
/*
	PRI
	Camera Mask (AKA. F. King / TMS Nighmare) [WIP]
	
	This is not the best implementation, but... OOF! Anyways - at least is here and it works!
*/
// Extract PRI from RDT R3_RDT_EXTRACT_PRI
tempFn_sections['readPRI'] = function(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_rawSections.RAWSECTION_LIT !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading PRI...');
		R3_RDT_rawSections.RAWSECTION_PRI = RDT_arquivoBruto.slice((RDT_arquivoBruto.indexOf(R3_RDT_rawSections.ORIGINAL_LIT) + (R3_RDT_rawSections.ORIGINAL_LIT.length + 8)), RDT_arquivoBruto.indexOf(R3_RDT_rawSections.ORIGINAL_SCA));
	};
};
// Open PRI on PRI Editor R3_RDT_OPEN_PRI
tempFn_sections['openPRI'] = function(){
	if (RDT_arquivoBruto !== undefined){
		R3_WIP();
	};
};
/*
	SLD
	Scene Layer Data
*/
// Open current SLD R3_RDT_OPEN_SLD
tempFn_sections['openSLD'] = function(){
	if (RDT_arquivoBruto !== undefined){
		if (APP_FS.existsSync(R3_SETTINGS.R3_RE3SLDE_PATH) === true){
			const sldFile = APP_PATH + '/Assets/DATA_A/BSS/' + R3_RDT_mapName + '.SLD';
			if (APP_FS.existsSync(sldFile) === true){
				R3_runExec(R3_SETTINGS.R3_RE3SLDE_PATH, [sldFile]);
			};
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to find Leo2236 RE3SLDE! <br>Insert the RE3SLDE path on settings menu and try again.');
		};
	};
};
/*
	MSG
	Text Messages
*/
// Extract MSG From RDT R3_RDT_EXTRACT_MSG
tempFn_sections['readMSG'] = function(){
	if (RDT_arquivoBruto !== undefined){
		console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading MSG...');
		if (R3_RDT_MAP_HEADER_POINTERS[15] !== '00000000'){
			var	MSG_HEX_STARTPOS 		= (parseInt(R3_RDT_MAP_HEADER_POINTERS[15], 16) * 2),
				MSG_POINTER_LENGTH 		= (parseInt(R3_parseEndian(RDT_arquivoBruto.slice(MSG_HEX_STARTPOS, (MSG_HEX_STARTPOS + 4))), 16) * 2),
				MSG_POINTERS			= RDT_arquivoBruto.slice(MSG_HEX_STARTPOS, (MSG_HEX_STARTPOS + MSG_POINTER_LENGTH)),
				MSG_LAST_POINTER_LENGTH = (parseInt(R3_parseEndian(MSG_POINTERS.slice(MSG_POINTERS.length - 4, MSG_POINTERS.length)), 16) * 2),
				MSG_RAW_SECTION 		= RDT_arquivoBruto.slice(MSG_HEX_STARTPOS, parseInt(MSG_HEX_STARTPOS + MSG_LAST_POINTER_LENGTH));
				/*
					Okay - Last message now.
					Let's hope this works!
				*/
				RDT_MSG_SEEK_AREA = RDT_arquivoBruto.slice((RDT_arquivoBruto.indexOf(MSG_RAW_SECTION) + MSG_RAW_SECTION.length), RDT_arquivoBruto.length);
			R3_RDT_rawSections.RAWSECTION_MSG = MSG_RAW_SECTION + RDT_MSG_SEEK_AREA.slice(0, parseInt(RDT_MSG_SEEK_AREA.indexOf('fe') + 4));
			// Generate Msg Preview
			R3_RDT.sections.generateMsgPreview();
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: This map does not have any message!');
		};
	};
};
// Open MSG Section R3_RDT_OPEN_MSG
tempFn_sections['openMSG'] = function(){
	if (RDT_arquivoBruto !== undefined){
		if (R3_RDT_MAP_HEADER_POINTERS[15] !== '00000000'){
			R3_MSG_decompileRDT(true);
			if (R3_SETTINGS.SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST === true){
				R3_DESIGN_MINIWINDOW_OPEN(5);
			};
		} else {
			var alertMsg = 'WARN: This map does not have any message!';
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - ' + alertMsg);
			R3_SYSTEM_ALERT(alertMsg);
		};
	};
};
// Generate Messages Preview R3_RDT_generateMsgPreview
tempFn_sections['generateMsgPreview'] = function(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_rawSections.RAWSECTION_MSG !== undefined){
		R3_MSG_RDT_MESSAGES_PREVIEW = [];
		var d = 1, cMessage;
		R3_MSG_decompileRDT(false);
		Object.keys(R3_MSG_RDT_MESSAGES).forEach(function(cItem){
			d = 1;
			cMessage = '';
			R3_MSG_DECOMPILER_START(R3_MSG_RDT_MESSAGES[cItem]);
			while (d < Object.keys(R3_MSG_commands).length){
				if (R3_MSG_commands[d][0] === 0){
					cMessage = cMessage + R3_MSG_commands[d][1]; 
				};
				if (R3_MSG_convertHexToPureText(cMessage) !== ''){
					R3_MSG_RDT_MESSAGES_PREVIEW.push(R3_MSG_convertHexToPureText(cMessage));
				};
				d++;
			};
		});
		// End
		document.getElementById('R3_MSG_EDIT_TEXTAREA').value = '';
	};
};
/*
	SCD
	Script Code Data
*/
// Extract SCD from RDT R3_RDT_EXTRACT_SCD
tempFn_sections['readSCD'] = function(){
	if (RDT_arquivoBruto !== undefined){
		if (R3_DOORLINK_RUNNING !== true){
			console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading SCD...');
		};
		var c = 0, opcodeLength, RDT_SCD_SEEK_AREA, foundEnd = false, cOpcode = '', tmpStart = 0, tmpEnd = 2, lastScript = '',
			SCD_HEX_STARTPOS  = (parseInt(R3_RDT_MAP_HEADER_POINTERS[18], 16) * 2),
			SCD_POINTER_START = R3_parseEndian(RDT_arquivoBruto.slice(SCD_HEX_STARTPOS, (SCD_HEX_STARTPOS + 4))),
			SCD_POINTER_END   = SCD_HEX_STARTPOS + (parseInt(SCD_POINTER_START, 16) * 2),
			SCD_LENGTH 		  = (parseInt(R3_parseEndian(RDT_arquivoBruto.slice((SCD_POINTER_END - 4), SCD_POINTER_END)), 16) * 2),
			SCD_RAW_SECTION   = RDT_arquivoBruto.slice(SCD_HEX_STARTPOS, (SCD_HEX_STARTPOS + SCD_LENGTH));
		/*
			Now, let's try extract the last script from RDT:
		
			After getting all scripts using Khaled SA Method, it will crop the RDT file from the end of already extracted SCD to the end of RDT file.
			Then, it will analyze the next hex block and will compare to the database to see if it is the EVT_END function (01 00).
			If not, it will see what opcode is, it's length and will jump to the next opcode.
		
			Let's hope to all maps haves EVT_END in the last script!
		 */
		RDT_SCD_SEEK_AREA = RDT_arquivoBruto.slice((RDT_arquivoBruto.indexOf(SCD_RAW_SECTION) + SCD_RAW_SECTION.length), RDT_arquivoBruto.length);
		while (foundEnd === false){
			cOpcode = RDT_SCD_SEEK_AREA.slice(tmpStart, tmpEnd);
			// console.info('RDT - Opcode ' + cOpcode.toUpperCase() + '(' + R3_SCD_DATABASE[cOpcode][1] + ')');
			if (cOpcode === '01'){
				lastScript = RDT_SCD_SEEK_AREA.slice(0, (tmpEnd + 2));
				foundEnd = true;
			} else {
				opcodeLength = parseInt(R3_SCD_DATABASE[cOpcode][0] * 2);
				tmpStart = (tmpStart + opcodeLength);
				tmpEnd = (tmpEnd + opcodeLength);
			};
		};
		R3_RDT_rawSections.RAWSECTION_SCD = SCD_RAW_SECTION + lastScript;
	};
};
// Open SCD on SCD Editor R3_RDT_OPEN_SCD
tempFn_sections['openSCD'] = function(){
	if (R3_RDT_rawSections.RAWSECTION_SCD !== undefined){
		R3_DESIGN_CLEAN_SCD();
		R3_UTILS_VAR_CLEAN_SCD();
		SCD_arquivoBruto = R3_RDT_rawSections.RAWSECTION_SCD;
		if (R3_WEBMODE === false){
			R3_SCD_fileName = R3_getFileName(ORIGINAL_FILENAME).toUpperCase();
		} else {
			R3_SCD_fileName = ORIGINAL_FILENAME.name.replace('.RDT', '');
		};
		R3_SCD_START_DECOMPILER(R3_RDT_rawSections.RAWSECTION_SCD);
	    document.title = APP_TITLE + ' - SCD Editor - File: ' + R3_SCD_fileName + '.RDT';
		// Display Apply SCD on RDT
		TMS.css('R3_SCD_BTN_APPLYRDT', {'display': 'inline-flex'});
		R3_SHOW_MENU(9);
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: You need open a map first before loading scripts.');
	};
};
/*
	EFF
	Effects Data
*/
// Extract EFF from RDT R3_RDT_EXTRACT_EFF
tempFn_sections['readEFF'] = function(){
	console.info('R3ditor V2 - INFO: (' + R3_RDT_mapName + ') Reading EFF...');
	/*
		Since EFF and SND are sequent, this extraction method is kinda simple.
		I still think there is a more logical way to make this work properly...
	*/
	var tempSize, RDT_EFF_POINTER = R3_RDT_MAP_HEADER_POINTERS[19], RDT_SND_POINTER = R3_RDT_MAP_HEADER_POINTERS[20];
	if (RDT_EFF_POINTER !== '00000000' && RDT_SND_POINTER !== '00000000'){
		tempSize = R3_parsePositive(parseInt((parseInt(RDT_EFF_POINTER, 16) * 2) - (parseInt(RDT_SND_POINTER, 16) * 2)));
		R3_RDT_rawSections.RAWSECTION_EFF = RDT_arquivoBruto.slice((parseInt(RDT_EFF_POINTER, 16) * 2), ((parseInt(RDT_EFF_POINTER, 16) * 2) + tempSize));
	} else {
		R3_RDT.errorBlankSection('EFF');
	};
};
/*
	Export Sections
	This will export each section hex data
	
	R3_RDT_EXPORT_SECTION
*/
tempFn_sections['export'] = function(sectionName){
	const rawHex = R3_RDT_rawSections['RAWSECTION_' + sectionName];
	if (RDT_arquivoBruto !== undefined && rawHex !== undefined){
		R3_FILE_SAVE(R3_RDT_mapName + '_' + sectionName, rawHex, 'hex', '.' + sectionName.toLowerCase(), function(fPath){
			R3_SYSTEM_LOG('separator');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Process complete! (' + sectionName + ') <br>Path: <font class="user-can-select">' + fPath + '</font>');
		});
	};
};
// Extract all sections (Like BIOFAT) R3_RDT_EXTRACT_ALL_SECTIONS
tempFn_sections['exportAll'] = function(sectionId){
	if (R3_WEBMODE === false){
		if (RDT_arquivoBruto !== undefined){
			try {
				const fPath = R3_getMapPath()[1] + R3_RDT_mapName;
				if (APP_FS.existsSync(fPath) !== true){
					APP_FS.mkdirSync(fPath);
				};
				// Start
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Starting export process...');

				Object.keys(R3_RDT_rawSections).forEach(function(cItem){
					if (cItem.toLowerCase().indexOf('rawsection') !== -1 && R3_RDT_rawSections[cItem] !== ''){
						APP_FS.writeFileSync(fPath + '/' + cItem.replace('RAWSECTION_', '') + '.R3SECTION', R3_RDT_rawSections[cItem], 'hex');
					};
				});

				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Export Successful!');
				R3_SYSTEM_ALERT('INFO: Process Complete!');
			} catch (err) {
				console.error(err);
				R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to extract all sections! <br>' + err);
			};
		};
	} else {
		R3_WEBWARN();
	};
};
// Import all sections from extracted files R3_RDT_IMPORT_ALL_SECTIONS WIP
tempFn_sections['importAll'] = function(sectionId){
	if (R3_WEBMODE !== true){
		if (RDT_arquivoBruto !== undefined){
			try {
				const fPath = R3_getMapPath()[1] + R3_RDT_mapName;
				if (APP_FS.existsSync(fPath) === true){
					// Reading files
					R3_SYSTEM_LOG('separator');
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Start loading process...');
					if (APP_FS.existsSync(fPath + '/VB.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading VB (VB.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_VB = APP_FS.readFileSync(fPath + '/VB.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/SCA.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading SCA (SCA.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_SCA = APP_FS.readFileSync(fPath + '/SCA.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/RID.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading RID (RID.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_RID = APP_FS.readFileSync(fPath + '/RID.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/RVD.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading RVD (RVD.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_RVD = APP_FS.readFileSync(fPath + '/RVD.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/OBJ.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading OBJ (OBJ.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_OBJ = APP_FS.readFileSync(fPath + '/OBJ.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/LIT.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading LIT (LIT.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_LIT = APP_FS.readFileSync(fPath + '/LIT.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/PRI.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading PRI (PRI.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_PRI = APP_FS.readFileSync(fPath + '/PRI.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/FLR.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading FLR (FLR.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_FLR = APP_FS.readFileSync(fPath + '/FLR.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/MSG.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading MSG (MSG.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_MSG = APP_FS.readFileSync(fPath + '/MSG.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/SCD.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading SCD (SCD.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_SCD = APP_FS.readFileSync(fPath + '/SCD.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/EFF.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading EFF (EFF.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_EFF = APP_FS.readFileSync(fPath + '/EFF.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/SND.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading SND (SND.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_SND = APP_FS.readFileSync(fPath + '/SND.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/BLK.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading BLK (BLK.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_BLK = APP_FS.readFileSync(fPath + '/BLK.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/RBJ.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading RBJ (RBJ.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_RBJ = APP_FS.readFileSync(fPath + '/RBJ.R3SECTION', 'hex');
					};
					if (APP_FS.existsSync(fPath + '/EFFSPR.R3SECTION') === true){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Loading EFFSPR (EFFSPR.R3SECTION)');
						R3_RDT_rawSections.RAWSECTION_EFFSPR = APP_FS.readFileSync(fPath + '/EFFSPR.R3SECTION', 'hex');
					};
					R3_SYSTEM_LOG('separator');
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (RDT) Import Successful!');
					R3_SYSTEM_ALERT('INFO: Process Complete!');
				} else {
					R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to import sections! <br>Reason: Extraction folder does not exists! (404)');
					R3_SYSTEM_ALERT('WARN: Unable to import sections!\nReason: Extraction folder does not exists! (404)');
				};
			} catch (err) {
				console.error(err);
				R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to import all sections! <br>' + err);
			};
		};
	} else{
		R3_WEBWARN();
	};
};
/*
	SCD HACK - Set SCD and MSG to the end of file for debugging process.

	This is not the most polite stuff to do, but it will help testing the editor!
	Remove this thing later!
*/
// Check if SCD hack is present R3_RDT_checkIfScdHack
tempFn_scdHack['checkHack'] = function(){
	if (RDT_arquivoBruto !== undefined){
		if (RDT_arquivoBruto.indexOf(R3_RDT_DIVISOR) !== -1){
			R3_RDT_SCD_HACK_ENABLED = true;
		} else {
			R3_RDT_SCD_HACK_ENABLED = false;
		};
		R3_DESIGN_updateScdHack();
	};
};
// Enable Hack R3_RDT_SCD_HACK_ENABLE
tempFn_scdHack['enableHack'] = function(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_SCD_HACK_ENABLED === false){
		var cEditor = R3_DISC_MENUS[R3_MENU_CURRENT][0], RDT_HACK_FINAL, fName,
			conf = R3_SYSTEM_CONFIRM('WARNING:\nThis process will copy the current SCD and MSG sections to the end of the file.\n\nThis is not recomended because this process is used only for debugging and will make the file larger / messy.\n\nIt\'s not recomended do this process on maps that haves enemies / npc\'s (SCD 7D Opcode), otherwise it will crash!\n\nAlso: DON\'T RUN THIS PROCESS TWICE IN THE SAME FILE!!!\n\nDo you want to continue anyway?');
		if (conf === true){
			if (R3_WEBMODE === false){
				fName = R3_getFileName(ORIGINAL_FILENAME).toUpperCase();
			} else {
				fName = R3_getFileName(ORIGINAL_FILENAME.name).toUpperCase();
			};
			R3_UTILS_BACKUP(RDT_arquivoBruto, fName, '.RDT', APP_PATH + '/Configs/Backup/RDT', cEditor);
			var newHackRDT = RDT_arquivoBruto + R3_RDT_rawSections.RAWSECTION_SCD + R3_RDT_DIVISOR + R3_RDT_rawSections.RAWSECTION_MSG,
				newSCDPointer  = R3_parseEndian(R3_fixVars((RDT_arquivoBruto.length / 2).toString(16), 8)),
				RDT_HACK_START = RDT_arquivoBruto.slice(0, 144),
				RDT_HACK_END   = newHackRDT.slice(152, newHackRDT.length),
				RDT_HACK_SCD   = RDT_HACK_START + newSCDPointer + RDT_HACK_END,
				newMSGPointer  = R3_parseEndian(R3_fixVars(parseInt((RDT_HACK_SCD.indexOf(R3_RDT_DIVISOR) + R3_RDT_DIVISOR.length) / 2).toString(16), 8));
			// Update MSG Pointer
			RDT_HACK_START = RDT_HACK_SCD.slice(0, 120);
			RDT_HACK_END   = RDT_HACK_SCD.slice(128, RDT_HACK_SCD.length);
			RDT_HACK_FINAL = RDT_HACK_START + newMSGPointer + RDT_HACK_END;
			// I'm Not Proud of this...
			APP_FS.writeFileSync(ORIGINAL_FILENAME, RDT_HACK_FINAL, 'hex');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Hack done sucessfully! <br>Path: <font class="user-can-select">' + ORIGINAL_FILENAME + '</font>');
			R3_SYSTEM_ALERT('SCD HACK: Process Complete!');
			// Update backup manager if it's open
			if (R3_MINI_WINDOW_DATABASE[18][5] === true){
				R3_DESIGN_renderBackupManager();
			};
			// At least... It works...
			if (R3_WEBMODE === false){
				R3_RDT.readMap(ORIGINAL_FILENAME, true);
			};
		};
	};
};
// Apply Hack Check R3_RDT_SCD_HACK_APPLY
tempFn_scdHack['applyHack'] = function(skip){
	if (RDT_arquivoBruto !== undefined){
		if (R3_RDT_SCD_HACK_ENABLED === true){
			if (skip === true){
				R3_SCD_COMPILE(4);
				R3_RDT.scdHack.injectSections();
			} else {
				var conf = R3_SYSTEM_CONFIRM('WARNING:\nThis process will insert the extracted SCD in the end of this file.\n\nThis is not recomended because this process is used only for debugging and if you didn\'t run \"ENABLE SCD HACK\" before, it can brick the file.\n\nDo you want to continue anyway?');
				if (conf === true){
					R3_RDT.scdHack.injectSections();
				};
			};
		} else {
			R3_RDT.scdHack.enableHack();
		};
	};
};
// Inject Code R3_RDT_SCD_HACK_INJECT_SCD
tempFn_scdHack['injectSections'] = function(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_SCD_HACK_ENABLED === true){
		try {
			var fName, RDT_HACK_FINAL, cEditor = R3_DISC_MENUS[R3_MENU_CURRENT][0], pointerPos, RDT_HACK_START, RDT_HACK_END, RDT_HACK_SCD, newMSGPointer;
			if (R3_WEBMODE === false){
				fName = R3_getFileName(ORIGINAL_FILENAME).toUpperCase();
			} else {
				fName = R3_getFileName(ORIGINAL_FILENAME.name).toUpperCase();
			};
			R3_UTILS_BACKUP(RDT_arquivoBruto, fName, '.RDT', APP_PATH + '/Configs/Backup/RDT', cEditor);
			pointerPos 	   = parseInt(R3_parseEndian(RDT_arquivoBruto.slice(144, 152)), 16) * 2, RDT_HACK_END;
			RDT_HACK_START = RDT_arquivoBruto.slice(0, pointerPos);
			RDT_HACK_SCD   = RDT_HACK_START + R3_RDT_rawSections.RAWSECTION_SCD + R3_RDT_DIVISOR + R3_RDT_rawSections.RAWSECTION_MSG;
			newMSGPointer  = R3_parseEndian(R3_fixVars(parseInt((RDT_HACK_SCD.indexOf(R3_RDT_DIVISOR) + R3_RDT_DIVISOR.length) / 2).toString(16), 8));
			// Update Pointer for MSG
			RDT_HACK_START = RDT_HACK_SCD.slice(0, 120);
			RDT_HACK_END   = RDT_HACK_SCD.slice(128, RDT_HACK_SCD.length);
			RDT_HACK_FINAL = RDT_HACK_START + newMSGPointer + RDT_HACK_END;
			// Let's just hope for this...
			APP_FS.writeFileSync(ORIGINAL_FILENAME, RDT_HACK_FINAL, 'hex');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: SCD Hack updated sucessfully! <br>Path: <font class="user-can-select">' + ORIGINAL_FILENAME + '</font>');
			R3_SYSTEM_ALERT('SCD HACK: Process Complete!');
			// Update backup manager if it's open
			if (R3_MINI_WINDOW_DATABASE[18][5] === true){
				R3_DESIGN_renderBackupManager();
			};
		} catch (err) {
			R3_SYSTEM_ALERT('ERROR: Unable to inject SCD Hack!\n\nReason: ' + err);
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to inject SCD hack!<br>Reason: ' + err);
		};
	};
};
/*
	RDT Compiler [WIP]
	Tests on R100.RDT

	The compiler will generate a temp pointer to calculate the position of other objects.
	After that, it will create new pointers and attach it on the same location of the temp pointer.
	A similar process will be done to compile the OBJ pointers.
*/
tempFn_R3_RDT['compile'] = function(){
	if (RDT_arquivoBruto !== undefined){
		// var tempOBJ = R3_RDT_rawSections.RAWSECTION_OBJ,
		//	tempPointers = R3_RDT_MAP_HEADER_POINTERS.toString().replace(new RegExp(',', 'gi'), ''),
		//	tempHEX = tempPointers + R3_RDT_rawSections.RAWSECTION_RID + R3_RDT_rawSections.RAWSECTION_OBJ + R3_RDT_rawSections.RAWSECTION_RVD + 'ffffffff' + R3_RDT_rawSections.RAWSECTION_LIT + 'ffffffff' + R3_RDT_rawSections.RAWSECTION_PRI + R3_RDT_rawSections.RAWSECTION_SCA;
		R3_WIP();
	};
};
/*
	END
	Compile functions
*/
tempFn_R3_RDT['obj'] = tempFn_R3_rdtOBJ;
tempFn_R3_RDT['tim'] = tempFn_timManager;
tempFn_R3_RDT['scdHack'] = tempFn_scdHack;
tempFn_R3_RDT['sections'] = tempFn_sections;

const R3_RDT = tempFn_R3_RDT;

delete tempFn_R3_RDT;
delete tempFn_scdHack;
delete tempFn_sections;
delete tempFn_R3_rdtOBJ;
delete tempFn_timManager;