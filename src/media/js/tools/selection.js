
selection = (function() {
	var tool = new Tool();
	var currentHit;

	tool.deactivate = function() {
		if(currentHit) {
			currentHit.item.selected = false;
			currentHit = null;
		}
	};

	tool.onMouseDown = function(event) {
		var hit = project.hitTest(event.point, {
			fill: true,
			stroke: true,
			segments: true
		});

		if(currentHit)
			currentHit.item.selected = false;

		if(hit) {
			hit.item.selected = true;
			currentHit = hit;
		}
	};

	return tool;
})();