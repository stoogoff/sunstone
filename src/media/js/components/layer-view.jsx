
import React from "react";
import { ListItem } from 'react-toolbox/lib/list';

export default class LayerView extends React.Component {
	constructor(props) {
		super(props);
	}

	clickHandler(event) {
		if(this.props.onClick) {
			this.props.onClick(this.props.layer, event);
		}
	}

	render() {
		let layer = this.props.layer;

		if(!layer) {
			return null;
		}

		let classes = [];

		if(layer.active) {
			classes.push("active");
		}

		if(layer.visible) {
			classes.push("visible");
		}
		else {
			classes.push("hidden");
		}

		return <ListItem caption={ layer.name }
			onClick={ this.clickHandler.bind(this) }
			className={ classes.join(" ") }
			leftIcon={ layer.visible ? "visibility" : "visibility_off" }
			rightIcon={ layer.active ? "check_box" : null } />
	}
}