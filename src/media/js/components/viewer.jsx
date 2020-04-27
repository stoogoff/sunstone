
import React from "react";
import PaperView from "./paper-view.jsx";
import ZoomPanel from "./zoom-panel.jsx";
import { MODE } from "../lib/config";
import Pan from "../tools/pan";

const pan = new Pan();

pan.activate();

export default (props) => {
	if(!props.map) {
		return null;
	}

	return <div className="full-screen">
		<header id="navbar" className="has-background-dark has-text-light level">
			<div className="level-left">
				<h1 className="has-text-light title is-4">Sunstone</h1>
			</div>
			<div id="menu" className="level-right">
				{ props.map.name }
			</div>
		</header>
		<PaperView canvasId="map" layers={ props.layers } nodes={ props.nodes } mode={ MODE.VIEW } />
		<ZoomPanel />
	</div>
};
