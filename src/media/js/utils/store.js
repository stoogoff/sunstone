
// wrapper around any type of storage interface
utils.Storage = function(store) {
	this.set = function(key, value) {
		store.setItem(key, JSON.stringify(value));

		return this;
	};

	this.get = function(key) {
		return JSON.parse(store.getItem(key));
	};

	this.has = function(key) {
		return store.getItem(key) != null;
	};

	this.keys = function() {
		var keys = [];

		_.each(_.range(store.length), function(idx) {
		keys.push(store.key(idx));
		});

		return keys;
	};

	this.remove = function() {
		_.each(arguments, function(key) {
		store.removeItem(key);
	});

		return this;
	};

	this.clear = function() {
		store.clear();

		return this;
	};
};

// create a default wrapper around localStorage
utils.store = (function(_) {
	var noop = function() {};
	var empty = {
		setItem: noop,
		getItem: noop,
		key: noop,
		removeItem: noop,
		clear: noop
	};

	return new utils.Storage(window.localStorage || empty);
})();