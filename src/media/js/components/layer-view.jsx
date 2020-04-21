
import React from "react";
import { Menu, MenuItem } from 'react-toolbox/lib/menu';
import { ListItem } from 'react-toolbox/lib/list';
import { ICON } from "../lib/config";

import Button from "./button.jsx";


export default class LayerView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			menuActive: false
		};
	}

	clickHandler(event) {
		console.log(event.target.innerHTML)

		// handle icon actions here
		if(event.target.innerHTML == ICON.MORE) {
			this.showMenu();

			return;
		}

		// pass everthing else up to the parent
		if(this.props.onClick) {
			this.props.onClick(this.props.layer, event);
		}
	}

	menuClickHandler(type) {
		this.hideMenu();

		if(this.props[type]) {
			this.props[type](this.props.layer);
		}
	}

	showMenu() {
		this.setState({
			menuActive: true
		});
	}

	hideMenu() {
		this.setState({
			menuActive: false
		});
	}

	render() {
		let layer = this.props.layer;

		if(!layer) {
			return null;
		}

		/*let classes = [];

		if(layer.active) {
			classes.push("active");
		}

		if(layer.visible) {
			classes.push("visible");
		}
		else {
			classes.push("hidden");
		}*/

		// TODO delete, rename, reorder
		// can't delete if this is the last layer (disable button)
		// can't move up if it's the first item
		// can't move down if it's the last item

		console.log("LayerView", layer.name, this.state.menuActive)

			//leftIcon="ellipsis-v"

		return <Button as="li" label={ layer.name } warning={ layer.active }
			rightIcon={ layer.visible ? ICON.VISIBLE : ICON.HIDDEN }
			onClick={ alert.bind(window, "onClick") }
			onRightIconClick={ alert.bind(window, "onRightClick") }
		/>
	}
}

/*


<div className="layer-item">
			<ListItem caption={ layer.name }
				onClick={ this.clickHandler.bind(this) }
				className={ classes.join(" ") }
				leftIcon={ layer.visible ? ICON.VISIBLE : ICON.HIDDEN }
				rightIcon="more_vert" />
			<Menu active={ this.state.menuActive } position="topRight">
				<MenuItem icon="arrow_drop_up" caption="Move Up" onClick={ this.menuClickHandler.bind(this, "onMoveUp") } />
				<MenuItem icon="arrow_drop_down" caption="Move Down" onClick={ this.menuClickHandler.bind(this, "onMoveDown") } />
				<MenuItem icon="edit" caption="Rename" fonClick={ this.menuClickHandler.bind(this, "onRename") } />
				<MenuItem icon="delete_forever" caption="Delete" fonClick={ this.menuClickHandler.bind(this, "onDelete") } />
			</Menu>
		</div>

		*/
