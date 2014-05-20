utils.theme = (function() {
	// TODO - load everything from JSON files
	var tool = {};

	tool.terrain = function() {
		return {
			"Sand": "#C9AE7F",
			"Earth": "#604310",
			"Water": "#273A63",
			"Grass": "#1B510D",
			"Ice": "#C4E4EB"
		};
	};

	tool.background = function() {

	};

	tool.features = function() {
		return {
			"Mountain": "img/path",
			"Hill": "img/path",
			"Tree": "img/path",
			"Town": "img/path",
			"City": "img/path",
			"Castle": "img/path",
		};
	};

	return tool;
})();