
import paper from "paper/dist/paper-core";


export const Pen = paper.Tool.extend({
	initialize: () => {
		paper.Tool.call(this);

		this.name = "Line";
		this.icon = "create";
	},

	activate: (options) => {
		this.update(options);

		return paper.Tool.prototype.activate.call(this);
	},

	update: (options) => {
		this.colour = options.foreground;	
	},

	onMouseDown: (event) => {
		this.path = new paper.Path();
		this.path.strokeColor = this.colour;
		this.path.add(event.point);
	},

	onMouseDrag: (event) => {
		this.path.add(event.point);
	}
});
