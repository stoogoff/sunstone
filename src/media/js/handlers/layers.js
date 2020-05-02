
import { create, editById, deleteById, handlerCreator } from "./base";
import { 
	LAYER_CREATE, LAYER_DELETE,
	LAYER_MOVE_UP, LAYER_MOVE_DOWN, LAYER_LOAD_COMPLETE,
	LAYER_SHOW, LAYER_HIDE, LAYER_ACTIVATE, LAYER_RENAME } from "../lib/action-keys";

import { createId, replaceId } from "../lib/utils";
import { findByProperty, sortByProperty } from "../lib/list";
import { STORAGE_KEYS, VISIBILITY } from "../lib/config";
import { database } from "../lib/firebase";
import paper from "paper/dist/paper-core";


// create a paper.Layer and attach it to the firebase layer
function createPaperLayer(layer) {
	// don't create the paper layer if one with the same _externalId already exists
	const existingLayer = paper.project && paper.project.layers ? paper.project.layers.find(findByProperty("_externalId", layer.id)) : null;

	if(existingLayer) {
		layer._layer = existingLayer;
	}
	else {
		layer._layer = new paper.Layer();
		layer._layer.name = layer.name;
		layer._layer._externalId = layer.id;
	}

	layer._layer.opacity = layer.visible ? VISIBILITY.SHOW : VISIBILITY.HIDDEN;
}


const LAYER_ACTIONS = {};



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
}



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

// creating a layer also saves it to firebase and create a paper layer
LAYER_ACTIONS[LAYER_CREATE] = (state, payload) => {
	// position the layer after other layers
	payload.sort = state.length;

	// save payload to firebase
	database.ref(replaceId(STORAGE_KEYS.LAYER, payload.map, payload.id)).set(payload);

	createPaperLayer(payload);

	return create(state, payload);
};

// activate the supplied layer and mark all the others as in active
LAYER_ACTIONS[LAYER_ACTIVATE] = (state, payload) => {
	return state.map(layer => {
		if(layer.id == payload) {
			layer._layer.activate();

			return {...layer, active: true};
		}

		return {...layer, active: false};
	});
}

// layers loaded from firebase, so they need to create paper layers as well
// override the current state (MAYBE better to add if new, edit if exists rather than completely wipe)
LAYER_ACTIONS[LAYER_LOAD_COMPLETE] = (state, payload) => {
	payload.forEach(base => createPaperLayer(base));

	let activated = payload.filter(layer => layer.active);

	// as we're loading layers, make sure one is active for drawing
	if(activated.length == 0 && payload.length > 0) {
		payload[0].active = true;
		payload[0]._layer.activate();
	}

	return payload;
};


export default handlerCreator(LAYER_ACTIONS);
