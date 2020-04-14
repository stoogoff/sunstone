
import paper from "paper/dist/paper-core";

let currentZoom = 1;
const MIN = 0.1;
const MAX = 5;
const STEP = 0.1;


// TODO select list with zoom to specific steps
// TODO scroll to zoom


export const ZoomIn = {
	name: "Zoom In",
	icon: "add",

	activate() {
		currentZoom += STEP;

		if(currentZoom > MAX) {
			currentZoom = MAX;
		}

		paper.view.zoom = currentZoom;

		return false;
	}
};

export const ZoomOut = {
	name: "Zoom Out",
	icon: "remove",

	activate() {
		currentZoom -= STEP;

		if(currentZoom < MIN) {
			currentZoom = MIN;
		}

		paper.view.zoom = currentZoom;

		return false;
	}
};
