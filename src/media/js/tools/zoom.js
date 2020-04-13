import paper from "paper/dist/paper-core";

let TOLERANCE = 0.1, MIN = 0.1, MAX = 5;
let zoomIn = false, step, cursor;

let tool = new paper.Tool();

tool.name = "Zoom In";
tool.icon = "zoom_in";

tool.onMouseDown = function(event) {
	if(cursor) {
		cursor.remove();
		cursor = null;
	}

	cursor = new paper.Path();
	cursor.strokeColor = "#0074D9";
	cursor.strokeCap = 'round';
	cursor.strokeWidth = 1;

	cursor.add(event.point);
	cursor.add(event.point);
};

// keep line over last point
tool.onMouseMove = function(event) {
	if(cursor && cursor.lastSegment) {
		cursor.lastSegment.point = event.point;
	}
};

tool.onMouseUp = function(event) {
	if(cursor) {
		cursor.remove();
		cursor = null;
	}

	paper.view.scrollBy(event.middlePoint.subtract(paper.view.center));

	let currentStep = TOLERANCE, newZoom = paper.view.zoom;

	if(event.delta.length / 100 > TOLERANCE) {
		currentStep = event.delta.length / 100;
	}

	if(zoomIn) {
		newZoom += currentStep;
	}
	else {
		newZoom -= currentStep;
	}

	if(newZoom <= MIN) {
		paper.view.zoom = MIN;
	}
	else if(newZoom >= MAX) {
		paper.view.zoom = MAX;
	}
	else {
		paper.view.zoom = newZoom;
	}
};

// set up and tear down
/*tool.activate = function() {
	layerManager.activate(config.CURSOR.LAYER);

	Tool.prototype.activate.call(this);
};*/

tool.deactivate = function() {
	if(cursor) {
		cursor.remove();
		cursor = null;
	}
};
/*
// public methods
tool.zoomIn = function() {
	zoomIn = true;
};
tool.zoomOut = function() {
	zoomIn = false;
};
tool.zoomFive = function() {
	layerManager.scale(5);
};
tool.zoomDouble = function() {
	layerManager.scale(2);
};
tool.zoomFull = function() {
	layerManager.scale(1);
};
tool.zoomHalf = function() {
	layerManager.scale(0.5);
};
tool.zoomQuarter = function() {
	layerManager.scale(0.25);
}

tool.zoomIn();*/

export const Zoom = tool;
