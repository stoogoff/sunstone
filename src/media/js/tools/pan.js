
import paper from "paper/dist/paper-core";

let tool = new paper.Tool();


// display info
tool.name = "Pan";
tool.icon = "pan_tool";


// paper config and mouse handlers
tool.distanceThreshold = 8;

let start;

tool.onMouseDown = function(event) {
	start = event.point.subtract(paper.view.center);
};

tool.onMouseDrag = function(event) {
	let end = event.point.subtract(paper.view.center);
	let delta = start.subtract(end);
    
	paper.view.scrollBy(delta);

	start = end;
};

export const Pan = tool;
