
import { handlerCreator, editById } from "./base";
import { local } from "../lib/local-store";
import { findByProperty, indexOfByProperty } from "../lib/list";
import { STORAGE_KEYS } from "../lib/config";
import { MAP_CREATE, MAP_EDIT, MAP_LOAD_COMPLETE, MAP_ZOOM } from "../lib/action-keys";


/*

This needs to be separated out

created and viewed maps should be stored in separate storage keys
map zoom should be a separate key with an object in the form

[map-one-id]: zoom
[map-two-id]: zoom

the created / viewed storage split should be reflected in the state as well
with /app.jsx splitting that out rather than relying on storage to sort it out
this may all change with login

*/



const STORAGE_ACTIONS = {};
const VIEWED = "viewed";
const CREATED = "created";


const justCoreData = state => state.map(m => {
	return {
		name: m.name,
		id: m.id,
		url: m.url,
		zoom: m.zoom
	}
});

const storeMapData = (key, state, payload) => {
	let stored = local.get(STORAGE_KEYS.MAP_LOCAL) || {};

	stored[key] = justCoreData(state);
	stored.index = indexOfByProperty(state, "id", payload.id);

	local.set(STORAGE_KEYS.MAP_LOCAL, stored);

	return state;
};

const getMapById = (list, mapId) => list.find(findByProperty("id", mapId));


// store map data in local storage
STORAGE_ACTIONS[MAP_EDIT] = (state, payload) => storeMapData(CREATED, state, payload);
STORAGE_ACTIONS[MAP_CREATE] = (state, payload) => storeMapData(CREATED, state, payload);

// WIP
// both of these functions need to handle either created or viewed
STORAGE_ACTIONS[MAP_LOAD_COMPLETE] = (state, payload) => {
	//storeMapData(VIEWED, state, payload);
	return state;
};

// find the map either in the created or viewed key and update it
STORAGE_ACTIONS[MAP_ZOOM] = (state, payload) => {
	return state;
	/*let stored = local.get(STORAGE_KEYS.MAP_LOCAL) || {};
	let map = getMapById(stored[VIEWED] || [], payload.id);

	if(!map) {
		map = getMapById(STORED[CREATED] || [], payload.id)
	}


	return storeMapData("viewed", editById(state, payload), payload);*/
};


export default handlerCreator(STORAGE_ACTIONS);
