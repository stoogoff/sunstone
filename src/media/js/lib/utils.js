
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
