
export const createId = (length = 5) => {
	let output = [];
	const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	for(let i = 0; i < length; ++i) {
		output.push(characters[Math.floor(characters.length * Math.random())]);
	}

	return output.join("");
}

export const replaceId = (key, ...props) => {
    props.forEach(p => key = key.replace("$ID$", p));

    return key;
}

export const next = (callback) => {
	window.setTimeout(callback, 0);
}


export const TYPES = ["primary", "link", "info", "success", "warning", "danger"];
export const SIZES = ["small", "normal", "medium", "large"]
export const BUTTON = ["white", "light", "dark", "black", "text"];

export const getClassList = (props, useTypes, useSizes, useButton) => {
	let classList = [];

	if(useTypes) {
		classList = [...classList, ...TYPES];
	}

	if(useSizes) {
		classList = [...classList, ...SIZES];
	}

	if(useButton) {
		classList = [...classList, ...BUTTON];
	}

	return classList.filter(prop => prop in props && props[prop]).map(prop => "is-" + prop);
}