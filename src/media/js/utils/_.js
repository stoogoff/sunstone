var utils = {
	// shortcut function
	next: function(callback) {
		window.setTimeout(callback, 0);
	},

	toId: function(word) {
		return word.toLowerCase().replace(/\s{1,}/g, '');
	}
};