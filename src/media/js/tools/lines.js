
lines = (function() {
	var path;
	var lines = new Tool();

	lines.onMouseDown = function(event) {
		path = new Path();
		path.strokeColor = 'black';
		path.add(event.point);
	};

	lines.onMouseDrag = function(event) {
		path.add(event.point);
	};

	return lines;
})();

