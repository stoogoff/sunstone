
import React from "react";
import ReactDOM from "react-dom";

// components
import Modal from "./components/modal.jsx";
import Editor from "./components/editor.jsx";

// various utils
import dispatcher from "./lib/dispatcher";
import { local } from "./lib/local-store";
import { MODE, STORAGE_KEYS, DEFAULT_MAP, DEFAULT_LAYER } from "./lib/config";

import { MAP_CREATE, MAP_LOAD, NODE_LOAD_COMPLETE, LAYER_LOAD_COMPLETE, LAYER_CREATE } from "./lib/action-keys";

import { createId } from "./lib/utils";

import mapHandler from "./handlers/maps";
import layerHandler from "./handlers/layers";
import nodeHandler from "./handlers/nodes";

import getLogger from "./lib/logger";

// TODO there should be a facility for creating a new ID
// TODO there should be a facility to ensure created map ids don't clash - so there needs to be a user prefix or something
// TODO facility for multiple maps


const logger = getLogger("app");


class App extends React.Component {
	constructor(props) {
		super(props);

		// load the default map
		this.state = {
			map: null,
			layers: null,
			nodes: null
		};

		this.ref;
	}

	componentDidMount() {
		this.ref = dispatcher.subscribe((action, state) => {
			logger.log("subscribe", action);
			logger.log(state);

			// it would be great if this could just update the component state with the provided state and do nothig else

			// if layers have loaded and the array is empty, create a new one
			// otherwise, loading is complete and state should be set
			if(action == LAYER_LOAD_COMPLETE && state.layers.length == 0) {
				if(state.layers.length == 0) {
					logger.log("componentDidMount: no layers, creating empty layer")
					dispatcher.dispatch(LAYER_CREATE, {
						id: createId(),
						name: DEFAULT_LAYER,
						map: this.state.map.id,
						visible: true
					});
				}
			}
			else {
				this.setState({
					map: state.maps ? state.maps[0] : null,
					nodes: state.nodes,
					layers: state.layers
				});
			}
		});

		dispatcher.register("maps", mapHandler);
		dispatcher.register("layers", layerHandler);
		dispatcher.register("nodes", nodeHandler);
		/*dispatcher.register("mapIndex", (state = -1, action, payload) => {
			if(action == MAP_SELECT) {
				logger.log("selecting map", payload)
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
			logger.log("a map exists in local storage")
			//dispatcher.dispatch(MAP_SELECT, 0);
			logger.log("from store", local.get(STORAGE_KEYS.MAP_LOCAL))
			dispatcher.dispatch(MAP_LOAD, local.get(STORAGE_KEYS.MAP_LOCAL));
		}
		else {
			logger.log("no stored map so creating a new one")
			dispatcher.dispatch(MAP_CREATE, {
				name: DEFAULT_MAP
			});
		}
	}

	componentWillUnmount() {
		if(this.ref) {
			dispatcher.unsubscribe(this.ref);
		}
	}

	render() {
		logger.log("App.render")
		logger.log("map", this.state.map)
		logger.log("layers", this.state.layers)
		logger.log("nodes", this.state.nodes)

		let mapName = this.state.map ? this.state.map.name : null;
		let dialogueIsActive = this.state.layers == null || this.state.layers.length == 0;

		return <div>
			<Editor map={ this.state.map } nodes={ this.state.nodes } layers={ this.state.layers } mode={ MODE.EDIT } />
			<Modal title="Loading map" active={ dialogueIsActive }>
				<progress class="progress is-small is-warning" max="100"></progress>
				{ mapName ? <p>Loading map data for <strong>{ mapName }</strong>.</p> : <p>Loading map data.</p>}
			</Modal>
		</div>;
	}
}


ReactDOM.render(
	<App />,
	document.getElementById("container")
);
