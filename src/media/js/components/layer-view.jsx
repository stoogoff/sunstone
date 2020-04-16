
import React from "react";
import { ListItem } from 'react-toolbox/lib/list';

export default class LayerView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let layer = this.props.layer;

		if(!layer) {
			return null;
		}

		let classes = [];
		let visible = true;

		if(layer === activeLayer) {
			classes.push("active");
		}

		if(layer.opacity == 1) {
			classes.push("visible");
			visible = true;
		}
		else {
			classes.push("hidden");
			visible = false;
		}

		return <ListItem caption={ (layer.name || `Layer ${index + 1}`) }
			onClick={ this.clickHandler.bind(this, layer) }
			className={ classes.join(" ") }
			leftIcon={ visible ? "visibility" : "visibility_off" }
			rightIcon={ layer === activeLayer ? "check_box" : null } />
	}
}