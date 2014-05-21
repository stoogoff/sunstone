utils.TemplateLoader = function(template) {
	// load up the template and convert the 
	var getTemplate = function(callback) {
		// load template from store or source
		if(utils.store && utils.store.has(template)) {
			callback(Handlebars.compile(utils.store.get(template)));
		}
		else {
			$.get(template, function(source) {
				if(utils.store)
					utils.store.set(template, source);

				callback(Handlebars.compile(source));
			});
		}
	}

	// load the template and append to the supplied node
	this.load = function(dom, model, callback) {
		getTemplate(function(handlebars) {
			dom.append(handlebars(model));

			if(callback)
				callback();
		});
	};

	// load the template and return the resulting HTML
	this.compile = function(model, callback) {
		getTemplate(function(handlebars) {
			if(callback)
				callback(handlebars(model));
		});
	};
};