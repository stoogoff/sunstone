
import paper from "paper/dist/paper-core";
import Tool from "./tool";
import { createId } from "../lib/utils";

let imported, symbols = {};


// create copy of the symbol in the supplied colour
function createSymbol(colour) {
	if(!symbols[colour]) {
		if(!imported) {
			imported = paper.project.importSVG('<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
		}

		symbols[colour] = new paper.Symbol(imported);
		symbols[colour].item.children[1].fillColor = colour;
	}
}


export default class Marker extends Tool {
	constructor() {
		super();

		this.name = Marker.NAME;
		this.icon = "map-marker-alt";
		this.colour = "black";
		this.scale = 1;
		this.marker = null;
	}

	update(options) {
		this.colour = options.foreground;
		this.scale = parseInt(options.width) || 1;

		createSymbol(this.colour);
	}

	onMouseDown(event) {
		this.marker = symbols[this.colour].place(event.point);

		this.marker._externalId = createId();
		this.marker.scale(this.scale);

		this.onComplete({
			id: this.marker._externalId,
			type: this.name,
			layer: this.marker.layer._externalId,
			colour: this.colour,
			scale: this.scale,
			position: {
				x: event.point.x,
				y: event.point.y
			}
		});
	}

	static draw(packet) {
		createSymbol(packet.colour);

		let marker = symbols[packet.colour].place(new paper.Point(packet.position.x, packet.position.y));

		marker._externalId = packet.id;
		marker.scale(packet.scale || 1);
	}
}

Marker.NAME = "Marker";
