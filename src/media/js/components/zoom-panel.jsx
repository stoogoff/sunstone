
import React from "react";
import Button from "./button.jsx";
import Menu from "./menu.jsx";
import Icon from "./icon.jsx";
import { ZoomIn, ZoomOut, ZoomTo } from "../tools/zoom";

export default (props) => {
	const zoom = [ZoomIn, ZoomOut]

	return <span id="zoom" className="tag is-medium" >
		<Icon large icon="search-plus" />
		{ zoom.map(z => <Button text small rightIcon={ z.icon } onClick={ z.activate.bind(z) } />)}
		<Menu up right button-text>
			<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 5) }>500%</Menu.Item>
			<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 2.5) }>250%</Menu.Item>
			<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 1) }>100%</Menu.Item>
			<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 0.5) }>50%</Menu.Item>
		</Menu>
	</span>
};
