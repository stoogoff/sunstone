
import paper from "paper/dist/paper-core";

console.log(paper)


const pen1 = new paper.Tool();

pen1.onMouseDown = (event) => {
	this.path = new paper.Path();
	this.path.strokeColor = 'black';
	this.path.add(event.point);
};

pen1.onMouseDrag = (event) => {
	this.path.add(event.point);
};

export const Pen1 = pen1;




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

export const Pen2 = pen2;
