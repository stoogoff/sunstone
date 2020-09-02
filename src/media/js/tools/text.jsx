
import React from "react";
import Button from "../components/button.jsx"
import { TextInput } from "../components/input/text.jsx"
import Select from "../components/input/select.jsx"
import paper from "paper/dist/paper-core";
import Tool from "./tool";
import { createId, setSimpleState } from "../lib/utils";
import { COMPONENT_RENDER } from "../lib/action-keys";

export default class Text extends Tool {
	constructor() {
		super();

		this.name = Text.NAME;
		this.icon = "paragraph";
		this.colour = "black";
	}

	update(options) {
		this.colour = options.foreground;
	}

	onMouseUp(event) {
		const viewPoint = paper.view.projectToView(event.point);

		// todo add 

		this.onComplete({
			action: COMPONENT_RENDER,
			component: <TextModal x={ viewPoint.x } y={ viewPoint.y } onSave={ this.insertText.bind(this, event.point) } onCancel={ this.cancelTextInsert.bind(this) } />
		});
	}

	cancelTextInsert() {
		this.onComplete({
			action: COMPONENT_RENDER,
			component: null
		});
	}

	insertText(position, options) {
		let text = new paper.PointText(position);

		text._externalId = createId();
		text.content = options.text;
		text.fillColor = this.colour;
		text.fontSize = parseInt(options.size);
		text.fontFamily = options.font;

		// TODO just needs the text content and font family as the rest is inferred
		// TODO UI for editing the text

		this.onComplete({
			id: text._externalId,
			type: this.name,
			layer: text.layer._externalId,
			colour: this.colour,
			content: text.content,
			size: text.fontSize,
			font: text.fontFamily,
			position: {
				x: position.x,
				y: position.y
			}
		});
	}

	static draw(packet) {
		let text = new paper.PointText(packet.position);

		text._externalId = packet.id;
		text.content = packet.content;
		text.fillColor = packet.colour;
		text.fontSize = packet.size;
		text.fontFamily = packet.font;
	}
}

Text.NAME = "Text";


class TextModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: "",
			size: 20,
			font: "Arial"
		};
	}

	render() {
		const onSave = () => {
			if(this.props.onSave) {
				this.props.onSave(this.state);
			}
		};

		const onCancel = () => {
			if(this.props.onCancel) {
				this.props.onCancel();
			}
		}

		const fonts = [
			"Arial",
			"Times",
			"Courier"
		];

		// TODO add font selector
		// TODO add fint size input
		return <div className="text-tool box" style={ { top: this.props.y + "px", left: this.props.x + "px", } }>
			<Select label="Font Family" values={ fonts } value={ this.state.font } onChange={ setSimpleState.bind(this, "font") }  />
			<TextInput label="Font Size" value={ this.state.size } onChange={ setSimpleState.bind(this, "size") } required numeric />
			<TextInput label="Text" value={ this.state.text } onChange={ setSimpleState.bind(this, "text") } required />
			<Button label="OK" onClick={ onSave } />
			<Button label="Cancel" onClick={ onCancel } />
		</div>;
	}
}
