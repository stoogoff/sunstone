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

					if(item.constructor === PlacedSymbol) {
						itemData = {
							"x": item.position.x,
							"y": item.position.y,
							"feature": item.symbol.featurePath
						};
					}
					// text only
					else if(item.constructor === PointText) {
						itemData["content"] = item.content;
						itemData["x"] = item.point.x;
						itemData["y"] = item.point.y;
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
			var addPath = function(item, id) {
				var path = new Path();

				path.closed = item.closed;
				path.strokeColor = colour;
				path.strokeWidth = item.strokeWidth;
				path.strokeCap = 'round';

				var offset = { x: 0, y: 0 };

				if(item.x && item.y && _.isNumber(item.x) && _.isNumber(item.y)) {
					offset.x = item.x;
					offset.y = item.y;
				}

				item.segments.forEach(function(segment) {
					segment.x += offset.x;
					segment.y += offset.y;

					path.add(segment);
				});

				if(item.closed) {
					path.fillColor = colour;

					if(item.smooth)
						path.smooth();
				}

				if(id)
					path.name = id;
			};

			if(layer.forEach)
				layer.forEach(addPath);
			else {
				for(var key in layer) {
					addPath(layer[key], key);
				}
			}
		});

		// set background
		if("background" in data) {
			background[data["background"]]();
		}

		// create text and font styles
		var fonts = utils.theme.fonts();

		importObjects(data, fonts, function(layer, font) {
			var addText = function(item, id) {
				var text = new PointText(item.position ? item.position : { "x": item.x, "y": item.y });

				font.setFont(text);

				text.content = item.content;

				if(id) {
					text.name = id;
				}
			};

			if(layer.forEach) {
				layer.forEach(addText);
			}
			else {
				for(var key in layer) {
					addText(layer[key], key);
				}
			}
		});

		// load symbols
		var features = utils.theme.features();

		importObjects(data, features, function(layer, feature) {
			var addSymbol = function(item, id) {
				var symbol = item.feature && symbols[item.feature] ? symbols[item.feature] : feature[0].symbol();
				var placed = symbol.place(item);

				if(id) {
					placed.name = id;
				}
			};
			var symbols = {};

			_.each(feature, function(element) {
				symbols[element.basePath()] = element.symbol();
			});

			if(layer.forEach) {
				layer.forEach(addSymbol);
			}
			else {
				for(var key in layer) {
					addSymbol(layer[key], key);
				}
			}
		});
	}

	return {
		exportJSON: save,
		importJSON: update
	};
})();