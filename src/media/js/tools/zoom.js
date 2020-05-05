
import paper from "paper/dist/paper-core";


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

	return paper.view.zoom;
};


export const ZoomIn = {
	name: "Zoom In",
	icon: "plus",

	activate() {
		paper.view.zoom += STEP;

		return boundsCheckZoom(paper.view.zoom);
	}
};

export const ZoomOut = {
	name: "Zoom Out",
	icon: "minus",

	activate() {
		paper.view.zoom -= STEP;

		return boundsCheckZoom(paper.view.zoom);
	}
};

export const ZoomTo = {
	name: "Zoom To",
	icon: "zoom out",

	activate(level) {
		paper.view.zoom = level;

		return boundsCheckZoom(paper.view.zoom);
	}
};
