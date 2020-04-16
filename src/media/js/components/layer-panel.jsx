
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
			layers: []
		};
	}

	componentDidMount() {
		if(paper.project.layers.length === 0) {
			this.addLayer();
		}
		else {
			this.updateLayers();
		}
	}

	addLayer() {
		let layer = new Layer("Layer " + paper.project.layers.length)

		layer.activate();

		this.updateLayers();
	}

	clickHandler(layer, event) {
		let target = event.target.innerHTML;
		let publicChange = false;

		// for visiblity, set the opacity of the layer as this is public visibility, not local
		if(target == "visibility") {
			layer.opacity = 0.3;
			publicChange = true;
		}
		else if(target == "visibility_off") {
			layer.opacity = 1;
			publicChange = true;
		}
		else {
			layer.activate();
		}

		// there's a public change to the layer so set the order
		if(publicChange) {
			// TODO what format does the layer information take?
			//dispatcher.dispatch(ACTION_KEYS.LAYER_SET, {});
		}

		this.updateLayers();
	}

	updateLayers() {
		this.setState({
			layers: paper.project.layers
		});
	}

	render() {
		let activeLayer = paper.project.activeLayer;

		return <div>
			<Button icon="layers" label="Add layer" onClick={ this.addLayer.bind(this) } />
			<List selectable>
				{ this.state.layers.map((layer, index) => <LayerView layer={ layer } />)}
			</List>
		</div>;
	}
}
