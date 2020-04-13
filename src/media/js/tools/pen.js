
import paper from "paper/dist/paper-core";

/*
export const Pen1 = paper.Tool.extend({
	onMouseDown: (event) => {
		this.path = new paper.Path();
		this.path.strokeColor = 'black';
		this.path.add(event.point);
	},

	onMouseDrag: (event) => {
		this.path.add(event.point);
	}
});


export const Pen2 = paper.Tool.extend({
	initialize: (props) => {
		paper.Tool.call(this, props);


	},

	onMouseDown: (event) => {
		this.path = new paper.Path();
		this.path.strokeColor = 'black';
		this.path.add(event.point);
	},

	onMouseDrag: (event) => {
		this.path.arcTo(event.point);
	}
});*/



/*
export class Pen1 extends paper.Tool {
	constructor() {
		super();
	}

	onMouseDown(event) {
		this.path = new paper.Path();
		this.path.strokeColor = 'black';
		this.path.add(event.point);
	}

	onMouseDrag(event) {
		this.path.add(event.point);
	}
}

export class Pen2 extends paper.Tool {
	constructor() {
		super();
		console.log(this)
		this.minDistance = 20;

		this.onMouseDown = (event) => {
			this.path = new paper.Path();
			this.path.strokeColor = 'black';
			this.path.add(event.point);
		};

		this.onMouseDrag = (event) => {
			this.path.arcTo(event.point);
		};
	}

	//onMouseDown(event) {
	//	this.path = new paper.Path();
	//	this.path.strokeColor = 'black';
	//	this.path.add(event.point);
	//}

	//onMouseDrag(event) {
	//	this.path.arcTo(event.point);
	//}
}
*/


const pen1 = new paper.Tool();

pen1.onMouseDown = (event) => {
	pen1.path = new paper.Path();
	pen1.path.strokeColor = 'black';
	pen1.path.add(event.point);
};

pen1.onMouseDrag = (event) => {
	pen1.path.add(event.point);
};

export const Pen1 = pen1;

const pen2 = new paper.Tool();

pen2.minDistance = 20;

pen2.onMouseDown = (event) => {
	pen2.path = new paper.Path();
	pen2.path.strokeColor = 'green';
	pen2.path.add(event.point);
};

pen2.onMouseDrag = (event) => {
	pen2.path.arcTo(event.point);
};

export const Pen2 = pen2;