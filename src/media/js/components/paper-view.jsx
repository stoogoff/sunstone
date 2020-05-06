
import React, { useRef } from "react";
import paper from "paper/dist/paper-core";
import draw from "../tools/draw";
import getLogger from "../lib/logger";


const logger = getLogger("draw");


export default props => {
	logger.warn("render");
	logger.log(props);

	const canvas = useRef(null);

	paper.setup(canvas.current)
	paper.view.zoom = props.map.zoom || 1;

	draw(props.layers, props.nodes, props.mode);

	return <canvas id={ props.canvasId } ref={ canvas }></canvas>;
};
