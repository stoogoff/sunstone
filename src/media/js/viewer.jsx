
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
		mapper.getPublicMap(window.location.hash.substring(1));

		this.state = {
			realMap: null
		};

		this.registered = {};
	}

	componentDidMount() {
		this.registered[ACTION_KEYS.MAP_DATA] = dispatcher.register(ACTION_KEYS.MAP_DATA, map => {
			console.log(map)
			this.setState({
				realMap: map
			});
		});
	}

	componentWillUnmount() {
		Object.keys(this.registered).forEach(k => dispatcher.unregister(k, this.registered[k]));
	}

	render() {
		return <div>
			<Editor map={ this.state.realMap } mode={ MODE.VIEW } />
			<Dialog title="Loading map" active={ this.state.realMap == null }>
				<ProgressBar type="linear" mode="indeterminate" />
				<p>Loading map data.</p>
			</Dialog>
		</div>;
	}
}


ReactDOM.render(
	<App />,
	document.getElementById("container")
);
