remove = (function() {
	var target, currentMap;
	var cursor = new Cursor(config.CURSOR.WARN);
	var tool = new Tool();

	tool.minDistance = 10;

	// mouse functions
	tool.onMouseMove = function(event) {
		target = cursor.update(event);
	};

	tool.onMouseDown = function(event) {
		if(target) {
			currentMap.removeObject(target.layer.name, target.name);

			target.remove();
			target = null;

			cursor.remove();
		}
	};

	// start up / tear down functions
	tool.activate = function(map) {
		layerManager.activate(config.CURSOR.LAYER);
		currentMap = map;

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		cursor.remove();
	};

	return tool;
})();