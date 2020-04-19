
import React from "react";
import paper from "paper/dist/paper-core";
import draw from "../tools/draw";


export default class PaperView extends React.Component {
	constructor(props) {
		super(props);

		this.canvas = React.createRef();
	}

	componentDidMount() {
		this.scope = paper;
		this.scope.setup(this.canvas.current);

		if(this.props.nodes && this.props.nodes.length > 0 && this.props.layers && this.props.layers.length > 0) {
			draw(this.props.layers, this.props.nodes);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.nodes != this.props.nodes) {
			draw(nextProps.layers, nextProps.nodes);
		}
	}

	render() {
		return <canvas id={ this.props.canvasId } ref={ this.canvas }></canvas>;
	}
}
