
// places a single SVG feature on the map
feature = (function() {
	var activeLayer, symbol, cursor, currentMap;
	var tool = new Tool();

	// remove the hover symbol
	var removeHoverSymbol = function() {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}
	};

	tool.onMouseDown = function(event) {
		// drop the symbol at the cursor
		var placed = symbol.place(event.point);

		placed.name = currentMap.addObject(activeLayer, {
			"x": event.point.x,
			"y": event.point.y,
			"feature": symbol.featurePath
		});
	};

	tool.onMouseMove = function(event) {
		cursor.position = event.point;
	};

	tool.activate = function(map) {
		if(!cursor) {
			layerManager.activate(config.CURSOR.LAYER);

			cursor = symbol.place({ x: 0, y: 0 });
			cursor.opacity = config.CURSOR.OPACITY;
		}

		// keep each feature on its own layer
		layerManager.activate(activeLayer);

		// reference the map
		currentMap = map;

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		// destroy hover image
		removeHoverSymbol();
	};

	// set the feature icon
	tool.feature = function(layer, feature) {
		if(layer)
			activeLayer = layer.substring(0, layer.indexOf("_"));

		if(feature) {
			symbol = feature.symbol();

			removeHoverSymbol();
		}

		return activeLayer;
	};

	// add methods based on available features in the theme
	var features = utils.theme.features();

	for(var i in features) {
		_.each(features[i], function(element, index) {
			var t = element.id() + "_" + index;

			tool[t] = (function(feature, image) {
				return function() {
					return tool.feature(feature, image);
				};
			})(t, element);
		});
	}

	// set default state
	tool.mountain_0();

	return tool;
})();