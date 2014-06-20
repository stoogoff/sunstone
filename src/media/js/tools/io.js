io = (function() {


	function importObjects(data, layers, callback) {
		for(var i in layers) {
			var layer = utils.toId(i);

			// no data for this layer, so nothing to do
			if(!data.layers[layer] || data.layers[layer].length === 0)
				continue;

			// this layer doesn't exist
			if(!layerManager.exists(layer))
				continue; // TODO decide what to do here

			layerManager.activate(layer);

			callback(data.layers[layer], layers[i]);
		}
	}

	// export data as JSON
	function save() {
		var map = {
			"theme": "THEME NAME", // TODO pull this from utils.theme when the theme switching is done
			"background": utils.toId(background.terrain()),
			"layers": {}
		};

		project.layers.forEach(function(layer) {
			if(!layer._locked) {
				var children = [];

				layer.children.forEach(function(item) {
					// symbol, text, path
					var itemData = {};
					var position = {
						"x": item.position.x,
						"y": item.position.y
					};

					if(item.constructor === PlacedSymbol) {
						itemData = position;
					}
					// text only
					else if(item.constructor === PointText) {
						itemData["content"] = item.content;
						itemData["position"] = position;
					}
					// paths
					else if(item.constructor === Path) {
						itemData["closed"] = item.closed;
						itemData["strokeWidth"] = item.strokeWidth;
						itemData["segments"] = [];

						item.segments.forEach(function(segment) {
							itemData["segments"].push({
								"x": segment.point.x,
								"y": segment.point.y
							})
						});

						// add smoothing or not
						if(item.closed)
							itemData["smooth"] = item.firstSegment.linear !== true;
					}

					children.push(itemData);
				});

				if(children.length > 0)
					map.layers[layer.name] = children;
			}
		});

		return map;
	};

	// import data
	function update(data) {
		// TODO set theme

		// create paths
		var terrain = utils.theme.terrain();

		importObjects(data, terrain, function(layer, colour) {
			layer.forEach(function(item) {
				var path = new Path();

				path.closed = item.closed;
				path.strokeColor = colour;
				path.strokeWidth = item.strokeWidth;
				path.strokeCap = 'round';

				item.segments.forEach(function(segment) {
					path.add(segment);
				});

				if(item.closed) {
					path.fillColor = colour;

					if(item.smooth)
						path.smooth();
				}
			});
		});

		// set background
		background[data["background"]]();

		// create text and font styles
		var fonts = utils.theme.fonts();

		importObjects(data, fonts, function(layer, font) {
			layer.forEach(function(item) {
				// TODO co-ords are slightly off here...
				// Seems to be based on centre positions and gets worse with repeat export / import
				var text = new PointText(item.position);
				
				font.setFont(text);

				text.content = item.content;
			});	
		});

		// load symbols
		var features = utils.theme.features();

		importObjects(data, features, function(layer, feature) {
			var symbol = feature.symbol();

			layer.forEach(function(item) {
				symbol.place(item);
			});
		});
	}

	return {
		exportJSON: save,
		importJSON: update
	};
})();