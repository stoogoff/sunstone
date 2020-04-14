
import paper from "paper/dist/paper-core";

export default class Tool {
	constructor(props) {
		this._tool = new paper.Tool(props);

		this.registerEventHandlers();
	}

	registerEventHandlers() {
		["onFrame", "onMouseDown", "onMouseDrag", "onMouseUp", "onClick", "onDoubleClick", "onMouseMove", "onMouseEnter", "onMouseLeave", "onKeyDown", "onKeyUp"].forEach(h => {
			if(this[h]) {
				this._tool[h] = this[h].bind(this);
			}
		});
	}

	activate(options) {
		if(this.update) {
			this.update(options);
		}

		return this._tool.activate();
	}
}