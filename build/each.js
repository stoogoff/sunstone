
"use strict";

const is = require("./is");


module.exports = (callback, filter) => {
	return (files, metalsmith, next) => {
		// file, path, all files, metalsmith
		Object.keys(files).forEach(path => {
			if(!filter || is.ext(path, filter)) {
				callback(files[path], path, files, metalsmith);
			}
		});

		next();
	}
}