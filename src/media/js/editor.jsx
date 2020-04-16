
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
