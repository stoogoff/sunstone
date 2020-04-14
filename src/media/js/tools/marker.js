
import paper from "paper/dist/paper-core";

let tool = new paper.Tool();


// display info
tool.name = "Marker";
tool.icon = "room";

console.log(paper)


// paper config and mouse handlers
let symbols = {};
let imported, currentColour;


tool.activate = function(colour) {
	currentColour = colour || "black";

	if(!symbols[currentColour]) {
		if(!imported) {
			imported = paper.project.importSVG('<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
		}

		symbols[currentColour] = new paper.Symbol(imported);
		symbols[currentColour].item.children[1].fillColor = currentColour;
	}

	return paper.Tool.prototype.activate.call(this);
};


tool.onMouseDown = function(event) {
	// drop the symbol at the cursor
	let feature = symbols[currentColour].place(event.point);

	/*feature.name = currentMap.addObject(activeLayer, {
		"x": event.point.x,
		"y": event.point.y,
		"feature": symbol.featurePath
	});*/
};

export const Marker = tool;
