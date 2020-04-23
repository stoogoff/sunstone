
import paper from "paper/dist/paper-core";
import Tool from "./tool";
import { NODE_DELETE } from "../lib/action-keys";


const HIT_TEST = {
	fill: true,
	stroke: true,
	segments: true,
	tolerance: 5
};


export default class Delete extends Tool {
	constructor() {
		super();

		this.name = "Delete";
		this.icon = "eraser";
		this.deleteItems = [];

		this._tool.distanceThreshold = 8;
	}

	onMouseDown(event) {
		this.deleteItems = [];
	}

	onMouseDrag(event) {
		let result = paper.project.hitTest(event.point, HIT_TEST);

		if(result && result.item) {
			this.deleteItems.push(result.item._externalId);

			result.item.remove();
		}
	}

	onMouseUp(event) {
		this.onComplete({
			type: NODE_DELETE,
			ids: this.deleteItems
		});

		this.deleteItems = [];
	}
}
