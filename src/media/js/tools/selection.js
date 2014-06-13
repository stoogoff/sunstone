
// selects a feature on the map
selection = (function() {
	var path, segment, doubleClickTimer, doubleClick;
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

			console.log(location.segment.linear)

			//path.smooth();
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

	// setup and tear down
	tool.deactivate = function() {
		if(path) {
			path.selected = false;
			path = null;
		}
	};

	return tool;
})();