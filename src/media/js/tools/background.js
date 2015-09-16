
// Changes the background colour of the map
background = (function() {
	var tool = {};
	var currentTerrain, image, layer, rectangle, fillColour, previousLayer, currentMap;
	var canvas = project.view.element;

	// public methods
	tool.terrain = function(terrain, colour) {
		previousLayer = layerManager.current();
		layerManager.activate(config.BACKGROUND.LAYER);

		if(colour) {
			canvas.style.backgroundColor = colour;

			if(rectangle)
				rectangle.remove();

			rectangle = new Path.Rectangle({
				point: [0, 0],
				size: view.size,
				fillColor: colour
			});
			rectangle.position = view.center;

			fillColour = colour;
		}

		if(terrain) {
			currentTerrain = terrain;

			if(currentMap)
				currentMap.setBackground(terrain);
		}

		layerManager.activate(previousLayer);

		return currentTerrain;
	};

	tool.activate = function(map) {
		currentMap = map;

		Tool.prototype.activate.call(this);
	};

	tool.load = function() {
		// load background image
		image = new Raster(utils.theme.background());

		image.onLoad = function() {
			image.blendMode = 'multiply';
			image.position = view.center;
		};

		// TODO subscribe to view updates

		// this keeps the image and colour rectangle fixed centre
		// it does the job but the pan feels kind of weird
		layerManager.onPan(function() {
			rectangle.position = image.position = view.center;
		});

		layerManager.onScale(function() {
			image.scaling = 1 / view.zoom;

			var w = view.size.width;
			var h = view.size.height;

			// resize
			rectangle.segments[0].point = [0, 0];
			rectangle.segments[1].point = [w, 0];
			rectangle.segments[2].point = [w, h];
			rectangle.segments[3].point = [0, h];

			// reposition
			rectangle.position = view.center;
		});

		// set defaults
		tool.sand();
	};

	// add base terrain methods
	var terrains = utils.theme.terrain();

	for(var i in terrains) {
		tool[i.toLowerCase()] = (function(terrain, colour) {
			return function() {
				return tool.terrain(terrain, colour);
			};
		})(i, terrains[i]);
	}

	return tool;
})();