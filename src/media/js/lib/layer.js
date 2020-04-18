
// TODO this is obsolete, should be removed
import paper from "paper/dist/paper-core";
import { createId } from "./utils";

export default class Layer {
	constructor(name, id = null) {
		this.name = name;
		this.id = id || createId();
		this.sort = 0;
		this.public = false;
		this._visible = true;

		// create a paper layer for this layer
		this._layer = new paper.Layer();
		this._layer.name = this.name;

		//paper.project.layers[this.id] = this._layer;

		paper.project.layers.forEach((l, i) => {
			if(this._layer == i) {
				this.sort = i;
			}
		});
	}

	// get and set the public visibility state
	get visible() {
		return this._visible;
	}

	set visible(state) {
		this._visible = state;

		if(this.public) {
			this._layer.visible = state;
		}
		else {
			this._layer.opacity = state ? 1 : 0.3;
		}
	}

	// activate the paper layer
	activate() {
		this._layer.activate();
	}

	// return true if the paper layer is active
	get active() {
		return paper.project.activeLayer === this._layer;
	}

	// delete this object from the map
	remove() {
		this._layer.remove();
	}

	// create the payload to send to the server
	payload() {
		return {
			id: this.id,
			name: this.name,
			visible: this.visible,
			sort: this.sort
		};
	}

	// create a layer from a payload
	static from(object) {
		let layer = new Layer(object.name, object.id);

		if(object.public) {
			layer.public = object.public;
		}

		layer.visible = object.visible;
		layer.sort = object.sort;

		return layer;
	}
}
