
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

		if(window[this.id]) {
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
	});

	// add terrain to select lists
	var selectors = $('select#background,select#terrain')
	var terrain = utils.theme.terrain();

	for(var i in terrain) {
		selectors.append($('<option />').attr('value', i.toLowerCase()).text(i));
	}

	// add feature list
	// TODO - change feature list to show a items with an image
	var selectors = $('select#feature_type');
	var features = utils.theme.features();

	for(var i in features) {
		selectors.append($('<option />').attr('value', i.toLowerCase()).text(i));	
	}

	// set up the layer lists
	var layersPanel = $("#layers");
	var layerTemplate = new utils.TemplateLoader('media/tpl/layers.html');
	var layersLoaded = _.after(2, function() {
		layersPanel.find('input[type=checkbox]').change(function() {
			var layer = $(this).attr('name');
			var state = this.checked;

			layerManager.display(layer, state);
		});

		// do this later to avoid paper script timing
		window.setTimeout(function() {
			layerManager.onAdd(function(name) {
				layersPanel.find('input[name=' + name + ']').removeAttr('disabled');
			});
		}, 1000);
	});

	var objectKeys = function(o) {
		return _.object(_.chain(o).keys().map(function(s) {
			return s.toLowerCase();
		}).value(), _.keys(o))
	};

	layerTemplate.load(layersPanel, {
		'title': 'Terrain',
		'layers': objectKeys(terrain)
	}, layersLoaded);

	layerTemplate.load(layersPanel, {
		'title': 'Features',
		'layers': objectKeys(features)
	}, layersLoaded);
});
