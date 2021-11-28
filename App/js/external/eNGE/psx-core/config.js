function readStorageStream(handler){
	if (SETTINGS_ENGE_BIOS_PATH !== undefined){
		if (R3_MODULES.fs.existsSync(SETTINGS_ENGE_BIOS_PATH) === true){
			const base64text = R3_MODULES.fs.readFileSync(SETTINGS_ENGE_BIOS_PATH, 'utf-8');
			if (base64text){
				const arrayBuffer = Base64.decode(base64text);
				return handler(arrayBuffer);
			} else {
				return handler(null);
			}
		}
	}
}
function writeStorageStream(item, arrayBuffer){
	const base64text = Base64.encode(arrayBuffer);
	if (item === 'bios'){
		R3_SYSTEM.log('log', 'R3ditor V2 - INFO: (eNGE) - Saving PSX Bios...');
		R3_MODULES.fs.writeFileSync(SETTINGS_ENGE_BIOS_PATH, base64text, 'utf-8');
	};
}