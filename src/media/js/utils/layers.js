
// parent node, title, array of acceptable layer names
utils.LayersPanel = function(parent, title, layers) {
	var template = new utils.TemplateLoader('media/tpl/layers.html');

	// convert the supplied hash into lowercase:Titlecase based on the keys only
	function objectKeys(o) {
		return _.object(_.chain(o).keys().map(function(s) {
			return s.toLowerCase();
		}).value(), _.keys(o))
	};

	function lower(o) {
		return _.chain(o).keys().map(function(s) {
			return s.toLowerCase();
		}).value();
	};

	this.load = function(callback) {
		template.load(parent, {
			'title': title,
			'layers': objectKeys(layers)
		}, callback);
	};

	layerManager.addList(lower(layers));
};