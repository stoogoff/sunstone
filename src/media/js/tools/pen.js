
import paper from "paper/dist/paper-core";
import Tool from "./tool";

export default class Pen extends Tool {
	constructor() {
		super();

		this.name = "Pen";
		this.icon = "create";
		this.colour = "black";
	}

	update(options) {
		this.colour = options.foreground;
		this.width = options.width;
		this.opacity = options.opacity;
	}

	onMouseDown(event) {
		this.path = new paper.Path();
		this.path.strokeColor = this.colour;
		this.path.strokeWidth = this.width;
		this.path.opacity = this.opacity;
		this.path.add(event.point);
	}

	onMouseDrag(event) {
		this.path.add(event.point);
	}
}
