
import paper from "paper/dist/paper-core";
import Tool from "./tool";
import { createId } from "../lib/utils";


export default class Raster extends Tool {
	constructor() {
		super();

		this.name = Raster.NAME;
		this.icon = "images";
		this.image = null;
		this.opacity = 1;
		this.cursorImage = null;
	}

	update(options) {
		this.image = options.image;
		this.opacity = options.opacity;

		if(this.image) {
			if(this.cursorImage) {
				this.cursorImage.remove();
			}

			this.cursorImage = new paper.Raster({
				source: this.image.url,
				position: paper.project.view.center
			});

			this.cursorImage.opacity = 0.3;
		}
	}

	deactivate() {
		if(this.cursorImage) {
			this.cursorImage.remove();
			this.cursorImage = null;
		}
	}

	onMouseMove(event) {
		if(this.cursorImage) {
			this.cursorImage.position = event.point;
		}
	}

	onMouseDown(event) {
		if(this.image) {
			const placedImage = new paper.Raster({
				source: this.image.url,
				position: event.point
			});

			placedImage._externalId = createId();
			placedImage.opacity = this.opacity;

			this.cursorImage.bringToFront();

			this.onComplete({
				id: placedImage._externalId,
				type: this.name,
				layer: placedImage.layer._externalId,
				image: this.image,
				opacity: this.opacity,
				position: {
					x: placedImage.position.x,
					y: placedImage.position.y
				}
			});
		}
	}

	static draw(packet) {
		let image = new paper.Raster({
			source: packet.image.url,
			position: new paper.Point(packet.position.x, packet.position.y)
		});

		image._externalId = packet.id;
		image.opacity = packet.opacity;

	}
}

Raster.NAME = "Image";
