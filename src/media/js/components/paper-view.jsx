
import React from "react";
import paper from "paper/dist/paper-core";
import draw from "../tools/draw";


export default class PaperView extends React.Component {
	constructor(props) {
		super(props);

		this.canvas = React.createRef();
	}

	componentDidMount() {
		paper.setup(this.canvas.current);
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.nodes != this.props.nodes) {
			draw(nextProps.layers, nextProps.nodes, this.props.mode);
		}

		if(nextProps.map != this.props.map) {
			paper.view.zoom = nextProps.map.zoom || 1;
		}
	}

	render() {
		return <canvas id={ this.props.canvasId } ref={ this.canvas }></canvas>;
	}
}
