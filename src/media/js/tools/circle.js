
import paper from "paper/dist/paper-core";
import Rectangle from "./rectangle";

export default class Circle extends Rectangle {
	constructor() {
		super();

		this.name = "Circle";
		this.icon = "panorama_fish_eye";

		this._constructor = paper.Path.Ellipse;
	}

	static auto(packet) {
		let rectangle = new paper.Rectangle(packet.rectangle.x, packet.rectangle.y, packet.rectangle.w, packet.rectangle.h);
		let path = new paper.Path.Ellipse(rectangle);

		path.fillColor = packet.background;
		path.strokeColor = packet.border;
		path.strokeWidth = packet.width;
		path.opacity = packet.opacity;
	}
}