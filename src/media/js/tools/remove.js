remove = (function() {
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
					cursor.fillColor = config.CURSOR.WARN;
					cursor.opacity = config.CURSOR.OPACITY;
				}

				cursor.position = target.bounds.center;
			}
			// find path between the current point
			else if(event.item.constructor === Path) {
				//target.selected = true;

				if(!cursor) {
					cursor = new Path.Circle(event.point, strokeWidth / 2);
					cursor.fillColor = config.CURSOR.WARN;
					cursor.opacity = config.CURSOR.OPACITY;
				}

				cursor.position = event.point;
			}

			deleteCursor = false;
		}

		if(deleteCursor && cursor) {
			cursor.remove();
			cursor = null;
		}
	};

	tool.onMouseDown = function(event) {
		if(target && (target.constructor === PlacedSymbol || event.item.constructor === PointText)) {
			target.remove();
			target = null;

			if(cursor) {
				cursor.remove();
				cursor = null;
			}
		}
	};

	tool.onMouseDrag = function(event) {
		if(target && target.constructor === Path) {
			console.log("deletable")
		}
	}

	// start up / tear down functions
	tool.activate = function() {
		layerManager.activate(config.CURSOR.LAYER);

		Tool.prototype.activate.call(this);
	};

	// public methods
	tool.size = function(newSize) {
		if(newSize)
			strokeWidth = newSize;

		for(var i in config.BRUSH.SIZES)
			if(strokeWidth == config.BRUSH.SIZES[i])
				return i;
	};

	// add base size methods
	for(var i in config.BRUSH.SIZES) {
		tool[i] = (function(newSize) {
			return function() {
				return tool.size(newSize);
			};
		})(config.BRUSH.SIZES[i]);
	}

	tool.large();

	return tool;
})();