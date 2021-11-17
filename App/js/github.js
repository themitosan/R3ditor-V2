/*
	*******************************************************************************
	R3ditor V2 - github.js
	By TheMitoSan

	This file is responsible for GitHub Updater - a simple tool that allows the
	user update R3V2 from a GitHub Branch. 
	*******************************************************************************
*/
// Consts
const R3_GITHUB_FETCH_URL = 'https://api.github.com/repos/themitosan/R3ditor-V2/';
// Variables
var R3_UPDATER_INTERVAL,
	R3_UPDATER_LOCK = false,
	R3_UPDATER_RUNNING = false,
	R3_GITHUB_BRANCHES_LIST = {},
	R3_GITHUB_CURRENT_BRANCH = {};
// Objects
tempFn_R3_UPDATER = {};
/*
	Functions
*/
// Get branches list R3_UPDATER_GET_BRANCHES
tempFn_R3_UPDATER['getUpdates'] = function(){
	if (R3_WEBMODE === false && INT_VERSION.indexOf('DEV_VERSION') !== -1 && R3_ELECTRON === undefined){
		var HTML_TEMPLATE = '';
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (GitHub) Fetching branches - Please wait...');
		fetch(R3_GITHUB_FETCH_URL + 'branches').then(resp => resp.json()).then(function(dat){
			R3_GITHUB_BRANCHES_LIST = dat;
			Object.keys(R3_GITHUB_BRANCHES_LIST).forEach(function(cItem, cIndex){
				HTML_TEMPLATE = HTML_TEMPLATE + '<option value="' + cItem + '">' + R3_GITHUB_BRANCHES_LIST[cItem].name + '</option>';
			});
			INCLUDE_GITHUB_BRANCHES = HTML_TEMPLATE;
			document.getElementById('R3_UPDATER_CURRENT_BRANCH').innerHTML = INCLUDE_GITHUB_BRANCHES;
			R3_UPDATER.getCommits();
		});
	};
};
// Get commits list R3_UPDATER_GET_COMMITS
tempFn_R3_UPDATER['getCommits'] = function(){
	if (R3_WEBMODE === false && INT_VERSION.indexOf('DEV_VERSION') !== -1){
		var cBranch = document.getElementById('R3_UPDATER_CURRENT_BRANCH').value, parseTimestamp = function(str){
				const day = str.slice(0, str.indexOf('T')), time = str.slice(parseInt(str.indexOf('T') + 1)).replace('Z', '');
				return day + ' - ' + time;
			};
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (GitHub) Reading latest commit from ' + R3_GITHUB_BRANCHES_LIST[cBranch].name + ' - Please wait...');
		fetch(R3_GITHUB_FETCH_URL + 'branches/' + R3_GITHUB_BRANCHES_LIST[cBranch].name).then(resp => resp.json()).then(function(dat){
			R3_GITHUB_CURRENT_BRANCH = dat;
			document.getElementById('R3_UPDATER_COMMIT_SHA').innerHTML = R3_GITHUB_CURRENT_BRANCH.commit.sha;
			document.getElementById('R3_UPDATER_COMMIT_URL').href = R3_GITHUB_CURRENT_BRANCH.commit.html_url;
			document.getElementById('R3_UPDATER_AUTHOR_ID').innerHTML = R3_GITHUB_CURRENT_BRANCH.commit.author.id;
			document.getElementById('R3_UPDATER_COMMIT_SHA').title = 'SHA: ' + R3_GITHUB_CURRENT_BRANCH.commit.sha;
			document.getElementById('R3_UPDATER_COMMIT_AUTHOR_PIC').src = R3_GITHUB_CURRENT_BRANCH.commit.author.avatar_url;
			document.getElementById('R3_UPDATER_COMMIT_MESSAGE').innerHTML = R3_GITHUB_CURRENT_BRANCH.commit.commit.message;
			document.getElementById('R3_UPDATER_COMMIT_AUTHOR').innerHTML = R3_GITHUB_CURRENT_BRANCH.commit.commit.author.name;
			document.getElementById('R3_UPDATER_COMMIT_DATE').innerHTML = parseTimestamp(R3_GITHUB_CURRENT_BRANCH.commit.commit.author.date);
			document.getElementById('R3_UPDATER_COMMIT_AUTHOR_PIC').title = R3_GITHUB_CURRENT_BRANCH.commit.commit.author.name + '\'s Avatar';
			// End
			if (R3_MINI_WINDOW_DATABASE[22][5] === false){
				R3_MINIWINDOW.open(22, 'center');
			};
		});
	};
};
/*
	Start Updater R3_UPDATER_START

	Reload app: chrome.runtime.reload();
	https://github.com/nwjs/nw.js/issues/149#issuecomment-299653483
*/
tempFn_R3_UPDATER['startUpdate'] = function(){
	if (R3_WEBMODE === false && INT_VERSION.indexOf('DEV_VERSION') !== -1){
		try {
			var c = 0;
			R3_UPDATER_RUNNING = true;
			R3_UPDATER_INTERVAL = setInterval(function(){
				if (R3_UPDATER_LOCK === false){
					R3_UPDATER.execAction(c);
					c++;
				} else {
					console.info('UPDATER - Waiting Step ' + c + '...');
				};
			}, 100);
		} catch (err) {
			R3_SYSTEM.alert('ERROR: Unable to update R3V2!\n' + err);
		};
	};
};
// Updater Actions R3_UPDATER_ACTION
tempFn_R3_UPDATER['execAction'] = function(actionId){
	if (R3_WEBMODE === false && INT_VERSION.indexOf('DEV_VERSION') !== -1 && R3_UPDATER_RUNNING === true && actionId !== undefined){
		console.info('Running Step ' + actionId);
		R3_UPDATER_LOCK = true;
		var sysInterval, ACTION_updateCrash = function(reason){
			clearInterval(sysInterval);
			clearInterval(R3_UPDATER_INTERVAL);
			R3_SYSTEM.alert('ERROR: Unable to execute update!\nReason: ' + reason + '\n\nR3ditor V2 will restart.');
			chrome.runtime.reload();
		};
		// 0 - Initial preparations
		if (actionId === 0){
			R3_MENU_EXIT();
			R3_UTILS_CALL_LOADING('Updating R3V2', 'R3ditor V2 is now stopping internal timers to begin update process...', 4);
			document.getElementById('R3_UPDATER_CURRENT_BRANCH').disabled = 'disabled';
			R3_DESIGN_OPEN_CLOSE_LATEST(1);
			R3_LIVESTATUS_CLOSE_BAR();
			R3_MINIWINDOW.close('all');
			clearInterval(MEM_JS_updatePosTimer);
			clearInterval(R3_CHECK_GAME_INTERVAL);
			clearInterval(R3_CHECK_ifStillOpenInterval);
			R3_KB_ENABLE_SHORTCUTS = false;
			if (RE3_RUNNING === true){
				R3_killExternalSoftware(RE3_PID);
				RE3_RUNNING = false;
			};
			R3_UPDATER_LOCK = false;
		};
		// 1 - Checking files / paths
		if (actionId === 1){
			R3_UTILS_CALL_LOADING('Updating R3V2', 'Checking folders...', 10);
			if (APP_FS.existsSync(APP_PATH + '/Update') !== true){
				APP_FS.mkdirSync(APP_PATH + '/Update');
			};
			if (APP_FS.existsSync(APP_PATH + '/Update/Update.zip') === true){
				APP_FS.unlinkSync(APP_PATH + '/Update/Update.zip');
			};
			R3_UPDATER_LOCK = false;
		};
		// 2 - Getting package download link
		if (actionId === 2){
			var cBranch = document.getElementById('R3_UPDATER_CURRENT_BRANCH').value;
			R3_UTILS_LOADING_UPDATE('Downloading files from ' + R3_GITHUB_BRANCHES_LIST[cBranch].name + ' branch - Please wait', 20);
			R3_fileManager.downloadFile('https://codeload.github.com/themitosan/R3ditor-V2/zip/refs/heads/' + R3_GITHUB_BRANCHES_LIST[cBranch].name, APP_PATH + '/Update/Update.zip', function(){
				R3_UPDATER_LOCK = false;
			});
		};
		// 3 - Check if download file is OK
		if (actionId === 3){
			if (APP_FS.existsSync(APP_PATH + '/Update/Update.zip') !== true){
				ACTION_updateCrash('Unable to find download file!');
			} else {
				R3_UPDATER_LOCK = false;
			};
		};
		// 4 - Extract all data from file
		if (actionId === 4){
			R3_UTILS_LOADING_UPDATE('Extracting update files...', 40);
			var external7zPath = APP_EXEC_PATH + '/Tools/7z/64/7za.exe';
			if (process.arch !== 'x64'){
				external7zPath = APP_EXEC_PATH + '/Tools/7z/32/7z.exe';
			};
			R3_runExec(external7zPath, ['x', APP_PATH + '/Update/Update.zip', '-o' + APP_PATH + '/Update/', '-y']);
			sysInterval = setInterval(function(){
				if (EXTERNAL_APP_RUNNING === false){
					R3_UPDATER_LOCK = false;
					clearInterval(sysInterval);
				} else {
					console.info('Waiting for 7z...');
				};
			}, 100);
		};
		// 5 - Copy all files
		if (actionId === 5){
			R3_UTILS_LOADING_UPDATE('Moving extracted files - Please wait...', 60);
			var cBranch =  document.getElementById('R3_UPDATER_CURRENT_BRANCH').value,
				fPath = 'R3ditor-V2-' + R3_GITHUB_BRANCHES_LIST[cBranch].name;
			R3_fileManager.copyFiles(APP_PATH + '/Update/' + fPath + '/', APP_EXEC_PATH, function(){
				R3_UPDATER_LOCK = false;
			});
		};
		// 6 - Removing leftovers
		if (actionId === 6){
			R3_UTILS_LOADING_UPDATE('Cleaning leftover files - Please wait...', 80);
			APP_FS.remove(APP_PATH + '/Update/', function(msg){
				if (msg !== null){
					ACTION_updateCrash('Unable to remove leftover files!\n' + msg);
				} else {
					R3_UPDATER_LOCK = false;
				};
			});
		};
		// 7 - Reload R3V2
		if (actionId === 7){
			R3_UTILS_LOADING_UPDATE('Process complete!', 100);
			R3_SYSTEM.alert('INFO: Process complete!\nAfter closing this message, R3V2 will reload!');
			chrome.runtime.reload();
			clearInterval(sysInterval);
			clearInterval(R3_UPDATER_INTERVAL);
			R3_UPDATER_LOCK = false;
		};
	} else {
		R3_UPDATER_LOCK = false;
	};
};
/*
	END
*/
const R3_UPDATER = tempFn_R3_UPDATER;
delete tempFn_R3_UPDATER;