
import React from "react";
import ReactDOM from "react-dom";
//import { Router, Switch, Route, createBrowserHistory } from "react-router-dom";

// components
import Modal from "./components/modal.jsx";
import Editor from "./components/editor.jsx";
import Viewer from "./components/viewer.jsx";
import Home from "./components/home.jsx";

// various utils
import dispatcher from "./lib/dispatcher";
import { local } from "./lib/local-store";
import { MODE, STORAGE_KEYS, DEFAULT_MAP, DEFAULT_LAYER } from "./lib/config";

import { MAP_CREATE, MAP_ACTIVATE, MAP_LOAD, MAP_SUBSCRIBE, NODE_LOAD_COMPLETE, LAYER_LOAD_COMPLETE, LAYER_CREATE, USER_LOGIN_COMPLETE } from "./lib/action-keys";

import router from "./lib/history";
import { createId } from "./lib/utils";
import { indexOfByProperty } from "./lib/list";

import mapHandler from "./handlers/maps";
import storageHandler from "./handlers/storage";
import layerHandler from "./handlers/layers";
import nodeHandler from "./handlers/nodes";
import imageHandler from "./handlers/images";
//import userHandler from "./handlers/user";

import getLogger from "./lib/logger";

// TODO there should be a facility for creating a new ID
// TODO facility for multiple maps
// BUG changing tool recentres the image so panning, switch tool is a problem, this applies to view as well
// BUG drawing image doesn't place the image until you go to a new tool
//



const logger = getLogger("app");


class App extends React.Component {
	constructor(props) {
		super(props);

		// load the default map
		this.state = {
			maps: null,
			map: null,
			layers: null,
			nodes: null
		};

		this.ref;
	}

	componentDidMount() {
		this.ref = dispatcher.subscribe((action, state) => {
			logger.warn("subscribe", action);
			logger.log(state);

			// if layers have loaded and the array is empty, create a new one
			// otherwise, loading is complete and state should be set
			if(action == LAYER_LOAD_COMPLETE && state.layers.length == 0) {
				logger.log("componentDidMount: no layers, creating empty layer")
				dispatcher.dispatch(LAYER_CREATE, {
					id: createId(),
					name: DEFAULT_LAYER,
					map: this.state.map.id,
					visible: true,
					active: true
				});
			}
			/*else if(action == USER_LOGIN_COMPLETE) {
				// TODO switch route to create
				router.push("/create");
			}*/
			else {
				this.setState({
					maps: state.maps,
					map: state.maps ? state.maps[state.index] : null,
					nodes: state.nodes,
					layers: state.layers,
					images: state.images,
					user: state.user
				});
			}
		});

		dispatcher.register("maps", mapHandler);
		dispatcher.register("maps", storageHandler);
		dispatcher.register("layers", layerHandler);
		dispatcher.register("nodes", nodeHandler);
		dispatcher.register("images", imageHandler);
		//dispatcher.register("user", userHandler);


		dispatcher.register("index", (state = -1, action, payload, fullState) => {

			if(action == MAP_ACTIVATE) {
				logger.log("STATE", state)
				logger.log("FULL STATE", fullState)
				logger.log(action, payload)

				const newIndex = indexOfByProperty(fullState.maps, "id", payload);

				// TODO load the map
				if(newIndex > -1 && newIndex != state) {
					let stored = local.get(STORAGE_KEYS.MAP_LOCAL) || {};

					stored.index = newIndex;

					local.set(STORAGE_KEYS.MAP_LOCAL, stored);

					return newIndex;
				}

				return state;
			}

			return state;
		});

		//dispatcher.hydrate("user", {});

		// viewing a map instead of editing
		if(__MODE__ == MODE.VIEW) {
			const mapId = window.location.hash.substring(1);

			if(local.has(STORAGE_KEYS.MAP_LOCAL)) {
				const storedData = local.get(STORAGE_KEYS.MAP_LOCAL);
				const index = indexOfByProperty(storedData.viewed || [], "id", mapId);

				dispatcher.hydrate("index", index > -1 ? index : 0);
				dispatcher.hydrate("maps", storedData.viewed);
			}
			else {
				dispatcher.hydrate("index", 0);
			}

			dispatcher.dispatch(MAP_SUBSCRIBE, mapId);
		}
		else if(local.has(STORAGE_KEYS.MAP_LOCAL)) {
			// if there is a map in the local store, select it
			const storedData = local.get(STORAGE_KEYS.MAP_LOCAL);
			const storedMap = storedData.created[storedData.index];

			// fill initial state with data from local
			dispatcher.hydrate("index", storedData.index);
			dispatcher.hydrate("maps", storedData.created);

			dispatcher.dispatch(MAP_LOAD, storedMap);
		}
		else {
			// fill initial state with default data and create a blank map
			dispatcher.hydrate("index", 0);
			dispatcher.hydrate("maps", []);

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
		let mapName = this.state.map ? this.state.map.name : null;
		let dialogueIsActive = this.state.layers == null || this.state.layers.length == 0;

		//logger.warn("render")
		//logger.log(this.state.maps);

		return <div className="full-screen">
			{/* <Router history={ router }>
				<Switch>
					<Route path="/view">
						<Viewer map={ this.state.map } nodes={ this.state.nodes } layers={ this.state.layers } images={ this.state.images } />
					</Route>
					<Route path="/create">
						<Editor maps={ this.state.maps } map={ this.state.map } nodes={ this.state.nodes } layers={ this.state.layers } images={ this.state.images } />
					</Route>
					<Route path="/">
						<Home map={ this.state.map } loading={ dialogueIsActive } user={ this.state.user } />
					</Route>
				</Switch>
			</Router> */}

			{ __MODE__ == MODE.VIEW
				? <Viewer map={ this.state.map } nodes={ this.state.nodes } layers={ this.state.layers } images={ this.state.images } />
				: <Editor maps={ this.state.maps } map={ this.state.map } nodes={ this.state.nodes } layers={ this.state.layers } images={ this.state.images } />
			}
			{<Modal title="Loading map" active={ dialogueIsActive }>
				<progress class="progress is-small is-warning" max="100"></progress>
				{ mapName ? <p>Loading map data for <strong>{ mapName }</strong>.</p> : <p>Loading map data.</p>}
			</Modal>}
		</div>;
	}
}


ReactDOM.render(
	<App />,
	document.getElementById("container")
);
