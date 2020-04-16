
import { createId, replaceId } from "./utils";
import { local } from "./local-store";
import { sortByProperty } from "./list";
import { DEFAULT_MAP, DEFAULT_LAYER, MAP_URL_LEN, STORAGE_KEYS, ACTION_KEYS } from "./config";
import dispatcher from "./dispatcher";
import Layer from "./layer";


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

			console.log("getting existing map from local storage", map)
		}
		// create a new map and save it to local storage and firebase
		else {
			let createRef = database.ref(STORAGE_KEYS.MAP_ROOT).push();

			map = {
				name: DEFAULT_MAP,
				id: createRef.key,
				url: window.location.href + "view.html#" + createRef.key
			};

			console.log("creating new map and saving", map)

			local.set(STORAGE_KEYS.MAP_LOCAL, map);

			createRef.set(map);
		}

		// wait for the data to load
		let loadRef = database.ref(replaceId(STORAGE_KEYS.MAP_ID, map.id));

		loadRef.once("value").then(snapshot => {
			console.log("loadRef got snapshot", snapshot.val())

			let data = convertMapData(snapshot.val());

			// create first layer if one doesn't exist
			// TODO this also needs to be saved to firebase
			if(data.layers.length == 0) {
				let layer = new Layer(DEFAULT_LAYER);

				data.layers.push(layer);

				mapper.addLayer(layer);
			}

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

			data.layers.forEach(l => l.public = true);

			dispatcher.dispatch(ACTION_KEYS.MAP_DATA, data);
		});
	},

	setMapName(name) {
		let map = local.get(STORAGE_KEYS.MAP_LOCAL);

		map.name = name;

		local.set(STORAGE_KEYS.MAP, map);

		let updates = {};

		updates[replaceId(STORAGE_KEYS.MAP_NAME, map.id)] = name;

		database.ref().update(updates);
	},

	deleteLayer(layer) {
		let map = local.get(STORAGE_KEYS.MAP_LOCAL);

		console.log("deleteLayer")
		console.log(map)
		console.log(replaceId(STORAGE_KEYS.MAP_LAYERS, map.id, layer.id))
		console.log(layer.payload())

		database.ref(replaceId(STORAGE_KEYS.MAP_LAYERS, map.id, layer.id)).remove();
	},

	addLayer(layer) {
		let map = local.get(STORAGE_KEYS.MAP_LOCAL);

		console.log("addLayer")
		console.log(map)
		console.log(replaceId(STORAGE_KEYS.MAP_LAYERS, map.id, layer.id))
		console.log(layer.payload())

		database.ref(replaceId(STORAGE_KEYS.MAP_LAYERS, map.id, layer.id)).set(layer.payload());
	},

	addNode(props) {
		let map = local.get(STORAGE_KEYS.MAP_LOCAL);

		console.log("addNode")
		console.log(map)
		console.log(replaceId(STORAGE_KEYS.MAP_NODES, map.id, props.id))
		console.log(props)

		database.ref(replaceId(STORAGE_KEYS.MAP_NODES, map.id, props.id)).set(props);
	}
}

export default mapper;
