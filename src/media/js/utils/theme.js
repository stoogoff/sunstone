utils.theme = (function() {
	var tool = {};
	var features, fonts;

	tool.terrain = function() {
		return {
			"Sand": "#C9AE7F",
			"Earth": "#604310",
			"Water": "#273A63",
			"Grass": "#1B510D",
			"Ice": "#C4E4EB"
		};
	};

	tool.background = function() {
		return "media/img/backgrounds/parchment.jpg";
	};

	tool.features = function() {
		if(features)
			return features;

		var loaded = {
			"Mountain": "media/img/features/Mountain",
			"Hill": "media/img/features/Hill",
			"Tree": "media/img/features/Tree",
			"City": "media/img/features/City",
		};

		features = {};

		for(var i in loaded) {
			features[i] = new utils.Feature(i, loaded[i]);
			// TODO - add onLoad handler to track theme loading
			// the UI shouldn't respond until the theme is loaded
			features[i].load();
		}

		return features;
	};

	tool.fonts = function() {
		if(fonts)
			return fonts;

		var loaded = {
			"Large Heading": {
				"font": "serif",
				"size": 28,
				"bold": true,
				"italic": false,
				"colour": "#333",
				"outline": {
					"width": 1,
					"colour": "#ccc"
				},
				"shadow": false
			},
			"Small Heading": {
				"font": "serif",
				"size": 20,
				"bold": false,
				"italic": true,
				"outline": false
			},
			"Text": {
				"font": "sans-serif",
				"size": 12,
				"bold": false,
				"italic": false
			},
		};

		fonts = {};

		for(var i in loaded) {
			fonts[i] = new utils.Font(i, loaded[i]);
		}

		return fonts;
	};

	return tool;
})();
