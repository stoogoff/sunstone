
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

		this._tool.distanceThreshold = 8;

		this.hoverItem = null;
		this.hoverItemOpacity = null;
		this.deleteItem = null;
	}

	onMouseDown(event) {
		let result = paper.project.hitTest(event.point, HIT_TEST);

		if(result && result.item) {
			//result.item.remove();
			this.deleteItem = result.item;

			console.log(`delete tool: deleting item with id '${result.item._externalId}'`)
		}
	}

	onMouseMove(event) {
		if(this.hoverItem) {
			this.hoverItem.opacity = this.hoverItemOpacity;
			this.hoverItem = null;
		}

		let result = paper.project.hitTest(event.point, HIT_TEST);

		if(result && result.item) {
			this.hoverItem = result.item;
			this.hoverItemOpacity = result.item.opacity;
			this.hoverItem.opacity = 0.5;
		}
	}

	onMouseUp(event) {
		// TODO dispatch delete node event
		if(this.deleteItem) {
			this.onComplete({
				type: NODE_DELETE,
				id: this.deleteItem._externalId
			});

			this.deleteItem.remove();
			this.deleteItem = null;
		}
	}
}
