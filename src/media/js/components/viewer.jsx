
import React from "react";

// Sunstone components
import Menu from "./menu.jsx";
import PaperView from "./paper-view.jsx";
import ZoomPanel from "./zoom-panel.jsx";

// Sunstone tools
import Pan from "../tools/pan";

// Sunstone utils
import dispatcher  from "../lib/dispatcher";
import { MODE } from "../lib/config";
import { MAP_ZOOM } from "../lib/action-keys";


// create a new pan tool, the only tool available in this view
const pan = new Pan();

pan.activate();

export default (props) => {
	if(!props.map) {
		return null;
	}

	const setZoomLevel = level => {
		dispatcher.dispatch(MAP_ZOOM, {
			id: props.map.id,
			zoom: level
		});
	}

	return <div className="full-screen">
		<header id="navbar" className="has-background-dark has-text-light level">
			<div className="level-left">
				<h1 className="has-text-light title is-4">Sunstone</h1>
			</div>
			<div id="menu" className="level-right">
				<Menu label={ props.map.name } button-dark>
					{ (props.maps || []).map(m => <Menu.Item active={ m.id == props.map.id } label={ m.name } />) }
					<Menu.Divider />
					<Menu.Item label="Create Map" />
				</Menu>
			</div>
		</header>
		<PaperView canvasId="map" map={ props.map } layers={ props.layers } nodes={ props.nodes } mode={ MODE.VIEW } />
		<ZoomPanel onZoom={ setZoomLevel } />
	</div>
};
