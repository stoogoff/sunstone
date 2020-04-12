
"use strict";

const rollup = require("rollup");
const is = require("./is");


module.exports = (config) => {
	return (files, metalsmith, next) => {
		rollup.rollup(config).then(bundle => bundle.generate(config.output)).then(output => {
			// remove all other JS files
			Object.keys(files).forEach(path => {
				if(is.ext(path, ".js")) {
					delete files[path];
				}
			});

			// create bundle output
			// I guess this depends on the number of input entries...
			for(const chunk of output.output) {
				files[config.output.file] = {
					contents: chunk.code
				};
			}

			next();
		})
	}
}
