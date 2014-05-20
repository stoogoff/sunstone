
background = (function() {
	var tool = {};
	var layer;

	tool.terrain = function(terrain, colour) {
		if(colour)
			document.getElementById('canvas').style.backgroundColor = colour;

		if(terrain)
			layer = terrain;

		return layer;
	};

	// add base terrain methods
	var terrains = utils.theme.terrain();

	for(var i in terrains) {
		tool[i.toLowerCase()] = (function(terrain, colour) {
			return function() {
				return tool.terrain(terrain, colour);
			};
		})(i, terrains[i]);
	}

	// set defaults
	tool.sand();

	return tool;
})();