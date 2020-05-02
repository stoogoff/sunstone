
import { indexOfByProperty, findByProperty } from "../lib/list";

// basic handlers for creating, editing and deleting  items in a list
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
