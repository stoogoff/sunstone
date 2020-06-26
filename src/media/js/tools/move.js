
import paper from "paper/dist/paper-core";
import Tool, { HIT_TEST } from "./tool";
import { NODE_MOVE } from "../lib/action-keys";


export default class Move extends Tool {
	constructor() {
		super();

		this.name = Move.NAME;
		this.icon = "arrows-alt";
		this.layerId = null;
		this.selected = null;
		this.offset = null;

		this._tool.distanceThreshold = 8;
	}

	update(options) {
		this.layerId = options.layer.id;
	}

	onMouseDown(event) {
		let result = paper.project.hitTest(event.point, HIT_TEST);

		// TODO only moves from the active layer, should inform the user in some fashion as to why it isn't selecting an item
		if(result && result.item && result.item.layer._externalId == this.layerId) {
			this.selected = result.item;
			this.offset = this.selected.bounds.center.subtract(event.downPoint);
		}
		else {
			this.selected = null;
			this.offset = null;
		}
	}

	onMouseDrag(event) {
		if(this.selected) {
			this.selected.position = event.point.add(this.offset);
		}
	}

	onMouseUp(event) {
		if(this.selected) {
			this.onComplete({
				action: NODE_MOVE,
				id: this.selected._externalId,
				position: this.selected.position
			});
		}
	}
}

Move.NAME = "Move";
