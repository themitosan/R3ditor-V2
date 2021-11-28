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
	if (R3_SYSTEM.web.isBrowser === false){
		R3_fileManager.selectPath(function(gamePath){
			R3_WIZARD_GAME_PATH = R3_tools.fixPath(gamePath);
			document.getElementById('R3_WIZARD_GAME_PATH').title = R3_WIZARD_GAME_PATH;
			document.getElementById('R3_WIZARD_GAME_PATH').innerHTML = R3_tools.fixPathSize(R3_WIZARD_GAME_PATH, 120);
		});
	};
};
// Check before start
function R3_WIZARD_checkProcess(){
	if (R3_SYSTEM.web.isBrowser === false){
		var canStart = true, eReason = '';
		R3_WIZARD_MOD_NAME = document.getElementById('R3_WIZARD_MOD_NAME').value;
		R3_WIZARD_KEEP_ROFS11 = JSON.parse(document.getElementById('R3_WIZARD_KEEP_ROFS11').checked);
		R3_WIZARD_SET_RE3_PATH = JSON.parse(document.getElementById('R3_WIZARD_SET_RE3_PATH').checked);
		R3_WIZARD_SET_MERCE_PATH = JSON.parse(document.getElementById('R3_WIZARD_SET_MERCE_PATH').checked);
		R3_WIZARD_ENABLE_DOORLINK = JSON.parse(document.getElementById('R3_WIZARD_ENABLE_DOORLINK').checked);
		R3_WIZARD_REPLACE_WARN = JSON.parse(document.getElementById('R3_WIZARD_ENABLE_CUSTOM_R3V2_BOOT').checked);
		// Checks
		if (R3_MODULES.fs.existsSync(R3_WIZARD_GAME_PATH) !== true){
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
	if (R3_SYSTEM.web.isBrowser === false){
		R3_MENU_EXIT();
		R3_WIZARD_RUNNING = true;
		R3_keyPress.enableShortcuts = false;
		R3_UTILS_CALL_LOADING('Running R3V2 Wizard', 'Please wait while R3ditor V2 extracts all game assets...', 10);
		var currentRofs = 1, rofsTimer, rofsFix;
		// Create zmovie
		if (R3_MODULES.fs.existsSync(R3_MOD.path + '/zmovie') === false){
			R3_MODULES.fs.mkdirSync(R3_MOD.path + '/zmovie');
		};
		// Fix for Rofs11.dat
		if (R3_MODULES.fs.existsSync(R3_WIZARD_GAME_PATH + '/Rofs11.dat') !== false && R3_WIZARD_KEEP_ROFS11 === true){
			rofsFix = R3_MODULES.fs.readFileSync(R3_WIZARD_GAME_PATH + '/Rofs11.dat', 'hex');
			R3_MODULES.fs.writeFileSync(R3_MOD.path + '/Rofs11.dat', rofsFix, 'hex');
		};
		rofsTimer = setInterval(function(){
			if (currentRofs < 16){
				if (R3_SYSTEM.externalSoftware.processRunning !== true){
					if (R3_SYSTEM.externalSoftware.processExitCode < 2){
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
		0: [R3_WIZARD_GAME_PATH + '/zmovie', R3_MOD.path + '/zmovie'],
		1: [R3_WIZARD_GAME_PATH + '/ResidentEvil3.exe', R3_MOD.path + '/ResidentEvil3.exe'],
		2: [R3_SYSTEM.paths.tools + '/Misc/eAssets.bin', R3_MOD.path + '/' + R3_RDT_PREFIX_HARD + '/ETC2/WARNE.TIM']
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
			R3_MOD.enableMod = true;
			// Mod Path
			process.chdir(R3_SYSTEM.paths.original);
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
	if (R3_SYSTEM.web.isBrowser === false){
		R3_UTILS_LOADING_UPDATE('Extracting <font class="R3_HC_LBL_CODE user-cant-select">Rofs' + rofsId + '.dat</font> - ' + ROFS_FILE_DESC[rofsId] + ' - Please wait...', R3_tools.parsePercentage(rofsId, 15));
		R3_SYSTEM.externalSoftware.runExec(R3_SYSTEM.paths.tools + '/rofs.exe', [R3_WIZARD_GAME_PATH + '/Rofs' + rofsId + '.dat'], 1);
	};
};
/*
	Final steps
*/
// Check RE3 Path
function R3_WIZARD_FINAL_CHECK_RE3_PATH(){
	if (R3_SYSTEM.web.isBrowser === false){
		R3_UTILS_LOADING_UPDATE('Now R3ditor V2 is Checking main game executables (1 of 2)...', 92);
		var fName = R3_GAME_VERSIONS[R3_LIVESTATUS.currentMode][3];
		if (R3_WIZARD_SET_RE3_PATH === true && R3_MODULES.fs.existsSync(R3_WIZARD_GAME_PATH + '/' + fName) === true){
			R3_RE3_PATH = R3_WIZARD_GAME_PATH + '/' + fName;
		};
		R3_WIZARD_FINAL_CHECK_MERCE_PATH();
	};
};
// Check MERCE Path
function R3_WIZARD_FINAL_CHECK_MERCE_PATH(){
	if (R3_SYSTEM.web.isBrowser === false){
		R3_UTILS_LOADING_UPDATE('Now R3ditor V2 is Checking main game executables (2 of 2)...', 94);
		if (R3_WIZARD_SET_MERCE_PATH === true && R3_MODULES.fs.existsSync(R3_WIZARD_GAME_PATH + '/RE3_MERCE.exe') === true){
			R3_MERCE_PATH = R3_WIZARD_GAME_PATH + '/RE3_MERCE.exe';
		};
		R3_WIZARD_FINAL_CHECK_DOORLINK();
	};
};
// Check DoorLink
function R3_WIZARD_FINAL_CHECK_DOORLINK(){
	if (R3_SYSTEM.web.isBrowser === false){
		if (R3_WIZARD_ENABLE_DOORLINK === true){
			R3_DOORLINK.generateDatabase();
		} else {
			R3_WIZARD_FINISH();
		};
	};;
};
// Finish line!
function R3_WIZARD_FINISH(){
	if (R3_SYSTEM.web.isBrowser === false){
		const R3MOD = '{"modName": \"' + R3_WIZARD_MOD_NAME + '\", "appVersion": \"' + INT_VERSION + '\", "modPath": \"' + R3_MOD.path + '\", "gameMode": ' +
					  R3_LIVESTATUS.currentMode + '}';
		R3_MODULES.fs.writeFileSync(R3_SYSTEM.paths.mod + '/ModInfo.R3MOD', R3MOD, 'utf-8');
		R3_SAVE_SETTINGS(false);
		R3_SYSTEM.clearLog(false);
		R3_UTILS_LOADING_CLOSE();
		R3_LOAD_SETTINGS();
		R3_RDT_FILELIST_UPDATELIST();
		R3_WIZARD_RUNNING = false;
		R3_keyPress.enableShortcuts = true;
	};
};