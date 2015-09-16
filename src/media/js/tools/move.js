move =(function() {
	var target, offset, currentMap;
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

	tool.onMouseUp = function(event) {
		if(target) {
			currentMap.moveObject(target.layer.name, target.name, target.position);
		}
	};

	// start up / tear down functions
	tool.activate = function(map) {
		layerManager.activate(config.CURSOR.LAYER);
		offset = new Point(0, 0);
		currentMap = map;

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		cursor.remove();
	};

	return tool;
})();