
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

		// force all layers to have a name
		let count = 0;

		this.scope.project.layers.forEach(l => {
			if(!l.name) {
				l.name = "Layer " + (++count);
			}
		});
	}

	render() {
		return <canvas id={ this.props.canvasId } ref={ this.canvas }></canvas>;
	}
}
