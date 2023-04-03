/*
	*******************************************************************************
	R3ditor V2 - gamepad.js
	By TemmieHeartz

	This file is responsible for reading gamepad input and use it on R3V2.
	PS: This is pretty-much WIP!
	*******************************************************************************
*/
// Main variables
var R3_GAMEPAD, R3_GAMEPAD_1P, R3_GAMEPAD_INTERVAL,
	// Mapped buttons
	R3_GAMEPAD_1P_ID_CROSS = 0,
	R3_GAMEPAD_1P_ID_SQUARE,
	R3_GAMEPAD_1P_ID_CIRCLE,
	R3_GAMEPAD_1P_ID_TRIANGLE,
	R3_GAMEPAD_1P_ID_UP,
	R3_GAMEPAD_1P_ID_DOWN,
	R3_GAMEPAD_1P_ID_LEFT,
	R3_GAMEPAD_1P_ID_RIGHT,
	R3_GAMEPAD_1P_ID_R1,
	R3_GAMEPAD_1P_ID_R2,
	R3_GAMEPAD_1P_ID_R3,
	R3_GAMEPAD_1P_ID_L1,
	R3_GAMEPAD_1P_ID_L2,
	R3_GAMEPAD_1P_ID_L3,
	R3_GAMEPAD_1P_ID_HOME;
/*
	Functions
*/
// Init gamepad
function R3_GAMEPAD_INIT(){
	if (R3_SYSTEM.web.isBrowser === false){
		window.addEventListener('gamepadconnected', function(){
			R3_GAMEPAD_INTERVAL = setInterval(function(){
				R3_GAMEPAD = navigator.getGamepads && navigator.getGamepads() || navigator.webkitGetGamepads && navigator.webkitGetGamepads() || navigator.webkitGamepads;
				if (R3_GAMEPAD[0] !== undefined){
					R3_GAMEPAD_1P = R3_GAMEPAD[0];
					R3_GAMEPAD_CHECK();
				};
			}, 50);
		});
	};
};
// Reading Interval
function R3_GAMEPAD_CHECK(){
	// console.log(R3_GAMEPAD_1P.buttons[0]);
};
/*
	eNGE Utility
*/
// Disabling R3V2 shortcuts to use KB as eNGE controller
function eNGE_FOCUS(){
	if (R3_keyPress.enableShortcuts === true){
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (eNGE) Disabling general shortcuts...');
		R3_keyPress.enableShortcuts = false;
		if (cdr.cdImage[0] !== undefined){
			running = true;
		};
	};
};
// Enabling R3V2 shortcuts and stop eNGE emulator
function eNGE_LOST_FOCUS(){
	if (R3_keyPress.enableShortcuts === false){
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (eNGE) Enabling general shortcuts...');
		R3_keyPress.enableShortcuts = true;
		running = false;
		spu.silence();
	};
};