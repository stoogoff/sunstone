
import paper from "paper/dist/paper-core";
import Pen from "./pen";
import Rectangle from "./rectangle";
import Circle from "./circle";
import Marker from "./marker";

let tools = {
	"Pen": Pen,
	"Rectangle": Rectangle,
	"Circle": Circle,
	"Marker": Marker,
};

// automatically draw a set of map nodes
export const draw = (nodes) => {
	console.log("Got nodes", nodes)

	nodes.forEach(node => {
		if(node.type in tools) {
			let layer = paper.project.layers.find(l => l.name === node.layer);

			if(!layer) {
				layer = new paper.Layer();
				layer.name = node.layer;
			}

			layer.activate();

			tools[node.type].auto(node);
		}
		else {
			console.error(node.type + " not found in tools.");
		}
	});
};
