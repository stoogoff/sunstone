
import { create, editById, deleteById, handlerCreator } from "./base";
import { 
	LAYER_CREATE, LAYER_DELETE,
	LAYER_MOVE_UP, LAYER_MOVE_DOWN, LAYER_LOAD_COMPLETE,
	LAYER_SHOW, LAYER_HIDE, LAYER_ACTIVATE, LAYER_RENAME } from "../lib/action-keys";

import { createId, replaceId } from "../lib/utils";
import { findByProperty, sortByProperty } from "../lib/list";
import { STORAGE_KEYS, VISIBILITY } from "../lib/config";
import { database } from "../lib/firebase";


// move a layer up or down and reorder the underlying paper layers
const moveLayer = (state, payload, sort) => {
	let clone = [...state];

	if(sort != payload.sort) {
		const movingLayer = clone.find(findByProperty("sort", sort));

		if(movingLayer) {
			movingLayer.sort = payload.sort;

			clone = editById(clone, movingLayer);

			database.ref(replaceId(STORAGE_KEYS.LAYER_SORT, movingLayer.map, movingLayer.id)).set(movingLayer.sort);
		}

		payload.sort = sort;

		database.ref(replaceId(STORAGE_KEYS.LAYER_SORT, payload.map, payload.id)).set(sort);
	}

	clone = editById(clone, payload).sort(sortByProperty("sort"));
	clone.forEach(layer => layer._layer.bringToFront());

	return clone;
};


const LAYER_ACTIONS = {};

LAYER_ACTIONS[LAYER_MOVE_UP] = (state, payload) => {
	return moveLayer(state, payload, Math.max(0, payload.sort - 1));
};

LAYER_ACTIONS[LAYER_MOVE_DOWN] = (state, payload) => {
	return moveLayer(state, payload, Math.min(state.length - 1, payload.sort + 1));
};

LAYER_ACTIONS[LAYER_RENAME] = (state, payload) => {
	database.ref(replaceId(STORAGE_KEYS.LAYER_NAME, payload.map, payload.id)).set(payload.name);

	return editById(state, payload);
};

LAYER_ACTIONS[LAYER_DELETE] = (state, payload) => {
	database.ref(replaceId(STORAGE_KEYS.LAYER, payload.map, payload.id)).remove();

	return deleteById(state, payload.id);
};

LAYER_ACTIONS[LAYER_HIDE] = (state, id) => {
	return state.map(layer => {
		if(layer.id != id) {
			return layer;
		}

		let copied = {...layer, visible: false};

		copied._layer.opacity = VISIBILITY.HIDDEN;

		database.ref(replaceId(STORAGE_KEYS.LAYER_VISIBLE, copied.map, copied.id)).set(false);

		return copied;
	});
};

LAYER_ACTIONS[LAYER_SHOW] = (state, id) => {
	return state.map(layer => {
		if(layer.id != id) {
			return layer;
		}

		let copied = {...layer, visible: true};

		copied._layer.opacity = VISIBILITY.VISIBLE;

		database.ref(replaceId(STORAGE_KEYS.LAYER_VISIBLE, copied.map, copied.id)).set(true);

		return copied;
	});
};

// creating a layer saves it to firebase
LAYER_ACTIONS[LAYER_CREATE] = (state, payload) => {
	// position the layer after other layers
	payload.sort = state.length;

	// save payload to firebase
	database.ref(replaceId(STORAGE_KEYS.LAYER, payload.map, payload.id)).set(payload);

	return create(state, payload);
};

// activate the supplied layer and mark all the others as in active
LAYER_ACTIONS[LAYER_ACTIVATE] = (state, payload) => {
	const newState = state.map(layer => {
		if(layer.id == payload) {
			layer._layer.activate();

			return {...layer, active: true};
		}

		return {...layer, active: false};
	});

	newState.forEach(layer => database.ref(replaceId(STORAGE_KEYS.LAYER_ACTIVE, layer.map, layer.id)).set(layer.active));

	return newState;
}

// layers loaded from firebase, so override the existing layer state
LAYER_ACTIONS[LAYER_LOAD_COMPLETE] = (state, payload) => {
	return payload;
};


export default handlerCreator(LAYER_ACTIONS);
