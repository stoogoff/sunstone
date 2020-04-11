
"use strict";

const path = require("path");


module.exports = {
	collection(file, collection) {
		if(!("collection" in file)) {
			return false;
		}

		let fileCol = file.collection;

		if(!Array.isArray(fileCol)) {
			fileCol = [fileCol];
		}

		if(!Array.isArray(collection)) {
			collection = [collection];
		}

		let output = fileCol.filter(a => collection.indexOf(a) !== -1);

		return output.length >= 1;
	},

	ext(filePath, extension) {
		extension = extension.split(",");

		for(let i = 0, len = extension.length; i < len; ++i) {
			if(path.extname(filePath) == extension[i]) {
				return true;
			}
		}

		return false;
	}
};