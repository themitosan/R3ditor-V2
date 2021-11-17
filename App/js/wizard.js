/*
	*******************************************************************************
	R3ditor V2 - wizard.js
	By TheMitoSan

	This file is responsible for main game extraction process, making possible
	creating mods.
	*******************************************************************************
*/
// Wizard variables
var R3_WIZARD_modFile,
	R3_WIZARD_MOD_NAME = '',
	R3_WIZARD_GAME_PATH = '',
	R3_WIZARD_RUNNING = false,
	// Wizard Options
	R3_WIZARD_KEEP_ROFS11 = true,
	R3_WIZARD_SET_RE3_PATH = true,
	R3_WIZARD_SET_MERCE_PATH = true,
	R3_WIZARD_ENABLE_DOORLINK = true,
	R3_WIZARD_REPLACE_WARN = true;
/*
	Wizard functions
*/
// Get game path
function R3_WIZARD_getMainGamePath(){
	if (R3_WEBMODE === false){
		R3_fileManager.selectPath(function(gamePath){
			R3_WIZARD_GAME_PATH = gamePath;
			document.getElementById('R3_WIZARD_GAME_PATH').title = R3_WIZARD_GAME_PATH;
			document.getElementById('R3_WIZARD_GAME_PATH').innerHTML = R3_tools.fixPathSize(R3_WIZARD_GAME_PATH, 120);
		});
	};
};
// Check before start
function R3_WIZARD_checkProcess(){
	if (R3_WEBMODE === false){
		var canStart = true, eReason = '';
		R3_WIZARD_MOD_NAME = document.getElementById('R3_WIZARD_MOD_NAME').value;
		R3_WIZARD_KEEP_ROFS11 = JSON.parse(document.getElementById('R3_WIZARD_KEEP_ROFS11').checked);
		R3_WIZARD_SET_RE3_PATH = JSON.parse(document.getElementById('R3_WIZARD_SET_RE3_PATH').checked);
		R3_WIZARD_SET_MERCE_PATH = JSON.parse(document.getElementById('R3_WIZARD_SET_MERCE_PATH').checked);
		R3_WIZARD_ENABLE_DOORLINK = JSON.parse(document.getElementById('R3_WIZARD_ENABLE_DOORLINK').checked);
		R3_WIZARD_REPLACE_WARN = JSON.parse(document.getElementById('R3_WIZARD_ENABLE_CUSTOM_R3V2_BOOT').checked);
		// Checks
		if (APP_FS.existsSync(R3_WIZARD_GAME_PATH) !== true){
			canStart = false;
			if (R3_WIZARD_GAME_PATH === ''){
				eReason = eReason + '\nYou must select a valid path for your game!';
			} else {
				eReason = eReason + '\nThis path does not exists! (404)';
			};
		};
		if (R3_WIZARD_MOD_NAME === ''){
			canStart = false;
			eReason = eReason + '\nYou must insert a valid name for this mod';
		};
		/*
			Start Process
		*/
		if (canStart === true){
			R3_MINIWINDOW.close('all');
			R3_WIZARD_startProcess();
		} else {
			R3_SYSTEM.alert('ERROR: Unable to start R3V2 Wizard!\n' + eReason);
		};
	};
};
// Start Wizard
function R3_WIZARD_startProcess(){
	if (R3_WEBMODE === false){
		R3_MENU_EXIT();
		R3_WIZARD_RUNNING = true;
		R3_KB_ENABLE_SHORTCUTS = false;
		R3_UTILS_CALL_LOADING('Running R3V2 Wizard', 'Please wait while R3ditor V2 extracts all game assets...', 10);
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
						R3_SYSTEM.log('warn', 'WARN - Something went wrong while extracting Rofs ' + currentRofs + '!');
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
			R3_fileManager.copyFiles(fileList[cItem][0], fileList[cItem][1], function(){
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
			if (R3_LIVESTATUS.currentMode !== 4){
				R3_INI.generateIni(0, R3_WIZARD_KEEP_ROFS11);
			};
			R3_WIZARD_FINAL_CHECK_RE3_PATH();
			clearInterval(syncInterval);
		};
	}, 200);
};
// Extract Rofs (Wizard)
function R3_WIZARD_EXTRACT_ROFS(rofsId){
	if (R3_WEBMODE === false){
		R3_UTILS_LOADING_UPDATE('Extracting <font class="R3_HC_LBL_CODE user-cant-select">Rofs' + rofsId + '.dat</font> - ' + ROFS_FILE_DESC[rofsId] + ' - Please wait...', R3_tools.parsePercentage(rofsId, 15));
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
		var fName = R3_GAME_VERSIONS[R3_LIVESTATUS.currentMode][3];
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
			R3_DOORLINK.generateDatabase();
		} else {
			R3_WIZARD_FINISH();
		};
	};;
};
// Finish line!
function R3_WIZARD_FINISH(){
	if (R3_WEBMODE === false){
		const R3MOD = '{"modName": \"' + R3_WIZARD_MOD_NAME + '\", "appVersion": \"' + INT_VERSION + '\", "modPath": \"' + R3_MOD_PATH + '\", "gameMode": ' +
					  R3_LIVESTATUS.currentMode + '}';
		APP_FS.writeFileSync(APP_PATH + '/ModInfo.R3MOD', R3MOD, 'utf-8');
		R3_SAVE_SETTINGS(false);
		R3_SYSTEM.clearLog(false);
		R3_UTILS_LOADING_CLOSE();
		R3_LOAD_SETTINGS();
		R3_RDT_FILELIST_UPDATELIST();
		R3_WIZARD_RUNNING = false;
		R3_KB_ENABLE_SHORTCUTS = true;
	};
};
/*
	Mod Utils
*/
function R3_WIZARD_openMod(){
	if (R3_WEBMODE === false){
		R3_fileManager.loadFile('.R3MOD, .R3V2', function(fName){
			R3_MENU_EXIT();
			var mFile = APP_FS.readFileSync(fName, 'utf-8');
			R3_WIZARD_modFile = JSON.parse(mFile);
			R3_MOD_PATH = R3_WIZARD_modFile.modPath;
			R3_MOD_NAME = R3_WIZARD_modFile.modName;
			R3_LIVESTATUS.currentMode = parseInt(R3_WIZARD_modFile.gameMode);
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Mod loaded sucessfully! <br>Mod Name: ' + R3_MOD_NAME + ' <br>Game Mode: ' + R3_LIVESTATUS.currentMode);
			R3_SAVE_SETTINGS(false);
		});
	};
};