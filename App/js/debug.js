/*
	R3ditor V2 - debug.js
	IMPORTANT: THIS FILE CANT BE INCLUDED ON R3V2 COMPILER
*/
// Reload App
function R3_RELOAD(){
	R3_DISC_clearActivity();
	if (RE3_RUNNING === true){
		R3_killExternalSoftware(RE3_PID);
	};
	if (R3_WEBMODE !== true){
		localStorage.clear();
		sessionStorage.clear();
	};
	location.reload(true);
};