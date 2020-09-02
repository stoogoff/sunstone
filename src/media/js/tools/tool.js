
import paper from "paper/dist/paper-core";

export default class Tool {
	constructor(props) {
		this._tool = new paper.Tool(props);

		this.registerEventHandlers();
	}

	registerEventHandlers() {
		[
			"onFrame",
			"onMouseDown", "onMouseDrag", "onMouseUp", "onMouseMove", "onMouseEnter", "onMouseLeave",
			"onClick", "onDoubleClick", 
			"onKeyDown", "onKeyUp"
		].forEach(h => {
			if(this[h]) {
				this._tool[h] = this[h].bind(this);
			}
		});
	}

	activate(options, completeHandler) {
		if(this.update) {
			this.update(options);
		}

		this.completeHandler = completeHandler;

		return this._tool.activate();
	}

	onComplete(props) {
		if(this.completeHandler) {
			this.completeHandler(props);
		}
	}
}

// parameters for selecting a paper item
export const HIT_TEST = {
	fill: true,
	stroke: true,
	segments: true,
	tolerance: 5
};
