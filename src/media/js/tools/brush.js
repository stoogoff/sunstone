
// draws solid colour terrain
brush = (function() {
	var fillColour, strokeWidth, path, activeLayer, cursor;
	var tool = new Tool();

	tool.minDistance = 10;

	// mouse control related functions
	tool.onMouseDown = function(event) {
		layerManager.activate(activeLayer);

		path = new Path();
		path.strokeColor = fillColour;
		path.strokeWidth = strokeWidth;
		path.strokeCap = 'round';

		path.add(event.point);
	};

	tool.onMouseMove = function(event) {
		if(!cursor) {
			layerManager.activate(config.CURSOR.LAYER);

			cursor = new Path.Circle(event.point, strokeWidth / 2);
			cursor.strokeColor = 'black';
			cursor.opacity = 0.5;

			layerManager.activate(activeLayer);
		}

		cursor.position = event.point;
	};

	tool.onMouseDrag = function(event) {
		path.add(event.point);

		cursor.position = event.point;
	};

	tool.onMouseUp = function(event) {
		path.reduce();
		path.smooth();
	};

	// tear down function
	tool.deactivate = function() {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}
	};

	// public functions
	tool.size = function(newSize) {
		if(newSize)
			strokeWidth = newSize;

		for(var i in config.BRUSH.SIZES)
			if(strokeWidth == config.BRUSH.SIZES[i])
				return i;
	};

	tool.terrain = function(terrain, colour) {
		if(colour)
			fillColour = colour;

		if(terrain)
			activeLayer = terrain;

		return activeLayer;
	};

	// add base size methods
	for(var i in config.BRUSH.SIZES) {
		tool[i] = (function(newSize) {
			return function() {
				return tool.size(newSize);
			};
		})(config.BRUSH.SIZES[i]);
	}

	// add base terrain methods
	var terrains = utils.theme.terrain();

	for(var i in terrains) {
		var t = i.toLowerCase();

		tool[t] = (function(terrain, colour) {
			return function() {
				return tool.terrain(terrain, colour);
			};
		})(t, terrains[i]);
	}

	// set defaults
	tool.large();
	tool.water();

	return tool;
})();