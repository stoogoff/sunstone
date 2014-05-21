
// places a single SVG feature on the map
feature = (function() {
	var symbols = {}, activeLayer, symbolData;
	var tool = new Tool();

	tool.onMouseDown = function(event) {
		// keep each feature on its own layer
		if(!layerManager.exists(activeLayer)) {
			layerManager.add(activeLayer);
		}

		layerManager.activate(activeLayer);

		// create a symbol from the SVG, if it doesn't exist
		if(!symbols[activeLayer]) {
			var imported = project.importSVG(symbolData.svg());

			symbols[activeLayer] = new Symbol(imported);

			imported.remove();
		}

		symbols[activeLayer].place(event.point);

	};

	// set the feature icon
	tool.feature = function(layer, feature) {
		if(layer)
			activeLayer = layer;

		if(feature)
			symbolData = feature;

		return layer;
	};

	// add methods based on available features in the theme
	var features = utils.theme.features();

	for(var i in features) {
		var t = i.toLowerCase();

		tool[t] = (function(feature, image) {
			return function() {
				return tool.feature(feature, image);
			};
		})(t, features[i]);
	}

	// set default state
	tool.mountain();

	return tool;
})();