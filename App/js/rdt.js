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
		14: BLK 	  - Block Data
		15: MSG		  - Text Messages
		16: RBJ		  - Animation Data
		17: ???		  - Unk Data
		18: SCD		  - Script Code Database
		19: EFF		  - Effects Data
		20: SND		  - Sound Data
		21: EFFSPR    - Sprite Effects
		22: TIM		  - TIM Location?
		23: ???		  - Unk Data
	*/
	// Raw Sections
	R3_RDT_RAWSECTION_VB,
	R3_RDT_RAWSECTION_SCA,
	R3_RDT_RAWSECTION_RID,
	R3_RDT_RAWSECTION_RVD,
	R3_RDT_RAWSECTION_OBJ,
	R3_RDT_RAWSECTION_LIT,
	R3_RDT_RAWSECTION_PRI,
	R3_RDT_RAWSECTION_FLR,
	R3_RDT_RAWSECTION_MSG,
	R3_RDT_RAWSECTION_SCD,
	R3_RDT_RAWSECTION_EFF,
	R3_RDT_RAWSECTION_SND,
	R3_RDT_RAWSECTION_BLK,
	R3_RDT_RAWSECTION_RBJ,
	R3_RDT_RAWSECTION_EFFSPR,
	// Copy of original sections
	R3_RDT_ORIGINAL_VB,
	R3_RDT_ORIGINAL_SCA,
	R3_RDT_ORIGINAL_RID,
	R3_RDT_ORIGINAL_RVD,
	R3_RDT_ORIGINAL_OBJ,
	R3_RDT_ORIGINAL_LIT,
	R3_RDT_ORIGINAL_PRI,
	R3_RDT_ORIGINAL_FLR,
	R3_RDT_ORIGINAL_MSG,
	R3_RDT_ORIGINAL_SCD,
	R3_RDT_ORIGINAL_EFF,
	R3_RDT_ORIGINAL_SND,
	R3_RDT_ORIGINAL_BLK,
	R3_RDT_ORIGINAL_RBJ,
	R3_RDT_ORIGINAL_EFFSPR,
	// Extra Arrays
	R3_RDT_ARRAY_TIM = [],
	R3_RDT_ARRAY_OBJ = [];
