/*
	R3ditor V2 - database.js
	Hölerò!
*/
var INT_VERSION = 'DEV_VERSION',
	R3_DOORLINK_DATABASE = {},
	// Lists that will be generated at startup
	INCLUDE_EDIT_MAP,  			 		  	   // SCD Map Names
	INCLUDE_EDIT_ATTR, 					  	   // Item Attr
	INCLUDE_EDIT_ITEM, 			 		  	   // SCD Item Names
	INCLUDE_EDIT_FILE, 			 		  	   // SCD Files Names
	INCLUDE_EDIT_WEAPON, 		 		  	   // Weapon Names
	INCLUDE_EDIT_AOT_TYPES, 			  	   // SCD AOT Types
	INCLUDE_EDIT_SCD_CK_TYPES, 			  	   // SCD CK Types
	INCLUDE_EDIT_SCD_SET_VALUES, 		  	   // SCD SET Vars
	INCLUDE_EDIT_SCD_FADE_TYPES, 		  	   // SCD FADE_SET Types
	INCLUDE_EDIT_SCD_OM_SET_TYPE, 		  	   // SCD OM_SET Object Type
	INCLUDE_EDIT_SCD_EM_SET_POSE,		  	   // SCD EM_SET Pose
	INCLUDE_EDIT_SCD_PRESET_LIST,		  	   // SCD Preset List
	INCLUDE_EDIT_SCD_EM_SET_TYPES,		  	   // SCD EM_SET Enemy / NPC Types
	INCLUDE_EDIT_SCD_WORK_SET_TARGET, 	  	   // SCD Char Trigger [WORK_SET] Targets
	INCLUDE_EDIT_SCD_OM_SET_COL_TYPE, 	  	   // SCD OM_SET Colission Type
	INCLUDE_EDIT_SCD_MSG_DISPLAYMODE, 	  	   // SCD MSG Display Modes
	INCLUDE_EDIT_SCD_SET_TIMER_TARGET, 	  	   // SCD Set Timer Target
	INCLUDE_EDIT_SCD_OM_SET_COL_SHAPE, 	  	   // SCD OM_SET Colission Shape
	INCLUDE_EDIT_SCD_CALC_OP_OPERATIONS,  	   // SCD CALC_OP Operations
	INCLUDE_EDIT_SCD_PLC_DEST_ANIMATIONS, 	   // SCD PLC_DEST Animations
	INCLUDE_EDIT_SCD_PLC_NECK_ANIMATIONS, 	   // SCD PLC_NECK Animations
	INCLUDE_EDIT_SCD_ITEM_AOT_SET_BLINK_COLOR, // SCD ITEM_AOT_SET Blink Colors
	// SCD CK Special Conditions
	INCLUDE_EDIT_SCD_CK_SPECIAL,
	// GitHub Lists
	INCLUDE_GITHUB_BRANCHES;
	/*
		The real database starts here!
	*/
	// THX
