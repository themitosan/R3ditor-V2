/*
	R3ditor V2 - utils.js
	Here we gooooo~
*/
// OBJ Patcher
var OBJ_arquivoBruto,
	// Xdelta
	R3_XDELTA_PATCH, R3_XDELTA_ORIGINALFILE,
	// File Generator
	FG_EXTRA_RENDER, FILEGEN_currentColor = 0, FILEGEN_currentFont = 'RE1',
	// Disc Vars
	RPC, rpcReady, discUserName,
	// Internal Copy & Paste
	R3_TEMP_X = R3_TEMP_Y = R3_TEMP_Z = R3_TEMP_R = '0000',
	R3_TEMP_zI = '00',
	R3_TEMP_STAGE = '1',
	R3_TEMP_ROOM = '100',
	R3_TEMP_CAM = '00';
/*
	Rofs extractor
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
// Finish Enable Mod
function R3_ROFS_ENABLE_MOD_FINISH(){
	R3_UTILS_LOADING_UPDATE('Done!', 100);
	process.chdir(ORIGINAL_APP_PATH);
	APP_ENABLE_MOD = true;
	// Skip making config file if current version is Gemini REbirth
	if (RE3_LIVE_CURRENTMOD !== 4){
		R3_INI_MAKEFILE(0);
	};
	R3_SAVE_SETTINGS(false);
	R3_UTILS_LOADING_CLOSE();
	R3_LOAD_SETTINGS();
	R3_RDT_FILELIST_UPDATELIST();
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
// Extract Rofs individually 
function R3_ROFS_EXTRACT(){
	if (R3_WEBMODE === false){
		R3_FILE_LOAD('.dat', function(rofsFile){
			process.chdir(R3_getFilePath(rofsFile));
			R3_UTILS_CALL_LOADING('Extracting ROFS', 'Please wait while R3ditor V2 extracts ' + rofsFile, 50);
			R3_runExec(APP_TOOLS + '/rofs.exe', [rofsFile], 3, rofsFile);
			var rofsTimer = setInterval(function(){
				if (EXTERNAL_APP_RUNNING === true){
					console.info('Waiting ' + rofsFile + ' to extract...');
				} else {
					if (EXTERNAL_APP_EXITCODE < 2){
						process.chdir(ORIGINAL_APP_PATH);
						R3_UTILS_LOADING_CLOSE();
						R3_SYSTEM_ALERT('Process complete!\nFile: ' + rofsFile);
						clearInterval(rofsTimer);
					} else {
						R3_UTILS_LOADING_UPDATE('Something went wrong while extracting ' + rofsFile + '!', 100);
						setTimeout(function(){
							R3_RELOAD();
						}, 5000);
					};
				};
			}, 150);
		});
	};
};
/*
	Xdelta Patcher
*/
// Load Files
function R3_XDELTA_loadFiles(mode){
	if (R3_WEBMODE === false){
		if (mode === 0){
			R3_FILE_LOAD('.xdelta', function(xPath){
				R3_XDELTA_PATCH = xPath;
				R3_SYSTEM_LOG('log', 'R3ditor V2 - Xdelta: Patch File: ' + xPath);
				document.getElementById('R3_XDELTA_LBL_XFILE').title = xPath;
				document.getElementById('R3_XDELTA_LBL_XFILE').innerHTML = R3_fixPathSize(xPath, 60);
			});
		} else {
			R3_FILE_LOAD('.exe, .bin, .iso, .dat, .23, .raw', function(origFile){
				R3_XDELTA_ORIGINALFILE = origFile;
				R3_SYSTEM_LOG('log', 'R3ditor V2 - Xdelta: Target File: ' + origFile);
				document.getElementById('R3_XDELTA_LBL_ORIGFILE').title = origFile;
				document.getElementById('R3_XDELTA_LBL_ORIGFILE').innerHTML = R3_fixPathSize(origFile, 60);
			});
		};
	};
};
// Apply Xdelta Patch
function R3_XDELTA_APPLY(){
	if (R3_XDELTA_PATCH !== undefined && R3_XDELTA_ORIGINALFILE !== undefined && R3_WEBMODE === false){
		// Prepare R3 to make it!
		var R3_XDELTA_INTERVAL, R3_rearm = false, origName;
		if (R3_RE3_CANRUN !== false){
			R3_rearm = true;
			R3_RE3_CANRUN = false;
		};
		// Run Process
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (Xdelta) Starting Process - Please wait...');
		process.chdir(APP_TOOLS);
		R3_UTILS_CALL_LOADING('Xdelta Patcher', 'Please wait while Xdelta does his job...', 50);
		origName = R3_getFileName(R3_XDELTA_ORIGINALFILE), origExt = R3_getFileExtension(R3_XDELTA_ORIGINALFILE);
		R3_runExec(APP_TOOLS + '/xdelta.exe', ['-d', '-s', R3_XDELTA_ORIGINALFILE, R3_XDELTA_PATCH , 'XDELTA_PATCH_FILE.bin']);
		R3_XDELTA_INTERVAL = setInterval(function(){
			if (EXTERNAL_APP_RUNNING !== false){
				console.info('Waiting XDELTA...');
			} else {
				if (EXTERNAL_APP_EXITCODE !== 0){
					R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: (Xdelta) Something went wrong while applying Xdelta Patch!');
					R3_UTILS_LOADING_UPDATE('Something went wrong while applying Xdelta Patch!', 100);
					setTimeout(function(){
						R3_RELOAD();
					}, 5000);
				} else {
					R3_XDELTA_FINISH(origName, origExt, R3_rearm);
				};
				process.chdir(ORIGINAL_APP_PATH);
				clearInterval(R3_XDELTA_INTERVAL);
			};
		}, 100);
	};
};
// Finish Path
function R3_XDELTA_FINISH(fName, ext, rearm){
	if (R3_WEBMODE === false){
		R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: (Xdelta) Process complete!');
		var newFilePath = APP_TOOLS + '/XDELTA_PATCH_FILE.bin', R3_XDELTA_newFile;
		if (rearm === true){
			R3_RE3_CANRUN = true;
		};
		if (APP_FS.existsSync(newFilePath) !== false){
			R3_XDELTA_newFile = APP_FS.readFileSync(newFilePath, 'hex');
			R3_FILE_SAVE(fName + '_patch', R3_XDELTA_newFile, 'hex', '');
			if (APP_FS.existsSync(APP_TOOLS + '/XDELTA_PATCH_FILE.bin') !== false){
				APP_FS.unlinkSync(APP_TOOLS + '/XDELTA_PATCH_FILE.bin');
			};
			R3_UTILS_LOADING_CLOSE();
		};
	};
};
/*
	OBJ Patcher

	Original patch was created by Biohazard España
	Twitter: https://twitter.com/biohazardEsp
*/
// Load File
function R3_OBJ_PATCHER(){
	if (R3_WEBMODE === false){
		R3_FILE_LOAD('.obj', function(objFile, tempObj){
			OBJ_arquivoBruto = '';
			var c = tPaches = 0, OBJ_array = [], linePatch;
			tempObj.toString().split('\n').forEach(function(line){ 
				OBJ_array.push(line); 
			});
			while(c < OBJ_array.length){
				if (OBJ_array[c].slice(0, 1) === '#'){
					c++;
				} else {
					linePatch = OBJ_array[c];
					if (linePatch.indexOf('.') !== -1){
						linePatch = linePatch.replace(/\./g, ',');
						tPaches++;
					};
					if (c === 0){
						OBJ_arquivoBruto = linePatch;
					} else {
						OBJ_arquivoBruto = OBJ_arquivoBruto + '\n' + linePatch;
					};
					c++;
				};
			};
			if (tPaches !== 0){
				OBJ_arquivoBruto = '# OBJ Converted using ' + APP_TITLE + '\n' + OBJ_arquivoBruto.slice(1, OBJ_arquivoBruto.length);
				R3_FILE_SAVE(R3_getFileName(objFile).toLowerCase().replace('.obj', '') + '_converted', OBJ_arquivoBruto, 'utf-8', 'obj');
			} else {
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (OBJ Patcher) This file doesn\'t need patching!');
				R3_SYSTEM_ALERT('INFO - This file doesn\'t need patching!');
			};
		}, undefined, 'utf-8');
	} else {
		R3_WEBWARN();
	};
};
/*
	File generator (Filegen)
*/
// Select BG file
function R3_FILEGEN_selectBG(mode){
	if (R3_WEBMODE === false){
		if (mode === 0){
			R3_FILE_LOAD('.png, .jpg, .jpeg, .bmp', function(newBgFile){
				var fileFix = '';
				if (R3_WEBMODE === true){
					fileFix = 'file://';
				};
				$('#R3_FILEGEN_RENDERAREA_BG').css({'background-image': 'url(\'' + fileFix + newBgFile + '\')'});
			});
		} else {
			$('#R3_FILEGEN_RENDERAREA_BG').css({'background-image': 'url(\'\')'});
		};
	};
};
// Update BG filters
function R3_FILEGEN_BG_UPDATE_FILTERS(){
	if (R3_WEBMODE === false){
		var bgSize = parseInt(document.getElementById('R3_FILEGEN_RANGE_BG_SIZE').value);
			bgOpacity = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_OPACITY').value);
			bgBlur = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_BLUR').value);
			bgHUE = parseInt(document.getElementById('R3_FILEGEN_RANGE_BG_HUE').value);
			bgSat = parseInt(document.getElementById('R3_FILEGEN_RANGE_BG_SAT').value);
			bgSepia = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_SEP').value);
			bgInvert = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_INV').value);
		// Update Labels
		document.getElementById('R3_FILEGEN_LBL_BG_SIZE').innerHTML = bgSize;
		document.getElementById('R3_FILEGEN_LBL_BG_OPACITY').innerHTML = R3_parsePercentage(bgOpacity, 1);
		document.getElementById('R3_FILEGEN_LBL_BG_BLUR').innerHTML = bgBlur;
		document.getElementById('R3_FILEGEN_LBL_BG_HUE').innerHTML = bgHUE;
		document.getElementById('R3_FILEGEN_LBL_BG_SAT').innerHTML = R3_parsePercentage(bgSat, 30);
		document.getElementById('R3_FILEGEN_LBL_BG_SEPIA').innerHTML = R3_parsePercentage(bgSepia, 1);
		document.getElementById('R3_FILEGEN_LBL_BG_INVERT').innerHTML = R3_parsePercentage(bgInvert, 1);
		// Update BG
		$('#R3_FILEGEN_RENDERAREA_BG').css({'background-size': 'auto ' + bgSize + '%', 'opacity': bgOpacity, 'filter': 'blur(' + bgBlur + 'px) hue-rotate(' + bgHUE + 'deg) saturate(' + bgSat + ') invert(' + bgInvert + ') sepia(' + bgSepia + ')'});
	};
};
// Select Text color
function R3_FILEGEN_selectTextColor(mode){
	var c = 0, maxColors = 4;
	while (c < maxColors){
		document.getElementById('R3_FILEGEN_color_' + c).checked = false;
		c++;
	};
	document.getElementById('R3_FILEGEN_color_' + mode).checked = true;
	FILEGEN_currentColor = mode;
	R3_FILEGEN_renderText(true);
};
// Render Text
function R3_FILEGEN_renderText(renderOnFilegen, otherCanvas, textRender){
	if (R3_WEB_IS_SAFARI === false && R3_WEB_IS_IE === false){
		var x_offset = y_offset = textInvert = c = 0, textToRender, invertCheck, text, browserName;
		if (renderOnFilegen === true){
			document.getElementById('R3_FILEGEN_RENDERAREA').innerHTML = '';
			document.getElementById('R3_FILEGEN_RENDERAREA_BIG').innerHTML = '';
			textToRender = document.getElementById('R3_FILEGEN_TEXTAREA').value;
		} else {
			textToRender = textRender;
			document.getElementById(otherCanvas).innerHTML = '';
		};
		invertCheck = document.getElementById('R3_FILEGEN_CHECKBOX_INVERT').checked;
		if (invertCheck === true){
			textInvert = 1;
		};
		if (textToRender !== ''){
			text = textToRender.toString().replace(new RegExp('\n', 'gi'), '§').match(/.{1,1}/g);
			while(c < text.length){
				if (FG_DICIONARIO[text[c]] !== undefined && FG_RE3_DICIONARIO[text[c]]){
					if (text[c] === '\n' || text[c] === '§'){
						y_offset = (y_offset + 15);
						x_offset = 0;
						c++;
					} else {
						var distance, FG_HTML_TEMPLATE;
						if (FILEGEN_currentFont === 'RE1'){
							distance = parseInt(FG_DICIONARIO[text[c]][1]) + x_offset;
							FG_HTML_TEMPLATE = '<img src="img/fonts/chars_' + FILEGEN_currentFont + '_' + FILEGEN_currentColor + '.png" style="clip-path: inset(' + FG_DICIONARIO[text[c]][0] + '); position: absolute; left: ' + distance + 'px;top: ' + y_offset + 'px; filter: invert(' + textInvert + ');">';
						};
						if (FILEGEN_currentFont === 'RE3'){
							distance = parseInt(FG_RE3_DICIONARIO[text[c]][1]) + x_offset;
							FG_HTML_TEMPLATE = '<img src="img/fonts/chars_' + FILEGEN_currentFont + '_' + FILEGEN_currentColor + '.png" style="clip-path: inset(' + FG_RE3_DICIONARIO[text[c]][0] + '); position: absolute; left: ' + distance + 'px;top: ' + y_offset + 'px; filter: invert(' + textInvert + ');">';
						};
						// Render
						if (renderOnFilegen === true){
							$('#R3_FILEGEN_RENDERAREA').append(FG_HTML_TEMPLATE);
							$('#R3_FILEGEN_RENDERAREA_BIG').append(FG_HTML_TEMPLATE);
						} else {
							$('#' + otherCanvas).append(FG_HTML_TEMPLATE);
						};
						// Post
						if (FILEGEN_currentFont === 'RE1'){
							x_offset = x_offset + FG_DICIONARIO[text[c]][2];
						};
						if (FILEGEN_currentFont === 'RE3'){
							x_offset = x_offset + FG_RE3_DICIONARIO[text[c]][2];
						};
						c++;
					};
				} else {
					c++;
				};
			};
		};
	} else {
		// Unable to rennder due CSS madness
		if (R3_WEB_IS_SAFARI === true){
			browserName = 'Apple Safari';
		};
		if (R3_WEB_IS_IE === true){
			browserName = 'Internet Explorer';
		};
		// End
		document.getElementById('R3_FILEGEN_RENDERAREA').innerHTML = 'Unable to render in ' + browserName + ' :(';
	};
};
// Change current font
function R3_FILEGEN_changeFont(){
	FILEGEN_currentFont = document.getElementById('R3_FILEGEN_fontStyle').value;
	R3_FILEGEN_renderText(true);
};
// Render text on other canvas
function R3_FILEGEN_RENDER_EXTERNAL(location, text, font, interval){
	if (location !== undefined && text !== undefined && font !== undefined && interval !== undefined && R3_WEB_IS_SAFARI === false){
		var c = 0, currentText = '';
		if (interval !== 0){
			FG_EXTRA_RENDER = setInterval(function(){
				FILEGEN_currentFont = font;
				if (c < (text.length + 1)){
					currentText = text.slice(0, c);
					R3_FILEGEN_renderText(false, location, currentText);
					c++;
				} else {
					clearInterval(FG_EXTRA_RENDER);
				};
			}, interval);
		} else {
			FILEGEN_currentFont = font;
			R3_FILEGEN_renderText(false, location, text);
		};
	};
};
/*
	Discord API
*/
// Set Status
function R3_DISC_setActivity(det, stat){
	if (SETTINGS_USE_DISCORD !== false && rpcReady !== false && R3_WEBMODE === false && R3_NW_ARGS_DISABLE_DISCORD === false){
		if (RE3_RUNNING !== false){
			RPC.setActivity({'details': 'Running RE3', 'state': 'On ' + RDT_locations[REALTIME_CurrentRDT][0], 'largeImageKey': 'app_logo', 'maxpartysize': 0});
		} else {
			RPC.setActivity({'details': det, 'state': stat, 'largeImageKey': atob(special_day_02[3] + '='), 'maxpartysize': 0});
		};
	};
};
// Clear Activity
function R3_DISC_clearActivity(){
	if (SETTINGS_USE_DISCORD !== false && rpcReady !== false && R3_WEBMODE === false && R3_NW_ARGS_DISABLE_DISCORD === false){
		RPC.clearActivity();
	};
};
// Init discord API
function R3_DISCORD_INIT(){
	if (R3_WEBMODE === false && R3_NW_ARGS_DISABLE_DISCORD === false){
		RPC = new DiscordRPC.Client({transport: 'ipc'});
		if (navigator.onLine !== false){
			var loginRPC = RPC.login({clientId: atob(special_day_02[0]), clientSecret: atob(special_day_02[1] + special_day_02[2])});
			RPC.on('ready', function(){
				rpcReady = true;
				discUserName = RPC.user.username;
				R3_DISC_setActivity('Main menu', 'Idle');
			});
		} else {
			R3_SYSTEM_LOG('warn', 'WARN - You are offline!\nDiscord options will be disabled.');
		};
	} else {
		if (R3_NW_ARGS_DISABLE_DISCORD === true){
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Disabling Discord Rich Presence...');
		};
	};
};
/*
	Copy and Paste Values
*/
// Copy
function R3_SYS_COPY_POS(where){
	var whr = '';
	// Livestatus
	if (where === 0){
		R3_TEMP_X  = document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value;
		R3_TEMP_Y  = document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value;
		R3_TEMP_Z  = document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value;
		R3_TEMP_R  = document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value;
		R3_TEMP_zI = document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value;
		whr = 'RE3 Livestatus';
	};
	// SCD Edit Function 61 Door Pos.
	if (where === 1){
		R3_TEMP_X  = document.getElementById('R3_SCD_EDIT_61_posX').value;
		R3_TEMP_Y  = document.getElementById('R3_SCD_EDIT_61_posY').value;
		R3_TEMP_Z  = document.getElementById('R3_SCD_EDIT_61_posZ').value;
		R3_TEMP_R  = document.getElementById('R3_SCD_EDIT_61_posR').value;
		whr = 'SCD Editor - (61) Door Pos.';
	};
	// SCD Edit Function 61 Spawn Pos.
	if (where === 2){
		R3_TEMP_X  	  = document.getElementById('R3_SCD_EDIT_61_nextX').value;
		R3_TEMP_Y  	  = document.getElementById('R3_SCD_EDIT_61_nextY').value;
		R3_TEMP_Z  	  = document.getElementById('R3_SCD_EDIT_61_nextZ').value;
		R3_TEMP_R  	  = document.getElementById('R3_SCD_EDIT_61_nextR').value;
		R3_TEMP_zI 	  = document.getElementById('R3_SCD_EDIT_61_zIndex').value;
		R3_TEMP_STAGE = document.getElementById('R3_SCD_EDIT_61_stage').value;
		R3_TEMP_ROOM  = document.getElementById('R3_SCD_EDIT_61_roomNumber').value;
		R3_TEMP_CAM   = document.getElementById('R3_SCD_EDIT_61_nextCam').value;
		whr = 'SCD Editor - (61) Spawn Pos.';
	};
	// SCD Edit Function 62 Door Pos.
	if (where === 3){
		R3_TEMP_X  = document.getElementById('R3_SCD_EDIT_62_posX').value;
		R3_TEMP_Y  = document.getElementById('R3_SCD_EDIT_62_posY').value;
		R3_TEMP_Z  = document.getElementById('R3_SCD_EDIT_62_posZ').value;
		R3_TEMP_R  = document.getElementById('R3_SCD_EDIT_62_posR').value;
		whr = 'SCD Editor - (62) Door Pos.';
	};
	// SCD Edit Function 62 Spawn Pos.
	if (where === 4){
		R3_TEMP_X	  = document.getElementById('R3_SCD_EDIT_62_nextX').value;
		R3_TEMP_Y	  = document.getElementById('R3_SCD_EDIT_62_nextY').value;
		R3_TEMP_Z	  = document.getElementById('R3_SCD_EDIT_62_nextZ').value;
		R3_TEMP_R	  = document.getElementById('R3_SCD_EDIT_62_nextR').value;
		R3_TEMP_zI	  = document.getElementById('R3_SCD_EDIT_62_zIndex').value;
		R3_TEMP_STAGE = document.getElementById('R3_SCD_EDIT_62_stage').value;
		R3_TEMP_ROOM  = document.getElementById('R3_SCD_EDIT_62_roomNumber').value;
		R3_TEMP_CAM   = document.getElementById('R3_SCD_EDIT_62_nextCam').value;
		whr = 'SCD Editor - (62) Spawn Pos.';
	};
	// SCD Edit Function 63 Set Interactive Object [AOT_SET]
	if (where === 5){
		R3_TEMP_X	  = document.getElementById('R3_SCD_EDIT_63_posX').value;
		R3_TEMP_Y	  = document.getElementById('R3_SCD_EDIT_63_posY').value;
		whr = 'SCD Editor - (63) AOT Pos';
	};
	/*
		End
	*/
	R3_SYSTEM_LOG('log', 'R3ditor V2 - Copy Position from ' + whr + ' (<font class="COLOR_X">X: <font class="user-can-select">' + R3_TEMP_X.toUpperCase() + 
				  '</font></font> <font class="COLOR_Y">Y: <font class="user-can-select">' + R3_TEMP_Y.toUpperCase() + '</font></font> <font class="COLOR_Z">' + 
				  'Z: <font class="user-can-select">' + R3_TEMP_Z.toUpperCase() + '</font></font> <font class="COLOR_R">R: <font class="user-can-select">' + R3_TEMP_R.toUpperCase() + 
				  '</font></font>)');
};
// Paste
function R3_SYS_PASTE_POS(where){
	var whr = '';
	// Livestatus
	if (where === 0){
		document.getElementById('R3_LIVESTATUS_EDIT_POS_X').value = R3_TEMP_X;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Y').value = R3_TEMP_Y;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_Z').value = R3_TEMP_Z;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_R').value = R3_TEMP_R;
		document.getElementById('R3_LIVESTATUS_EDIT_POS_zI').value = R3_TEMP_zI;
		whr = 'RE3 Livestatus';
	};
	// SCD Edit Function 61 Door Pos.
	if (where === 1){
		document.getElementById('R3_SCD_EDIT_61_posX').value = R3_TEMP_X;
		document.getElementById('R3_SCD_EDIT_61_posY').value = R3_TEMP_Y;
		document.getElementById('R3_SCD_EDIT_61_posZ').value = R3_TEMP_Z;
		document.getElementById('R3_SCD_EDIT_61_posR').value = R3_TEMP_R;
		whr = 'SCD Editor (61) Door Pos.';
	};
	// SCD Edit Function 61 Spawn Pos.
	if (where === 2){
		document.getElementById('R3_SCD_EDIT_61_nextX').value = R3_TEMP_X;
		document.getElementById('R3_SCD_EDIT_61_nextY').value = R3_TEMP_Y;
		document.getElementById('R3_SCD_EDIT_61_nextZ').value = R3_TEMP_Z;
		document.getElementById('R3_SCD_EDIT_61_nextR').value = R3_TEMP_R;
		document.getElementById('R3_SCD_EDIT_61_zIndex').value = R3_TEMP_zI;
		document.getElementById('R3_SCD_EDIT_61_stage').value = R3_TEMP_STAGE;
		document.getElementById('R3_SCD_EDIT_61_roomNumber').value = R3_TEMP_ROOM;
		document.getElementById('R3_SCD_EDIT_61_nextCam').value = R3_TEMP_CAM;
		R3_SCD_FUNCTIONEDIT_updateCamPreview('61');
		whr = 'SCD Editor (61) Spawn Pos.';
	};
	// SCD Edit Function 62 Door Pos.
	if (where === 3){
		document.getElementById('R3_SCD_EDIT_62_posX').value = R3_TEMP_X;
		document.getElementById('R3_SCD_EDIT_62_posY').value = R3_TEMP_Y;
		document.getElementById('R3_SCD_EDIT_62_posZ').value = R3_TEMP_Z;
		document.getElementById('R3_SCD_EDIT_62_posR').value = R3_TEMP_R;
		whr = 'SCD Editor (62) Door Pos.';
	};
	// SCD Edit Function 62 Spawn Pos.
	if (where === 4){
		document.getElementById('R3_SCD_EDIT_62_nextX').value = R3_TEMP_X;
		document.getElementById('R3_SCD_EDIT_62_nextY').value = R3_TEMP_Y;
		document.getElementById('R3_SCD_EDIT_62_nextZ').value = R3_TEMP_Z;
		document.getElementById('R3_SCD_EDIT_62_nextR').value = R3_TEMP_R;
		document.getElementById('R3_SCD_EDIT_62_zIndex').value = R3_TEMP_zI;
		document.getElementById('R3_SCD_EDIT_62_stage').value = R3_TEMP_STAGE;
		document.getElementById('R3_SCD_EDIT_62_roomNumber').value = R3_TEMP_ROOM;
		document.getElementById('R3_SCD_EDIT_62_nextCam').value = R3_TEMP_CAM;
		R3_SCD_FUNCTIONEDIT_updateCamPreview('62');
		whr = 'SCD Editor (62) Spawn Pos.';
	};
	// SCD Edit Function 63 Set Interactive Object [AOT_SET]
	if (where === 5){
		document.getElementById('R3_SCD_EDIT_63_posX').value = R3_TEMP_X;
		document.getElementById('R3_SCD_EDIT_63_posY').value = R3_TEMP_Y;
	};
	/*
		End
	*/
	R3_SYSTEM_LOG('log', 'R3ditor V2 - Paste Position to ' + whr + ' (<font class="COLOR_X">X: <font class="user-can-select">' + R3_TEMP_X.toUpperCase() + 
				  '</font></font> <font class="COLOR_Y">Y: <font class="user-can-select">' + R3_TEMP_Y.toUpperCase() + '</font></font> <font class="COLOR_Z">' + 
				  'Z: <font class="user-can-select">' + R3_TEMP_Z.toUpperCase() + '</font></font> <font class="COLOR_R">R: <font class="user-can-select">' + R3_TEMP_R.toUpperCase() + 
				  '</font></font>)');
};
/*
	Import RDT file
*/
// Drag Over Handler
function R3_dragOverHandler(evt){
	evt.preventDefault();
};
// Import Map Event
function R3_RDT_importMap(ev){
	if (R3_WEBMODE === false){
		ev.preventDefault();
		if (ev.dataTransfer.items){
			for (var i = 0; i < ev.dataTransfer.items.length; i++){
				if (ev.dataTransfer.items[i].kind === 'file' && R3_MENU_CURRENT === 10){
					var file = ev.dataTransfer.items[i].getAsFile();
					if (APP_FS.existsSync(R3_MOD_PATH + '/' + R3_RDT_PREFIX_EASY + '/RDT') === true && APP_FS.existsSync(R3_MOD_PATH + '/' + R3_RDT_PREFIX_HARD + '/RDT') === true){
						R3_RDT_checkMap(file.path);
					} else {
						R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to find the output folders!');
						R3_SYSTEM_LOG('error', 'Make sure to extract the game first before using this option.');
					}
				} else {
					console.warn('Skipping file drop...');
				};
			};
		};
	} else {
		R3_WEBWARN();
	};
};
// Process Drop File
function R3_RDT_checkMap(file){
	if (file !== undefined && file !== '' && R3_WEBMODE === false){
		var fileExt = R3_getFileExtension(file), fileName = R3_getFileName(file), msgError = '', tempFile, impEasy, impHard;
		if (fileExt.toUpperCase() === 'RDT'){
			// Check file name
			if (fileName.length === 4){
				impEasy = document.getElementById('R3_RDT_IMPORT_EASY').checked;
				impHard = document.getElementById('R3_RDT_IMPORT_HARD').checked;
				if (impEasy === false && impHard === false){
					msgError = 'WARN: You need select where you want to import!';
					R3_SYSTEM_LOG('warn', 'R3ditor V2 - ' + msgError);
					R3_SYSTEM_ALERT(msgError);
				} else {
					tempFile = APP_FS.readFileSync(file, 'hex');
					try {
						if (impEasy === true){
							APP_FS.writeFileSync(R3_MOD_PATH + '/' + R3_RDT_PREFIX_EASY + '/RDT/' + fileName.toUpperCase() + '.RDT', tempFile, 'hex');
							R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Importing map ' + fileName.toUpperCase() + ' (Easy)');
						};
						if (impHard === true){
							APP_FS.writeFileSync(R3_MOD_PATH + '/' + R3_RDT_PREFIX_HARD + '/RDT/' + fileName.toUpperCase() + '.RDT', tempFile, 'hex');
							R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Importing map ' + fileName.toUpperCase() + ' (Hard)');
						};
						R3_SYSTEM_ALERT('INFO - Process successful!\n\nMap: ' + fileName.toUpperCase() + '\nLocation: ' + RDT_locations[fileName.toUpperCase()][0] + ', ' + RDT_locations[fileName.toUpperCase()][1]);
					} catch (err) {
						msgError = 'ERROR: Something went wrong while importing map!';
						R3_SYSTEM_LOG('error', 'R3ditor V2 - ' + msgError);
						R3_SYSTEM_LOG('error', 'Reason: ' + err);
						R3_SYSTEM_ALERT(msgError);
					};
				};
			} else {
				msgError = 'WARN: This file aren\'t from RE3!';
				R3_SYSTEM_LOG('warn', 'R3ditor V2 - ' + msgError);
				R3_SYSTEM_ALERT(msgError);
			};
		} else {
			msgError = 'WARN: This is not a valid map file!';
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - ' + msgError);
			R3_SYSTEM_ALERT(msgError);
		};
	};
};
/*
	Call Color Picker
	
	API:
	colorArray = Array [R, G, B]
	hexmode    = Boolean (true returns hex color, else RGB array)
	nextFn     = Function with selected color
*/
function R3_SYS_COLOR_PICKER(colorArray, hexMode, nextFn){
	if (colorArray !== undefined && colorArray.length === 3){
		var colorR = MEMORY_JS_fixVars(parseInt(colorArray[0]).toString(16), 2),
			colorG = MEMORY_JS_fixVars(parseInt(colorArray[1]).toString(16), 2),
			colorB = MEMORY_JS_fixVars(parseInt(colorArray[2]).toString(16), 2);
		document.getElementById('R3_COLOR_PICKER').value = '#' + colorR + colorG + colorB;
	};
	$('#R3_COLOR_PICKER').trigger('click');
	document.getElementById('R3_COLOR_PICKER').onchange = function(){
		var newColor = document.getElementById('R3_COLOR_PICKER').value;
		if (hexMode === false){
			var tempColor = newColor.slice(1).match(/.{2,2}/g);
				colorR = parseInt(tempColor[0], 16),
				colorG = parseInt(tempColor[1], 16),
				colorB = parseInt(tempColor[2], 16);
			newColor = [colorR, colorG, colorB];
		};
		// End
		if (nextFn !== undefined){
			nextFn(newColor);
		} else {
			return newColor;
		};
	};
};
// Clear cache from web
function R3_SYS_CLEAR_CACHE(){
	if (R3_WEBMODE === true){
		var check = R3_SYSTEM_CONFIRM('WARN: This option will clear all cached images / R3V2 settings from your browser!\n\nYou want to continue?');
		if (check === true && R3_WEBMODE === true){
			localStorage.clear();
			sessionStorage.clear();
			location.reload(true);
		};
	};
};
/*
	Item database functions
*/
function R3_ITEM_DATABASE_SEARCH_INFO(){
	R3_cleanHexFromInput('R3_ITEM_DATABASE_SEARCH');
	var itemInput = document.getElementById('R3_ITEM_DATABASE_SEARCH').value;
	if (itemInput.length === 2){
		document.getElementById('R3_ITEM_DATABASE_SEARCH').value = '';
		if (DATABASE_ITEM[itemInput] !== undefined){
			document.getElementById('R3_ITEM_DATABASE_ICON').src = 'img/items/details/' + itemInput + '.png';
			document.getElementById('R3_ITEM_DATABASE_TITLE').innerHTML = DATABASE_ITEM[itemInput][0];
			document.getElementById('R3_ITEM_DATABASE_DETAILS').innerHTML = DATABASE_ITEM[itemInput][1].replace(DATABASE_ITEM[itemInput][0] + '<br>', '');
			document.getElementById('R3_ITEM_DATABASE_SEARCH').focus();
		} else {
			R3_SYSTEM_LOG('warn', 'R3ditor V2 - WARN: (Item Database) Unable to find item <font class="user-can-select">' + itemInput.toUpperCase() + '</font>!');
		};
	};
};
/*
	Backup Manager Functions
*/
// Backup File
function R3_UTILS_BACKUP(data, fileName, extension, backupPath, type){
	if (fileName !== undefined && backupPath !== undefined && extension !== undefined && R3_WEBMODE === false){
		var cDate = R3_getDate(), BCK_fName = fileName + '_' + cDate + extension, bckPath = backupPath + '/' + BCK_fName;
		try {
			APP_FS.writeFileSync(bckPath, data, 'hex');
			// End
			R3_SYSTEM_LOG('separator');
			R3_BACKUP_MANAGER_INSERT(BCK_fName, fileName, extension.toLowerCase(), cDate, bckPath, type);
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Backup Complete! <br>Path: <font class="user-can-select">' + backupPath + BCK_fName + '</font>');
			R3_SYSTEM_LOG('separator');
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to make backup! <br>Reason: ' + err);
			R3_SYSTEM_ALERT('ERROR: Unable to make backup!\nReason: ' + err);
		};
	};
};
// Load Backup Manager
function R3_BACKUP_MANAGER_LOAD(openBackupList){
	if (R3_WEBMODE === false){
		var bckList = APP_PATH + '/Configs/Backup/R3V2_BCK.R3V2';
		if (APP_FS.existsSync(bckList) === false){
			try {
				APP_FS.writeFileSync(bckList, 'e30=', 'utf-8');
			} catch (err) {
				R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to gerenate backup list! <br>Reason: ' + err);
			};
		};
		// Load backup file
		try {
			R3_SYSTEM_BACKUP_LIST = JSON.parse(atob(APP_FS.readFileSync(bckList, 'utf-8')));
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to load backup list! <br>Reason: ' + err);
		};
		if (openBackupList === true){
			R3_DESIGN_renderBackupManager();
		};
	};
};
// Append items on backup manager
function R3_BACKUP_MANAGER_INSERT(fileName, originalFileName, type, date, path, editorName){
	if (R3_WEBMODE === false){
		var ext = type.replace('.', '');
		R3_SYSTEM_BACKUP_LIST[fileName] = [originalFileName, R3_LATEST_FILE_TYPES[R3_BACKUP_MANAGER_EDITORS[ext][0]], editorName, R3_readDate(date, 0), R3_readDate(date, 1), path, ext];
		// Save List
		try {
			APP_FS.writeFileSync(APP_PATH + '/Configs/Backup/R3V2_BCK.R3V2', btoa(JSON.stringify(R3_SYSTEM_BACKUP_LIST)), 'utf-8');
			R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Updating backup list...');
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to update backup list! <br>Reason: ' + err);
		};
	};
};
// Restore backup file
function R3_BACKUP_MANAGER_restore(fileId){
	if (R3_WEBMODE === false && fileId !== undefined){
		var restoreOk = false, conCheck, tempHex, newFilePath, fArray = Object.keys(R3_SYSTEM_BACKUP_LIST), fName = fArray[fileId],
			mName  = R3_SYSTEM_BACKUP_LIST[fName][0],
			fPath  = R3_SYSTEM_BACKUP_LIST[fName][5],
			fExt   = R3_SYSTEM_BACKUP_LIST[fName][6];
		try {
			// RDT Files
			if (fExt === 'rdt'){
				// Easy Mode
				conCheck = R3_SYSTEM_CONFIRM('Confirm: Click OK to restore this file on Easy mode (' + R3_RDT_PREFIX_EASY + ')');
				if (conCheck === true){
					restoreOk = true;
					tempHex = APP_FS.readFileSync(fPath, 'hex');
					newFilePath = APP_PATH + '/Assets/' + R3_RDT_PREFIX_EASY + '/RDT/' + R3_SYSTEM_BACKUP_LIST[fName][0] + '.RDT';
					APP_FS.writeFileSync(newFilePath, tempHex, 'hex');
					R3_SYSTEM_LOG('separator');
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Process complete! <br>Path:<font class="user-can-select">' + newFilePath + '</font>');
					R3_SYSTEM_ALERT('INFO: Process complete! (' + R3_RDT_PREFIX_EASY + ')');
				};
				// Hard Mode
				conCheck = R3_SYSTEM_CONFIRM('Confirm: Click OK to restore this file on Hard mode (' + R3_RDT_PREFIX_HARD + ')');
				if (conCheck === true){
					restoreOk = true;
					tempHex = APP_FS.readFileSync(fPath, 'hex');
					newFilePath = APP_PATH + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT/' + R3_SYSTEM_BACKUP_LIST[fName][0] + '.RDT';
					APP_FS.writeFileSync(newFilePath, tempHex, 'hex');
					R3_SYSTEM_LOG('separator');
					R3_SYSTEM_LOG('log', 'R3ditor V2 - INFO: Process complete! <br>Path:<font class="user-can-select">' + newFilePath + '</font>');
					R3_SYSTEM_ALERT('INFO: Process complete! (' + R3_RDT_PREFIX_HARD + ')');
				};
				// Actions after restoring map
				if (R3_RDT_mapName === mName && restoreOk === true){
					R3_SHOW_MENU(10);
					setTimeout(function(){
						R3_RDT_LOAD(ORIGINAL_FILENAME, true);
					}, 100);
				};
			};
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to restore backup file! <br>Reason: ' + err);
		};
	};
};
// Delete backup file
function R3_BACKUP_MANAGER_delete(fileId){
	if (R3_WEBMODE === false && fileId !== undefined){
		try {
			var fArray = Object.keys(R3_SYSTEM_BACKUP_LIST),
				fName  = fArray[fileId],
				fPath  = R3_SYSTEM_BACKUP_LIST[fName][5];
			APP_FS.unlinkSync(fPath);
			delete R3_SYSTEM_BACKUP_LIST[fName];
			APP_FS.writeFileSync(APP_PATH + '/Configs/Backup/R3V2_BCK.R3V2', btoa(JSON.stringify(R3_SYSTEM_BACKUP_LIST)), 'utf-8');
			R3_BACKUP_MANAGER_LOAD(true);
		} catch (err) {
			R3_SYSTEM_LOG('error', 'R3ditor V2 - ERROR: Unable to delete backup file! <br>Reason: ' + err);
		};
	};
};