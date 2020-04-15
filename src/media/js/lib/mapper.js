
import { createId } from "./utils";
import { local } from "./local-store";
import { DEFAULT_MAP, MAP_URL_LEN, STORAGE_KEYS } from "./config";


// load a default map, either by creating a new one or loading an existing one from local storage
const mapper = {
	// load a default map, either from local storage, or create a new map and save it there
	getCurrentMap() {
		let map;

		if(local.has(STORAGE_KEYS.MAP)) {
			map = local.get(STORAGE_KEYS.MAP);
		}
		else {
			let id = createId(MAP_URL_LEN);

			map = {
				name: DEFAULT_MAP,
				id: id,
				url: window.location.href + "#" + id
			};

			local.set(STORAGE_KEYS.MAP, map);
		}

		return map;
	},

	setMapName(name) {
		let map = local.get(STORAGE_KEYS.MAP);

		map.name = name;

		local.set(STORAGE_KEYS.MAP, map);
	},

	addNode(props) {
		let map = this.getCurrentMap();

		map.nodes = map.nodes || [];
		map.nodes.push(props);

		local.set(STORAGE_KEYS.MAP, map);
	}
}

export default mapper;
