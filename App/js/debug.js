/*
	*******************************************************************************
	R3ditor V2 - debug.js
	By TemmieHeartz

	This file is only used for debugging process and can't be included on R3V2 
	compiler!
	*******************************************************************************
*/
// Reload App without closing main window
R3_SYSTEM.reload = function(){
	R3_DISC_clearActivity();
	if (R3_GAME.gameRunning === true){
		R3_SYSTEM.externalSoftware.killPID(R3_GAME.gamePID);
	};
	if (R3_SYSTEM.web.isBrowser !== true){
		localStorage.clear();
		sessionStorage.clear();
	};
	location.reload(true);
};