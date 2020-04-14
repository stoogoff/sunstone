
import paper from "paper/dist/paper-core";

let currentZoom = 1;
const MIN = 0.1;
const MAX = 5;
const STEP = 0.1;


// TODO scroll to zoom
const boundsCheckZoom = (zoom) => {
	if(zoom < MIN) {
		zoom = MIN;
	}
	else if(zoom > MAX) {
		zoom = MAX;
	}

	paper.view.zoom = zoom;

	return false;
};


export const ZoomIn = {
	name: "Zoom In",
	icon: "add",

	activate() {
		currentZoom += STEP;

		return boundsCheckZoom(currentZoom);
	}
};

export const ZoomOut = {
	name: "Zoom Out",
	icon: "remove",

	activate() {
		currentZoom -= STEP;

		return boundsCheckZoom(currentZoom);
	}
};

export const ZoomTo = {
	name: "Zoom To",
	icon: "remove",

	activate(level) {
		currentZoom = level;

		return boundsCheckZoom(currentZoom);
	}
};
