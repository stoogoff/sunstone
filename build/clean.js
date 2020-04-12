
"use strict";

const rimraf = require("rimraf");

const args = process.argv.slice(2);

if(args.length === 0) {
	console.error("Directory to delete must be provided.\n");
	process.exit();
}

const cleanableDirs = ["live", "staging", "node_modules"];
const dir = args[0];


if(cleanableDirs.indexOf(dir) != -1) {
	rimraf(dir, () => `Deleted ${dir}.\n`);
}
else {
	console.error(`Unable to delete ${dir}. Directory must be one of ${cleanableDirs.join(", ")}.\n`);
}
