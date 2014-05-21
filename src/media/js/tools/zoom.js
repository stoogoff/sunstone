
zoom = (function() {
	var TOLERANCE = 0.1, MIN = 0.1, MAX = 5;
	var zoomIn, step;
	var tool = new Tool();

	tool.onMouseUp = function(event) {
		var currentStep = step, newZoom = view.zoom;

		if(event.delta.length / 100 > TOLERANCE)
			currentStep = event.delta.length / 100;

		if(zoomIn)
			newZoom += currentStep;
		else
			newZoom -= currentStep;

		if(newZoom <= MIN)
			view.zoom = MIN;
		else if(newZoom >= MAX)
			view.zoom = MAX;
		else
			view.zoom = newZoom;
	};

	tool.zoomIn = function() {
		zoomIn = true;
	};
	tool.zoomOut = function() {
		zoomIn = false;
	};
	tool.small = function() {
		step = 0.1;
	};
	tool.medium = function() {
		step = 0.5;
	};
	tool.large = function() {
		step = 1;
	};
	tool.zoomDouble = function() {
		view.zoom = 2;
	};
	tool.zoomFull = function() {
		view.zoom = 1;
	};
	tool.zoomHalf = function() {
		view.zoom = 0.5;
	};
	tool.zoomQuarter = function() {
		view.zoom = 0.25;
	}

	tool.zoomIn();
	tool.medium();

	return tool;
})();