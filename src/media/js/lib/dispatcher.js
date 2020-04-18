
// simple event dispatcher
let state = {};
let handlers = {};
let subscribers = {};
let ref = 0;

const dispatcher = {
	// register a handler for a key in the data set
	register(key, callback) {
		if(!(key in handlers)) {
			handlers[key] = {};
		}

		handlers[key][++ref] = callback;

		return ref;
	},

	// remove a handler from
	unregister(key, ref) {
		if(!handlers[key]) {
			return false;
		}

		delete handlers[key][ref];

		return true;
	},

	// dispatch an action and payload to the relevent handlers
	dispatch(action, payload) {
		let newState = {...state};

		Object.keys(handlers).forEach(key => {
			Object.values(handlers[key]).forEach(handler => {
				newState[key] = handler(newState[key], action, payload)
			});
		});

		state = newState;

		Object.values(subscribers).forEach(callback => callback(action, state));
	},

	// subscribe to all updates OR a specific action update
	subscribe(callback, action) {
		subscribers[++ref] = callback;

		return ref;
	},

	// remove a subscriber
	unsubscribe(ref) {
		delete subscribers[ref];
	}
};

export default dispatcher;
