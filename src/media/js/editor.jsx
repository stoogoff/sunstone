
import React from "react";
import ReactDOM from "react-dom";

// base component
import Editor from "./components/editor.jsx";

// various urilts
import { createMapId } from "./lib/utils";
import { local } from "./lib/local-store";
import dispatcher from "./lib/dispatcher";
import { DEFAULT_MAP, STORAGE_KEYS, ACTION_KEYS } from "./lib/config";



// load a default map, either from local storage, or create a new map and save it there
let map;

if(local.has(STORAGE_KEYS.MAP)) {
	map = local.get(STORAGE_KEYS.MAP);
}
else {
	map = {
		name: DEFAULT_MAP,
		url: window.location.href + "#" + createMapId(5)
	};

	local.set(STORAGE_KEYS.MAP, map);
}

dispatcher.register(ACTION_KEYS.SET_MAP_NAME, (name) => {
	let map = local.get(STORAGE_KEYS.MAP);

	map.name = name;

	local.set(STORAGE_KEYS.MAP, map);
});


// TODO save this to firebase
// TODO update map name when its changed
// TODO there should be a facility for creating a new ID
// TODO there should be a facility to ensure created map ids don't clash - so there needs to be a user prefix or something
// TODO facility for multiple maps

ReactDOM.render(
	<Editor map={ map } />,
	document.getElementById("container")
);
