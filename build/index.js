
"use strict";


// get the file we're building
const args = process.argv.slice(2);

if(args.length === 0) {
	console.error("Output directory (live or staging) must be provided.");
	process.exit();
}


// imports
const path = require("path");
const fs = require("fs");
const Metalsmith = require("metalsmith");
const sass = require("metalsmith-sass");
const rollup = require("metalsmith-rollup");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");

const each = require("./each");


// current app version
const VERSION = fs.readFileSync(path.join(__dirname, "VERSION"), "utf8");

// building live or staging version?
const LIVE = args[0] === "live";
const OUTPUT = LIVE ? "../live" : "../staging";
const BUNDLE = "bundle.js";


console.log(`\n...BUILDING...\n\nVersion: ${VERSION}\nOutput: ${OUTPUT.replace("../", "")}\n`);


// setup Metalsmith and run
Metalsmith(__dirname)
	.clean(true)
	.source("../src")
	.destination(OUTPUT)
	.metadata({
		VERSION: VERSION,
		LIVE: LIVE
	})

	.use(sass({
		outputDir: "media/css/"
	}))

	// use rollup to create JS bundle
	.use(rollup({
		input: "./src/media/js/run.js",
		output: {
			format: "cjs",
			file: path.join(VERSION, "media", "js", BUNDLE)
		},
		plugins: [
			resolve({
				browser: true
			}),
			commonjs()
		]
	}))

	// remove all non-bundled JS files
	.use(each((file, p, files) => {
		if(!p.endsWith(BUNDLE)) {
			delete files[p];
		}
	}, ".js"))

	// perfix media files with version number
	.use(each((file, p, files) => {
		if(p.startsWith("media/")) {
			let versionedPath = VERSION + "/" + p;

			files[versionedPath] = file;
			delete files[p];
		}
	}))

	// log
	.use(each((f, k) => console.log(k)))

	.build(err => {
		if(err) {
			console.error(err);
		}
		else {
			console.log("\n...FINISHED...\n");
		}
	});
