
import React from "react";
import { CirclePicker } from "react-color";
import { List, ListItem } from 'react-toolbox/lib/list';
import { COLOURS } from "../lib/config";

export default class ColourPicker extends React.Component {
	constructor(props) {
		super(props);

		this.colours = COLOURS;
		this.state = {
			open: false,
			colour: this.props.colour || "white"
		};
	}

	toggleColourPicker() {
		this.setState({
			open: !this.state.open
		});
	}

	setColour(colour) {
		if(this.props.onSelection) {
			this.props.onSelection(colour.hex);
		}

		this.setState({
			open: false,
			colour: colour.hex
		});
	}

	render() {
		return <div className="colour-picker">
			<ListItem caption={ this.props.caption } onClick={ this.toggleColourPicker.bind(this) } rightIcon={ this.state.open ? "check_box" : null } className={ this.state.open ? "active" : null }><span style={{ backgroundColor: this.state.colour }} className="colour-display"></span></ListItem>
			{ this.state.open ? <ListItem><CirclePicker colors={ this.colours } onChangeComplete={ this.setColour.bind(this) } /></ListItem> : null }
		</div>;
	}
}