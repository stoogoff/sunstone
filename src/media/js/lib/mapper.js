
import { createId, replaceId } from "./utils";
import { local } from "./local-store";
import { sortByProperty } from "./list";
import { DEFAULT_MAP, MAP_URL_LEN, STORAGE_KEYS, ACTION_KEYS } from "./config";
import dispatcher from "./dispatcher";


let database = firebase.database();

// convert firebase objects to lists
function convertMapData(map) {
	map.nodes = map.nodes ? Object.values(map.nodes) : [];
	map.layers = map.layers ? Object.values(map.layers) : [];

	map.layers.sort(sortByProperty("sort"));

	return map;
}


// load a default map, either by creating a new one or loading an existing one from local storage
const mapper = {
	// load a default map, either from local storage, or create a new map and save it there
	loadCurrentMap() {
		let map;

		// get existing map details from local storage and from firebase
		if(local.has(STORAGE_KEYS.MAP_LOCAL)) {
			map = local.get(STORAGE_KEYS.MAP_LOCAL);
		}
		// create a new map and save it to local storage and firebase
		else {
			let createRef = database.ref(STORAGE_KEYS.MAP_ROOT).push();

			map = {
				name: DEFAULT_MAP,
				id: createRef.key,
				url: window.location.href + "view.html#" + createRef.key
			};

			local.set(STORAGE_KEYS.MAP_LOCAL, map);

			createRef.set(map);
		}

		// wait for the data to load
		let loadRef = database.ref(replaceId(STORAGE_KEYS.MAP_ID, map.id));

		loadRef.once("value").then(snapshot => {
			let data = convertMapData(snapshot.val());

			dispatcher.dispatch(ACTION_KEYS.MAP_DATA, data);
		});

		// return whatever info is availble now
		return map;
	},

	// get a publicly visibly map and watch it for changes
	getPublicMap(id) {
		let ref = database.ref(replaceId(STORAGE_KEYS.MAP_ID, id));

		ref.on("value", snapshot => {
			let data = convertMapData(snapshot.val());

			dispatcher.dispatch(ACTION_KEYS.MAP_DATA, data);
		});
	},

	setMapName(name) {
		let map = local.get(STORAGE_KEYS.MAP);

		map.name = name;

		local.set(STORAGE_KEYS.MAP, map);

		let updates = {};

		updates[replaceId(STORAGE_KEYS.MAP_NAME, map.id)] = name;

		database.ref().update(updates);
	},

	addLayer(layer) {
		let map = local.get(STORAGE_KEYS.MAP);

		database.ref(replaceId(STORAGE_KEYS.MAP_LAYERS, map.id, layer.id)).set(layer);
	},

	addNode(props) {
		let map = local.get(STORAGE_KEYS.MAP);

		database.ref(replaceId(STORAGE_KEYS.MAP_NODES, map.id, props.id)).set(props);
	}
}

export default mapper;
