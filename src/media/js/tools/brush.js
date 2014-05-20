
brush = (function() {
	var fillColour, size, path;
	var tool = new Tool();

	tool.minDistance = 10;
	tool.onMouseDown = function(event) {
		path = new Path();
		path.fillColor = fillColour;

		path.add(event.point);
	};

	tool.onMouseDrag = function(event) {
		var step = event.delta / 2;
		step.angle += 90;

		step = step.normalize(size);
		
		var top = event.middlePoint + step;
		var bottom = event.middlePoint - step;

		path.add(top);
		path.insert(0, bottom);
	};

	tool.onMouseUp = function(event) {
		path.add(event.point);
		path.closed = true;
		path.smooth();
	};

	// public functions
	tool.setSize = function(newSize) {
		size = newSize;
	};

	tool.setTerrain = function(terrain, colour) {
		// TODO terrain will add onto an extra layer
		fillColour = colour;
	};

	// add base size methods
	var sizes = {
		"small": 5,
		"medium": 20,
		"large": 40
	};

	for(var i in sizes) {
		tool[i] = (function(newSize) {
			return function() {
				size = newSize;
			};
		})(sizes[i]);
	}

	// add base terrain methods
	var terrains = {
		"sea": "#273A63",
		"sand": "#C9AE7F",
		"earth": "#604310",
		"grass": "#1B510D"
	};

	for(var i in terrains) {
		tool[i] = (function(terrain, colour) {
			return function() {
				fillColour = colour;
			};
		})(i, terrains[i]);
	}

	// set defaults
	tool.large();
	tool.sea();

	return tool;
})();