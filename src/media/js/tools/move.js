move =(function() {
	var cursor, target, offset, deleteCursor = false;
	var tool = new Tool();

	tool.minDistance = 3;

	// mouse functions
	tool.onMouseMove = function(event) {
		if(target)
			target = null;
		
		deleteCursor = true;

		if(event.item) {
			if(cursor && event.item !== target) {
				cursor.remove();
				cursor = null;
			}

			target = event.item;

			// find symbol beneath the current point and highlight it
			if(target.constructor === PlacedSymbol || target.constructor === PointText) {
				if(!cursor) {
					cursor = new Path.Rectangle(target.bounds, new Point(5, 5));
					cursor.fillColor = config.CURSOR.HIGHLIGHT;
					cursor.opacity = config.CURSOR.OPACITY;
				}

				cursor.position = target.bounds.center;
			}
			// find path between the current point
			else if(target.constructor === Path) {
				if(!cursor) {
					cursor = target.clone(false);
					cursor.opacity = config.CURSOR.OPACITY;

					if(target.fillColor)
						cursor.fillColor = config.CURSOR.HIGHLIGHT;

					if(target.strokeColor) {
						cursor.strokeColor = config.CURSOR.HIGHLIGHT;
						cursor.strokeWidth = target.strokeWidth;
					}

					project.activeLayer.addChild(cursor);
				}
			}

			deleteCursor = false;
		}

		if(cursor && deleteCursor) {
			cursor.remove();
			cursor = null;
		}
	};

	tool.onMouseDown = function(event) {
		if(target)
			offset = target.bounds.center - event.downPoint;
	};

	tool.onMouseDrag = function(event) {
		if(target) {
			target.position = event.point + offset;
			cursor.position = target.bounds.center;
		}
	};

	// start up / tear down functions
	tool.activate = function() {
		layerManager.activate(config.CURSOR.LAYER);
		offset = new Point(0, 0);

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = function() {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}
	};

	return tool;
})();