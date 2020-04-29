
export const id = (input) => {
	return input.trim().normalize("NFD").replace(/[^a-z0-9\-\s]/gi, '').replace(/\s{1,}/g, "-").toLowerCase();
}

export const sentenceCase = (str) => {
	return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

export const isNumeric = (value) => {
	return /^\d+$/.test(value);
}

export const escapeHTML = (str) => {
	const tagsToReplace = {
		"<": "&lt;",
		">": "&gt;"
	};

	return str.replace(/[<>]/g, tag => tagsToReplace[tag] || tag);
}

export const unescapeHTML = (str) => {
	const tagsToReplace = {
		"&lt;": "<",
		"&gt;": ">"
	};

	return str.replace(/(&lt;|&gt;)/g, tag => tagsToReplace[tag] || tag);
}

export const toDate = (str) => {
	return new Date(Date.parse(str));
}