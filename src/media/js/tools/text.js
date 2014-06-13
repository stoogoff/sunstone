text = (function() {
	var dropPoint, currentFont, textPanel;

	var tool = new Tool();

	var hidePanel = function() {
		if(!textPanel)
			return;

		textPanel.css({
			"top": "-300px",
			"visibility": "hidden"
		}).find("textarea").val("");
	}

	// mouse events
	tool.onMouseUp = function(event) {
		dropPoint = event.point;

		// TODO display panel
		if(!textPanel) {
			textPanel = $("#textPanel").find('.save').click(function() {
				var content = textPanel.find("textarea").val();
				var textItem = new PointText(dropPoint);

				currentFont.setFont(textItem);

				textItem.content = content;

				hidePanel();
			}).end().find('.cancel').click(function() {
				hidePanel();
			}).end();
		}

		var viewPosition = view.projectToView(event.point);

		textPanel.css({
			"visibility": "visible",
			"top": viewPosition.y + "px",
			"left": viewPosition.x + "px"
		}).find("textarea").focus();
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