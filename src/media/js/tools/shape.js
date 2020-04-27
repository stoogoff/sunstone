
import paper from "paper/dist/paper-core";
import Tool from "./tool";
import { createId } from "../lib/utils";

export default class Shape extends Tool {
	constructor() {
		super();

		this.name = Shape.NAME;
		this.icon = "draw-polygon";
		this.border = "black";
		this.background = "white";
		this.width = 1;
		this.opacity = 1;
	}

	update(options) {
		this.border = options.foreground;
		this.background = options.background;
		this.width = options.width;
		this.opacity = options.opacity;
	}

	onMouseUp(event) {
		// if this is a double click close the path 
		if(this.doubleClick) {
			this.doubleClick = false;

			this.shape.removeSegment(this.shape.segments.length - 1);

			this.shape.fillColor = this.background;
			this.shape.closed = true;

			// save
			this.onComplete({
				id: this.shape._externalId,
				type: this.name,
				layer: this.shape.layer._externalId,
				background: this.background,
				border: this.border,
				width: this.width,
				opacity: this.opacity,
				points: this.shape.segments.map(s => {
					return {
						x: s.point.x,
						y: s.point.y
					}
				})
			});

			this.shape = null;

			return;
		}

		this.doubleClick = true;

		if(!this.shape) {
			this.shape = new paper.Path();
			this.shape.strokeColor = this.border;
			this.shape.strokeWidth = this.width;
			this.shape.opacity = this.opacity;
			this.shape._externalId = createId();
		}

		this.shape.add(event.point);

		// add a second point to act as the cursor line
		if(this.shape.segments.length == 1) {
			this.shape.add(event.point);
		}

		if(this.doubleClickTimer) {
			window.clearTimeout(this.doubleClickTimer);
		}

		this.doubleClickTimer = window.setTimeout(() => this.doubleClick = false, 250);
	}

	onMouseMove(event) {
		if(this.shape && this.shape.lastSegment) {
			this.shape.lastSegment.point = event.point;
		}
	}

	static draw(packet) {
		let path = new paper.Path();

		path._externalId = packet.id;
		path.strokeColor = packet.border;
		path.strokeWidth = packet.width;
		path.opacity = packet.opacity;
		path.fillColor = packet.background;
		path.closed = true;

		packet.points.forEach(point => path.add(new paper.Point(point.x, point.y)));
	}
}

Shape.NAME = "Shape";
