
import React, { useRef } from "react";
import paper from "paper/dist/paper-core";
import draw from "../tools/draw";
import getLogger from "../lib/logger";


const logger = getLogger("draw");


export default props => {
	logger.warn("render");
	logger.log(props);

	const canvas = useRef(null);
	const bounds = paper.view ? new paper.Point(paper.view.bounds.x, paper.view.bounds.y) : null;

	paper.setup(canvas.current);
	paper.view.zoom = props.map.zoom || 1;

	// reset panning
	if(bounds && bounds != paper.view.bounds) {
		let delta = bounds.subtract(new paper.Point(paper.view.bounds.x, paper.view.bounds.y));

		paper.view.translate(delta.negate());
	}

	draw(props.layers, props.nodes, props.mode);

	return <canvas id={ props.canvasId } ref={ canvas }></canvas>;
};
