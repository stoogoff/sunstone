
import { STORAGE_KEYS } from "../lib/config";
import { MAP_CREATE, MAP_EDIT, MAP_DELETE, MAP_LOAD, MAP_LOAD_COMPLETE } from "../lib/action-keys";
import { editById, deleteById, handlerCreator } from "./base";
import { local } from "../lib/local-store"
import dispatcher from "../lib/dispatcher";
import database from "../lib/firebase";
import { createId, replaceId } from "../lib/utils";
import { sortByProperty } from "../lib/list";



// convert firebase objects to lists
function convertMapData(map) {
	map.nodes = map.nodes ? Object.values(map.nodes) : [];
	map.layers = map.layers ? Object.values(map.layers) : [];

	map.layers.sort(sortByProperty("sort"));

	return map;
}


const MAP_ACTIONS = {};

MAP_ACTIONS[MAP_EDIT] = editById; // this also needs to save to firebase and local storage


MAP_ACTIONS[MAP_DELETE] = deleteById;

// create a map and save it to firebase
MAP_ACTIONS[MAP_CREATE] = (state, payload) => {
	console.log("creating a map and saving it to fb")
	let createRef = database.ref(STORAGE_KEYS.MAP_ROOT).push();

	payload.id = createRef.key;
	payload.url = window.location.href + "view.html#" + createRef.key;

	createRef.set(payload);
	local.set(STORAGE_KEYS.MAP_LOCAL, payload);

	return [...state, payload];
};

// load a map from firebase and notify once its complete
MAP_ACTIONS[MAP_LOAD] = (state, payload) => {
	console.log("loading a map from fb")
	console.log(payload)

	// set up firebase to load map data from server
	// wait for the data to load
	let loadRef = database.ref(replaceId(STORAGE_KEYS.MAP_ID, payload.id));

	loadRef.once("value").then(snapshot => {
		let map = convertMapData(snapshot.val());

		console.log("loadRef got snapshot", map)

//		dispatcher.dispatch(NODE_LOAD_COMPLETE, map.nodes);
//		dispatcher.dispatch(LAYER_LOAD_COMPLETE, map.layers);

//		delete map.layers;
//		delete map.nodes;

		dispatcher.dispatch(MAP_LOAD_COMPLETE, map);
	});

	return [...state, payload];
};


// make default list based actions available
export default handlerCreator(MAP_ACTIONS);
