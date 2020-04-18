
import paper from "paper/dist/paper-core";
import Pen from "./pen";
import Rectangle from "./rectangle";
import Circle from "./circle";
import Marker from "./marker";
import Layer from "../lib/layer";
import { DEFAULT_LAYER } from "../lib/config";

let tools = {
	"Pen": Pen,
	"Rectangle": Rectangle,
	"Circle": Circle,
	"Marker": Marker,
};

// automatically draw a set of map nodes and layers
export const draw = (layers, nodes) => {
	// the harsh way, clear everything and redraw
	if(paper.project) {
		paper.project.clear();
	}
	else {
		
	}

	// draw all public layers
	/*let newLayers = [];

	(layers || []).forEach(layer => {
		newLayers.push(Layer.from(layer));
	});

	map.layers = newLayers;*/

	(nodes || []).forEach(node => {
		if(node.type in tools) {
			let layer = layers.find(l => l.id === node.layer);

			// only draw nodes on layers which exist
			if(layer) {
				layer._layer.activate();

				tools[node.type].draw(node);
			}
		}
		else {
			console.error(node.type + " not found in tools.");
		}
	});

	// activate the first layer so the drawing layer is consistent
	if(layers && layers.length) {
		layers[0]._layers.activate();
	}
};
