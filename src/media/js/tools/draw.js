
import paper from "paper/dist/paper-core";
import Pen from "./pen";
import Rectangle from "./rectangle";
import Circle from "./circle";
import Marker from "./marker";
import Raster from "./raster";
import Shape from "./shape";
import Text from "./text.jsx";
import getLogger from "../lib/logger";

import { MODE } from "../lib/config";
import { findByProperty, indexOfByProperty } from "../lib/list";
import { VISIBILITY } from "../lib/config";


const logger = getLogger("draw");


const tools = {
	[Pen.NAME]: Pen,
	[Rectangle.NAME]: Rectangle,
	[Circle.NAME]: Circle,
	[Marker.NAME]: Marker,
	[Raster.NAME]: Raster,
	[Shape.NAME]: Shape,
	[Text.NAME]: Text,
};


// automatically draw a set of map nodes and layers
export default (layers, nodes, mode) => {
	logger.warn("Begin drawing")
	logger.log(paper.project)
	logger.log("layers", layers);
	logger.log("nodes", nodes);

	// create a paper layer for each firebase layer or link them to an existing paper layer
	if(layers) {
		layers.forEach(layer => {
			// don't create the paper layer if one with the same _externalId already exists
			const existingLayer = paper.project.layers.find(findByProperty("_externalId", layer.id));

			if(existingLayer) {
				layer._layer = existingLayer;
			}
			else {
				layer._layer = new paper.Layer();
				layer._layer.name = layer.name;
				layer._layer._externalId = layer.id;
			}

			layer._layer.opacity = layer.visible ? VISIBILITY.SHOW : VISIBILITY.HIDDEN;
		});
	}

	if(!nodes) {
		return;
	}

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
				else {
					// the node exists so move it
					const rendered = layer._layer.children[index];

					if(rendered.position != node.position) {
						rendered.position = node.position;
					}
				}
			}
		}
		else {
			logger.error(`'${node.type}' not found in tools.`);
		}
	});

	if(layers) {
		const nodesById = nodes.map(node => node.id).reduce((acc, value) => { acc[value] = true; return acc; }, {});

		layers.forEach(layer => {
			// re-activate the active drawing layer
			if(layer.active) {
				layer._layer.activate();
			}

			// hide/show invisible layers in VIEW mode
			if(mode == MODE.VIEW) {
				layer._layer.opacity = VISIBILITY.SHOW;
				layer._layer.visible = layer.visible;
			}

			// remove a child from the layer if it no longer exists in the nodes array
			// but only if it has an _externalId, if it doesn't have an _externalId set
			// then it's a transient node like a cursor
			layer._layer.children.forEach(child => {
				if(child._externalId && !(child._externalId in nodesById)) {
					child.remove();
				}
			});
		});
	}
};
