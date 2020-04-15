
export const createId = (length) => {
	let output = "";
	const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	for(let i = 0; i < length; ++i) {
		output+= characters[Math.floor(characters.length * Math.random())];
	}

	return output;
}

export const replaceId = (key, ...props) => {
    props.forEach(p => key = key.replace("$ID$", p));

    return key;
}
