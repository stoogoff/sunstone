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
			"Mountain": [
				"media/img/features/MountainA",
				"media/img/features/MountainB",
				"media/img/features/MountainC"
			],
			"Hill": [
				"media/img/features/HillA",
				"media/img/features/HillB"
			],
			"Forest": [
				"media/img/features/Trees"
			],
			"City": [
				"media/img/features/City"
			],
		};

		features = {};

		for(var i in loaded) {
			features[i] = [];

			for(var j = 0; j < loaded[i].length; ++j) {
				var feature = new utils.Feature(i, loaded[i][j]);
				// TODO - add onLoad handler to track theme loading
				// the UI shouldn't respond until the theme is loaded
				feature.load();
				features[i].push(feature);
			}
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
				"outline": false,
				"shadow": false
			},
			"Small Heading": {
				"font": "serif",
				"size": 20,
				"bold": false,
				"italic": false,
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
