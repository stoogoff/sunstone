
import paper from "paper/dist/paper-core";
import Tool, { HIT_TEST } from "./tool";
import { NODE_DELETE } from "../lib/action-keys";



export default class Delete extends Tool {
	constructor() {
		super();

		this.name = Delete.NAME;
		this.icon = "eraser";
		this.layerId = null;
		this.deleteItems = [];

		this._tool.distanceThreshold = 8;
	}

	handleDelete(point) {
		let result = paper.project.hitTest(point, HIT_TEST);

		// TODO now only deletes from the active layer, should inform the user in some fashion as to why it isn't deleting an item
		if(result && result.item && result.item.layer._externalId == this.layerId) {
			this.deleteItems.push(result.item._externalId);

			result.item.remove();
		}
	}

	update(options) {
		this.layerId = options.layer.id;
	}

	onMouseDown(event) {
		this.deleteItems = [];

		this.handleDelete(event.point);
	}

	onMouseDrag(event) {
		this.handleDelete(event.point);
	}

	onMouseUp(event) {
		this.onComplete({
			action: NODE_DELETE,
			ids: this.deleteItems
		});

		this.deleteItems = [];
	}
}

Delete.NAME = "Delete";
