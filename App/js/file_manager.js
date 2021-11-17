/*
	*******************************************************************************
	R3ditor V2 - file_manager.js
	By TheMitoSan

	This file is responsible for storing functions to deal with OS file management
	(Loading, saving and etc).
	*******************************************************************************
*/
tempFn_R3_FILEMANAGER = {};
// Load files
tempFn_R3_FILEMANAGER['loadFile'] = function(extension, functionEval, returnFile, readMode, skipAppFs){
	if (functionEval !== undefined){
		if (extension === ''){
			extension = '.*';
		};
		if (readMode === undefined){
			readMode = 'hex';
		};
		R3_WEB_FILE_BRIDGE = '';
		document.getElementById('R3_FILE_LOAD_DOM').value = '';
		document.getElementById('R3_FILE_LOAD_DOM').files = null;
		document.getElementById('R3_FILE_LOAD_DOM').accept = extension;
		TMS.triggerClick('R3_FILE_LOAD_DOM');
		document.getElementById('R3_FILE_LOAD_DOM').onchange = function(){
			var hexFile, cFile = document.getElementById('R3_FILE_LOAD_DOM').files[0],
				fPath = cFile.path, loaderInterval;
			if (R3_WEBMODE === true){
				fPath = cFile;
			};
			if (skipAppFs === false || skipAppFs === undefined){
				hexFile = APP_FS.readFileSync(fPath, readMode);
			} else {
				hexFile = null;
			};
			loaderInterval = setInterval(function(){
					if (hexFile !== undefined && hexFile !== ''){
						if (returnFile !== true){
							if (cFile !== undefined){
								if (R3_WEBMODE === false){
									fPath = R3_tools.fixPath(cFile.path.toString());
								} else {
									fPath = cFile;
								};
								functionEval(fPath, hexFile);
							};
						} else {
							functionEval(document.getElementById('R3_FILE_LOAD_DOM').files[0], hexFile);
						};
						clearInterval(loaderInterval);
					} else {
						console.info('Waiting APP_FS...');
						if (R3_WEBMODE === true){
							hexFile = R3_WEB_FILE_BRIDGE;
						};
					};
				}, 100);
		};
	};
};
// Save files
tempFn_R3_FILEMANAGER['saveFile'] = function(filename, content, mode, ext, execNext){
	if (R3_WEBMODE === false){
		// Mode: utf-8, hex...
		var extension = '', location;
		if (ext !== undefined && ext !== ''){
			extension = ext;
		};
		document.getElementById('R3_FILE_SAVE_DOM').nwsaveas = filename;
		document.getElementById('R3_FILE_SAVE_DOM').accept = '.' + extension.replace('.', '');
		document.getElementById('R3_FILE_SAVE_DOM').onchange = function(){
			location = document.getElementById('R3_FILE_SAVE_DOM').value;
			if (location.replace(filename, '') !== ''){
				try {
					APP_FS.writeFileSync(location, content, mode);
				} catch (err) {
					R3_SYSTEM.log('error', 'ERROR - Unable to save file!\nReason: ' + err);
				};
			};
			document.getElementById('R3_FILE_SAVE_DOM').value = '';
			document.getElementById('R3_FILE_SAVE_DOM').accept = '';
			if (execNext !== undefined){
				execNext(location);
			};
		};
		TMS.triggerClick('R3_FILE_SAVE_DOM');
	} else {
		/*
			Original Code / Snippets:
			https://stackoverflow.com/questions/25354313/saving-a-uint8array-to-a-binary-file
			https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
		*/
		var downloadBlob, downloadURL, bType = 'application/octet-stream', convertHexFunction = function(hexString){
  			return new Uint8Array(hexString.match(/.{1,2}/g).map(function(byte){
  				return parseInt(byte, 16)
  			}));
  		};
		downloadBlob = function(data, fileName, mimeType){
			var blob = new Blob([data], {
					type: mimeType
				}),
				url = window.URL.createObjectURL(blob);
			downloadURL(url, fileName);
			setTimeout(function(){
				return window.URL.revokeObjectURL(url);
			}, 1000);
		};
		downloadURL = function(data, fileName){
			var a;
			a = document.createElement('a');
			a.href = data;
			a.download = fileName;
			document.body.appendChild(a);
			a.style = 'display: none';
			a.click();
			a.remove();
		};
		if (mode === 'utf-8'){
			bType = 'text/plain';
			downloadBlob(content, filename, bType);
		} else {
			downloadBlob(convertHexFunction(content), filename, bType);
		};
		if (execNext !== undefined){
			execNext(location);
		};
	};
};
// Download Files
tempFn_R3_FILEMANAGER['downloadFile'] = function(url, downloadFileName, execNext){
	if (R3_WEBMODE === false){
		var R3_FILE_DOWNLOAD_PG = R3_FILE_DOWNLOAD_LENGTH = R3_FILE_DOWNLOAD_PERCENT = 0, R3_FILE_DOWNLOAD_COMPLETE = false;
		if (APP_FS.existsSync(downloadFileName) === true){
			APP_FS.unlinkSync(downloadFileName);
		};
		const http = require('https'),
			file = APP_FS.createWriteStream(downloadFileName),
			request = http.get(url, function(response){
				response.pipe(file);
				response.on('data', function(chunk){
					R3_FILE_DOWNLOAD_STATUSCODE = response.statusCode;
					R3_FILE_DOWNLOAD_PG = R3_FILE_DOWNLOAD_PG + parseInt(chunk.length);
					R3_FILE_DOWNLOAD_LENGTH = parseInt(response.headers['content-length']);
					R3_FILE_DOWNLOAD_PERCENT = R3_tools.parsePercentage(R3_FILE_DOWNLOAD_PG, R3_FILE_DOWNLOAD_LENGTH);
				});
				file.on('finish', function(){
					R3_FILE_DOWNLOAD_COMPLETE = true;
					R3_FILE_DOWNLOAD_STATUSCODE = response.statusCode;
					if (R3_FILE_DOWNLOAD_STATUSCODE === 200){
						console.info('FILE - Download OK!\nStatus Code: ' + R3_FILE_DOWNLOAD_STATUSCODE);
					} else {
						console.warn('FILE - Download Failed!\nStatus Code: ' + R3_FILE_DOWNLOAD_STATUSCODE);
					};
					if (execNext !== undefined){
						execNext();
					};
				});
			});
	};
};
// Select Path
tempFn_R3_FILEMANAGER['selectPath'] = function(functionEval){
	if (R3_WEBMODE === false){
		if (functionEval !== undefined){
			TMS.triggerClick('R3_FOLDER_LOAD_DOM');
			document.getElementById('R3_FOLDER_LOAD_DOM').onchange = function(){
				const cFile = document.getElementById('R3_FOLDER_LOAD_DOM').files[0];
				if (cFile.path !== null && cFile.path !== undefined && cFile.path !== ''){
					functionEval(R3_tools.fixPath(cFile.path));
					document.getElementById('R3_FOLDER_LOAD_DOM').value = '';
					document.getElementById('R3_FOLDER_LOAD_DOM').accept = '';
				};
			};
		};
	} else {
		R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: This function is not available on web mode.');
	};
};
// Copy files / folders
tempFn_R3_FILEMANAGER['copyFiles'] = function(source, destiny, execNext){
	if (R3_WEBMODE === false){
		APP_FS.copy(source, destiny, function(err){
			if (err){
				R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to copy! <br>Reason: ' + err);
			} else {
				if (execNext !== undefined){
					execNext();
				} else {
					return true;
				};
			};
		});
	};
};
/*
	END
*/
const R3_fileManager = tempFn_R3_FILEMANAGER;
delete tempFn_R3_FILEMANAGER;