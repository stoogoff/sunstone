
import { indexOfByProperty, findByProperty } from "../lib/list";

// basic handlers for creating, editing, deleting and moving items in a list

export const moveUpById = (state, id) => {
	let clone = [...state];
	let index = indexOfByProperty(clone, "id", id);
	let layer = clone.find(findByProperty("id", id));

	if(index > 0) {
		let current = clone[index - 1];

		clone[index - 1] = layer;
		clone[index] = current;

		return clone
	}

	return state;
}

export const moveDownById = (state, id) => {
	let clone = [...state];
	let index = indexOfByProperty(clone, "id", id);
	let layer = clone.find(findByProperty("id", id));

	if(index >= 0 && index < clone.length - 1) {
		let current = clone[index + 1];

		clone[index + 1] = layer;
		clone[index] = current;

		return clone;
	}

	return state;
}

export const create = (state, obj) => {
	// object already exists
	if(state.find(findByProperty("id", obj.id))) {
		return state;
	}

	return [...state, obj];
}

export const deleteById = (state, id) => {
	return state.filter(l => l.id != id);
}

export const editById = (state, edited) => {
	return state.map(obj => obj.id === edited.id ? {...obj, ...edited} : obj);
}

export const handlerCreator = (actions) => {
	return (state = [], action, payload) => {
		if(action in actions) {
			return actions[action](state, payload);
		}
		else {
			return state;
		}
	}
}
