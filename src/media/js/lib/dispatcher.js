
// simple event dispatcher
let state = {};
let handler = {};
let subscribers = {};
let ref = 0;

const dispatcher = {
	addHandler(key, callback) {
		handler[key] = callback;
	},

	removeHandler(key) {
		delete handler[key];
	},

	dispatch(action, payload) {
		let newState = {};

		Object.keys(handler).forEach(key => {
			newState[key] = handler[key](state[key], action, payload);
		});

		state = newState;

		Object.values(subscribers).forEach(callback => callback(state));
	},

	subscribe(callback) {
		subscribers[++ref] = callback;

		return ref;
	},

	unsubscribe(ref) {
		delete subscribers[ref];
	}
};

export default dispatcher;
