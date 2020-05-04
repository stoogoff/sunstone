
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
const hb = require("./hb");
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
const JS = "sunstone.js";


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
	commonjs({
		namedExports: {
			"node_modules/react-dom/index.js": ["render", "createPortal", "findDOMNode"],
			"node_modules/react-is/index.js": ["isForwardRef", "isValidElementType"],
			"node_modules/prop-types/index.js": [
				"bool",
				"element",
				"func",
				"object",
				"oneOfType",
				"shape",
				"string"
			],
			"node_modules/react/index.js": [
				"Children",
				"cloneElement",
				"Component",
				"createElement",
				"createRef",
				"forwardRef",
				"Fragment",
				"isValidElement",
				"PureComponent",
				"useCallback",
				"useEffect",
				"useImperativeHandle",
				"useMemo",
				"useReducer",
				"useRef"
			]
		}
	})
];

let rollupWarning = (warning) => {
	// should intercept ... but doesn't in some rollup versions
	if(warning.code === 'THIS_IS_UNDEFINED') {
		return;
	}

	if(warning.code === "CIRCULAR_DEPENDENCY" && warning.importer.includes("semantic-ui-react")) {
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
		LIVE: LIVE,
		FIREBASE: require("./firebase.json")
	})

	.use(sass({
		outputDir: "media/css/"
	}))

	// use rollup to create JS bundle
	.use(rollup({
		input: "./src/media/js/app.jsx",
		output: {
			format: "cjs",
			file: path.join(VERSION, "media", "js", JS)
		},
		plugins: rollupPlugins,
		onwarn: rollupWarning
	}))

	// remove all other JS files
	.use(each((file, p, files) => {
		if(!p.endsWith(JS)) {
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

	// handlebars templates, mainly for variables
	.use(hb())

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
