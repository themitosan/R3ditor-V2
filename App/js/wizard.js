/*
	R3ditor V2 - wizard.js
	Hoo~
*/
var R3_DOORLINK_DATABASE = {},
	R3_DOORLINK_RUNNING = false;
/*
	Wizard functions
*/
// First Check
function R3_ROFS_ENABLE_MOD_VERIFY(){
	if (R3_WEBMODE === false){
		if (RE3_RUNNING !== true){
			var requireLoad, re3Set = APP_FS.existsSync(R3_RE3_PATH), conf;
			if (re3Set !== false){
				conf = R3_SYSTEM_CONFIRM('Question: You already set the game executable location, that is:\n' + R3_RE3_PATH + '\n\nDo you want to use the assets present on this location?');
				if (conf !== false){
					requireLoad = false;
				} else {
					requireLoad = true;
				};
			} else {
				requireLoad = true;
			};
			if (requireLoad !== true){
				R3_ROFS_SELECT_FOLDER(R3_RE3_PATH);
			} else {
				R3_SYSTEM_ALERT('Please, select the location of your \"ResidentEvil3.exe\" location!');
				R3_FILE_LOAD('.exe', function(pathFuture){
					R3_ROFS_SELECT_FOLDER(pathFuture);
				});
			};
		} else {
			R3_SYSTEM_ALERT('ERROR: Unable to execute this function because the game is running!');
		};
	} else {
		R3_WEBWARN();
	};
};
// Check folder
function R3_ROFS_SELECT_FOLDER(rPath){
	if (rPath !== undefined && rPath !== ''){
		var canExtract = true, oldAsk, checkBioIni, ask = R3_SYSTEM_CONFIRM('Do you want to use the default path to extract the assets?');
		if (ask === true){
			R3_ROFS_ENABLE_MOD(rPath);
		} else {
			R3_SYSTEM_ALERT('Please, select where you want to extract the assets.');
			R3_FOLDER_SELECT(function(assetsPath){
				checkBioIni = assetsPath + '/bio3.ini';
				if (APP_FS.existsSync(checkBioIni) !== true){
					canExtract = true;
				} else {
					oldAsk = R3_SYSTEM_CONFIRM('WARN - This folder seems to have previous game data!\n\nExtracting the game here will overwrite the previous data.\n\nDo you want to continue anyway?');
					if (oldAsk === true){
						canExtract = true;
					};
				};
				// End
				if (canExtract === true){
					R3_MOD_PATH = assetsPath;
					R3_ROFS_ENABLE_MOD(rPath);
				};
			});
		};
	};
};
// Start Extraction
function R3_ROFS_ENABLE_MOD(gamePath){
	if (R3_WEBMODE === false){
		var currentRofs = 1, rofsPath = R3_getFilePath(gamePath), rofsTimer, rofsFix;
		R3_DESIGN_MINIWINDOW_CLOSE(0);
		// Create zmovie
		if (APP_FS.existsSync(R3_MOD_PATH + '/zmovie') === false){
			APP_FS.mkdirSync(R3_MOD_PATH + '/zmovie');
		};
		// Fix for Rofs 11
		if (APP_FS.existsSync(rofsPath + '/Rofs11.dat') !== false){
			rofsFix = APP_FS.readFileSync(rofsPath + '/Rofs11.dat', 'hex');
			APP_FS.writeFileSync(R3_MOD_PATH + '/Rofs11.dat', rofsFix, 'hex');
		};
		R3_UTILS_CALL_LOADING('Enable Modding Enviroment', 'Please wait while R3ditor V2 extracts all game assets.<br>Starting process...', 2);
		rofsTimer = setInterval(function(){
			if (currentRofs < 16){
				if (EXTERNAL_APP_RUNNING !== true){
					if (EXTERNAL_APP_EXITCODE < 2){
						R3_ROFS_EXTRACT_MOD(rofsPath, currentRofs);
						currentRofs++;
					} else {
						R3_SYSTEM_LOG('warn', 'WARN - Something went wrong while extracting Rofs ' + currentRofs + '!');
						R3_UTILS_LOADING_UPDATE('Something went wrong while extracting Rofs ' + currentRofs + '!', 100);
						clearInterval(rofsTimer);
					};
				} else {
					console.info('ROFS - Waiting ROFS ' + currentRofs + '...');
				};
			} else {
				R3_SETTINGS_getMapPrefix();
				// Get all cinematics
				R3_ROFS_ENABLE_MOD_copyMissingFiles(rofsPath);
				clearInterval(rofsTimer);
			};
		}, 150);
	};
};
// Copy Missing Files
function R3_ROFS_ENABLE_MOD_copyMissingFiles(rofsPath){
	R3_UTILS_LOADING_UPDATE('Now R3ditor V2 is getting all missing files - Please wait...', 80);
	R3_SYS_copyFiles(rofsPath + '/zmovie', R3_MOD_PATH + '/zmovie', function(){
		R3_SYS_copyFiles(R3_RE3_PATH, R3_MOD_PATH + '/ResidentEvil3.exe', function(){
			R3_ROFS_ENABLE_MOD_FINISH();
		});
	});
};
// Extract Rofs (Wizard)
function R3_ROFS_EXTRACT_MOD(gPath, rofsId){
	R3_UTILS_LOADING_UPDATE('Please wait while R3ditor V2 extracts all game assets.<br>Extracting Rofs' + rofsId + '.dat - ' + ROFS_FILE_DESC[rofsId], R3_parsePercentage(rofsId, 15));
	R3_runExec(APP_TOOLS + '/rofs.exe', [gPath + '/Rofs' + rofsId + '.dat'], 1);
};
// Finish Enable Mod
function R3_ROFS_ENABLE_MOD_FINISH(){
	R3_UTILS_LOADING_UPDATE('Done!', 100);
	process.chdir(ORIGINAL_APP_PATH);
	APP_ENABLE_MOD = true;
	// Skip making config file if current version is Gemini REbirth
	if (RE3_LIVE_CURRENTMOD !== 4){
		R3_INI_MAKEFILE(0);
	};
	R3_DOORLINK_INIT();
	R3_SAVE_SETTINGS(false);
	R3_UTILS_LOADING_CLOSE();
	R3_LOAD_SETTINGS();
	R3_RDT_FILELIST_UPDATELIST();
};
/*
	DoorLink Functions
*/
// Check if DoorLink database exists
function R3_DOORLINK_CHECK(){
	if (R3_WEBMODE === false && R3_NW_ARGS_DISABLE_DOORLINK === false){
		if (APP_FS.existsSync(APP_PATH + '/Configs/DoorLink.R3V2') === true){
			R3_DOORLINK_DATABASE = JSON.parse(atob(APP_FS.readFileSync(APP_PATH + '/Configs/DoorLink.R3V2', 'utf-8')));
		} else {
			if (APP_ENABLE_MOD === true){
				R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: DoorLink database is missing!');
				R3_DOORLINK_INIT();
			} else {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: Unable to load DoorLink database!');
			};
		};
	};
};
// Generate DoorLink Database
function R3_DOORLINK_INIT(){
	if (R3_WEBMODE === false && APP_ENABLE_MOD === true && R3_NW_ARGS_DISABLE_DOORLINK === false){
		var cLocation, fName, tmpRes, fileList, tempDoorList, tempDoorList4P, tempList = {};
		R3_SYSTEM_LOG('separator');
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (DoorLink) Starting reading process - Please Wait...');
		try {
			R3_DOORLINK_RUNNING = true;
			fileList = APP_FS.readdirSync(APP_PATH + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT');
			fileList.forEach(function(cFile, cIndex){
				if (R3_getFileExtension(cFile).toLowerCase() === 'rdt'){
					cLocation = APP_PATH + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT/' + cFile;
					fName = R3_getFileName(cFile).toUpperCase();
					// Start this madness
					R3_RDT_LOAD(cLocation, false, APP_FS.readFileSync(cLocation, 'hex'));
					R3_UTILS_VAR_CLEAN_SCD();
					SCD_arquivoBruto = R3_RDT_RAWSECTION_SCD;
					R3_SCD_START_DECOMPILER(R3_RDT_RAWSECTION_SCD);
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
				} else {
					R3_SYSTEM_LOG('warn', 'R3ditor V2 - INFO: (DoorLink) Skipping file ' + cIndex + ' - this isn\'t a valid map!');
				};
			});
			// End
			APP_FS.writeFileSync(APP_PATH + '/Configs/DoorLink.R3V2', btoa(JSON.stringify(tempList)), 'utf-8');
			R3_DOORLINK_DATABASE = tempList;
			R3_DOORLINK_RUNNING = false;
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (DoorLink) Process complete!');
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to execute DoorLink process! <br>Reason: ' + err);
			R3_DESIGN_CRITIAL_ERROR(err);
			console.error(err);
		};
	};
};