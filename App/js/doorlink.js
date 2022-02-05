/*
	*******************************************************************************
	R3ditor V2 - doorlink.js
	By TheMitoSan

	This file is responsible for Doorlink - a feature that collects all SCD Doors
	and creates a database that can be used on SCD editor. 
	*******************************************************************************
*/
// Variables
var R3_DOORLINK_DATABASE = {},
	R3_OPCODE_SEARCH_DATABASE = {},
	R3_DOORLINK_RUNNING = false,
	R3_DOORLINK_INTERVAL;
// Objects
tempFn_R3_DOORLINK = {};
/*
	DoorLink Functions
*/
// Check if DoorLink database exists R3_DOORLINK_CHECK
tempFn_R3_DOORLINK['checkDatabase'] = function(){
	if (R3_SYSTEM.web.isBrowser === false && R3_SETTINGS.R3_NW_ARGS_DISABLE_DOORLINK === false){
		if (R3_MODULES.fs.existsSync(R3_SYSTEM.paths.mod + '/Configs/DoorLink.R3V2') === true){
			R3_DOORLINK_DATABASE = JSON.parse(atob(R3_MODULES.fs.readFileSync(R3_SYSTEM.paths.mod + '/Configs/DoorLink.R3V2', 'utf-8')));
		} else {
			if (R3_MOD.enableMod === true){
				R3_SYSTEM.log('log', 'R3ditor V2 - INFO: DoorLink database is missing!');
			} else {
				R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to load DoorLink database!');
			};
		};
	};
};
// Generate DoorLink Database R3_DOORLINK_INIT
tempFn_R3_DOORLINK['generateDatabase'] = function(){
	if (R3_SYSTEM.web.isBrowser === false && R3_MOD.enableMod === true && R3_SETTINGS.R3_NW_ARGS_DISABLE_DOORLINK === false){
		var dInterval, cLocation, fName, tmpRes, fileList, tempDoorList, tempDoorList4P, tempList = {}, pComplete = false;
		R3_SYSTEM.log('separator');
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (DoorLink) Starting reading process - Please Wait...');
		try {
			R3_DOORLINK_RUNNING = true;
			fileList = R3_MODULES.fs.readdirSync(R3_SYSTEM.paths.mod + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT');
			fileList.forEach(function(cFile, cIndex){
				if (R3_tools.getFileExtension(cFile).toLowerCase() === 'rdt' && R3_DOORLINK_RUNNING === true){
					console.info('DoorLink - Current Map: ' + cFile + ' - (' + (cIndex + 1) + ' of ' + fileList.length + ')');
					cLocation = R3_SYSTEM.paths.mod + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT/' + cFile;
					fName = R3_tools.getFileName(cFile).toUpperCase();
					// Start this madness
					R3_RDT.readMap(cLocation, false, R3_MODULES.fs.readFileSync(cLocation, 'hex'));
					R3_SCD_START_DECOMPILER(R3_RDT_rawSections.RAWSECTION_SCD);
					// Set Door [DOOR_AOT_SET]
					tempDoorList = R3_SCD_SEARCH_SCRIPT_FUNCTION('61', true);
					if (tempDoorList !== undefined){
						tempDoorList.forEach(function(lItem, lIndex){
							tmpRes = R3_SCD_getDoorParams(0, lItem[0], lItem[1]);
							if (tempList[tmpRes[0]] === undefined){
								tempList[tmpRes[0]] = [];
							};
							tempList[tmpRes[0]].push(tmpRes);
						});
					};
					// Set Door 4P [DOOR_AOT_SET_4P]
					tempDoorList4P = R3_SCD_SEARCH_SCRIPT_FUNCTION('62', true);
					if (tempDoorList4P !== undefined){
						tempDoorList4P.forEach(function(lItem, lIndex){
							tmpRes = R3_SCD_getDoorParams(1, lItem[0], lItem[1]);
							if (tempList[tmpRes[0]] === undefined){
								tempList[tmpRes[0]] = [];
							};
							tempList[tmpRes[0]].push(tmpRes);
						});
					};
					if ((cIndex + 1) === fileList.length){
						R3_DOORLINK_RUNNING = false;
					};
				} else {
					R3_SYSTEM.log('warn', 'R3ditor V2 - INFO: (DoorLink) Skipping file ' + cIndex + ' - this isn\'t a valid map!');
				};
			});
			// End
			R3_DOORLINK_INTERVAL = setInterval(function(){
				if (R3_DOORLINK_RUNNING === false){
					R3_MODULES.fs.writeFileSync(R3_SYSTEM.paths.mod + '/Configs/DoorLink.R3V2', btoa(JSON.stringify(tempList)), 'utf-8');
					R3_DOORLINK_DATABASE = tempList;
					R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (DoorLink) Process complete!');
					R3_UTILS_VAR_CLEAN();
					// If are running on wizard...
					if (R3_WIZARD_RUNNING === true){
						R3_WIZARD_FINISH();
					};
					clearInterval(R3_DOORLINK_INTERVAL);
				};
			}, 200);
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to execute DoorLink process! <br>Reason: ' + err);
			R3_DESIGN_CRITIAL_ERROR(err);
			console.error(err);
		};
	};
};
// Search function using doorlink method R3_DOORLINK_SEARCH
tempFn_R3_DOORLINK['searchScdOpcode'] = function(){
	if (R3_SYSTEM.web.isBrowser === false){
		var c = 0, opcodeId = document.getElementById('R3_OPCODE_FINDER_SEARCH').value;
		if (R3_SCD_DATABASE[opcodeId] !== undefined && opcodeId !== '01'){
			try {
				if (R3_MENU_CURRENT !== 4){
					R3_MENU_EXIT();
				};
				R3_DOORLINK_RUNNING = true;
				R3_OPCODE_SEARCH_DATABASE = {};
				var HTML_TEMPLATE = '', cLocation, fName, tmpRes, fileList, tempFunctionOpcode, tempList = {};
				fileList = R3_MODULES.fs.readdirSync(R3_SYSTEM.paths.mod + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT');
				fileList.forEach(function(cFile, cIndex){
					if (R3_tools.getFileExtension(cFile).toLowerCase() === 'rdt'){
						cLocation = R3_SYSTEM.paths.mod + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT/' + cFile;
						fName = R3_tools.getFileName(cFile).toUpperCase();
						console.info('DoorLink - Current Map: ' + cFile + ' - (' + (cIndex + 1) + ' of ' + fileList.length + ')');
						R3_RDT.readMap(cLocation, false, R3_MODULES.fs.readFileSync(cLocation, 'hex'));
						R3_SCD_START_DECOMPILER(R3_RDT_rawSections.RAWSECTION_SCD);
						// Search Opcode
						tempFunctionOpcode = R3_SCD_SEARCH_SCRIPT_FUNCTION(opcodeId, true);
						if (tempFunctionOpcode !== undefined){
							if (tempList[fName] === undefined){
								tempList[fName] = [];
							};
							Object.keys(tempFunctionOpcode).forEach(function(lItem, lIndex){
								tempList[fName].push(tempFunctionOpcode[lItem]);
							});
						};
						if ((cIndex + 1) === fileList.length){
							R3_DOORLINK_RUNNING = false;
						};
					} else {
						R3_SYSTEM.log('warn', 'R3ditor V2 - INFO: (Search) Skipping file ' + cIndex + ' - this isn\'t a valid map!');
					};
				});
				// Post-process
				R3_DOORLINK_INTERVAL = setInterval(function(){
					if (R3_DOORLINK_RUNNING === false){
						R3_OPCODE_SEARCH_DATABASE = tempList;
						Object.keys(R3_OPCODE_SEARCH_DATABASE).forEach(function(cItem){
							Object.keys(R3_OPCODE_SEARCH_DATABASE[cItem]).forEach(function(lItem){
								var cArray    = R3_OPCODE_SEARCH_DATABASE[cItem][lItem],
									cScript   = cArray[0],
									cPosition = cArray[1]; 
								if (cScript === 0){
									cScript = 'INIT';
								} else {
									cScript = R3_tools.fixVars(cScript, 4);
								};
								HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_OPCODE_FINDER_RES_MAP" onclick="R3_RDT.readMap(\'' + R3_SYSTEM.paths.mod + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT/' + cItem + '.RDT\', true);R3_SHOW_MENU(10);">' +
												'<font title="' + RDT_locations[cItem][0] + ', ' + RDT_locations[cItem][1] + '">Map ' + cItem + '</font> - Script ' + cScript + ' - Function ' + R3_tools.fixVars(cPosition, 3) + '</div>';
								c++;
							});
						});
						document.getElementById('R3_OPCODE_FINDER_RESULT').innerHTML = HTML_TEMPLATE;
						document.getElementById('R3V2_TITLE_SCD_OPCODE_FINDER').innerHTML = 'SCD Opcode Finder <i>(' + c + ' Results)</i>';
						document.getElementById('R3_OPCODE_FINDER_opName').innerHTML = '<font title="' + R3_SCD_INFO_DATABASE[opcodeId] + '" class="no-bg-image R3_SCD_function_' + R3_SCD_DATABASE[opcodeId][2] + '">' + R3_SCD_DATABASE[opcodeId][1] + '</font>';
						R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Search) Process complete!');
						R3_UTILS_CLEANTOOLS();
						R3_UTILS_VAR_CLEAN();
						clearInterval(R3_DOORLINK_INTERVAL);
					};
				}, 200);
			} catch (err) {
				R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to execute search process! <br>Reason: ' + err);
				R3_DESIGN_CRITIAL_ERROR(err);
				console.error(err);
			};
			document.getElementById('R3_OPCODE_FINDER_SEARCH').value = '';
			document.getElementById('R3_OPCODE_FINDER_SEARCH').focus();
		} else {
			// End Script [EVT_END] fix
			if (opcodeId === '01'){
				R3_SYSTEM.alert('WARN: Unable to search because this opcode (End Script / EVT_END) are present in all SCD scripts!');
				document.getElementById('R3_OPCODE_FINDER_SEARCH').value = '';
			};
		};
	};
};
/*
	END
*/
const R3_DOORLINK = tempFn_R3_DOORLINK;
delete tempFn_R3_DOORLINK;