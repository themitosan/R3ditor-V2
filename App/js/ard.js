/*
	*******************************************************************************
	R3ditor V2 - ard.js
	By TheMitoSan

	This file is responsible for creating functions to deal with PS1 ARD Files.

	ARD info by Patrice Mandin (pmandin)
	https://github.com/pmandin/reevengi-tools/wiki/.ARD
	*******************************************************************************
*/
var ARD_fileSize, ARD_arquivoBruto, ARD_totalObjects, ARD_sections = ARD_objectsMetadata = [], ARD_filePath = ARD_fileName = ARD_fileName = '';
/*
	Functions
*/
// Load Files
function ARD_loadFile(){
	if (R3_WEBMODE === false){
		R3_fileManager.loadFile('.ard', function(ardFile){
			R3_UTILS_VAR_CLEAN_ARD();
			ARD_filePath = R3_tools.getFilePath(ardFile);
			ARD_fileName = R3_tools.getFileName(ardFile);
			ARD_arquivoBruto = APP_FS.readFileSync(ardFile, 'hex');
			ARD_fileSize = R3_tools.parseEndian(ARD_arquivoBruto.slice(0, 8));
			ARD_totalObjects = parseInt(R3_tools.parseEndian(ARD_arquivoBruto.slice(8, 16)), 16);
			const tempMetadata = ARD_arquivoBruto.slice(16, ((ARD_totalObjects * 16) + 24)).match(/.{8,8}/g);
			for (var c = 0; c < (ARD_totalObjects * 2); c++){
				if (R3_tools.isInteger(c / 2) === true){
					ARD_objectsMetadata.push(R3_tools.parseEndian(tempMetadata[c]));
				};
			};
			// End
			ARD_extractSections();
		});
	} else {
		R3_WEBWARN();
	};
};
// Extract Sections
function ARD_extractSections(){
	if (ARD_arquivoBruto !== undefined){
		var cSection = 4096, sectionFullSize, nextSection, sectionSlice, newFilePath, finalFile = '';
		for (var c = 0; c < ARD_totalObjects; c++){
			sectionSlice = ARD_arquivoBruto.slice(cSection, (cSection + parseInt(ARD_objectsMetadata[c], 16) * 2));
			ARD_sections.push(sectionSlice);
			sectionFullSize = (cSection + sectionSlice.length);
			nextSection = parseInt(Math.ceil(sectionFullSize / 4096) * 4096);
			cSection = nextSection;
		};
		finalFile = 'ARD Extract - Generated with R3ditor V2 - V. ' + INT_VERSION + '\nMAP = ' + ARD_fileName.toUpperCase() + '\nTOTAL = ' + ARD_totalObjects + 
					'\nDATA_0 = ' + ARD_arquivoBruto.slice(0, ARD_arquivoBruto.indexOf(ARD_sections[8])) + '\nDATA_1 = ' + 
					ARD_arquivoBruto.slice(ARD_arquivoBruto.indexOf(ARD_sections[9]), ARD_arquivoBruto.length);
		newFilePath = ARD_filePath + '/' + ARD_fileName.toUpperCase();
		try {
			R3_SYSTEM.log('separator');
			APP_FS.writeFileSync(newFilePath + '.RDT', ARD_sections[8], 'hex');
			R3_SYSTEM.log('log', 'R3ditor V2 - ARD Extractor: RDT extraction complete! <br>Path: <font class="user-can-select">' + newFilePath + '.RDT</font>');
			setTimeout(function(){
				APP_FS.writeFileSync(newFilePath + '.R3ARD', finalFile, 'utf-8');
				R3_SYSTEM.log('separator');
				R3_SYSTEM.log('log', 'R3ditor V2 - ARD Extractor: Save successfull! (R3ARD) <br>Path: <font class="user-can-select">' + newFilePath + '.R3ARD</font>');
				R3_UTILS_VAR_CLEAN_ARD();
			}, 500);
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to save ARD Extractor files! <br>Details: ' + err);
			R3_SYSTEM.alert('ERROR - Unable to save files!\n' + err);
		};
	};
};
// Check Compiler
function ARD_checkCompiler(){
	if (R3_WEBMODE === false){
		R3_fileManager.loadFile('.R3ARD', function(recompilerFile){
			R3_UTILS_VAR_CLEAN_ARD();
			// Start Getting Infos
			var rebuildFile = [], mapName;
			APP_FS.readFileSync(recompilerFile).toString().split('\n').forEach(function(line){ 
				rebuildFile.push(line); 
			});
			mapName = rebuildFile[1].replace('MAP = ', '');
			if (APP_FS.existsSync(R3_tools.getFilePath(recompilerFile) + '/' + mapName + '.RDT') === true){
				ARD_startRecompiler(rebuildFile, R3_tools.getFilePath(recompilerFile) + mapName + '.RDT');
			} else {
				R3_SYSTEM.alert('WARN - Unable to find RDT file!');
			};
		});
	} else {
		R3_WEBWARN();
	};
};
// Start Compiler
function ARD_startRecompiler(ardInfos, rdtPath){
	if (R3_WEBMODE === false){
		var c = 0, ARD_temp = RDT_nextOffsetLength = RDT_nextOffset = '',
			fileName = ardInfos[1].replace('MAP = ', '').toUpperCase(),
			DATA_0 = ardInfos[3].replace('DATA_0 = ', ''),
			DATA_1 = ardInfos[4].replace('DATA_1 = ', ''),
			RDT_target = APP_FS.readFileSync(rdtPath, 'hex'),
			RDT_length = parseInt(DATA_0.length + RDT_target.length),
			RDT_nextOffsetLength = parseInt(Math.ceil(RDT_length / 4096) * 4096),
			offsetFix = (RDT_nextOffsetLength - RDT_length);
		while (c < offsetFix){
			RDT_nextOffset = RDT_nextOffset + '0';
			c++;
		};
		ARD_temp = DATA_0 + RDT_target + RDT_nextOffset + DATA_1;
		var newFileSize = R3_tools.parseEndian(R3_tools.fixVars((ARD_temp.length / 2).toString(16), 8)),
			ARD_temp_sizeFix = newFileSize + ARD_temp.slice(8, ARD_temp.length),
			newRDTLength = R3_tools.parseEndian(R3_tools.fixVars((RDT_target.length / 2).toString(16), 8)),
			HEX_START = ARD_temp_sizeFix.slice(0, 144),
			HEX_END = ARD_temp_sizeFix.slice(152, ARD_temp_sizeFix.length);
			HEX_FINAL = HEX_START + newRDTLength + HEX_END;
		R3_fileManager.saveFile(fileName + '.ARD', HEX_FINAL, 'hex', '.ARD');
	} else {
		R3_WEBWARN();
	};
};