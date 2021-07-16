/*
	R3ditor V2 - wizard.js
	Hoo~
*/
// Wizard variables
var R3_WIZARD_RUNNING = false,
	R3_WIZARD_GAME_PATH = '',
	// Wizard Options
	R3_WIZARD_KEEP_ROFS11 = true,
	R3_WIZARD_SET_RE3_PATH = true,
	R3_WIZARD_SET_MERCE_PATH = true,
	R3_WIZARD_ENABLE_DOORLINK = true,
	R3_WIZARD_REPLACE_WARN = true,
	// DoorLink variables
	R3_DOORLINK_DATABASE = {},
	R3_DOORLINK_RUNNING = false;
/*
	Wizard functions
*/
// Get game path
function R3_WIZARD_getMainGamePath(){
	if (R3_WEBMODE === false){
		R3_FOLDER_SELECT(function(gamePath){
			R3_WIZARD_GAME_PATH = gamePath;
			document.getElementById('R3_WIZARD_GAME_PATH').title = R3_WIZARD_GAME_PATH;
			document.getElementById('R3_WIZARD_GAME_PATH').innerHTML = R3_fixPathSize(R3_WIZARD_GAME_PATH, 120);
		});
	};
};
// Check before start
function R3_WIZARD_checkProcess(){
	if (R3_WEBMODE === false){
		R3_WIZARD_KEEP_ROFS11 = JSON.parse(document.getElementById('R3_WIZARD_KEEP_ROFS11').checked);
		R3_WIZARD_SET_RE3_PATH = JSON.parse(document.getElementById('R3_WIZARD_SET_RE3_PATH').checked);
		R3_WIZARD_SET_MERCE_PATH = JSON.parse(document.getElementById('R3_WIZARD_SET_MERCE_PATH').checked);
		R3_WIZARD_ENABLE_DOORLINK = JSON.parse(document.getElementById('R3_WIZARD_ENABLE_DOORLINK').checked);
		R3_WIZARD_REPLACE_WARN = JSON.parse(document.getElementById('R3_WIZARD_ENABLE_CUSTOM_R3V2_BOOT').checked);
		if (R3_WIZARD_GAME_PATH !== ''){
			if (APP_FS.existsSync(R3_WIZARD_GAME_PATH) === true){
				R3_DESIGN_MINIWINDOW_CLOSE(0);
				R3_DESIGN_MINIWINDOW_CLOSE(21);
				R3_WIZARD_startProcess();
			};
		} else {
			R3_SYSTEM_ALERT('WARN: Please, select the game location before start!');
		};
	};
};
// Start Wizard
function R3_WIZARD_startProcess(){
	if (R3_WEBMODE === false){
		R3_MENU_EXIT();
		R3_UTILS_CALL_LOADING('Enable Modding Enviroment', 'Please wait while R3ditor V2 extracts all game assets...', 10);
		R3_WIZARD_RUNNING = true;
		var currentRofs = 1, rofsTimer, rofsFix;
		// Create zmovie
		if (APP_FS.existsSync(R3_MOD_PATH + '/zmovie') === false){
			APP_FS.mkdirSync(R3_MOD_PATH + '/zmovie');
		};
		// Fix for Rofs11.dat
		if (APP_FS.existsSync(R3_WIZARD_GAME_PATH + '/Rofs11.dat') !== false && R3_WIZARD_KEEP_ROFS11 === true){
			rofsFix = APP_FS.readFileSync(R3_WIZARD_GAME_PATH + '/Rofs11.dat', 'hex');
			APP_FS.writeFileSync(R3_MOD_PATH + '/Rofs11.dat', rofsFix, 'hex');
		};
		rofsTimer = setInterval(function(){
			if (currentRofs < 16){
				if (EXTERNAL_APP_RUNNING !== true){
					if (EXTERNAL_APP_EXITCODE < 2){
						R3_WIZARD_EXTRACT_ROFS(currentRofs);
						currentRofs++;
					} else {
						R3_SYSTEM_LOG('warn', 'WARN - Something went wrong while extracting Rofs ' + currentRofs + '!');
						R3_UTILS_LOADING_UPDATE('Something went wrong while extracting Rofs ' + currentRofs + '!', 100);
						clearInterval(rofsTimer);
					};
				} else {
					console.info('ROFS - Waiting Rofs' + currentRofs + '.dat');
				};
			} else {
				R3_SETTINGS_getMapPrefix();
				// Get all cinematics
				R3_WIZARD_copyMissingFiles();
				clearInterval(rofsTimer);
			};
		}, 150);
	};
};
// Copy Missing Files
function R3_WIZARD_copyMissingFiles(){
	R3_UTILS_LOADING_UPDATE('Now R3ditor V2 is getting all missing files - Please wait...', 80);
	var c = 0, syncInterval, ask, fileList = {
		0: [R3_WIZARD_GAME_PATH + '/zmovie', R3_MOD_PATH + '/zmovie'],
		1: [R3_WIZARD_GAME_PATH + '/ResidentEvil3.exe', R3_MOD_PATH + '/ResidentEvil3.exe'],
		2: [APP_EXEC_PATH + '/Tools/Misc/eAssets.bin', R3_MOD_PATH + '/' + R3_RDT_PREFIX_HARD + '/ETC2/WARNE.TIM']
	};
	Object.keys(fileList).forEach(function(cItem){
		if (parseInt(cItem) === 2 && R3_WIZARD_REPLACE_WARN === false){
			console.info('Skipping WARNE.TIM');
		} else {
			R3_SYS_copyFiles(fileList[cItem][0], fileList[cItem][1], function(){
				R3_UTILS_LOADING_UPDATE('Now R3ditor V2 is getting all missing files...', 90);
			});
		};
		c++;
	});
	syncInterval = setInterval(function(){
		if (c > (Object.keys(fileList).length - 1)){
			APP_ENABLE_MOD = true;
			process.chdir(ORIGINAL_APP_PATH);
			// Skip making config file if current version is Gemini REbirth
			if (RE3_LIVE_CURRENTMOD !== 4){
				R3_INI_MAKEFILE(0, R3_WIZARD_KEEP_ROFS11);
			};
			R3_WIZARD_FINAL_CHECK_RE3_PATH();
			clearInterval(syncInterval);
		};
	}, 200);
};
// Extract Rofs (Wizard)
function R3_WIZARD_EXTRACT_ROFS(rofsId){
	if (R3_WEBMODE === false){
		R3_UTILS_LOADING_UPDATE('Extracting Rofs' + rofsId + '.dat - ' + ROFS_FILE_DESC[rofsId] + ' - Please wait...', R3_parsePercentage(rofsId, 15));
		R3_runExec(APP_TOOLS + '/rofs.exe', [R3_WIZARD_GAME_PATH + '/Rofs' + rofsId + '.dat'], 1);
	};
};
/*
	Final steps
*/
// Check RE3 Path
function R3_WIZARD_FINAL_CHECK_RE3_PATH(){
	if (R3_WEBMODE === false){
		R3_UTILS_LOADING_UPDATE('Now R3ditor V2 is Checking main game executables (1 of 2)...', 92);
		var fName = R3_GAME_VERSIONS[RE3_LIVE_CURRENTMOD][3];
		if (R3_WIZARD_SET_RE3_PATH === true && APP_FS.existsSync(R3_WIZARD_GAME_PATH + '/' + fName) === true){
			R3_RE3_PATH = R3_WIZARD_GAME_PATH + '/' + fName;
		};
		R3_WIZARD_FINAL_CHECK_MERCE_PATH();
	};
};
// Check MERCE Path
function R3_WIZARD_FINAL_CHECK_MERCE_PATH(){
	if (R3_WEBMODE === false){
		R3_UTILS_LOADING_UPDATE('Now R3ditor V2 is Checking main game executables (2 of 2)...', 94);
		if (R3_WIZARD_SET_MERCE_PATH === true && APP_FS.existsSync(R3_WIZARD_GAME_PATH + '/RE3_MERCE.exe') === true){
			R3_MERCE_PATH = R3_WIZARD_GAME_PATH + '/RE3_MERCE.exe';
		};
		R3_WIZARD_FINAL_CHECK_DOORLINK();
	};
};
// Check DoorLink
function R3_WIZARD_FINAL_CHECK_DOORLINK(){
	if (R3_WEBMODE === false){
		if (R3_WIZARD_ENABLE_DOORLINK === true){
			R3_DOORLINK_INIT();
		} else {
			R3_WIZARD_FINISH();
		};
	};;
};
// Finish line!
function R3_WIZARD_FINISH(){
	if (R3_WEBMODE === false){
		R3_SAVE_SETTINGS(false);
		R3_UTILS_LOADING_CLOSE();
		R3_LOAD_SETTINGS();
		R3_RDT_FILELIST_UPDATELIST();
		R3_WIZARD_RUNNING = false;
	};
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
		if (R3_DESIGN_LOADING_ACTIVE === true){
			R3_UTILS_LOADING_UPDATE('R3ditor V2 is generating DoorLink database - Please wait...', 96);
		};
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
			// If are running on wizard, wrap end it!
			if (R3_WIZARD_RUNNING === true){
				R3_WIZARD_FINISH();
			};
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to execute DoorLink process! <br>Reason: ' + err);
			R3_DESIGN_CRITIAL_ERROR(err);
			console.error(err);
		};
	};
};