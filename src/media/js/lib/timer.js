
export const throttle = (callback, cutoff) => {
	let t = null;

	return (value) => {
		if(t != null) {
			window.clearTimeout(t);
		}

		t = window.setTimeout(() => {
			callback(value);
		}, cutoff || 250);
	}
}

export const next = (callback) => {
	window.setTimeout(callback, 0);
}

export const after = (times, callback) => {
	return (...args) => {
		if(--times == 0) {
			callback(...args);
		}
	};
}
