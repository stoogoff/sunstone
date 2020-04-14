
import React from "react";
import paper from "paper/dist/paper-core";
import { List, ListItem } from 'react-toolbox/lib/list';
import { Button } from 'react-toolbox/lib/button';

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
		let layer = new paper.Layer();

		layer.name = "Layer " + paper.project.layers.length;
		layer.activate();

		this.updateLayers();
	}

	activateLayer(layer, event) {
		let target = event.target.innerHTML;

		if(target == "visibility") {
			layer.visible = false;
		}
		else if(target == "visibility_off") {
			layer.visible = true;
		}
		else {
			layer.activate();
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
				{ this.state.layers.map((layer, index) => <ListItem caption={ (layer.name || `Layer ${index + 1}`) }
					onClick={ this.activateLayer.bind(this, layer) }
					className={ layer === activeLayer ? "active" : null }
					leftIcon={ layer.visible ? "visibility" : "visibility_off" }
					rightIcon={ layer === activeLayer ? "check_box" : null } />)
				}
			</List>
		</div>;
	}
}
