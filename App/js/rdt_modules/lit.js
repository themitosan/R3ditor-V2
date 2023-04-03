/*
	*******************************************************************************
	R3ditor V2 - lit.js
	By TemmieHeartz

	This file will be responsible for reading and writting LIT data extracted from
	RDT maps.

	Light Info
	01 00 00 01 R1 B1 G1 R2 B2 G2 R3 B3 G3 [WIP]

	R1 / 2 / 3 = Red Tint
	G1 / 2 / 3 = Green Tint 
	B1 / 2 / 3 = Blue Tint
	*******************************************************************************
*/
// Variables
tempFn_R3_rdtLIT = {
	lightArray: undefined,
	camPointers: undefined
};
/*
	Functions
*/
// Extract LIT R3_LIT_DECOMPILE
tempFn_R3_rdtLIT['readLIT'] = function(){
	if (R3_RDT_rawSections.RAWSECTION_LIT !== undefined){
		var LIT_pointerLength = R3_RDT_rawSections.RAWSECTION_LIT.slice(0, 4),
			LIT_rawCamPointers = R3_RDT_rawSections.RAWSECTION_LIT.slice(0, (parseInt(R3_tools.parseEndian(LIT_pointerLength), 16) * 2));
			R3_rdtLIT.lightArray = R3_RDT_rawSections.RAWSECTION_LIT.slice(LIT_rawCamPointers.length, R3_RDT_rawSections.RAWSECTION_LIT.length).match(/.{80,80}/g);
		// WIP
		R3_SYSTEM.WIP();
	};
};
/*
	END
*/
const R3_rdtLIT = tempFn_R3_rdtLIT;
delete tempFn_R3_rdtLIT;