
// project options
project.options.hitTolerance = 20;

// colours
colours = {
	"aqua": "#7FDBFF",
	"blue": "#0074D9",
	"navy": "#001F3F",
	"teal": "#39CCCC",
	"green": "#2ECC40",
	"olive": "#3D9970",
	"lime": "#01FF70",
	"yellow": "#FFDC00",
	"orange": "#FF851B",
	"red": "#FF4136",
	"fuchsia": "#F012BE",
	"purple": "#B10DC9",
	"maroon": "#85144B",
	"white": "#fff",
	"silver": "#ddd",
	"gray": "#aaa",
	"black": "#111"
};

// global config
config = {
	TIME: {
		DOUBLE_CLICK: 250
	},
	BRUSH: {
		SIZES: {
			"small": 5,
			"medium": 20,
			"large": 40,
			"huge": 80
		}
	},
	BACKGROUND: {
		LAYER: "background"
	},
	CURSOR: {
		LAYER: "cursor",
		HIGHLIGHT: colours.green,
		WARN: colours.red,
		OPACITY: 0.5,
		CORNERS: [5, 5]
	},
	SHADOW: {
		COLOUR: colours.black,
		BLUR: 3,
		OFFSET: [1, 1]
	}
};
