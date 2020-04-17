
import { indexOfByProperty, findByProperty } from "../lib/list";

// basic handlers for adding, removing and moving items in a list

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

export const add = (state, obj) => {
	return [...state, obj];
}

export const removeById = (state, id) => {
	return state.filter(l => l.id != id);
}
