
pan = (function() {
	var start;
	var tool = new Tool();

	tool.distanceThreshold = 8;
	tool.onMouseDown = function(event) {
		start = event.point - view.center;
	};

	tool.onMouseDrag = function(event) {
		var end = event.point - paper.view.center;
		var delta = start - end;
        
		layerManager.pan(delta);

		start = end;
	};

	return tool;
})();