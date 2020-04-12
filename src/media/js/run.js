


function createElement(name, attr, text) {
	let el = document.createElement(name);

	if(attr) {
		Object.keys(attr).forEach(k => el.setAttribute(k,attr[k]));
	}

	if(text) {
		el.appendChild(document.createTextNode(text))
	}

	return el;
}



let database = firebase.database();
let mapRef = database.ref("/maps/map1")


mapRef.on("value", (snapshot) => {
	console.log(snapshot.val())

	document.body.appendChild(createElement("div", null, snapshot.val()));
});

let clickHandler = () => {
	console.log("clicky")
}

let div = createElement("div");
let input = createElement("input", { type: "text"});
let button = createElement("button", null, "Add")


button.onclick = () => {
	let newVal = input.value;

	mapRef.set(newVal)
}

div.appendChild(input)
div.appendChild(button)

document.body.appendChild(div)


