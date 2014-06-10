utils.SlidingPanel = function(panel, button) {
	var OPEN_CLASS = "fa-angle-double-left";
	var CLOSE_CLASS = "fa-angle-double-right";
	var OPEN_TITLE = "Expand";
	var CLOSE_TITLE = "Collapse";
	var target = Math.floor(panel.offset().left);

	var open = function() {
		button.removeClass(OPEN_CLASS).addClass(CLOSE_CLASS).attr("title", CLOSE_TITLE);

		panel.animate({
			right: 0
		});
	};

	var close = function() {
		// switch button classes
		button.removeClass(CLOSE_CLASS).addClass(OPEN_CLASS).attr("title", OPEN_TITLE);

		panel.animate({
			right: -panel.width() + button.width()
		});
	};

	button.click(function() {
		Math.floor(panel.offset().left) == target ? close() : open();
	});
};