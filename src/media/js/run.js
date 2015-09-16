$(function() {
	var LOAD = 1000, SAVE = 10000, MAP_KEY = "map";

	// TODO generate map ID
	var mapId = location.hash.substring(1);

	if(mapId === "") {
		location.replace("#" + utils.createGuid());
	}

	// TODO load map data from Firebase and display it
	var map = new utils.Map(mapId);

	// TODO map needs to reload on hash change

	// active tools and event handling
	var currentTool = null;

	$('.tool').click(function() {
		$('.tool.active').removeClass('active');
		$(this).addClass('active');

		// any additional work for the tools
		switch(this.id) {
			// set the select boxes for brush and area tools
			case "brush":
				$('#brush_size').val(brush.size());
				$('#brush_terrain').val(brush.terrain());

				break;

			case "area":
				$('#area_terrain').val(area.terrain());
				$('#area_style').val(area.style());

				break;

			// the following are single button clicks
			case "download":
				var	canvas = document.getElementById("canvas");
				var context = canvas.getContext("2d");
				var source = canvas.toDataURL("image/png");

				var win = window.open(null, '_blank');

				win.document.write('<img src="' + source + '" />');
				win.focus();

				$("#pan").click();

				return;

			case "clear":
				if(window.confirm("Are you sure? There is no undo."))
					layerManager.clear();

				$("#pan").click();

				return;
		}

		if(currentTool && currentTool.deactivate)
			currentTool.deactivate();

		if(window[this.id] && window[this.id].activate) {
			window[this.id].activate(map);

			currentTool = window[this.id];
		}
	});

	$('select').change(function() {
		var self = $(this);
		var tool = self.attr('data-for');
		var method = self.val();

		if(window[tool] && window[tool][method]) {
			window[tool].activate(map);
			window[tool][method]();
		}

		var reset = self.attr('data-reset');

		if(reset && reset === "true")
			this.selectedIndex = 0;
	});

	var addOption = function(select, value, text) {
		select.append($('<option />').attr('value', value).text(text));
	};

	var addOptions = function(select, options) {
		for(var i in options) {
			var option = options[i];
			var value = utils.toId(i);

			// multilevel options
			if(_.isArray(options[i])) {
				if(options[i].length > 1) {
					_.each(options[i], function(element, index) {
						addOption(select, value + "_" + index, i + " " + (index + 1));
					});

					continue;
				}

				value = value + "_0";
			}

			addOption(select, value, i);
		}
	};

	// add terrain, features and text styles
	var terrain = utils.theme.terrain();
	var features = utils.theme.features();
	var fonts = utils.theme.fonts();

	addOptions($('select#background,select#brush_terrain,select#area_terrain'), terrain);
	addOptions($('select#feature_type'), features);
	addOptions($('#font_style'), fonts);

	// field type just needs the feature types, not the individual images
	var tmp = _.keys(features);

	addOptions($('select#field_type'), _.object(tmp, tmp));

	// set up the layer lists
	var layersPanel = $("#layers");

	// add all of the default layers
	window.setTimeout(function() {
		// set up background
		layerManager.add("background", true);

		// set up panels
		var terrainPanel = new utils.LayersPanel(layersPanel, 'Terrain', terrain);
		var featuresPanel = new utils.LayersPanel(layersPanel, 'Features', features);
		var textPanel = new utils.LayersPanel(layersPanel, 'Text', fonts);

		var layersLoaded = _.after(3, function() {
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

		// set up base layers
		terrainPanel.load(layersLoaded);
		featuresPanel.load(layersLoaded);
		textPanel.load(layersLoaded);

		// this prevents the cursor layer being used for hit tests
		layerManager.add("cursor", true);

		// load tools and activate the correct one
		window.background.load();
		window.pan.activate();

		map.load();

		// load up any existing features
		/*if(utils.store.has(MAP_KEY)) {
			io.importJSON(utils.store.get(MAP_KEY));
		}*/

		// auto save the map data
		window.setInterval(function() {
			utils.store.set(MAP_KEY, io.exportJSON());
		}, SAVE);

	}, LOAD);

	// set up sliding panel
	var sidebar = $("#sidebar");

	utils.SlidingPanel(sidebar, sidebar.find('.toggle span'));

	// activate tabs
	$(".tabs li").click(function() {
		// hide existing
		$(".tabs li,.tab-panels .active").removeClass("active");
		
		var self = $(this);
		var panel = self.attr("data-for");

		$("#" + panel).addClass("active");
		self.addClass("active");
	});

	// allow the definition lists to be hidden
	$("dt").attr("title", "Click to show or hide").click(function() {
		$(this).next().slideToggle();
	});
	$("dd").hide();
});
