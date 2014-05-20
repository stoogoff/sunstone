
clouds = (function() {
	var path;
	var clouds = new Tool();

	clouds.minDistance = 20;
	clouds.onMouseDown = function(event) {
		path = new Path();
		path.strokeColor = 'black';
		path.add(event.point);
	};

	clouds.onMouseDrag = function(event) {
		// Use the arcTo command to draw cloudy lines
		path.arcTo(event.point);
	};

	return clouds;
})();