
import paper from "paper/dist/paper-core";
import { createId } from "./utils";

export default class Layer {
	constructor(name, id = null) {
		this.name = name;
		this.id = id || createId();
		this._visible = true;

		// create a paper layer for this layer
		this._layer = new paper.Layer();
		this._layer.name = this.name;

		paper.project.layers.forEach((l, i) => {
			if(this._layer == i) {
				this.sort = i;
			}
		})
	}

	get visible() {
		return this._visible;
	}

	set visible(state) {
		this._visible = state;
		this._layer.opacity = state ? 1 : 0.3;
	}

	activate() {
		this._layer.activate();
	}

	// create a layer from a payload
	static from(object) {
		let layer = new Layer(object.name, object.id);

		layer.visible = object.visible;
		lasyer.sort = object.sort;

		return layer;
	}
}