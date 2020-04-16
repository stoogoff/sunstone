
"use strict";

const rollup = require("rollup");

module.exports = (config) => {
	return (files, metalsmith, next) => {
		rollup.rollup(config).then(bundle => bundle.generate(config.output)).then(output => {
			// create bundle output
			for(const chunk of output.output) {
				files[config.output.file] = {
					contents: chunk.code
				};
			}

			next();
		}).catch(error => console.error(error))
	}
}
