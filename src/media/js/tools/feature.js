
// places a single SVG feature on the map
feature = (function() {
	var symbols = {}, activeLayer, symbolData, cursor;
	var tool = new Tool();

	var createSymbol = function() {
		// it's already created
		if(symbols[activeLayer])
			return;

		// import from SVG, create the symbol and remove the import
		var imported = project.importSVG(symbolData.svg());

		symbols[activeLayer] = new Symbol(imported);

		imported.remove();
	};

	var createHoverSymbol = function(position) {
		if(!cursor) {
			cursor = symbols[activeLayer].place(position);
			cursor.opacity = 0.5;
		}
	};

	var removeHoverSymbol = function() {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}
	};

	tool.onMouseDown = function(event) {
		// keep each feature on its own layer
		if(!layerManager.exists(activeLayer)) {
			layerManager.add(activeLayer);
		}

		layerManager.activate(activeLayer);

		// create a symbol from the SVG, if it doesn't exist
		createSymbol();

		// drop the symbol at the cursor
		symbols[activeLayer].place(event.point);
	};

	tool.onMouseMove = function(event) {
		createSymbol();
		createHoverSymbol(event.point);

		cursor.position = event.point;
	};

	tool.deactivate = function() {
		// destroy hover image
		removeHoverSymbol();
	};

	// set the feature icon
	tool.feature = function(layer, feature) {
		if(layer)
			activeLayer = layer;

		if(feature) {
			symbolData = feature;

			removeHoverSymbol();
		}

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