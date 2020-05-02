
import paper from "paper/dist/paper-core";
import Rectangle from "./rectangle";

export default class Circle extends Rectangle {
	constructor() {
		super();

		this.name = Circle.NAME;
		this.icon = "circle";

		this._constructor = paper.Path.Ellipse;
	}

	static draw(packet) {
		let rectangle = new paper.Rectangle(packet.rectangle.x, packet.rectangle.y, packet.rectangle.w, packet.rectangle.h);
		let path = new paper.Path.Ellipse(rectangle);

		path._externalId = packet.id;
		path.fillColor = packet.background;
		path.strokeColor = packet.border;
		path.strokeWidth = packet.width;
		path.opacity = packet.opacity;
		path.position = new paper.Point(packet.position.x, packet.position.y);
	}
}

Circle.NAME = "Circle";
