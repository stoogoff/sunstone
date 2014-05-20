
circles = (function() {
	var circles = new Tool();

	circles.onMouseDrag = function(event) {
		var radius = event.delta.length / 2;
		var circle = new Path.Circle(event.middlePoint, radius);
		circle.fillColor = 'red';
	};

	return circles;
})();