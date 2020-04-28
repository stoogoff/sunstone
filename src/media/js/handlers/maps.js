
import { create, editById, deleteById, handlerCreator } from "./base";
import { STORAGE_KEYS } from "../lib/config";
import { sortByProperty } from "../lib/list";
import dispatcher from "../lib/dispatcher";
import { database, storage } from "../lib/firebase";
import { createId, replaceId } from "../lib/utils";
import { next } from "../lib/timer";
import {
	MAP_CREATE, MAP_EDIT, MAP_DELETE, MAP_LOAD, MAP_LOAD_COMPLETE, MAP_SUBSCRIBE, MAP_UNSUBSCRIBE,
	NODE_LOAD_COMPLETE, LAYER_LOAD_COMPLETE, IMAGE_LOAD, IMAGE_LOAD_COMPLETE
} from "../lib/action-keys";



// convert firebase objects to lists
function convertMapData(map) {
	map.nodes = map.nodes ? Object.values(map.nodes) : [];
	map.layers = map.layers ? Object.values(map.layers) : [];

	map.layers.sort(sortByProperty("sort"));

	return map;
}


const MAP_ACTIONS = {};

MAP_ACTIONS[MAP_EDIT] = (state, payload) => {
	let maps = editById(state, payload);

	maps.forEach(map => {
		if(map.id != payload.id) {
			return;
		}

		let updates = {};

		updates[replaceId(STORAGE_KEYS.MAP_NAME, map.id)] = map.name;

		database.ref().update(updates);
	});

	return maps;
};

MAP_ACTIONS[MAP_DELETE] = deleteById; // TODO deleting a map needs to update firebase, but there's no UI support for this uet

// create a map and save it to firebase
MAP_ACTIONS[MAP_CREATE] = (state, payload) => {
	let createRef = database.ref(STORAGE_KEYS.MAP_ROOT).push();

	payload.id = createRef.key;
	payload.url = window.location.href + "view.html#" + createRef.key;
	payload.nodes = [];
	payload.layers = [];

	createRef.set(payload);

	next(() => {
		dispatcher.dispatch(MAP_LOAD_COMPLETE, payload);
		dispatcher.dispatch(IMAGE_LOAD_COMPLETE, []);
	});

	return [...state, payload];
};

// load a map from firebase and notify once its complete
MAP_ACTIONS[MAP_LOAD] = (state, payload) => {
	// set up firebase to load map data from server
	// wait for the data to load
	let loadRef = database.ref(replaceId(STORAGE_KEYS.MAP_ID, payload.id));
	let imagesRef = storage.ref(replaceId(STORAGE_KEYS.MAP_IMAGES, payload.id))

	loadRef.once("value").then(snapshot => {
		let map = convertMapData(snapshot.val());

		dispatcher.dispatch(MAP_LOAD_COMPLETE, map);
	});

	imagesRef.listAll().then(response => {
		dispatcher.dispatch(IMAGE_LOAD, response.items);
	});

	return editById(state, payload);
};

MAP_ACTIONS[MAP_LOAD_COMPLETE] = (state, payload) => {
	next(() => {
		dispatcher.dispatch(LAYER_LOAD_COMPLETE, payload.layers);
		dispatcher.dispatch(NODE_LOAD_COMPLETE, payload.nodes);
	});

	return editById(state, payload);
};

MAP_ACTIONS[MAP_SUBSCRIBE] = (state, payload) => {
	// set up firebase to load map data from server
	// wait for the data to load
	let loadRef = database.ref(replaceId(STORAGE_KEYS.MAP_ID, payload));
	let imagesRef = storage.ref(replaceId(STORAGE_KEYS.MAP_IMAGES, payload))

	loadRef.on("value", snapshot => {
		let map = convertMapData(snapshot.val());

		dispatcher.dispatch(MAP_LOAD_COMPLETE, map);
	});

	imagesRef.listAll().then(response => {
		dispatcher.dispatch(IMAGE_LOAD, response.items);
	});

	return create(state, { id: payload });
};


// make default list based actions available
export default handlerCreator(MAP_ACTIONS);
