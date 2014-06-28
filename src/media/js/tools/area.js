area = (function() {
	var fillColour, activeLayer, path, smoothing, doubleClickTimer, doubleClick;
	var tool = new Tool();

	tool.minDistance = 5;

	// mouse control related functions
	tool.onMouseUp = function(event) {
		// if this is a double click close the path 
		if(doubleClick) {
			doubleClick = false;

			path.removeSegment(path.segments.length - 1);

			path.fillColor = fillColour;
			path.closed = true;

			if(smoothing)
				path.smooth();

			path = null;

			return;
		}

		doubleClick = true;

		if(!path) {
			layerManager.activate(activeLayer);

			path = new Path();
			path.strokeColor = fillColour;
			path.strokeCap = 'round';
			path.strokeWidth = 1;
		}

		path.add(event.point);

		if(path.segments.length == 1)
			path.add(event.point);

		if(doubleClickTimer)
			window.clearTimeout(doubleClickTimer);

		doubleClickTimer = window.setTimeout(function() {
			doubleClick = false;
		}, config.TIME.DOUBLE_CLICK);
	};

	// keep line over last point
	tool.onMouseMove = function(event) {
		if(path && path.lastSegment)
			path.lastSegment.point = event.point;
	};

	// public methods
	tool.style = function() {
		return smoothing ? "smooth" : "line";
	};
	tool.smooth = function() {
		smoothing = true;
	};
	tool.line = function() {
		smoothing = false;
	};

	tool.terrain = function(terrain, colour) {
		if(colour)
			fillColour = colour;

		if(terrain)
			activeLayer = terrain;

		return activeLayer;
	};

	// add base terrain methods
	var terrains = utils.theme.terrain();

	for(var i in terrains) {
		var t = utils.toId(i);

		tool[t] = (function(terrain, colour) {
			return function() {
				return tool.terrain(terrain, colour);
			};
		})(t, terrains[i]);
	}

	// set defaults
	tool.water();
	tool.smooth();

	return tool;
})();