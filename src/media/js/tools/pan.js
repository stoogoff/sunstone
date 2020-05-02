
import paper from "paper/dist/paper-core";
import Tool from "./tool";

// TODO holding space bar should activate pan
export default class Pan extends Tool {
	constructor() {
		super();

		this.name = Pan.NAME;
		this.icon = "location-arrow";

		this._tool.distanceThreshold = 8;
	}

	onMouseDown(event) {
		this.start = event.point.subtract(paper.view.center);
	}

	onMouseDrag(event) {
		let end = event.point.subtract(paper.view.center);
		let delta = this.start.subtract(end);

		paper.view.scrollBy(delta);

		this.start = end;
	}
}

Pan.NAME = "Pan";
