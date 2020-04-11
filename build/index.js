
"use strict";

const Metalsmith = require("metalsmith");
const sass = require("metalsmith-sass");


// get the file we're building
const args = process.argv.slice(2);

if(args.length === 0) {
	console.error("live or staging must be provided.");
	process.exit();
}


const LIVE = args[0] === "live";
const OUTPUT = LIVE ? "../live" : "../staging"

// setup Metalsmith and run
Metalsmith(__dirname)
	.source("../src")
	.destination(OUTPUT)

	.use(sass({
		outputDir: "media/css/"
	}))

	.build(err => {
		if(err) {
			console.error(err);
		}
		else {
			console.log("\n\t...Fin...\n");
		}
	});