
import paper from "paper/dist/paper-core";
import Tool from "./tool";

// display dialogue with drop area for uploading image
// will this be OK to store in Firebase?

export default class Image extends Tool {
	constructor() {
		super();

		this.name = "Image";
		this.icon = "insert_photo";
	}
}