const R3_internalHoldTime = 2800,
	INCLUDE_RE3_BEEP_BOOP = 'BEEP. BEEP. BOOP. BEBOBEBOBIIIIIP... BOOP!\n\nI see you got a good RNG here!',
	INCLUDE_R3V2_LOWRES = 'So tiny! >.< <br>R3ditor V2 was designed to work with screen res. higher than 1216x711.',
	INCLUDE_R3V2_CRITICAL_ERROR = '<font class="LBL_title">Oh no!</font><br>Looks like R3ditor V2 crashed! We apologize - this is not something usual to happen!<br>To avoid crashed like this, report this message to <a href="https://twitter.com/themitosan/" target="_blank">TheMitoSan</a> on twitter.<br><br>' +
								  '<div class="R3_ERROR_CRITICAL_REASON"><div class="R3_ERROR_LOGO_BG"></div><div id="R3_ERROR_CRITICAL_REASON" class="R3_ERROR_TEXT">???</div></div><br><input type="button" class="BTN_R3CLASSIC" title="Click here to reload" value="Restart R3V2" onclick="location.reload();">',
	INCLUDE_CRX = 'TheMitoSan, Khaled SA and F. King',
	SYSTEM_LOG_SEPARATOR_TEXT = '--------------------------------------------------------------------------------------------------------------------------',
	INCLUDE_ABOUT_THX = 'discordjs - RPC - <a target="_blank" href="https://discord.js.org/#/docs/rpc/master/general/welcome">Website</a><br>' + 
						'Rob-- - memoryjs - <a target="_blank" href="https://github.com/Rob--/memoryjs">GitHub</a><br>' + 
						'Joshua MacDonald - Xdelta - <a target="_blank" href="https://github.com/jmacd/xdelta">GitHub</a><br>' +
						'jprichardson - fs-extra plugin - <a target="_blank" href="https://github.com/jprichardson/node-fs-extra">GitHub</a><br>' + 
						'Elric (Aka. 3lric) - Beta-testing - <a target="_blank" href="https://twitter.com/3lricM">Twitter</a><br>' + 
						'Mortican - Memory Addresses - <a target="_blank" href="https://www.tapatalk.com/groups/residentevil123/bio3gps-t1780.html">More Info</a><br>' + 
						'El rincon del Lobezno - Beta-testing - <a target="_blank" href="https://twitter.com/DelLobezno">Twitter</a><br>' + 
						'Rene Kootstra - eNGE PS1 Emulator - <a target="_blank" href="https://github.com/kootstra-rene/enge-js">GitHub</a><br>' +
						'The entire Resident Evil 1 2 3 Forum! - <a target="_blank" href="https://www.tapatalk.com/groups/residentevil123/">More Info</a><br>' + 
						'Angus Johnson - Resource Hacker - <a target="_blank" href="http://www.angusj.com/resourcehacker/">Official Website</a><br>' + 
						'<font title="The true legend!">Leo2236 - RE3SLDE Software Creator</font> - <a target="_blank" href="http://lgt.createaforum.com/">LGT Forum</a><br>' + 
						'<font title="The most awesome woman of the entire world!">Y <i>(The Artist)</i> zu</font> - Background Art - <a target="_blank" href="https://twitter.com/artist_zu/">Twitter</a>, <a target="_blank" href="https://www.instagram.com/yzumi_reaper/">Instagram</a><br>' + 
						'MarkGrass - BIOFAT and SCD Opcode Lists - <a target="_blank" href="https://github.com/MeganGrass/BioScript/">More Info</a><br>' + 
						'matteofumagalli1275 memoryjs Pull Request - <a target="_blank" href="https://github.com/Rob--/memoryjs/pull/53/files">GitHub PR</a><br>' + 
						'Klarth - TIM Graphic Formats (PSX 2D Graphics) - <a target="_blank" href="http://www.romhacking.net/documents/31/">More Info</a><br>' + 
						'"Shockproof" Jamo Koivisto - BIO 3 Hex Chest Modding - <a target="_blank" href="https://gamefaqs.gamespot.com/pc/431704-resident-evil-3-nemesis/faqs/36465">More Info</a><br>' + 
						'Diogo "Flag" Bandeira <i>(Aka. Flag King)</i> - Initial RDT and MSG infos! - <a href="https://www.ct-stars.com/" target="_blank">CT-STARS</a><br>' + 
						'Patrice Mandin (pmandin) - Reevengi-tools Rofs Extractor, ARD Extract Info and SCD Opcode List - <a target="_blank" href="https://github.com/pmandin/reevengi-tools">GitHub</a><br>' + 
						'<font title="The real artist!">ResidentEvilArtist</font> - Memory Positions used in IEDIT Editor, MIX Editor and <u>so much more</u>! - <a target="_blank" href="https://www.tapatalk.com/groups/residentevil123/memberlist.php?mode=viewprofile&u=294">Tapatalk Profile</a><br>' + 
						'<font title="A true hero!">Biohazard España</font> (Aka. <u>BHE</u>)- Fix OBJ to RE3MV (OBJ Patcher), Beta-testing, SLUS / ARD info and even more! - <a target="_blank" href="https://twitter.com/biohazardEsp">More Info</a><br>' + 
						'<font title="The great master">Khaled SA</font> - RDT / ARD Header Infos, RDT V1 / 2 / 3 Tutorials, SCD Opcode List / Functions, Beta-testing and more - <a target="_blank" href="https://twitter.com/khaleed681">Twitter</a><br><br>',
	INCLUDE_ABOUT_SNIPPETS = '<font class="LBL_subTitle">External code snippets:</font><br><br>' + 
							 '<a href="https://stackoverflow.com/questions/822452/strip-html-from-text-javascript" target="_blank">' + 
							 'https://stackoverflow.com/questions/822452/strip-html-from-text-javascript' + 
							 '</a><br>' +
							 '<a href="https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable" target="_blank">' + 
							 'https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable' + 
							 '</a><br>' +
							 '<a href="https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex" target="_blank">' + 
							 'https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex' + 
							 '</a><br>' +
							 '<a href="https://stackoverflow.com/questions/25354313/saving-a-uint8array-to-a-binary-file" target="_blank">' + 
							 'https://stackoverflow.com/questions/25354313/saving-a-uint8array-to-a-binary-file' + 
							 '</a><br>' +
							 '<a href="https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_dropdown_navbar" target="_blank">' + 
							 'https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_dropdown_navbar' + 
							 '</a><br>' +
							 '<a href="https://stackoverflow.com/questions/857618/javascript-how-to-extract-filename-from-a-file-input-control" target="_blank">' + 
							 'https://stackoverflow.com/questions/857618/javascript-how-to-extract-filename-from-a-file-input-control' + 
							 '</a><br>' +
							 '<a href="https://stackoverflow.com/questions/37051797/remove-comments-from-string-with-javascript-using-javascript" target="_blank">' + 
							 'https://stackoverflow.com/questions/37051797/remove-comments-from-string-with-javascript-using-javascript' +
							 '</a><br>' +
							 '<a href="https://stackoverflow.com/questions/29472038/node-webkit-moving-second-window-to-a-second-or-specific-screen" target="_blank">' + 
							 'https://stackoverflow.com/questions/29472038/node-webkit-moving-second-window-to-a-second-or-specific-screen' + 
							 '</a><br>' +
							 '<a href="https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript" target="_blank">' + 
							 'https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript' + 
							 '</a><br>',
	INCLUDE_ENDING = '<br><u>Special Thanks To:</u><br><br><u><a target="_blank" href="https://www.ct-stars.com/">The Entire CT-STARS Team! (Special Mention to <font title="Thanks, Master!">Flag-King</font>!)</a></u><br>' +
					 '<u><a target="_blank" href="https://twitter.com/biohazardEsp" title="Saludos, mi querido amigo!">Biohazard España</a> & <a target="_blank" href="https://twitter.com/khaleed681">Khaled SA</a> - for teaching me several RE3 tricks!</u><br>' +
					 '<u>Kazuhiro Aoyama, Shinji Mikami and <a target="_blank" href="https://twitter.com/dev1_official">Capcom Dev 1 Team</a> - Thanks by creating the game of my life!</u><br><br>' +
					 '<i>RE3SLDE is a software created by <a href="http://lgt.createaforum.com/" target="_blank">Leo2236</a>.<br>' +
					 'eNGE is a PS1 emulator written in JS created by <a href="https://github.com/kootstra-rene" target="_blank">Rene Kootstra</a><br>' +
					 'Some icons was made using shell32.dll icons from Microsoft Windows 98 SE.<br>' +
					 'RDT SLD Edit icon was created using the original icon from <a href="http://lgt.createaforum.com/tools-24/re3slde-a-tool-to-edit-sld-files/" target="_blank">Leo2236 RE3SLDE Editor</a>.<br>' +
					 'The new R3ditor V2 logo was created using <a href="https://www.dafont.com/pix-chicago.font" target="_blank">Pix Chicago</a> and <a href="https://www.fonts.com/font/linotype/plak/black-extra-condensed" target="_blank">Plak® Extra Condensed</a> fonts.<br><br>' +
					 'Biohazard and Resident Evil are trademarks of ©CAPCOM CO., LTD. ALL RIGHTS RESERVED.</i></div><br><br><div class="ABOUT_LEGAL_INFO">THE LICENSE TO USE THIS SOFTWARE IS FREE FOR PERSONAL AND COMMERCIAL USE SINCE YOU GIVE CREDITS TO CREATOR OF THIS TOOL AND FOR ALL NAMES CITED ABOVE - SINCE THEY ARE OWNERS OF KNOWLEDGE THAT WERE NECESSARY FOR IT\'S CREATION.</div>',
	INCLUDE_THX = 'Many thanks to: CT-STARS, Elric <i>(Aka. 3lric)</i>, El rincon del Lobezno, Rene Kootstra, discordjs, Rob--, hongru, Joshua MacDonald,<br> jprichardson, Y <i>(The Artist)</i> zu, Mortican, Angus Johnson, Leo2236, MarkGrass, matteofumagalli1275, Klarth, "Shockproof" Jamo Koivisto, Diogo "Flag" Bandeira (Aka. Flag King), Khaled SA, Patrice Mandin (pmandin), ResidentEvilArtist and Biohazard España <i>(BHE)</i>.',
	// Settings
	INCLUDE_SCD_OPTION_EDITOR_MODE = '<option value="0" title="This mode will allow you edit SCD like you do on RPG Maker / Impact JS Events (Entities)">List Editor</option><option value="1" title="This mode will allow edit SCD like Bioscript, writing every function!">Code Editor [WIP]</option>',
	INCLUDE_OPTION_SCD_SIZE = '<option value="0.7">Tiny!</option><option value="0.9">Small</option><option value="1">Normal</option><option value="1.2">x1.2</option><option value="1.5">x1.5</option><option value="1.8">x1.8</option><option value="2">x2</option>',
	INCLUDE_OPTION_RE3_VERSION = '<option value="0">(PC) USA Version (Eidos)</option><option value="1">(PC) USA Version (Xplosiv)</option><option value="4">(PC) Gemini REbirth W. USA Version (Eidos)</option><option value="2">(Emu) pSX (aka. psfin) - Ver. 1.13, Game: USA</option><option value="3" disabled="disabled">(Emu) ePSXe - Ver. 2.0.5, Game: USA</option>',
	INCLUDE_OPTION_LIVESTATUS_POS = '<option value="0">Bottom</option><option value="1">Right</option>',
	INCLUDE_OPTION_MSG_DECOMPILE = '<option value="3">Resident Evil 3</option>',
	// File Generattor
	INCLUDE_FILEGEN_FONTSTYLES = '<option value="RE1">Resident Evil 1 [WIP]</option><option value="RE3">Resident Evil 3 [WIP]</option>',
	// RDT Filelist Game mode
	INCLUDE_RDT_FILELIST_GAMEMODE = '<option value="0">Easy Mode</option><option value="1">Hard Mode</option>',
	// MSG Function Types
	MSG_functionTypes = {
		0:  ['Show Message', 		'',    ''],
		1:  ['Start Message', 	 	'SMS', 'Usage: $SMS + Text speed (Min: 00, Max: 09)\nThis will set the speed of how text will be rendered.'],
		2:  ['End Message', 		'EMS', 'Usage: $EMS + Args (Range: 00 to FF)\nThis probably will call other event.'],
		3:  ['???', 				'UNK', ''],
		4:  ['Show Special Char', 	'SSC', 'Usage: $SSC + Char Hex (Range: 00 to FF)\nThis will display a special char on current text.'],
		5:  ['Show Item Name', 		'SIN', 'Usage: $SIN + Item ID (Range: 00 to 85)\nThis will display an Item name on current text.'],
		6:  ['Play SE', 			'PSE', 'Usage: $PSE + SE ID (Range: 00 to FF)\nThis will play a specific sound, depending of current map.'],
		7:  ['Change Camera', 		'CHC', 'Usage: $CHC + Camera ID (Range: 00 to FF, Depending of how many cameras are available on current map)\nThis will show a specific camera from current map.'],
		8:  ['(UNK) Function F5', 	'UF5', 'Unknown\nThis function is present on R101.RDT - Still WIP!'],
		9:  ['Change Text Color', 	'CTC', 'Usage: $CTC + Color ID (Range: 00 to 0F)\nThis will change the text color depending of inserted value.'],
		10: ['???', 				'',    ''],
		11: ['Show Options', 		'SHO', 'Still WIP!']
	},
	// RDT Camera Types
	INCLUDE_RDT_CAMERA_TYPES = '<option value="0000">(0000) Normal</option><option value="0100">(0100) Cutscene?</option>',
	// SCD Door Edit Extra Door Value
	INCLUDE_SCD_DOOR_KEYFF = '<option disabled></option><option disabled>Special Values:</option><option disabled>The values below are used only as door keys!</option><option disabled></option><option value="fe">(FE) - This door is locked from other side</option><option value="ff">(FF) - Locked from other side</option>',
	INCLUDE_SCD_DOOR_TEXT = '<option value="00">(00) Nothing</option><option value="40">(40) Will you go down the ladder?</option>',
	// MSG Color
	INCLUDE_EDIT_COLOR = '<option value="0">Default Color</option><option value="1">Green</option><option value="2">Wine Red</option><option value="3">Dark Grey</option><option value="4">Blue</option><option value="6">Transparent</option><option value="00">Close Tag</option>',
	// SCD ON / OFF
	INCLUDE_EDIT_SCD_FLAGS = '<option value="00">(00) False (OFF)</option><option value="01">(01) True (ON)</option>',
	/*
		SCD Editor
	*/
	INCLUDE_SCD_CODE_VARIABLE = ['var ', 'let ', 'const '],
	INCLUDE_SCD_CODE_EDITOR = '<textarea class="R3_SCD_CODE_EDITOR_TEXTAREA" id="R3_SCD_CODE_EDITOR_TEXTAREA" onmousedown="R3_SCD_CODE_updateTextData();" onmouseup="R3_SCD_CODE_updateTextData();" onmousemove="R3_SCD_CODE_updateTextData();" onkeydown="R3_SCD_CODE_EDITOR_KEYFIX(event);" onkeyup="R3_SCD_CODE_updateTextData();" placeholder="Please - don\'t leave this blank!\nInsert the code above if you want creating a blank script:\n\nfunction R3_SCD_SCRIPT_START(){\n	EVT_END();\n};" spellcheck="false"></textarea></div><div class="R3_SCD_CODE_TEXT_INFO">Length: <font id="R3_SCD_CODE_codeLength">0</font>, Lines: <font id="R3_SCD_CODE_codeLines">0</font> - Pos: <font id="R3_SCD_CODE_cursorAt">0</font><div id="R3_SCD_CODE_selectionDiv" class="none"> - Selection: From <font id="R3_SCD_CODE_selectionStart">0</font> to <font id="R3_SCD_CODE_selectionEnd">0</font></div> - CTRL: <font id="R3_SCD_CODE_keyCtrl">false</font>, Shift: <font id="R3_SCD_CODE_keyShift">false</font> - Font Size: <font id="R3_SCD_CODE_fontSize">12</font>px</div>',
	INCLUDE_SCD_EDIT_WIP = '<div class="align-center"><font class="LBL_title">WARNING</font></div><br>The edit form for this opcode is not ready yet! :(',
	INCLUDE_SCD_EDIT_FUNCTIONS = {
		'00': 'NO_EDIT',
		'01': 'NO_EDIT',
		'02': 'NO_EDIT',
		'03': 'NO_EDIT',
		'04': 'ID: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_04_id" class="R3_EDIT_TEXT_XYZR">',
		'05': 'ID: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_05_id" class="R3_EDIT_TEXT_XYZR">',
		'06': 'NO_EDIT',
		'07': 'NO_EDIT',
		'08': 'NO_EDIT',
		'09': 'Sleeping: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="0A" id="R3_SCD_EDIT_09_sleeping" class="R3_EDIT_TEXT_XYZR"> Ticks: <input type="number" min="1" maxlength="5" max="32767" placeholder="10" step="1" id="R3_SCD_EDIT_09_count" class="R3_SCD_EDIT_61_aot">',
		'0a': 'Ticks: <input type="number" min="0" maxlength="5" max="32767" placeholder="10" step="1" id="R3_SCD_EDIT_0a_count" class="R3_SCD_EDIT_61_aot">',
		'0b': 'NO_EDIT',
		'0c': 'NO_EDIT',
		'0d': 'This check will hold the next <input type="number" min="1" step="1" class="R3_EDIT_TEXT_XYZR" placeholder="2" id="R3_SCD_EDIT_0d_length" onchange="R3_SCD_FUNCTION_CHECK_LENGTH_GENERATOR_SPECIAL(\'0d\');"> functions and will loop for <input type="number" min="0" step="1" maxlength="6" class="R3_EDIT_TEXT_XYZR" placeholder="3" id="R3_SCD_EDIT_0d_loop"> times.<br><br>Functions inside [FOR]:<br><br><div id="R3_SCD_EDIT_0d_fnInside" class="R3_SCD_EDIT_CHECK_LENGTH"></div>',
		'0e': 'NO_EDIT',
		'0f': 'NO_EDIT',
		'10': 'NO_EDIT',
		'11': 'NO_EDIT',
		'12': 'NO_EDIT',
		'13': 'NO_EDIT',
		'14': 'NO_EDIT',
		'15': 'NO_EDIT',
		'16': 'NO_EDIT',
		'17': 'NO_EDIT',
		'18': 'NO_EDIT',
		'19': 'Run Script: <input type="number" autocomplete="off" min="1" maxlength="4" placeholder="1" id="R3_SCD_EDIT_19_scriptId" class="R3_EDIT_TEXT_XYZR" onchange="R3_SCD_FUNCTION_GO_SUB_PREVIEW();" oninput="R3_SCD_FUNCTION_GO_SUB_PREVIEW();"><br><br>Script <font id="R3_SCD_EDIT_19_LBL_scriptId">???</font> Preview:<br><br><div class="R3_SCD_EDIT_CHECK_LENGTH" id="R3_SCD_EDIT_19_scriptPreview"></div>',
		'1a': 'NO_EDIT',
		'1b': 'NO_EDIT',
		'1c': 'NO_EDIT',
		'1d': 'NO_EDIT',
		'1e': 'Target: <select id="R3_SCD_EDIT_1e_target" class="SELECT_SETTINGS auto" onchange="R3_SCD_FUNCTIONEDIT_UPDATE_SET_TIMER();"></select><br><div id="R3_SCD_EDIT_1e_editVarTime">Time: <input type="number" min="0" max="18" step="1" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_1e_timeHH" placeholder="HH" maxlength="2" oninput="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();" onchange="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();"> : <input type="number" min="0" max="59" step="1" class="R3_EDIT_TEXT_XYZR" placeholder="MM" id="R3_SCD_EDIT_1e_timeMM" maxlength="2" oninput="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();" onchange="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();"> : <input type="number" min="0" max="59" placeholder="SS" step="1" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_1e_timeSS" maxlength="2" oninput="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();" onchange="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();"><br><div class="SEPARATOR-2"></div><div class="R3_SCD_SET_TIMER_CANVAS" id="R3_SCD_EDIT_1e_canvas"></div></div><div id="R3_SCD_EDIT_1e_editVarInt">Value: <input type="number" min="0" max="32767" step="1" class="R3_SCD_EDIT_61_aot" id="R3_SCD_EDIT_1e_varInt" placeholder="00" oninput="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();" onkeyup="R3_SCD_FUNCTIONEDIT_updateSetTimerCanvas();"></div><div class="none" style="margin-top: 40px;">Hex: <font id="R3_SCD_EDIT_1e_hex" class="monospace mono_xyzr user-can-select">???</font></div>',
		'1f': 'NO_EDIT',
		'20': 'Accumulator ID: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_20_accmId" class="R3_EDIT_TEXT_XYZR"> Operation: <select id="R3_SCD_EDIT_20_operation" class="SELECT_SETTINGS auto"></select> Value: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_20_value" class="R3_EDIT_TEXT_XYZR"> Unk 0: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_20_unk0" class="R3_EDIT_TEXT_XYZR">',
		'21': 'NO_EDIT',
		'22': 'Value: <input type="text" spellcheck="false" id="R3_SCD_EDIT_22_value" class="R3_EDIT_TEXT_XYZR" placeholder="00">',
		'24': 'NO_EDIT',
		'25': 'ID: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_25_id" class="R3_EDIT_TEXT_XYZR"> Room: R<input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_25_room" class="R3_EDIT_TEXT_XYZR R3_SCD_EDIT_25_mapLocation">',
		'26': 'Data 0: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_26_data0" class="R3_EDIT_TEXT_XYZR"> Data 1: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_26_data1" class="R3_EDIT_TEXT_XYZR">',
		'27': 'NO_EDIT',
		'28': 'NO_EDIT',
		'29': 'Z-Align: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_29_zAlign" class="R3_EDIT_TEXT_XYZR"> Data 0: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_29_data0" class="R3_EDIT_TEXT_XYZR"> Data 1: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_29_data1" class="R3_EDIT_TEXT_XYZR"> Data 2: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_29_data2" class="R3_EDIT_TEXT_XYZR">',
		'2a': 'ID: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_2a_id" class="R3_EDIT_TEXT_XYZR"> Type: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_2a_type" class="R3_EDIT_TEXT_XYZR"> Value: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_2a_value" class="R3_EDIT_TEXT_XYZR">',
		'2b': 'Value: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_2b_value" class="R3_EDIT_TEXT_XYZR">',
		'2c': 'Data 0: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_2c_data0"> Data 1: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_2c_data1"> Flag: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_2c_flag"></select>',
		'2d': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_2d_id"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_2d_value">',
		'2e': 'NO_EDIT',
		'2f': 'NO_EDIT',
		'30': 'LIT ID: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_30_id" class="R3_EDIT_TEXT_XYZR"> <font class="COLOR_X">X</font>: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_30_posX" class="R3_EDIT_TEXT_XYZR"> <font class="COLOR_Y">Y</font>: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_30_posY" class="R3_EDIT_TEXT_XYZR">',
		'31': 'NO_EDIT',
		'32': 'LIT ID: <input type="text" spellcheck="false" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_32_lightId" maxlength="2"> Unk 0: <input type="text" spellcheck="false" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_32_unk0" maxlength="2"><br><div class="R3_SCD_DIV_COLOR_EDIT"><font class="cType_R">Color R</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_32_colorR_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_RGB(\'32\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_32_colorR" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_RGB(\'32\');" onchange="R3_SCD_FUNCTION_UPDATE_RGB(\'32\');"><br><font class="cType_G">Color G</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_32_colorG_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_RGB(\'32\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_32_colorG" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_RGB(\'32\');" onchange="R3_SCD_FUNCTION_UPDATE_RGB(\'32\');"><br><font class="cType_B">Color B</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_32_colorB_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_RGB(\'32\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_32_colorB" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_RGB(\'32\');" onchange="R3_SCD_FUNCTION_UPDATE_RGB(\'32\');"><br><input type="button" value="Color Picker" onclick="R3_SCD_FUNCTION_LIT_COLOR_PICKER(\'32\');" class="BTN_R3CLASSIC"><br><div class="R3_SCD_DIV_COLOR_PREVIEW" id="R3_SCD_EDIT_32_rgbDivPreview">Color Preview</div></div>',
		'33': 'Value: <input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_33_value" class="R3_EDIT_TEXT_XYZR">',
		'34': 'NO_EDIT',
		'35': 'Data 0: <input type="text" spellcheck="false" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_35_data0" maxlength="2"> Data 1: <input type="text" spellcheck="false" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_35_data1" maxlength="2"> Value: <input type="text" spellcheck="false" placeholder="0000" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_35_value" maxlength="4">',
		'36': 'Item: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_36_itemCode" onchange="R3_SCD_FUNCTIONEDIT_updateItemPreview(\'R3_SCD_EDIT_36_itemCode\', \'R3_SCD_EDIT_36_itemPreview\');"></select> Quantity: <input type="number" class="R3_EDIT_TEXT_XYZR" min="0" max="255" maxlength="3" id="R3_SCD_EDIT_36_quant"><br><br><img id="R3_SCD_EDIT_36_itemPreview" class="R3_SCD_EDIT_61_camPreview">',
		'37': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_37_id">',
		'38': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_38_id">',
		'39': 'NO_EDIT',
		'3a': 'NO_EDIT',
		'3b': 'EM ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_3b_emId"> Obj ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_3b_objId">',
		'3c': 'NO_EDIT',
		'3d': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_3d_id">',
		'3e': 'Remove Item: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_3e_itemSeek" onkeyup="R3_SCD_EDIT_FUNCTION_seekItem(\'3e\');"> <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_3e_item" onchange="R3_SCD_FUNCTIONEDIT_updateItemPreview(\'R3_SCD_EDIT_3e_item\', \'R3_SCD_EDIT_3e_itemIconPrev\');"></select><br><br><img id="R3_SCD_EDIT_3e_itemIconPrev" class="R3_SCD_EDIT_61_camPreview">',
		'3f': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_3f_id"> Flag: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_3f_flag"></select>',
		'40': 'Variable: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_40_id"> Value: <input type="text" spellcheck="false" maxlength="4" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="0000" id="R3_SCD_EDIT_40_var">',
		'41': 'Variable: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_41_id"> Value: <input type="text" spellcheck="false" maxlength="4" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="0000" id="R3_SCD_EDIT_41_variable">',
		'42': 'NO_EDIT',
		'43': 'NO_EDIT',
		'44': 'NO_EDIT',
		'45': 'NO_EDIT',
		'46': 'ID: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_46_id" class="R3_EDIT_TEXT_XYZR"> Unk 0: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_46_unk0" class="R3_EDIT_TEXT_XYZR"> Fade Type: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_46_type"></select> Duration: <input type="number" min="0" max="255" maxlength="3" step="1" id="R3_SCD_EDIT_46_duration" class="R3_EDIT_TEXT_XYZR" placeholder="40"><br><div class="SEPARATOR-2"></div><div class="R3_SCD_DIV_COLOR_EDIT"><font class="cType_R">Color R</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_46_colorR_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_RGB(\'46\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_46_colorR" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_RGB(\'46\');" onchange="R3_SCD_FUNCTION_UPDATE_RGB(\'46\');"><br><font class="cType_G">Color G</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_46_colorG_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_RGB(\'46\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_46_colorG" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_RGB(\'46\');" onchange="R3_SCD_FUNCTION_UPDATE_RGB(\'46\');"><br><font class="cType_B">Color B</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_46_colorB_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_RGB(\'46\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_46_colorB" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_RGB(\'46\');" onchange="R3_SCD_FUNCTION_UPDATE_RGB(\'46\');"><br><input type="button" value="Color Picker" onclick="R3_SCD_FUNCTION_LIT_COLOR_PICKER(\'46\');" class="BTN_R3CLASSIC"><br><div class="R3_SCD_DIV_COLOR_PREVIEW" id="R3_SCD_EDIT_46_rgbDivPreview">Color Preview</div><div class="SEPARATOR-2"></div><font class="cType_C">Color C</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_46_colorC_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_CMY(\'46\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_46_colorC" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_CMY(\'46\');" onchange="R3_SCD_FUNCTION_UPDATE_CMY(\'46\');"><br><font class="cType_M">Color M</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_46_colorM_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_CMY(\'46\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_46_colorM" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_CMY(\'46\');" onchange="R3_SCD_FUNCTION_UPDATE_CMY(\'46\');"><br><font class="cType_Y">Color Y</font>: <input type="range" min="0" max="255" step="1" id="R3_SCD_EDIT_46_colorY_range" class="R3_RANGE" oninput="R3_SCD_FUNCTION_UPDATE_RANGE_CMY(\'46\');"> <input type="number" maxlength="3" min="0" max="255" step="1" placeholder="127" id="R3_SCD_EDIT_46_colorY" class="R3_EDIT_TEXT_XYZR" onkeyup="R3_SCD_FUNCTION_UPDATE_CMY(\'46\');" onchange="R3_SCD_FUNCTION_UPDATE_CMY(\'46\');"><br></div>',
		'47': 'Set the Target <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_47_target"></select> as ID <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_47_value">',
		'48': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_48_id"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_48_value">',
		'49': 'NO_EDIT',
		'4a': 'NO_EDIT',
		'4b': 'NO_EDIT',
		'4c': 'Checks if <select id="R3_SCD_EDIT_4c_event" class="SELECT_SETTINGS auto"></select> <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_4c_value"> is / are <select id="R3_SCD_EDIT_4c_flag" class="SELECT_SETTINGS auto"></select>',
		'4d': 'Event Track: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_4d_id"> Set <input type="text" spellcheck="false" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_4d_varSearch" onchange="R3_SCD_FUNCTION_SEARCH_SETVAR();" onkeyup="R3_SCD_FUNCTION_SEARCH_SETVAR();"> <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_4d_var"></select> <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_4d_boolean"></select>',
		'4e': 'NO_EDIT',
		'4f': 'NO_EDIT',
		'50': 'Next Camera: <input type="number" maxlength="3" autocomplete="off" class="R3_EDIT_TEXT_XYZR" min="0" max="255" step="1" placeholder="0" id="R3_SCD_EDIT_50_id" oninput="R3_SCD_FUNCTION_CAM_PREVIEW(\'R3_SCD_EDIT_50_id\', \'R3_SCD_function_50_camPreview\');"><br><div id="R3_SCD_CAMERA_PREVIEW">Camera Preview:<br><br><img id="R3_SCD_function_50_camPreview" class="R3_SCD_EDIT_61_camPreview img-size-60-percent"></div>',
		'51': 'NO_EDIT',
		'52': 'Flag: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_52_flag"></select>',
		'53': 'The trigger for camera <input type="number" maxlength="3" min="0" max="255" step="1" autocomplete="off" oninput="R3_SCD_FUNCTION_EDIT_updateCutReplace();" onchange="R3_SCD_FUNCTION_EDIT_updateCutReplace();" class="R3_EDIT_TEXT_XYZR" placeholder="0" id="R3_SCD_EDIT_53_prevCamValue"> now will display camera <input type="number" maxlength="3" step="1" min="0" max="255" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="1" oninput="R3_SCD_FUNCTION_EDIT_updateCutReplace();" onchange="R3_SCD_FUNCTION_EDIT_updateCutReplace();" id="R3_SCD_EDIT_53_nextCamValue"><div class="SEPARATOR-2"></div><br><div class="align-center R3_SCD_EDIT_53_prevDiv">Previous Cam<br><img src="#" alt="R3_SCD_PREVIOUS_CAM" id="R3_SCD_EDIT_53_previousCam" class="R3_SCD_EDIT_53_camPreview"></div><div class="R3_SCD_EDIT_53_newArrowDiv"><img src="img/arrowNew.png" alt="newArrow"></div><div class="align-center R3_SCD_EDIT_53_nextDiv">Next Cam<br><img src="#" alt="R3_SCD_NEXT_CAM" id="R3_SCD_EDIT_53_nextCam" class="R3_SCD_EDIT_53_camPreview"></div>',
		'54': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_54_id"> Value: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" class="R3_EDIT_TEXT_XYZR" placeholder="00" id="R3_SCD_EDIT_54_value"> Flag: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_54_flag"></select>',
		'55': 'Target: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_55_target"> <font class="COLOR_X">X: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_55_posX"> <font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_55_posY"> <font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_55_posZ"> <input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" title="Click here to use current player location" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(4);">',
		'56': 'Target: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_56_target"> <font class="COLOR_X">X: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_56_posX"> <font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_56_posY"> <font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_56_posZ"> <input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" title="Click here to use current player location" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(5);">',
		'57': 'Data 0: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_57_data0"> Data 1: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_57_data1">',
		'58': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_58_id"> Data 0: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_58_data0"> Data 1: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_58_data1">',
		'59': 'NO_EDIT',
		'5a': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_5a_id">',
		'5b': 'Message ID: <input type="number" min="0" max="255" step="1" maxlength="3" placeholder="0" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_5b_id" onchange="R3_SCD_FUNCTIONEDIT_updateData0onAOT();" onkeyup="R3_SCD_FUNCION_displayMsgPreview();"> Data 0: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_5b_data0"> Display Mode: <select id="R3_SCD_EDIT_5b_displayMode" class="SELECT_SETTINGS auto"></select><br><br><div id="R3_SCD_EDIT_5b_msgPrevDiv"><div class="align-center"><font class="LBL_subTitle">Message Preview:</font><br><br><font id="R3_SCD_EDIT_5b_msgPrev" class="monospace mono_xyzr txt-italic">No preview available</font></div></div>',
		'5c': 'Value: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_5c_flag">',
		'5d': 'NO_EDIT',
		'5e': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_5e_id"> Value: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_5e_value">',
		'5f': 'Weapon: <select id="R3_SCD_EDIT_5f_weaponId" onchange="R3_SCD_FUNCTIONEDIT_updateItemPreview(\'R3_SCD_EDIT_5f_weaponId\', \'R3_SCD_EDIT_5f_itemIconPrev\');" class="SELECT_SETTINGS auto"></select><br><br><img class="R3_SCD_EDIT_61_camPreview" id="R3_SCD_EDIT_5f_itemIconPrev">',
		'60': 'NO_EDIT',
		'61': '<div class="R3_SCD_EDIT_LEFT">Door Position: <div class="R3_SCD_EDIT_61_posAlign"><font class="COLOR_X">X: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_posX" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_posY" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_posZ" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_R">R: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_posR" class="R3_EDIT_TEXT_XYZR"><input type="button" onclick="R3_SYS_COPY_POS(1);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_copyAlign" value="Copy Pos."><input type="button" onclick="R3_SYS_PASTE_POS(1);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_pasteAlign" value="Paste Pos."></div>Spawn Position: <div class="R3_SCD_EDIT_61_posAlign"><font class="COLOR_X">X: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_nextX" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_nextY" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_nextZ" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_R">R: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_61_nextR" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_zI">Z-Index: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_61_zIndex" class="R3_EDIT_TEXT_XYZR"><input type="button" onclick="R3_SYS_COPY_POS(2);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_copyAlign" value="Copy Pos."><input type="button" onclick="R3_SYS_PASTE_POS(2);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_pasteAlign" value="Paste Pos."></div></div><input type="button" onclick="R3_SCD_FUNCTIONEDIT_showUsePlayerPos(0);" id="R3_SCD_EDIT_61_usePlayerPosBtn" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos."><div id="R3_SCD_EDIT_61_usePlayerPosDiv" class="none"><input type="button" onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(0);" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos. on Door Pos."><input type="button" onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(1);" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos. on Spawn Pos."><input type="button" onclick="R3_SCD_FUNCTIONEDIT_showUsePlayerPos(1);" class="BTN_R3CLASSIC" value="Cancel"></div><input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY right" title="Click here to open SCD Door Link" onclick="R3_DESIGN_SCD_openDoorLink();" value="Open SCD DoorLink"><div class="SEPARATOR-4"></div><div class="R3_SCD_EDIT_doorInfos">ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" id="R3_SCD_EDIT_61_id" class="R3_EDIT_TEXT_HEX"> AOT: <input type="text" spellcheck="false" autocomplete="off" max="8" id="R3_SCD_EDIT_61_aot" class="R3_SCD_EDIT_61_aot" placeholder="00000000"> Stage: <input type="number" autocomplete="off" placeholder="00" min="1" max="7" step="1" maxlength="2" id="R3_SCD_EDIT_61_stage" class="R3_EDIT_TEXT_HEX" onchange="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'61\');" onmousewheel="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'61\');" onkeyup="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'61\');"> Room: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_61_roomNumber" class="R3_EDIT_TEXT_HEX" onkeyup="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'61\');"> Camera: <input type="number" spellcheck="false" autocomplete="off" maxlength="3" min="0" max="255" step="1" placeholder="00" id="R3_SCD_EDIT_61_nextCam" class="R3_EDIT_TEXT_HEX" oninput="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'61\');"><br>Door Type: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_61_doorType" class="R3_EDIT_TEXT_HEX"> Open Orientation: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_61_openOrient" class="R3_EDIT_TEXT_HEX"> <input type="checkbox" id="R3_SCD_EDIT_61_checkMagicDoor"><font title="Set this option enabled to disable door animation, making room transition more faster." class="cursor-pointer" onclick="R3_DESIGN_UTILS_processCheckBox(\'R3_SCD_EDIT_61_checkMagicDoor\', false);"> - Enable Magic Door</font><br><div class="SEPARATOR-4"></div>Lock Flag: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_61_lockFlag" class="R3_EDIT_TEXT_HEX"> Lock Key: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_61_lockKey"></select><br>Display Message: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_61_displayText"></select> Unk Value: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_61_unk0" placeholder="00"></div><div class="R3_SCD_EDIT_doorPreview">This door will leads to <font class="monospace mono_xyzr">R<font id="R3_SCD_EDIT_61_lblNextStage">???</font><font id="R3_SCD_EDIT_61_lblNextRoom">???</font>.RDT</font><br>Next Cam:<br><br><img class="R3_SCD_EDIT_61_camPreview" id="R3_SCD_EDIT_61_camPreview"></div>',
		'62': '<div class="R3_SCD_EDIT_LEFT">Door Position: <div class="R3_SCD_EDIT_61_posAlign"><font class="COLOR_X">X: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_posX" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_posY" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_posZ" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_R">R: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_posR" class="R3_EDIT_TEXT_XYZR"><input type="button" onclick="R3_SYS_COPY_POS(3);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_copyAlign" value="Copy Pos."><input type="button" onclick="R3_SYS_PASTE_POS(3);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_pasteAlign" value="Paste Pos."></div>Spawn Position: <div class="R3_SCD_EDIT_61_posAlign"><font class="COLOR_X">X: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_nextX" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_nextY" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_nextZ" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_R">R: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_62_nextR" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_zI">Z-Index: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_62_zIndex" class="R3_EDIT_TEXT_XYZR"><input type="button" onclick="R3_SYS_COPY_POS(4);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_copyAlign" value="Copy Pos."><input type="button" onclick="R3_SYS_PASTE_POS(4);" class="BTN_R3CLASSIC R3_SCD_EDIT_61_pasteAlign" value="Paste Pos."></div></div><input type="button" onclick="R3_SCD_FUNCTIONEDIT_showUsePlayerPos(0);" id="R3_SCD_EDIT_62_usePlayerPosBtn" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos."><div id="R3_SCD_EDIT_62_usePlayerPosDiv" class="none"><input type="button" onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(2);" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos. on Door Pos."><input type="button" onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(3);" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos. on Spawn Pos."><input type="button" onclick="R3_SCD_FUNCTIONEDIT_showUsePlayerPos(1);" class="BTN_R3CLASSIC" value="Cancel"></div><input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY right" title="Click here to open SCD Door Link" onclick="R3_DESIGN_SCD_openDoorLink();" value="Open SCD DoorLink"><div class="SEPARATOR-4"></div><div class="R3_SCD_EDIT_doorInfos">ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" id="R3_SCD_EDIT_62_id" class="R3_EDIT_TEXT_HEX"> AOT: <input type="text" spellcheck="false" autocomplete="off" max="8" id="R3_SCD_EDIT_62_aot" class="R3_SCD_EDIT_61_aot" placeholder="00000000"> Stage: <input type="number" autocomplete="off" placeholder="00" min="1" max="7" step="1" maxlength="2" id="R3_SCD_EDIT_62_stage" class="R3_EDIT_TEXT_HEX" onchange="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'62\');" onmousewheel="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'62\');" onkeyup="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'62\');"> Room: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_62_roomNumber" class="R3_EDIT_TEXT_HEX" onkeyup="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'62\');"> Camera: <input type="number" spellcheck="false" autocomplete="off" maxlength="3" min="0" max="255" step="1" placeholder="00" id="R3_SCD_EDIT_62_nextCam" class="R3_EDIT_TEXT_HEX" oninput="R3_SCD_FUNCTIONEDIT_updateCamPreview(\'62\');"><br>Door Type: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_62_doorType" class="R3_EDIT_TEXT_HEX"> Open Orientation: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_62_openOrient" class="R3_EDIT_TEXT_HEX"> 4P: <input type="text" spellcheck="false" autocomplete="off" id="R3_SCD_EDIT_62_4P" maxlength="16" class="R3_SCD_EDIT_4P" placeholder="0000000000000000"><br><input type="checkbox" id="R3_SCD_EDIT_62_checkMagicDoor"><font title="Set this option enabled to disable door animation, making room transition more faster." class="cursor-pointer" onclick="R3_DESIGN_UTILS_processCheckBox(\'R3_SCD_EDIT_62_checkMagicDoor\', false);"> - Enable Magic Door</font><br><div class="SEPARATOR-4"></div>Lock Flag: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" id="R3_SCD_EDIT_62_lockFlag" class="R3_EDIT_TEXT_HEX"> Lock Key: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_62_lockKey"></select><br>Display Message: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_62_displayText"></select> Unk Value: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_62_unk0" placeholder="00"></div><div class="R3_SCD_EDIT_doorPreview">This door will leads to <font class="monospace mono_xyzr">R<font id="R3_SCD_EDIT_62_lblNextStage">???</font><font id="R3_SCD_EDIT_62_lblNextRoom">???</font>.RDT</font><br>Next Cam:<br><br><img class="R3_SCD_EDIT_61_camPreview" id="R3_SCD_EDIT_62_camPreview"></div>',
		'63': 'AOT: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_63_aot" onchange="R3_SCD_FUNCTIONEDIT_updateAotSetLabels();"></select><br><div class="SEPARATOR-2"></div>ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_id"> Type: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_type"> Z-Index: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_nFloor"> Super: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_super"><br><div class="SEPARATOR-2"></div><font class="COLOR_X">X: </font> <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_posX"> <font class="COLOR_Y">Y: </font> <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_posY"> Width: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_width"> Height: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_height"><br><input type="button" class="BTN_R3CLASSIC" value="Copy Pos." onclick="R3_SYS_COPY_POS(5);"> <input type="button" class="BTN_R3CLASSIC" value="Paste Pos." onclick="R3_SYS_PASTE_POS(5);"> <input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(12);"><br><div class="SEPARATOR-2"></div><font id="R3_SCD_EDIT_63_LBL_data0">Data 0</font>: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_data0" onkeyup="R3_SCD_FUNCTIONEDIT_updateData0onAOT();" onchange="R3_SCD_FUNCTIONEDIT_updateData0onAOT();"> <font id="R3_SCD_EDIT_63_LBL_data1">Data 1</font>: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_data1"> <font id="R3_SCD_EDIT_63_LBL_data2">Data 2</font>: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_data2"> <font id="R3_SCD_EDIT_63_LBL_data3">Data 3</font>: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_63_data3"><br>Display Mode: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_63_displayMode"></select><br><br><div id="R3_SCD_EDIT_63_msgPrevDiv"><div class="align-center"><font class="LBL_subTitle">Message Preview:</font><br><br><font id="R3_SCD_EDIT_63_msgPrev" class="monospace mono_xyzr txt-italic">No preview available</font></div></div>',
		'64': 'NO_EDIT',
		'65': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_id"> AOT: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_aot"> Type: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_type"> Unk 0: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_unk0"> Unk 1: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_unk1"> Unk 2: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_unk2"><br><div class="SEPARATOR-2"></div>Unk 3: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_unk3"> Num: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_num"> Flag: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_65_flag">',
		'66': 'Object ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_66_id" onchange="R3_SCD_FUNCTION_updateAotOnPreview();" onkeydown="R3_SCD_FUNCTION_updateAotOnPreview();" onkeyup="R3_SCD_FUNCTION_updateAotOnPreview();"><br>Target: <font class="monospace mono_xyzr" id="R3_SCD_EDIT_66_lblTarget">No preview available</font>',
		'67': 'Item: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_67_itemSeek" onkeyup="R3_SCD_EDIT_FUNCTION_seekItem(\'67\');"> <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_67_item" onchange="R3_SCD_FUNCTIONEDIT_updateItemPreview(\'R3_SCD_EDIT_67_item\', \'R3_SCD_EDIT_67_itemIconPrev\');"></select> Quantity: <input type="number" autocomplete="off" placeholder="15" min="0" max="255" maxlength="3" id="R3_SCD_EDIT_67_quant" class="R3_EDIT_TEXT_XYZR"><br><div class="SEPARATOR-2"></div>ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_67_id"> AOT: <input type="text" spellcheck="false" autocomplete="off" placeholder="00000000" maxlength="2" class="R3_SCD_EDIT_61_aot" id="R3_SCD_EDIT_67_aot"> Item Flag: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_67_iFlag"> 3D Object ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_67_modelId"><br>Unk 0: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_67_unk0"> Unk 1: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_67_unk1">Unk 2: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_67_unk2"><br><div class="SEPARATOR-2"></div>Blink Color: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_67_blinkColor"></select> <input type="checkbox" id="R3_SCD_EDIT_67_playerCrouch" checked="false"><font class="cursor-pointer" title="Set this enabled to run crouch animation" onclick="R3_DESIGN_UTILS_processCheckBox(\'R3_SCD_EDIT_67_playerCrouch\');"> - Enable Crouch Animation</font><br><div class="SEPARATOR-2"></div><font class="COLOR_X">X: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_67_posX" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_67_posY" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_67_posZ" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_R">R: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_67_posR" class="R3_EDIT_TEXT_XYZR"> <input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(6);" title="Click here to use player pos."><br><br><img id="R3_SCD_EDIT_67_itemIconPrev" class="R3_SCD_EDIT_61_camPreview">',
		'68': 'Item: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_68_itemSeek" onkeyup="R3_SCD_EDIT_FUNCTION_seekItem(\'68\');"> <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_68_item" onchange="R3_SCD_FUNCTIONEDIT_updateItemPreview(\'R3_SCD_EDIT_68_item\', \'R3_SCD_EDIT_68_itemIconPrev\');"></select> Quantity: <input type="number" autocomplete="off" placeholder="15" min="0" max="255" maxlength="3" id="R3_SCD_EDIT_68_quant" class="R3_EDIT_TEXT_XYZR"><br><div class="SEPARATOR-2"></div>ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_68_id"> AOT: <input type="text" spellcheck="false" autocomplete="off" placeholder="00000000" maxlength="2" class="R3_SCD_EDIT_61_aot" id="R3_SCD_EDIT_68_aot"> Item Flag: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_68_iFlag"> 3D Object ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_68_modelId"><br>Unk 0: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_68_unk0"> Unk 1: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_68_unk1">Unk 2: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_68_unk2">4P: <input type="text" spellcheck="false" autocomplete="off" id="R3_SCD_EDIT_68_4P" maxlength="16" class="R3_SCD_EDIT_4P" placeholder="0000000000000000"><br><div class="SEPARATOR-2"></div>Blink Color: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_68_blinkColor"></select> <input type="checkbox" id="R3_SCD_EDIT_68_playerCrouch" checked="false"><font class="cursor-pointer" title="Set this enabled to run crouch animation" onclick="R3_DESIGN_UTILS_processCheckBox(\'R3_SCD_EDIT_68_playerCrouch\');"> - Enable Crouch Animation</font><div class="SEPARATOR-2"></div><font class="COLOR_X">X: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_68_posX" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_68_posY" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_68_posZ" class="R3_EDIT_TEXT_XYZR"><font class="COLOR_R">R: </font><input type="text" spellcheck="false" autocomplete="off" maxlength="4" placeholder="0000" id="R3_SCD_EDIT_68_posR" class="R3_EDIT_TEXT_XYZR"><input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(10);" title="Click here to use player pos."><br><br><img id="R3_SCD_EDIT_68_itemIconPrev" class="R3_SCD_EDIT_61_camPreview">',
		'69': 'NO_EDIT',
		'6a': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_id"> AOT: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_aot"> Data 0: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_data0"> Data 1: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_data1"> Data 2: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_data2"><br><div class="SEPARATOR-2"></div><font class="COLOR_X">X</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_posX"> <font class="COLOR_Y">Y</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_posY"> <font class="COLOR_Z">Z</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6a_posZ">',
		'6b': 'Check if the player have the item: <input type="text" spellcheck="false" autocomplete="off" maxlength="2" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6b_itemSeek" onkeyup="R3_SCD_EDIT_FUNCTION_seekItem(\'6b\');"> <select id="R3_SCD_EDIT_6b_item" class="SELECT_SETTINGS auto" onchange="R3_SCD_FUNCTIONEDIT_updateItemPreview(\'R3_SCD_EDIT_6b_item\', \'R3_SCD_EDIT_6b_itemIconPrev\');"></select><br><br><img id="R3_SCD_EDIT_6b_itemIconPrev" class="R3_SCD_EDIT_61_camPreview">',
		'6c': 'Check if <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6c_value"> is <select id="R3_SCD_EDIT_6c_flag" class="SELECT_SETTINGS auto"></select>',
		'6d': 'Flag: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6d_flag"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6d_value">',
		'6e': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6e_id"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6e_value">',
		'6f': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_6f_id">',
		'70': 'NO_EDIT',
		'71': 'NO_EDIT',
		'72': 'NO_EDIT',
		'73': 'NO_EDIT',
		'74': 'NO_EDIT',
		'75': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_75_id">',
		'76': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_76_id"> Value: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_76_value">',
		'77': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" placeholder="00" id="R3_SCD_EDIT_77_id" class="R3_EDIT_TEXT_XYZR"> Sound: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_77_type"> Data 1: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_77_data1"> Work: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_77_work"> Data 3: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_77_data3"><br><font class="COLOR_X">X: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_77_posX"> <font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_77_posY"> <font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" maxlength="4" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_77_posZ"> <input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" title="Click here to use current player location" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(7);">',
		'78': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" placeholder="00" id="R3_SCD_EDIT_78_id" class="R3_EDIT_TEXT_XYZR"> OP: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" placeholder="00" id="R3_SCD_EDIT_78_op" class="R3_EDIT_TEXT_XYZR"> Type: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" id="R3_SCD_EDIT_78_type" class="R3_EDIT_TEXT_XYZR"> Value: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" id="R3_SCD_EDIT_78_value" class="R3_EDIT_TEXT_XYZR"> Volume: <input type="range" min="0" max="255" step="1" value="127" class="R3_RANGE" id="R3_SCD_EDIT_78_volume" oninput="R3_DESIGN_UPDATE_RANGES(\'R3_SCD_EDIT_78_volume\', \'R3_SCD_EDIT_78_lblVolume\', true, 255);"> <font id="R3_SCD_EDIT_78_lblVolume">127</font>%',
		'79': 'ID: <input type="text" spellcheck="false" maxlength="2" autocomplete="off" placeholder="00" id="R3_SCD_EDIT_79_id" class="R3_EDIT_TEXT_XYZR"> Data: <input type="text" spellcheck="false" maxlength="4" autocomplete="off" placeholder="0000" id="R3_SCD_EDIT_79_data" class="R3_EDIT_TEXT_XYZR">',
		'7a': 'Cinematic ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" class="R3_EDIT_TEXT_XYZR" maxlength="2" id="R3_SCD_EDIT_7a_movieId">',
		'7b': 'ID 0: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7b_id0"> ID 1: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7b_id1"> Type: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7b_type">',
		'7c': 'NO_EDIT',
		'7d': 'ID: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_id"> Unk 0: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_unk0"> Type: <select id="R3_SCD_EDIT_7d_type" class="SELECT_SETTINGS auto"></select> Pose: <select id="R3_SCD_EDIT_7d_pose" class="SELECT_SETTINGS auto"></select><br>Unk 1: <input type="text" spellcheck="false" autocomplete="off" placeholder="44" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_unk1"> Unk 2: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="6" class="R3_SCD_EDIT_61_aot" id="R3_SCD_EDIT_7d_unk2"> Sound Set: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_soundSet"> Texture: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_texture"> Flag: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_flag"> Motion: <input type="text" spellcheck="false" autocomplete="off" placeholder="00" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_motion">CtrlFlag: <input type="text" spellcheck="false" autocomplete="off" placeholder="00000000" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_ctrlFlag"> <div class="SEPARATOR-2"></div><font class="COLOR_X">X: </font><input type="text" spellcheck="false" autocomplete="off" placeholder="0000" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_posX"> <font class="COLOR_Y">Y: </font><input type="text" spellcheck="false" autocomplete="off" placeholder="0000" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_posY"> <font class="COLOR_Z">Z: </font><input type="text" spellcheck="false" autocomplete="off" placeholder="0000" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_posZ"> <font class="COLOR_R">R: </font><input type="text" spellcheck="false" autocomplete="off" placeholder="0000" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7d_posR"> <input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(11);" title="Click here to use player pos.">',
		'7e': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7e_id">',
		'7f': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_id"> Type: <select id="R3_SCD_EDIT_7f_AOT" class="SELECT_SETTINGS auto"></select> Move Type: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_moveType"> Pattern: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_pattern"> Data 0: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_data0"><br>Speed: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_speed"> Z-Index: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_zIndex"> Super ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_superID"> Set Flag: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_setFlag"> Be Flag: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_beFlag"> Bool Type: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_boolType"><br>Colission: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_7f_setColission"></select> Colission Shape: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_7f_colType"></select> Opacity: <input type="text" spellcheck="false" placeholder="00" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_visibility"><br><div class="SEPARATOR-4"></div><div class="R3_SCD_EDIT_7F_divHolder"><div class="R3_SCD_EDIT_7F_posDiv"><font class="monospace mono_xyzr COLOR_X">X Pos</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR R3_SCD_EDIT_7F_xyzrFix" id="R3_SCD_EDIT_7f_xPos"> <font class="monospace mono_xyzr COLOR_Y"><br>Y Pos</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR R3_SCD_EDIT_7F_xyzrFix" id="R3_SCD_EDIT_7f_yPos"> <font class="monospace mono_xyzr COLOR_Z"><br>Z Pos</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR R3_SCD_EDIT_7F_xyzrFix" id="R3_SCD_EDIT_7f_zPos"><br><input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(13);"></div><div class="R3_SCD_EDIT_7F_posDiv"><font class="monospace mono_xyzr COLOR_X">X Dir</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_xDir"><br><font class="monospace mono_xyzr COLOR_Y">Y Dir</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_yDir"><br><font class="monospace mono_xyzr COLOR_Z">Z Dir</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_zDir"><br><input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(14);"></div><div class="R3_SCD_EDIT_7F_posDiv"><font class="monospace mono_xyzr COLOR_X">Colission X</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_xColPos"><br><font class="monospace mono_xyzr COLOR_Y">Colission Y</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_yColPos"><br><font class="monospace mono_xyzr COLOR_Z">Colission Z</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_zColPos"><br><input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(15);" value="Use Player Pos."></div><div class="R3_SCD_EDIT_7F_posDiv"><font class="monospace mono_xyzr COLOR_X">Colission Dir X</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_xColDir"><br><font class="monospace mono_xyzr COLOR_Y">Colission Dir Y</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_yColDir"><br><font class="monospace mono_xyzr COLOR_Z">Colission Dir Z</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_7f_zColDir"><br><input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(16);"></div>',
		'80': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_80_id"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_80_value"> Type: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_80_type">',
		'81': 'Animation: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_81_animation" onchange="R3_SCD_EDIT_FUNCTION_PLC_DEST();"></select> Anim Modifier: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_81_animModifier"><br><div class="SEPARATOR-2"></div><font id="R3_SCD_EDIT_81_labelDataA">???</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_81_dataA"> <font id="R3_SCD_EDIT_81_labelDataB">???</font>: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_81_dataB"><br><div id="R3_SCD_EDIT_81_extraDiv"></div>',
		'82': 'Animation: <select class="SELECT_SETTINGS auto" id="R3_SCD_EDIT_82_type" onchange="R3_SCD_EDIT_FUNCTION_PLC_NECK_updateLabels();"></select> Repeat: <input type="number" min="0" max="255" maxlength="3" step="1" placeholder="0" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_82_repeat"> Speed: <input type="number" min="0" max="255" step="1" id="R3_SCD_EDIT_82_speed" class="R3_EDIT_TEXT_XYZR"><br><div class="SEPARATOR-2"></div><font id="R3_SCD_EDIT_82_lbl_DATA_0">???</font>: <input type="text" spellcheck="false" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_82_DATA_0"> <font id="R3_SCD_EDIT_82_lbl_DATA_1">???</font>: <input type="text" spellcheck="false" placeholder="0000" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_82_DATA_1"> <font id="R3_SCD_EDIT_82_lbl_DATA_2">???</font>: <input type="text" spellcheck="false" placeholder="0000" maxlength="4" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_82_DATA_2"> <font id="R3_SCD_EDIT_82_lbl_DATA_3">???</font>: <input type="text" spellcheck="false" placeholder="00" maxlength="2" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_82_DATA_3">',
		'83': 'NO_EDIT',
		'84': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_84_id"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_84_value">',
		'85': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_85_id">',
		'86': 'NO_EDIT',
		'87': 'NO_EDIT',
		'88': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_88_id"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_88_value">',
		'89': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_89_id">',
		'8a': 'NO_EDIT',
		'8b': 'NO_EDIT',
		'8c': 'NO_EDIT',
		'8d': 'NO_EDIT',
		'8e': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_8e_id"> Value: <input type="text" spellcheck="false" maxlength="4" placeholder="0000" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_8e_value">',
		'8f': 'ID: <input type="text" spellcheck="false" maxlength="2" placeholder="00" autocomplete="off" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EDIT_8f_id">',
		/*
			Extra things
			Here will be set extra tools!
		*/
		// Insert Hex Code
		'90': '<div class="align-center">The function <font class="monospace mono_xyzr no-bg-image" id="R3_SCD_EXTRA_EDIT_INSERT_FNAME">???</font> will be set at position <input type="number" onchange="R3_DESIGN_UPDATE_INSERT_HEX_POS();" onkeyup="R3_DESIGN_UPDATE_INSERT_HEX_POS();" min="1" step="1" maxlength="999999" class="R3_EDIT_TEXT_XYZR" id="R3_SCD_EXTRA_EDIT_INSERT_POS"><br><br>Script Preview: <br><br><div class="R3_SCD_EDIT_CHECK_LENGTH" id="R3_SCD_EDIT_90_scriptPreview"></div></div>'
	},
	/*
		RID Decompiler infos
	*/
	R3_RID_DEC_DB = {
		type: [0, 4],
		unk0: [4, 8],
		posR: [8, 12],
		uFF0: [12, 16], 
		posZ: [16, 20],
		uFF1: [20, 24],
		posY: [24, 28],
		uFF2: [28, 32],
		posX: [32, 36],
		uFF3: [36, 40],
		unk1: [40, 44],
		uFF4: [44, 48],
		unk2: [48, 52],
		uFF5: [52, 56],
		unk3: [56, 60],
		unk4: [60, 64]
	},
	/*
		Game Items
	*/
	DATABASE_ITEM = {
		'00': ['Empty Slot', 									   ''],
		'01': ['Combat Knife', 									   'It is a simple combat Knife<br><br>It can be very useful when you are low on ammunition. In the hand of those who know how to use, it does damage!'],
		'02': ['Sigpro SP 2009 handgun', 						   'Sigpro SP 2009 Handgun<br><br>This is the Carlos alternative pistol.<br>Not a big deal but it can help you if you\'re in the worst...'],
		'03': ['Beretta M92F handgun',   						   'M92F special version of S.T.A.R.S made by Kendo.<br><br>There is a legend has it that those who have no life play using it without ever reloading.'],
		'04': ['Shotgun Benelli M3S', 							   'This is a Benelli M3S Shotgun but with a sawed-off barrel.<br><br>It can be a great help if you aim up when you have an enemy nearby!'],
		'05': ['Magnum M629C', 									   'Smith & Wesson M629C .44-caliber magnum revolver<br>It\'s a magnum boy! Just shoot the foot and the head explodes!<br>Even though it\'s absurdly powerful, it doesn\'t quite match the magnum of the previous games. (design)'],
		'06': ['Hk-p Grenade launcher (Normal rounds)',			   'Hk-p Grenade launcher with normal rounds<br><br>It is extremely effective against most enemies in the game.'],
		'07': ['Hk-p Grenade launcher (Fire rounds)',			   'Hk-p Grenade launcher with fire rounds<br><br>It is extremely effective against most enemies in the game.'],
		'08': ['Hk-p Grenade launcher (Acid rounds)',			   'Hk-p Grenade launcher with acid rounds<br><br>It is extremely effective against the worm you find in the cemetery (park).'],
		'09': ['Hk-p Grenade launcher (Freeze rounds)',			   'Hk-p Grenade launcher with freeze rounds<br><br>It is extremely effective in battles against nemesis.'],
		'0a': ['M66 Rocket Launcher', 							   'M66 Rocket Launcher<br><br>By far, this is the best gun of all!<br><br>...but Jesus Christ, it take so long to aim!'],
		'0b': ['Gatling Gun', 									   'Gatling Gun<br><br>One of the most powerful weapons available. The only thing that is bad about her is the time it takes her to fire her projectiles.'],
		'0c': ['Mine Thrower', 									   'By far is one of the most different weapons in the game.<br><br>The best use is in the final battle!'],
		'0d': ['STI Eagle 6.0', 								   'This gun shoots faster than standard pistol and also has a chance to hit the enemy with critical damage, exploding his head (zombie).'],
		'0e': ['M4A1 Assault Rifle (Auto Mode)', 				   'M4A1 Assault Rifle in Auto Mode.<br><br>It\'s a good rifle for those learning how to play the game, but know that there are weapons that are better than it.'],
		'0f': ['M4A1 Assault Rifle (Manual Mode)', 				   'M4A1 Assault Rifle in Manual Mode.<br><br>It\'s a good rifle for those learning how to play the game, but know that there are weapons that are better than it.'],
		'10': ['Western Custom M37',							   'Western Custom M37 lever action shotgun<br><br>It has a bigger hitbox and can fire faster than the Benelli M3S but on the other hand can\'t shoot stronger projectiles.<br><br>Use when you have several enemies ahead!'],
		'11': ['Sigpro SP 2009 E', 							       'It\'s the same Sigpro that Carlos uses, but with improved bullets.'],
		'12': ['Beretta M92F E',    							   'It\'s the same M93F that Jill uses, only with more powerful bullets.<br><br>The sound of the shot hurts more than the bullet itself!'],
		'13': ['Shotgun Benelli M3S E',        					   'Shotgun Benelli M3S E<br><br>This is the same shotgun, but with bullets that do much more damage than usual.'],
		'14': ['Mine Thrower E',					 			   'This is an improved version of the Mine thrower, with stronger bullets following the enemy.'],
		'15': ['Handgun bullets (9x19 parabellum)', 			   'Ordinary pistol ammunition. You can load 255 of them per inventory slot!'],
		'16': ['Magnum bullets (.44-caliber)', 					   'Smith & Wesson M629C .44 Magnum Ammo.<br><br>Keep in mind that you won\'t find this type of ammunition that easy, so use it wisely'],
		'17': ['Shotgun shells', 								   'You don\'t find that kind of ammunition that easy, so use them wisely!'],
		'18': ['Grenade rounds', 								   '\"Simple\" damage ammo - Ideal for eliminating common enemies.'],
		'19': ['Flame rounds', 									   'Moderate damage ammo - Ideal for eliminating different enemies.'],
		'1a': ['Acid rounds', 									   'Advance damage ammo - Ideal for fighting the worm in the park\'s cemetery.'],
		'1b': ['Freeze rounds', 								   'Extreme damage ammo - Ideal for fighting nemesis.'],
		'1c': ['Minethrower rounds', 							   'Mine thrower ammunition - Perfect for use in conveniently positioned incinerator locations!'],
		'1d': ['Assault Rifle clip (5.56 NATO rounds)', 		   'M4A1 Rifle Ammo - This is the type of ammo you only find in the protagonist\'s item box!'],
		'1e': ['Enhanced handgun bullets', 						   'Improved Pistol Bullets.<br>Use and abuse the Reloading tool to get them!'],
		'1f': ['Enhanced shotgun shells', 						   'Improved Shotgun shells - Use and abuse the Reloading tool to get them!.'],
		'20': ['First aid spray', 								   'This spray can recover your entire life minus the poison status.'],
		'21': ['Green Herb', 									   'This herb can heal only a little of your life without removing the poisoning status.'],
		'22': ['Blue Herb', 									   'Used to remove poison status.<br><br>On <u>NIGHTMARE MOD</u>, combine two of these to make a green herb!'],
		'23': ['Red Herb',										   'It alone does absolutely nothing - but when combined with the green, it heals your life completely.'],
		'24': ['2x Green Herbs', 						    	   'This combination can heal a little more than one herb, but it does not fully restore its life and does not remove poisoning status.'],
		'25': ['Mix of Green and Blue Herbs', 					   'This combination can heal some of your life and remove the poison status.'],
		'26': ['Mix of Green and Red Herbs', 					   'This combination can heal your life completely without removing poisoning status.'],
		'27': ['Mix of 3 Green Herbs', 							   'This combination can heal your life completely without removing poisoning status.'],
		'28': ['Mix of 2x Green Herbs + Blue Herb', 			   'This combination can heal little more than a green weed alone and removes the poison status.'],
		'29': ['Mix of all Herbs',		     					   'This combination completely heals your life, including removing the poison status of the current character.'],
		'2a': ['First aid spray kit',	 						   'This is a kit of Aid Spray that supports up to three first aid kit units.'],
		'2b': ['Square crank', 									   'Square Tip Crank - Used in uptown to open a cabinet full of grenade launcher bullets.'],
		'2c': ['(BOTU) Red Coin',								   'BOTU!<br><br>A coin with the symbol of \"Nosferatu\" in red color.<br><br>Item discarded during the development process.'],
		'2d': ['(BOTU) Blue Coin', 							   	   'BOTU!<br><br>A coin with the symbol of \"Nosferatu\" in blue color.<br><br>Item discarded during the development process.'],
		'2e': ['(BOTU) Golden Coin',							   'BOTU!<br><br>A coin with the symbol of \"Nosferatu\" in golden color.<br><br>Item discarded during the development process.'],
		'2f': ['Jill\'s S.T.A.R.S card', 						   'Jill Valentine S.T.A.R.S ID Card.<br>Used to get the drawer password in the RPD file room if you run away from nemesis.'],
		'30': ['(BOTU) Oil can labelled \'Giga Oil\'',    		   'BOTU!<br><br>This item would be used to make the item \"Mixed Oil\".<br><br>Item discarded during the development process.'],
		'31': ['Battery', 										   'Battery used to power the elevator that leads to the power station in Downtown.'],
		'32': ['Fire hook', 									   'Crowbar used to open a trapdoor in the restaurant.'],
		'33': ['Power cable', 									   'Power cord found in a car in a garage parking lot.<br>Use it on the trolley to make it work.'],
		'34': ['Fuse', 											   'Fuse obtained at the power station. <br> Use it on the trolley to make it work.'],
		'35': ['(BOTU) Cut Fire Hose',							   'BOTU!<br>Supposedly this fire hose was supposed to be cut off to make you roam even further around the city!<br><br>Item discarded during the development process.'],
		'36': ['Oil Additive', 									   'Additive to be mixed with oil found at the gas station.'],
		'37': ['Brad Vicker\'s card case', 						   'Brad Vickers Wallet.<br>Inside is a ID Card.'],
		'38': ['Brad Vicker\'s S.T.A.R.S card',					   'Brad Vickers S.T.A.R.S ID Card<br><br>Used to get the drawer password in the RPD file room.<br><br>Also, the combinations are: 0513, 0131, 4011 or 4312.'],
		'39': ['Machine oil', 									   'This item alone has no use. Combine it with Oil Additive to get the item Mixed Oil.'],
		'3a': ['Mixed oil', 									   'Use this item near the fuse and power cord to make the tram move.'],
		'3b': ['(BOTU) Chains',  							   	   'BOTU!<br><br>These chains were meant to be where you find bullets in the warehouse.<br><br>Item discarded during the development process.'],
		'3c': ['Wrench', 										   'Wrench used to remove the fire hose in Uptown and open the door to the gas station.'],
		'3d': ['Iron pipe', 									   'Iron pipe used in a fireplace in a cemetery storeroom after burning all the firewood present.<br><br>Serves to reveal a secret passage.'],
		'3e': ['(BOTU) Fire hose tip', 							   'BOTU!<br><br>Item that is supposed to be used to match the missing fire hose.<br><br>Item discarded during the development process.'],
		'3f': ['Fire hose', 									   'Fire hose used to put out the fire in a corridor in uptown.'],
		'40': ['Tape recorder', 								   'Audio recorder (aka. Walkman) containing the voice of a doctor describing an elbow fracture.<br><br>Used to open the elevator in the hospital.'],
		'41': ['Lighter oil', 									   'Lighter Fluid<br><br>Use it with the lighter closed to get the lighter open.'],
		'42': ['Lighter (Closed)', 				  				   'A lighter that is out of fluid.<br>Combine with Lighter oil to get the lighter open.'],
		'43': ['Lighter (Open)', 				  				   'A lighter that has fluid. It serves to light fireplaces in cemeteries and burn ropes full of oil.'],
		'44': ['Green gem', 									   'Green gem used to open the gate of raccoon City Hall.<br><br>Congratulations to those who had the brilliant idea<br>Design 10/10!'],
		'45': ['Blue gem', 										   'Blue gem used to open the gate of raccoon City Hall.<br><br>Congratulations to those who had the brilliant idea<br>Design 10/10'],
		'46': ['Amber ball', 									   'A brown sphere made of resin extracted from fossilized trees.<br><br>This item is used in the puzzle of the three clocks in the clock tower.'],
		'47': ['Obsidian ball', 								   'Also known as <font title="In Brazilian Portuguese, of course!">Obsidiena</font>, This is a black glass sphere made by a chemical reaction of volcanic lava when cooled. <br> <br> This item is used in the puzzle of the three clocks in the clock tower.'],
		'48': ['Crystal ball', 									   'A simple crystal sphere, used together with two others in a clock tower puzzle.'],
		'49': ['(BOTU) Remote control without Batteries',      	   'BOTU!<br><br>A Remote Control that is out of batteries.<br>I suppose it would be used at the pharmacy to see what the current password is (Aquacure, Safsprin or Adravil).<br><br>Item discarded during the development process.'],
		'4a': ['(BOTU) Remote control with Batteries', 			   'BOTU!<br><br>A remote control that has batteries.<br>I suppose it would be used at the pharmacy to see what the current password is (Aquacure, Safsprin or Adravil).<br><br>Item discarded during the development process.'],
		'4b': ['(BOTU) AA Batteries',		 					   'BOTU!<br><br>A pair of batteries that would be used to combine with the Remote Without Batteries. It would be used to turn on the Pharmacy TV.<br><br>Item discarded during the development process.'],
		'4c': ['Gold gear', 									   'A golden gear that is part of a mechanical clock system.<br><br>Combine with Silver Gear to form the Item Chronos Gear.'],
		'4d': ['Silver gear', 									   'A silver gear that is part of a mechanical watch system.<br><br>Combine with Gold Gear to form the Item Chronos Gear.'],
		'4e': ['Chronos gear', 									   'Gear composed of Gold Gear and Silver Gear items. <br> <br> Use on the clock tower clock to activate it.'],
		'4f': ['Bronze book',									   'A Bronze book found in the hands of a statue of the mayor of raccoon city.<br><br>Use it in a puzzle near the restaurant (Downtown) to get the Bronze compass.'],
		'50': ['Bronze compass', 								   'A bronze compass found near a restaurant.<br><br>Use it on the statue of the mayor of raccoon to obtain the item Battery.'],
		'51': ['Vaccine medium', 								   'One of the solutions to create the cure against T-Virus.<br><br>Combine with the base vaccine item to create the item \"Vaccine\".'],
		'52': ['Vaccine base', 									   'One of the solutions to create the cure against T-Virus.<br><br>Combine with the item Vaccine medium to create the item \"Vaccine\".'],
		'53': ['Unknown Sigpro SP 2009 handgun', 				   'Aka: Forgotten Pistol!<br><br>I think the Devs decided to put these pistols here just to fill the space, because they don\'t have any ingame utility.'],
		'54': ['Unknown Sigpro SP 2009 handgun', 				   'Aka: Forgotten Pistol!<br><br>I think the Devs decided to put these pistols here just to fill the space, because they don\'t have any ingame utility.'],
		'55': ['Vaccine', 										   'Vaccine created with Vaccine base and Vaccine medium.<br>Use it to cure Jill.'],
		'56': ['Unknown Sigpro SP 2009 handgun', 				   'Aka: Forgotten Pistol!<br><br>I think the Devs decided to put these pistols here just to fill the space, because they don\'t have any ingame utility.'],
		'57': ['Unknown Sigpro SP 2009 handgun', 				   'Aka: Forgotten Pistol!<br><br>I think the Devs decided to put these pistols here just to fill the space, because they don\'t have any ingame utility.'],
		'58': ['Medium base', 									   'Solution used to create the item Vaccine medium.<br>It is used in the laboratory at raccoon hospital, B3.'],
		'59': ['Eagle Parts A', 								   'First part of the weapon STI Eagle 6.0.<br>Combine with item Eagle parts B to form the same.'],
		'5a': ['Eagle Parts B', 								   'Second part of the weapon STI Eagle 6.0.<br>Combine with item Eagle parts A to form the same.'],
		'5b': ['M37 Parts A', 									   'First part of weapon Western Custom M37. <br> Combine with item M37 parts B to form it.'],
		'5c': ['M37 Parts B', 									   'Second part of weapon Western Custom M37. <br> Combine with item M37 parts B to form it.'],
		'5d': ['Unknown Sigpro SP 2009 handgun', 				   'Aka: Forgotten Pistol!<br><br>I think the Devs decided to put these pistols here just to fill the space, because they don\'t have any ingame utility.'],
		'5e': ['Chronos chain', 								   'A key that apparently has no use until you combine it with the Clock tower (winder) key to form the Chronos key.'],
		'5f': ['Rusted crank', 									   'A rusty handle used to (try) open the gas station door.'],
		'60': ['Card key', 										   'Key card used at the abandoned factory near the end.<br><br>Use it to open some doors and unlock an elevator.'],
		'61': ['Gun powder A', 									   'Gunpowder A<br>This gunpowder alone has the power to generate ordinary pistol bullets.'],
		'62': ['Gun powder B', 									   'Gunpowder B<br>This gunpowder alone has the power to generate ordinary shotgun bullets.'],
		'63': ['Gun powder C', 									   'Gunpowder C<br>This gunpowder alone has the power to generate ordinary grenade launcher bullets.'],
		'64': ['Gun powder AA', 								   'Gunpowder AA.<br>This combination can generate more pistol bullets than usual.'],
		'65': ['Gun powder BB', 								   'Gunpowder BB.<br>This combination can generate more shotgun bullets than usual.'],
		'66': ['Gun powder AC', 								   'Gunpowder AC.<br>This combination can generate up to 20 grenade launcher (fire) bullets.'],
		'67': ['Gun powder BC', 								   'Gunpowder BC.<br>This combination can generate up to 20 grenade launcher (acid) bullets.'],
		'68': ['Gun powder CC', 								   'Gunpowder BC.<br>This combination can generate up to 20 grenade launcher (freeze) bullets.'],
		'69': ['Gun powder AAA', 								   'Gunpowder AAA.<br>This combination can generate many pistol bullets.'],
		'6a': ['Gun powder AAB', 								   'Gunpowder AAB.<br>This combination can generate up to 40 shotgun bullets.'],
		'6b': ['Gun powder BBA', 								   'Gunpowder BBA.<br>This combination can generate up to 120 pistol bullets.'],
		'6c': ['Gun powder BBB', 								   'Gunpowder BBB.<br>This combination can generate many shotgun bullets.'],
		'6d': ['Gun powder CCC', 								   'Gunpowder CCC.<br>This combination can generate magnum bullets!'],
		'6e': ['Infinite bullets', 								   'Unfair!<br><br>The deal is simple - combine this wonder with the weapon you want to have infinite ammo and voilá!'],
		'6f': ['Water sample', 									   'Water sample used on a quality meter near the end.<br><br><div class="align-center">~~~BEEP-BOOP~~~</div>'],
		'70': ['System disk', 									   'Disk used to open a security door in abandoned factory.<br><br>Get ready for nemmy!'],
		'71': ['Dummy key', 									   'Apparently the RE3 Devs have forgotten one of the RE2 keys here...'],
		'72': ['Lockpick', 										   'A classic item - It opens doors, cabinets and drawers with simple locks.'],
		'73': ['Warehouse (backdoor) key', 						   'Used at the beginning of the game to leave the warehouse after a short discussion with Dario.'],
		'74': ['Sickroom key (room 402)',						   'Key used on the 4th floor of raccoon hospital.<br>Use it to open the door to room 402, which contains one of the necessary solutions to create the vaccine.'],
		'75': ['Emblem (S.T.A.R.S) key', 						   'Key used to open the classic S.T.A.R.S room at the RPD police station.'],
		'76': ['(BOTU) Keyring with four keys',			 		   'BOTU!<br><br>Bunch of keys with unknown use.<br>I believe it is to open several doors in the hospital, as well as the keys of the 1st Resident / Biohazard.<br><br>Item discarded during the development process.'],
		'77': ['Clock tower (bezel) key', 						   'Key used to descend the clock tower stairs in Clock Tower.<br><br>It is one of the only keys that you cannot use directly from inventory.'],
		'78': ['Clock tower (winder) key', 						   'A key that you can even open a door with - but its real purpose is to be combined with the Chronos Chain to become the Chronos key.'],
		'79': ['Chronos key', 									   'A key made of two other keys (Winder and Chronos chain).<br><br>Serves to open the door near the main clock tower lobby.'],
		'7a': ['Unknown Sigpro SP 2009 handgun', 				   'Aka: Forgotten Pistol!<br><br>I think the Devs decided to put these pistols here just to fill the space, because they don\'t have any ingame utility.'],
		'7b': ['Park (Main Gate) key', 							   'Key to the gates of raccoon park.<br>You find it in a save room near the back of the clock tower.'],
		'7c': ['Park (Graveyard) key', 							   'Cemetery tool room key.<br>You find this key near an explosive gallon in the park.'],
		'7d': ['Park (Rear Gate) key', 							   'With this key you can open a lock that is blocking the way to the abandoned factory.'],
		'7e': ['Facility key (No Barcode)', 					   'One of the keys to the abandoned factory.<br>With it you can access a room with an elevator.'],
		'7f': ['Facility key (With Barcode)', 					   'One of the keys to the abandoned factory.<br>With the barcode, you can get the rocket launcher near the end.<br><br>With her you can access a room with an elevator.'],
		'80': ['Boutique key', 									   'Boutique key, where you can change clothes during gameplay.<br><br>This Function is only available in Playstation and Gamecube version.'],
		'81': ['Ink ribbon', 									   'By far, it is one of the most classic items in the entire Resident Evil / Biohazard franchise.<br><br>When in inventory, you can use it on the typewriter to saving your progress.'],
		'82': ['Reloading tool', 								   'With this item, you can create ammo combining with gunpowder.'],
		'83': ['Game inst. A', 									   'This is a manual of how to play Resident Evil 3 / Biohazard 3.<br><br>With this manual, you learn about explosive objects, The 180° Rotation, Emergency Escape, Emergency Bypass, and more.'],
		'84': ['Game inst. B', 									   'This is a manual of how to play Resident Evil 3 / Biohazard 3.<br><br>With this manual, you learn about the Reloading Tool, Gunpowder and it\'s combinations.'],
		'85': ['(BOTU) Recipient with liquid inside',			   'BOT... <i>Wait a sec...</i><br><br>With the internal name of \"Game inst. A\", this item can be used as many times as you like when it is in your inventory - it does not change anything in the game.<br>It only works when you get it as a regular item on map.'],
	},
	DATABASE_FILES = {
		'86': 'Dario\'s Memo',
		'87': 'Mercenary\'s Diary',
		'88': 'Business Fax',
		'89': 'Marvin\'s Report',
		'8a': 'David\'s Memo',
		'8b': 'City Guide',
		'8c': 'Reporter\'s Memo',
		'8d': 'Operation Instruction',
		'8e': 'Mercenary\'s Pocketbook',
		'8f': 'Art Picture Postercard',
		'90': 'Supervisor\'s Report',
		'91': 'Written Order To The Supervisors',
		'92': 'Director\'s Diary',
		'93': 'Manager\'s Diary',
		'94': 'Security Manual',
		'95': 'Mechanic\'s Memo',
		'96': 'Fax From Kendo',
		'97': 'Manager\'s Report',
		'98': 'Medical Instruction Manual',
		'99': 'Fax From H. Q.',
		'9a': 'Incinerator Manual',
		'9b': 'Photo A',
		'9c': 'Photo B',
		'9d': 'Photo C',
		'9e': 'Photo E',
		'9f': 'Photo D',
		'a0': 'Clock Tower Poster Card',
		// Info: Hex A1 makes the game freeze and crash!
		'a2': 'Classified Photo File',
		'a3': 'Jill\'s Diary'
	},
	DATABASE_MAPS = {
		'a4': 'Uptown Map',
		'a9': 'Police Station Map',
		'a5': 'Downtown Map',
		'a6': 'Clock Tower Map',
		'aa': 'Hospital Map',
		'a7': 'Park Map',
		'a8': 'Dead Factory Map',
		'a9': 'Police Station Map',
		'aa': 'Hospital Map'
	},
	DATABASE_ITEM_ATTR = {
		'00': ['None',						  '#0000',   '0px 0px 0px #0000 !important',   'none', 		  '0'], // Use this for puzzle items that don't have the ammo display.
		'01': ['Remaining ammo in green',	  '#00d100', '0px 0px 2px #004200 !important', '-webkit-box', '1'],
		'02': ['% remaining in green', 		  '#00d100', '0px 0px 2px #004200 !important', '-webkit-box', '1'],
		'03': ['Inf. ammo in green', 		  '#00d100', '0px 0px 2px #004200 !important', '-webkit-box', '1'],
		'05': ['Remaining ammo in red',		  '#ff0000', '0px 0px 2px #700000 !important', '-webkit-box', '1'],
		'06': ['% remaining in red', 		  '#ff0000', '0px 0px 2px #700000 !important', '-webkit-box', '1'],
		'07': ['Inf. ammo in red', 			  '#ff0000', '0px 0px 2px #700000 !important', '-webkit-box', '1'],
		'09': ['Remaining ammo in yellow', 	  '#ffeb00', '0px 0px 2px #b4b194 !important', '-webkit-box', '1'],
		'0a': ['%. remaining in yellow',	  '#ffeb00', '0px 0px 2px #b4b194 !important', '-webkit-box', '1'],
		'0b': ['Inf. ammo in yellow', 		  '#ffeb00', '0px 0px 2px #b4b194 !important', '-webkit-box', '1'],
		'0d': ['Remaining ammo in blue', 	  '#9393ff', '0px 0px 2px #004242 !important', '-webkit-box', '1'],
		'0e': ['% remaining in blue', 		  '#9393ff', '0px 0px 2px #004242 !important', '-webkit-box', '1'],
		'0f': ['Inf. ammo in blue', 	 	  '#9393ff', '0px 0px 2px #004242 !important', '-webkit-box', '1'],
		'13': ['M4A1 Assault Rifle (Manual)', '#00d100', '0px 0px 2px #004200 !important', '-webkit-box', '1'],
		'16': ['M4A1 Assault Rifle',   		  '#ff0000', '0px 0px 2px #700000 !important', '-webkit-box', '1'],
		'17': ['M4A1 Assault Rifle (Auto)',	  '#ff0000', '0px 0px 2px #700000 !important', '-webkit-box', '1']  // Found on Carlos Shotgun
	},
	DATABASE_ITEM_PERCENTAGE = [
		'02', '06', '0a', '0e', '16'
	],
	DATABASE_ITEM_INFINITE = [
		'03', '07', '0b', '0f', '13', '17'
	],
	SAV_PLAYERS = {
		'00': 'Jill with normal outfit',
		'01': 'Jill with normal outfit + sidepack',
		'02': 'Jill with biker outfit',
		'03': 'Jill with S.T.A.R.S uniform',
		'04': 'Jill with \"Disco Inferno\" outfit',
		'05': 'Jill with cop uniform + miniskirt',
		'06': 'Jill as Regina (Dino Crisis)',
		'07': 'Jill with normal outfit',
		'08': 'Carlos',
		'09': 'Mikhail',
		'0a': 'Nicholai',
		'0b': 'Brad Vickers',
		'0c': 'Dario',
		'0f': 'Tofu'
	},
	R3_HEX_FORMAT_EXCLUDE = [
		'g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','w','y','z',
		'G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
	],
	RDT_locations = {
		'0000': ['Unknown Map', 				  'Unknown'],
		'R100': ['Warehouse Save Room', 		   'Uptown'],
		'R101': ['Warehouse', 					   'Uptown'],
		'R102': ['Alley 1', 					   'Uptown'],
		'R103': ['Street 1', 					   'Uptown'],
		'R104': ['Alley 2', 					   'Uptown'],
		'R105': ['Alley 3', 					   'Uptown'],
		'R106': ['Boutique Street', 			   'Uptown'],
		'R107': ['Bar Jack',		 			   'Uptown'],
		'R108': ['Alley 5', 					   'Uptown'],
		'R109': ['Passage to Pharmacy (Day)',      'Uptown'],
		'R10A': ['Main Street', 				   'Uptown'],
		'R10B': ['Pharmacy Street',  			   'Uptown'],
		'R10C': ['Alley (Save)', 	 			   'Uptown'],
		'R10D': ['Jill\'s Apartment', 			   'Uptown'],
		'R10E': ['Alley 6',					 	   'Uptown'],
		'R10F': ['Boutique', 					   'Uptown'],
		'R110': ['R.P.D. Gate', 				   'Police Station'],
		'R111': ['R.P.D. Main Hall', 			   'Police Station'],
		'R112': ['R.P.D. Office', 				   'Police Station'],
		'R113': ['Files Room', 					   'Police Station'],
		'R114': ['Corridor with ladder', 		   'Police Station'],
		'R115': ['Corridor', 					   'Police Station'],
		'R116': ['Press conference Room', 		   'Police Station'],
		'R117': ['Dark Room', 					   'Police Station'],
		'R118': ['2F Corridor', 				   'Police Station'],
		'R119': ['Corridor to S.T.A.R.S. Room',    'Police Station'],
		'R11A': ['S.T.A.R.S. Room', 			   'Police Station'],
		'R11B': ['Pharmacy', 					   'Uptown'],
		'R11C': ['Pharmacy Product Stock', 		   'Uptown'],
		'R11D': ['Alley 1 (Night)', 			   'Uptown'],
		'R11E': ['Street 1 (Night)', 			   'Uptown'],
		'R11F': ['Alley 2 (Night)', 			   'Uptown'],
		'R120': ['Alley 3 (Night)', 			   'Uptown'],
		'R121': ['Boutique Street (Night)', 	   'Uptown'],
		'R122': ['Alley 5 (Night)', 			   'Uptown'],
		'R123': ['Passage to Pharmacy (Night)',    'Uptown'],
		'R124': ['Main Street (Night)', 		   'Uptown'],
		'R125': ['R.P.D. Gates (Night)', 		   'Police Station'],
		'R200': ['Street 2', 					   'Uptown'],
		'R201': ['Mechanic Parking Lot', 		   'Downtown'],
		'R202': ['Street to Alley 1',	 		   'Downtown'],
		'R203': ['Alley 1', 					   'Downtown'],
		'R204': ['Energy Station Street', 		   'Downtown'],
		'R205': ['Grill 13 Street', 			   'Downtown'],
		'R206': ['Shopping Dist.', 				   'Downtown'],
		'R207': ['Raccon City Hall Street', 	   'Downtown'],
		'R208': ['Raccon City Hall', 			   'Downtown'],
		'R209': ['Shopping Dist. 2', 			   'Downtown'],
		'R20A': ['Shopping Dist. 3', 			   'Downtown'],
		'R20B': ['Trolley Street', 				   'Downtown'],
		'R20C': ['Trolley', 					   'Downtown'],
		'R20D': ['Stagla Gas Station', 			   'Downtown'],
		'R20E': ['Stagla Street', 				   'Downtown'],
		'R20F': ['Press (2F)', 					   'Downtown'],
		'R210': ['Press (1F)', 					   'Downtown'],
		'R211': ['Grill 13 (1F)', 				   'Downtown'],
		'R212': ['Grill 13 (B1)', 				   'Downtown'],
		'R213': ['Energy Station Entrance', 	   'Downtown'],
		'R214': ['Energy Station', 				   'Downtown'],
		'R215': ['Trolley (Running)', 			   'Downtown'],
		'R216': ['Shopping Dist. Save Room', 	   'Downtown'],
		'R217': ['Stagla Street (After)', 		   'Downtown'],
		'R218': ['Alley to Street 2', 			   'Uptown'],
		'R219': ['Press (1F)', 					   'Downtown'],
		'R21A': ['Alley 6', 					   'Uptown'],
		'R21B': ['Mechanic\'s Office', 			   'Downtown'],
		'R300': ['Chapel', 						   'Clock Tower'],
		'R301': ['Piano Hall', 					   'Clock Tower'],
		'R302': ['Dinner Room', 				   'Clock Tower'],
		'R303': ['Clock Tower Garden', 			   'Clock Tower'],
		'R304': ['Main Hall (1F)', 				   'Clock Tower'],
		'R305': ['Resting Room', 				   'Clock Tower'],
		'R306': ['Living Room', 				   'Clock Tower'],
		'R307': ['Clock Tower Library', 		   'Clock Tower'],
		'R308': ['Corridor to Clock Puzzle',	   'Clock Tower'],
		'R309': ['Clock Puzzle', 				   'Clock Tower'],
		'R30A': ['Main Hall (2F)',  			   'Clock Tower'],
		'R30B': ['Tower Balcony',  				   'Clock Tower'],
		'R30C': ['Machinery Room', 				   'Clock Tower'],
		'R30D': ['Clock Tower Garden (Nemesis)',   'Clock Tower'],
		'R30E': ['Main Hall Destroyed', 		   'Clock Tower'],
		'R30F': ['Piano Hall & Dinner Room', 	   'Clock Tower'],
		'R310': ['Chapel', 				  	 	   'Clock Tower'],
		'R311': ['Resting Room',		  	 	   'Clock Tower'],
		'R312': ['Living Room', 		  	 	   'Clock Tower'],
		'R313': ['Clock Tower Library (2nd)', 	   'Clock Tower'],
		'R314': ['Corridor to Clock Puzzle', 	   'Clock Tower'],
		'R315': ['Clock Puzzle', 				   'Clock Tower'],
		'R316': ['Main Hall Destroyed', 		   'Clock Tower'],
		'R317': ['Piano Hall & Dinner Room', 	   'Clock Tower'],
		'R400': ['Hospital Street', 			   'Park'],
		'R401': ['Park Office', 				   'Park'],
		'R402': ['Hospital Entrance', 			   'Hospital'],
		'R403': ['Hospital Office',   			   'Hospital'],
		'R404': ['Waiting Room', 	  			   'Hospital'],
		'R405': ['Corridor (4F)',     			   'Hospital'],
		'R406': ['Room 402',  					   'Hospital'],
		'R407': ['Room 401',  					   'Hospital'],
		'R408': ['Data Room', 					   'Hospital'],
		'R409': ['Corridor (B3)', 				   'Hospital'],
		'R40A': ['Laboratory 1', 				   'Hospital'],
		'R40B': ['Laboratory 2', 				   'Hospital'],
		'R40C': ['Park Entrance', 				   'Park'],
		'R40D': ['Water Pump Puzzle', 			   'Park'],
		'R40E': ['Bridge', 						   'Park'],
		'R40F': ['Park Exit', 					   'Park'],
		'R410': ['Sewer', 						   'Park'],
		'R411': ['Graveyard',					   'Park'],
		'R412': ['Park Warehouse', 				   'Park'],
		'R413': ['Park Warehouse Save Room', 	   'Park'],
		'R414': ['Park Secret Room', 			   'Park'],
		'R415': ['Park Graveyard (Worm)', 		   'Park'],
		'R416': ['[UNUSED] Copy of R510 (Bridge)', 'Park'],
		'R417': ['Park Street', 				   'Park'],
		'R500': ['Factory Entrance', 			   'Dead Factory'],
		'R501': ['Resting Room', 				   'Dead Factory'],
		'R502': ['Steam Room', 					   'Dead Factory'],
		'R503': ['Control Room (1F)', 			   'Dead Factory'],
		'R504': ['Corridor to Monitor Room',	   'Dead Factory'],
		'R505': ['Monitor Room', 				   'Dead Factory'],
		'R506': ['Water Sample Room', 			   'Dead Factory'], // BEEP BOOP!
		'R507': ['Control Room (B1)', 			   'Dead Factory'],
		'R508': ['Corridor to Disposal Room', 	   'Dead Factory'],
		'R509': ['Disposal Room', 				   'Dead Factory'],
		'R50A': ['Communication Room', 			   'Dead Factory'],
		'R50B': ['Corridor to Incinerator Room 1', 'Dead Factory'],
		'R50C': ['Corridor to Incinerator Room 2', 'Dead Factory'],
		'R50D': ['Incinerator Room', 			   'Dead Factory'],
		'R50E': ['Extraction Point', 			   'Dead Factory'],
		'R50F': ['Elevator to Extraction Point',   'Dead Factory'],
		'R510': ['Bridge to Dead Factory', 		   'Park'],
		'R600': ['Unknown Location', 			   'Unknown'],
		'R601': ['Unknown Location', 			   'Unknown'],
		'R607': ['Unknown Location', 			   'Unknown'],
		'R60B': ['Unknown Location', 			   'Unknown'],
		'R60E': ['Unknown Location', 			   'Unknown'],
		'R60F': ['Unknown Location', 			   'Unknown'], // ?
		'R61B': ['Unknown Location', 			   'Unknown'],
		'R61C': ['Unknown Location', 			   'Unknown'],
		'R61D': ['Unknown Location', 			   'Unknown'],
		'R61E': ['Unknown Location', 			   'Unknown'],
		'R61F': ['Unknown Location', 			   'Unknown'],
		'R620': ['Unknown Location', 			   'Unknown'],
		'R621': ['Unknown Location', 			   'Unknown'],
		'R622': ['Unknown Location', 			   'Unknown'],
		'R623': ['Unknown Location', 			   'Unknown'],
		'R624': ['Unknown Location', 			   'Unknown'],
		'R700': ['Unknown Location', 			   'Unknown'],
		'R701': ['Unknown Location', 			   'Unknown'],
		'R702': ['Unknown Location', 			   'Unknown'],
		'R703': ['Unknown Location', 			   'Unknown'],
		'R704': ['Unknown Location', 			   'Unknown'],
		'R705': ['Unknown Location', 			   'Unknown'],
		'R706': ['Unknown Location', 			   'Unknown'],
		'R707': ['Unknown Location', 			   'Unknown'],
		'R708': ['Unknown Location', 			   'Unknown'],
		'R709': ['Unknown Location', 			   'Unknown'],
		'R70A': ['Unknown Location', 			   'Unknown'],
		'R70B': ['Unknown Location', 			   'Unknown'],
		'R70C': ['Unknown Location', 			   'Unknown'],
		'R70D': ['Unknown Location', 			   'Unknown'],
		'R70E': ['Unknown Location', 			   'Unknown'],
		'R70F': ['Unknown Location', 			   'Unknown'],
		'R710': ['Unknown Location', 			   'Unknown'],
		'R711': ['Unknown Location', 			   'Unknown'],
		'R712': ['Unknown Location', 			   'Unknown'],
		'R713': ['Unknown Location', 			   'Unknown'],
		'R714': ['Unknown Location', 			   'Unknown'],
		'R718': ['Unknown Location', 			   'Unknown'],
		'R71A': ['Unknown Location', 			   'Unknown'],
		'R71B': ['Unknown Location', 			   'Unknown']
	},
	RDT_EMDNAME = {
		'00': 'Undefined',
		'10': 'Male zombie 1',
		'11': 'Female zombie 1',
		'12': 'Male zombie 2',
		'13': 'Female zombie 2',
		'14': 'Male zombie 3',
		'15': 'Male zombie 4',
		'16': 'Male zombie 5',
		'17': 'Male zombie 6',
		'18': 'Male zombie 7',
		'19': 'Male zombie 8',
		'1a': 'Male zombie 9',
		'1b': 'Male zombie 10',
		'1c': 'Female zombie 3',
		'1d': 'Male zombie 11',
		'1e': 'Male zombie 12',
		'1f': 'Male zombie 13',
		'20': 'Dog',
		'21': 'Crow',
		'22': 'Hunter',
		'23': 'Brain Sucker 1',
		'24': 'Hunter Gamma',
		'25': 'Spider',
		'26': 'Unknown Enemy 1',
		'27': 'Brain Sucker Minion',
		'28': 'Brain Sucker 2',
		'2c': 'Male zombie 14',
		'2d': 'Police Station Window Arm',
		'2e': 'Mercenary zombie 1',
		'2f': 'Marvin 1',
		'30': 'Worm 1',
		'32': 'Worm Minion',
		'33': 'Worm 2',
		'34': 'Nemesis 1',
		'35': 'Nemesis 2',
		'36': 'Nemesis 3',
		'37': 'Nemesis 4',
		'38': 'Final Nemesis',
		'39': 'Unknown Enemy 2',
		'3a': 'Nemesis 5',
		'3b': 'Nemesis Part',
		'3e': 'Helicopter part 1',
		'3f': 'Helicopter part 2',
		'40': 'Helicopter part 3',
		'50': 'Carlos Oliveira 1',
		'51': 'Mikhail Bleeding',
		'52': 'Nicholai',
		'53': 'Brad Vicker\'s',
		'54': 'Dario Rosso',
		'55': 'Mercenary zombie 2',
		'56': 'Tyrell',
		'57': 'Marvin 2',
		'58': 'Brad zombie',
		'59': 'Dario zombie',
		'5a': 'Umbrella Ad Girl',
		'5b': 'Jill Valentine',
		'5c': 'Carlos Oliveira 2',
		'5d': 'Carlos Oliveira 3',
		'5e': 'Nicholai 2',
		'5f': 'Jill Valentine with Sidepack',
		'60': 'Nicholai zombie',
		'61': 'Dario\'s daughter',
		'62': 'Jill Biker Outfit',
		'63': 'Jill RE1 Outfit',
		'64': 'Jill\'s white outfit',
		'65': 'Jill with miniskirt cop',
		'66': 'Jill as Regina (Dino Crisis)',
		'67': 'Brian Irons',
		'70': 'Jill alternative outfit',
		'71': 'Jill with blue T-shirt'
	},
	RDT_EMDPOS = {
		'00': 'Normal',
		'01': 'Lying down',
		'02': 'Getting up 1',
		'03': 'Crawling',
		'04': 'Getting up 2',
		'05': 'Lying down 2 (No anim?)',
		'06': 'Following you',
		'07': 'Lying down 3 (No anim?)',
		'08': 'Getting up 3',
		'09': 'Crawl',
		'0b': 'Crawling 2',
		'0c': 'Normal 2',
		'0d': 'Crawling 3',
		'0e': 'Normal 3',
		'0f': 'Crawling 4',
		'10': 'Frozen (Until you deal damage)',
		'20': 'Normal 4',
		'26': 'Walking',
		'40': 'Normal 5',
		'51': 'Lying down moving head',
		'60': 'Normal 6',
		'80': 'Walking (Dog)',
		'84': 'Getting Up 4',
		'85': 'Unknown Pose',
		'86': 'Slow on fire',
		'87': 'Lying down on fire',
		'a0': 'On Fire',
		'af': 'Crawling on fire',
		'b2': 'Getting up on fire',
		'c0': 'On Fire 2',
		'c1': 'Lying down on fire',
		'c3': 'Unknown Pose',
		'c9': 'Crawling on fire 2'
	},
	/*
		SCD Database
	
		Database created with help of Khaled SA, MeganGrass opcode list and pmandin RDT instructions
		https://pastebin.com/jAwWnGLS
		https://github.com/pmandin/reevengi-tools/wiki/.RDT-(Resident-Evil-3)
	
		Order:
		Length (Hex to Int), Function name, CSS Style ID (.R3_SCD_function_ + type), Have Attr, SCD JS Function, Form width, Form height, Use custom BG
	*/
	R3_SCD_DATABASE = {
		'00': [1,  'Null Function [NOP]', 		  	   		 9,  false, 'NOP();', 					false, 720, 480, false],
		'01': [2,  'End Script [EVT_END]', 		  	   		 0,  false, 'EVT_END();', 				false, 720, 480, false],
		'02': [1,  'Next Event [EVT_NEXT]', 	  	   		 0,  false, 'EVT_NEXT();', 				false, 720, 480, false],
		'03': [2,  'Event Chain [EVT_CHAIN]', 	  	   		 0,  false, 'EVT_CHAIN();', 			false, 720, 480, false],
		'04': [2,  'Execute Event [EVT_EXEC]', 		   		 0,  true,  'EVT_EXEC', 				false, 480, 100, false],
		'05': [2,  'Event Kill [EVT_KILL]', 	  	   		 0,  true,  'EVT_KILL', 				false, 720, 480, false],
		'06': [4,  'If [IF]', 					  	   		 4,  false, 'if (',						false, 720, 480, false],
		'07': [4,  'Else [ELSE]', 				  	   		 4,  false, '} else {', 				false, 720, 480, false],
		'08': [2,  'End If [END_IF]', 			  	   		 4,  false, '}', 						false, 720, 480, false],
		'09': [4,  'Sleep [SLEEP]',				  	   		 5,  true,  'SLEEP', 					false, 480, 100, false],
		'0a': [3,  'Sleeping [SLEEPING]',		  	   		 5,  true,  'SLEEPING', 				false, 480, 100, false],
		'0b': [1,  'WSLEEP [WSLEEP]', 			  	   		 0,  false, 'WSLEEP', 					false, 720, 480, false],
		'0c': [1,  'WSLEEPING [WSLEEPING]', 	  	   		 0,  false, 'WSLEEPING',				false, 720, 480, false],
		'0d': [6,  'For [FOR]', 				  	   		 4,  false, 'for {',					false, 720, 480, false],
		'0e': [5,  'UNK_OPCODE_0 [UNK_OPCODE_0]', 	   		 0,  false, 'UNK_OPCODE_0();', 			false, 720, 480, false],
		'0f': [2,  'End For [END_FOR]', 		  	   		 4,  false, '}', 						false, 720, 480, false],
		'10': [4,  'While [WHILE]', 			  	   		 4,  false, 'while (', 					false, 720, 480, false],
		'11': [2,  'End While [END_WHILE]', 	  	   		 4,  false, '}', 						false, 720, 480, false],
		'12': [4,  'Do Function [DO_START]', 	  	   		 4,  false, 'DO_START(){',				false, 720, 480, false],
		'13': [2,  'End Do [END_DO]', 			  	   		 4,  false, '} while (',				false, 720, 480, false],
		'14': [4,  'SWITCH', 					  	   		 0,  false, 'SWITCH', 					false, 720, 480, false],
		'15': [6,  'CASE',   					  	   		 4,  false, 'CASE', 					false, 720, 480, false],
		'16': [2,  'SWITCH', 					  	   		 0,  false, 'SWITCH', 					false, 720, 480, false],
		'17': [2,  'END_SWITCH', 				  	   		 0,  false, '}', 						false, 720, 480, false],
		'18': [6,  'Go To [GOTO]', 		  		  	   		 0,  false, 'GOTO();', 					false, 720, 480, false],
		'19': [2,  'Run Script [GO_SUB]', 		  	   		 0,  true,  'GO_SUB', 					false, 720, 480, false],
		'1a': [4,  'RETURN', 	  				  	   		 0,  false, 'RETURN();', 				false, 720, 480, false],
		'1b': [2,  'BREAK',  	  				  	   		 0,  false, 'BREAK();', 				false, 720, 480, false],
		'1c': [1,  'BREAK_POINT', 				  	   		 0,  false, 'BREAK_POINT();',			false, 720, 480, false],
		'1d': [4,  'EVAL_CC', 	  				  	   		 0,  false, 'EVAL_CC();', 				false, 720, 480, false],
		'1e': [4,  'Set Timer / Value [SET_TIMER]', 	 	 12, true,  'SET_TIMER',				false, 530, 160, false],
		'1f': [4,  'SET_DO', 					  	   		 0,  true,  'SET_DO',	 				false, 720, 480, false],
		'20': [6,  'Execute Calculation [CALC_OP]',    		 12, true,  'CALC_OP',	 				false, 670, 100, false],
		'21': [4,  'UNK_OPCODE_1', 					   		 5,  false, 'UNK_OPCODE_1();',			false, 720, 480, false],
		'22': [2,  'EVT_CUT', 						   		 0,  true,  'EVT_CUT',	 				false, 480, 100, false],
		'23': [1,  'UNK_OPCODE_2', 					   		 9,  false, 'UNK_OPCODE_2();',			false, 720, 480, false],
		'24': [2,  'CHASER_EVT_CLR', 				   		 0,  false, 'CHASER_EVT_CLR();',		false, 720, 480, false],
		'25': [4,  'Open Map [MAP_OPEN]', 			   		 10, true,  'MAP_OPEN', 				false, 440, 100, false],
		'26': [6,  'POINT_ADD', 					   		 0,  true,  'POINT_ADD',				false, 720, 480, false],
		'27': [1,  'DOOR_CK', 						   		 13, false, 'DOOR_CK',	 				 true, 720, 480, false],
		'28': [1,  'Game Over [DIEDEMO_ON]', 		   		 9,  false, 'DIEDEMO_ON();',			false, 720, 480, false],
		'29': [8,  'DIR_CK', 	 					   		 0,  true,  'DIR_CK',	 				false, 720, 480, false],
		'2a': [6,  'PARTS_SET',  					   		 0,  true,  'PARTS_SET',	 			false, 480, 100, false],
		'2b': [2,  'VLOOP_SET',  					   		 0,  true,  'VLOOP_SET',    			false, 720, 480, false],
		'2c': [4,  'OTA_BE_SET', 					   		 0,  true,  'OTA_BE_SET',   			false, 720, 480, false],
		'2d': [4,  'LINE_START', 					   		 0,  true,  'LINE_START',   			false, 720, 480, false],
		'2e': [6,  'LINE_MAIN',  					   		 0,  false, 'LINE_MAIN();', 			false, 720, 480, false],
		'2f': [2,  'LINE_END',   					   		 0,  false, 'LINE_END();', 				false, 720, 480, false],
		'30': [6,  'Set LIT Position [LIGHT_POS_SET]', 		 8,  true,  'LIGHT_POS_SET',	 		false, 480, 100, false],
		'31': [6,  'LIGHT_KIDO_SET', 				   		 0,  false, 'LIGHT_KIDO_SET();', 		false, 720, 480, false],
		'32': [6,  'Set LIT Color [LIGHT_COLOR_SET]',  		 5,  true,  'LIGHT_COLOR_SET',	 		false, 720, 300, false],
		'33': [4,  'AHEAD_ROOM_SET', 				   		 0,  true,  'AHEAD_ROOM_SET',   		false, 480, 100, false],
		'34': [10, 'ESPR_CTR', 						   		 0,  false, 'ESPR_CTR();', 				false, 720, 480, false],
		'35': [6,  'BGM_TBL_CK', 					   		 13, false, 'BGM_TBL_CK',				 true, 720, 480, false],
		'36': [3,  'ITEM_GET_CK', 					   		 13, false, 'ITEM_GET_CK();',			false, 720, 480,  true],
		'37': [2,  'OM_REV', 						   		 0,  true,  'OM_REV',	 				false, 720, 480, false],
		'38': [2,  'CHASER_LIFE_INIT', 				   		 0,  true,  'CHASER_LIFE_INIT',			false, 720, 480, false],
		'39': [16, 'PARTS_BOMB', 					   		 0,  false, 'PARTS_BOMB();',			false, 720, 480, false],
		'3a': [16, 'PARTS_DOWN', 					   		 0,  false, 'PARTS_DOWN();',			false, 720, 480, false],
		'3b': [3,  'CHASER_ITEM_SET', 				   		 0,  true,  'CHASER_ITEM_SET',			false, 480, 100, false],
		'3c': [1,  'WEAPON_CHG_OLD', 				   		 11, false, 'WEAPON_CHG_OLD();',		false, 720, 480, false],
		'3d': [2,  'SEL_EVT_ON', 					   		 0,  true,  'SEL_EVT_ON',				false, 480, 100, false],
		'3e': [2,  'Remove Item [ITEM_LOST]', 		   		 2,  true,  'ITEM_LOST', 				false, 490, 200,  true],
		'3f': [3,  'FLR_SET', 						   		 0,  true,  'FLR_SET',	 				false, 480, 100, false],
		'40': [4,  'Set Variable [MEMB_SET]', 		   		 12, true,  'MEMB_SET', 				false, 480, 100, false],
		'41': [4,  'Set Variable 2 [MEMB_SET2]', 	   		 12, true,  'MEMB_SET2',				false, 480, 100, false],
		'42': [4,  'MEMB_CPY', 						   		 0,  false, 'MEMB_CPY();', 				false, 720, 480, false],
		'43': [6,  'MEMB_CMP', 						   		 13, false, 'MEMB_CMP', 				 true, 720, 480, false],
		'44': [6,  'MEMB_CALC', 					   		 0,  false, 'MEMB_CALC();',				false, 720, 480, false],
		'45': [4,  'MEMB_CALC2', 					   		 0,  false, 'MEMB_CALC2();',			false, 720, 480, false],
		'46': [11, 'Set Fade [FADE_SET]', 			   		 5,  true,  'FADE_SET', 				false, 540, 380, false],
		'47': [3,  'Char Trigger [WORK_SET]', 		   		 5,  true,  'WORK_SET', 				false, 480, 100, false],
		'48': [4,  'SPD_SET',  						   		 0,  true,  'SPD_SET',	 				false, 720, 480, false],
		'49': [1,  'ADD_SPD',  						   		 0,  false, 'ADD_SPD();', 				false, 720, 480, false],
		'4a': [1,  'ADD_ASPD', 						   		 0,  false, 'ADD_ASPD();', 				false, 720, 480, false],
		'4b': [1,  'ADD_VSPD', 						   		 0,  false, 'ADD_VSPD();', 				false, 720, 480, false],
		'4c': [4,  'Check Boolean [CK]', 			   		 13, false, 'CK',	 					 true, 550, 100, false],
		'4d': [4,  'Set Event Value [SET]',			   		 12, true,  'SET', 						false, 550, 100, false],
		'4e': [6,  'Compare Values [CMP]',			   		 13, false, 'CMP', 						 true, 720, 480, false],
		'4f': [1,  'RND', 							   		 0,  false, 'RND();', 					false, 720, 480, false],
		'50': [2,  'Change Camera [CUT_CHG]', 		   		 5,  true,  'CUT_CHG',	 				false, 720, 480,  true],
		'51': [1,  'CUT_OLD', 				  		   		 0,  false, 'CUT_OLD();', 				false, 720, 480, false],
		'52': [2,  'Lock Camera [CUT_AUTO]',  		   		 5,  true,  'CUT_AUTO', 				false, 480, 100, false],
		'53': [3,  'Swap Camera [CUT_REPLACE]', 	   		 5,  true,  'CUT_REPLACE',				false, 520, 302, false],
		'54': [4,  'CUT_BE_SET', 					   		 0,  true,  'CUT_BE_SET',   			false, 480, 100, false],
		'55': [8,  'Set Target Position [POS_SET]',    		 5,  true,  'POS_SET',	 				false, 620, 100, false],
		'56': [8,  'DIR_SET',  						   		 5,  true,  'DIR_SET',  				false, 620, 100, false],
		'57': [6,  'SET_VIB0', 						   		 0,  true,  'SET_VIB0', 				false, 480, 100, false],
		'58': [6,  'SET_VIB1', 						   		 0,  true,  'SET_VIB1', 				false, 480, 100, false],
		'59': [8,  'SET_VIB_FADE', 					   		 0,  true,  'SET_VIB_FADE', 			false, 720, 480, false],
		'5a': [2,  'RBJ Trigger [RBJ_SET]', 		   		 5,  true,  'RBJ_SET',	 				false, 480, 100, false],
		'5b': [6,  'Display Message [MESSAGE_ON]', 	   		 6,  true,  'MESSAGE_ON',	 			false, 782, 240, false],
		'5c': [2,  'RAIN_SET', 						   		 5,  true,  'RAIN_SET', 				false, 430, 100, false],
		'5d': [1,  'MESSAGE_OFF', 					   		 6,  false, 'MESSAGE_OFF();', 			false, 720, 480, false],
		'5e': [3,  'SHAKE_ON', 						   		 0,  true,  'SHAKE_ON', 				false, 720, 480, false],
		'5f': [2,  'Change Weapon [WEAPON_CHG]', 	   		 11, true,  'WEAPON_CHG', 				false, 720, 480, false],
		'60': [22, 'UNK_OPCODE_3', 					   		 9,  false, 'UNK_OPCODE_3();', 			false, 720, 502, false],
		'61': [32, 'Set Door [DOOR_AOT_SET]', 		   		 1,  true,  'DOOR_AOT_SET', 			false, 744, 350,  true],
		'62': [40, 'Set Door 4P [DOOR_AOT_SET_4P]',    		 1,  true,  'DOOR_AOT_SET_4P',			false, 744, 350,  true],
		'63': [20, 'Set Interactive Object [AOT_SET]', 		 6,  true,  'AOT_SET', 					false, 560, 260, false],
		'64': [28, 'Set Interactive Object 4P [AOT_SET_4P]', 6,  false, 'AOT_SET_4P();', 			false, 720, 480, false],
		'65': [10, 'AOT_RESET', 							 6,  true,  'AOT_RESET',	 			false, 720, 130, false],
		'66': [2,  'Run Interactive Object [AOT_ON]', 		 6,  true,  'AOT_ON',	 				false, 620, 120, false],
		'67': [22, 'Set Item [ITEM_AOT_SET]', 				 2,  true,  'ITEM_AOT_SET', 			false, 560, 370,  true],
		'68': [30, 'Set Item 4P [ITEM_AOT_SET_4P]', 		 2,  true,  'ITEM_AOT_SET_4P', 			false, 560, 370,  true],
		'69': [14, 'Shadow Effect [KAGE_SET]', 				 8,  false, 'KAGE_SET();', 				false, 720, 480, false],
		'6a': [16, 'SUPER_SET', 							 0,  false, 'SUPER_SET();', 			false, 600, 130, false],
		'6b': [2,  'Check Item [KEEP_ITEM_CK]', 			 13, false, 'KEEP_ITEM_CK', 			 true, 600, 240,  true],
		'6c': [4,  'KEY_CK', 								 13, false, 'KEY_CK',	 				 true, 480, 100, false],
		'6d': [4,  'TRG_CK', 								 13, false, 'TRG_CK();', 				false, 480, 100, false],
		'6e': [4,  'SCA_ID_SET', 							 12, true,  'SCA_ID_SET',   			false, 480, 100, false],
		'6f': [2,  'OM_BOMB', 								 0,  false, 'OM_BOMB();', 				false, 720, 480, false],
		'70': [16, 'ESPR_ON', 								 8,  false, 'ESPR_ON();', 				false, 720, 480, false],
		'71': [18, 'ESPR_ON2', 								 8,  false, 'ESPR_ON2();', 				false, 720, 480, false],
		'72': [22, 'ESPR3D_ON', 							 8,  false, 'ESPR3D_ON();', 			false, 720, 480, false],
		'73': [24, 'ESPR3D_ON2', 							 8,  false, 'ESPR3D_ON2();', 			false, 720, 480, false],
		'74': [5,  'ESPR_KILL', 							 8,  false, 'ESPR_KILL();', 			false, 720, 480, false],
		'75': [2,  'ESPR_KILL2', 							 8,  true,  'ESPR_KILL2',   			false, 480, 100, false],
		'76': [3,  'ESPR_KILL_ALL',							 8,  true,  'ESPR_KILL_ALL',    		false, 480, 100, false],
		'77': [12, 'Play SE [SE_ON]', 						 3,  true,  'SE_ON',	 				false, 550, 130, false],
		'78': [6,  'BGM_CTL',		  						 3,  true,  'BGM_CTL', 					false, 700, 100, false],
		'79': [4,  'XA_ON', 		  						 3,  true,  'XA_ON',	 				false, 480, 100, false],
		'7a': [2,  'Call Cinematic [MOVIE_ON]', 			 3,  true,  'MOVIE_ON',	 				false, 540, 100, false],
		'7b': [6,  'BGM_TBL_SET', 							 12, true,  'BGM_TBL_SET',	 			false, 480, 100, false],
		'7c': [1,  'Open Inventory [STATUS_ON]', 			 10, false, 'STATUS_ON();', 			false, 720, 480, false],
		'7d': [24, 'Set Enemy / NPC [EM_SET]', 				 7,  true,  'EM_SET',	 				false, 834, 160, false],
		'7e': [2,  'MIZU_DIV', 								 0,  true,  'MIZU_DIV', 				false, 480, 100, false],
		'7f': [40, 'Set 3D Object [OM_SET]', 				 8,  false, 'OM_SET();', 				false, 810, 270, false],
		'80': [4,  'Motion Trigger [PLC_MOTION]', 			 5,  true,  'PLC_MOTION',	 			false, 530, 100, false],
		'81': [8,  'Set Animation DEST [PLC_DEST]', 		 5,  true,  'PLC_DEST', 				false, 540, 160, false],
		'82': [10, 'Set Head Animation [PLC_NECK]', 		 5,  true,  'PLC_NECK', 				false, 720, 130, false],
		'83': [1,  'Player Return [PLC_RET]', 				 5,  false, 'PLC_RET();', 				false, 720, 480, false],
		'84': [4,  'PLC_FLG', 								 0,  true,  'PLC_FLG',  				false, 720, 480, false],
		'85': [2,  'PLC_GUN', 								 0,  true,  'PLC_GUN',  				false, 720, 480, false],
		'86': [1,  'PLC_GUN_EFF', 							 0,  false, 'PLC_GUN_EFF();', 			false, 720, 480, false],
		'87': [1,  'PLC_STOP', 								 5,  false, 'PLC_STOP();', 				false, 720, 480, false],
		'88': [4,  'PLC_ROT',  								 0,  true,  'PLC_ROT',	 				false, 480, 100, false],
		'89': [2,  'PLC_CNT',  								 0,  true,  'PLC_CNT',	 				false, 480, 100, false],
		'8a': [1,  'SLPC_RET', 								 0,  false, 'SLPC_RET();', 				false, 720, 480, false],
		'8b': [1,  'SLPC_SCE', 								 0,  false, 'SLPC_SCE();', 				false, 720, 480, false],
		'8c': [1,  'PLC_SCE',  								 0,  false, 'PLC_SCE();', 				false, 720, 480, false],
		'8d': [1,  'SPL_WEAPON_CHG', 						 0,  false, 'SPL_WEAPON_CHG();', 		false, 720, 480, false],
		'8e': [4,  'PLC_MOT_NUM', 	 						 0,  true,  'PLC_MOT_NUM',  			false, 720, 480, false],
		'8f': [2,  'Reset Enemy Animation [EM_RESET]', 		 5,  true,  'EM_RESET', 				false, 720, 480, false]
	},
	// SCD conditional check functions
	R3_SCD_CHECK_DATABASE = ['06','0d','10','12','16'],
	// SCD conditional check closing
	R3_SCD_CHECK_CLOSING = ['08','0f','11','13','17'],
	/*
		SCD code Description Databas
		This is where all opcode hints are stored
	*/
	R3_SCD_INFO_DATABASE = {
		'00': '[NOP]\nThis is a null function.\nUse this when you want to add padding on the code.',
		'01': '[EVT_END]\nThis function determines the end of this script.\n[You can\'t remove this function]',
		'02': '[EVT_NEXT]',
		'03': '[EVT_CHAIN]',
		'04': '[EVT_EXEC]',
		'05': '[EVT_KILL]',
		'06': '[IF]\nThis function will check an condition and execute an array of functions depending of the result.',
		'07': '[ELSE]\nThis function will execute an array of functions if the [IF] check condition returns false.',
		'08': '[END_IF]\nThis function determines the end of the [IF] section.\nNEVER let the next function be [EVT_END], add a padding [NOP] or [SLEEP] if you want finish the script.',
		'09': '[SLEEP]\nThis function will create a pause on the script executution for a determinated time.',
		'0a': '[SLEEPING]',
		'0b': '[WSLEEP]',
		'0c': '[WSLEEPING]',
		'0d': '[FOR]',
		'0e': '[UNK_OPCODE_0]\nThis function was not implemented on R3ditor V2.',
		'0f': '[END_FOR]\nThis function determines the end of [FOR] check.',
		'10': '[WHILE]\nThis function will run an array of functions while a condition is true.',
		'11': '[END_WHILE]\nThis determines the end of [WHILE] section.',
		'12': '[DO_START]',
		'13': '[END_DO]',
		'14': '[SWITCH]',
		'15': '[CASE]',
		'16': '[SWITCH]',
		'17': '[END_SWITCH]',
		'18': '[GOTO]',
		'19': '[GO_SUB]\nThis funtion initialize (run) a desired script.',
		'1a': '[RETURN]',
		'1b': '[BREAK]',
		'1c': '[BREAK_POINT]',
		'1d': '[EVAL_CC]',
		'1e': '[SET_TIMER]\nThis function will set up the variables for in-game timer countdown or set internal values inside specific variables ingame.',
		'1f': '[SET_DO]',
		'20': '[CALC_OP]\nThis function will manipulate an accumulator by executing a math operation.',
		'21': '[UNK_OPCODE_1]',
		'22': '[EVT_CUT]',
		'23': '[UNK_OPCODE_2]\nThis function was not implemented on R3ditor V2.',
		'24': '[CHASER_EVT_CLR]',
		'25': '[OPEN_MAP]\nThis function will open the map and blink a selected map.',
		'26': '[POINT_ADD]',
		'27': '[DOOR_CK]',
		'28': '[DIEDEMO_ON]\nThis function will call game over screen.',
		'29': '[DIR_CK]',
		'2a': '[PARTS_SET]',
		'2b': '[VLOOP_SET]',
		'2c': '[OTA_BE_SET]',
		'2d': '[LINE_START]',
		'2e': '[LINE_MAIN]',
		'2f': '[LINE_END]',
		'30': '[LIGHT_POS_SET]\nThis function will move the position of a specific light source (LIT).',
		'31': '[LIGHT_KIDO_SET]',
		'32': '[LIGHT_COLOR_SET]\nThis function will change the color of an specific light soucre (LIT).',
		'33': '[AHEAD_ROOM_SET]',
		'34': '[ESPR_CTR]',
		'35': '[BGM_TBL_CK]',
		'36': '[ITEM_GET_CK]\nThis function check if player have a specific item.',
		'37': '[OM_REV]',
		'38': '[CHASER_LIFE_INIT]',
		'39': '[PARTS_BOMB]',
		'3a': '[PARTS_DOWN]',
		'3b': '[CHASER_ITEM_SET]',
		'3c': '[WEAPON_CHG_OLD]',
		'3d': '[SEL_EVT_ON]',
		'3e': '[ITEM_LOST]\nThis function will remove an specific item from your inventory.',
		'3f': '[FLR_SET]',
		'40': '[MEMB_SET]\nThis function will store a value inside of desired internal game variable.',
		'41': '[MEMB_SET2]',
		'42': '[MEMB_CPY]',
		'43': '[MEMB_CMP]',
		'44': '[MEMB_CALC]',
		'45': '[MEMB_CALC2]',
		'46': '[FADE_SET]\nThis function will create a Fade-In or Fade-Out effect on screen.',
		'47': '[WORK_SET]\nThis function set a desired id to an object (like player, npc\'s or even 3D objects) to be manipulated later.',
		'48': '[SPD_SET]',
		'49': '[ADD_SPD]',
		'4a': '[ADD_ASPD]',
		'4b': '[ADD_VSPD]',
		'4c': '[CK]\nThis function compare if a specific value from some game aspect are true or false (ON or OFF).\nWithout if [IF], it will check [AOT_SET].',
		'4d': '[SET]\nThis function set some specific variables inside the game true or false (ON / OFF).',
		'4e': '[CMP]\nThis function will compare some specific variables inside game execution.',
		'4f': '[RND]',
		'50': '[CUT_CHG]\nThis function will change the current camera.',
		'51': '[CUT_OLD]',
		'52': '[CUT_AUTO]\nWhen this function are True (ON), it will lock the current camera - not allowing it change. (Regardless of your position)',
		'53': '[CUT_REPLACE]\nThis function will change what camera will be displayed on a selected camera trigger.',
		'54': '[CUT_BE_SET]',
		'55': '[POS_SET]\nThis function will set the target to a desired location.\nThis function requires Char Trigger [WORK_SET] to work.',
		'56': '[DIR_SET]\nThis function requires Char Trigger [WORK_SET] to work.',
		'57': '[SET_VIB0]',
		'58': '[SET_VIB1]',
		'59': '[SET_VIB_FADE]',
		'5a': '[RBJ_SET]',
		'5b': '[MESSAGE_ON]\nThis funtion will display a desired text message.',
		'5c': '[RAIN_SET]',
		'5d': '[MESSAGE_OFF]',
		'5e': '[SHAKE_ON]',
		'5f': '[WEAPON_CHG]\nThis function will change your current weapon.',
		'60': '[UNK_OPCODE_3]\nThis function was not implemented on R3ditor V2.',
		'61': '[DOOR_AOT_SET]\nThis function will spawn an door event on current map.',
		'62': '[DOOR_AOT_SET_4P]\nThis function will spawn an door event on current map.',
		'63': '[AOT_SET]\nThis will spawn an interactive object.\nIt can be from current map database or an game message.\n(Example: typewriter save dialog)',
		'64': '[AOT_SET_4P]\nThis will spawn an interactive object.\nIt can be from current map database or an game message.\n(Example: typewriter save dialog)',
		'65': '[AOT_RESET]',
		'66': '[AOT_ON]\nThis function will trigger a desired object.\nIt can be a door, items and more! (AOT Objects)',
		'67': '[ITEM_AOT_SET]\nThis function will set a desired item on current map.',
		'68': '[ITEM_AOT_SET_4P]\nThis function will set a desired item on current map.',
		'69': '[KAGE_SET]\nThis function will spawn a shadow in a desired character.\nThis function requires [EVT_NEXT] function to work.',
		'6a': '[SUPER_SET]',
		'6b': '[KEEP_ITEM_CK]\nThis function will check if you have an specific item in your inventory.',
		'6c': '[KEY_CK]',
		'6d': '[TRG_CK]',
		'6e': '[SCA_ID_SET]',
		'6f': '[OM_BOMB]',
		'70': '[ESPR_ON]',
		'71': '[ESPR_ON2]',
		'72': '[ESPR3D_ON]',
		'73': '[ESPR3D_ON2]',
		'74': '[ESPR_KILL]',
		'75': '[ESPR_KILL2]',
		'76': '[ESPR_KILL_ALL]',
		'77': '[SE_ON]\nThis function will play a desired sound effect.',
		'78': '[BGM_CTL]',
		'79': '[XA_ON]',
		'7a': '[MOVIE_ON]\nThis function will call a cinematic video.',
		'7b': '[BGM_TBL_SET]',
		'7c': '[STATUS_ON]\nThis function will open your inventory.',
		'7d': '[EM_SET]\nThis function will spawn a desired Enemy or NPC on this map.',
		'7e': '[MIZU_DIV]',
		'7f': '[OM_SET]\nThis function will insert a 3D Object on this map.',
		'80': '[PLC_MOTION]\nThis function requires [RBJ_SET] to work.',
		'81': '[PLC_DEST]\nThis function will make the target execute an animation.\nThis function requires [WORK_SET] to work.',
		'82': '[PLC_NECK]\nThis function will make the target animate his head / neck.\nThis function requires [WORK_SET] to work.',
		'83': '[PLC_RET]\nThis function will make the player movable after a cutscene.',
		'84': '[PLC_FLG]',
		'85': '[PLC_GUN]',
		'86': '[PLC_GUN_EFF]',
		'87': '[PLC_STOP]',
		'88': '[PLC_ROT]',
		'89': '[PLC_CNT]',
		'8a': '[SLPC_RET]',
		'8b': '[SLPC_SCE]',
		'8c': '[PLC_SCE]',
		'8d': '[SPL_WEAPON_CHG]',
		'8e': '[PLC_MOT_NUM]',
		'8f': '[EM_RESET]\nThis function will reset a enemy animation'
	}, R3_MP_WM = 'ZmZmZmZmZmY1NDY4Njk3MzIwNjY2OTZjNjUyMDc3NjE3MzIwNmQ2MTY0NjUyMDc1NzM2OTZlNjcyMDUyMzM2NDY5NzQ2ZjcyMjA1NjMyMjAyZDIwNDM3MjY1NjE3NDY1NjQyMDQyNzkyMDUyMzM2NDY5NzQ2ZjcyMjA1NDY1NjE2ZGZmZmZmZmZm',
	/*
		SCD Code Function Decompilation 
		This will migrate a lot of content originally stored in RANGES
	*/
	R3_SCD_DECOMPILER_DATABASE = {
		// Null Function [NOP]
		'00': {
			header: [0, 2]
		},
		// End Script [EVT_END]
		'01': {
			header: [0, 2],
			code:   [2, 4]
		},
		// Next Event [EVT_NEXT]
		'02': {
			header: [0, 2]
		},
		// Event Chain [EVT_CHAIN]
		'03': {
			header: [0, 2],
			zAlign: [2, 4]
		},
		// Execute Event [EVT_EXEC] 
		'04': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// Event Kill [EVT_KILL]
		'05': {
			header: [0, 2],
			target: [2, 4]
		},
		// If [IF]
		'06': {
			header: [0, 2],
			zAlign: [2, 4],
			length: [4, 8]
		},
		// Else [ELSE]
		'07': {
			header: [0, 2],
			zAlign: [2, 4],
			length: [4, 8]
		},
		// End If [END_IF]
		'08': {
			header: [0, 2],
			zAlign: [2, 4]
		},
		// Wait [SLEEP]
		'09': {
			header:   [0, 2],
			sleeping: [2, 4],
			count: 	  [4, 8]
		},
		// SLEEPING
		'0a': {
			header: [0, 2],
			count: 	[2, 6]
		},
		// WSLEEP
		'0b': {
			header: [0, 2]
		},
		// WSLEEPING
		'0c': {
			header: [0, 2]
		},
		// For [FOR]
		'0d': {
			header:    [0, 2],
			zAlign:    [2, 4],
			length:	   [4, 8],
			loopCount: [8, 12]
		},
		// End For [END_FOR]
		'0f': {
			header: [0, 2],
			zAlign: [2, 4]
		},
		// While [WHILE]
		'10': {
			header: [0, 2],
			zAlign: [2, 4],
			length: [4, 8]
		},
		// End While [END_WHILE]
		'11': {
			header: [0, 2],
			zAlign: [2, 4]
		},
		// DO_START
		'12': {
			header: [0, 2],
			zAlign: [2, 4],
			length: [4, 8]
		},
		// END_DO
		'13': {
			header: [0, 2],
			zAlign: [2, 4]
		},
		// INIT Script [GO_SUB]
		'19': {
			header:   [0, 2],
			scriptId: [2, 4]
		},
		// BREAK_POINT
		'1c': {
			header: [0, 2]
		},
		// Set Timer / Value [SET_TIMER]
		'1e': {
			header: [0, 2],
			target: [2, 4],
			time:   [4, 8]
		},
		// SET_DO
		'1f': {
			header: [0, 2],
			value:  [2, 4],
			length: [4, 8]
		},
		// Execute Calculation [CALC_OP]
		'20': {
			header: 	   [0, 2],
			unk0: 		   [2, 4],
			operation: 	   [4, 6],
			accumulatorId: [6, 8],
			value: 		   [8, 12]
		},
		// UNK_OPCODE_1
		'21': {
			header: [2, 4]
		},
		// EVT_CUT
		'22': {
			header: [0, 2],
			value: 	[2, 4]
		},
		// UNK_OPCODE_2
		'23': {
			header: [0, 2]
		},
		// CHASER_EVT_CLR
		'24': {
			header: [0, 2],
			zAlign: [2, 4]
		},
		// Open Map [MAP_OPEN]
		'25': {
			header: [0, 2],
			id: 	[2, 4],
			room: 	[4, 8]
		},
		// POINT_ADD
		'26': {
			header: [0, 2],
			zAlign: [2, 4],
			data0: 	[4, 8],
			data1: 	[8, 12]
		},
		// DOOR_CK
		'27': {
			header: [0, 2]
		},
		// DIEDEMO_ON
		'28': {
			header: [0, 2]
		},
		// DIR_CK
		'29': {
			header: [0, 2],
			zAlign: [2, 4],
			data0: 	[4, 8],
			data1: 	[8, 12],
			data2: 	[12, 16]
		},
		// PARTS_SET
		'2a': {
			header: [0, 2],
			zAlign: [2, 4],
			id: 	[4, 6],
			type: 	[6, 8],
			value: 	[8, 12]
		},
		// VLOOP_SET
		'2b': {
			header: [0, 2],
			value:  [2, 4]
		},
		// OTA_BE_SET
		'2c': {
			header: [0, 2],
			data0: 	[2, 4],
			data1: 	[4, 6],
			flag: 	[6, 8]
		},
		// LINE_START
		'2d': {
			header: [0, 2],
			id: 	[2, 4],
			value:  [4, 8]
		},
		// LINE_MAIN
		'2e': {
			header: [0, 2],
			id: 	[2, 4],
			data0: 	[4, 8],
			data1: 	[8, 12]
		},
		// LINE_END
		'2f': {
			header: [0, 2],
			zAlign: [2, 4]
		},
		// Set LIT Position [LIGHT_POS_SET]
		'30': {
			header: [0, 2],
			id: 	[2, 4],
			posX: 	[4, 8],
			posY: 	[8, 12]
		},
		// LIGHT_KIDO_SET
		'31': {
			header: [0, 2],
			zAlign: [2, 4],
			data0: 	[4, 6],
			data1:  [6, 8],
			data2: 	[8, 12]
		},
		// Set LIT Color [LIGHT_COLOR_SET]
		'32': {
			header: [0, 2],
			id: 	[2, 4],
			unk0: 	[4, 6],
			colorR: [6, 8],
			colorG: [8, 10],
			colorB: [10, 12]
		},
		// AHEAD_ROOM_SET
		'33': {
			header: [0, 2],
			zAlign: [2, 4],
			value: 	[4, 8]
		},
		// BGM_TBL_CK
		'35': {
			header: [0, 2],
			zAlign: [2, 4],
			data0: 	[4, 6],
			data1: 	[6, 8],
			value: 	[8, 12]
		},
		// ITEM_GET_CK
		'36': {
			header: [0, 2],
			itemId: [2, 4],
			quant: 	[4, 6]
		},
		// OM_REV
		'37': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// CHASER_LIFE_INIT
		'38': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// CHASER_ITEM_SET
		'3b': {
			header: [0, 2],
			emId: 	[2, 4],
			objId: 	[4, 6]
		},
		// WEAPON_CHG_OLD
		'3c': {
			header: [0, 2]
		},
		// SEL_EVT_ON
		'3d': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// Remove Item [ITEM_LOST]
		'3e': {
			header:   [0, 2],
			itemCode: [2, 4]
		},
		// FLR_SET
		'3f': {
			header: [0, 2],
			id: 	[2, 4],
			flag: 	[4, 6]
		},
		// Set Variable [MEMB_SET]
		'40': {
			header:   [0, 2],
			id: 	  [2, 4],
			variable: [4, 8]
		},
		// Set Variable 2 [MEMB_SET2]
		'41': {
			header:   [0, 2],
			id: 	  [2, 4],
			variable: [4, 8]
		},
		// MEMB_CPY
		'42': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 6]
		},
		// MEMB_CMP
		'43': {
			header: [0, 2],
			zAlign: [2, 4],
			id: 	[4, 6],
			type: 	[6, 8],
			value:  [8, 12]
		},
		// Set Fade [FADE_SET]
		'46': {
			header:   [0, 2],
			id: 	  [2, 4],
			unk0: 	  [4, 6],
			type: 	  [6, 8],
			colorB:   [8, 10],
			colorG:   [10, 12],
			colorR:   [12, 14],
			colorY:	  [14, 16],
			colorM:	  [16, 18],
			colorC:	  [18, 20],
			duration: [20, 22]
		},
		// Char Trigger [WORK_SET]
		'47': {
			header: [0, 2],
			target:	[2, 4],
			value:  [4, 6]
		},
		// SPD_SET
		'48': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 8]
		},
		// ADD_SPD
		'49': {
			header: [0, 2]
		},
		// ADD_ASPD
		'4a': {
			header: [0, 2]
		},
		// ADD_VSPD
		'4b': {
			header: [0, 2]
		},
		// CK
		'4c': {
			header: [0, 2],
			event: 	[2, 4],
			value: 	[4, 6],
			flag: 	[6, 8]
		},
		// Set Event Value [SET]
		'4d': {
			header:  [0, 2],
			id: 	 [2, 4],
			typeVar: [4, 6],
			flag: 	 [6, 8]
		},
		// Compare [CMP]
		'4e': {
			header:  [0, 2],
			zAlign:  [2, 4],
			varType: [4, 6],
			cmpType: [6, 8],
			value: 	 [8, 12]
		},
		// RND
		'4f': {
			header: [0, 2]
		},
		// Change Camera [CUT_CHG]
		'50': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// CUT_OLD
		'51': {
			header: [0, 2]
		},
		// Lock Camera [CUT_AUTO]
		'52': {
			header: [0, 2],
			flag: 	[2, 4]
		},
		// Swap Camera [CUT_REPLACE]
		'53': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 6]
		},
		// CUT_BE_SET
		'54': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 6],
			flag: 	[6, 8]
		},
		// Set Position [POS_SET]
		'55': {
			header: [0, 2],
			target: [2, 4],
			posX: 	[4, 8],
			posZ: 	[8, 12],
			posY: 	[12, 16]
		},
		// DIR_SET
		'56': {
			header: [0, 2],
			target: [2, 4],
			posX: 	[4, 8],
			posZ: 	[8, 12],
			posY: 	[12, 16]
		},
		// SET_VIB0
		'57': {
			header: [0, 2],
			zAlign: [2, 4],
			data0:  [4, 8],
			data1: 	[8, 12]
		},
		// SET_VIB1
		'58': {
			header: [0, 2],
			id: 	[2, 4],
			data0: 	[4, 8],
			data1: 	[8, 12]
		},
		// SET_VIB_FADE
		'59': {
			header: [0, 2],
			zAlign: [2, 4],
			data0: 	[4, 6],
			data1: 	[6, 8],
			data2: 	[8, 12],
			data3: 	[12, 16]
		},
		// RBJ Trigger [RBJ_SET]
		'5a': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// Display Message [MESSAGE_ON]
		'5b': {
			header: 	 [0, 2],
			id: 		 [2, 4],
			data0: 		 [4, 8],
			displayMode: [8, 12]
		},
		// RAIN_SET
		'5c': {
			header: [0, 2],
			value: 	[2, 4]
		},
		// MESSAGE_OFF
		'5d': {
			header: [0, 2]
		},
		// SHAKE_ON
		'5e': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 6]
		},
		// Change Weapon [WEAPON_CHG]
		'5f': {
			header:   [0, 2],
			weaponId: [2, 4]
		},
		// UNK_OPCODE_3
		'60': {
			header: [0, 2]
		},
		// Set Door [DOOR_AOT_SET]
		'61': {
			header: 	 [0, 2],
			id: 		 [2, 4],
			aot: 		 [4, 12],
			posX: 		 [12, 16],
			posY: 		 [16, 20],
			posZ: 		 [20, 24],
			posR: 		 [24, 28],
			nextXpos: 	 [28, 32],
			nextZpos: 	 [32, 36],
			nextYpos: 	 [36, 40],
			nextRpos: 	 [40, 44],
			nextStage: 	 [44, 46],
			nextRoom: 	 [46, 48],
			nextCam: 	 [48, 50],
			zIndex: 	 [50, 52],
			doorType: 	 [52, 54],
			openOrient:	 [54, 56],
			unk0: 		 [56, 58],
			lockFlag: 	 [58, 60],
			lockKey: 	 [60, 62],
			displayText: [62, 64]
		},
		// Set Door 4P [DOOR_AOT_SET_4P]
		'62': {
			header: 	 [0, 2],
			id: 		 [2, 4],
			aot: 		 [4, 12],
			posX: 		 [12, 16],
			posY: 		 [16, 20],
			posZ: 		 [20, 24],
			posR: 		 [24, 28],
			val4P: 		 [28, 44],
			nextXpos: 	 [44, 48],
			nextYpos: 	 [48, 52],
			nextZpos: 	 [52, 56],
			nextRpos: 	 [56, 60],
			nextStage:   [60, 62],
			nextRoom: 	 [62, 64],
			nextCam: 	 [64, 66],
			zIndex: 	 [66, 68],
			doorType: 	 [68, 70],
			openOrient:  [70, 72],
			unk0: 		 [72, 74],
			lockFlag:  	 [74, 76],
			lockKey: 	 [76, 78],
			displayText: [78, 80]
		},
		// Set Interactive Object [AOT_SET]
		'63': {
			header: 	 [0, 2],
			id: 		 [2, 4],
			aot: 		 [4, 6],
			type: 		 [6, 8],
			nFloor: 	 [8, 10],
			aotSuper:  	 [10, 12],
			posX: 		 [12, 16],
			posY: 		 [16, 20],
			posW: 		 [20, 24],
			posH:	 	 [24, 28],
			data0:  	 [28, 30],
			data1:  	 [30, 32],
			data2: 		 [32, 34],
			data3: 		 [34, 36],
			displayMode: [36, 40]
		},
		// AOT_RESET
		'65': {
			header: [0, 2],
			aot: 	[2, 4],
			id: 	[4, 6],
			type: 	[6, 8],
			unk3:   [8, 10],
			unk0: 	[10, 12],
			num: 	[12, 14],
			unk1: 	[14, 16],
			flag: 	[16, 18],
			unk2: 	[18, 20]
		},
		// Run Interactive Object [AOT_ON]
		'66': {
			header: [0, 2],
			id:  	[2, 4]
		},
		// Set Item [ITEM_AOT_SET]
		'67': {
			header: 	 [0, 2],
			id:			 [2, 4],
			aot: 		 [4, 12],
			posX: 		 [12, 16],
			posY: 		 [16, 20],
			posZ: 		 [20, 24],
			posR: 		 [24, 28],
			itemCode: 	 [28, 30],
			unk0: 		 [30, 32],
			itemQuant: 	 [32, 34],
			unk1: 		 [34, 36],
			unk2: 		 [36, 38],
			itemFlag:	 [38, 40],
			modelId:	 [40, 42],
			itemMP:		 [42, 44]
		},
		// Set Item 4P [ITEM_AOT_SET_4P]
		'68': {
			header: 	 [0, 2],
			id:			 [2, 4],
			aot: 		 [4, 12],
			posX:	     [12, 16],
			posY:	     [16, 20],
			posZ:	     [20, 24],
			posR:	     [24, 28],
			val4P: 		 [28, 44],
			itemCode:    [44, 46],
			unk0: 	     [46, 48],
			itemQuant:	 [48, 50],
			unk1: 		 [50, 52],
			unk2: 		 [52, 54],
			itemFlag: 	 [54, 56],
			modelId: 	 [56, 58],
			itemMP:      [58, 60]
		},
		/*
			Shadow Effect [KAGE_SET]
			Using Khaled SA infos
		*/
		'69': {
			header: [0, 2],
			target: [2, 4],
			id: 	[4, 6],
			unk0: 	[6, 8],
			scale0: [8, 10],
			scale1: [10, 12],
			scale2: [12, 14],
			scale3: [14, 16],
			scale4: [16, 18],
			unk1: 	[18, 28]
		},
		// SUPER_SET
		'6a': {
			header: [0, 2],
			zAlign: [2, 4],
			aot: 	[4, 6],
			id: 	[6, 8],
			data0: 	[8, 12],
			data1: 	[12, 16],
			data2: 	[16, 20],
			posX: 	[20, 24],
			posY: 	[24, 28],
			posZ: 	[28, 32]
		},
		// KEEP_ITEM_CK
		'6b': {
			header: [0, 2],
			itemId: [2, 4]
		},
		// KEY_CK
		'6c': {
			header: [0, 2],
			flag: 	[2, 4],
			value:  [4, 8]
		},
		// TRG_CK
		'6d': {
			header: [0, 2],
			flag: 	[2, 4],
			value: 	[4, 8]
		},
		// SCA_ID_SET
		'6e': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 8]
		},
		// OM_BOMB
		'6f': {
			header: [0, 2],
			omId: 	[2, 4]
		},
		// ESPR_ON [WIP]
		'70': {
			header: [0, 2]
		},
		// ESPR_KILL2
		'75': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// ESPR_KILL_ALL
		'76': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 6]
		},
		// Play SE [SE_ON]
		'77': {
			header: [0, 2],
			id: 	[2, 4],
			type: 	[4, 6],
			data1: 	[6, 8],
			work: 	[8, 10],
			data3: 	[10, 12],
			seX: 	[12, 16],
			seY: 	[16, 20],
			seZ: 	[20, 24]
		},
		// BGM_CTL
		'78': {
			header: [0, 2],
			id: 	[2, 4],
			op: 	[4, 6],
			type: 	[6, 8],
			value: 	[8, 10],
			volume: [10, 12]
		},
		// XA_ON
		'79': {
			header: [0, 2],
			xaId: 	[2, 4],
			xaData: [4, 8]
		},
		// Call Cinematic [MOVIE_ON]
		'7a': {
			header:  [0, 2],
			movieId: [2, 4]
		},
		// BGM_TBL_SET
		'7b': {
			header: [0, 2],
			zAlign: [2, 4],
			id0: 	[4, 6],
			id1: 	[6, 8],
			type: 	[8, 12]
		},
		// Open Inventory [STATUS_ON]
		'7c': {
			header: [0, 2]
		},
		// Set Enemy / NPC [EM_SET]
		'7d': {
			header:  	  [0, 2],
			unk0:  	 	  [2, 4],
			enemyId: 	  [4, 6],
			enemyType: 	  [6, 8],
			enemyPose: 	  [8, 10],
			unk1:  		  [10, 12], // Mrox Tip: Use 44 if your putting a partner
			unk2: 		  [12, 18],
			soundSet: 	  [18, 20],
			texture: 	  [20, 22],
			enemyFlag: 	  [22, 24],
			posX: 		  [24, 28],
			posY: 		  [28, 32],
			posZ: 		  [32, 36],
			posR: 		  [36, 40],
			motion:		  [40, 44],
			ctrlFlag: 	  [44, 48]
		},
		// MIZU_DIV
		'7e': {
			header: [0, 2],
			mizuId:	[2, 4]
		},
		/*
			Set 3D Models [OM_SET]
			(Aka. the biggest opcode!)
			Table by Khaled SA
		*/
		'7f': {
			header:   [0,  2],
			objId: 	  [2,  4],
			aot: 	  [4,  6],  // (0x00: item Model, 0x01: water, 0x04: Target)
			moveType: [6,  8],  // (0x00: Stop, 0xA0~0xA9: Moving) // if (AotType == "Water"){}
			pattern:  [8,  12], // Object Pattern // if (AotType == "Water"){}
			data0:    [12, 14],
			speed: 	  [14, 16], // (0x00~0x0F) (Slow~Fast)
			zIndex:   [16, 18],
			superId:  [18, 20], // [0xC0~0xC9: Player, NPC, Enemeis ID's] [0x80~0x89: Models ID's], (0xC+ Target ID) (0x8+ Target ID)
			setFlag:  [20, 22],
			beFlag:   [22, 24],
			boolType: [24, 26], // Set Model (0x00: ON, 0x01: OFF)
			setCol:   [26, 28], // (0x60: OFF, 0x80: ON, 0x03: Push)
			visib: 	  [28, 30], // (0x10~0x20) (High~Low)
			colType:  [30, 32], // (0x00: Round, 0x40: Square)
			posX: 	  [32, 36],
			posZ: 	  [36, 40],
			posY: 	  [40, 44],
			dirX: 	  [44, 48],
			dirY:  	  [48, 52],
			dirZ:  	  [52, 56],
			colPosX:  [56, 60],
			colPosY:  [60, 64],
			colPosZ:  [64, 68],
			colDirX:  [68, 72],
			colDirY:  [72, 76],
			colDirZ:  [76, 80]
		},
		// Motion Trigger [PLC_MOTION]
		'80': {
			header: [0, 2],
			id: 	[2, 4],
			value:  [4, 6],	
			type: 	[6, 8]
		},
		// Set Animation DEST [PLC_DEST]
		'81': {
			header:    	  [0, 2],
			zAlign:    	  [2, 4],
			animation: 	  [4, 6],
			animModifier: [6, 8],
			dataA: 		  [8, 12],
			dataB: 		  [12, 16]
		},
		// Set Head Animation [PLC_NECK]
		'82': {
			header: [0, 2],
			type: 	[2, 4],
			repeat:	[4, 6],
			data0: 	[6, 8],
			data1: 	[8, 12],
			data2: 	[12, 16],
			data3:  [16, 18],
			speed: 	[18, 20]
		},
		// Player Return [PLC_RET]
		'83': {
			header: [0, 2]
		},
		// PLC_FLG
		'84': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 8]
		},
		// PLC_GUN
		'85': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// PLC_GUN_EFF
		'86': {
			header: [0, 2]
		},
		// PLC_STOP
		'87': {
			header: [0, 2]
		},
		// PLC_ROT
		'88': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 8]
		},
		// PLC_CNT
		'89': {
			header: [0, 2],
			id: 	[2, 4]
		},
		// SPLC_RET
		'8a': {
			header: [0, 2]
		},
		// SPLC_SCE
		'8b': {
			header: [0, 2]
		},
		// PLC_SCE
		'8c': {
			header: [0, 2]
		},
		// SPL_WEAPON_CHG
		'8d': {
			header: [0, 2]
		},
		// PLC_MOT_NUM
		'8e': {
			header: [0, 2],
			id: 	[2, 4],
			value: 	[4, 8]
		},
		// Reset Enemy Animation [EM_RESET]
		'8f': {
			header: [0, 2],
			id: 	[2, 4]
		}
	},
	/*
		SCD Flags
		Options from SCD is set here
	*/
	// Execute Calculation [CALC_OP] Operations
	R3_SCD_CALC_OP_OPERATIONS = {
		'00': 'Add (++)',
		'01': 'Subtract (--)',
		'02': 'Unknown Operation',
		'03': 'Unknown Operation',
		'04': 'Modulo (%)',
		'05': 'Or (||)',
		'06': 'And (&&)',
		'07': 'Xor',
		'0a': 'Unknown Operation',
		'f8': 'Unknown Operation'
	},
	// SCD FLAGS
	R3_SCD_FLAG = {
		'00': 'False (OFF)',
		'01': 'True (ON)'
	},
	R3_SCD_CODE_FLAGS = {
		'00': false,
		'01': true
	},
	// Set 3D Object [OM_SET] AOT Types
	R3_SCD_OM_SET_AOT_TYPES = {
		'00': 'Item Model',
		'01': 'Water',
		'04': 'Target'
	},
	// Set 3D Object [OM_SET] Colission Types
	R3_SCD_OM_SET_COLISSION_TYPES = {
		'00': 'Round',
		'40': 'Square'
	},
	// Set 3D Object [OM_SET] Colission Shape
	R3_SCD_OM_SET_COLISSION_SHAPES = {
		'60': 'Off',
		'80': 'On',
		'03': 'Push'
	},
	// SET_TIMER Targets
	R3_SCD_SET_TIMER_TARGET = {
		'04': 'Unknown Target',
		'05': 'First digit of Lock Puzzle',
		'06': 'Second digit of Lock Puzzle',
		'07': 'Third digit of Lock Puzzle',
		'08': 'Last digit of Lock Puzzle',
		'09': 'Unknown Target',
		'0a': 'Unknown Target',
		'0b': 'Unknown Target',
		'1f': 'Unknown Target',
		'20': 'Unknown Target',
		'26': 'Unknown Target',
		'27': 'Unknown Target',
		'29': 'Game Over Countdown',
		'2a': 'Unknown Target',
		'2b': 'Unknown Target'
	},
	// FADE_SET Types
	R3_SCD_FADE_SET_TYPES = {
		'00': 'Odd Fade',
		'01': 'White Fade',
		'02': 'Black Fade',
		'03': 'Soft Fade',
		'04': 'Odd Fade',
		'05': 'White Fade',
		'06': 'Black Fade',
		'07': 'Soft Fade',
		'08': 'Odd Fade'
	},
	/*
		CK Variables
		Original list by Khaled SA
	*/
	R3_SCD_CK_VARS = {
		'00': 'Game mode',
		'01': 'Unknown Variable',
		'03': 'Event',
		'04': 'Unknown Variable',
		'05': 'Enemy flag',
		'06': 'Enemy ID',
		'07': 'Item flag',
		'08': 'Item ID',
		'09': 'Unknown Variable',
		'26': 'Times up',
		'27': 'Unknown Variable',
		'29': 'Times down',
		'2f': 'Unknown Variable',
		'30': 'RNG',
		'31': 'Door ID'
	},
	/*
		CK Special Conditions
	*/
	R3_SCD_CK_SPECIAL_CONTITIONS = {
		'06': 'Unknown Condition'
	},
	/*
		Set Event Values Info
		Database created using Khaled values
	*/
	R3_SCD_SET_VALUES = {
		'00': 'Null',
		'01': 'Player',
		'02': 'NPC',
		'03': 'Enemies',
		'04': 'Models',
		'05': 'Timer',
		'06': 'Unknown Value',
		'07': 'Lock Control',
		'08': 'Unknown Value',
		'09': 'Unknown Value',
		'0a': 'Unknown Value',
		'0b': 'Unknown Value',
		'0c': 'Unknown Value',
		'0d': 'Unknown Value',
		'0e': 'Unknown Value',
		'0f': 'Unknown Value',
		'10': 'Unknown Value',
		'11': 'Finish Game',
		'12': 'Unknown Value',
		'13': 'Unknown Value',
		'14': 'Unknown Value',
		'15': 'Unknown Value',
		'16': 'Unknown Value',
		'17': 'Unknown Value',
		'18': 'Unknown Value',
		'19': 'Unknown Value',
		'1a': 'Unknown Value',
		'1b': 'Unknown Value',
		'1c': 'Cutscene Frame',
		'1d': 'Unknown Value',
		'1e': 'Unknown Value',
		'1f': 'Unknown Value',
		'20': 'Unknown Value',
		'21': 'Unknown Value',
		'22': 'Unknown Value',
		'23': 'Unknown Value',
		'24': 'Unknown Value',
		'25': 'Unknown Value',
		'26': 'Unknown Value',
		'27': 'Unknown Value',
		'28': 'Unknown Value',
		'29': 'Unknown Value',
		'2a': 'Unknown Value',
		'2b': 'Unknown Value',
		'2c': 'Unknown Value',
		'2d': 'Unknown Value',
		'2e': 'Unknown Value',
		'2f': 'RNG Flag',
		'30': 'RNG Percentage',
		'31': 'Unknown Value',
		'32': 'Unknown Value',
		'33': 'Unknown Value',
		'34': 'Unknown Value',
		'35': 'Unknown Value',
		'36': 'Unknown Value',
		'37': 'Unknown Value',
		'38': 'Unknown Value',
		'39': 'Unknown Value',
		'3a': 'Unknown Value',
		'3b': 'Unknown Value',
		'3c': 'Unknown Value',
		'3d': 'Unknown Value',
		'3e': 'Unknown Value',
		'3f': 'Unknown Value',
		'41': 'Unknown Value',
		'42': 'Unknown Value',
		'43': 'Unknown Value',
		'44': 'Unknown Value',
		'45': 'Unknown Value',
		'46': 'Unknown Value',
		'47': 'Unknown Value',
		'4a': 'Unknown Value',
		'4c': 'Unknown Value',
		'4d': 'Unknown Value',
		'4e': 'Unknown Value',
		'4f': 'Unknown Value',
		'50': 'Unknown Value',
		'51': 'Unknown Value',
		'52': 'Unknown Value',
		'53': 'Unknown Value',
		'54': 'Unknown Value',
		'55': 'Unknown Value',
		'56': 'Unknown Value',
		'57': 'Unknown Value',
		'58': 'Unknown Value',
		'59': 'Unknown Value',
		'5a': 'Unknown Value',
		'5b': 'Unknown Value',
		'5c': 'Unknown Value',
		'5d': 'Unknown Value',
		'5e': 'Unknown Value',
		'5f': 'Unknown Value',
		'60': 'Unknown Value',
		'61': 'Unknown Value',
		'62': 'Unknown Value',
		'63': 'Unknown Value',
		'64': 'Unknown Value',
		'65': 'Unknown Value',
		'66': 'Unknown Value',
		'67': 'Unknown Value',
		'68': 'Unknown Value',
		'69': 'Unknown Value',
		'6a': 'Unknown Value',
		'6b': 'Unknown Value',
		'6c': 'Unknown Value',
		'6d': 'Unknown Value',
		'6e': 'Unknown Value',
		'6f': 'Unknown Value',
		'70': 'Unknown Value',
		'71': 'Unknown Value',
		'72': 'Unknown Value',
		'73': 'Unknown Value',
		'74': 'Unknown Value',
		'75': 'Unknown Value',
		'76': 'Unknown Value',
		'77': 'Unknown Value',
		'78': 'Unknown Value',
		'79': 'Unknown Value',
		'7a': 'Unknown Value',
		'7b': 'Unknown Value',
		'7d': 'Unknown Value',
		'7e': 'Unknown Value',
		'7f': 'Unknown Value',
		'80': 'Unknown Value',
		'81': 'Unknown Value',
		'82': 'Unknown Value',
		'83': 'Unknown Value',
		'84': 'Unknown Value',
		'85': 'Unknown Value',
		'86': 'Unknown Value',
		'87': 'Unknown Value',
		'88': 'Unknown Value',
		'89': 'Unknown Value',
		'8a': 'Unknown Value',
		'8b': 'Unknown Value',
		'8b': 'Unknown Value',
		'8c': 'Unknown Value',
		'8d': 'Unknown Value',
		'8e': 'Unknown Value',
		'8f': 'Unknown Value',
		'90': 'Unknown Value',
		'91': 'Unknown Value',
		'92': 'Unknown Value',
		'93': 'Unknown Value',
		'94': 'Unknown Value',
		'95': 'Unknown Value',
		'96': 'Unknown Value',
		'97': 'Unknown Value',
		'98': 'Unknown Value',
		'99': 'Unknown Value',
		'9a': 'Unknown Value',
		'9b': 'Unknown Value',
		'9c': 'Unknown Value',
		'9d': 'Unknown Value',
		'9e': 'Unknown Value',
		'9f': 'Unknown Value',
		'a0': 'Unknown Value',
		'a1': 'Unknown Value',
		'a2': 'Unknown Value',
		'a3': 'Unknown Value',
		'a4': 'Unknown Value',
		'a5': 'Unknown Value',
		'a6': 'Unknown Value',
		'a7': 'Unknown Value',
		'a8': 'Unknown Value',
		'a9': 'Unknown Value',
		'aa': 'Unknown Value',
		'ab': 'Unknown Value',
		'ac': 'Unknown Value',
		'ad': 'Unknown Value',
		'ae': 'Unknown Value',
		'af': 'Unknown Value',
		'b0': 'Unknown Value',
		'b1': 'Unknown Value',
		'b2': 'Unknown Value',
		'b3': 'Unknown Value',
		'b4': 'Unknown Value',
		'b5': 'Unknown Value',
		'bb': 'Unknown Value',
		'bc': 'Unknown Value',
		'bf': 'Unknown Value',
		'c1': 'Unknown Value',
		'c2': 'Unknown Value',
		'c3': 'Unknown Value',
		'c4': 'Unknown Value',
		'c5': 'Unknown Value',
		'ce': 'Unknown Value',
		'd2': 'Unknown Value',
		'd5': 'Unknown Value',
		'd7': 'Unknown Value',
		'd9': 'Unknown Value',
		'da': 'Unknown Value',
		'db': 'Unknown Value',
		'df': 'Unknown Value',
		'e1': 'Unknown Value',
		'e2': 'Unknown Value',
		'e5': 'Unknown Value',
		'ea': 'Unknown Value',
		'ef': 'Unknown Value',
		'f1': 'Unknown Value',
		'f3': 'Unknown Value',
		'f4': 'Unknown Value',
		'f5': 'Unknown Value',
		'f6': 'Unknown Value',
		'f9': 'Unknown Value',
		'fa': 'Unknown Value',
		'fc': 'Unknown Value',
		'fd': 'Unknown Value',
		'fe': 'Unknown Value',
		'ff': 'Unknown Value'
	},
	// KAGE_SET Options
	R3_SCD_KAGE_OPTIONS = {
		'00': 'Null',
		'01': 'Player',
		'02': 'NPC',
		'03': 'Enemies'
	},
	// CMP List (Variables)
	R3_SCD_CMP_OPTIONS = {
		'02': 'the item',
		'04': 'Unknown Variable',
		'05': 'Unknown Variable',
		'06': 'the Character ID',
		'07': 'Unknown Value',
		'08': 'Unknown Value',
		'09': 'Unknown Value',
		'0b': 'Unknown Value',
		'1a': 'the Camera',
		'1b': 'the player returned from',
		'1c': 'the merceneries Mode',
		'1d': 'the story mode',
		'1e': 'Unknown Variable',
		'1f': 'the current room number',
		'20': 'Unknown Variable',
		'27': 'Unknown Variable',
		'2a': 'Unknown Variable'
	},
	// Compare List
	R3_SCD_COMPARE_VALUES = {
		'00': ['are equal to', 		 '==='],
		'01': ['is higher than',	 '>'],
		'02': ['is higher-equal to', '>='],
		'03': ['is lower than', 	 '<'],
		'04': ['is lower-equal to',  '=<'],
		'05': ['is different of', 	 '!=='],
		'06': ['and', 				 '&&']
	},
	// Char Trigger [WORK_SET] Target List
	R3_SCD_WORK_SET_TARGET = {
		'00': 'Null',
		'01': 'Player',
		'02': 'NPC',
		'03': 'Enemies',
		'04': '3D Models'
	},
	// SCD AOT Types
	R3_SCD_AOT_TYPES = {
		'04': ['Text Message',  'Msg ID', 'Data 1', 'Data 2', 'Data 3'],
		'05': ['Event', 		'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'06': ['Unknown Type',  'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'07': ['Unknown Type',  'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'08': ['Save Dialog',   'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'09': ['Item Box', 		'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'0a': ['Unknown Type',  'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'0b': ['Unknown Type',  'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'0c': ['Unknown Type',  'Data 0', 'Data 1', 'Data 2', 'Data 3'],
		'0e': ['Unknown Type',  'Data 0', 'Data 1', 'Data 2', 'Data 3']
	},
	// SCD PLC_NECK animations
	R3_SCD_PLC_NECK_ANIMATIONS = {
		'00': ['Unknown Animation', 'Data 0', 	 'Data 1', 	   'Data 2',  'Data 3'],
		'01': ['Unknown Animation', 'Data 0', 	 'Data 1', 	   'Data 2',  'Data 3'],
		'02': ['Move head axis', 	'Move Left', 'Move Right', 'Move Up', 'Data 3'],
		'03': ['[Nods]', 			'Data 0', 	 'Data 1', 	   'Data 2',  'Data 3'],
		'05': ['Unknown Animation', 'Data 0', 	 'Data 1', 	   'Data 2',  'Data 3'],
		'06': ['Unknown Animation', 'Data 0', 	 'Data 1', 	   'Data 2',  'Data 3'],
		'07': ['Unknown Animation', 'Data 0', 	 'Data 1', 	   'Data 2',  'Data 3']
	},
	/*
		Set Animation DEST [PLC_DEST] Animation Types
	
		Order:
		Animation, Data A Label, Data B Label, Extra Edit
	*/
	R3_SCD_PLC_DEST_ANIMATIONS = {
		'01': ['Walk Backwards and freeze?', '<font class="COLOR_X">X Pos</font>', '<font class="COLOR_Y">Y Pos</font>', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(8);">'],
		'02': ['Walk Turning?', '<font class="COLOR_X">X Pos</font>', '<font class="COLOR_Y">Y Pos</font>', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(8);">'],
		'04': ['Walking', '<font class="COLOR_X">X Pos</font>', '<font class="COLOR_Y">Y Pos</font>', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(8);">'],
		'05': ['Running', '<font class="COLOR_X">X Pos</font>', '<font class="COLOR_Y">Y Pos</font>', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(8);">'],
		'07': ['Walk Backwards', '<font class="COLOR_X">X Pos</font>', '<font class="COLOR_Y">Y Pos</font>', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(8);">'],
		'08': ['Walk Backwards', '<font class="COLOR_X">X Pos</font>', '<font class="COLOR_Y">Y Pos</font>', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(8);">'],
		'09': ['Turn 1',  '<font class="COLOR_R">Rotation</font>', 'Speed', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(9);">'],
		'0a': ['Gun Animation', 'Animation Type 1', 'Animation Type 2', ''],
		'0b': ['Unknown Animation', 'Unk 1', 'Unk 2', ''],
		'14': ['Freeze', 'Unk 1', 'Unk 2', ''],
		'15': ['Turn 2',  '<font class="COLOR_R">Rotation</font>', 'Speed', '<input type="button" class="BTN_R3CLASSIC BTN_R3CLASSIC_APPLY" value="Use Player Pos." onclick="R3_SCD_EDIT_FUNCTION_usePlayerPos(9);">']
	},
	// SCD MSG DisplayMode
	R3_SCD_MSG_DISPLAYMODE = {
		'ffff': 'Normal',
		'0000': 'Can move',
		'0f00': 'Unknown mode',
		'0100': 'Unknown mode',
		'fff5': 'Unknown mode',
		'fffd': 'Unknown mode',
		'0101': 'Don\'t Freeze + Can\'t move',
		'1020': 'Can move and message dissapears after some seconds',
		'2010': 'Can move and message dissapears after some seconds',
		'ffef': 'Normal (Used in some items)'
	},
	// SCD Set Item [ITEM_AOT_SET] and Set Item 4P [ITEM_AOT_SET_4P] blink colors
	R3_SCD_ITEM_AOT_SET_BLINK_COLORS = {
		'0': 'Transparent',
		'1': 'Unknown Color',
		'2': 'Unknown Color',
		'3': 'Unknown Color',
		'4': 'Unknown Color',
		'5': 'Unknown Color',
		'6': 'Unknown Color',
		'7': 'Unknown Color',
		'8': 'White',
		'9': 'Unknown Color',
		'a': 'Blue',
		'b': 'Blue',
		'c': 'Red',
		'd': 'Unknown Color',
		'e': 'Unknown Color',
		'f': 'Unknown Color'
	};
	/*
		SCD Presets
	*/
	R3_SCD_PRESET_LIST = {
		0: ['Start Cutscene', ['090a0600', '470100', '4d011c01', '4d020701', '00']],
		1: ['End Cutscene',   ['4d011c00', '4d020700', '83', '00']],
		2: ['Finish Game',    ['780002000000', '780102000000', '780202000000', '090a0a00', '4d001101']]
	},
	/*
		MSG Database
	*/
	MSG_RE3_DATABASE = {
		'00': [false, ' ', 1],
		'01': [false, '.', 1],
		'02': [false, 'º', 1],
		'03': [false, '(SPECIAL CHAR 1)', 1],
		'04': [false, '(SPECIAL CHAR 2)', 1],
		'05': [false, '<code><</code>', 1],
		'06': [false, '<code>></code>', 1],
		'07': [false, '(SPECIAL CHAR 3)', 1],
		'08': [false, '(SPECIAL CHAR 4)', 1],
		'09': [false, '[', 1],
		'0a': [false, ']', 1],
		'0b': [false, '(Down Arrow)', 1],
		'0c': [false, '0', 1],
		'0d': [false, '1', 1],
		'0e': [false, '2', 1],
		'0f': [false, '3', 1],
		'10': [false, '4', 1],
		'11': [false, '5', 1],
		'12': [false, '6', 1],
		'13': [false, '7', 1],
		'14': [false, '8', 1],
		'15': [false, '9', 1],
		'16': [false, ':', 1],
		'17': [false, '.', 1],
		'18': [false, ',', 1],
		'19': [false, '^', 1],
		'1a': [false, '!', 1],
		'1b': [false, '?', 1],
		'1c': [false, '$', 1],
		'1d': [false, 'A', 1],
		'1e': [false, 'B', 1],
		'1f': [false, 'C', 1],
		'20': [false, 'D', 1],
		'21': [false, 'E', 1],
		'22': [false, 'F', 1],
		'23': [false, 'G', 1],
		'24': [false, 'H', 1],
		'25': [false, 'I', 1],
		'26': [false, 'J', 1],
		'27': [false, 'K', 1],
		'28': [false, 'L', 1],
		'29': [false, 'M', 1],
		'2a': [false, 'N', 1],
		'2b': [false, 'O', 1],
		'2c': [false, 'P', 1],
		'2d': [false, 'Q', 1],
		'2e': [false, 'R', 1],
		'2f': [false, 'S', 1],
		'30': [false, 'T', 1],
		'31': [false, 'U', 1],
		'32': [false, 'V', 1],
		'33': [false, 'W', 1],
		'34': [false, 'X', 1],
		'35': [false, 'Y', 1],
		'36': [false, 'Z', 1],
		'37': [false, '+', 1],
		'38': [false, '/', 1],
		'39': [false, '-', 1],
		'3a': [false, '\'', 1],
		'3b': [false, '-', 1],
		'3d': [false, 'a', 1],
		'3e': [false, 'b', 1],
		'3f': [false, 'c', 1],
		'40': [false, 'd', 1],
		'41': [false, 'e', 1],
		'42': [false, 'f', 1],
		'43': [false, 'g', 1],
		'44': [false, 'h', 1],
		'45': [false, 'i', 1],
		'46': [false, 'j', 1],
		'47': [false, 'k', 1],
		'48': [false, 'l', 1],
		'49': [false, 'm', 1],
		'4a': [false, 'n', 1],
		'4b': [false, 'o', 1],
		'4c': [false, 'p', 1],
		'4d': [false, 'q', 1],
		'4e': [false, 'r', 1],
		'4f': [false, 's', 1],
		'50': [false, 't', 1],
		'51': [false, 'u', 1],
		'52': [false, 'v', 1],
		'53': [false, 'w', 1],
		'54': [false, 'x', 1],
		'55': [false, 'y', 1],
		'56': [false, 'z', 1],
		'57': [false, '(Unknown Char / Function Nº 00 - Hex: 57)', 1],
		'58': [false, '(Unknown Char / Function Nº 01 - Hex: 58)', 1],
		'59': [false, '(Unknown Char / Function Nº 02 - Hex: 59)', 1],
		// Text format
		'5a': [false, 'á', 1],
		'5b': [false, 'à', 1],
		'5c': [false, 'â', 1],
		'5d': [false, 'ã', 1],
		'5e': [false, 'é', 1],
		'5f': [false, 'õ', 1],
		'60': [false, 'ç', 1],
		'61': [false, 'ê', 1],
		'62': [false, 'ó', 1],
		'63': [false, '=', 1],
		//
		'64': [false, '(Unknown Char / Function Nº 13 - Hex: 64)', 1],
		'65': [false, '(Unknown Char / Function Nº 14 - Hex: 65)', 1],
		'66': [false, '(Unknown Char / Function Nº 15 - Hex: 66)', 1],
		'67': [false, '(Unknown Char / Function Nº 16 - Hex: 67)', 1],
		'68': [false, '(Unknown Char / Function Nº 17 - Hex: 68)', 1],
		'69': [false, '(Unknown Char / Function Nº 18 - Hex: 69)', 1],
		'6a': [false, '(Unknown Char / Function Nº 19 - Hex: 6A)', 1],
		'6b': [false, '(Unknown Char / Function Nº 20 - Hex: 6B)', 1],
		'6c': [false, '(Unknown Char / Function Nº 21 - Hex: 6C)', 1],
		'6d': [false, '(Unknown Char / Function Nº 22 - Hex: 6D)', 1],
		'6e': [false, '(Unknown Char / Function Nº 23 - Hex: 6E)', 1],
		'6f': [false, '(Unknown Char / Function Nº 24 - Hex: 6F)', 1],
		'71': [false, '(Unknown Char / Function Nº 26 - Hex: 71)', 1],
		'72': [false, '(Unknown Char / Function Nº 27 - Hex: 72)', 1],
		'73': [false, '(Unknown Char / Function Nº 28 - Hex: 73)', 1],
		'74': [false, '(Unknown Char / Function Nº 29 - Hex: 74)', 1],
		'75': [false, '(Unknown Char / Function Nº 30 - Hex: 75)', 1],
		'76': [false, '(Unknown Char / Function Nº 31 - Hex: 76)', 1],
		'77': [false, '(Unknown Char / Function Nº 32 - Hex: 77)', 1],
		'78': [false, '(Unknown Char / Function Nº 33 - Hex: 78)', 1],
		'79': [false, '(Unknown Char / Function Nº 34 - Hex: 79)', 1],
		'7a': [false, '(Unknown Char / Function Nº 35 - Hex: 7A)', 1],
		'7b': [false, '(Unknown Char / Function Nº 36 - Hex: 7B)', 1],
		'7c': [false, '(Unknown Char / Function Nº 37 - Hex: 7C)', 1],
		'7d': [false, '(Unknown Char / Function Nº 38 - Hex: 7D)', 1],
		'7e': [false, '(Unknown Char / Function Nº 39 - Hex: 7E)', 1],
		'7f': [false, '(Unknown Char / Function Nº 40 - Hex: 7F)', 1],
		'80': [false, '(Unknown Char / Function Nº 41 - Hex: 80)', 1],
		'81': [false, '(Unknown Char / Function Nº 42 - Hex: 81)', 1],
		'82': [false, '(Unknown Char / Function Nº 43 - Hex: 82)', 1],
		'83': [false, '(Unknown Char / Function Nº 44 - Hex: 83)', 1],
		'84': [false, '(Unknown Char / Function Nº 45 - Hex: 84)', 1],
		'85': [false, '(Unknown Char / Function Nº 46 - Hex: 85)', 1],
		'86': [false, '(Unknown Char / Function Nº 47 - Hex: 86)', 1],
		'87': [false, '(Unknown Char / Function Nº 48 - Hex: 87)', 1],
		'88': [false, '(Unknown Char / Function Nº 49 - Hex: 88)', 1],
		'89': [false, '(Unknown Char / Function Nº 50 - Hex: 89)', 1],
		'8a': [false, '(Unknown Char / Function Nº 51 - Hex: 8A)', 1],
		'8b': [false, '(Unknown Char / Function Nº 52 - Hex: 8B)', 1],
		'8c': [false, '(Unknown Char / Function Nº 53 - Hex: 8C)', 1],
		'8d': [false, '(Unknown Char / Function Nº 54 - Hex: 8D)', 1],
		'8e': [false, '(Unknown Char / Function Nº 55 - Hex: 8E)', 1],
		'8f': [false, '(Unknown Char / Function Nº 56 - Hex: 8F)', 1],
		'90': [false, '(Unknown Char / Function Nº 57 - Hex: 90)', 1],
		'91': [false, '(Unknown Char / Function Nº 58 - Hex: 91)', 1],
		'92': [false, '(Unknown Char / Function Nº 59 - Hex: 92)', 1],
		'93': [false, '(Unknown Char / Function Nº 60 - Hex: 93)', 1],
		'94': [false, '(Unknown Char / Function Nº 61 - Hex: 94)', 1],
		'95': [false, '(Unknown Char / Function Nº 62 - Hex: 95)', 1],
		'96': [false, '(Unknown Char / Function Nº 63 - Hex: 96)', 1],
		'97': [false, '(Unknown Char / Function Nº 64 - Hex: 97)', 1],
		'98': [false, '(Unknown Char / Function Nº 65 - Hex: 98)', 1],
		'99': [false, '(Unknown Char / Function Nº 66 - Hex: 99)', 1],
		'9a': [false, '(Unknown Char / Function Nº 67 - Hex: 9A)', 1],
		'9b': [false, '(Unknown Char / Function Nº 68 - Hex: 9B)', 1],
		'9c': [false, '(Unknown Char / Function Nº 69 - Hex: 9C)', 1],
		'9d': [false, '(Unknown Char / Function Nº 70 - Hex: 9D)', 1],
		'9e': [false, '(Unknown Char / Function Nº 71 - Hex: 9E)', 1],
		'9f': [false, '(Unknown Char / Function Nº 72 - Hex: 9F)', 1],
		'a1': [false, '(Unknown Char / Function Nº 74 - Hex: A1)', 1],
		'a2': [false, '(Unknown Char / Function Nº 75 - Hex: A2)', 1],
		'a3': [false, '(Unknown Char / Function Nº 76 - Hex: A3)', 1],
		'a4': [false, '(Unknown Char / Function Nº 77 - Hex: A4)', 1],
		'a5': [false, '(Unknown Char / Function Nº 78 - Hex: A5)', 1],
		'a6': [false, '(Unknown Char / Function Nº 79 - Hex: A6)', 1],
		'a7': [false, '(Unknown Char / Function Nº 80 - Hex: A7)', 1],
		'a8': [false, '(Unknown Char / Function Nº 81 - Hex: A8)', 1],
		'a9': [false, '(Unknown Char / Function Nº 82 - Hex: A9)', 1],
		'aa': [false, '(Unknown Char / Function Nº 83 - Hex: AA)', 1],
		'ab': [false, '(Unknown Char / Function Nº 84 - Hex: AB)', 1],
		'ac': [false, '(Unknown Char / Function Nº 85 - Hex: AC)', 1],
		'ad': [false, '(Unknown Char / Function Nº 86 - Hex: AD)', 1],
		'ae': [false, '(Unknown Char / Function Nº 87 - Hex: AE)', 1],
		'af': [false, '(Unknown Char / Function Nº 88 - Hex: AF)', 1],
		'b0': [false, '(Unknown Char / Function Nº 89 - Hex: B0)', 1],
		'b1': [false, '(Unknown Char / Function Nº 90 - Hex: B1)', 1],
		'b2': [false, '(Unknown Char / Function Nº 91 - Hex: B2)', 1],
		'b3': [false, '(Unknown Char / Function Nº 92 - Hex: B3)', 1],
		'b4': [false, '(Unknown Char / Function Nº 93 - Hex: B4)', 1],
		'b5': [false, '(Unknown Char / Function Nº 94 - Hex: B5)', 1],
		'b6': [false, '(Unknown Char / Function Nº 95 - Hex: B6)', 1],
		'b7': [false, '(Unknown Char / Function Nº 96 - Hex: B7)', 1],
		'b9': [false, '(Unknown Char / Function Nº 98 - Hex: B9)', 1],
		'ba': [false, '(Unknown Char / Function Nº 99 - Hex: BA)', 1],
		'bb': [false, '(Unknown Char / Function Nº 100 - Hex: BB)', 1],
		'bc': [false, '(Unknown Char / Function Nº 101 - Hex: BC)', 1],
		'bd': [false, '(Unknown Char / Function Nº 102 - Hex: BD)', 1],
		'bf': [false, '(Unknown Char / Function Nº 104 - Hex: BF)', 1],
		'c2': [false, '(Unknown Char / Function Nº 107 - Hex: C2)', 1],
		'c3': [false, '(Unknown Char / Function Nº 108 - Hex: C3)', 1],
		'c4': [false, '(Unknown Char / Function Nº 109 - Hex: C4)', 1],
		'c5': [false, '(Unknown Char / Function Nº 110 - Hex: C5)', 1],
		'c6': [false, '(Unknown Char / Function Nº 111 - Hex: C6)', 1],
		'c7': [false, '(Unknown Char / Function Nº 112 - Hex: C7)', 1],
		'c8': [false, '(Unknown Char / Function Nº 113 - Hex: C8)', 1],
		'c9': [false, '(Unknown Char / Function Nº 114 - Hex: C9)', 1],
		'cb': [false, '(Unknown Char / Function Nº 116 - Hex: CB)', 1],
		'cc': [false, '(Unknown Char / Function Nº 117 - Hex: CC)', 1],
		'cd': [false, '(Unknown Char / Function Nº 118 - Hex: CD)', 1],
		'ce': [false, '(Unknown Char / Function Nº 119 - Hex: CE)', 1],
		'cf': [false, '(Unknown Char / Function Nº 120 - Hex: CF)', 1],
		'd0': [false, '(Unknown Char / Function Nº 121 - Hex: D0)', 1],
		'd2': [false, '(Unknown Char / Function Nº 123 - Hex: D2)', 1],
		'd3': [false, '(Unknown Char / Function Nº 124 - Hex: D3)', 1],
		'd4': [false, '(Unknown Char / Function Nº 125 - Hex: D4)', 1],
		'd5': [false, '(Unknown Char / Function Nº 126 - Hex: D5)', 1],
		'd6': [false, '(Unknown Char / Function Nº 127 - Hex: D6)', 1],
		'd8': [false, '(Unknown Char / Function Nº 129 - Hex: D8)', 1],
		'd9': [false, '(Unknown Char / Function Nº 130 - Hex: D9)', 1],
		'da': [false, '(Unknown Char / Function Nº 131 - Hex: DA)', 1],
		'db': [false, '(Unknown Char / Function Nº 132 - Hex: DB)', 1],
		'dc': [false, '(Unknown Char / Function Nº 133 - Hex: DC)', 1],
		'dd': [false, '(Unknown Char / Function Nº 134 - Hex: DD)', 1],
		'de': [false, '(Unknown Char / Function Nº 135 - Hex: DE)', 1],
		'df': [false, '(Unknown Char / Function Nº 136 - Hex: DF)', 1],
		'e0': [false, '(Unknown Char / Function Nº 137 - Hex: E0)', 1],
		'e1': [false, '(Unknown Char / Function Nº 138 - Hex: E1)', 1],
		'e2': [false, '(Unknown Char / Function Nº 139 - Hex: E2)', 1],
		'e3': [false, '(Unknown Char / Function Nº 141 - Hex: E3)', 1],
		'e4': [false, '(Unknown Char / Function Nº 142 - Hex: E4)', 1],
		'e5': [false, '(Unknown Char / Function Nº 143 - Hex: E5)', 1],
		'e6': [false, '(Unknown Char / Function Nº 144 - Hex: E6)', 1],
		'e7': [false, '(Unknown Char / Function Nº 145 - Hex: E7)', 1],
		'e8': [false, '(Unknown Char / Function Nº 146 - Hex: E8)', 1],
		'e9': [false, '(Unknown Char / Function Nº 147 - Hex: E9)', 1],
		'eb': [false, '(Unknown Char / Function Nº 148 - Hex: EB)', 1],
		'ec': [false, '(Unknown Char / Function Nº 149 - Hex: EC)', 1],
		'ed': [false, '(Unknown Char / Function Nº 150 - Hex: ED)', 1],
		'ee': [false, '(Unknown Char / Function Nº 151 - Hex: EE)', 1],
		'ef': [false, '(Unknown Char / Function Nº 152 - Hex: EF)', 1],
		'f1': [false, '(Unknown Char / Function Nº 154 - Hex: F1)', 1],
		'f2': [false, '(Unknown Char / Function Nº 155 - Hex: F2)', 1],
		'f6': [false, '(Unknown Char / Function Nº 159 - Hex: F6)', 1],
		'f7': [false, '(Item Separator)',   						1],
		//
		'a0': [false, '(Climax)',			   						1],
		'fb': [false, '(Yes / No)', 	    						1],
		'fc': [false, '(Line Break)<br>',   						1], // Enter
		'fd': [false, '(Pause)', 		    						1],
		'ff': [false, '(Unknown CHAR)',     						1],
		// Special commands (functions)
		'70': [true, '(Function: Select Option - Args: ',		11, 2],
		'fa': [true, '(Function: Start Message - Text Speed: ',  1, 2],
		'fe': [true, '(Function: End Message - Args: ',			 2, 2],
		'ea': [true, '(Function: Show Special Char - Char ID:',  4, 2], // (Relative to modifier)
		'f0': [true, '(Function: Show Special Char - Char ID:',  4, 2], // (Relative to modifier)
		'f8': [true, '(Function: Show Item Name - Item ID:', 	 5, 2],
		'f3': [true, '(Function: Play SE - SE ID: ',  			 6, 2], // (Relative to modifier) 
		/* 
			Info: Se o valor na frente de F3 for 43, O game irá executar o som da arma equipada.
			Mas, quando esse comando for executado, alguns sons de menu / porta irão deixar de ser reproduzidos.
			Isso parece depender do soundset que foi carregado no mapa.
	
			At least on R105.RDT
		*/
		'f4': [true, '(Function: Change Camera - Cam ID: ', 	 7, 2],
		'f5': [true, '(Function: (UNK) Function F5 - Args: ',	 8, 2], // Used on "Septemer, 28" text
		'f9': [true, '(Function: Text Color - Color: ',			 9, 2],
		// CT-STARS PATCH COMPAT
		'd7': [false, ' ', 											1],
		'3c': [false, 'ã', 											1],
		'b8': [false, 'á', 											1],
		'be': [false, 'ç', 											1],
		'c0': [false, 'é', 											1],
		'c1': [false, 'ê', 											1],
		'ca': [false, 'ó', 											1],
		'd1': [false, 'ú', 											1]
	},
	MSG_DATABASE_FUNCTIONS = {
		3: [
			'70', // Show Options
			'fa', // Start Message
			'fe', // End Message
			'ea', // Show Chars
			'f3', // Play SE
			'f4', // Change Camera
			'f5', // (F5) - Used on September 28th
			'f8', // Show Item Name
			'f9'  // Change Text Color
		]
	},
	R3_MSG_COMPILER_CHAR_DATABASE = {
		// You are not seeing this!
		';':  'ea28',
		'%':  'ea2c',
		'&':  'ea12',
		'(':  '05',
		')':  '06',
		// Normal values
		' ':  '00',
		'.':  '01',
		'º':  '02',
		'<':  '05',
		'>':  '06',
		'0':  '0c',
		'"':  '09',
		'"':  '0a',
		'1':  '0d',
		'2':  '0e',
		'3':  '0f',
		'4':  '10',
		'5':  '11',
		'6':  '12',
		'7':  '13',
		'8':  '14',
		'9':  '15',
		':':  '16',
		',':  '18',
		'^':  '19',
		'!':  '1a',
		'?':  '1b',
		//'$':  '1c', // I will need to fix this later
		'A':  '1d',
		'B':  '1e',
		'C':  '1f',
		'D':  '20',
		'E':  '21',
		'F':  '22',
		'G':  '23',
		'H':  '24',
		'I':  '25',
		'J':  '26',
		'K':  '27',
		'L':  '28',
		'M':  '29',
		'N':  '2a',
		'O':  '2b',
		'P':  '2c',
		'Q':  '2d',
		'R':  '2e',
		'S':  '2f',
		'T':  '30',
		'U':  '31',
		'V':  '32',
		'W':  '33',
		'X':  '34',
		'Y':  '35',
		'Z':  '36',
		'+':  '37',
		'/':  '38',
		'-':  '39',
		'\'': '3a',
		'-':  '3b',
		'a':  '3d',
		'b':  '3e',
		'c':  '3f',
		'd':  '40',
		'e':  '41',
		'f':  '42',
		'g':  '43',
		'h':  '44',
		'i':  '45',
		'j':  '46',
		'k':  '47',
		'l':  '48',
		'm':  '49',
		'n':  '4a',
		'o':  '4b',
		'p':  '4c',
		'q':  '4d',
		'r':  '4e',
		's':  '4f',
		't':  '50',
		'u':  '51',
		'v':  '52',
		'w':  '53',
		'x':  '54',
		'y':  '55',
		'z':  '56',
		// Format
		'ü':  '51',
		'ú':  '51',
		'ù':  '51',
		'û':  '51',
		'è':  '41',
		'ë':  '41',
		'ò':  '4b',
		'ô':  '4b',
		'ö':  '4b',
		'ã':  '3d',
		'ä':  '3d',
		'í':  '45',
		'ï':  '45',
		'ì':  '45',
		/*
			Special functions
		*/
		'#':  'a0',	// Climax
		'~':  'fe',	// Climax 2nd Option
		'[':  '09',	// Open quotes
		']':  '0a',	// Closing quotes 
		'*':  'fb',	// Yes / No
		'@':  'fc',	// Enter / Break line
		'\n': 'fc', // Enter / Break line
		'|':  'fd' 	// Pause Text
	},
	R3_MSG_FUNCTIONS = {
		'$SMS': 'fa', // Start Message
		'$EMS': 'fe', // End Message
		'$SSC': 'ea', // Show Special Char
		'$SIN': 'f8', // Show Item Name
		'$PSE': 'f3', // Play SE
		'$CHC': 'f4', // Chanfe Camera
		'$UF5': 'f5', // (UNK) Function F5
		'$CTC': 'f9', // Change Text Color
		'$SHO': '70'  // Show Options (WIP)
	},
	MSG_formatExclude = {
		0: ['[(]Line Break[)]<br>', '@\n'],
		1: ['Yes / No', '*'],
		2: ['Function: Climax', '#'],
		3: ['[(]Line Break[)]', '@'],
		4: ['[(]Pause[)]', '|'],
		5: ['<code><</code>', '<'],
		6: ['<code>></code>', '>'],
		7: ['/', '[']
	},
	/*
		Help Center (HC) Database
		Data order:

		Title, Content, Icon ID
	*/
	R3_HC_DATABASE = {
		/*
			HC Main Menu [R3V2 Main Menu]
		*/
		4: ['Help Center Main Menu', '<div class="align-center"><br><img src="img/icons/icon-53.png" class="R3_HC_fnIcon" title="Help Center"><br>Hello and welcome to R3ditor V2 Help Center!<br>Here you can learn more about how this tool works and the tips for best usage!</div><br>' +
									 // Initial Info
									 '<div class="align-center"><font class="LBL_subTitle">About R3ditor V2</font></div><br>R3ditor V2 <i>(It reads REditor)</i> is the second version of the most complex tool for Capcom\'s Resident Evil 3 (1999). It was designed to edit the game more or less ' + 
									 'you would do if it was made using Wolf RPG, RPG Maker or even using Impact.js editor. Simple with <font title="Yes!">old Windows design in mind</font>, it\'s easy to know what to do and where to do, since all the efforts are to create a tool that is easy to learn how ' +
									 'to use as a novice - but perfect to create new mods, from scratch to final build.<br><br>In case to know what something is / what it does, the best thing to do is hovering your mouse - a popup will show with some explanation about.<br><br>' +
									 // Keyboard Shortcuts
									 '<div class="align-center"><font class="LBL_subTitle">Keyboard Shortcuts</font></div><ul>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">F1</font>: Open Help Center</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 1</font>: Open RDT Editor</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 2</font>: Open SCD Editor</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 3</font>: Open MSG Editor</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 4</font>: Open SAV Editor</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 5</font>: Open INI Editor</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 6</font>: Open RE3SET Editor</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + L</font>: Open log window</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + I</font>: Open Item Database</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + B</font>: Open Backup Manager</li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + E</font>: Close current tool <i>(Can be disabled on settins)</i></li>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + F</font>: Open SCD Opcode Finder <i>(Main menu - Only available on desktop version)</i></li></ul><br>' +
									 '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + R</font>: Reload</li></ul><br>' +
									 // Backup Manager
									 '<div class="align-center"><img src="img/icons/icon-backup.png" class="R3_HC_fnIcon" title="Backup Manager"><br><font class="LBL_subTitle">Backup Manager</font></div><br>' +
									 'For every time you save your changes in any editor <i>(RDT, SCD, INI and etc.)</i> R3ditor V2 will create a backup for it. It also counts where you did your changes and even <u>when</u> ' +
									 'you did it.<br>It\'s a matter of looking and you will know how to use it!<br><br><div class="align-center"><img src="img/HC/HC_SCD_IMG_2.png" class="R3_HC_IMG"></div><br>' +
									 'To open Backup Manager, you can use the button at top-right corner or use <font class="R3_HC_LBL_CODE user-cant-select">[CTRL + SHIFT + B]</font> shortcut.<br><br>' +
									 // Executable Flags
									 '<div class="align-center"><font class="LBL_subTitle">Executable Args.</font><br><font class="LBL_chapter txt-italic">(aka. flags)</font></div><br>You can customize R3ditor V2 options parsing executable arguments / flags on startup via ' +
									 '<font title="aka. cmd" class="R3_HC_LBL_CODE user-cant-select">Command Prompt</font>, <font class="R3_HC_LBL_CODE user-cant-select">bash</font> and etc. Here is a list of available flags you can use:<br><ul>' +
									 '<li><font class="R3_HC_LBL_CODE">--webmode</font>: Start R3ditor V2 in Web Mode</li>' +
									 '<li><font class="R3_HC_LBL_CODE">--fullscreen</font>: Start R3ditor V2 in fullscreen</li>' +
									 '<li><font class="R3_HC_LBL_CODE">--disable-doorlink</font>: Disable SCD DoorLink</li>' +
									 '<li><font class="R3_HC_LBL_CODE">--disable-discord</font>: Disable Discord Rich Presence</li>' +
									 '<li><font class="R3_HC_LBL_CODE">--disable-move-screen</font>: Disable moving window to a another screen</li>' +
									 '<li><font class="R3_HC_LBL_CODE">--disable-animations</font>: Disable all JS animations <i>(ideal for slow machines)</i></li>' +
									 '<li><font class="R3_HC_LBL_CODE">--screen SCREEN_ID</font>: Move R3ditor V2 window to a another screen <i>(ideal for dual-monitor setups)</i></li>' +
									 '</ul>', 53],
		/*
			SCD Editor
		*/
		9: ['SCD Editor', '<br>Also known as <b>S</b>cript <b>C</b>ode <b>D</b>ata, this is where you will edit all events that happens on current map. Here you can set variables, items, create cutscenes, spawn NPCS (or enemies) and much more.<br>' +
						  'In other words, here is where almost <u>all magic happens inside the game!</u><br><br><u><b>Important</b></u>: Since this is one of the most complex editor from R3V2, ' + 
						  'here will be shown how to use the editor by itself. To understand how opcodes works, you can hover any function at script list to see it\'s description or click on help button inside each function. <i>(WIP)</i><br><br>' +
						  // Keyboard Shortcuts
						  '<div class="align-center"><font class="LBL_subTitle">Keyboard Shortcuts</font></div><ul>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + N</font>: Create a new file</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + O</font>: Open script file</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">ALT + O</font>: Open JS script file</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + S</font>: Save entire SCD section</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + S</font>: \"Save As\" entire SCD section</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">ALT + S</font>: Save script as JS Code</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Left Arrow</font>: Load Previous Script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Right Arrow</font>: Load Next Script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Up Arrow</font> or <font class="R3_HC_LBL_CODE user-cant-select">CTRL + Mouse Scroll Up</font>: Focus previous function / Increase font size (Code editor)</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Down Arrow</font> or <font class="R3_HC_LBL_CODE user-cant-select">CTRL + Mouse Scroll Down</font>: Focus next function / Decrease font size (Code editor)</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Page Up</font> or <font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + Mouse Scroll Up</font>: Return 10 functions</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Page Down</font> or <font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + Mouse Scroll Down</font>: Advance 10 functions</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + Page Up</font>: Focus the first function on current script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + Page Down</font>: Focus the last function on current script</li>' + 
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Space</font>: Open / Edit focused function</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Q</font>: Open Map List</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + \'</font>: Return to RDT Editor</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + F</font>: Search for a specific function / opcode</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + G</font>: Jump to <i>(GOTO)</i> Script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + J</font>: Jump to <i>(GOTO)</i> using <font class="R3_HC_LBL_CODE user-cant-select">Run Script [GO_SUB]</font> target</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + H</font>: Open Hex View</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + +</font>: Add new script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + -</font>: Remove current script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + C</font>: Copy Function</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + X</font>: Crop Function</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + V</font>: Paste Function</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + V</font>: Paste Function asking where the copy should be inserted</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + D</font>: Delete Function</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + I</font>: Import Script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + E</font>: Export Script</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + R</font>: Compile script on JS editor</li>' +
						  '<li><font class="R3_HC_LBL_CODE user-cant-select">F2</font>: Toggle Code Editor / List Mode</li></ul><br>' +
						  // Editing modes
						  '<div class="align-center"><img src="img/icons/icon-49.png" class="R3_HC_fnIcon" title="List Mode"> <img src="img/icons/icon-48.png" class="R3_HC_fnIcon" title="Code Mode"><br><font class="LBL_subTitle">Editing modes (Code & List Modes)</font></div><br>There is two editing modes that you can use to create your scripts. ' +
						  'On List Mode, you see the script as a list, more or less in the same way you visualize it on common editors - like RPG Maker, Impact.js and Wolf RPG Editor. The code editor mode shows the current script like JavaScript code, more or less like BioScript already does with RE2 data. To swap between display modes, you can hit ' +
						  '<font class="R3_HC_LBL_CODE user-cant-select">F2</font>, click on List / Code modes or even select it on settings.<br><br>' +
						  // Dev Opinion
						  '<i><u>Developer Opinion</u>: There isn\'t a fast or <font title="Or even standard... you name it!">correct way</font> to edit SCD Scripts (List or Code modes). Maybe you are the type of person that likes doing it via list mode or code mode. Regardless of how you like doing it, the best way to edit this section is doing it is the way you like best!</i><br><br>' +
						  // Edit mode: List mode
						  '<div class="align-center"><img src="img/icons/icon-49.png" class="R3_HC_fnIcon" title="List Mode"><br><font class="LBL_chapter">List Mode</font><br><br><img src="img/HC/HC_SCD_IMG_0.png" class="R3_HC_IMG" title="This is a example of how an RPG Maker MV script looks like."></div><br>The picture above shows how an ' + 
						  '<a href="https://www.rpgmakerweb.com/products/rpg-maker-mv" target="_blank">RPG Maker MV</a> Editor looks like. Inspired of how organized things are shown, R3ditor V2 uses the same concept - but in a <u>better way</u>!<br><br>' +
						  'On R3ditor V2, all functions can be found at right side - being separated by function type (Cutscenes, Variables, Items and more). Also, you can use the search field at top to seek your desired function by name, internal name or opcode.<br><br>' +
						  '<div class="align-center"><img src="img/HC/HC_SCD_IMG_1.gif" class="R3_HC_IMG" title="R3ditor V2 SCD Function List"></div><br><br>' +
						  // Insert Hex
						  '<div class="align-center"><img src="img/icons/icon-42.png" class="R3_HC_fnIcon" title="Insert Hex"><br><font class="LBL_subTitle">Insert Hex</font></div><br>With this feature, you can insert hex functions directly on your script. To make that, ' +
						  'click on "Insert Hex" icon, paste your hex code on textbox and hit enter. If everything is correct, it will ask where you want to position your new function.<br><br>To set position automatically, hold <font class="R3_HC_LBL_CODE user-cant-select">CTRL</font> before clicking on \"Insert Hex\" icon - It will set your new function at top.<br><br>' +
						  // Code Preset
						  '<div class="align-center"><img src="img/icons/icon-45.png" class="R3_HC_fnIcon" title="Code Preset"><br><font class="LBL_subTitle">Code Preset</font></div><br>With this section, you can use pre-built functions to speed-up your script creation process!<br>To use it, open the mini-window and' +
						  'select a preset. You will be prompted to insert where those functions will be inserted.<br><br>Tip: You can hold <font class=" user-cant-select">CTRL</font> to quick insert at the end of current script.<br><br>' +
						  // WIP Info
						  '<div class="align-center"><i>This document is under development - please wait!</i></div><br>', 9],
		/*
			RDT Editor
		*/
		10: ['RDT Editor', '<br>Also known as <b>R</b>oom <b>D</b>ata<b>T</b>able, RDT is the file that holds all data about a room, with all items, doors, events and so much more. On this section, you can open a specific editor to modify some aspects of this location - like ' +
						   'SCD (Scripts, items, Cutscenes..), RID (Camera positions), LIT (Light / Illumination), Masks and so much more.<br><br>' +
						   // Shortcuts
						   '<div class="align-center"><font class="LBL_subTitle">Keyboard Shortcuts</font></div><ul>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + O</font>: Open Map</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + N</font>: Create New Map</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + S</font>: Save Map</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Q</font>: Open map list</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 1</font>: Open SCD Editor</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 2</font>: Open MSG Editor</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 3</font>: Open RID Editor</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 4</font>: Open LIT Editor</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 5</font>: Open PRI Editor</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + 6</font>: Open SCA Editor</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Left Arrow</font>: Open previous map</li>' +
						   '<li><font class="R3_HC_LBL_CODE user-cant-select">CTRL + Right Arrow</font>: Open next map</li></ul><br>' +
						   // Export Sections 
						   '<div class="align-center"><img src="img/icons/icon-51.png" class="R3_HC_fnIcon"><br><font class="LBL_subTitle">Export Sections</font></div><br>You can export all sections individually by using export button.<br>It will open a new popup ' +
						   'with a list with all available sections to extract.<br><br>' +
						   // SCD Hack
						   '<div class="align-center"><img src="img/icons/icon-enable-hack.png" class="R3_HC_fnIcon" title="Install SCD Hack"> <img src="img/icons/icon-hack.png" class="R3_HC_fnIcon" title="Apply SCD Hack"><br><font class="LBL_subTitle">SCD Hack</font></div><br>' + 
						   'This is a temp hack that was created to test some editors, like SCD and MSG.<br>It creates a copy of some sections and move them to the end of file - since R3V2 does not recompile RDT files... <u>yet</u>!<br><br>' +
						   'To enable it, click on \"Inst. Hack\" and press ok. It will create a new patched file.<br>To apply, check if the editor haves the \"SCD Hack\" icon. If haves, just click and it will patch the map file!<br>' +
						   'You can use <font class="R3_HC_LBL_CODE user-cant-select">CTRL + SHIFT + H</font> shortcut to make it quicker!<br><i>(PS: It also works on other editors as well!)</i><br><br>' +
						   // Info
						   '<div class="align-center"><u><b>WARNING</b></u>: Don\'t run this process on maps that haves enemies or NPC\'S - otherwise it will <u>crash</u> the game!</div><br>', 7],
		/*
			RE3SET Editor
		*/
		13: ['RE3SET Editor', 'RE3SET <i>(aka. RE3 Settings Editor)</i> is <u>an experimental tool</u> that allow you edit some game aspects - including item infos, save names, Nemesis drops and even more.<br><br>' + 
							  '<div class="align-center"><i>This tool / document is under development - please wait!</i></div><br>', 19]
	},
	// ROFS File Descriptions
	ROFS_FILE_DESC = {
		1:  'Doors (.DO2)',
		2:  'DATA_AE and ETC2 (TIM)',
		3:  'DATA and ETC (TIM, SLD, DAT)',
		4:  'Hard Mode Graphics Data (TIM, DAT, PIX)',
		5:  'Models (PLD and PLW)',
		6:  'DATA_A (PLD and TIM)',
		7:  'Sounds (VB, VH and BGM\'s)',
		8:  'Backgrounds (BSS - JPG and SLD)',
		9:  'ROOM (EMD and TIM)',
		10: 'ROOM - EMD08 (EMD and TIM)',
		11: 'ROOM (RBJ)',
		12: 'Easy mode maps (RDT)',
		13: 'Hard mode maps (RDT)',
		14: 'Voices (WAV)',
		15: 'Background music (WAV)'
	},
	FG_DICIONARIO = {
		'.': ['0px 1106px 0px 8px',      '-8', 8],
		' ': ['0px 1077px 0px 33px',    '-33', 7],
		'§': ['0px 1077px 0px 33px',    '-33', 7],
		'@': ['0px 1045px 0px 62px',   '-62', 10],
		'(': ['0px 1068px 0px 43px',    '-44', 6],
		')': ['0px 1063px 0px 48px',    '-50', 6],
		'º': ['0px 1055px 0px 58px',    '-58', 6],
		'{': ['0px 1037px 0px 73px',    '-73', 8],
		'}': ['0px 1030px 0px 79px',    '-79', 8],
		'0': ['0px 1013px 0px 96px',    '-97', 8],
		'1': ['0px 1005px 0px 104px',  '-105', 7],
		'2': ['0px 997px 0px 111px',   '-113', 9],
		'3': ['0px 990px 0px 120px',   '-121', 8],
		'4': ['0px 981px 0px 128px',   '-129', 7],
		'5': ['0px 973px 0px 137px',   '-137', 8],
		'6': ['0px 965px 0px 144px',   '-145', 8],
		'7': ['0px 957px 0px 152px',   '-153', 8],
		'8': ['0px 949px 0px 160px',   '-161', 7],
		'9': ['0px 940px 0px 168px',   '-168', 8],
		':': ['0px 934px 0px 178px',  '-178', 10],
		',': ['0px 917px 0px 193px',   '-193', 8],
		'!': ['0px 904px 0px 210px',   '-210', 7],
		'?': ['0px 894px 0px 216px',   '-216', 8],
		'$': ['0px 885px 0px 223px',   '-223', 8],
		'A': ['0px 877px 0px 232px',   '-232', 8],
		'B': ['0px 869px 0px 240px',   '-240', 8],
		'C': ['0px 861px 0px 248px',   '-248', 8],
		'D': ['0px 853px 0px 256px',   '-256', 9],
		'E': ['0px 845px 0px 264px',   '-264', 9],
		'F': ['0px 837px 0px 272px',   '-272', 9],
		'G': ['0px 829px 0px 280px',   '-280', 9],
		'H': ['0px 821px 0px 288px',   '-288', 9],
		'I': ['0px 816px 0px 296px',   '-296', 5],
		'J': ['0px 811px 0px 301px',   '-301', 6],
		'K': ['0px 801px 0px 309px',   '-309', 8],
		'L': ['0px 794px 0px 316px',   '-316', 8],
		'M': ['0px 785px 0px 324px',   '-324', 9],
		'N': ['0px 778px 0px 332px',   '-332', 8],
		'O': ['0px 769px 0px 340px',   '-340', 9],
		'P': ['0px 761px 0px 348px',   '-348', 9],
		'Q': ['0px 753px 0px 356px',   '-356', 8],
		'R': ['0px 745px 0px 365px',   '-365', 8],
		'S': ['0px 737px 0px 373px',   '-373', 8],
		'T': ['0px 729px 0px 380px',   '-380', 8],
		'U': ['0px 721px 0px 388px',   '-388', 9],
		'V': ['0px 713px 0px 395px',   '-395', 9],
		'W': ['0px 705px 0px 403px',   '-403', 9],
		'X': ['0px 697px 0px 412px',   '-412', 9],
		'Y': ['0px 689px 0px 420px',   '-420', 9],
		'Z': ['0px 681px 0px 428px',   '-428', 9],
		'+': ['0px 673px 0px 436px',   '-436', 8],
		'/': ['0px 665px 0px 444px',   '-444', 8],
		'-': ['0px 657px 0px 452px',  '-452', 10],
		'\'': ['0px 649px 0px 460px',  '-460', 8],
		'ã': ['0px 633px 0px 476px',   '-476', 8],
		'a': ['0px 625px 0px 484px',   '-484', 8],
		'b': ['0px 617px 0px 492px',   '-492', 8],
		'c': ['0px 610px 0px 500px',   '-500', 8],
		'd': ['0px 601px 0px 509px',   '-509', 7],
		'e': ['0px 594px 0px 516px',   '-516', 8],
		'f': ['0px 585px 0px 524px',   '-524', 8],
		'g': ['0px 577px 0px 532px',   '-532', 8],
		'h': ['0px 570px 0px 540px',   '-540', 8],
		'i': ['0px 561px 0px 551px',   '-550', 6],
		'j': ['0px 555px 0px 558px',   '-558', 6],
		'k': ['0px 544px 0px 564px',   '-564', 8],
		'l': ['0px 540px 0px 573px',   '-573', 5],
		'm': ['0px 531px 0px 579px',   '-579', 8],
		'n': ['0px 522px 0px 587px',   '-587', 8],
		'o': ['0px 514px 0px 595px',   '-595', 8],
		'p': ['0px 506px 0px 604px',   '-604', 8],
		'q': ['0px 498px 0px 611px',   '-611', 7],
		'r': ['0px 491px 0px 619px',   '-619', 7],
		's': ['0px 483px 0px 627px',   '-627', 7],
		't': ['0px 474px 0px 635px',   '-635', 6],
		'u': ['0px 467px 0px 643px',   '-643', 8],
		'v': ['0px 458px 0px 652px',   '-652', 8],
		'w': ['0px 445px 0px 661px',  '-661', 10],
		'x': ['0px 437px 0px 672px',   '-672', 7],
		'y': ['0px 427px 0px 680px',   '-680', 8],
		'z': ['0px 420px 0px 690px',   '-690', 8],
		'À': ['0px 401px 0px 708px',   '-708', 8],
		'Á': ['0px 394px 0px 716px',   '-716', 8],
		'Â': ['0px 386px 0px 723px',   '-723', 8],
		'Ã': ['0px 378px 0px 731px',   '-732', 8],
		'Ä': ['0px 370px 0px 739px',   '-739', 8],
		'Ç': ['0px 353px 0px 756px',   '-756', 8],
		'È': ['0px 345px 0px 765px',   '-765', 8],
		'É': ['0px 337px 0px 772px',   '-772', 8],
		'Ê': ['0px 329px 0px 781px',   '-781', 8],
		'Ë': ['0px 320px 0px 789px',   '-789', 8],
		'Ì': ['0px 315px 0px 799px',   '-799', 8],
		'Í': ['0px 307px 0px 806px',   '-806', 8],
		'Î': ['0px 299px 0px 815px',   '-815', 8],
		'Ï': ['0px 291px 0px 823px',   '-823', 8],
		'Ñ': ['0px 280px 0px 829px',   '-829', 8],
		'Ò': ['0px 272px 0px 837px',   '-837', 8],
		'Ó': ['0px 264px 0px 845px',   '-845', 8],
		'Ô': ['0px 256px 0px 853px',   '-853', 8],
		'Õ': ['0px 248px 0px 861px',   '-861', 8],
		'Ö': ['0px 239px 0px 870px',   '-870', 8],
		'Ù': ['0px 232px 0px 878px',   '-878', 8],
		'Ú': ['0px 223px 0px 885px',   '-885', 8],
		'Û': ['0px 216px 0px 893px',   '-893', 8],
		'Ü': ['0px 207px 0px 902px',   '-902', 8],
		'ß': ['0px 199px 0px 910px',   '-910', 8],
		'à': ['0px 191px 0px 918px',   '-918', 8],
		'á': ['0px 183px 0px 926px',   '-926', 8],
		'â': ['0px 175px 0px 934px',   '-934', 8],
		'ä': ['0px 167px 0px 942px',   '-942', 8],
		'ç': ['0px 159px 0px 950px',   '-950', 8],
		'è': ['0px 152px 0px 958px',   '-958', 8],
		'é': ['0px 143px 0px 966px',   '-966', 8],
		'ê': ['0px 135px 0px 974px',   '-974', 8],
		'ë': ['0px 127px 0px 982px',   '-982', 8],
		'ì': ['0px 120px 0px 991px',   '-991', 8],
		'í': ['0px 112px 0px 1000px', '-1000', 6],
		'î': ['0px 104px 0px 1008px', '-1008', 8],
		'ï': ['0px 96px 0px 1014px',  '-1014', 8],
		'ñ': ['0px 82px 0px 1028px',  '-1028', 8],
		'ò': ['0px 73px 0px 1036px',  '-1036', 8],
		'ó': ['0px 65px 0px 1044px',  '-1044', 8],
		'ô': ['0px 57px 0px 1052px',  '-1052', 8],
		'õ': ['0px 49px 0px 1060px',  '-1060', 8],
		'ö': ['0px 41px 0px 1068px',  '-1068', 8],
		'ù': ['0px 32px 0px 1077px',  '-1077', 8],
		'ú': ['0px 24px 0px 1085px',  '-1085', 8],
		'û': ['0px 16px 0px 1093px',  '-1093', 8],
		'ü': ['0px 8px 0px 1102px',   '-1102', 8]
	},
	FG_RE3_DICIONARIO = {
		' ': ['0px 1372px 0px 12px',        '0', 7],
		'.': ['0px 1360px 0px 8px',        '-8', 8],
		'§': ['0px 1102px 0px 12px',        '0', 7],
		'(': ['0px 1308px 0px 67px',      '-67', 8],
		')': ['0px 1294px 0px 78px',      '-79', 8],
		'0': ['0px 1209px 0px 160px',   '-162', 12],
		'1': ['0px 1196px 0px 178px',   '-180',  7],
		'2': ['0px 1182px 0px 185px',   '-191', 11],
		'3': ['0px 1166px 0px 202px',   '-205', 11],
		'4': ['0px 1152px 0px 217px',   '-218', 13],
		'5': ['0px 1139px 0px 232px',   '-232', 11],
		'6': ['0px 1123px 0px 245px',   '-247', 11],
		'7': ['0px 1108px 0px 260px',   '-261', 12],
		'8': ['0px 1096px 0px 274px',   '-276', 12],
		'9': ['0px 1080px 0px 288px',   '-289', 12],
		':': ['0px 1068px 0px 304px',   '-307',  8],
		',': ['0px 1044px 0px 330px',    '-332', 8],
		'!': ['0px 1012px 0px 360px',    '-362', 8],
		'?': ['0px 1000px 0px 374px',    '-375', 9],
		'$': ['0px 963px 0px 378px',    '-380', 10],
		'A': ['0px 969px 0px 398px',    '-400', 14],
		'B': ['0px 956px 0px 414px',    '-415', 13],
		'C': ['0px 942px 0px 427px',    '-429', 13],
		'D': ['0px 928px 0px 442px',    '-443', 11],
		'E': ['0px 914px 0px 456px',    '-457', 12],
		'F': ['0px 900px 0px 470px',    '-472', 11],
		'G': ['0px 886px 0px 484px',    '-485', 13],
		'H': ['0px 870px 0px 498px',    '-500', 14],
		'I': ['0px 858px 0px 516px',     '-517', 8],
		'J': ['0px 840px 0px 526px',    '-529', 13],
		'K': ['0px 827px 0px 542px',    '-543', 12],
		'L': ['0px 813px 0px 557px',    '-557', 14],
		'M': ['0px 798px 0px 570px',    '-570', 15],
		'N': ['0px 785px 0px 585px',    '-585', 14],
		'O': ['0px 770px 0px 600px',    '-600', 13],
		'P': ['0px 758px 0px 614px',    '-614', 12],
		'Q': ['0px 743px 0px 626px',    '-626', 15],
		'R': ['0px 729px 0px 641px',    '-641', 13],
		'S': ['0px 716px 0px 656px',    '-656', 11],
		'T': ['0px 700px 0px 670px',    '-670', 13],
		'U': ['0px 686px 0px 684px',    '-684', 13],
		'V': ['0px 673px 0px 698px',    '-698', 13],
		'W': ['0px 658px 0px 711px',    '-711', 15],
		'X': ['0px 644px 0px 726px',    '-726', 13],
		'Y': ['0px 630px 0px 739px',    '-740', 12],
		'Z': ['0px 616px 0px 753px',    '-754', 13],
		'+': ['0px 603px 0px 767px',    '-768', 14],
		'/': ['0px 587px 0px 781px',    '-782', 16],
		'-': ['0px 575px 0px 796px',    '-797', 11],
	   '\'': ['0px 564px 0px 813px',     '-814', 8],
		'a': ['0px 521px 0px 853px',     '-853', 9],
		'b': ['0px 506px 0px 867px',    '-867', 10],
		'c': ['0px 492px 0px 881px',     '-881', 9],
		'd': ['0px 478px 0px 894px',    '-894', 10],
		'e': ['0px 464px 0px 910px',     '-910', 8],
		'f': ['0px 452px 0px 925px',     '-925', 7],
		'g': ['0px 436px 0px 936px',    '-937', 10],
		'h': ['0px 422px 0px 950px',    '-951', 10],
		'i': ['0px 410px 0px 966px',     '-966', 6],
		'j': ['0px 396px 0px 980px',     '-981', 6],
		'k': ['0px 378px 0px 992px',    '-993', 10],
		'l': ['0px 369px 0px 1008px',   '-1009', 5],
		'm': ['0px 350px 0px 1018px',  '-1018', 14],
		'n': ['0px 338px 0px 1035px',  '-1035', 10],
		'o': ['0px 325px 0px 1049px',   '-1049', 9],
		'p': ['0px 311px 0px 1063px',   '-1063', 9],
		'q': ['0px 297px 0px 1077px',  '-1077', 10],
		'r': ['0px 284px 0px 1092px',   '-1092', 7],
		's': ['0px 269px 0px 1106px',   '-1106', 8],
		't': ['0px 255px 0px 1119px',   '-1119', 8],
		'u': ['0px 239px 0px 1133px',  '-1133', 10],
		'v': ['0px 226px 0px 1147px',  '-1147', 11],
		'w': ['0px 211px 0px 1158px',  '-1158', 14],
		'x': ['0px 198px 0px 1175px',  '-1175', 11],
		'y': ['0px 184px 0px 1189px',  '-1189', 11],
		'z': ['0px 171px 0px 1203px',   '-1203', 9],
		'ã': ['0px 114px 0px 1259px',  '-1259', 10],
		'á': ['0px 156px 0px 1218px',  '-1218', 10],
		'à': ['0px 142px 0px 1232px',  '-1232', 10],
		'â': ['0px 128px 0px 1246px',  '-1246', 10],
		'ç': ['0px 73px 0px 1303px',    '-1303', 8],
		'é': ['0px 100px 0px 1275px',   '-1275', 9],
		'ê': ['0px 58px 0px 1317px',    '-1317', 9],
		'ó': ['0px 44px 0px 1330px',   '-1330', 10],
		'õ': ['0px 86px 0px 1288px',   '-1288', 10],
		'ñ': ['0px 12px 0px 1358px',   '-1360', 10]
		//'ä': ['',   '-942', 8],
		//'è': ['',   '-958', 8],
		//'ë': ['',   '-982', 8],
		//'ì': ['',   '-991', 8],
		//'í': ['', '-1000', 6],
		//'î': ['', '-1008', 8],
		//'ï': ['',  '-1014', 8],
		//'ñ': ['',  '-1028', 8],
		//'ò': ['',  '-1036', 8],
		//'ô': ['',  '-1052', 8],
		//'ö': ['',  '-1068', 8],
		//'ù': ['',  '-1077', 8],
		//'ú': ['',  '-1085', 8],
		//'û': ['',  '-1093', 8],
		//'ü': ['0px 8px 0px 1102px',   '-1102', 8]
	},
	FG_HIDDENSTRINGS = {
		0: ['U2VwdGVtYmVyIDI4dGgsIGRheWxpZ2h0Li4uIFRoZSBtb3N0ZXJzIGhhdmUgb3ZlcnRha2VuIHRoZSBjaXR5LiBTb21laG93Li4uIEknbSBzdGlsbCBhbGl2ZS6npyAgICAgSmlsbCBWYWxlbnRpbmUsIFJlc2lkZW50IEV2aWwgMy4gKEl0J3MgYmVlbiA=', 'IHllYXJzISmnpyBEb24ndCBsb3NlIHlvdXIgaG9wZSAtIExldCdzIGV2ZXJ5Ym9keSBzdGF5IGFsaXZlIGFzIG11Y2ggYXMgd2UgY2FuLiBZb3UgY2FuIGRvIGl0IaenICAgICAgICBUaGVNaXRvU2FuLg==']
	},
	MSG_defaultTextModeTemplate = [1, 2, 4, 6, 7],
	MSG_TEXTCOLOR = {
		/* 
			Text Colors:
			Take the hex value and split in 2 (Example: The hex "30" becomes "3, 0")
			Regardless the first number (3), The 2nd number (0) IS the color.
			(01, 31, 21, 51 and F1 are the same text color - in this case, Green.)
			
			"Close Tag" is used to stop displaying the text with special color - like when we close a tag in HTML.
			Example:
			
			  1    2			     3					 4    5
			FA02 F931 2E413E413F3F3D3A4F00214F3F3D4C41 F900 FE00
		
			1) Start Message
			2) F931 - Change the text color to green
			3) Message with special color
			4) F900 - Change the text color back to normal (Default Color)
			5) End Message
		*/
		'0': 'Default Color',
		'1': 'Green',
		'2': 'Wine Red',
		'3': 'Dark Grey',
		'4': 'Blue',
		'5': 'Default Color',
		'6': 'Transparent',
		'7': 'Transparent',
		'8': 'Transparent',
		'9': 'Transparent',
		'a': 'Transparent',
		'b': 'Transparent',
		'c': 'Transparent',
		'd': 'Transparent',
		'e': 'Transparent',
		'f': 'Transparent',
		'00': 'Default Color' 
	},
	MSG_SPECIAL_CHARS = {
		'00': 'Unknown Char',
		'10': 'L2',
		'11': 'R2',
		'12': '&',
		'13': '...',
		'14': '[',
		'15': ']',
		'16': 'L1',
		'17': 'R1',
		'18': 'PS1 Triangle',
		'19': 'PS1 Circle',
		'1a': 'PS1 Cross',
		'1b': 'PS1 Square',
		'1c': 'Blank Square',
		'1d': 'Alternative Cross',
		'24': 'S.',
		'25': 'T.',
		'26': 'A.',
		'27': 'R.',
		'28': ';',
		'29': 'I',
		'2a': 'II',
		'2b': 'III',
		'2c': '%',
		// Extra for CUSTOM R3DITOR TEXE.TIM
		'2d': 'á',
		'2e': 'à',
		'2f': 'â',
		'30': 'ã',
		'31': 'é',
		'32': 'õ',
		'33': 'ç',
		'34': 'ê',
		//
		'35': '!?'
	},
	/*
		Compressed Database
	*/
	special_day_02 = ['NzU1MjA0OTQ1NjQ4NTQ5OTcx', 'Ni1NVnhMVXdLNzVUS3dCajYz', 'Zml6Nlg3dWNDUk16OFk=', 'YXBwX2xvZ28'],
	special_day_03 = 'SW1wb3J0YW50OiBUaGlzIHdlYnNpdGUgPHU+RE9FUyBOT1QgVVNFIENPT0tJRVMhPC91PiBJdCBvbmx5IHVzZSBuYXRpdmUgSlMgc3RvcmFnZSBmdW5jdGlvbnMgKGxpa2UgPGEgY2xhc3M9ImNvbG9yLWdyZWVuIiBocmVmPSJodHRwczovL3d3' +
					 'dy5nb29nbGUuY29tL3NlYXJjaD9xPUphdmFTY3JpcHQrbG9jYWxzdG9yYWdlIiB0YXJnZXQ9Il9ibGFuayI+bG9jYWxTdG9yYWdlPC9hPiBhbmQgPGEgY2xhc3M9ImNvbG9yLWdyZWVuIiBocmVmPSJodHRwczovL3d3dy5nb29nbGUuY29tL3Nl' +
					 'YXJjaD9xPUphdmFTY3JpcHQrc2Vzc2lvblN0b3JhZ2UiIHRhcmdldD0iX2JsYW5rIj5zZXNzaW9uU3RvcmFnZTwvYT4pIHRvIGtlZXAgeW91ciBzZXR0aW5ncy4gWW91IGNhbiBjbGVhbiBldmVyeXRoaW5nIG9uIHNldHRpbmdzIG1lbnUgLSBJ' +
					 'dCdzIGp1c3QgYSBtYXR0ZXIgb2YgY2xpY2sgIkNsZWFyIGFsbCBjYWNoZXMgLyBzZXR0aW5ncyIuIDxicj48YnI+Q29tbW9uIHdlYnNpdGVzIG5vdGljZXMgb2YgdGhlaXIgY29va2llcyB1c2FnZSwgZ3JlYXQgcGxhY2VzIG9mZmVycyB5b3Ug' +
					 'PHU+ZnJlZWRvbTwvdT4hIDxicj5UaGVNaXRvU2FuLg==',
	/*
		TIM Database
	*/
	TIM_BPP = {
		//  HEX      BPP
		'08000000': '4 BPP',
		'09000000': '8 BPP',
		'02000000': '16 BPP',
		'03000000': '24 BPP',
		'00000000': '4 BPP (No CLUT)',
		'01000000': '8 BPP (No CLUT)'
	},
	/*
		Dropdown buttons
		This options will be inserted depending of current menu

		Order:
		Label (NO_DROPDOWN will remove hide it), Options, Min height
	*/
	R3_DESIGN_DROPDOWN_DATABASE = {
		0:  ['NO_DROPDOWN'],
		1:  ['NO_DROPDOWN'],
		2:  ['NO_DROPDOWN'],
		3:  ['NO_DROPDOWN'],
		4:  ['NO_DROPDOWN'],
		// File Generator
		5:  ['File Generator Options', '<div class="R3_MENU_ITEM_NORMAL" title="Click here to close File Generator" onclick="R3_MENU_EXIT();">Exit</div>',
			60],
		// INI Editor
		6:  ['NO_DROPDOWN'],
		7:  ['NO_DROPDOWN'],
		8:  ['NO_DROPDOWN'],
		// SCD Editor
		9:  ['NO_DROPDOWN'],
		// RDT Editor
		10: ['RDT Options', '<div class="R3_MENU_ITEM_NORMAL" title="Click here to Extract all RDT sections (Like BIOFAT)" onclick="R3_RDT_EXTRACT_ALL_SECTIONS();">Extract all sections</div>' +
							'<div class="R3_MENU_ITEM_NORMAL" title="Click here to Import all RDT sections from already extracted files" onclick="R3_RDT_IMPORT_ALL_SECTIONS();">Import all sections</div>',
			164],
		11: ['NO_DROPDOWN'],
		// SAV Editor
		12: ['NO_DROPDOWN'],
		// RE3SET Editor
		13: ['NO_DROPDOWN']
	},
	/*
		Discord Database
	*/
	R3_DISC_MENUS = {
		0:  ['Settings', 		'Editing R3V2 Settings'],
		1:  ['About', 			'I\'m blessed from all these devs!'],
		2:  ['Loading Content', 'Waiting some process to finish!'],
		3:  ['Xdelta', 		    'Patching files using Xdelta Patcher'],
		4:  ['Main Menu', 	    'Idle'],
		5:  ['File Generator',  'Writing some files'],
		6:  ['INI Editor', 	    'Editing Resident Evil 3 Configs'],
		7:  ['MSG Editor', 	    'Editing Resident Evil 3 Texts'],
		8:  ['RE3 Livestatus',  'Testing Resident Evil 3 Mod'],
		9:  ['SCD Editor', 		'Editing Resident Evil 3 Scripts'],
		10: ['RDT Editor', 		'Editing Resident Evil 3 Maps'],
		11: ['RID Editor', 		'Editing Resident Evil 3 Camera Angles'],
		12: ['SAV Editor', 		'Editing Resident Evil 3 Saves'],
		13: ['RE3SET Editor', 	'Editing Resident Evil 3 Executables']
	},
	/*
		Recent File Types
	*/
	R3_LATEST_FILE_TYPES = {
		0: 'Room Data Table (RDT)',
		1: 'Message File (MSG)',
		2: 'Map Script (SCD)',
		3: 'RE3 Main Executable (EXE)',
		4: 'RE3 Save File (SAV)',
		5: 'RE3 Configuration File (INI)'
	},
	/*
		Backup Manager Variables
	*/
	R3_BACKUP_MANAGER_EDITORS = {
		'rdt': [0, 'RDT Editor'],
		'msg': [1, 'MSG Editor'],
		'scd': [2, 'SCD Editor'],
		'exe': [3, 'RE3SET Editor'],
		'sav': [4, 'SAV Editor'],
		'ini': [5, 'INI Editor']
	},
	/*
		Game Versions
		Order: Name Version, Origin, Is Emu, Executable name (the name of executable that MemoryJS will try hook into), Search base
	*/
	R3_GAME_VERSIONS = {
		0: ['Eidos US', 'USA', false, 'ResidentEvil3.exe', null],
		1: ['Xplosiv', 'USA', false, 'ResidentEvil3.exe', null],
		2: ['pSX Emulator', 'USA', true, 'psxfin.exe', 0xCB00000],
		3: ['ePSXe Emulator', 'USA', true, 'ePSXe.exe', 0x1AA0000],
		4: ['Gemini REBirth (US)', 'USA', false, 'BIOHAZARD(R) 3 PC.exe', null]
	},
	/*
		MEMJS_HEXPOS
		(This thing here will be checked soon...)
	
		Memory postions for reading in-game information.
		All read commands are processed with MEM_JS.BYTE (int) and converted to hex.
		
		J = Jill Valentine
		C = Carlos Oliveira
		
		Title Screen: Set 0xA5C9C0 to 28 and 0xA5C9C3 to 00 make the game go to title screen
	*/
	MEMJS_HEXPOS = {
		/*
			Mode 0 = RE3 Eidos US
		*/
		// Current Map - First Camera (B773...)
		'RE3_mode_0_firstCameraStart': 	[0x64EB8C],
		// Item Box
		'RE3_mode_0_J_iBox_Start': 		[0xA622CC],
		'RE3_mode_0_C_iBox_Start': 		[0xA6240C],
		// Jill Inventory
		'RE3_mode_0_J_invent_item-1':  	[0xA622A4],
		// Carlos Inventory
		'RE3_mode_0_C_invent_item-1':  	[0xA623E4],
		// Player Hex Pos.
		'RE3_mode_0_xPosition': 	    [0xA5CD68, 0xA5CD69],
		'RE3_mode_0_yPosition': 	    [0xA5CD70, 0xA5CD71],
		'RE3_mode_0_zPosition': 	    [0xA5CD6C, 0xA5CD6D],
		'RE3_mode_0_rPosition': 	    [0xA5CDA2, 0xA5CDA3],
		'RE3_mode_0_zIndex': 			[0xA5CD3D],
		// Current Stage, Room number & Cam
		'RE3_mode_0_Stage': 			[0xA620E6],
		'RE3_mode_0_currentCam': 		[0xA5CD2E],
		'RE3_mode_0_currentRoomNumber': [0xA620E8],
		// HP
		'RE3_mode_0_HP': 				[0xA5CE00, 0xA5CE01],
		// Player current weapon
		'RE3_mode_0_J_currentWeapon': 	[0xA623CD],
		'RE3_mode_0_C_currentWeapon': 	[0xA6250D],
		// Current Player
		'RE3_mode_0_currentPlayer': 	[0x6FA402],
		// Title screen
		'RE3_mode_0_goto_titleScreen':  [0xA5C9C0, 0xA5C9C3],
		/*
			Mode 1 = RE3 Xplosiv
		*/
		// Item Box
		'RE3_mode_1_J_iBox_Start': 		[0xA7C62C],
		'RE3_mode_1_C_iBox_Start': 		[0xA7C76C],
		// Jill Inventory
		'RE3_mode_1_J_invent_item-1':  	[0xA7C604],
		// Carlos Inventory
		'RE3_mode_1_C_invent_item-1':  	[0xA7C744],
		// Player Hex Pos.
		'RE3_mode_1_xPosition': 	    [0xA770C8, 0xA770C9],
		'RE3_mode_1_yPosition': 	    [0xA770D0, 0xA770D1],
		'RE3_mode_1_zPosition': 	    [0XA770CC, 0xA770CD],
		'RE3_mode_1_rPosition': 	    [0xA77102, 0xA77103],
		'RE3_mode_1_zIndex': 			[0XA7709D],
		// Current Stage, Room number & Cam
		'RE3_mode_1_Stage': 			[0xA7C446],
		'RE3_mode_1_currentCam': 		[0xA7708E],
		'RE3_mode_1_currentRoomNumber': [0xA7C448],
		// HP
		'RE3_mode_1_HP': 				[0xA77160, 0xA77161],
		// Player current weapon
		'RE3_mode_1_J_currentWeapon': 	[0xA7C72D],
		'RE3_mode_1_C_currentWeapon': 	[0xA7C86D],
		// Current Player
		'RE3_mode_1_currentPlayer': 	[0x71254A],
		// Title screen
		'RE3_mode_1_goto_titleScreen':  [0xA5C9C0, 0xA5C9C3], // WIP
		/*
			Mode 2
			pSX 1.13 PS1 Emulator (Game ver: USA)
		*/
		// Item Box
		'RE3_mode_2_J_iBox_Start': 		[0xE4417C],
		'RE3_mode_2_C_iBox_Start': 		[0xE442BC],
		// Jill Inventory
		'RE3_mode_2_J_invent_item-1':  	[0xE44154],
		// Carlos Inventory
		'RE3_mode_2_C_invent_item-1':  	[0xE44294],
		// Player Hex Pos.
		'RE3_mode_2_xPosition': 	    [0xE3EC18, 0xE3EC19],
		'RE3_mode_2_yPosition': 	    [0xE3EC20, 0xE3EC21],
		'RE3_mode_2_zPosition': 	    [0xE3EC1C, 0xE3EC1D],
		'RE3_mode_2_rPosition': 	    [0xE3EC52, 0xE3EC53],
		'RE3_mode_2_zIndex': 			[0xE3EBED],
		// Current Stage, Room number & Cam
		'RE3_mode_2_Stage': 			[0x12D3F96],
		'RE3_mode_2_currentCam': 		[0xE3EBDE],
		'RE3_mode_2_currentRoomNumber': [0xE43F98],
		// HP
		'RE3_mode_2_HP': 				[0x12CECB0, 0x12CECB1],
		// Player current weapon
		'RE3_mode_2_J_currentWeapon': 	[0xE4427D],
		'RE3_mode_2_C_currentWeapon': 	[0xE443BD],
		// Current Player
		'RE3_mode_2_currentPlayer': 	[0x1B2685E], // I think this value is wrong
		// Title screen
		'RE3_mode_2_goto_titleScreen':  [0xA5C9C0, 0xA5C9C3], // Savestate said hello!
		/*
			Mode 3
			ePSXe 2.0.5 PS1 Emulator (Game ver: USA)
		*/
		// Item Box
		'RE3_mode_3_J_iBox_Start': 		[0xE4417C],
		'RE3_mode_3_C_iBox_Start': 		[0xE442BC],
		// Jill Inventory
		'RE3_mode_3_J_invent_item-1':  	[0xE44154],
		// Carlos Inventory
		'RE3_mode_3_C_invent_item-1':  	[0xE44294],
		// Player Hex Pos.
		'RE3_mode_3_xPosition': 	    [0xE3EC18, 0xE3EC19],
		'RE3_mode_3_yPosition': 	    [0xE3EC20, 0xE3EC21],
		'RE3_mode_3_zPosition': 	    [0xE3EC1C, 0xE3EC1D],
		'RE3_mode_3_rPosition': 	    [0xE3EC52, 0xE3EC53],
		'RE3_mode_3_zIndex': 			[0xE3EBED],
		// Current Stage, Room number & Cam
		'RE3_mode_3_Stage': 			[0x12D3F96],
		'RE3_mode_3_currentCam': 		[0xE3EBDE],
		'RE3_mode_3_currentRoomNumber': [0xE43F98],
		// HP
		'RE3_mode_3_HP': 				[0x12CECB0, 0x12CECB1],
		// Player current weapon
		'RE3_mode_3_J_currentWeapon': 	[0xE4427D],
		'RE3_mode_3_C_currentWeapon': 	[0xE443BD],
		// Current Player
		'RE3_mode_3_currentPlayer': 	[0x1B2685E], // I think this value is wrong
		// Title screen
		'RE3_mode_3_goto_titleScreen':  [0xA5C9C0, 0xA5C9C3], // Savestate said hello!
		/*
			Mode 4 - WIP
			Gemini REBirth Path (Game ver: USA)
		*/
		// Item Box
		'RE3_mode_4_J_iBox_Start': 		[0xA675AC], // OK
		'RE3_mode_4_C_iBox_Start': 		[0xA676EC], // OK 
		// Jill Inventory
		'RE3_mode_4_J_invent_item-1':  	[0xA67584], // OK
		// Carlos Inventory
		'RE3_mode_4_C_invent_item-1':  	[0xA676C4], // OK
		// Player Hex Pos.
		'RE3_mode_4_xPosition': 	    [0xA62048, 0xA62049], // OK
		'RE3_mode_4_yPosition': 	    [0xA62050, 0xA62051], // OK
		'RE3_mode_4_zPosition': 	    [0xA6204C, 0xA6204D], // OK
		'RE3_mode_4_rPosition': 	    [0xA62082, 0xA62083], // OK
		'RE3_mode_4_zIndex': 			[0xA6201D], // OK
		// Current Stage, Room number & Cam
		'RE3_mode_4_Stage': 			[0xA673C6], // OK
		'RE3_mode_4_currentCam': 		[0xA6200E], // OK
		'RE3_mode_4_currentRoomNumber': [0xA673C8], // OK (Stage Hex Pos + 2)
		// HP
		'RE3_mode_4_HP': 				[0xA620E0, 0xA620E1], // OK
		// Player current weapon
		'RE3_mode_4_J_currentWeapon': 	[0xA676AD], // OK
		'RE3_mode_4_C_currentWeapon': 	[0xE443BD],
		// Current Player
		'RE3_mode_4_currentPlayer': 	[0x6FE999], // Must Check this
		// Title screen
		'RE3_mode_4_goto_titleScreen':  [0xA5C9C0, 0xA5C9C3] // This is not needed here...
	},
	// RE3 Livestatus Player List
	R3_LIVESTATUS_playerList = {
		'00': 'No player detected',
		'01': 'Jill Valentine',
		'02': 'Carlos Oliveira'
	},
	R3_LIVESTATUS_WEAPONS = {
		'00': 'Bare Hands',
		'01': 'Combat Knife',
		'02': 'Sigpro Handgun',
		'03': 'Handgun M92F',
		'04': 'Shotgun B. M3S',
		'05': 'S&W Magnum',
		'06': 'G. Launcher',
		'07': 'G. Launcher',
		'08': 'G. Launcher',
		'09': 'G. Launcher',
		'0a': 'R. Launcher',
		'0b': 'Gatling Gun',
		'0c': 'Mine Thrower',
		'0d': 'STI Eagle 6.0',
		'0e': 'A. Rifle (Auto)',
		'0f': 'A. Rifle (Manual)',
		'10': 'Western Custom',
		'11': 'Sigpro SP 2009 E',
		'12': 'Beretta M92F E',
		'13': 'Shotgun B. M3S E',
		'14': 'Mine Thrower E'
	};