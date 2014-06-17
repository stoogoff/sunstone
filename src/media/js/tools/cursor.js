Cursor = function(colour) {
	var cursor, target, offset, layer, deleteCursor = false;

	function setLayer() {
		layer = layerManager.current();

		if(layer != config.CURSOR.LAYER)
			layerManager.activate(config.CURSOR.LAYER);
	}

	function resetLayer() {
		if(layer && layer != config.CURSOR.LAYER)
			layerManager.activate(layer);
	}

	this.update = function(event) {
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
					setLayer();

					cursor = new Path.Rectangle(target.bounds, config.CURSOR.CORNERS);
					cursor.fillColor = colour;
					cursor.opacity = config.CURSOR.OPACITY;

					resetLayer();
				}

				cursor.position = target.bounds.center;
			}
			// find path between the current point
			else if(target.constructor === Path) {
				if(!cursor) {
					cursor = target.clone(false);
					cursor.opacity = config.CURSOR.OPACITY;

					if(target.fillColor)
						cursor.fillColor = colour;

					if(target.strokeColor) {
						cursor.strokeColor = colour;
						cursor.strokeWidth = target.strokeWidth;
					}

					setLayer();

					project.activeLayer.addChild(cursor);

					resetLayer();
				}
			}

			deleteCursor = false;
		}

		if(cursor && deleteCursor) {
			cursor.remove();
			cursor = null;
		}

		return target;
	};

	this.move = function(position) {
		cursor.position = position;
	};

	this.remove = function() {
		if(cursor) {
			cursor.remove();
			cursor = null;
		}
	};
};