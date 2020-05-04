
"use strict";

const Handlebars = require("handlebars");
const each = require("./each");


module.exports = () => {
	return each((file, p, files, metalsmith) => {
		let data = metalsmith.metadata();
		let clone = {...data, ...file};

		file.originalContents = file.contents;
		file.contents = Handlebars.compile(file.contents.toString())(clone);
	}, ".html")
};
