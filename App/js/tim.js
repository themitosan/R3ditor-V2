/*
	*******************************************************************************
	R3ditor V2 - tim.js
	By TheMitoSan

	This file is responsible for reading, deconding and extracting TIM files.
	Some functions inside this file was written using Klarth TIM Tutorial as base.
	
	http://rpgd.emulationworld.com/klarth
	Email: stevemonaco@hotmail.com
	*******************************************************************************
*/
// Variables
var TIM_CLUT, TIM_header, TIM_bppType, TIM_RAW_IMG, TIM_clutSize, TIM_totalCLUT, TIM_arquivoBruto, TIM_colorsPerCLUT, TIM_VRAM_palleteOrgX, TIM_VRAM_palleteOrgY;
// Objects
tempFn_R3_TIM = {};
tempFn_timManager = {};
/*
	Functions
*/
// Load File TIM_loadFile
tempFn_R3_TIM['loadFile'] = function(){
	R3_fileManager.loadFile('.tim', function(timFile, timHex){
		R3_UTILS_VAR_CLEAN_TIM();
		TIM_arquivoBruto = timHex;
		TIM.decompileFile();
	}, undefined, 'hex');
};
// Decompile TIM TIM_decompileFile
tempFn_R3_TIM['decompileFile'] = function(){
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
			var clutSizeConvert = parseInt((R3_tools.parseEndianToInt(R3_tools.parseEndian(TIM_clutSize)) - 12) * 2);
			CLUT_RAW = TIM_arquivoBruto.slice(40, parseInt(clutSizeConvert + 40));
			TIM_CLUT = CLUT_RAW.match(new RegExp('.{' + clutSizeConvert + ',' + clutSizeConvert + '}', 'g'));
			// Extract Metadata
			var metadataStart  = parseInt(TIM_arquivoBruto.indexOf(CLUT_RAW) + CLUT_RAW.length),
				META_imgSize   = TIM_arquivoBruto.slice(metadataStart, parseInt(metadataStart + 8)),
				META_imgOrgX   = TIM_arquivoBruto.slice(parseInt(metadataStart + 8),  parseInt(metadataStart + 12)),
				META_imgOrgY   = TIM_arquivoBruto.slice(parseInt(metadataStart + 12), parseInt(metadataStart + 16)),
				META_imgWidth  = TIM_arquivoBruto.slice(parseInt(metadataStart + 16), parseInt(metadataStart + 20)),
				META_imgHeight = TIM_arquivoBruto.slice(parseInt(metadataStart + 20), parseInt(metadataStart + 24)),
				convertImgSize = parseInt((R3_tools.parseEndianToInt(R3_tools.parseEndian(META_imgSize)) - 12) * 2);
			// Extract Image
			TIM_RAW_IMG = TIM_arquivoBruto.slice(parseInt(metadataStart + 24), (parseInt(metadataStart + 24) + convertImgSize));
		};
	};
};
/*
	Extract TIM from string + location
*/
// Get TIM file from string TIM_getTimFromString
tempFn_R3_TIM['getTimFromString'] = function(hex, location){
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
			const clutSizeConvert = parseInt((R3_tools.parseEndianToInt(R3_tools.parseEndian(TIM_clutSize)) - 12) * 2);
			CLUT_RAW = hex.slice((location + 40), (location + (clutSizeConvert + 40)));
			var metadataStart  = parseInt(hex.indexOf(CLUT_RAW) + CLUT_RAW.length),
				META_imgSize   = hex.slice(metadataStart, parseInt(metadataStart + 8)),
				convertImgSize = parseInt((R3_tools.parseEndianToInt(R3_tools.parseEndian(META_imgSize)) - 12) * 2);
			TIM_RAW_IMG = hex.slice(parseInt(metadataStart + 24), (parseInt(metadataStart + 24) + convertImgSize));
			// End
			return hex.slice(location, (hex.indexOf(TIM_RAW_IMG) + TIM_RAW_IMG.length));
		};
	};
};
/*
	Check if file is a valid TIM TIM_checkIntegrity
	This will check if file has BPP
*/
tempFn_R3_TIM['checkIntegrity'] = function(timHex){
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
	END
*/
const R3_TIM = tempFn_R3_TIM;
delete tempFn_R3_TIM;

/*
	RDT TIM Manager functions
*/
// Import TIM R3_TIM_MANAGER_importExport
tempFn_timManager['import'] = function(){
	if (RDT_arquivoBruto !== undefined){
		R3_fileManager.loadFile('.tim', function(fPath, hxFile){
			if (R3_TIM.checkIntegrity(hxFile) === true){
				R3_RDT_rawSections.ARRAY_TIM[R3_RDT_currentTimFile] = hxFile;
				var finalLbl = '';
				if (R3_SYSTEM.web.isBrowser === true){
					finalLbl = 'Path: <font class="user-can-select">' + fName + '</font>';
				};
				R3_SYSTEM.log('separator');
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (TIM Manager) Import Successful! ' + finalLbl);
				R3_SYSTEM.alert('INFO: (TIM Manager) Import Successful!');
			} else {
				R3_SYSTEM.alert('WARN: Unable to import TIM file!\nReason: This file failed on TIM integrity check!');
			};
		}, undefined, 'hex');
	};
};
// Export TIM
tempFn_timManager['export'] = function(){
	if (RDT_arquivoBruto !== undefined){
		R3_fileManager.saveFile('TIM_' + R3_RDT_mapName + '_' + (R3_RDT_currentTimFile + 1) + '.tim', R3_RDT_rawSections.ARRAY_TIM[R3_RDT_currentTimFile], 'hex', '.tim', function(fName){
			var finalLbl = '';
			if (R3_SYSTEM.web.isBrowser === true){
				finalLbl = 'Path: <font class="user-can-select">' + fName + '</font>';
			};
			R3_SYSTEM.log('separator');
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (TIM Manager) Export Successful! ' + finalLbl);
			R3_SYSTEM.alert('INFO: (TIM Manager) Export Successful!');
		});
	};
};