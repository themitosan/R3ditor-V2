/*
	*******************************************************************************
	R3ditor V2 - ini.js
	By TheMitoSan

	This file is responsible for handling / creating INI files for RE3 PC version.
	*******************************************************************************
*/
// Variables
var BIO3INI_Save, BIO3INI_Movie, BIO3INI_Regist, BIO3INI_Rofs1, BIO3INI_Rofs2, BIO3INI_Rofs3, BIO3INI_Rofs4, BIO3INI_Rofs5, BIO3INI_Rofs6, BIO3INI_Rofs7, BIO3INI_Rofs8, BIO3INI_Rofs9, BIO3INI_Rofs10, BIO3INI_Rofs11, BIO3INI_Rofs12, BIO3INI_Rofs13, BIO3INI_Rofs14, BIO3INI_Rofs15,
	// true = On, false = Off
	BIO3INI_v_disableMovie = true,
	BIO3INI_v_disableAlpha = false,
	BIO3INI_v_disableLinear = false,
	BIO3INI_v_textureAdjust = false,
	BIO3INI_v_disableSpecular = true,
	BIO3INI_v_mode = 'Windowed',
	// Windowed
	BIO3INI_w_BPP = 32,
	BIO3INI_w_width = 800,
	BIO3INI_w_height = 600,
	BIO3INI_w_driver = 'NULL',
	BIO3INI_w_device = '0ed36e48aa64fc1118f600000c0251e6',
	// FullScreen
	BIO3INI_f_BPP = 32,
	BIO3INI_f_width = 800,
	BIO3INI_f_height = 600,
	BIO3INI_f_driver = 'NULL',
	BIO3INI_f_device = '0ed36e48aa64fc1118f600000c0251e6',
	// Keyboard
	BIO3INI_kb_key1 = '17,200', 	 	// Up
	BIO3INI_kb_key2 = '31,208', 	 	// Down
	BIO3INI_kb_key3 = '30,203', 	 	// Left
	BIO3INI_kb_key4 = '32,205', 	 	// Right
	BIO3INI_kb_key5 = '', 			 	// ???
	BIO3INI_kb_key6 = '75,72,36,23,57', // Cancel / Run
	BIO3INI_kb_key7 = '72,82,57', 	 	// View Map
	BIO3INI_kb_key8 = '71,22', 		 	// Change Target
	BIO3INI_kb_key9 = '73,24',		 	// Draw Weapon (Enemy)
	BIO3INI_kb_keyA = '78,25',		 	// Draw Weapon (Objects)
	BIO3INI_kb_keyB = '16',			 	// ???
	BIO3INI_kb_keyC = '77,38',		 	// Status Screen
	BIO3INI_kb_keyD = '76,37,156',	 	// Select / Action
	BIO3INI_kb_keyE = '', 			 	// ???
	// Sound
	BIO3INI_sound_seVol = BIO3INI_sound_bgmVol = 65534,
	BIO3INI_sound_device = 'NULL',
	// Data
	BIO3INI_data_00 = BIO3INI_data_01 = BIO3INI_data_02 = BIO3INI_data_03 = BIO3INI_data_10 = BIO3INI_data_complete = '';
