/*
	R3ditor V2 - tim.js
	Oh dear... Why?

	These functions was written using Klarth TIM Tutorial as base
	http://rpgd.emulationworld.com/klarth
	Email: stevemonaco@hotmail.com
*/
// Variables
var TIM_CLUT,
	TIM_header,
	TIM_bppType,
	TIM_RAW_IMG,
	TIM_clutSize,
	TIM_totalCLUT,
	TIM_arquivoBruto,
	TIM_colorsPerCLUT,
	TIM_VRAM_palleteOrgX,
	TIM_VRAM_palleteOrgY;
/*
	Functions
*/
// Load File
function TIM_loadFile(){
	R3_FILE_LOAD('.tim', function(timFile, timHex){
		R3_UTILS_VAR_CLEAN_TIM();
		TIM_arquivoBruto = timHex;
		TIM_decompileFile();
	}, undefined, 'hex');
};
// Decompile TIM
function TIM_decompileFile(){
	if (TIM_arquivoBruto !== undefined){
		TIM_header = TIM_arquivoBruto.slice(0, 8);
		TIM_bppType = TIM_arquivoBruto.slice(8, 16);
		/*
			8BPP With CLUT
		*/
		if (TIM_bppType === '09000000'){
			TIM_clutSize		 = TIM_arquivoBruto.slice(16, 24);
			TIM_VRAM_palleteOrgX = TIM_arquivoBruto.slice(24, 28);
			TIM_VRAM_palleteOrgY = TIM_arquivoBruto.slice(28, 32);
			TIM_colorsPerCLUT	 = TIM_arquivoBruto.slice(32, 36);
			TIM_totalCLUT   	 = TIM_arquivoBruto.slice(36, 40);
			// Extract All CLUTS
			var clutSizeConvert = parseInt((R3_parseEndianToInt(R3_parseEndian(TIM_clutSize)) - 12) * 2);
			CLUT_RAW = TIM_arquivoBruto.slice(40, parseInt(clutSizeConvert + 40));
			TIM_CLUT = CLUT_RAW.match(new RegExp('.{' + clutSizeConvert + ',' + clutSizeConvert + '}', 'g'));
			// Extract Metadata
			var metadataStart  = parseInt(TIM_arquivoBruto.indexOf(CLUT_RAW) + CLUT_RAW.length),
				META_imgSize   = TIM_arquivoBruto.slice(metadataStart, parseInt(metadataStart + 8)),
				META_imgOrgX   = TIM_arquivoBruto.slice(parseInt(metadataStart + 8),  parseInt(metadataStart + 12)),
				META_imgOrgY   = TIM_arquivoBruto.slice(parseInt(metadataStart + 12), parseInt(metadataStart + 16)),
				META_imgWidth  = TIM_arquivoBruto.slice(parseInt(metadataStart + 16), parseInt(metadataStart + 20)),
				META_imgHeight = TIM_arquivoBruto.slice(parseInt(metadataStart + 20), parseInt(metadataStart + 24)),
				convertImgSize = parseInt((R3_parseEndianToInt(R3_parseEndian(META_imgSize)) - 12) * 2);
			// Extract Image
			TIM_RAW_IMG = TIM_arquivoBruto.slice(parseInt(metadataStart + 24), (parseInt(metadataStart + 24) + convertImgSize));
		};
	};
};
/*
	Extract TIM from string + location
*/
// Get TIM file from string
function TIM_getTimFromString(hex, location){
	if (hex !== undefined && location !== undefined){
		R3_UTILS_VAR_CLEAN_TIM();
		// Start Read
		TIM_header  = hex.slice(location, parseInt(location + 8));
		TIM_bppType = hex.slice((location + 8), (location + 16));
		/*
			8BPP With CLUT
		*/
		if (TIM_bppType === '09000000'){
			TIM_clutSize = hex.slice((location + 16), (location + 24));
			var clutSizeConvert = parseInt((R3_parseEndianToInt(R3_parseEndian(TIM_clutSize)) - 12) * 2);
			CLUT_RAW = hex.slice((location + 40), (location + (clutSizeConvert + 40)));
			var metadataStart  = parseInt(hex.indexOf(CLUT_RAW) + CLUT_RAW.length),
				META_imgSize   = hex.slice(metadataStart, parseInt(metadataStart + 8)),
				convertImgSize = parseInt((R3_parseEndianToInt(R3_parseEndian(META_imgSize)) - 12) * 2);
			TIM_RAW_IMG = hex.slice(parseInt(metadataStart + 24), (parseInt(metadataStart + 24) + convertImgSize));
			// End
			return hex.slice(location, (hex.indexOf(TIM_RAW_IMG) + TIM_RAW_IMG.length));
		};
	};
};
/*
	Check if file is a valid TIM
	This will check if file has BPP
*/
function TIM_checkIntegrity(timHex){
	if (timHex !== undefined){
		var loc = 0, res = false;
		try {
			TMP_header = timHex.slice(loc, parseInt(loc + 8));
			TMP_bppType = timHex.slice((loc + 8), (loc + 16));
			if (TIM_BPP[TMP_bppType] !== undefined){
				res = true;
			};
		} catch (err) {
			console.error(err);
		};
		return res;
	};
};
/*
	TIM Manager functions
*/
/*
	Import / Export TIM
	Mode: 0 - Import
		  1 - Export
*/
function R3_TIM_MANAGER_importExport(mode){
	if (RDT_arquivoBruto !== undefined && mode !== undefined){
		if (mode === 0){
			R3_FILE_LOAD('.tim', function(fPath, hxFile){
				if (TIM_checkIntegrity(hxFile) === true){
					R3_RDT_ARRAY_TIM[R3_RDT_currentTimFile] = hxFile;
					R3_SYSTEM_ALERT('INFO: (TIM Manager) Import Successful!');
					R3_SYSTEM_LOG('separator');
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (TIM Manager) Import Successful!');
					if (R3_WEBMODE === false){
						R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + fPath + '</font>');
					};
				} else {
					R3_SYSTEM_ALERT('WARN: Unable to import TIM file!\nReason: This file failed on TIM integrity check!');
				};
			}, undefined, 'hex');
		} else {
			R3_FILE_SAVE('TIM_' + R3_RDT_mapName + '_' + (R3_RDT_currentTimFile + 1) + '.tim', R3_RDT_rawSections.ARRAY_TIM[R3_RDT_currentTimFile], 'hex', '.tim', function(fName){
				R3_SYSTEM_ALERT('INFO: (TIM Manager) Export Successful!');
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (TIM Manager) Export Successful!');
				if (R3_WEBMODE === false){
					R3_SYSTEM_LOG('log', 'Path: <font class="user-can-select">' + fName + '</font>');
				};
			});
		};
	};
};