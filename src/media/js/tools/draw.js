
import paper from "paper/dist/paper-core";
import Pen from "./pen";
import Rectangle from "./rectangle";
import Circle from "./circle";
import Marker from "./marker";
import Raster from "./raster";
import getLogger from "../lib/logger";

import { MODE } from "../lib/config";
import { indexOfByProperty } from "../lib/list";


let logger = getLogger("draw");


let tools = {
	"Pen": Pen,
	"Rectangle": Rectangle,
	"Circle": Circle,
	"Marker": Marker,
	"Image": Raster,
};


let lastDrawnNodes = {};


// automatically draw a set of map nodes and layers
export default (layers, nodes, mode) => {
	logger.log(layers);
	logger.log(nodes);

	if(!nodes) {
		return;
	}

	// TODO draw needs to know about the view mode of the app so it can ignore hidden layers for public view

	// TODO currently this just draws everything that hasn't been drawn before
	// TODO it needs to delete nodes it has referenced which are not in the nodes argument
	// TODO draw order of nodes needs to be maintained somehow, currently it may be it's reversed or possibly random

	nodes.forEach(node => {
		if(node.type in tools) {
			logger.info(`got node '${node.id}'`)

			let layer = layers.find(l => l.id === node.layer);

			// only draw nodes on layers which exist
			if(layer) {
				logger.info(`got layer '${layer.id}'`)

				let index = indexOfByProperty(layer._layer.children, "_externalId", node.id);

				logger.info(`got index '${index}'`)

				// the node doesn't exist so draw it
				if(index == -1) {
					logger.info("node doesn't exist, drawing it");
					layer._layer.activate();

					tools[node.type].draw(node);
				}
			}
		}
		else {
			logger.error(`'${node.type}' not found in tools.`);
		}
	});

	// re-activate the active drawing layer
	if(layers) {
		let activated = false;

		layers.forEach(layer => {
			if(layer.active) {
				layer._layer.activate();
				activated = true;
			}

			// hide invisible layers in VIEW mode
			if(mode == MODE.VIEW && !layer.visible) {
				layer._layer.visible = false;
			}
		});
	}
};
