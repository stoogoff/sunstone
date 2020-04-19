
import { editById, deleteById, handlerCreator } from "./base";
import { STORAGE_KEYS } from "../lib/config";
import { sortByProperty } from "../lib/list";
import { local } from "../lib/local-store"
import dispatcher from "../lib/dispatcher";
import database from "../lib/firebase";
import { createId, replaceId, next } from "../lib/utils";
import {
	MAP_CREATE, MAP_EDIT, MAP_DELETE, MAP_LOAD,
	NODE_LOAD_COMPLETE, LAYER_LOAD_COMPLETE
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

		local.set(STORAGE_KEYS.MAP_LOCAL, map);

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

	createRef.set(payload);
	local.set(STORAGE_KEYS.MAP_LOCAL, payload);

	next(() => {
		dispatcher.dispatch(LAYER_LOAD_COMPLETE, []);
		dispatcher.dispatch(NODE_LOAD_COMPLETE, []);
	});

	return [...state, payload];
};

// load a map from firebase and notify once its complete
MAP_ACTIONS[MAP_LOAD] = (state, payload) => {
	// set up firebase to load map data from server
	// wait for the data to load
	let loadRef = database.ref(replaceId(STORAGE_KEYS.MAP_ID, payload.id));

	loadRef.once("value").then(snapshot => {
		let map = convertMapData(snapshot.val());

		dispatcher.dispatch(LAYER_LOAD_COMPLETE, map.layers);
		dispatcher.dispatch(NODE_LOAD_COMPLETE, map.nodes);
	});

	return [...state, payload];
};

// make default list based actions available
export default handlerCreator(MAP_ACTIONS);
