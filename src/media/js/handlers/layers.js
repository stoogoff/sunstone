
import { create, editById, deleteById, moveUpById, moveDownById, handlerCreator } from "./base";
import { 
	LAYER_CREATE, LAYER_EDIT, LAYER_DELETE,
	LAYER_MOVE_UP, LAYER_MOVE_DOWN, LAYER_LOAD_COMPLETE,
	LAYER_SHOW, LAYER_HIDE, LAYER_ACTIVATE } from "../lib/action-keys";

import { createId, replaceId } from "../lib/utils/";
import { STORAGE_KEYS } from "../lib/config";
import database from "../lib/firebase";
import paper from "paper/dist/paper-core";


// create a paper.Layer and attach it to the firebase layer
function createPaperLayer(layer) {
	layer._layer = new paper.Layer();
	layer._layer.name = layer.name;
	layer._layer._externalId = layer.id;

	// TODO handle initial visibility
}


const LAYER_ACTIONS = {
	[LAYER_EDIT]: editById,
	[LAYER_DELETE]: deleteById,
	[LAYER_MOVE_UP]: moveUpById,
	[LAYER_MOVE_DOWN]: moveDownById
};


LAYER_ACTIONS[LAYER_HIDE] = (state, id) => {
	return state.map(layer => {
		if(layer.id != id) {
			return layer;
		}

		let copied = {...layer, visible: false};

		copied._layer.opacity = 0.3;

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

		copied._layer.opacity = 1;

		database.ref(replaceId(STORAGE_KEYS.LAYER_VISIBLE, copied.map, copied.id)).set(true);

		return copied;
	});
};

// creating a layer also saves it to firebase and create a paper layer
LAYER_ACTIONS[LAYER_CREATE] = (state, payload) => {
	// save payload to firebase
	database.ref(replaceId(STORAGE_KEYS.LAYER, payload.map, payload.id)).set(payload);

	createPaperLayer(payload);

	// TODO does paper activate a newly created layer by default?

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
LAYER_ACTIONS[LAYER_LOAD_COMPLETE] = (state, payload) => {
	payload.forEach(base => createPaperLayer(base));

	let layers = [...state, ...payload];
	let activated = layers.filter(layer => layer.active);

	// as we're loading layers, make sure one is active for drawing
	if(activated.length == 0) {
		layers[0].active = true;
		layers[0]._layer.activate();
	}

	return layers;
};


export default handlerCreator(LAYER_ACTIONS);
