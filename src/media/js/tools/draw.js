
import paper from "paper/dist/paper-core";
import Pen from "./pen";
import Rectangle from "./rectangle";
import Circle from "./circle";
import Marker from "./marker";
//import Layer from "../lib/layer";
//import { DEFAULT_LAYER } from "../lib/config";

import { indexOfByProperty } from "../lib/list";



let tools = {
	"Pen": Pen,
	"Rectangle": Rectangle,
	"Circle": Circle,
	"Marker": Marker,
};


let lastDrawnNodes = {};


// automatically draw a set of map nodes and layers
export default (layers, nodes) => {
	console.log("draw");
	console.log(layers);
	console.log(nodes);

	if(!nodes) {
		return;
	}

	// TODO currently this just draws everything that hasn't been drawn before
	// TODO it needs to delete nodes it has referenced which are not in the nodes argument

	nodes.forEach(node => {
		/*if(node.id in lastDrawnNodes) {
			console.log(`draw: node '${node.id}' was previously drawn`)
			return;
		}*/

		if(node.type in tools) {
			console.log(`draw: got node '${node.id}'`)

			let layer = layers.find(l => l.id === node.layer);

			// only draw nodes on layers which exist
			if(layer) {
				console.log(`draw: got layer '${layer.id}'`)

				let index = indexOfByProperty(layer._layer.children, "_externalId", node.id);

				console.log(`draw: got index '${index}'`)

				// the node doesn't exist so draw it
				if(index == -1) {
					console.log("draw: node doesn't exist, drawing it")
					layer._layer.activate();

					tools[node.type].draw(node);
				}

				//lastDrawnNodes[node.id] = node;
			}
		}
		else {
			console.error(`draw: '${node.type}' not found in tools.`);
		}
	});

	// activate the first layer so the drawing layer is consistent
	// TODO this should activate a specific layer, based on the layer's active property
	/*if(layers && layers.length) {
		layers[0]._layers.activate();
	}*/
};
