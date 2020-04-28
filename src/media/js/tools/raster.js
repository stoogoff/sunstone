
import paper from "paper/dist/paper-core";
import Tool from "./tool";
import { createId } from "../lib/utils";

// display dialogue with drop area for uploading image
// will this be OK to store in Firebase?

export default class Raster extends Tool {
	constructor() {
		super();

		this.name = Raster.NAME;
		this.icon = "images";
		this.image = null;
		this.opacity = 1;
		this.cursorImage = null;
		this.placedImage = null;
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
			this.placedImage = new paper.Raster({
				source: this.image.url,
				position: event.point
			});

			this.placedImage._externalId = createId();
			this.placedImage.opacity = this.opacity;

			this.cursorImage.bringToFront();

			this.onComplete({
				id: this.placedImage._externalId,
				type: this.name,
				layer: this.placedImage.layer._externalId,
				image: this.image,
				opacity: this.opacity,
				position: {
					x: this.placedImage.position.x,
					y: this.placedImage.position.y
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
