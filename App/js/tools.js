/*
	*******************************************************************************
	R3ditor V2 - tools.js
	By TemmieHeartz

	This file is responsible for storing tools that can be used to manipulate
	strings, convert values and etc.
	*******************************************************************************
*/
tempFn_R3_TOOLS = {};
/*
	Get file name
	Original Code: https://stackoverflow.com/questions/857618/javascript-how-to-extract-filename-from-a-file-input-control
*/
tempFn_R3_TOOLS['getFileName'] = function(filePath){
	var tempTxt, res = '';
	if (filePath !== '' && filePath !== undefined){
		if (filePath.indexOf('(') !== -1){
			tempTxt = filePath.replace(/^(.*[/\\])?/, '').replace(/(\.[^.]*)$/, '');
			res = tempTxt;
			if (tempTxt.indexOf('(') !== -1){
				res = tempTxt.slice(0, tempTxt.indexOf('('));
			};
		} else {
			res = filePath.replace(/^(.*[/\\])?/, '').replace(/(\.[^.]*)$/, '');
		};
	};
	return res;
};
// Get File Extension
tempFn_R3_TOOLS['getFileExtension'] = function(file){
	var res = '';
	if (file !== '' && file !== undefined){
		if (R3_SYSTEM.web.isBrowser === false){
			res = R3_MODULES.path.extname(file).slice(1);
		} else {
			res = file.split('.').pop();
		};
	};
	return res;
};
// Format Hex values to string properly 
tempFn_R3_TOOLS['solveHex'] = function(hex){
	var res = '';
	if (hex !== '' && hex !== undefined){
		res = hex.replace(new RegExp(' ', 'g'), '').toLowerCase();
	};
	return res;
};
// Get file name
tempFn_R3_TOOLS['getFilePath'] = function(fileName){
	var res = '';
	if (fileName !== undefined && fileName !== ''){
		res = R3_tools.fixPath(R3_MODULES.path.dirname(fileName));
	};
	return res;
};
// Process In-Game Vars
tempFn_R3_TOOLS['processBio3Vars'] = function(hex){
	if (hex !== undefined && hex !== ''){
		if (hex.length === 4){
			var finalNumber = 0, first = parseInt(hex.slice(0, 2), 16), second = parseInt(hex.slice(2, 4), 16);
			while(second !== 0){
				finalNumber = finalNumber + 255;
				finalNumber++;
				second--;
			};
			while (first !== 0){
				finalNumber++;
				first--;
			};
			return finalNumber;
		};
	} else {
		return 0;
	};
};
// Parse Percentage
tempFn_R3_TOOLS['parsePercentage'] = function(current, maximum){
	var res = 0;
	if (current !== undefined && maximum !== undefined && current !== '' && maximum !== ''){
		res = Math.floor((current / maximum) * 100);
	};
	return res;
};
// Fix Path Size
tempFn_R3_TOOLS['fixPathSize'] = function(path, limit){
	var res = '', limit = parseInt(limit), factor = 2;
	if (path !== undefined && path !== ''){
		if (path.length < limit){
			res = path;
		} else {
			if (path.length > 140){
				factor = 1.5;
			};
			res = '...' + path.slice(parseInt(path.length / factor), path.length);
		};
	};
	return res;
};
// Fix path
tempFn_R3_TOOLS['fixPath'] = function(path){
	var res = '';
	// If loading settings
	if (R3_SETTINGS_LOADING === true && path === ''){
		res = 'Undefined';
	};
	if (path !== undefined && path !== ''){
		res = path.replace(new RegExp('\\\\', 'gi'), '/');
	};
	return res;
};
// Get number from hex (Using Endian)
tempFn_R3_TOOLS['getPosFromHex'] = function(hex){
	if (hex !== undefined && hex !== ''){
		return (parseInt(R3_tools.parseEndian(hex), 16) * 2);
	};
};
// Get number from hex (Without Endian)
tempFn_R3_TOOLS['parseHexLengthToString'] = function(hex){
	if (hex !== undefined && hex !== ''){
		return (parseInt(hex, 16) * 2);
	};
};
// Parse string from Endian
tempFn_R3_TOOLS['parseEndian'] = function(str){
	var final = '';
	if (str !== undefined && str !== ''){
		final = str.toString().match(/.{2,2}/g).reverse().toString().replace(RegExp(',', 'gi'), '');
	};
	return final;
};
// Get file size
tempFn_R3_TOOLS['getFileSize'] = function(filePath, mode){
	if (filePath !== undefined && filePath !== '' && R3_SYSTEM.web.isBrowser === false){
		var read = R3_MODULES.fs.statSync(filePath), fsize = read.size, res = 0;
		// Bytes
		if (mode === 0 || mode === undefined){
			res = read.size;
		};
		// In KB
		if (mode === 1){
			res = parseInt(read.size / 1024);
		};
		// In MB
		if (mode === 2){
			res = read.size / 1000000.0;
		};
		return res;
	};
};
// Get all indexes of string in another string
tempFn_R3_TOOLS['getAllIndexes'] = function(arr, val){
	if (arr !== null && val !== null || arr !== undefined && val !== undefined){
    	var idx = [], i = -1;
    	while ((i = arr.indexOf(val, i + 1)) != -1){
    	    idx.push(i);
    	};
    	return idx;
	} else {
		R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: (Internal) Invalid arguments on R3_tools.getAllIndexes!');
	};
};
// Get Current Date
tempFn_R3_TOOLS['getDate'] = function(mode){
	/*
		Modes
		0: Full
		1: Day
		2: Month
		3: Year
		4: Hour
		5: Minutes
		6: Seconds
	*/
	var t = new Date, d = t.getDate(), h = t.getHours(), s = t.getSeconds(), y = t.getFullYear().toString(), mi = t.getMinutes(), m = (t.getMonth() + 1);
	if (mode === undefined){
		mode = 0;
	};
	if (d.toString().length < 2){
		d = '0' + t.getDate();
	};
	if (m.toString().length < 2){
		m = '0' + parseInt(t.getMonth() + 1);
	};
	if (h.toString().length < 2){
		h = '0' + t.getHours(); 
	};
	if (mi.toString().length < 2){
		mi = '0' + t.getMinutes(); 
	};
	if (s.toString().length < 2){
		s = '0' + t.getSeconds();
	};
	if (mode === 0){
		return d + '-' + m + '-' + y + '_' + h + '.' + mi + '.' + s;
	};
	if (mode === 1){
		return d.toString();
	};
	if (mode === 2){
		return m.toString();
	};
	if (mode === 3){
		return y.toString();
	};
	if (mode === 4){
		return h.toString();
	};
	if (mode === 5){
		return mi.toString();
	};
	if (mode === 6){
		return s.toString();
	};
};
// Read Date gerenated with R3_tools.getDate
tempFn_R3_TOOLS['readDate'] = function(dateStr, mode){
	if (dateStr !== undefined && dateStr !== ''){
		if (mode === undefined || mode === ''){
			mode = 0;
		} else {
			mode = parseInt(mode);
		};
		// Date
		if (mode === 0){
			return dateStr.slice(0, 10).replace(new RegExp('-', 'gi'), '/');
		};
		// Time
		if (mode === 1){
			return dateStr.slice(11, dateStr.length).replace(new RegExp('[.]', 'gi'), ':');
		};
	} else {
		return '';
	};
};
// Process Player HP
tempFn_R3_TOOLS['processPlayerHP'] = function(hex){
	if (hex !== '' && hex.length === 4){
		var stat, color, vital = R3_tools.processBio3Vars(hex);
		/*
			The correct value should be 32767, but i'm leaving a
			margin error to game thinks the player still alive!
		*/
		if (vital > 30100){
			stat = 'Dead';
			color = 'R3_COLOR_DANGER';
		};
		if (vital === 0){
			stat = 'Almost dead!';
			color = 'R3_COLOR_DANGER';
		};
		if (vital > 0 && vital < 21){
			stat = 'Danger';
			color = 'R3_COLOR_DANGER';
		};
		if (vital > 20 && vital < 31){
			stat = 'Caution';
			color = 'R3_COLOR_CAUTION_RED';
		};
		if (vital > 30 && vital < 101){
			stat = 'Caution';
			color = 'R3_COLOR_CAUTION';
		};
		if (vital > 101 && vital < 201){
			stat = 'Fine';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 200 && vital < 500){
			stat = 'Fine...?';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 499 && vital < 999){
			stat = 'Life Hack!';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 999 && vital < 19999){
			stat = 'Unfair!';
			color = 'R3_COLOR_FINE';
		};
		if (vital > 19999 && vital < 30099){
			stat = 'CHEATER!';
			color = 'R3_COLOR_FINE';
		};
		return [vital, stat, hex, color];
	};
};
// Format string as hex
tempFn_R3_TOOLS['unsolveHex'] = function(hex, mode){
	var res = '', rw;
	if (hex !== '' && hex !== undefined && hex !== null){
		if (mode === undefined || mode === 0){
			rw = hex.match(/.{1,2}/g);
		};
		if (mode === 1){
			rw = hex.match(/.{1,4}/g);
		};
		if (mode === 2){
			rw = hex.match(/.{1,8}/g);
		};
		res = rw.toString().replace(RegExp(',', 'gi'), ' ').toUpperCase();
	};
	return res;
};
// Parse Positive
tempFn_R3_TOOLS['parsePositive'] = function(number){
	var final = 0;
	if (number !== undefined && parseInt(number) !== NaN && number !== ''){
		var num = parseInt(number), tempRes = parseInt(num - num - num);
		if (tempRes < 0){
			final = parseInt(tempRes *- 1);
		} else {
			final = tempRes;
		};
	};
	return final;
};
// Process location position
tempFn_R3_TOOLS['processBio3Position'] = function(number){
	var final = 0;
	if (number !== undefined){
		var numTemp = parseInt(number);
		if (numTemp > 32767){
			numTemp = parseInt(numTemp - 65536);
		};
		final = numTemp;
	};
	return final;
};
// Convert position int to hex
tempFn_R3_TOOLS['convertPosIntToHex'] = function(number){
	if (number !== undefined && number !== ''){
		var num = parseInt(number);
		if (num < 0){
			num = parseInt(num + 65536);
		};
		return R3_tools.fixVars(num.toString(16), 4);
	};
};
// Convert position hex to int
tempFn_R3_TOOLS['convertPosHexToInt'] = function(hex){
	if (hex !== undefined && hex !== ''){
		var fixed = R3_tools.parseEndian(hex),
			conv  = parseInt(fixed, 16);
		if (conv > 32767){
			conv = parseInt(conv - 65536);
		};
		return conv;
	};
};
// Get char from left / right [Use in OM_SET]
tempFn_R3_TOOLS['getByteFromPos'] = function(mode, value){
	if (mode !== undefined && value !== undefined){
		var res = value.slice(1);
		if (mode === 0){
			res = value.slice(0, 1);
		};
		return res;
	};
};
/*
	R3_tools.fixVars (aka. MEMORY_JS_fixVars, R3_fixVars)
	By far, one of the most important functions inside R3V2!
*/
tempFn_R3_TOOLS['fixVars'] = function(inp, v){
	var c = 0, inp, size;
	if (inp === undefined || inp === ''){
		input = '00';
	} else {
		input = inp.toString();
	};
	if (v === undefined || v === ''){
		size = 2;
	} else {
		size = parseInt(v);
	};
	if (input.length < size){
		while (input.length !== size){
			input = '0' + input;
		};
	} else {
		if (input.length !== size && input.toString().length > size){
			input = input.slice(0, v);
		};
	};
	return input;
};
// Copy text to clipboard R3_SYS_copyText
tempFn_R3_TOOLS['copyTextClipboard'] = function(textData){
	if (textData !== undefined && textData !== ''){
		var tmpDom = document.createElement('textarea');
		document.body.appendChild(tmpDom);
		tmpDom.value = textData;
		tmpDom.select();
		document.execCommand('copy');
		document.body.removeChild(tmpDom);
	};
};
/*
	Hex Time Converter - THIS IS WIP!
	Modes:

	0: Full Time
	1: Array
	2: MM SS DC
	3: 2 with quotes
	4: Hex to Int
*/
tempFn_R3_TOOLS['parseHexTime'] = function(hex, outputMode){
	var final = 0;
	if (hex !== undefined && hex !== ''){
		if (outputMode === undefined){
			outputMode = 0;
		};
		var DC = SS = MM = HH = 0,
			timeHex = hex.match(/.{2,2}/g),
			data0 = parseInt(timeHex[0], 16),
			data1 = parseInt(timeHex[1], 16),
			// Adding to counter
			DC = parseInt((data0 * 100) + (data1 * 256 * 100));
		while (DC > 99){
			DC = parseInt(DC - 100);
			SS++;
		};
		while (SS > 59){
			SS = parseInt(SS - 60);
			MM++;
		};
		while (MM > 59){
			MM = parseInt(MM - 60);
			HH++;
		};
		/*
			End
		*/
		if (outputMode === 0){
			final = R3_tools.fixVars(HH, 2) + ':' + R3_tools.fixVars(MM, 2) + ':' + R3_tools.fixVars(SS, 2) + ':' + R3_tools.fixVars(DC, 2);
		};
		if (outputMode === 1){
			final = [HH, MM, SS, DC];
		};
		if (outputMode === 2){
			final = R3_tools.fixVars(MM, 2) + ':' + R3_tools.fixVars(SS, 2) + ':' + R3_tools.fixVars(DC, 2);
		};
		if (outputMode === 3){
			final = R3_tools.fixVars(HH, 2) + ':' + R3_tools.fixVars(MM, 2) + '\'' + R3_tools.fixVars(SS, 2) + '\'\'' + R3_tools.fixVars(DC, 2);
		};
		if (outputMode === 4){
			final = parseInt(HH + MM + SS + DC);
		};
		return final;
	};
};
// Convert Endian Number to Int
tempFn_R3_TOOLS['parseEndianToInt'] = function(hex){
	if (hex !== undefined && hex !== ''){
		var final = 0, split = hex.match(/.{2,2}/g), firstVal, secondVal, hx_00, hx_01, hx_02, hx_03;
		// 8 Bits
		if (hex.length === 4){
			firstVal = (parseInt(split[0], 16) * 256);
			secondVal = parseInt(split[1], 16);
			final = parseInt(firstVal + secondVal);
		};
		// 16 Bits
		if (hex.length === 8){
			hx_00 = (((parseInt(split[0], 16) * 256) * 256) * 256);
			hx_01 = ((parseInt(split[1], 16) * 256) * 256);
			hx_02 = (parseInt(split[2], 16) * 256);
			hx_03 = (parseInt(split[3], 16));
			final = parseInt(hx_00 + hx_01 + hx_02 + hx_03);
		};
	};
	return final;
};
// Clean Hex code
tempFn_R3_TOOLS['cleanHex'] = function(hex){
	var final = '';
	if (hex !== undefined && hex !== ''){
		final = R3_tools.solveHex(hex);
		R3_HEX_FORMAT_EXCLUDE.forEach(function(cItem){
			final = final.replace(new RegExp(cItem, 'g'), '').replace(/[^a-z0-9]/gi, '');
		});
	};
	return final;
};
// Clean Hex from Input
tempFn_R3_TOOLS['cleanHexFromInput'] = function(domId){
	if (domId !== undefined){
		document.getElementById(domId).value = R3_tools.cleanHex(document.getElementById(domId).value);
	};
};
// Get Random Number
tempFn_R3_TOOLS['genRandomNumber'] = function(maximum){
	var res = 0;
	if (maximum !== undefined){
		res = parseInt(Math.floor(Math.random() * parseInt(maximum)));
	} else {
		res = Math.random();
	};
	return res;
};
/*
	Process PS 4:3 Res
	Modes:

	0: Wdith
	1: Height
*/
tempFn_R3_TOOLS['parsePSRes'] = function(mode, res){
	if (res === NaN || res === undefined || res === ''){
		res = 256;
	};
	if (mode === 0){
		return parseInt(res / 1.14);
	} else {
		return parseInt(res * 1.14);
	};
};
/*
	Remove HTML from string 

	Remove HTML from string (textClean) original code:
	https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
*/
tempFn_R3_TOOLS['removeHtmlFromString'] = function(str){
	if (str === undefined || str === ''){
		return '';
	} else {
		return str.replace(/<[^>]*>?/gm, '');
	};
};
/*
	Parse Integer
	Added to enhance IE oldness!
*/
tempFn_R3_TOOLS['isInteger'] = function(value){
	var res = false;
	if (value !== undefined){
		// If IE
		if (R3_SYSTEM.web.is_IE === true && value.toString().indexOf('.') === -1){
			res = true;
		} else {
			res = Number.isInteger(value);
		};
	};
	return res;
};
/*
	Hex Sum
	Sum values and output on 0x hex format
*/
tempFn_R3_TOOLS['hexSum'] = function(hex, value){
	var res = '0x000000';
	if (hex !== undefined && value !== undefined){
		res = '0x' + (parseInt(hex) + value).toString(16).toUpperCase();
	};
	return res;
};
// Get map path
tempFn_R3_TOOLS['getMapPath'] = function(){
	var gMode, cPrefix, result = [];
	if (R3_MOD.enableMod === true){
		gMode = parseInt(document.getElementById('R3_RDT_FILELIST_GAMEMODE').value);
		cPrefix = R3_RDT_PREFIX_EASY;
		if (gMode === 1){
			cPrefix = R3_RDT_PREFIX_HARD;
		};
		result = [gMode, R3_MOD.path + '/' + cPrefix + '/RDT/'];
	};
	return result;
};
/*
	R3_TOOLS.setImage

	This function will seek the image file and apply path fix if needed.
	This solves issues with paths on non-windows os
*/
tempFn_R3_TOOLS['setImage'] = function(domId, imagePath){
	if (R3_SYSTEM.web.isBrowser === false){
		if (domId !== undefined && imagePath !== undefined){
			var canApply = true, eReason = '';
			const checkDom = document.getElementById(domId);
			if (checkDom === null){
				canApply = false;
				eReason = eReason + '\nThis DOM does not exists! (DOM: ' + domId + ')';
			};
			// Check if everything is ok
			if (canApply === true){
				var pathFix = '', finalPath = '';
				if (process.platform !== 'win32'){
					pathFix = 'file://';
				};
				// Check if path exists
				if (R3_MODULES.fs.existsSync(imagePath) === true){
					finalPath = fixPath + imagePath;
				} else {
					finalPath = fixPath + 'img/404.webp';
				};
				document.getElementById(domId).src = finalPath;
			} else {
				R3_SYSTEM.log('warn', 'R3ditor V2 - WARN: (HTML) Unable set image to dom! <br>Reason: ' + eReason);
			};
		};
	} else {
		// If web, it will skip this check
		document.getElementById(domId).src = imagePath;
	};
};

/*
	END
*/
const R3_tools = tempFn_R3_TOOLS;
delete tempFn_R3_TOOLS;