
// manages layer state and ordering
layerManager = (function() {
	var LayerManager = function() {
		var events = new utils.Publisher();

		// check to see if a layer exists
		this.exists = function(name) {
			return !!project.layers[name];
		};

		// add a new layer to the layers list
		this.add = function(name, locked) {
			if(this.exists(name)) {
				return project.layers[name];
			}

			var layer = new Layer();

			layer.name = name;

			if(locked === true)
				layer._locked = true;

			project.layers[name] = layer;

			events.publish('onAdd', name);

			return layer;
		};

		this.current = function() {
			return project.activeLayer.name;
		};

		this.addList = function(layers) {
			for(var i = 0, len = layers.length; i < len; ++i)
				this.add(layers[i]);
		}

		// activate an existing layer
		this.activate = function(name) {
			if(this.exists(name)) {
				project.layers[name].activate();
				events.publish('onActivate', name);

				return project.layers[name];
			}

			throw "Couldn't activate layer '" + name + "'";
		};

		// layer visibility
		this.hide = function(name) {
			if(this.exists(name)) {
				project.layers[name].visible = false;
				events.publish('onHide', name);
			}
		};
		this.show = function(name) {
			if(this.exists(name)) {
				project.layers[name].visible = true;
				events.publish('onShow', name);
			}
		};
		this.display = function(name, state) {
			if(this.exists(name)) {
				project.layers[name].visible = state === true;
				events.publish(state === true ? 'onShow' : 'onHide', name);
			}
		};

		// sorting
		this.toFront = function(layer) {
			if(this.exists(layer)) {
				//project.layers[layer].bringToFront();
				this.moveAbove(project.layers[project.layers.length - 1], layer);
			}
		};
		this.toBack = function(layer) {
			if(this.exists(layer)) {
				//project.layers[layer].sendToBack();
				this.moveAbove(project.layers[0], layer);
			}
		};
		this.moveAbove = function(base, layer) {
			if(this.exists(base) && this.exists(layer)) {
				project.layers[layer].moveAbove(project.layers[base]);
			}
		};
		this.moveBelow = function(base, layer) {
			if(this.exists(base) && this.exists(layer)) {
				project.layers[layer].moveBelow(project.layers[base]);
			}
		};

		// view functions
		this.scale = function(size) {
			view.zoom = size;
			events.publish('onScale', size);
		};

		this.pan = function(delta) {
			view.scrollBy(delta);
			events.publish('onPan', delta);
		};

		// remove all objects on all layers, except those which are locked
		this.clear = function() {
			project.layers.forEach(function(layer) {
				if(!layer._locked) {
					while(layer.children.length > 0)
						layer.children[0].remove();
				}
			});
		};

		// show all layers
		this.list = function() {
			var list = [];

			project.layers.forEach(function(layer) {
				list.push(layer.name || "default layer");
			});

			return list;
		};

		// set up events
		var handlers = ['onAdd', 'onActivate', 'onHide', 'onShow', 'onScale', 'onPan'];

		for(var i = 0, len = handlers.length; i < len; ++i) {
			this[handlers[i]] = (function(name) {
				return function(callback) {
					return events.subscribe(name, callback);
				}
			})(handlers[i]);
		}
	};

	project.layers[0].name = "default";

	return new LayerManager();
})();