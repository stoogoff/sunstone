
import _ from "lodash";
import { MESSAGE } from "./module";

function component() {
	const element = document.createElement("div");

	element.innerHTML = _.join([MESSAGE, "world"], " ");

	return element;
}

document.body.appendChild(component());
