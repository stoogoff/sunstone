move =(function() {
	var cursor, target, strokeWidth, deleteCursor = false;
	var tool = new Tool();

	tool.minDistance = 10;

	// mouse functions
	tool.onMouseMove = function(event) {
		if(target)
			target = null;
		
		deleteCursor = true;

		if(event.item) {
			target = event.item;

			// find symbol beneath the current point and highlight it
			if(event.item.constructor === PlacedSymbol || event.item.constructor === PointText) {
				if(!cursor) {
					cursor = new Path.Rectangle(target.bounds, new Point(5, 5));
					cursor.fillColor = config.CURSOR.HIGHLIGHT;
					cursor.opacity = config.CURSOR.OPACITY;
				}

				cursor.position = target.bounds.center;
			}

			deleteCursor = false;
		}

		if(deleteCursor && cursor) {
			cursor.remove();
			cursor = null;
		}
	};

	tool.onMouseDrag = function(event) {
		if(target) {
			target.position = event.point;
			cursor.position = target.bounds.center;
		}
	};

	// start up / tear down functions
	tool.activate = function() {
		layerManager.activate(config.CURSOR.LAYER);

		Tool.prototype.activate.call(this);
	};

	return tool;
})();