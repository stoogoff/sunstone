
const LOGGING = {
	"images": 0,
	"app": 3
};


export const LOG = 1;
export const INFO = 2;
export const WARN = 4;
export const ERROR = 8;


const noop = () => {};


export default function getLogger(module) {
	let logger = {
		log: noop,
		info: noop,
		warn: noop,
		error: noop
	};

	if(module in LOGGING) {
		if(LOGGING[module] & LOG) {
			logger.log = (...args) => console.log(`${module}:`, ...args);
		}

		if(LOGGING[module] & INFO) {
			logger.info = (...args) => console.info(`${module}:`, ...args);
		}

		if(LOGGING[module] & WARN) {
			logger.warn = (...args) => console.warn(`${module}:`, ...args);
		}

		if(LOGGING[module] & ERROR) {
			logger.error = (...args) => console.error(`${module}:`, ...args);
		}
	}

	return logger;
};

// this needs to come from a config file somewhere
export const setLogLevel = (module, level) => {
	LOGGING[module] = level;
};
