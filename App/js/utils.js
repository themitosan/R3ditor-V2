/*
	*******************************************************************************
	R3ditor V2 - utils.js
	By TemmieHeartz

	This is a script with some minor / misc functions inside R3V2.
	My life objective is to sort all info from this file to delete it later!
	*******************************************************************************
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
	R3_TEMP_zI = '00',
	R3_TEMP_CAM = '00',
	R3_TEMP_STAGE = '1',
	R3_TEMP_ROOM = '100',
	R3_TEMP_X = R3_TEMP_Y = R3_TEMP_Z = R3_TEMP_R = '0000';

/*
	Temp Objects
*/
tempFn_R3_XDELTA = {};
tempFn_R3_leosHub = {};
tempFn_R3_backupManager = {
	backupList: {}
};
/*
	ROFS
*/
// Extract Rofs individually 
function R3_ROFS_EXTRACT(){
	if (R3_SYSTEM.web.isBrowser === false){
		R3_fileManager.loadFile('.dat', function(rofsFile){
			process.chdir(R3_tools.getFilePath(rofsFile));
			R3_UTILS_CALL_LOADING('Extracting ROFS', 'Please wait while R3ditor V2 extracts ' + rofsFile, 50);
			R3_SYSTEM.externalSoftware.runExec(R3_SYSTEM.paths.tools + '/rofs.exe', [rofsFile], 3, rofsFile);
			var rofsTimer = setInterval(function(){
				if (R3_SYSTEM.externalSoftware.processRunning === true){
					console.info('Waiting ' + rofsFile + ' to extract...');
				} else {
					if (R3_SYSTEM.externalSoftware.processExitCode < 2){
						R3_UTILS_LOADING_CLOSE();
						process.chdir(R3_SYSTEM.paths.original);
						R3_SYSTEM.alert('Process complete!\nFile: ' + rofsFile);
						clearInterval(rofsTimer);
					} else {
						R3_UTILS_LOADING_UPDATE('Something went wrong while extracting ' + rofsFile + '!', 100);
						setTimeout(function(){
							R3_SYSTEM.reload();
						}, 5000);
					};
				};
			}, 150);
		});
	} else {
		R3_SYSTEM.web.webWarn();
	};
};
/*
	Xdelta Patcher
*/
// Load Files
tempFn_R3_XDELTA['loadFiles'] = function(mode){
	if (R3_SYSTEM.web.isBrowser === false){
		if (mode === 0){
			R3_fileManager.loadFile('.xdelta', function(xPath){
				R3_XDELTA_PATCH = xPath;
				R3_SYSTEM.log('log', 'R3ditor V2 - Xdelta: Patch File: ' + xPath);
				document.getElementById('R3_XDELTA_LBL_XFILE').title = xPath;
				document.getElementById('R3_XDELTA_LBL_XFILE').innerHTML = R3_tools.fixPathSize(xPath, 60);
			});
		} else {
			R3_fileManager.loadFile('.exe, .bin, .iso, .dat, .23, .raw', function(origFile){
				R3_XDELTA_ORIGINALFILE = origFile;
				R3_SYSTEM.log('log', 'R3ditor V2 - Xdelta: Target File: ' + origFile);
				document.getElementById('R3_XDELTA_LBL_ORIGFILE').title = origFile;
				document.getElementById('R3_XDELTA_LBL_ORIGFILE').innerHTML = R3_tools.fixPathSize(origFile, 60);
			});
		};
	};
};
// Apply Xdelta Patch
tempFn_R3_XDELTA['applyPatch'] = function(){
	if (R3_XDELTA_PATCH !== undefined && R3_XDELTA_ORIGINALFILE !== undefined && R3_SYSTEM.web.isBrowser === false){
		// Prepare R3 to make it!
		var R3_XDELTA_INTERVAL, R3_rearm = false, origName, newFilePath;
		if (R3_GAME.RE3_canRun !== false){
			R3_rearm = true;
			R3_GAME.RE3_canRun = false;
		};
		// Run Process
		process.chdir(R3_SYSTEM.paths.tools);
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Xdelta) Starting Process - Please wait...');
		R3_UTILS_CALL_LOADING('Xdelta Patcher', 'Please wait while Xdelta does his job...', 50);
		origName = R3_tools.getFileName(R3_XDELTA_ORIGINALFILE), origExt = R3_tools.getFileExtension(R3_XDELTA_ORIGINALFILE);
		R3_SYSTEM.externalSoftware.runExec(R3_SYSTEM.paths.tools + '/xdelta.exe', ['-d', '-s', R3_XDELTA_ORIGINALFILE, R3_XDELTA_PATCH , 'XDELTA_PATCH_FILE.bin']);
		R3_XDELTA_INTERVAL = setInterval(function(){
			if (R3_SYSTEM.externalSoftware.processRunning !== false){
				console.info('External - Waiting XDELTA...');
			} else {
				if (R3_SYSTEM.externalSoftware.processExitCode !== 0){
					R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: (Xdelta) Something went wrong while applying Xdelta Patch!');
					R3_UTILS_LOADING_UPDATE('Something went wrong while applying Xdelta Patch! R3V2 Will reload in 5 seconds...', 100);
					setTimeout(function(){
						R3_SYSTEM.reload();
					}, 5000);
				} else {
					// Finish Path
					R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (Xdelta) Process complete!');
					newFilePath = R3_SYSTEM.paths.tools + '/XDELTA_PATCH_FILE.bin', R3_XDELTA_newFile;
					if (R3_rearm === true){
						R3_GAME.RE3_canRun = true;
					};
					if (R3_MODULES.fs.existsSync(newFilePath) !== false){
						R3_XDELTA_newFile = R3_MODULES.fs.readFileSync(newFilePath, 'hex');
						R3_fileManager.saveFile(origName + '_patch', R3_XDELTA_newFile, 'hex', '');
						if (R3_MODULES.fs.existsSync(R3_SYSTEM.paths.tools + '/XDELTA_PATCH_FILE.bin') !== false){
							R3_MODULES.fs.unlinkSync(R3_SYSTEM.paths.tools + '/XDELTA_PATCH_FILE.bin');
						};
						R3_UTILS_LOADING_CLOSE();
					};
				};
				process.chdir(R3_SYSTEM.paths.original);
				clearInterval(R3_XDELTA_INTERVAL);
			};
		}, 100);
	};
};
// Finish
const R3_XDELTA = tempFn_R3_XDELTA;
delete tempFn_R3_XDELTA;
/*
	OBJ Patcher

	Original patch was created by Biohazard España
	Twitter: https://twitter.com/biohazardEsp
*/
// Load File
function R3_OBJ_PATCHER(){
	if (R3_SYSTEM.web.isBrowser === false){
		R3_fileManager.loadFile('.obj', function(objFile, tempObj){
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
				OBJ_arquivoBruto = '# OBJ Converted using ' + R3_SYSTEM.appTitle + '\n' + OBJ_arquivoBruto.slice(1, OBJ_arquivoBruto.length);
				R3_fileManager.saveFile(R3_tools.getFileName(objFile).toLowerCase().replace('.obj', '') + '_converted', OBJ_arquivoBruto, 'utf-8', 'obj');
			} else {
				R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: (OBJ Patcher) This file doesn\'t need patching!');
				R3_SYSTEM.alert('INFO - This file doesn\'t need patching!');
			};
		}, undefined, 'utf-8');
	} else {
		R3_SYSTEM.web.webWarn();
	};
};
/*
	File generator (Filegen)
*/
// Select BG file
function R3_FILEGEN_selectBG(mode){
	if (R3_SYSTEM.web.isBrowser === false){
		if (mode === 0){
			R3_fileManager.loadFile('.png, .jpg, .jpeg, .bmp, .webp', function(newBgFile){
				var fileFix = '';
				if (R3_SYSTEM.web.isBrowser === true){
					fileFix = 'file://';
				};
				TMS.css('R3_FILEGEN_RENDERAREA_BG', {'background-image': 'url(\'' + fileFix + newBgFile + '\')'});
			});
		} else {
			TMS.css('R3_FILEGEN_RENDERAREA_BG', {'background-image': 'url(\'\')'});
		};
	};
};
// Update BG filters
function R3_FILEGEN_BG_UPDATE_FILTERS(){
	if (R3_SYSTEM.web.isBrowser === false){
		const bgHUE = parseInt(document.getElementById('R3_FILEGEN_RANGE_BG_HUE').value),
			bgSat = parseInt(document.getElementById('R3_FILEGEN_RANGE_BG_SAT').value),
			bgSize = parseInt(document.getElementById('R3_FILEGEN_RANGE_BG_SIZE').value),
			bgBlur = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_BLUR').value),
			bgSepia = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_SEP').value),
			bgInvert = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_INV').value),
			bgOpacity = parseFloat(document.getElementById('R3_FILEGEN_RANGE_BG_OPACITY').value);
		// Update Labels
		document.getElementById('R3_FILEGEN_LBL_BG_HUE').innerHTML = bgHUE;
		document.getElementById('R3_FILEGEN_LBL_BG_SIZE').innerHTML = bgSize;
		document.getElementById('R3_FILEGEN_LBL_BG_BLUR').innerHTML = bgBlur;
		document.getElementById('R3_FILEGEN_LBL_BG_SAT').innerHTML = R3_tools.parsePercentage(bgSat, 30);
		document.getElementById('R3_FILEGEN_LBL_BG_SEPIA').innerHTML = R3_tools.parsePercentage(bgSepia, 1);
		document.getElementById('R3_FILEGEN_LBL_BG_INVERT').innerHTML = R3_tools.parsePercentage(bgInvert, 1);
		document.getElementById('R3_FILEGEN_LBL_BG_OPACITY').innerHTML = R3_tools.parsePercentage(bgOpacity, 1);
		// Update BG
		TMS.css('R3_FILEGEN_RENDERAREA_BG', {'background-size': 'auto ' + bgSize + '%', 'opacity': bgOpacity, 'filter': 'blur(' + bgBlur + 'px) hue-rotate(' + bgHUE + 'deg) saturate(' + bgSat + ') invert(' + bgInvert + ') sepia(' + bgSepia + ')'});
	};
};
// Select Text color
function R3_FILEGEN_selectTextColor(mode){
	for (var i = 0; i < 4; i++){
		document.getElementById('R3_FILEGEN_color_' + i).checked = false;
	};
	document.getElementById('R3_FILEGEN_color_' + mode).checked = true;
	FILEGEN_currentColor = mode;
	R3_FILEGEN_renderText(true);
};
// Render Text
function R3_FILEGEN_renderText(renderOnFilegen, otherCanvas, textRender){
	if (R3_SYSTEM.web.is_SAFARI === false && R3_SYSTEM.web.is_IE === false){
		var x_offset = y_offset = textInvert = c = 0, textToRender, invertCheck, text, browserName, FG_HTML_TEMPLATE = '';
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
						var distance, dic;
						if (FILEGEN_currentFont === 'RE1'){
							dic = FG_DICIONARIO[text[c]][0];
							distance = parseInt(FG_DICIONARIO[text[c]][1]) + x_offset;
						};
						if (FILEGEN_currentFont === 'RE3'){
							dic = FG_RE3_DICIONARIO[text[c]][0];
							distance = parseInt(FG_RE3_DICIONARIO[text[c]][1]) + x_offset;
						};
						FG_HTML_TEMPLATE = FG_HTML_TEMPLATE + '<img ondragstart="return false;" src="img/fonts/chars_' + FILEGEN_currentFont + '_' + FILEGEN_currentColor +
											  '.webp" style="clip-path: inset(' + dic + '); position: absolute; left: ' + distance + 'px;top: ' + y_offset + 'px; filter: invert(' + textInvert + ');">';
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
			// Render
			if (renderOnFilegen === true){
				TMS.append('R3_FILEGEN_RENDERAREA', FG_HTML_TEMPLATE);
				TMS.append('R3_FILEGEN_RENDERAREA_BIG', FG_HTML_TEMPLATE);
			} else {
				TMS.append(otherCanvas, FG_HTML_TEMPLATE);
			};
		};
	} else {
		// Unable to rennder due CSS madness
		if (R3_SYSTEM.web.is_SAFARI === true){
			browserName = 'Apple Safari';
		};
		if (R3_SYSTEM.web.is_IE === true){
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
	if (location !== undefined && text !== undefined && font !== undefined && interval !== undefined && R3_SYSTEM.web.is_SAFARI === false){
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
	if (R3_SETTINGS.SETTINGS_USE_DISCORD !== false && rpcReady !== false && R3_SYSTEM.web.isBrowser === false && R3_SETTINGS.R3_NW_ARGS_DISABLE_DISCORD === false){
		if (R3_GAME.gameRunning !== false){
			RPC.setActivity({'details': 'Running RE3', 'state': 'On ' + RDT_locations[R3_LIVESTATUS.currentRDT][0], 'largeImageKey': 'app_logo', 'maxpartysize': 0});
		} else {
			RPC.setActivity({'details': det, 'state': stat, 'largeImageKey': atob(special_day_02[3] + '='), 'maxpartysize': 0});
		};
	};
};
// Clear Activity
function R3_DISC_clearActivity(){
	if (R3_SETTINGS.SETTINGS_USE_DISCORD !== false && rpcReady !== false && R3_SYSTEM.web.isBrowser === false && R3_SETTINGS.R3_NW_ARGS_DISABLE_DISCORD === false){
		RPC.clearActivity();
	};
};
// Init discord API
function R3_DISCORD_INIT(){
	if (R3_SYSTEM.web.isBrowser === false && R3_SETTINGS.R3_NW_ARGS_DISABLE_DISCORD === false){
		RPC = new R3_MODULES.discordRPC.Client({transport: 'ipc'});
		if (navigator.onLine !== false){
			var loginRPC = RPC.login({clientId: atob(special_day_02[0]), clientSecret: atob(special_day_02[1] + special_day_02[2])});
			RPC.on('ready', function(){
				rpcReady = true;
				discUserName = RPC.user.username;
				R3_DISC_setActivity('Main menu', 'Idle');
			});
		} else {
			R3_SYSTEM.log('warn', 'WARN - You are offline!\nDiscord options will be disabled.');
		};
	} else {
		if (R3_NW_ARGS_DISABLE_DISCORD === true){
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Disabling Discord Rich Presence...');
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
	R3_SYSTEM.log('log', 'R3ditor V2 - Copy Position from ' + whr + ' (<font class="COLOR_X">X: <font class="user-can-select">' + R3_TEMP_X.toUpperCase() + 
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
	R3_SYSTEM.log('log', 'R3ditor V2 - Paste Position to ' + whr + ' (<font class="COLOR_X">X: <font class="user-can-select">' + R3_TEMP_X.toUpperCase() + 
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
	if (R3_SYSTEM.web.isBrowser === false){
		ev.preventDefault();
		if (ev.dataTransfer.items){
			for (var i = 0; i < ev.dataTransfer.items.length; i++){
				if (ev.dataTransfer.items[i].kind === 'file' && R3_MENU_CURRENT === 10){
					var file = ev.dataTransfer.items[i].getAsFile();
					if (R3_MODULES.fs.existsSync(R3_MOD.path + '/' + R3_RDT_PREFIX_EASY + '/RDT') === true && R3_MODULES.fs.existsSync(R3_MOD.path + '/' + R3_RDT_PREFIX_HARD + '/RDT') === true){
						R3_RDT_checkMap(file.path);
					} else {
						R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to find output folders! <br>Make sure to extract the game first before using this option.');
					};
				} else {
					console.warn('Skipping file drop...');
				};
			};
		};
	} else {
		R3_SYSTEM.web.webWarn();
	};
};
// Process Drop File
function R3_RDT_checkMap(file){
	if (file !== undefined && file !== '' && R3_SYSTEM.web.isBrowser === false){
		var fileExt = R3_tools.getFileExtension(file), fileName = R3_tools.getFileName(file), msgError = '', tempFile, impEasy, impHard;
		if (fileExt.toUpperCase() === 'RDT'){
			// Check file name
			if (fileName.length === 4){
				impEasy = document.getElementById('R3_RDT_IMPORT_EASY').checked;
				impHard = document.getElementById('R3_RDT_IMPORT_HARD').checked;
				if (impEasy === false && impHard === false){
					msgError = 'WARN: You need select where you want to import!';
					R3_SYSTEM.log('warn', 'R3ditor V2 - ' + msgError);
					R3_SYSTEM.alert(msgError);
				} else {
					tempFile = R3_MODULES.fs.readFileSync(file, 'hex');
					try {
						if (impEasy === true){
							R3_MODULES.fs.writeFileSync(R3_MOD.path + '/' + R3_RDT_PREFIX_EASY + '/RDT/' + fileName.toUpperCase() + '.RDT', tempFile, 'hex');
							R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Importing map ' + fileName.toUpperCase() + ' (Easy)');
						};
						if (impHard === true){
							R3_MODULES.fs.writeFileSync(R3_MOD.path + '/' + R3_RDT_PREFIX_HARD + '/RDT/' + fileName.toUpperCase() + '.RDT', tempFile, 'hex');
							R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Importing map ' + fileName.toUpperCase() + ' (Hard)');
						};
						R3_SYSTEM.alert('INFO - Process successful!\n\nMap: ' + fileName.toUpperCase() + '\nLocation: ' + RDT_locations[fileName.toUpperCase()][0] + ', ' + RDT_locations[fileName.toUpperCase()][1]);
					} catch (err) {
						msgError = 'ERROR: Something went wrong while importing map!';
						R3_SYSTEM.log('error', 'R3ditor V2 - ' + msgError + ' <br>Reason: ' + err);
						R3_SYSTEM.alert(msgError);
					};
				};
			} else {
				msgError = 'WARN: This file aren\'t from RE3!';
				R3_SYSTEM.log('warn', 'R3ditor V2 - ' + msgError);
				R3_SYSTEM.alert(msgError);
			};
		} else {
			msgError = 'WARN: This is not a valid map file!';
			R3_SYSTEM.log('warn', 'R3ditor V2 - ' + msgError);
			R3_SYSTEM.alert(msgError);
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
		var colorR = R3_tools.fixVars(parseInt(colorArray[0]).toString(16), 2),
			colorG = R3_tools.fixVars(parseInt(colorArray[1]).toString(16), 2),
			colorB = R3_tools.fixVars(parseInt(colorArray[2]).toString(16), 2);
		document.getElementById('R3_COLOR_PICKER').value = '#' + colorR + colorG + colorB;
	};
	TMS.triggerClick('R3_COLOR_PICKER');
	document.getElementById('R3_COLOR_PICKER').onchange = function(){
		var newColor = document.getElementById('R3_COLOR_PICKER').value;
		if (hexMode === false){
			var tempColor = newColor.slice(1).match(/.{2,2}/g),
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
	if (R3_SYSTEM.web.isBrowser === true){
		var check = R3_SYSTEM.confirm('WARN: This option will clear all cached images / R3V2 settings from your browser!\n\nYou want to continue?');
		if (check === true && R3_SYSTEM.web.isBrowser === true){
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
	R3_tools.cleanHexFromInput('R3_ITEM_DATABASE_SEARCH');
	var itemInput = document.getElementById('R3_ITEM_DATABASE_SEARCH').value;
	if (itemInput.length === 2){
		document.getElementById('R3_ITEM_DATABASE_SEARCH').value = '';
		if (DATABASE_ITEM[itemInput] !== undefined){
			document.getElementById('R3_ITEM_DATABASE_ICON').src = 'img/items/details/' + itemInput + '.webp';
			document.getElementById('R3_ITEM_DATABASE_TITLE').innerHTML = DATABASE_ITEM[itemInput][0];
			document.getElementById('R3_ITEM_DATABASE_DETAILS').innerHTML = DATABASE_ITEM[itemInput][1].replace(DATABASE_ITEM[itemInput][0] + '<br>', '');
			document.getElementById('R3_ITEM_DATABASE_SEARCH').focus();
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: (Item Database) Unable to find item <font class="user-can-select">' + itemInput.toUpperCase() + '</font>!');
		};
	};
};

/*
	Backup Manager Functions
*/
// Backup File R3_backupManager.backupFile
tempFn_R3_backupManager['backupFile'] = function(data, fileName, extension, backupPath, type){
	if (fileName !== undefined && backupPath !== undefined && extension !== undefined && R3_SYSTEM.web.isBrowser === false){
		var cDate = R3_tools.getDate(), BCK_fName = fileName + '_' + cDate + extension, bckPath = backupPath + '/' + BCK_fName;
		try {
			R3_MODULES.fs.writeFileSync(bckPath, data, 'hex');
			// End
			R3_SYSTEM.log('separator');
			R3_backupManager.insertItem(BCK_fName, fileName, extension.toLowerCase(), cDate, bckPath, type);
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Backup Complete! <br>Path: <font class="user-can-select">' + backupPath + BCK_fName + '</font>');
			R3_SYSTEM.log('separator');
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to make backup! <br>Reason: ' + err);
			R3_SYSTEM.alert('ERROR: Unable to make backup!\nReason: ' + err);
		};
	};
};
// Load Backup Manager
tempFn_R3_backupManager['openManager'] = function(openBackupList){
	if (R3_SYSTEM.web.isBrowser === false){
		var bckList = R3_SYSTEM.paths.mod + '/Configs/Backup/R3V2_BCK.R3V2';
		if (R3_MODULES.fs.existsSync(bckList) === false){
			try {
				R3_MODULES.fs.writeFileSync(bckList, 'e30=', 'utf-8');
			} catch (err) {
				R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to gerenate backup list! <br>Reason: ' + err);
			};
		};
		// Load backup file
		try {
			R3_backupManager.backupList = JSON.parse(atob(R3_MODULES.fs.readFileSync(bckList, 'utf-8')));
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to load backup list! <br>Reason: ' + err);
		};
		if (openBackupList === true){
			R3_DESIGN_renderBackupManager();
		};
	};
};
// Append items on backup manager
tempFn_R3_backupManager['insertItem'] = function(fileName, originalFileName, type, date, path, editorName){
	if (R3_SYSTEM.web.isBrowser === false){
		var ext = type.replace('.', '');
		R3_backupManager.backupList[fileName] = [originalFileName, R3_LATEST_FILE_TYPES[R3_BACKUP_MANAGER_EDITORS[ext][0]], editorName, R3_tools.readDate(date, 0), R3_tools.readDate(date, 1), path, ext];
		// Save List
		try {
			R3_MODULES.fs.writeFileSync(R3_SYSTEM.paths.mod + '/Configs/Backup/R3V2_BCK.R3V2', btoa(JSON.stringify(R3_backupManager.backupList)), 'utf-8');
			R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Updating backup list...');
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to update backup list! <br>Reason: ' + err);
		};
	};
};
// Restore backup file
tempFn_R3_backupManager['restoreFile'] = function(fileId){
	if (R3_SYSTEM.web.isBrowser === false && fileId !== undefined){
		var restoreOk = false, conCheck, tempHex, newFilePath, fArray = Object.keys(R3_backupManager.backupList), fName = fArray[fileId],
			mName = R3_backupManager.backupList[fName][0],
			fPath = R3_backupManager.backupList[fName][5],
			fExt  = R3_backupManager.backupList[fName][6];
		try {
			// RDT Files
			if (fExt === 'rdt'){
				// Easy Mode
				conCheck = R3_SYSTEM.confirm('Confirm: Click OK to restore this file on Easy mode (' + R3_RDT_PREFIX_EASY + ')');
				if (conCheck === true){
					restoreOk = true;
					tempHex = R3_MODULES.fs.readFileSync(fPath, 'hex');
					newFilePath = R3_SYSTEM.paths.mod + '/Assets/' + R3_RDT_PREFIX_EASY + '/RDT/' + R3_backupManager.backupList[fName][0] + '.RDT';
					R3_MODULES.fs.writeFileSync(newFilePath, tempHex, 'hex');
					R3_SYSTEM.log('separator');
					R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Process complete! <br>Path:<font class="user-can-select">' + newFilePath + '</font>');
					R3_SYSTEM.alert('INFO: Process complete! (' + R3_RDT_PREFIX_EASY + ')');
				};
				// Hard Mode
				conCheck = R3_SYSTEM.confirm('Confirm: Click OK to restore this file on Hard mode (' + R3_RDT_PREFIX_HARD + ')');
				if (conCheck === true){
					restoreOk = true;
					tempHex = R3_MODULES.fs.readFileSync(fPath, 'hex');
					newFilePath = R3_SYSTEM.paths.mod + '/Assets/' + R3_RDT_PREFIX_HARD + '/RDT/' + R3_backupManager.backupList[fName][0] + '.RDT';
					R3_MODULES.fs.writeFileSync(newFilePath, tempHex, 'hex');
					R3_SYSTEM.log('separator');
					R3_SYSTEM.log('log', 'R3ditor V2 - INFO: Process complete! <br>Path:<font class="user-can-select">' + newFilePath + '</font>');
					R3_SYSTEM.alert('INFO: Process complete! (' + R3_RDT_PREFIX_HARD + ')');
				};
				// Actions after restoring map
				if (R3_RDT_mapName === mName && restoreOk === true){
					R3_SHOW_MENU(10);
					setTimeout(function(){
						R3_RDT_LOAD(R3_fileManager.originalFilename, true);
					}, 100);
				};
			};
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to restore backup file! <br>Reason: ' + err);
		};
	};
};
// Delete backup file R3_backupManager.deleteFile
tempFn_R3_backupManager['deleteFile'] = function(fileId){
	if (R3_SYSTEM.web.isBrowser === false && fileId !== undefined){
		try {
			var fArray = Object.keys(R3_backupManager.backupList), fName = fArray[fileId], fPath = R3_backupManager.backupList[fName][5];
			R3_MODULES.fs.unlinkSync(fPath);
			delete R3_backupManager.backupList[fName];
			R3_MODULES.fs.writeFileSync(R3_SYSTEM.paths.mod + '/Configs/Backup/R3V2_BCK.R3V2', btoa(JSON.stringify(R3_backupManager.backupList)), 'utf-8');
			R3_backupManager.openManager(true);
		} catch (err) {
			R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to delete backup file! <br>Reason: ' + err);
		};
	};
};
// End
const R3_backupManager = tempFn_R3_backupManager;
delete tempFn_R3_backupManager;

/*
	Leo's Hub
*/
// Open window R3_leosHub_openWindow
tempFn_R3_leosHub['openWindow'] = function(){
	if (R3_SYSTEM.web.isBrowser === false && R3_MOD.enableMod === true){
		var HTML_TEMPLATE = '', cPath = R3_SYSTEM.paths.mod + '/Assets/DATA/PLD', tempFileList = R3_MODULES.fs.readdirSync(cPath), toolCounter = 0, noToolError = function(where, toolName){
				document.getElementById(where).innerHTML = '<br><div class="align-center"><i>Unable to generate list!<br>Please, insert <u>' + toolName + '</u> location on settings and try again.</i></div>';
			};
		// RE3MV
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.R3_RE3MV_PATH) === true){
			toolCounter++;
			tempFileList.forEach(function(cItem){
				if (cItem.indexOf('.PLD') !== -1){
					HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_leosHub_item R3_leosHub_RE3MV" onclick="R3_leosHub.openFile(\'' + cPath + '/' + cItem + '\', 0);">' +
									'<img src="img/icons/Leo/RE3MV.webp" class="right R3_leosHub_RE3MV_ICON" alt="R3_leos_MV">' +
									'File: <font class="monospace mono_xyzr" title="' + cPath + '/' + cItem + '">' + cItem + '</font><br>' +
									'Size: <font class="monospace mono_xyzr">' + R3_tools.getFileSize(cPath + '/' + cItem, 1) + ' KB</font></div>';
				};
			});
			document.getElementById('R3_leosHub_RE3MV_LIST').innerHTML = HTML_TEMPLATE;
			HTML_TEMPLATE = '';
		} else {
			noToolError('R3_leosHub_RE3MV_LIST', 'RE3MV');
		};
		// RE3PLWE
		if (R3_MODULES.fs.existsSync(R3_SETTINGS.R3_RE3PLWE_PATH) === true){
			toolCounter++;
			tempFileList.forEach(function(cItem){
				if (cItem.indexOf('.PLW') !== -1){
					HTML_TEMPLATE = HTML_TEMPLATE + '<div class="R3_leosHub_item R3_leosHub_RE3PLWE" onclick="R3_leosHub.openFile(\'' + cPath + '/' + cItem + '\', 1);">' +
									'<img src="img/icons/Leo/RE3PLWE.webp" class="right R3_leosHub_RE3PLWE_ICON" alt="R3_leos_PLW">' +
									'File: <font class="monospace mono_xyzr" title="' + cPath + '/' + cItem + '">' + cItem + '</font><br>' +
									'Size: <font class="monospace mono_xyzr">' + R3_tools.getFileSize(cPath + '/' + cItem, 1) + ' KB</font></div>';
				};
			});
			document.getElementById('R3_leosHub_RE3PLWE_LIST').innerHTML = HTML_TEMPLATE;
		} else {
			noToolError('R3_leosHub_RE3PLWE_LIST', 'RE3PLWEditor');
		};
		/*
			End
		*/
		if (toolCounter > 0){
			R3_MINIWINDOW.open(24, 'center');
		} else {
			R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: Unable to open Leo\'s Hub because there isn\'t any tool available!');
		};
	};
};
// Open File R3_leosHub_openFile
tempFn_R3_leosHub['openFile'] = function(fPath, mode){
	if (R3_SYSTEM.web.isBrowser === false){
		var cExec = R3_SETTINGS.R3_RE3MV_PATH;
		if (mode === 1){
			cExec = R3_SETTINGS.R3_RE3PLWE_PATH;
		};
		// End
		R3_SYSTEM.externalSoftware.runExec(cExec, [fPath], 2);
	};
};
// End
const R3_leosHub = tempFn_R3_leosHub;
delete tempFn_R3_leosHub;