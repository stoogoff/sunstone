utils.Publisher = function() {
	var events = {};

	/**
	 * Publish calls any functions which are mapped to the supplied string. All parameters after the first are passed to each
	 * function that is called.
	 *
	 * @param {string} event The name of the event to fire.
	 * @returns {bool} Returns true if an event is published, false otherwise.
	 */
	this.publish = function(event) {
		if(!events[event])
			return false;

		var evt = events[event];
		var args = _.rest(arguments);

		_.each(evt, function(func) {
			func.apply(null, args);
		});

		return true;
	};

	/**
	 * Link the supplied callback function to supplied event string.
	 *
	 * @param {string} event The name of the event to subscribe to.
	 * @param {function} callback The function to call whenever the event is published to.
	 * @returns {string} Returns a reference code which can be used to unsubscribe from the event.
	 */
	this.subscribe = function(event, callback) {
		if(!events[event])
			events[event] = {};

		var ref = _.uniqueId("nm_");

		events[event][ref] = callback;

		return ref;
	};

	/**
	 * Delete the referenced function from the event.
	 *
	 * @param {string} event The name of the event to remove from.
	 * @param {string} reference The reference code which was returned from the subscribe method.
	 * @returns {bool} Returns true if the event was successfully deleted.
	 */
	this.unsubscribe = function(event, reference) {
		if(!events[event])
			return false;

		delete events[event][reference];

		return true;
	};
};