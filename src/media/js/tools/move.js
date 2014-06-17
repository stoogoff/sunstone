move =(function() {
	var target, offset;
	var cursor = new Cursor(config.CURSOR.HIGHLIGHT);
	var tool = new Tool();

	tool.minDistance = 3;

	// mouse functions
	tool.onMouseMove = function(event) {
		target = cursor.update(event);
	};

	tool.onMouseDown = function(event) {
		if(target)
			offset = target.bounds.center - event.downPoint;
	};

	tool.onMouseDrag = function(event) {
		if(target) {
			target.position = event.point + offset;
			cursor.move(target.bounds.center);
		}
	};

	// start up / tear down functions
	tool.activate = function() {
		layerManager.activate(config.CURSOR.LAYER);
		offset = new Point(0, 0);

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		cursor.remove();
	};

	return tool;
})();