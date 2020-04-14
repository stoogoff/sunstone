
import paper from "paper/dist/paper-core";
import Tool from "./tool";


export default class Rectangle extends Tool {
	constructor() {
		super();

		this.name = "Rectangle";
		this.icon = "crop_square";
		this.border = "black";
		this.background = "white";
		this.forceSquare = false;

		this._constructor = paper.Path.Rectangle;
	}

	update(options) {
		this.border = options.foreground;
		this.background = options.background;
		this.width = options.width;
		this.opacity = options.opacity;
	}

	onMouseDown(event) {
		this.start = event.point;
	}

	onMouseDrag(event) {
		if(this.object) {
			this.object.remove();
		}

		let rectangle;

		if(this.forceSquare) {
			let width = Math.abs(this.start.x - event.point.x);
			let height = Math.abs(this.start.y - event.point.y);

			height = width = Math.max(width, height);

			let x = this.start.x > event.point.x ? this.start.x - width : this.start.x;
			let y = this.start.y > event.point.y ? this.start.y - width : this.start.y;

			rectangle = new paper.Rectangle(x, y, width, height);
		}
		else {
			rectangle = new paper.Rectangle(this.start, event.point);
		}

		this.object = new this._constructor(rectangle);
		this.object.fillColor = this.background;
		this.object.strokeColor = this.border;
		this.object.strokeWidth = this.width;
		this.object.opacity = this.opacity;
	}

	onMouseUp(event) {
		this.object = null;
	}

	onKeyDown(event) {
		if(event.key == "shift") {
			this.forceSquare = true;
		}
	}

	onKeyUp(event) {
		if(event.key == "shift") {
			this.forceSquare = false;
		}
	}
}