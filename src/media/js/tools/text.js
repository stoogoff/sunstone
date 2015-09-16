text = (function() {
	var dropPoint, currentFont, textPanel, editingText, currentMap;
	var cursor = new Cursor(config.CURSOR.HIGHLIGHT, [PointText]);
	var tool = new Tool();
	var hidePanel = function() {
		if(!textPanel)
			return;

		textPanel.css({
			"top": "-300px",
			"visibility": "hidden"
		}).find("textarea").val("");

		editingText = null;
	};

	// mouse events

	// on mouse up display the text editing box
	tool.onMouseUp = function(event) {
		dropPoint = editingText ? editingText.position : event.point;

		// display panel
		if(!textPanel) {
			textPanel = $("#textPanel").find('.save').click(function() {
				var content = textPanel.find("textarea").val();
				var saveData = {
					"content": content,
					"x": dropPoint.x,
					"y": dropPoint.y
				};

				if(!editingText) {
					layerManager.activate(currentFont.id());
					editingText = new PointText(dropPoint);

					currentFont.setFont(editingText);

					editingText.name = currentMap.addObject(currentFont.id(), saveData);
				}
				else {
					currentMap.updateObject(currentFont.id(), editingText.name, saveData);
				}

				editingText.content = content;

				hidePanel();
			}).end().find('.cancel').click(function() {
				hidePanel();
			}).end();
		}

		var viewPosition = view.projectToView(dropPoint);

		if(editingText)
			textPanel.find("textarea").val(editingText.content);

		textPanel.css({
			"visibility": "visible",
			"top": viewPosition.y + "px",
			"left": viewPosition.x + "px"
		}).find("textarea").focus();
	};

	// on mouse down check to see if a text block has been hit
	tool.onMouseDown = function(event) {
		layerManager.activate(currentFont.id());

		var result = project.hitTest(event.point);

		if(result && result.item.constructor === PointText)
			editingText = result.item;
	};

	tool.onMouseMove = function(event) {
		target = cursor.update(event);
	};

	tool.activate = function(map) {
		currentMap = map;

		Tool.prototype.activate.call(this);
	};

	// start up and tear down
	tool.deactivate = function() {
		cursor.remove();
		hidePanel();
	};

	// public methods
	tool.font = function(font) {
		if(font)
			currentFont = font;

		return currentFont;
	};

	// add base font style methods
	var fonts = utils.theme.fonts();

	for(var i in fonts) {
		var t = fonts[i].id();

		tool[t] = (function(font) {
			return function() {
				return tool.font(font);
			};
		})(fonts[i]);
	}

	tool.largeheading();

	return tool;
})();