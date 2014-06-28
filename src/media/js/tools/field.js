field = (function() {
	var activeLayer, symbolData, cursor, doubleClickTimer, doubleClick;
	var tool = new Tool();

	tool.minDistance = 5;

	// mouse control related functions
	tool.onMouseUp = function(event) {
		// if this is a double click close the path 
		if(doubleClick) {
			doubleClick = false;

			// complete the cursor
			cursor.removeSegment(cursor.segments.length - 1);
			cursor.closed = true;

			layerManager.activate(activeLayer);

			// TODO fill in features
			var symbol = symbolData.symbol();

			// place symbols at corners
			for(var i = 0, len = cursor.segments.length; i < len; ++i) {
				symbol.place(cursor.segments[i].point);

				// divide distance between each corner by size of symbol to get the number to add
				var currentPoint = cursor.segments[i].point;
				var nextPoint = i + 1 < len ? cursor.segments[i + 1].point : cursor.segments[0].point;
				var vector = currentPoint - nextPoint;
				var size = Math.max(symbol.definition.bounds.width, symbol.definition.bounds.height);

				// add that number of symbols along the line
				var toAdd = Math.floor(vector.length / size) - 1;
				var spacing = (vector.length % size) / Math.max(toAdd, 2);
				var offsetVector = vector.normalize(size + spacing);

				for(var j = 1; j <= toAdd; ++j) {
					currentPoint -= offsetVector;

					symbol.place(currentPoint);
				}
			}

			// TODO reduce the size of the shape drawn by half the width of the symbol
			// TODO repeat drawing algorithm

			// TODO remove the cursor
			cursor.remove();
			cursor = null;

			return;
		}

		doubleClick = true;

		if(!cursor) {
			layerManager.activate(config.CURSOR.LAYER);

			cursor = new Path();
			cursor.strokeColor = config.CURSOR.NEUTRAL;
			cursor.strokeColor.alpha = config.CURSOR.OPACITY;
			cursor.strokeCap = 'round';
			cursor.strokeWidth = symbolData.symbol().definition.bounds.width;
		}

		cursor.add(event.point);

		if(cursor.segments.length == 1)
			cursor.add(event.point);

		if(doubleClickTimer)
			window.clearTimeout(doubleClickTimer);

		doubleClickTimer = window.setTimeout(function() {
			doubleClick = false;
		}, config.TIME.DOUBLE_CLICK);
	};

	// keep line over last point
	tool.onMouseMove = function(event) {
		if(cursor && cursor.lastSegment)
			cursor.lastSegment.point = event.point;
	};

	// public methods

	// set the feature icon
	tool.feature = function(layer, feature) {
		if(layer)
			activeLayer = layer;

		if(feature) {
			symbolData = feature;
		}

		return layer;
	};

	// add methods based on available features in the theme
	var features = utils.theme.features();

	for(var i in features) {
		var t = features[i].id();

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