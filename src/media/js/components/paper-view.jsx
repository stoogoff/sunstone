
import React from "react";
import paper from "paper/dist/paper-core";


export default class PaperView extends React.Component {
	constructor(props) {
		super(props);

		this.canvas = React.createRef();
	}

	componentDidMount() {
		this.scope = paper;
		this.scope.setup(this.canvas.current);
	}

	render() {
		return <canvas id={ this.props.canvasId } ref={ this.canvas }></canvas>;
	}
}
