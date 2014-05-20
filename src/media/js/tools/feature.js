
feature = (function() {
	var tool = new Tool();

	// set the feature icon
	tool.feature = function(feature, image) {
		console.log(arguments)
	};

	var features = utils.theme.features();

	for(var i in features) {
		var t = i.toLowerCase();

		tool[t] = (function(feature, image) {
			return function() {
				return tool.feature(feature, image);
			};
		})(t, features[i]);
	}

	return tool;
})();