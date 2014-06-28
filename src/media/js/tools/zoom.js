
zoom = (function() {
	var TOLERANCE = 0.1, MIN = 0.1, MAX = 5;
	var zoomIn, step, cursor;
	var tool = new Tool();

	tool.onMouseDown = function(event) {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}

		cursor = new Path();
		cursor.strokeColor = config.CURSOR.NEUTRAL;
		cursor.strokeCap = 'round';
		cursor.strokeWidth = 1;

		cursor.add(event.point);
		cursor.add(event.point);
	};

	// keep line over last point
	tool.onMouseMove = function(event) {
		if(cursor && cursor.lastSegment)
			cursor.lastSegment.point = event.point;
	};

	tool.onMouseUp = function(event) {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}

		layerManager.panTo(event.middlePoint);

		var currentStep = TOLERANCE, newZoom = view.zoom;

		if(event.delta.length / 100 > TOLERANCE)
			currentStep = event.delta.length / 100;

		if(zoomIn)
			newZoom += currentStep;
		else
			newZoom -= currentStep;

		if(newZoom <= MIN)
			layerManager.scale(MIN);
		else if(newZoom >= MAX)
			layerManager.scale(MAX);
		else
			layerManager.scale(newZoom);
	};

	// set up and tear down
	tool.activate = function() {
		layerManager.activate(config.CURSOR.LAYER);

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}
	};

	// public methods
	tool.zoomIn = function() {
		zoomIn = true;
	};
	tool.zoomOut = function() {
		zoomIn = false;
	};
	tool.zoomFive = function() {
		layerManager.scale(5);
	};
	tool.zoomDouble = function() {
		layerManager.scale(2);
	};
	tool.zoomFull = function() {
		layerManager.scale(1);
	};
	tool.zoomHalf = function() {
		layerManager.scale(0.5);
	};
	tool.zoomQuarter = function() {
		layerManager.scale(0.25);
	}

	tool.zoomIn();

	return tool;
})();