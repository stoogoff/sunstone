
layerManager = (function() {
	var LayerManager = function() {
		var events = new utils.Publisher();

		// check to see if a layer exists
		this.exists = function(name) {
			return !!project.layers[name];
		};

		// add a new layer to the layers list
		this.add = function(name) {
			var layer = new Layer();

			layer.name = name;

			project.layers[name] = layer;

			events.publish('onAdd', name);

			return layer;
		};

		// activate an existing layer
		this.activate = function(name) {
			if(this.exists(name)) {
				project.layers[name].activate();
				events.publish('onActivate', name);
			}
		};

		// hide the layer
		this.hide = function(name) {
			if(this.exists(name)) {
				project.layers[name].visible = false;
				events.publish('onHide', name);
			}
		};

		// show the layer
		this.show = function(name) {
			if(this.exists(name)) {
				project.layers[name].visible = true;
				events.publish('onShow', name);
			}
		};

		// set the visible state of the layer
		this.display = function(name, state) {
			if(this.exists(name)) {
				project.layers[name].visible = state === true;
				events.publish(state ? 'onShow' : 'onHide', name);
			}
		};

		// set up events
		var handlers = ['onAdd', 'onActivate', 'onHide', 'onShow'];

		for(var i = 0, len = handlers.length; i < len; ++i) {
			this[handlers[i]] = (function(name) {
				return function(callback) {
					return events.subscribe(name, callback);
				}
			})(handlers[i]);
		}
	};

	return new LayerManager();
})();