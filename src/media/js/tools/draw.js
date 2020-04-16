
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
export const draw = (map) => {
	// the harsh way, clear everything and redraw
	paper.project.clear();

	// draw all public layers
	let newLayers = [];

	(map.layers || []).forEach(layer => {
		newLayers.push(Layer.from(layer));
	});

	map.layers = newLayers;

	(map.nodes || []).forEach(node => {
		if(node.type in tools) {
			let layer = map.layers.find(l => l.name === node.layer);

			// only draw nodes on layers which exist
			if(layer) {
				layer.activate();

				tools[node.type].auto(node);
			}
		}
		else {
			console.error(node.type + " not found in tools.");
		}
	});

	// activate the first layer so the drawing layer is consistent
	if(map.layers && map.layers.length) {
		map.layers[0].activate();
	}
};
