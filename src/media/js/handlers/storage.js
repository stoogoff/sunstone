
import { handlerCreator } from "./base";
import { local } from "../lib/local-store";
import { indexOfByProperty } from "../lib/list";
import { STORAGE_KEYS } from "../lib/config";
import { MAP_CREATE, MAP_EDIT, MAP_LOAD_COMPLETE } from "../lib/action-keys";


const STORAGE_ACTIONS = {};


const justCoreData = state => state.map(m => ({ name: m.name, id: m.id, url: m.url }));

const storeMapData = (state, payload) => {
	let stored = local.get(STORAGE_KEYS.MAP_LOCAL) || {};

	stored.created = justCoreData(state);
	stored.index = indexOfByProperty(state, "id", payload.id);

	local.set(STORAGE_KEYS.MAP_LOCAL, stored);

	return state;
};


// store map data in local storage
STORAGE_ACTIONS[MAP_EDIT] = storeMapData;
STORAGE_ACTIONS[MAP_CREATE] = storeMapData;
STORAGE_ACTIONS[MAP_LOAD_COMPLETE] = (state, payload) => {
	let stored = local.get(STORAGE_KEYS.MAP_LOCAL) || {};

	stored.viewed = justCoreData(state);

	local.set(STORAGE_KEYS.MAP_LOCAL, stored);

	return state;
};

// make default list based actions available
export default handlerCreator(STORAGE_ACTIONS);
