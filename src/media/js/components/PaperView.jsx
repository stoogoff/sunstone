
import React from "react";
import paper from "paper/dist/paper-core";


import { Pen1, Pen2 } from "../tools/pen";

/*
const pen1 = new paper.Tool();

pen1.onMouseDown = (event) => {
	this.path = new paper.Path();
	this.path.strokeColor = 'black';
	this.path.add(event.point);
};

pen1.onMouseDrag = (event) => {
	this.path.add(event.point);
};






const pen2 = new paper.Tool()

pen2.minDistance = 20;


pen2.onMouseDown = (event) => {
	this.path = new paper.Path();
	this.path.strokeColor = 'black';
	this.path.add(event.point);
};

pen2.onMouseDrag = (event) => {
	this.path.arcTo(event.point);
};


pen2.activate();*/



export default class PaperView extends React.Component {
	constructor(props) {
		super(props);

		this.canvas = React.createRef();
	}

	componentDidMount() {
		console.log("PaperView.componentDidMount", paper)

		this.scope = paper;//new paper.PaperScope();
		this.scope.setup(this.canvas.current);

		/*Pen2.initialize();

		Pen2._scope = paper;

		Pen2.activate();

		console.log(Pen2)*/

/*const pen2 = new paper.Tool()

pen2.minDistance = 20;


pen2.onMouseDown = (event) => {
	this.path = new paper.Path();
	this.path.strokeColor = 'black';
	this.path.add(event.point);
};

pen2.onMouseDrag = (event) => {
	this.path.arcTo(event.point);
};


pen2.activate();*/
	}

	render() {
		return <canvas id={ this.props.canvasId } ref={ this.canvas }></canvas>;
	}
}