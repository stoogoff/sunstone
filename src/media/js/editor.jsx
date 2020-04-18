
import React from "react";
import ReactDOM from "react-dom";

// react toolbox componemts
import Dialog from 'react-toolbox/lib/dialog';
import ProgressBar from 'react-toolbox/lib/progress_bar';

// base component
import Editor from "./components/editor.jsx";

// various utils
import dispatcher from "./lib/dispatcher";
import { local } from "./lib/local-store";
import { MODE } from "./lib/config";
//import mapper from "./lib/mapper";
import { STORAGE_KEYS, DEFAULT_MAP } from "./lib/config";

import { MAP_CREATE, MAP_LOAD, MAP_SELECT } from "./lib/action-keys";

import mapHandler from "./handlers/maps";
import layerHandler from "./handlers/layers";


// TODO there should be a facility for creating a new ID
// TODO there should be a facility to ensure created map ids don't clash - so there needs to be a user prefix or something
// TODO facility for multiple maps

/*
let database = firebase.database();

let firebaseHandler = (state = [], action, payload) => {
	if(action == MAP_CREATE) {
		console.log("creating a map and saving it to fb")
		let createRef = database.ref(STORAGE_KEYS.MAP_ROOT).push();

		payload.id = createRef.key;
		payload.url = window.location.href + "view.html#" + createRef.key;

		createRef.set(payload);
		local.set(STORAGE_KEYS.MAP_LOCAL, payload);
	}
	else if(action == MAP_LOAD) {
		console.log("loading a map from fb")
		console.log(payload)

		// set up firebase to load map data from server

		return [...state, payload];
	}

	return state;
};*/



class App extends React.Component {
	constructor(props) {
		super(props);

		// load the default map
		this.state = {
			//localMap: mapper.loadCurrentMap(),
			//realMap: null
			map: null,
			layers: null,
			nodes: null
		};

		this.ref;
	}

	componentDidMount() {
		this.ref = dispatcher.subscribe((action, state) => {
			console.log(action)
			console.log(state)

			if(state.maps && state.maps.length) {
				this.setState({
					map: state.maps[0]
				});
			}

		});

		//dispatcher.register("maps", firebaseHandler);
		dispatcher.register("maps", mapHandler);
		dispatcher.register("layers", layerHandler);
		/*dispatcher.register("mapIndex", (state = -1, action, payload) => {
			if(action == MAP_SELECT) {
				console.log("selecting map", payload)
				return payload;
			}
		})*/

/*

process when first visiting

- create default map (MAP_CREATE name: Default Map)
- send data to firebase (How?)
	- firebase returns with a unique map id
- MAP_SELECT is called
- save to local

second visit

- load map from local storage
- get the full data from firebase

*/


		// if there is a map in the local store, select it
		if(local.has(STORAGE_KEYS.MAP_LOCAL)) {
			console.log("a map exists in local storage")
			//dispatcher.dispatch(MAP_SELECT, 0);
			console.log("from store", local.get(STORAGE_KEYS.MAP_LOCAL))
			dispatcher.dispatch(MAP_LOAD, local.get(STORAGE_KEYS.MAP_LOCAL));
		}
		else {
			dispatcher.dispatch(MAP_CREATE, {
				name: DEFAULT_MAP
			});
		}

		// otherwise create a new one

		/*this.registered[ACTION_KEYS.MAP_NAME_SET] = dispatcher.register(ACTION_KEYS.MAP_NAME_SET, name => {
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
		});*/
	}

	componentWillUnmount() {
		if(this.ref) {
			dispatcher.unsubscribe(this.ref);
		}
	}

	render() {
		let map = this.state.map;

		console.log("App.render")
		console.log("map", map)
		console.log("realMap?", map === this.state.realMap)
		console.log("localMap?", map === this.state.localMap)


		let mapName = map ? map.name : null;
		let dialogueIsActive = this.state.map ? !!this.state.map.layers : false;
console.log("dialogueIsActive", dialogueIsActive)
		return <div>
			<Editor map={ map } mode={ MODE.EDIT } />
			<Dialog title="Loading map" active={ dialogueIsActive }>
				<ProgressBar type="linear" mode="indeterminate" />
				{ mapName ? <p>Loading map data for <strong>{ mapName }</strong>.</p> : <p>Loading map data.</p>}
			</Dialog>
		</div>;
	}
}


ReactDOM.render(
	<App />,
	document.getElementById("container")
);

/*



// "redux" example code

import { local } from "./lib/local-store"
import dispatcher from "./lib/dispatcher";
import layers from "./handlers/layers";
import maps from "./handlers/maps";
import { create, deleteById, editById } from "./handlers/base";
import {
	MAP_CREATE, MAP_EDIT, MAP_DELETE,
	LAYER_CREATE, LAYER_EDIT, LAYER_DELETE, LAYER_MOVE_UP, LAYER_MOVE_DOWN
} from "./lib/action-keys";

// custom functionality, with inline action keys and a counter handler
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";

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

function counterReset(state = 0, action) {
	switch(action) {
		case RESET:
			return 0;

		default:
			return state
	}
}


// register handler functions
dispatcher.register("layers", layers);
//dispatcher.register("counter", counter);
//let counterRef = dispatcher.register("counter", counterReset);



// the problem with this is order of registration matters...

dispatcher.register("maps", maps);
//dispatcher.register("maps", mapLocal); // this should be solely a consequence of the map being created





// subscribe to all updates
let myRef = dispatcher.subscribe((action, state) => console.log(`state: (${action})`, state));

console.log("Got ref", myRef)



dispatcher.dispatch(MAP_CREATE, { name: "New Map 1", id: 1})
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(MAP_CREATE, { name: "New Map 2", id: 1})
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(DECREMENT);
dispatcher.dispatch(MAP_CREATE, { name: "New Map 2", id: 2})
//dispatcher.dispatch(MAP_CREATE, { name: "New Map 2", id: 2})
//dispatcher.dispatch(MAP_EDIT, { name: "Updated Map 2", id: 2})
//dispatcher.dispatch(MAP_DELETE, 2)




/*

dispatcher.dispatch(RESET);
dispatcher.dispatch(DECREMENT);
dispatcher.dispatch(DECREMENT);

console.log("unregister counter reset")
dispatcher.unregister("counter", counterRef);

dispatcher.dispatch(RESET);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(RESET);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(RESET);
dispatcher.dispatch(INCREMENT);






// dispatch some events
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(LAYER_CREATE, {
	name: "Layer 1",
	id: 1
});

dispatcher.dispatch(LAYER_CREATE, {
	name: "Layer 2",
	id: 2
});

dispatcher.dispatch(LAYER_CREATE, {
	name: "Shouldn't Work",
	id: 2
});

dispatcher.dispatch(LAYER_CREATE, {
	name: "Layer 3",
	id: 3
});
dispatcher.dispatch(LAYER_EDIT, {
	name: "New Layer Name",
	id: 2
});
//dispatcher.dispatch(DECREMENT);
dispatcher.dispatch(LAYER_MOVE_UP, 2);

// unsubscribe from updates
//dispatcher.unsubscribe(myRef);

dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);

dispatcher.dispatch(LAYER_DELETE, 2);*/
