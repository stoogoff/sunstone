
import { handlerCreator } from "./base";
import database from "../lib/firebase";
import { STORAGE_KEYS } from "../lib/config";
import { NODE_CREATE, NODE_LOAD_COMPLETE } from "../lib/action-keys";
import { replaceId } from "../lib/utils/";


const NODE_ACTIONS = {};

NODE_ACTIONS[NODE_CREATE] = (state, payload) => {
	database.ref(replaceId(STORAGE_KEYS.MAP_NODES, payload.map, payload.id)).set(payload);

	return [...state, payload];
};

// layers loaded from firebase, so they need to create paper layers as well
NODE_ACTIONS[NODE_LOAD_COMPLETE] = (state, payload) => {
	return [...state, ...payload];
};


// TODO edit node, delete node, move node

export default handlerCreator(NODE_ACTIONS);
