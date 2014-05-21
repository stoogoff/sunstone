
// a container for features, which handles loading
utils.Feature = function(name, basePath) {
	var events = new utils.Publisher();
	var svg = false;

	this.name = function() {
		return name;
	};

	this.image = function() {
		// should probably load the image and return it
		return basePath + '.png';
	};

	this.svg = function() {
		return svg;
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