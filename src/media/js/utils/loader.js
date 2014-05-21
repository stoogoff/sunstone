utils.TemplateLoader = (function() {
	function load(template, dom, model, callback) {
		var handlebars = '';
		var loaded = function() {
			dom.append(handlebars(model));

			if(callback)
				callback();
		};

		// load template from store or source
		if(utils.store && utils.store.has(template)) {
			handlebars = Handlebars.compile(utils.store.get(template));
			loaded();
		}
		else {
			$.get(template, function(source) {
				if(utils.store)
					utils.store.set(template, source);

				handlebars = Handlebars.compile(source);
				loaded();
			});
		}
	}

	return function(template) {
		this.template = template;
		this.load = function(dom, model, callback) {
			load(this.template, dom, model, callback);
		};
	};
})();