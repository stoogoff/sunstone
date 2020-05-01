
import { handlerCreator } from "./base";
import { storage } from "../lib/firebase";
import { IMAGE_UPLOAD, IMAGE_LOAD, IMAGE_LOAD_COMPLETE, IMAGE_DELETE, NODE_DELETE_BY_IMAGE } from "../lib/action-keys";
import { after } from "../lib/timer";
import dispatcher from "../lib/dispatcher";
import getLogger from "../lib/logger";

const logger = getLogger("images");

const IMAGE_ACTIONS = {};

IMAGE_ACTIONS[IMAGE_UPLOAD] = (state, payload) => {
	logger.info("image upload", state, payload)

	const images = [];

	// upload image
	// save a reference to it in the map object
	const rootRef = storage.ref("images");
	const uploadComplete = after(payload.length, () => {
		logger.info(IMAGE_UPLOAD, "loadComplete, preparing for dispatch", images)
		dispatcher.dispatch(IMAGE_LOAD, images);
	});

	payload.forEach(item => {
		logger.info("creating ref at", item.file.name)

		item.path = item.map + "/" + item.file.name;

		const imageRef = rootRef.child(item.path);

		imageRef.put(item.file).then((snapshot) => {
			logger.info("uploaded file")
			logger.info(snapshot);

			images.push(snapshot.ref);

			uploadComplete();
		});

		/*const reader = new FileReader();

		reader.onload = (read) => {
			logger.info(read.target.result)

			const imageRef = rootRef.child(item.file.name);

			imageRef.put()
		};

		reader.readAsDataURL(item.file);*/
	});

	// return the current state, once the image has saved and retrieved its URL it will be added to state
	return state;
};


IMAGE_ACTIONS[IMAGE_LOAD] = (state, payload) => {
	logger.info(IMAGE_LOAD, payload.length, payload)

	const loadComplete = after(payload.length * 2, () => {
		logger.info(IMAGE_LOAD, "loadComplete, preparing for dispatch", images)
		dispatcher.dispatch(IMAGE_LOAD_COMPLETE, images);
	});
	const images = payload.map(image => {
		return {
			name: image.name,
			path: image.fullPath,
			url: null
		};
	});

	images.forEach(image => {
		storage.ref(image.path).getDownloadURL().then(url => {
			logger.info("got url", url)

			image.url = url;

			loadComplete();
		})

		storage.ref(image.path).getMetadata().then(metadata => {
			logger.log("got metadata", metadata);

			image.size = metadata.size;
			image.type = metadata.contentType;
			image.created = metadata.timeCreated;
			image.updated = metadata.updated;

			loadComplete();
		});
	});

	// don't update the state yet, let the load complete handler do it
	return state;
};



IMAGE_ACTIONS[IMAGE_LOAD_COMPLETE] = (state, payload) => {
	logger.info(IMAGE_LOAD_COMPLETE, "state", state);
	logger.info(IMAGE_LOAD_COMPLETE, "payload", payload);

	return [...state, ...payload];
};


IMAGE_ACTIONS[IMAGE_DELETE] = (state, payload) => {
	logger.info(IMAGE_DELETE, "state", state);
	logger.info(IMAGE_DELETE, "payload", payload);

	// delete the image from firebase storage
	storage.ref(payload.path).delete().then(() => {
		// image deleted, inform nodes to be deleted
		dispatcher.dispatch(NODE_DELETE_BY_IMAGE, payload.path);
	}).catch(error => {
		logger.error(error);
	});

	return state.filter(img => img.path != payload.path);
};


export default handlerCreator(IMAGE_ACTIONS);
