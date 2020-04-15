
import paper from "paper/dist/paper-core";
import { createId } from "../lib/utils";
import { NODE_ID_LEN } from "../lib/config";

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

	activate(options, completeHandler) {
		if(this.update) {
			this.update(options);
		}

		this.completeHandler = completeHandler;

		return this._tool.activate();
	}

	onComplete(props) {
		if(this.completeHandler) {
			props.id = createId(NODE_ID_LEN);

			this.completeHandler(props);
		}
	}
}