// Objects
tempFn_R3_INI = {};
/*
	Functions
*/
// Parse bool to ini R3_INI_parseBool
tempFn_R3_INI['parseBool'] = function(value){
	if (value !== undefined){
		var res = 'on';
		if (value === false){
			res = 'off';
		};
		return res;
	};
};
// Make INI file R3_INI_MAKEFILE
tempFn_R3_INI['generateIni'] = function(mode, keepRofs11){
	if (mode !== undefined){
		mode === 1;
	};
	BIO3INI_Save = '.\\Save';
	BIO3INI_Movie = '.\\zmovie';
	BIO3INI_Regist = '.\\regist.txt';
	BIO3INI_Rofs1 = '.\\DATA\\DOOR';
	BIO3INI_Rofs2 = '.\\DATA_AE\\ETC2';
	BIO3INI_Rofs3 = '.\\DATA\\ETC';
	BIO3INI_Rofs4 = '.\\' + R3_RDT_PREFIX_HARD + '\\ETC2';
	BIO3INI_Rofs5 = '.\\DATA\\PLD';
	BIO3INI_Rofs6 = '.\\DATA_A\\PLD';
	BIO3INI_Rofs7 = '.\\DATA\\SOUND';
	BIO3INI_Rofs8 = '.\\DATA_A\\BSS';
	BIO3INI_Rofs9 = '.\\ROOM\\EMD';
	BIO3INI_Rofs10 = '.\\ROOM\\EMD08';
	BIO3INI_Rofs11 = '.\\ROOM\\RBJ';
	if (keepRofs11 === true){
		BIO3INI_Rofs11 = '.\\Rofs11.dat';
	};
	BIO3INI_Rofs12 = '.\\' + R3_RDT_PREFIX_EASY + '\\RDT';
	BIO3INI_Rofs13 = '.\\' + R3_RDT_PREFIX_HARD + '\\RDT';
	BIO3INI_Rofs14 = '.\\DATA_A\\VOICE';
	BIO3INI_Rofs15 = '.\\DATA_A\\SOUND';
	if (mode !== 0){
		BIO3INI_Rofs1 = '.\\Rofs1.dat';
		BIO3INI_Rofs2 = '.\\Rofs2.dat';
		BIO3INI_Rofs3 = '.\\Rofs3.dat';
		BIO3INI_Rofs4 = '.\\Rofs4.dat';
		BIO3INI_Rofs5 = '.\\Rofs5.dat';
		BIO3INI_Rofs6 = '.\\Rofs6.dat';
		BIO3INI_Rofs7 = '.\\Rofs7.dat';
		BIO3INI_Rofs8 = '.\\Rofs8.dat';
		BIO3INI_Rofs9 = '.\\Rofs9.dat';
		BIO3INI_Rofs10 = '.\\Rofs10.dat';
		BIO3INI_Rofs11 = '.\\rofs11.dat';
		BIO3INI_Rofs12 = '.\\Rofs12.dat';
		BIO3INI_Rofs13 = '.\\Rofs13.dat';
		BIO3INI_Rofs14 = '.\\Rofs14.dat';
		BIO3INI_Rofs15 = '.\\Rofs15.dat';
	};
	R3_INI.saveIni('Bio3.ini', mode);
};
// Save INI
tempFn_R3_INI['saveIni'] = function(path, mode){
	const FINAL = '[General]\n' +
		'Save=' + BIO3INI_Save + '\n' +
		'Regist=' + BIO3INI_Regist + '\n' + // What is this file anyways?
		'Movie=' + BIO3INI_Movie + '\n' +
		'Rofs1=' + BIO3INI_Rofs1 + '\n' +
		'Rofs2=' + BIO3INI_Rofs2 + '\n' +
		'Rofs3=' + BIO3INI_Rofs3 + '\n' +
		'Rofs4=' + BIO3INI_Rofs4 + '\n' +
		'Rofs5=' + BIO3INI_Rofs5 + '\n' +
		'Rofs6=' + BIO3INI_Rofs6 + '\n' +
		'Rofs7=' + BIO3INI_Rofs7 + '\n' +
		'Rofs8=' + BIO3INI_Rofs8 + '\n' +
		'Rofs9=' + BIO3INI_Rofs9 + '\n' +
		'Rofs10=' + BIO3INI_Rofs10 + '\n' +
		'Rofs11=' + BIO3INI_Rofs11 + '\n' +
		'Rofs12=' + BIO3INI_Rofs12 + '\n' +
		'Rofs13=' + BIO3INI_Rofs13 + '\n' +
		'Rofs14=' + BIO3INI_Rofs14 + '\n' +
		'Rofs15=' + BIO3INI_Rofs15 + '\n\n[Video]\n' +
		'DisableMovie=' + R3_INI.parseBool(BIO3INI_v_disableMovie) + '\n' +
		'DisableAlpha=' + R3_INI.parseBool(BIO3INI_v_disableAlpha) + '\n' +
		'DisableLinear=' + R3_INI.parseBool(BIO3INI_v_disableLinear) + '\n' +
		'DisableSpecular=' + R3_INI.parseBool(BIO3INI_v_disableSpecular) + '\n' +
		'TextureAdjust=' + R3_INI.parseBool(BIO3INI_v_textureAdjust) + '\n' +
		'Mode=' + BIO3INI_v_mode + '\n\n[Windowed]\n' +
		'Driver=' + BIO3INI_w_driver + '\n' +
		'Device=' + BIO3INI_w_device + '\n' +
		'Width=' + BIO3INI_w_width + '\n' +
		'Height=' + BIO3INI_w_height + '\n' +
		'BPP=' + BIO3INI_w_BPP + '\n\n[FullScreen]\n' +
		'Driver=' + BIO3INI_f_driver + '\n' +
		'Device=' + BIO3INI_f_device + '\n' +
		'Width=' + BIO3INI_f_width + '\n' +
		'Height=' + BIO3INI_f_height + '\n' +
		'BPP=' + BIO3INI_f_BPP + '\n\n[Keyboard]\n' +
		'Key1=' + BIO3INI_kb_key1 + '\n' +
		'Key2=' + BIO3INI_kb_key2 + '\n' +
		'Key3=' + BIO3INI_kb_key3 + '\n' +
		'Key4=' + BIO3INI_kb_key4 + '\n' +
		'Key5=' + BIO3INI_kb_key5 + '\n' +
		'Key6=' + BIO3INI_kb_key6 + '\n' +
		'Key7=' + BIO3INI_kb_key7 + '\n' +
		'Key8=' + BIO3INI_kb_key8 + '\n' +
		'Key9=' + BIO3INI_kb_key9 + '\n' +
		'KeyA=' + BIO3INI_kb_keyA + '\n' +
		'KeyB=' + BIO3INI_kb_keyB + '\n' +
		'KeyC=' + BIO3INI_kb_keyC + '\n' +
		'KeyD=' + BIO3INI_kb_keyD + '\n' +
		'KeyE=' + BIO3INI_kb_keyE + '\n\n[Sound]\n' +
		'Device=' + BIO3INI_sound_device + '\n' +
		'SEvol=' + BIO3INI_sound_seVol + '\n' +
		'BGMvol=' + BIO3INI_sound_bgmVol + '\n\n[Data]\n' +
		'Complete=' + BIO3INI_data_complete + '\n' +
		'Data00=' + BIO3INI_data_00 + '\n' +
		'Data01=' + BIO3INI_data_01 + '\n' +
		'Data02=' + BIO3INI_data_02 + '\n' +
		'Data03=' + BIO3INI_data_03 + '\n' +
		'Data10=' + BIO3INI_data_10 + '\n\n';
	if (mode === 0){
		if (R3_WEBMODE === false){
			try {
				APP_FS.writeFileSync(R3_MOD_PATH + '/' + path, FINAL, 'utf-8');
			} catch (err) {
				R3_SYSTEM.log('error', 'R3ditor V2 - ERROR: Unable to save INI file! <br>Reason: ' + err);
			};
		};
	} else {
		R3_fileManager.saveFile(path, FINAL, 'utf-8', '.ini');
	};
};
/*
	END
*/
const R3_INI = tempFn_R3_INI;
delete tempFn_R3_INI;