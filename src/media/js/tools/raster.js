
import paper from "paper/dist/paper-core";
import Tool from "./tool";

// display dialogue with drop area for uploading image
// will this be OK to store in Firebase?

export default class Raster extends Tool {
	constructor() {
		super();

		this.name = Raster.NAME;
		this.icon = "images";

		this.image = null;
	}

	update(options) {
		this.image = options.image;
	}

	onMouseDown(event) {
		if(this.image) {
			const placed = new paper.Raster({
				source: this.image.url,
				position: event.point
			});

		}
	}
}

Raster.NAME = "Image";
