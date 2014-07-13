
// places a single SVG feature on the map
feature = (function() {
	var symbols = {}, activeLayer, symbolData, cursor;
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
		symbols[activeLayer].place(event.point);
	};

	tool.onMouseMove = function(event) {
		cursor.position = event.point;
	};

	tool.activate = function() {
		// keep each feature on its own layer
		layerManager.activate(activeLayer);

		// create a symbol from the SVG, if it doesn't exist
		if(!symbols[activeLayer]) {
			symbols[activeLayer] = symbolData.symbol();
		}
		
		if(!cursor) {
			layerManager.activate(config.CURSOR.LAYER);

			cursor = symbols[activeLayer].place({ x: 0, y: 0 });
			cursor.opacity = config.CURSOR.OPACITY;

			layerManager.activate(activeLayer);
		}

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
			symbolData = feature;

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