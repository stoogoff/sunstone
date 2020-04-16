
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



// TODO there should be a facility to ensure created map ids don't clash - so there needs to be a user prefix or something

class App extends React.Component {
	constructor(props) {
		super(props);

		// load the default map
		this.state = {
			map: mapper.getPublidMap(window.location.hash.substring(1)),
			nodes: null
		};

		this.registered = {};
	}

	componentDidMount() {
		this.registered[ACTION_KEYS.MAP_DATA] = dispatcher.register(ACTION_KEYS.MAP_DATA, map => {
			this.setState({
				map: map,
				nodes: map.nodes
			});
		});
	}

	componentWillUnmount() {
		Object.keys(this.registered).forEach(k => dispatcher.unregister(k, this.registered[k]));
	}

	render() {
		return <div>
			<Editor map={ this.state.map } nodes={ this.state.nodes } mode={ MODE.VIEW } />
			<Dialog title="Loading map" active={ this.state.nodes == null }>
				<ProgressBar type="linear" mode="indeterminate" />
				{ this.state.map
					? <p>Loading map data for <strong>{ this.state.map.name }</strong>.</p>
					: <p>Loading map data.</p>
				}
			</Dialog>
		</div>;
	}
}


ReactDOM.render(
	<App />,
	document.getElementById("container")
);
