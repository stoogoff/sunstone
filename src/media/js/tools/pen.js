
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

	onMouseUp(event) {
		this.onComplete({
			type: this.name,
			layer: this.path.layer._externalId,
			colour: this.colour,
			width: this.width,
			opacity: this.opacity,
			points: this.path.segments.map(s => {
				return {
					x: s.point.x,
					y: s.point.y
				}
			})
		});
	}

	static draw(packet) {
		let path = new paper.Path();

		path.strokeColor = packet.colour;
		path.strokeWidth = packet.width;
		path.opacity = packet.opacity;

		packet.points.forEach(point => path.add(new paper.Point(point.x, point.y)));
	}
}
