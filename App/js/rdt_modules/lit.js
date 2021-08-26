/*
	R3ditor V2 - lit.js
	Okay... HALP!

	Light Info
	01 00 00 01 R1 B1 G1 R2 B2 G2 R3 B3 G3 [WIP]

	R1 / 2 / 3 = Red Tint
	G1 / 2 / 3 = Green Tint 
	B1 / 2 / 3 = Blue Tint
*/
// Variables
var LIT_arquivoBruto, LIT_lightArray = [], LIT_camPointers = [];
/*
	Functions
*/
// Decompile Sections
function R3_LIT_DECOMPILE(){
	if (LIT_arquivoBruto !== undefined){
		var LIT_pointerLength = LIT_arquivoBruto.slice(0, 4),
			LIT_rawCamPointers = LIT_arquivoBruto.slice(0, (parseInt(R3_parseEndian(LIT_pointerLength), 16) * 2));
			LIT_lightArray = LIT_arquivoBruto.slice(LIT_rawCamPointers.length, LIT_arquivoBruto.length).match(/.{80,80}/g);
		// WIP
		R3_WIP();
	};
};