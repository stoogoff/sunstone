
import { createId, replaceId } from "./utils";
import { local } from "./local-store";
import { DEFAULT_MAP, MAP_URL_LEN, STORAGE_KEYS, ACTION_KEYS } from "./config";
import dispatcher from "./dispatcher";


let database = firebase.database();


// load a default map, either by creating a new one or loading an existing one from local storage
const mapper = {
	// load a default map, either from local storage, or create a new map and save it there
	getCurrentMap() {
		let map;

		if(local.has(STORAGE_KEYS.MAP)) {
			map = local.get(STORAGE_KEYS.MAP);

			let ref = database.ref(replaceId(STORAGE_KEYS.MAP_ID, map.id));

			ref.once("value").then(snapshot => {
				let data = snapshot.val();

				dispatcher.dispatch(ACTION_KEYS.MAP_NODES, data.nodes ? Object.values(data.nodes) : []);
			});
		}
		else {
			let id = createId(MAP_URL_LEN);

			map = {
				name: DEFAULT_MAP,
				id: id,
				url: window.location.href + "#" + id
			};

			local.set(STORAGE_KEYS.MAP, map);

			let updates = {};

			updates[replaceId(STORAGE_KEYS.MAP_DATA, map.id)] = map; 

			database.ref().update(updates);

			dispatcher.dispatch(ACTION_KEYS.MAP_DATA, []);
		}

		return map;
	},

	getMap(id) {
		let ref = database.ref(replaceId(STORAGE_KEYS.MAP_ID, id));

		ref.on("value", snapshot => {
			let data = snapshot.val();

			data.nodes = data.nodes ? Object.values(data.nodes) : [];

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

	addNode(props) {
		let map = local.get(STORAGE_KEYS.MAP);

		database.ref(replaceId(STORAGE_KEYS.MAP_NODES, map.id, props.id)).set(props);
	}
}

export default mapper;
