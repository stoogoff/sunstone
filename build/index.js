
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
const rollup = require("./rollup");
const babel = require("rollup-plugin-babel");
const replace = require("rollup-plugin-replace");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const postcss = require("rollup-plugin-postcss");

const each = require("./each");
const is = require("./is");


// current app version
const VERSION = fs.readFileSync(path.join(__dirname, "VERSION"), "utf8");

// building live or staging version?
const LIVE = args[0] === "live";
const OUTPUT = LIVE ? "../live" : "../staging";
const EDITOR = "sunstone-editor.js";
const VIEWER = "sunstone-viewer.js";


console.log(`\n...BUILDING...\n\nVersion: ${VERSION}\nOutput: ${OUTPUT.replace("../", "")}\n`);


// roll up settings
let rollupPlugins = [
	replace({
		"process.env.NODE_ENV": JSON.stringify("production")//LIVE ? JSON.stringify("production") : JSON.stringify("development")
	}),
	postcss({
		extract: false,
		modules: true,
		use: ["sass"]
	}),
	babel({
		exclude: "node_modules/**"
	}),
	resolve({
		browser: true
	}),
	commonjs()
];

let rollupWarning = (warning) => {
	// should intercept ... but doesn't in some rollup versions
	if(warning.code === 'THIS_IS_UNDEFINED') {
		return;
	}

	// console.warn everything else
	console.warn(warning.message);
};


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

	// use rollup to create JS bundle for editor
	.use(rollup({
		input: "./src/media/js/editor.jsx",
		output: {
			format: "cjs",
			file: path.join(VERSION, "media", "js", EDITOR)
		},
		plugins: rollupPlugins,
		onwarn: rollupWarning
	}))
		
	// use rollup to create JS bundle for viewer
	.use(rollup({
		input: "./src/media/js/viewer.jsx",
		output: {
			format: "cjs",
			file: path.join(VERSION, "media", "js", VIEWER)
		},
		plugins: rollupPlugins,
		onwarn: rollupWarning
	}))

	// remove all other JS files
	.use(each((file, p, files) => {
		if(!p.endsWith(EDITOR) && !p.endsWith(VIEWER)) {

			delete files[p];
		}
	}, ".js,.jsx"))

	// prefix media files with version number
	.use(each((file, p, files) => {
		if(p.startsWith("media/")) {
			let versionedPath = VERSION + "/" + p;

			files[versionedPath] = file;
			delete files[p];
		}
	}))

	// write metadata into HTML files, may switch to using layouts in the future
	.use(each((file, p, files, metalsmith) => {
		const metadata = metalsmith.metadata();

		Object.keys(metadata).forEach(key => {
			file.contents = file.contents.toString().replace(new RegExp(`{{ ${key} }}`, "g"), metadata[key]);
		});
	}, ".html"))

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
