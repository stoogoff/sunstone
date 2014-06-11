
// Changes the background colour of the map
background = (function() {
	var tool = {};
	var currentTerrain, image, layer, rectangle, previousLayer;
	var canvas = project.view.element;

	tool.terrain = function(terrain, colour) {
		previousLayer = project.activeLayer.name;
		layerManager.activate(config.BACKGROUND.LAYER);

		if(colour) {
			canvas.style.backgroundColor = colour;

			if(rectangle)
				rectangle.remove();

			rectangle = new Path.Rectangle({
				point: [0, 0],
				size: [image.bounds.width || canvas.offsetWidth, image.bounds.height || canvas.offsetHeight],
				fillColor: colour
			});
		}

		if(terrain)
			currentTerrain = terrain;

		layerManager.activate(previousLayer);

		return currentTerrain;
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

	tool.load = function() {
		// load background image
		image = new Raster(utils.theme.background());

		image.onLoad = function() {
			image.blendMode = 'multiply';
			image.position = new Point(image.bounds.width / 2, image.bounds.height / 2);
		};

		// set defaults
		tool.sand();
	};

	return tool;
})();