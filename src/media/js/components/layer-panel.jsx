
import React from "react";
import paper from "paper/dist/paper-core";
import { List, ListItem } from 'react-toolbox/lib/list';
import { Button } from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';


import LayerView from "./layer-view.jsx";
import dispatcher from "../lib/dispatcher";
import { LAYER_CREATE, LAYER_HIDE, LAYER_SHOW, LAYER_ACTIVATE } from "../lib/action-keys";
import { ICON } from "../lib/config";
import { createId } from "../lib/utils";


export default class LayerPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showDialogue: false,
			deletingLayer: null
		};
	}

	addLayer() {
		dispatcher.dispatch(LAYER_CREATE, {
			id: createId(),
			name: "Layer " + (this.props.layers.length + 1),
			map: this.props.map.id,
			visible: true
		});
	}

	sortLayers(layer, adjust) {
		/*let currentSort = layer.sort + adjust;
		let layers = this.state.layers;

console.log("sort", layer.sort)
console.log("currentSort", currentSort)

		if(currentSort < 0 || currentSort >= layers.length) {
			return;
		}

console.log("BEFORE", layers.map(l => `${l.name} - ${l.sort}`))

		let layerAtSort = layers.find(findByProperty("sort", currentSort));

console.log(layerAtSort)

		layerAtSort.sort = layer.sort;
		layer.sort = currentSort;

		layers.sort(sortByProperty("sort"));

console.log("AFTER", layers.map(l => `${l.name} - ${l.sort}`))

		this.updateLayers();*/
	}

	moveUpHandler(layer) {
		console.log("moveUpHandler", layer)
		this.sortLayers(layer, -1);
	}

	moveDownHandler(layer) {
		console.log("moveDownHandler", layer)
		this.sortLayers(layer, 1);
	}

	deleteHandler(layer) {
		/*// this needs to pop up a dialogue warning the user
		this.setState({
			showDialogue: true,
			deletingLayer: layer
		});*/
	}

	deleteLayer() {
		/*let layer = this.state.deletingLayer;

		// tell fb
		dispatcher.dispatch(ACTION_KEYS.LAYER_DELETE, layer);

		// remove layer object from this list
		let layers = this.state.layers.filter(l => l.id != layer.id);

console.log("layers after delete", layers.map(l => l.name))

		// remove layer from map
		layer.remove();

		// set the first remaining layer as active
		if(layers.length > 0) {
			layers[0].activate();
		}

		this.setState({
			showDialogue: false,
			deletingLayer: null,
			layers: layers
		});*/
	}

	clickHandler(layer, event) {
		let target = event.target.innerHTML;

		if(target == ICON.VISIBLE) {
			dispatcher.dispatch(LAYER_HIDE, layer.id);
		}
		else if(target == ICON.HIDDEN) {
			dispatcher.dispatch(LAYER_SHOW, layer.id);
		}
		else {
			dispatcher.dispatch(LAYER_ACTIVATE, layer.id);
		}
	}

	updateLayers() {
		/*let layers = this.state.layers;

		this.setState({
			layers: layers
		});*/
	}

	hideDialogue() {
		/*this.setState({
			showDialogue: false
		});*/
	}

	render() {
		if(!this.props.layers) {
			return null;
		}

		return <div>
			<Button icon="layers" label="Add layer" onClick={ this.addLayer.bind(this) } />
			<List selectable>
				{ this.props.layers.map((layer, index) => <LayerView
					layer={ layer }
					onClick={ this.clickHandler.bind(this) }
					onMoveUp={ this.moveUpHandler.bind(this) }
					onMoveDown={ this.moveDownHandler.bind(this) }
					onDelete={ this.deleteHandler.bind(this) }
				/>)}
			</List>
			<Dialog active={ this.state.showDialogue } title="Delete Layer">
				<p>Are you sure you want to delete this layer? This action can't be undone.</p>
				<Button label="OK" onClick={ this.deleteLayer.bind(this) } />
				<Button label="Cancel" onClick={ this.hideDialogue.bind(this) } />
			</Dialog>
		</div>;
	}
}
