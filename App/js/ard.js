/*
	R3ditor V2 - ard.js
	Oh dear, romance me with small talk! *giggles*

	ARD info by Patrice Mandin (pmandin)
	https://github.com/pmandin/reevengi-tools/wiki/.ARD
*/
var ARD_fileSize, ARD_arquivoBruto, ARD_totalObjects, ARD_sections = ARD_objectsMetadata = [], ARD_filePath = ARD_fileName = ARD_fileName = '';
/*
	Functions
*/
// Load Files
function ARD_loadFile(){
	if (R3_WEBMODE === false){
		R3_FILE_LOAD('.ard', function(ardFile){
			R3_UTILS_VAR_CLEAN_ARD();
			ARD_filePath = R3_getFilePath(ardFile);
			ARD_fileName = R3_getFileName(ardFile);
			ARD_arquivoBruto = APP_FS.readFileSync(ardFile, 'hex');
			ARD_fileSize = R3_parseEndian(ARD_arquivoBruto.slice(0, 8));
			ARD_totalObjects = parseInt(R3_parseEndian(ARD_arquivoBruto.slice(8, 16)), 16);
			var c = 0, objEnd = 24, objStart = 16;
			while (c < ARD_totalObjects){
				ARD_objectsMetadata.push(R3_parseEndian(ARD_arquivoBruto.slice(objStart, objEnd)));
				objStart = (objStart + 16);
				objEnd = (objEnd + 16);
				c++;
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
		var c = 0, cSection = 4096, sectionFullSize, nextSection, sectionSlice, newFilePath, finalFile = '';
		while (c < ARD_totalObjects){
			sectionSlice = ARD_arquivoBruto.slice(cSection, (cSection + parseInt(ARD_objectsMetadata[c], 16) * 2));
			ARD_sections.push(sectionSlice);
			sectionFullSize = (cSection + sectionSlice.length);
			nextSection = parseInt(Math.ceil(sectionFullSize / 4096) * 4096);
			cSection = nextSection;
			c++;
		};
		finalFile = 'ARD Extract - Generated with R3ditor V2 - V. ' + INT_VERSION + '\nMAP = ' + ARD_fileName.toUpperCase() + '\nTOTAL = ' + ARD_totalObjects + 
					'\nDATA_0 = ' + ARD_arquivoBruto.slice(0, ARD_arquivoBruto.indexOf(ARD_sections[8])) + '\nDATA_1 = ' + 
					ARD_arquivoBruto.slice(ARD_arquivoBruto.indexOf(ARD_sections[9]), ARD_arquivoBruto.length);
		newFilePath = ARD_filePath + '/' + ARD_fileName.toUpperCase();
		try {
			R3_SYSTEM_LOG('separator');
			APP_FS.writeFileSync(newFilePath + '.RDT', ARD_sections[8], 'hex');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - ARD Extractor: RDT extraction complete!');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - Path: <font class="user-can-select">' + newFilePath + '.RDT</font>');
			setTimeout(function(){
				APP_FS.writeFileSync(newFilePath + '.R3ARD', finalFile, 'utf-8');
				R3_SYSTEM_LOG('separator');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - ARD Extractor: Save successfull! (R3ARD)');
				R3_SYSTEM_LOG('log', 'R3ditor V2 - Path: <font class="user-can-select">' + newFilePath + '.R3ARD</font>');
				R3_UTILS_VAR_CLEAN_ARD();
			}, 500);
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to save ARD Extractor files!');
			R3_SYSTEM_LOG('error', 'R3ditor V2 - Details: ' + err);
			alert('ERROR - Unable to save files!\n' + err);
		};
	};
};
// Check Recompiler
function ARD_checkRecompiler(){
	if (R3_WEBMODE === false){
		R3_FILE_LOAD('.R3ARD', function(recompilerFile){
			R3_UTILS_VAR_CLEAN_ARD();
			// Start Getting Infos
			var rebuildFile = [], mapName;
			APP_FS.readFileSync(recompilerFile).toString().split('\n').forEach(function(line){ 
				rebuildFile.push(line); 
			});
			mapName = rebuildFile[1].replace('MAP = ', '');
			if (APP_FS.existsSync(R3_getFilePath(recompilerFile) + '/' + mapName + '.RDT') === true){
				ARD_startRecompiler(rebuildFile, R3_getFilePath(recompilerFile) + mapName + '.RDT');
			} else {
				alert('WARN - Unable to find RDT file!');
			};
		});
	} else {
		R3_WEBWARN();
	};
};
// Start Recompiler
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
		var newFileSize = R3_parseEndian(MEMORY_JS_fixVars((ARD_temp.length / 2).toString(16), 8)),
			ARD_temp_sizeFix = newFileSize + ARD_temp.slice(8, ARD_temp.length),
			newRDTLength = R3_parseEndian(MEMORY_JS_fixVars((RDT_target.length / 2).toString(16), 8)),
			HEX_START = ARD_temp_sizeFix.slice(0, 144),
			HEX_END = ARD_temp_sizeFix.slice(152, ARD_temp_sizeFix.length);
			HEX_FINAL = HEX_START + newRDTLength + HEX_END;
		R3_FILE_SAVE(fileName + '.ARD', HEX_FINAL, 'hex', '.ARD');
	} else {
		R3_WEBWARN();
	};
};