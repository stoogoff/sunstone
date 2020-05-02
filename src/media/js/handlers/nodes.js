
import { handlerCreator, editById } from "./base";
import { database } from "../lib/firebase";
import { STORAGE_KEYS } from "../lib/config";
import { NODE_CREATE, NODE_DELETE, NODE_LOAD_COMPLETE, NODE_DELETE_BY_IMAGE, NODE_MOVE } from "../lib/action-keys";
import { replaceId } from "../lib/utils/";


const NODE_ACTIONS = {};

NODE_ACTIONS[NODE_CREATE] = (state, payload) => {
	database.ref(replaceId(STORAGE_KEYS.NODE_ID, payload.map, payload.id)).set(payload);

	return [...state, payload];
};

NODE_ACTIONS[NODE_DELETE] = (state, payload) => {
	payload.ids.forEach(id => {
		database.ref(replaceId(STORAGE_KEYS.NODE_ID, payload.map, id)).remove();
	});

	return state.filter(node => payload.ids.indexOf(node.id) == -1);
};

// a new map has loaded so set the node data as the current state (MAYBE better to add if new, edit if exists rather than completely wipe)
NODE_ACTIONS[NODE_LOAD_COMPLETE] = (state, payload) => {
	return payload;
};

NODE_ACTIONS[NODE_DELETE_BY_IMAGE] = (state, payload) => {
	// TODO not all of the nodes are deleted from the drawing
	const nodesToDelete = state.filter(node => node.type == "Image" && node.image.path == payload);

	nodesToDelete.forEach(node => {
		database.ref(replaceId(STORAGE_KEYS.NODE_ID, node.map, node.id)).remove();
	});

	return state.filter(node => !(node.type == "Image" && node.image.path == payload));
};

NODE_ACTIONS[NODE_MOVE] = (state, payload) => {
	console.log("payload", payload)

	const position = {
		x: payload.position.x,
		y: payload.position.y
	};

	console.log("updated", { id: payload.id, position: position })

	// TODO this will only work for images at the moment
	database.ref(replaceId(STORAGE_KEYS.NODE_POSITION, payload.map, payload.id)).set(position);

	return editById(state, { id: payload.id, position: position });
};

// TODO edit node, node, move node

export default handlerCreator(NODE_ACTIONS);
