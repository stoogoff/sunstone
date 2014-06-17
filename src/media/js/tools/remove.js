remove = (function() {
	var target;
	var cursor = new Cursor(config.CURSOR.WARN);
	var tool = new Tool();

	tool.minDistance = 10;

	// mouse functions
	tool.onMouseMove = function(event) {
		target = cursor.update(event);
	};

	tool.onMouseDown = function(event) {
		if(target) {
			target.remove();
			target = null;

			cursor.remove();
		}
	};

	// start up / tear down functions
	tool.activate = function() {
		layerManager.activate(config.CURSOR.LAYER);

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		cursor.remove();
	};

	return tool;
})();