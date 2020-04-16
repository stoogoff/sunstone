
import React from "react";
import { ListItem } from 'react-toolbox/lib/list';
import { IconButton } from 'react-toolbox/lib/button';


export default class LayerView extends React.Component {
	constructor(props) {
		super(props);
	}

	clickHandler(event) {
		if(this.props.onClick) {
			this.props.onClick(this.props.layer, event);
		}
	}

	buttonClickHandler(type) {
		if(this.props[type]) {
			this.props[type](this.props.layer);
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

		// TODO delete, rename, reorder
		// can't delete if this is the last layer (disable button)
		// can't move up if it's the first item
		// can't move down if it's the last item

		return <div>
			<ListItem caption={ layer.name }
				onClick={ this.clickHandler.bind(this) }
				className={ classes.join(" ") }
				leftIcon={ layer.visible ? "visibility" : "visibility_off" }
				rightIcon={ layer.active ? "check_box" : null } />
			{ layer.active
				? <div>
					<IconButton icon="arrow_drop_up" label="Move Up" flat onClick={ this.buttonClickHandler.bind(this, "onMoveUp") } />
					<IconButton icon="arrow_drop_down" label="Move Down" flat onClick={ this.buttonClickHandler.bind(this, "onMoveDown") } />
					<IconButton icon="delete_forever" label="Delete" flat onClick={ this.buttonClickHandler.bind(this, "onDelete") } />
				</div>
				: null }
		</div>
	}
}