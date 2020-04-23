
import React from "react";
import { CirclePicker } from "react-color";

import Button from "./button.jsx";
import Expander from "./expander.jsx";
import { COLOURS } from "../lib/config";


export default class ColourPicker extends React.Component {
	constructor(props) {
		super(props);

		this.colours = COLOURS;
		this.state = {
			open: false
		};

		this.expander = React.createRef();
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
			open: false
		});
	}

	render() {
		let colour = this.props.colour || this.colours[0];
		let classList = ["colour-picker"];

		if(this.state.open) {
			classList.push("is-active");
		}

		return <div className={ classList.join(" ") }>
			<Button label={ this.props.caption }
				 onClick={ this.toggleColourPicker.bind(this) }
				 leftIconColour={ this.props.colour }
				 leftIcon="square"
				 rightIcon={ this.state.open ? "chevron-down" : "chevron-right" }
				 active={ this.state.open }
				 light />
			<Expander open={ this.state.open }>
				<CirclePicker colors={ this.colours } onChangeComplete={ this.setColour.bind(this) } />
			</Expander>
		</div>;
	}
}
