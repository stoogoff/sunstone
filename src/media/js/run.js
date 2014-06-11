
$(function() {
	var currentTool = null;

	$('.tool').click(function() {
		$('.tool.active').removeClass('active');
		$(this).addClass('active');

		// any additrional work for the tools
		switch(this.id) {
			case "brush":
				$('#size').val(brush.size());
				$('#terrain').val(brush.terrain());

				break;
		}

		if(currentTool && currentTool.deactivate)
			currentTool.deactivate();

		if(window[this.id] && window[this.id].activate) {
			window[this.id].activate();

			currentTool = window[this.id];
		}
	});

	$('select').change(function() {
		var self = $(this);
		var tool = self.attr('data-for');
		var method = self.val();

		if(window[tool] && window[tool][method])
			window[tool][method]();

		var reset = self.attr('data-reset');

		if(reset && reset === "true")
			this.selectedIndex = 0;
	});

	// add terrain to select lists
	var selectors = $('select#background,select#terrain')
	var terrain = utils.theme.terrain();

	for(var i in terrain) {
		selectors.append($('<option />').attr('value', i.toLowerCase()).text(i));
	}

	// add feature list
	var selectors = $('select#feature_type');
	var features = utils.theme.features();

	for(var i in features) {
		selectors.append($('<option />').attr('value', i.toLowerCase()).text(i));	
	}

	// set up the layer lists
	var layersPanel = $("#layers");

	// add all of the default layers
	window.setTimeout(function() {
		var terrainPanel = new utils.LayersPanel(layersPanel, 'Terrain', terrain);
		var featuresPanel = new utils.LayersPanel(layersPanel, 'Features', features);

		var layersLoaded = _.after(2, function() {
			layersPanel.find('input[type=checkbox]').change(function() {
				var layer = $(this).attr('name');
				var state = this.checked;

				layerManager.display(layer, state);
			}).end()
			.find(".sortable").sortable({
				stop: function(event, ui) {
					var movedLayer = $(ui.item).find('input').attr('name');
					var layersList = [];

					$(this).find('input').each(function(idx, input) {
						layersList.push(input.name);
					});

					for(var i = 0, len = layersList.length; i < len; ++i) {
						if(movedLayer == layersList[i] && i == 0) {
							layerManager.moveBelow(layersList[i + 1], movedLayer);
							break;	
						}
						else if(movedLayer == layersList[i]) {
							layerManager.moveAbove(layersList[i - 1], movedLayer);
							break;
						}
					}
				}
			});
		});

		// load background image and display
		window.background.load();

		// set up base layers
		terrainPanel.load(layersLoaded);
		featuresPanel.load(layersLoaded);

		layerManager.add("cursor");
	}, 1000);

	// set up sliding panel
	utils.SlidingPanel(layersPanel, layersPanel.find('.toggle span'));
});
