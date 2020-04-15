
import React from "react";
import ReactDOM from "react-dom";

// base component
import Editor from "./components/editor.jsx";

// various utils
import dispatcher from "./lib/dispatcher";
import { ACTION_KEYS } from "./lib/config";
import mapper from "./lib/mapper";




dispatcher.register(ACTION_KEYS.MAP_NAME_SET, name => {
	mapper.setMapName(name);
});

dispatcher.register(ACTION_KEYS.NODE_SET, props => {
	mapper.addNode(props);
});

// TODO save this to firebase
// TODO update map name when its changed
// TODO there should be a facility for creating a new ID
// TODO there should be a facility to ensure created map ids don't clash - so there needs to be a user prefix or something
// TODO facility for multiple maps

// load the default map
let map = mapper.getCurrentMap();

ReactDOM.render(
	<Editor map={ map } />,
	document.getElementById("container")
);
