
brush = (function() {
	var fillColour, strokeWidth, path, activeLayer;
	var tool = new Tool();

	tool.minDistance = 10;
	tool.onMouseDown = function(event) {
		// keep each piece of terrain on its own layer
		if(!layerManager.exists(activeLayer)) {
			layerManager.add(activeLayer);
		}

		layerManager.activate(activeLayer);

		path = new Path();
		path.fillColor = fillColour;
		path.strokeColor = fillColour;
		path.strokeWidth = strokeWidth;
		path.strokeCap = 'round';

		path.add(event.point);
	};

	tool.onMouseDrag = function(event) {
		var step = event.delta / 2;
		step.angle += 90;

		step.normalize();

		var top = event.middlePoint + step;
		var bottom = event.middlePoint - step;

		path.add(top);
		path.insert(0, bottom);
		path.smooth();
	};

	tool.onMouseUp = function(event) {
		path.add(event.point);
		path.closed = false;
		path.reduce();
		path.smooth();
	};

	// public functions
	tool.size = function(newSize) {
		if(newSize)
			strokeWidth = newSize;

		for(var i in sizes)
			if(strokeWidth == sizes[i])
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
	var sizes = {
		"small": 2,
		"medium": 20,
		"large": 40,
		"huge": 80
	};

	for(var i in sizes) {
		tool[i] = (function(newSize) {
			return function() {
				tool.size(newSize);
			};
		})(sizes[i]);
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