
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

		if(this.forceSquare) {
			let width = Math.abs(this.start.x - event.point.x);
			let height = Math.abs(this.start.y - event.point.y);

			height = width = Math.max(width, height);

			let x = this.start.x > event.point.x ? this.start.x - width : this.start.x;
			let y = this.start.y > event.point.y ? this.start.y - width : this.start.y;

			this.rectangle = new paper.Rectangle(x, y, width, height);
		}
		else {
			this.rectangle = new paper.Rectangle(this.start, event.point);
		}

		this.object = new this._constructor(this.rectangle);
		this.object.fillColor = this.background;
		this.object.strokeColor = this.border;
		this.object.strokeWidth = this.width;
		this.object.opacity = this.opacity;
	}

	onMouseUp(event) {
		this.onComplete({
			type: this.name,
			layer: this.object.layer.name,
			background: this.background,
			border: this.border,
			width: this.width,
			opacity: this.opacity,
			rectangle: {
				x: this.rectangle.x,
				y: this.rectangle.y,
				w: this.rectangle.width,
				h: this.rectangle.height,
			}
		});

		this.rectangle = null;
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

	static auto(packet) {
		let rectangle = new paper.Rectangle(packet.rectangle.x, packet.rectangle.y, packet.rectangle.w, packet.rectangle.h);
		let path = new paper.Path.Rectangle(rectangle);

		path.fillColor = packet.background;
		path.strokeColor = packet.border;
		path.strokeWidth = packet.width;
		path.opacity = packet.opacity;
	}
}
