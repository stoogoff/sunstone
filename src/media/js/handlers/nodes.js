
import { handlerCreator } from "./base";
import { database } from "../lib/firebase";
import { STORAGE_KEYS } from "../lib/config";
import { NODE_CREATE, NODE_DELETE, NODE_LOAD_COMPLETE } from "../lib/action-keys";
import { replaceId } from "../lib/utils/";


const NODE_ACTIONS = {};

NODE_ACTIONS[NODE_CREATE] = (state, payload) => {
	database.ref(replaceId(STORAGE_KEYS.NODE, payload.map, payload.id)).set(payload);

	return [...state, payload];
};

NODE_ACTIONS[NODE_DELETE] = (state, payload) => {
	payload.ids.forEach(id => {
		database.ref(replaceId(STORAGE_KEYS.NODE, payload.map, id)).remove();
	});

	return state.filter(node => payload.ids.indexOf(node.id) == -1);
};

// a new map has loaded so set the node data as the current state (MAYBE better to add if new, edit if exists rather than completely wipe)
NODE_ACTIONS[NODE_LOAD_COMPLETE] = (state, payload) => {
	return payload;
};


// TODO edit node, node, move node

export default handlerCreator(NODE_ACTIONS);
