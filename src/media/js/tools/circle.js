
import paper from "paper/dist/paper-core";
import Rectangle from "./rectangle";


export default class Circle extends Rectangle {
	constructor() {
		super();

		this.name = "Circle";
		this.icon = "panorama_fish_eye";

		this._constructor = paper.Path.Ellipse;
	}
}
