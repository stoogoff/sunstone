utils.theme = (function() {
	var tool = {};

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
		var loaded = {
			"Mountain": "media/img/features/Mountain",
			"Hill": "media/img/features/Hill",
			"Tree": "media/img/features/Tree",
			"City": "media/img/features/City",
		};
		var features = {};

		for(var i in loaded) {
			features[i] = new utils.Feature(i, loaded[i]);
			// TODO - add onLoad handler to track theme loading
			// the UI shouldn't respond until the theme is loaded
			features[i].load();
		}

		return features;
	};

	return tool;
})();
