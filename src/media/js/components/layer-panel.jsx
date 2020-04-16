
import React from "react";
import paper from "paper/dist/paper-core";
import { List, ListItem } from 'react-toolbox/lib/list';
import { Button } from 'react-toolbox/lib/button';


import LayerView from "./layer-view.jsx";
import dispatcher from "../lib/dispatcher";
import { ACTION_KEYS } from "../lib/config";
import Layer from "../lib/layer";

/*

TODO

rename layer
reorder layers (ideally drag and drop but possibly with up down buttons)
delete layer

*/


export default class LayerPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			layers: this.props.layers
		};
	}

	/*componentDidMount() {
		if(paper.project.layers.length === 0) {
			this.addLayer();
		}
		else {
			this.updateLayers();
		}
	}*/

	addLayer() {
		let layer = new Layer("Layer " + (this.state.layers.length + 1));

		layer.activate();

		let layers = this.state.layers;

		layers.push(layer);

		console.log("addLayer", layers)

		// TODO set new layer
		dispatcher.dispatch(ACTION_KEYS.LAYER_SET, layer);

		this.setState({
			layers: layers
		});
	}

	clickHandler(layer, event) {
		console.log("clickHandler")
		console.log(layer)
		console.log(event)
		console.log(event.target)
		console.log(event.target.innerHTML)

		let target = event.target.innerHTML;
		let publicChange = false;

		// for visiblity, set the opacity of the layer as this is public visibility, not local
		if(target == "visibility") {
			layer.visible = false;
			publicChange = true;
		}
		else if(target == "visibility_off") {
			layer.visible = true;
			publicChange = true;
		}
		else {
			layer.activate();
		}

		if(publicChange) {
			// TODO what format does the layer information take?
			dispatcher.dispatch(ACTION_KEYS.LAYER_SET, layer);
		}

		let layers = this.state.layers;

		this.setState({
			layers: layers
		});
	}

	updateLayers() {
		/*this.setState({
			layers: paper.project.layers
		});*/
	}

	render() {
		if(!this.state.layers) {
			return null;
		}

		return <div>
			<Button icon="layers" label="Add layer" onClick={ this.addLayer.bind(this) } />
			<List selectable>
				{ this.state.layers.map((layer, index) => <LayerView layer={ layer } onClick={ this.clickHandler.bind(this) } />)}
			</List>
		</div>;
	}
}
