
// selects a feature on the map
selection = (function() {
	var path, segment, doubleClickTimer, doubleClick, currentMap;
	var tool = new Tool();

	// mouse events
	tool.onMouseDown = function(event) {
		segment = null;

		var hitResult = project.hitTest(event.point, {
			fill: true,
			stroke: true,
			segments: true,
			tolerance: 5
		});

		if(!hitResult)
			return;

		// if this is a double click delete the segment
		if(doubleClick && hitResult.type == "segment") {
			hitResult.segment.remove();

			currentMap.setPathSegments(path.layer.name, path);

			doubleClick = false;

			return;
		}

		doubleClick = true;

		if(hitResult.type == "segment") {
			segment = hitResult.segment;
		}
		else if(hitResult.type == "stroke") {
			var location = hitResult.location;
			segment = path.insert(location.index + 1, event.point);

			if(!path.firstSegment.linear)
				path.smooth();

			currentMap.setPathSegments(path.layer.name, path);
		}

		if(doubleClickTimer)
			window.clearTimeout(doubleClickTimer);

		doubleClickTimer = window.setTimeout(function() {
			doubleClick = false;
		}, config.TIME.DOUBLE_CLICK);
	};

	tool.onMouseDrag = function(event) {
		if(segment)
			segment.point += event.delta;

		//currentMap.setPathSegments(path.layer.name, path);
	};

	tool.onMouseMove = function(event) {
		if(event.item && event.item.constructor !== PlacedSymbol && event.item.constructor !== PointText) {
			if(path)
				path.selected = false;

			path = event.item;
			path.selected = true;
		}
		else if(path) {
			path.selected = false;
			path = null;
		}
	};

	tool.onMouseUp = function(event) {
		currentMap.setPathSegments(path.layer.name, path);
	};

	// setup and tear down
	tool.activate = function(map) {
		currentMap = map;

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		if(path) {
			path.selected = false;
			path = null;
		}
	};

	return tool;
})();