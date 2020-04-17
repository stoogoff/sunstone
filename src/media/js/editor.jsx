
/*
import React from "react";
import ReactDOM from "react-dom";

// react toolbox componemts
import Dialog from 'react-toolbox/lib/dialog';
import ProgressBar from 'react-toolbox/lib/progress_bar';

// base component
import Editor from "./components/editor.jsx";

// various utils
import dispatcher from "./lib/dispatcher";
import { ACTION_KEYS, MODE } from "./lib/config";
import mapper from "./lib/mapper";


// TODO there should be a facility for creating a new ID
// TODO there should be a facility to ensure created map ids don't clash - so there needs to be a user prefix or something
// TODO facility for multiple maps


class App extends React.Component {
	constructor(props) {
		super(props);

		// load the default map
		this.state = {
			localMap: mapper.loadCurrentMap(),
			realMap: null
		};

		this.registered = {};
	}

	componentDidMount() {
		this.registered[ACTION_KEYS.MAP_NAME_SET] = dispatcher.register(ACTION_KEYS.MAP_NAME_SET, name => {
			mapper.setMapName(name);
		});

		this.registered[ACTION_KEYS.NODE_SET] = dispatcher.register(ACTION_KEYS.NODE_SET, props => {
			mapper.addNode(props);
		});

		this.registered[ACTION_KEYS.LAYER_SET] = dispatcher.register(ACTION_KEYS.LAYER_SET, props => {
			mapper.addLayer(props);
		});

		this.registered[ACTION_KEYS.LAYER_DELETE] = dispatcher.register(ACTION_KEYS.LAYER_DELETE, props => {
			mapper.deleteLayer(props);
		});

		this.registered[ACTION_KEYS.MAP_NODES] = dispatcher.register(ACTION_KEYS.MAP_DATA, map => {
			this.setState({
				realMap: map
			});
		});
	}

	componentWillUnmount() {
		Object.keys(this.registered).forEach(k => dispatcher.unregister(k, this.registered[k]));
	}

	render() {
		let map = this.state.realMap ? this.state.realMap : this.state.localMap;

		console.log("App.render")
		console.log("map", map)
		console.log("realMap?", map === this.state.realMap)
		console.log("localMap?", map === this.state.localMap)


		return <div>
			<Editor map={ map } mode={ MODE.EDIT } />
			<Dialog title="Loading map" active={ this.state.realMap == null }>
				<ProgressBar type="linear" mode="indeterminate" />
				<p>Loading map data for <strong>{ this.state.localMap.name }</strong>.</p>
			</Dialog>
		</div>;
	}
}


ReactDOM.render(
	<App />,
	document.getElementById("container")
);




*/

//import { createStore } from "redux";

import dispatcher from "./lib/dispatcher";

import { moveUpById, moveDownById, add, removeById } from "./handlers/list";

/*function counter(state = 0, action) {
	switch(action.type) {
		case "INCREMENT":
			return state + 1;
		case "DECREMENT":
			return state - 1;
		default:
			return state;
	}
}
*/


// handlers




// action constants
const ACTION_KEYS = {
	LAYER_ADD: "layer-add",
	LAYER_REMOVE: "layer-remove",
	LAYER_MOVE_UP: "layer-move-up",
	LAYER_MOVE_DOWN: "layer-move-down",
	MAP_ADD: "map-add",
	MAP_REMOVE: "map-remove",
}

// action keys mapped to handlers
const LAYER_ACTIONS = {
	[ACTION_KEYS.LAYER_ADD]: add,
	[ACTION_KEYS.LAYER_REMOVE]: removeById,
	[ACTION_KEYS.LAYER_MOVE_UP]: moveUpById,
	[ACTION_KEYS.LAYER_MOVE_DOWN]: moveDownById
};

const MAP_ACTIONS = {
	[ACTION_KEYS.MAP_ADD]: add,
	[ACTION_KEYS.MAP_REMOVE]: removeById
};

console.log(MAP_ACTIONS)

// reducer functions, which are basically identical
// but could get more complicated with nested objects, so it's not always possible to pass payload directly
function layers(state = [], action, payload) {
	if(action in LAYER_ACTIONS) {
		return LAYER_ACTIONS[action](state, payload);
	}
	else {
		return state;
	}
}

function maps(state = [], action, payload) {
	if(action in MAP_ACTIONS) {
		return MAP_ACTIONS[action](state, payload);
	}
	else {
		return state;
	}
}


const INCREMENT = "inc";
const DECREMENT = "dec";

function counter(state = 0, action) {
	switch (action) {
		case INCREMENT:
			return state + 1;

		case DECREMENT:
			return state - 1;

		default:
			return state;
	}
}



//let store = createStore(layers);

//store.subscribe(() => console.log("state:", store.getState()))







// set up reducers

dispatcher.addHandler("layers", layers);
dispatcher.addHandler("maps", maps);
dispatcher.addHandler("counter", counter);

let myRef = dispatcher.subscribe(payload => console.log("state:", payload));


console.log("Got ref", myRef)

dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(ACTION_KEYS.LAYER_ADD, {
	name: "Layer 1",
	id: 1
});

dispatcher.dispatch(ACTION_KEYS.LAYER_ADD, {
	name: "Layer 2",
	id: 2
});

dispatcher.dispatch(ACTION_KEYS.LAYER_ADD, {
	name: "Layer 3",
	id: 3
});

dispatcher.dispatch(ACTION_KEYS.MAP_ADD, {
	name: "Map 1",
	nodes: [],
	id: 1
});

dispatcher.dispatch(ACTION_KEYS.MAP_ADD, {
	name: "Map 2",
	nodes: [],
	id: 2
});


dispatcher.dispatch(ACTION_KEYS.DECREMENT);
dispatcher.dispatch(ACTION_KEYS.LAYER_MOVE_UP, 2);

dispatcher.unsubscribe(myRef);

dispatcher.dispatch(ACTION_KEYS.LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(ACTION_KEYS.LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(ACTION_KEYS.LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(ACTION_KEYS.LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(ACTION_KEYS.LAYER_MOVE_DOWN, 2);

dispatcher.dispatch(ACTION_KEYS.LAYER_REMOVE, 2);
dispatcher.dispatch(ACTION_KEYS.MAP_REMOVE, 1);




/*
store.dispatch({
	type: ADD,
	layer: {
		name: "Layer 1",
		id: 1
	}
});

store.dispatch({
	type: ADD,
	layer: {
		name: "Layer 2",
		id: 2
	}
});

store.dispatch({
	type: ADD,
	layer: {
		name: "Layer 3",
		id: 3
	}
});

store.dispatch({
	type: MOVE_UP,
	id: 2
});

store.dispatch({
	type: MOVE_DOWN,
	id: 2
});

store.dispatch({
	type: MOVE_DOWN,
	id: 2
});

store.dispatch({
	type: MOVE_DOWN,
	id: 2
});

store.dispatch({
	type: MOVE_DOWN,
	id: 2
});

store.dispatch({
	type: MOVE_DOWN,
	id: 2
});

store.dispatch({
	type: REMOVE,
	id: 2
});
*/