/*
	Functions
*/
// New file [This will take a time...]
function R3_RDT_NEW_FILE(){
	R3_WIP();
};
// Load files
function R3_RDT_loadFile(){
	R3_FILE_LOAD('.rdt', function(rdtFile, hFile){
		R3_RDT_LOAD(rdtFile, true, hFile);
	});
};
// Check before open
function R3_RDT_LOAD(rdtFile, showInterface, hexFile){
	var c = 0, headersTemp, fName, loaderInterval, errMsg, mapPath = '';
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
			errMsg = 'WARN: PS ARD files are not compatible with RDT Editor.\n\nIn order to open these files: Run ARD Extract first and then, open extracted RDT.';
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
				document.title = APP_TITLE + ' - RDT Editor - File: ' + R3_RDT_mapName + '.RDT';
				R3_SYSTEM_LOG('log', 'R3ditor V2 - (RDT) Loading file: <font class="user-can-select">' + mapPath + '</font>');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - (RDT) Map Name: ' + RDT_locations[R3_RDT_mapName][0]);
				R3_SYSTEM_LOG('log', 'R3ditor V2 - (RDT) Location: ' + RDT_locations[R3_RDT_mapName][1]);
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
				while (c < headersTemp.length){
					if (c === 0){
						R3_RDT_MAP_HEADER_POINTERS.push(headersTemp[c]);
					} else {
						R3_RDT_MAP_HEADER_POINTERS.push(R3_parseEndian(headersTemp[c]));
					};
					c++;
				};
				/*
					Get Extra Info From RDT
				*/
				R3_RDT_MAP_totalCams = parseInt(R3_RDT_MAP_HEADER_POINTERS[0].slice(0, 4), 16);
				/*
					Extract Sections
					Note: PRI extraction function will be executed inside LIT.
				*/
				if (R3_DOORLINK_RUNNING === false){
					R3_RDT_EXTRACT_VB();
					R3_RDT_EXTRACT_SCA();
					R3_RDT_EXTRACT_OBJ();
					R3_RDT_EXTRACT_RID();
					R3_RDT_EXTRACT_RVD();
					R3_RDT_EXTRACT_LIT();
					R3_RDT_EXTRACT_BLK();
				};
				R3_RDT_EXTRACT_SCD();
				if (R3_DOORLINK_RUNNING === false){
					R3_RDT_EXTRACT_MSG();
					R3_RDT_EXTRACT_FLR();
					R3_RDT_EXTRACT_EFF();
				};
				/*
					End
				*/
				R3_RDT_LOADED = true;
				R3_RDT_COPY_ORIGINALS();
				// Skip some stuff
				if (R3_DOORLINK_RUNNING === false){
					R3_RDT_checkIfScdHack();
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
// Make a copy of all original sections
function R3_RDT_COPY_ORIGINALS(){
	if (RDT_arquivoBruto !== undefined){
		R3_RDT_ORIGINAL_VB  = R3_RDT_RAWSECTION_VB;
		R3_RDT_ORIGINAL_SCA = R3_RDT_RAWSECTION_SCA;
		R3_RDT_ORIGINAL_RID = R3_RDT_RAWSECTION_RID;
		R3_RDT_ORIGINAL_RVD = R3_RDT_RAWSECTION_RVD;
		R3_RDT_ORIGINAL_OBJ = R3_RDT_RAWSECTION_OBJ;
		R3_RDT_ORIGINAL_LIT = R3_RDT_RAWSECTION_LIT;
		R3_RDT_ORIGINAL_SCD = R3_RDT_RAWSECTION_SCD;
		R3_RDT_ORIGINAL_MSG = R3_RDT_RAWSECTION_MSG;
		R3_RDT_ORIGINAL_EFF = R3_RDT_RAWSECTION_EFF;
		R3_RDT_ORIGINAL_SND = R3_RDT_RAWSECTION_SND;
		R3_RDT_ORIGINAL_BLK = R3_RDT_RAWSECTION_BLK;
		R3_RDT_ORIGINAL_FLR = R3_RDT_RAWSECTION_FLR;
		R3_RDT_ORIGINAL_RBJ = R3_RDT_RAWSECTION_RBJ;
		// Extract PRI
		R3_RDT_EXTRACT_PRI();
		R3_RDT_ORIGINAL_PRI = R3_RDT_RAWSECTION_PRI;
	};
};
// Blank section error message
function R3_RDT_ERROR_POINTER_BLANK(section){
	if (RDT_arquivoBruto !== undefined && section !== undefined){
		R3_SYSTEM_LOG('separator');
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to extract ' + section + ' since the pointers are blank! (<font class="user-can-select">00000000</font>) <br>Check pointers array [R3_RDT_MAP_HEADER_POINTERS] to know more about.');
		R3_SYSTEM_LOG('separator');
	};
};
// Check if SCD hack is present
function R3_RDT_checkIfScdHack(){
	if (RDT_arquivoBruto !== undefined){
		if (RDT_arquivoBruto.indexOf(R3_RDT_DIVISOR) !== -1){
			R3_RDT_SCD_HACK_ENABLED = true;
		} else {
			R3_RDT_SCD_HACK_ENABLED = false;
		};
		R3_DESIGN_updateScdHack();
	};
};

/*
	================================
	|  Extract / Read RDT Sections  |
	================================
*/

/*
	FLR
	Floor Data
*/
// Extract FLR from RDT
function R3_RDT_EXTRACT_FLR(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading FLR...');
		if (R3_RDT_MAP_HEADER_POINTERS[13] !== '00000000'){
			// It seems to always ends on SCD Start
			var flrStart = (parseInt(R3_RDT_MAP_HEADER_POINTERS[13], 16) * 2),
				flrEnd = RDT_arquivoBruto.indexOf(R3_RDT_RAWSECTION_SCD);
			R3_RDT_RAWSECTION_FLR = RDT_arquivoBruto.slice(flrStart, flrEnd);
		} else {
			R3_RDT_ERROR_POINTER_BLANK('FLR');
		};
	};
};
// Open FLR
function R3_RDT_OPEN_FLR(){
	R3_WIP();
};
/*
	BLK
	AI Path Finding
*/
// Extract BLK from RDT
function R3_RDT_EXTRACT_BLK(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading BLK...');
		// R3_SYSTEM_LOG('warn', 'R3ditor V2 - WANR: Unable to extract BLK! #SadFace');
	};
};
// Open BLK
function R3_RDT_OPEN_BLK(){
	R3_WIP();
};
/*
	VB
	Sound Data
*/
// Extract VB from RDT
function R3_RDT_EXTRACT_VB(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading VB...');
		if (R3_RDT_MAP_HEADER_POINTERS[2] !== '00000000'){
			/*
				Quick note:
				As i have seen, all maps has this section with the same length, so i will extract
				it using a simple crop + the usual length.
			*/
			var VB_location = (parseInt(R3_RDT_MAP_HEADER_POINTERS[2], 16) * 2);
			R3_RDT_RAWSECTION_VB = RDT_arquivoBruto.slice(VB_location, parseInt(VB_location + 384));
		} else {
			R3_RDT_ERROR_POINTER_BLANK('VB');
		};
	};
};
/*
	RVD
	Camera Trigger [WIP]
*/
// Extract RVD from RDT
function R3_RDT_EXTRACT_RVD(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading RVD...');
		if (R3_RDT_MAP_HEADER_POINTERS[10] !== '00000000'){
			var RVD_location = (parseInt(R3_RDT_MAP_HEADER_POINTERS[10], 16) * 2),
				tempRVD = RDT_arquivoBruto.slice(RVD_location);
			R3_RDT_RAWSECTION_RVD = tempRVD.slice(0, tempRVD.indexOf('ffffffff'));
		} else {
			R3_RDT_ERROR_POINTER_BLANK('RVD');
		};
	};
};
/*
	OBJ
	TIM / 3D Objects
*/
// Extract TIM / OBJ from RDT
function R3_RDT_EXTRACT_OBJ(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading OBJ / TIM...');
		if (R3_RDT_MAP_HEADER_POINTERS[12] !== '00000000'){
			var c = 0, tempSection = '',
				OBJ_location = (parseInt(R3_RDT_MAP_HEADER_POINTERS[12], 16) * 2),
				totalObjects = parseInt(R3_RDT_MAP_HEADER_POINTERS[0].slice(4, 6), 16),
				tempRDT = RDT_arquivoBruto.slice(OBJ_location, RDT_arquivoBruto.length).match(/.{16,16}/g);
			if (totalObjects !== 0){
				while (c < totalObjects){
					tempSection = tempSection + tempRDT[c];
					c++;
				};
				R3_RDT_RAWSECTION_OBJ = tempSection;
				// Get all TIM / OBJ Files
				c = 0;
				tempRDT = R3_RDT_RAWSECTION_OBJ.match(/.{16,16}/g);
				while (c < tempRDT.length){
					var tempTim = TIM_getTimFromString(RDT_arquivoBruto, (parseInt(R3_parseEndian(tempRDT[c].slice(0, 8)), 16) * 2)),
						temp3dObj = OBJ_extractObjFromString(RDT_arquivoBruto, c, (parseInt(R3_parseEndian(tempRDT[c].slice(8, 16)), 16) * 2));
					if (R3_RDT_ARRAY_TIM.indexOf(tempTim) === -1){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading TIM file ' + c);
						R3_RDT_ARRAY_TIM.push(tempTim);
					};
					if (R3_RDT_ARRAY_OBJ.indexOf(temp3dObj) === -1){
						R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading 3D OBJ file ' + c);
						R3_RDT_ARRAY_OBJ.push(temp3dObj);
					}
					c++;
				};
			} else {
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: ' + R3_RDT_mapName + ' does not have any TIM / OBJ file!');
			};
		} else {
			R3_RDT_ERROR_POINTER_BLANK('OBJ');
		};
	};
};
// Open TIM Manager
function R3_RDT_OPEN_TIM(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_ARRAY_TIM !== []){
		var c = 0, HTML_TEMPLATE = '';
		while (c < R3_RDT_ARRAY_TIM.length){
			HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + c + '">TIM File ' + (c + 1) + '</option>';
			c++;
		};
		document.getElementById('R3_RDT_timManagerList').innerHTML = HTML_TEMPLATE;
		// End
		R3_DESIGN_MINIWINDOW_OPEN(16);
	};
};
// Open OBJ Manager
function R3_RDT_OPEN_OBJ(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_ARRAY_OBJ !== []){
		var c = 0, HTML_TEMPLATE = '';
		while (c < R3_RDT_ARRAY_OBJ.length){
			if (R3_RDT_ARRAY_OBJ[c] !== ''){
				HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + c + '">OBJ File ' + (c + 1) + '</option>';
			} else {
				HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + c + '" disabled="disabled" title="This OBJ is disabled because it haves a null location (0)">OBJ File ' + (c + 1) + '</option>';
			};
			c++;
		};
		document.getElementById('R3_RDT_objManagerList').innerHTML = HTML_TEMPLATE;
		// End
		R3_DESIGN_MINIWINDOW_OPEN(17);
	};
};
/*
	SCA
	Colission / Boundaries
*/
// Extract SCA from RDT
function R3_RDT_EXTRACT_SCA(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading SCA...');
		if (R3_RDT_MAP_HEADER_POINTERS[8] !== '00000000'){
			var SCA_location = (parseInt(R3_RDT_MAP_HEADER_POINTERS[8], 16) * 2),
				SCA_itemStart = parseInt(SCA_location + 32),
				SCA_unkArrayStart = parseInt(SCA_location + 8),
				SCA_totalItems = parseInt(R3_parseEndianToInt(R3_parseEndian(RDT_arquivoBruto.slice(SCA_location, SCA_unkArrayStart))) - 1),
				SCA_header = RDT_arquivoBruto.slice(SCA_location, SCA_itemStart),
				SCA_boundaries = RDT_arquivoBruto.slice(SCA_itemStart, parseInt(SCA_itemStart + (SCA_totalItems * 32))); // 32 = Length per colission
			R3_RDT_RAWSECTION_SCA = SCA_header + SCA_boundaries;
		} else {
			R3_RDT_ERROR_POINTER_BLANK('SCA');
		};
	};
};
// Open SCA on SCA editor
function R3_RDT_OPEN_SCA(){
	if (RDT_arquivoBruto !== undefined){
		R3_WIP();
	};
};
/*
	RID
	Camera Angles / Positions
*/
// Extract RID from RDT
function R3_RDT_EXTRACT_RID(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading RID...');
		var RID_totalCameras = parseInt(R3_RDT_MAP_HEADER_POINTERS[0].slice(2, 4), 16),
			RID_startLocation = (parseInt(R3_RDT_MAP_HEADER_POINTERS[9], 16) * 2);
		R3_RDT_RAWSECTION_RID = RDT_arquivoBruto.slice(RID_startLocation, parseInt(RID_startLocation + parseInt(64 * RID_totalCameras)));
	};
};
// Open RID from RDT
function R3_RDT_OPEN_RID(){
	R3_DESIGN_MINIWINDOW_CLOSE(16);
	R3_DESIGN_MINIWINDOW_CLOSE(17);
	R3_UTILS_VAR_CLEAN_RID();
	RID_arquivoBruto = R3_RDT_RAWSECTION_RID;
	RID_cameraList = RID_arquivoBruto.match(/.{64,64}/g);
	R3_RID_START_DECOMPILER();
	R3_DESIGN_MINIWINDOW_OPEN(6, 'center');
};
/*
	LIT
	Light Source Infos

	Light Info Length 28h (HEX) [WIP]
*/
// Extract LIT from RDT
function R3_RDT_EXTRACT_LIT(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading LIT...');
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
				R3_SYSTEM_LOG('warn', 'RDT - WARN: Unable to extract LIT section!');
				R3_SYSTEM_LOG('warn', 'Reason: Reach the end of the file!');
			};
		};
		// End
		R3_RDT_RAWSECTION_LIT = LIT_pointers + LIT_TEMP;
	};
};
// Open LIT on LIT Editor
function R3_RDT_OPEN_LIT(){
	if (RDT_arquivoBruto !== undefined){
		R3_UTILS_VAR_CLEAN_LIT();
		LIT_arquivoBruto = R3_RDT_RAWSECTION_LIT;
		R3_LIT_DECOMPILE();
	};
};
/*
	PRI
	Camera Mask (AKA. F. King / TMS Nighmare) [WIP]
	
	This is not the best implementation, but... OOF! Anyways - at least is here and it works!
*/
// Extract PRI from RDT
function R3_RDT_EXTRACT_PRI(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_RAWSECTION_LIT !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading PRI...');
		R3_RDT_RAWSECTION_PRI = RDT_arquivoBruto.slice((RDT_arquivoBruto.indexOf(R3_RDT_ORIGINAL_LIT) + (R3_RDT_ORIGINAL_LIT.length + 8)), RDT_arquivoBruto.indexOf(R3_RDT_ORIGINAL_SCA));
	};
};
// Open PRI on PRI Editor
function R3_RDT_OPEN_PRI(){
	if (RDT_arquivoBruto !== undefined){
		R3_WIP();
	};
};
/*
	SLD
	Scene Layer Data
*/
// Open current SLD
function R3_RDT_OPEN_SLD(){
	if (RDT_arquivoBruto !== undefined){
		if (APP_FS.existsSync(R3_RE3SLDE_PATH) === true){
			var sldFile = APP_PATH + '/Assets/DATA_A/BSS/' + R3_RDT_mapName + '.SLD';
			if (APP_FS.existsSync(sldFile) === true){
				R3_runExec(R3_RE3SLDE_PATH, [sldFile]);
			}
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to find Leo2236 RE3SLDE!');
			R3_SYSTEM_LOG('warn', 'Insert the RE3SLDE path on settings menu and try again.');
		};
	};
};
/*
	MSG
	Text Messages
*/
// Extract MSG From RDT
function R3_RDT_EXTRACT_MSG(){
	if (RDT_arquivoBruto !== undefined){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading MSG...');
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
			R3_RDT_RAWSECTION_MSG = MSG_RAW_SECTION + RDT_MSG_SEEK_AREA.slice(0, parseInt(RDT_MSG_SEEK_AREA.indexOf('fe') + 4));
			// Generate Msg Preview
			R3_RDT_generateMsgPreview();
		} else {
			var alertMsg = 'R3ditor V2 - WARN: This map does not have any message!';
			R3_SYSTEM_LOG('warn', alertMsg);
		};
	};
};
// Open MSG Section
function R3_RDT_OPEN_MSG(){
	if (RDT_arquivoBruto !== undefined){
		if (R3_RDT_MAP_HEADER_POINTERS[15] !== '00000000'){
			R3_MSG_decompileRDT(true);
			if (SETTINGS_MSG_AUTO_OPEN_MESSAGE_LIST === true){
				R3_DESIGN_MINIWINDOW_OPEN(5);
			};
		} else {
			var alertMsg = 'WARN: This map does not have any message!';
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - ' + alertMsg);
			R3_SYSTEM_ALERT(alertMsg);
		};
	};
};
// Generate Messages Preview
function R3_RDT_generateMsgPreview(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_RAWSECTION_MSG !== undefined){
		R3_MSG_RDT_MESSAGES_PREVIEW = [];
		var c = 0, d = 1, cMessage;
		R3_MSG_decompileRDT(false);
		while (c < R3_MSG_RDT_MESSAGES.length){
			d = 1;
			cMessage = '';
			R3_MSG_DECOMPILER_START(R3_MSG_RDT_MESSAGES[c]);
			while (d < Object.keys(R3_MSG_commands).length){
				if (R3_MSG_commands[d][0] === 0){
					cMessage = cMessage + R3_MSG_commands[d][1]; 
				};
				if (R3_MSG_convertHexToPureText(cMessage) !== ''){
					R3_MSG_RDT_MESSAGES_PREVIEW.push(R3_MSG_convertHexToPureText(cMessage));
				};
				d++;
			};
			c++;
		};
		// End
		document.getElementById('R3_MSG_EDIT_TEXTAREA').value = '';
	};
};
/*
	SCD
	Script Code Data
*/
// Extract SCD from RDT
function R3_RDT_EXTRACT_SCD(){
	if (RDT_arquivoBruto !== undefined){
		if (R3_DOORLINK_RUNNING !== true){
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading SCD...');
		};
		var c = 0, RDT_SCD_SEEK_AREA, foundEnd = false, cOpcode = '', tmpStart = 0, tmpEnd = 2, lastScript = '',
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
				var opcodeLength = parseInt(R3_SCD_DATABASE[cOpcode][0] * 2);
				tmpStart = (tmpStart + opcodeLength);
				tmpEnd = (tmpEnd + opcodeLength);
			};
		};
		R3_RDT_RAWSECTION_SCD = SCD_RAW_SECTION + lastScript;
	};
};
// Open SCD on SCD Editor
function R3_RDT_OPEN_SCD(){
	if (R3_RDT_RAWSECTION_SCD !== undefined){
		R3_DESIGN_CLEAN_SCD();
		R3_UTILS_VAR_CLEAN_SCD();
		SCD_arquivoBruto = R3_RDT_RAWSECTION_SCD;
		if (R3_WEBMODE === false){
			R3_SCD_fileName = R3_getFileName(ORIGINAL_FILENAME).toUpperCase();
		} else {
			R3_SCD_fileName = ORIGINAL_FILENAME.name.replace('.RDT', '');
		};
		R3_SCD_START_DECOMPILER(R3_RDT_RAWSECTION_SCD);
	    document.title = APP_TITLE + ' - SCD Editor - File: ' + R3_SCD_fileName + '.RDT';
		// Display Apply SCD on RDT
		$('#R3_SCD_BTN_APPLYRDT').css({'display': 'inline-flex'});
		R3_SHOW_MENU(9);
	} else {
		R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: You need open a map first before loading scripts.');
	};
};
/*
	EFF
	Effects Data
*/
// Extract EFF from RDT
function R3_RDT_EXTRACT_EFF(){
	R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Reading EFF...');
	/*
		Since EFF and SND are sequent, this extraction method is kinda simple.
		I still think there is a more logical way to make this work properly...
	*/
	var RDT_EFF_POINTER = R3_RDT_MAP_HEADER_POINTERS[19], RDT_SND_POINTER = R3_RDT_MAP_HEADER_POINTERS[20];
	if (RDT_EFF_POINTER !== '00000000' && RDT_SND_POINTER !== '00000000'){
		var tempSize = R3_parsePositive(parseInt((parseInt(RDT_EFF_POINTER, 16) * 2) - (parseInt(RDT_SND_POINTER, 16) * 2)));
		R3_RDT_RAWSECTION_EFF = RDT_arquivoBruto.slice((parseInt(RDT_EFF_POINTER, 16) * 2), ((parseInt(RDT_EFF_POINTER, 16) * 2) + tempSize));
	} else {
		R3_RDT_ERROR_POINTER_BLANK('EFF');
	};
};
/*
	Export Sections
	This will export each section hex data
*/
function R3_RDT_EXPORT_SECTION(sectionId){
	if (RDT_arquivoBruto !== undefined){
		if (sectionId === undefined){
			sectionId = 0;
		};
		var sectionName = rawHex = '',
			sID = parseInt(sectionId);
		// VB
		if (sID === 0){
			sectionName = 'VB';
			rawHex = R3_RDT_RAWSECTION_VB;
		};
		// SCA
		if (sID === 1){
			sectionName = 'SCA';
			rawHex = R3_RDT_RAWSECTION_SCA;
		};
		// RID
		if (sID === 2){
			sectionName = 'RID';
			rawHex = R3_RDT_RAWSECTION_RID;
		};
		// RVD
		if (sID === 3){
			sectionName = 'RVD';
			rawHex = R3_RDT_RAWSECTION_RVD;
		};
		// OBJ
		if (sID === 4){
			sectionName = 'OBJ';
			rawHex = R3_RDT_RAWSECTION_OBJ;
		};
		// LIT
		if (sID === 5){
			sectionName = 'LIT';
			rawHex = R3_RDT_RAWSECTION_LIT;
		};
		// MSG
		if (sID === 6){
			sectionName = 'MSG';
			rawHex = R3_RDT_RAWSECTION_MSG;
		};
		// SCD
		if (sID === 7){
			sectionName = 'SCD';
			rawHex = R3_RDT_RAWSECTION_SCD;
		};
		// EFF
		if (sID === 8){
			sectionName = 'EFF';
			rawHex = R3_RDT_RAWSECTION_EFF;
		};
		// SND
		if (sID === 9){
			sectionName = 'SND';
			rawHex = R3_RDT_RAWSECTION_SND;
		};
		// FLR
		if (sID === 10){
			sectionName = 'FLR';
			rawHex = R3_RDT_RAWSECTION_FLR;
		};
		/*
			End
		*/
		if (rawHex !== undefined){
			R3_FILE_SAVE(R3_RDT_mapName + '_' + sectionName + '.' + sectionName.toLowerCase(), rawHex, 'hex', '.' + sectionName.toLowerCase(), function(fPath){
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Process complete! (' + sectionName + ')<br>Path: <font class="user-can-select">' + fPath + '</font>');
			});
		};
	};
};
/*
	SCD HACK - Set SCD and MSG to the end of file for debugging process.

	This is not the most polite stuff to do, but it will help testing the editor!
	Remove this shitty later!
*/
// Enable Hack
function R3_RDT_SCD_HACK_ENABLE(){
	if (RDT_arquivoBruto !== undefined && R3_RDT_SCD_HACK_ENABLED === false){
		var cEditor = R3_DISC_MENUS[R3_MENU_CURRENT][0], RDT_HACK_FINAL, fName, conf = R3_SYSTEM_CONFIRM('WARNING:\nThis process will copy the current SCD and MSG sections to the end of the file.\n\nThis is not recomended because this process is used only for debugging and will make the file larger / messy.\n\nIt\'s not recomended do this process on maps that haves enemies / npc\'s (SCD 7D Opcode), otherwise it will crash!\n\nAlso: DON\'T RUN THIS PROCESS TWICE IN THE SAME FILE!!!\n\nDo you want to continue anyway?');
		if (conf === true){
			if (R3_WEBMODE === false){
				fName = R3_getFileName(ORIGINAL_FILENAME).toUpperCase();
			} else {
				fName = R3_getFileName(ORIGINAL_FILENAME.name).toUpperCase();
			};
			R3_UTILS_BACKUP(RDT_arquivoBruto, fName, '.RDT', APP_PATH + '/Configs/Backup/RDT', cEditor);
			var newHackRDT = RDT_arquivoBruto + R3_RDT_RAWSECTION_SCD + R3_RDT_DIVISOR + R3_RDT_RAWSECTION_MSG,
				newSCDPointer  = R3_parseEndian(MEMORY_JS_fixVars((RDT_arquivoBruto.length / 2).toString(16), 8)),
				RDT_HACK_START = RDT_arquivoBruto.slice(0, 144),
				RDT_HACK_END   = newHackRDT.slice(152, newHackRDT.length),
				RDT_HACK_SCD   = RDT_HACK_START + newSCDPointer + RDT_HACK_END,
				newMSGPointer  = R3_parseEndian(MEMORY_JS_fixVars(parseInt((RDT_HACK_SCD.indexOf(R3_RDT_DIVISOR) + R3_RDT_DIVISOR.length) / 2).toString(16), 8));
			// Update MSG Pointer
			RDT_HACK_START = RDT_HACK_SCD.slice(0, 120);
			RDT_HACK_END   = RDT_HACK_SCD.slice(128, RDT_HACK_SCD.length);
			RDT_HACK_FINAL = RDT_HACK_START + newMSGPointer + RDT_HACK_END;
			// I'm Not Proud of this...
			APP_FS.writeFileSync(ORIGINAL_FILENAME, RDT_HACK_FINAL, 'hex');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Hack done sucessfully!');
			R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + ORIGINAL_FILENAME + '</font>');
			R3_SYSTEM_ALERT('ENABLE SCD HACK: Process Complete!');
			// Update backup manager if it's open
			if (R3_MINI_WINDOW_DATABASE_STATUS[18] === true){
				R3_DESIGN_renderBackupManager();
			};
			// At least... It works...
			if (R3_WEBMODE === false){
				R3_RDT_LOAD(ORIGINAL_FILENAME, true);
			};
		};
	};
};
// Apply Hack Check
function R3_RDT_SCD_HACK_APPLY(skip){
	if (RDT_arquivoBruto !== undefined){
		if (R3_RDT_SCD_HACK_ENABLED === true){
			if (skip === true){
				R3_SCD_COMPILE(4);
				R3_RDT_SCD_HACK_INJECT_SCD();
			} else {
				var conf = R3_SYSTEM_CONFIRM('WARNING:\nThis process will insert the extracted SCD in the end of this file.\n\nThis is not recomended because this process is used only for debugging and if you didn\'t run \"ENABLE SCD HACK\" before, it can brick the file.\n\nDo you want to continue anyway?');
				if (conf === true){
					R3_RDT_SCD_HACK_INJECT_SCD();
				};
			};
		} else {
			R3_RDT_SCD_HACK_ENABLE();
		};
	};
};
// Inject Code
function R3_RDT_SCD_HACK_INJECT_SCD(){
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
			RDT_HACK_SCD   = RDT_HACK_START + R3_RDT_RAWSECTION_SCD + R3_RDT_DIVISOR + R3_RDT_RAWSECTION_MSG;
			newMSGPointer  = R3_parseEndian(MEMORY_JS_fixVars(parseInt((RDT_HACK_SCD.indexOf(R3_RDT_DIVISOR) + R3_RDT_DIVISOR.length) / 2).toString(16), 8));
			// Update Pointer for MSG
			RDT_HACK_START = RDT_HACK_SCD.slice(0, 120);
			RDT_HACK_END   = RDT_HACK_SCD.slice(128, RDT_HACK_SCD.length);
			RDT_HACK_FINAL = RDT_HACK_START + newMSGPointer + RDT_HACK_END;
			// Let's just hope for this...
			APP_FS.writeFileSync(ORIGINAL_FILENAME, RDT_HACK_FINAL, 'hex');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: SCD Hack updated sucessfully!');
			R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + ORIGINAL_FILENAME + '</font>');
			R3_SYSTEM_ALERT('APPLY SCD HACK: Process Complete!');
			// Update backup manager if it's open
			if (R3_MINI_WINDOW_DATABASE_STATUS[18] === true){
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
	Test on R100.RDT

	The compiler will generate a temp pointer to calculate the position of other objects.
	After that, it will create new pointers and attach it on the same location of the temp pointer.
	A similar process will be done to recompile the OBJ pointers.
*/
function R3_RDT_RECOMPILE(){
	if (RDT_arquivoBruto !== undefined){
		var tempOBJ = R3_RDT_RAWSECTION_OBJ,
			tempPointers = R3_RDT_MAP_HEADER_POINTERS.toString().replace(new RegExp(',', 'gi'), ''),
			tempHEX = tempPointers + R3_RDT_RAWSECTION_RID + R3_RDT_RAWSECTION_OBJ + R3_RDT_RAWSECTION_RVD + 'ffffffff' + R3_RDT_RAWSECTION_LIT + 'ffffffff' + R3_RDT_RAWSECTION_PRI + R3_RDT_RAWSECTION_SCA;
		R3_WIP();
	};
};