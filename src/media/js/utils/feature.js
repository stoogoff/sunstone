
// a container for features, which handles loading
utils.Feature = function(name, basePath) {
	var events = new utils.Publisher();
	var svg = false, symbol;

	this.id = function() {
		return utils.toId(name);
	};

	this.name = function() {
		return name;
	};

	this.image = function() {
		// should probably load the image and return it
		return basePath + '.png';
	};

	this.basePath = function() {
		return basePath;
	};

	this.svg = function() {
		return svg;
	};

	this.symbol = function() {
		if(!symbol) {
			// import from SVG, create the symbol and remove the import
			var imported = paper.project.importSVG(svg);

			symbol = new paper.Symbol(imported);

			// store the path so the correct image can be used during import and export
			symbol.featurePath = basePath;
		}

		return symbol;
	};

	this.load = function() {
		$.get(basePath + '.svg', function(data) {
			svg = data;

			events.publish('onLoad', name, svg);
		});
	};

	this.loaded = function() {
		return svg !== false;
	}

	// set up events
	this.onLoad = function(callback) {
		return events.subscribe('onLoad', callback);
	};
};