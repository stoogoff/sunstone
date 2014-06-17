text = (function() {
	var dropPoint, currentFont, textPanel, editingText;
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
	tool.onMouseUp = function(event) {
		dropPoint = editingText ? editingText.position : event.point;

		// display panel
		if(!textPanel) {
			textPanel = $("#textPanel").find('.save').click(function() {
				var content = textPanel.find("textarea").val();

				if(!editingText) {
					editingText = new PointText(dropPoint);

					currentFont.setFont(editingText);
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

	tool.onMouseDown = function(event) {
		var result = project.activeLayer.hitTest(event.point);

		if(result && result.item.constructor === PointText)
			editingText = result.item;
	};

	// start up and tear down
	tool.activate = function() {
		layerManager.activate("text");

		Tool.prototype.activate.call(this);
	};

	tool.deactivate = hidePanel;

	// public methods
	tool.font = function(font) {
		if(font)
			currentFont = font;

		return font;
	};

	// add base font style methods
	var fonts = utils.theme.fonts();

	for(var i in fonts) {
		var t = i.toLowerCase().replace(' ', '');

		tool[t] = (function(font) {
			return function() {
				return tool.font(font);
			};
		})(fonts[i]);
	}

	tool.largeheading();

	return tool;
})();