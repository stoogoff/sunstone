
import React from "react";
import Button from "./button.jsx";
import Menu from "./menu.jsx";
import Icon from "./icon.jsx";
import { ZoomIn, ZoomOut, ZoomTo } from "../tools/zoom";


const ZOOM = [ZoomIn, ZoomOut];
const LEVELS = {
	"500%": 5,
	"250%": 2.5,
	"100%": 1,
	"75%": 0.75,
	"50%": 0.5
};


export default (props) => {
	const onZoom = (zoom, level) => {
		return () => {
			const newLevel = zoom.activate(level);

			if(props.onZoom) {
				props.onZoom(newLevel);
			}
		};
	};

	return <span id="zoom" className="tag is-medium" >
		<Icon large icon="search-plus" />
		{ ZOOM.map(z => <Button text small rightIcon={ z.icon } onClick={ onZoom(z) } />)}
		<Menu up right button-text>
			{ Object.keys(LEVELS).map(key => <Menu.Item onClick={ onZoom(ZoomTo, LEVELS[key]) } label={ key } />)}
		</Menu>
	</span>
};
