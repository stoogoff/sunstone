
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

export const setSimpleState = function(type, value) {
	this.setState({
		[type]: value
	});
}


export const TYPES = ["primary", "link", "info", "success", "warning", "danger"];
export const SIZES = ["small", "normal", "medium", "large", "left", "right", "centered", "pulled-left", "pulled-right"]
export const BUTTON = [
	// button colour styles
	"white", "light", "dark", "black", "text",
	// button sizes
	"fullwidth", "outlined", "inverted", "rounded", "loading", "boxed",
	// button states
	"hovered", "focused", "active", "disabled"
];

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