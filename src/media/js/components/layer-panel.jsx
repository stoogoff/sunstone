
import React from "react";

import Button from "./button.jsx";
import { TextInput } from "./input/text.jsx";
import Modal from "./modal.jsx";
import Expander from "./expander.jsx";
import dispatcher from "../lib/dispatcher";
import { 
	LAYER_CREATE, LAYER_RENAME, LAYER_HIDE, LAYER_SHOW, LAYER_ACTIVATE,
	LAYER_DELETE, LAYER_MOVE_DOWN, LAYER_MOVE_UP } from "../lib/action-keys";
import { ICON } from "../lib/config";
import { createId } from "../lib/utils";
import { throttle } from "../lib/timer";


export default class LayerPanel extends React.Component {
	constructor(props) {
		super(props);

		// throttle updates to the server to every 250 milliseconds
		this.update = throttle(this.renameLayerSend.bind(this));

		this.state = {
			layerName: "",
			showDialogue: false,
			deletingLayer: null,
			openMenu: null
		};
	}

	addLayer() {
		dispatcher.dispatch(LAYER_CREATE, {
			id: createId(),
			name: "Layer " + (this.props.layers.length + 1),
			map: this.props.map.id,
			visible: true
		});
	}

	moveLayerUp(layer) {
		dispatcher.dispatch(LAYER_MOVE_UP, layer);
	}

	moveLayerDown(layer) {
		dispatcher.dispatch(LAYER_MOVE_DOWN, layer);
	}

	deleteLayer() {
		if(this.state.deletingLayer) {
			dispatcher.dispatch(LAYER_DELETE, this.state.deletingLayer);

			this.hideDialogue();
		}
	}

	toggleVisibility(layer, event) {
		dispatcher.dispatch(layer.visible ? LAYER_HIDE : LAYER_SHOW, layer.id);
	}

	onClick(layer, event) {
		if(this.props.onSelect) {
			this.props.onSelect(layer);
		}
	}

	toggleMenu(layer, event) {
		const openMenu = this.state.openMenu == layer.id ? null : layer.id;

		this.setState({
			openMenu: openMenu,
			layerName: layer.name
		});
	}

	hideDialogue() {
		this.setState({
			showDialogue: false
		});
	}

	displayDeleteDialogue(layer) {
		this.setState({
			showDialogue: true,
			deletingLayer: layer
		});
	}

	renameLayer(layer, text) {
		this.setState({
			layerName: text
		});

		layer.name = text;

		this.update(layer);
	}

	renameLayerSend(layer) {
		dispatcher.dispatch(LAYER_RENAME, layer);
	}

	render() {
		if(!this.props.layers) {
			return null;
		}

		return <div className="layer-panel">
			<ul className="menu">
				{ this.props.layers.map((layer, index) => <li>
					<Button label={ layer.name }
						warning={ layer.active }
						leftIcon={ this.state.openMenu == layer.id ? "chevron-down" : "chevron-right" }
						rightIcon={ layer.visible ? ICON.VISIBLE : ICON.HIDDEN }
						onClick={ this.onClick.bind(this, layer) }
						onLeftIconClick={ this.toggleMenu.bind(this, layer) }
						onRightIconClick={ this.toggleVisibility.bind(this, layer) }
					/>
						<Expander open={ this.state.openMenu == layer.id }>
							<div className="field has-addons">
								<div className="control"><Button leftIcon="sort-up" disabled={ index == 0 } onClick={ this.moveLayerUp.bind(this, layer) } /></div>
								<div className="control"><Button leftIcon="sort-down" disabled={ index == this.props.layers.length - 1 } onClick={ this.moveLayerDown.bind(this, layer) } /></div>
								<div className="control"><Button leftIcon="trash" onClick={ this.displayDeleteDialogue.bind(this, layer) } /></div>
							</div>
							<TextInput label={ "Rename " + layer.name } value={ this.state.layerName } onChange={ this.renameLayer.bind(this, layer) } />
						</Expander>
				</li>)}
			</ul>
			<section><Button leftIcon="layer-group" label="Add Layer" onClick={ this.addLayer.bind(this) } /></section>
			<Modal active={ this.state.showDialogue } title="Delete Layer" closable close={ this.hideDialogue.bind(this) }>
				<p>Are you sure you want to delete this layer? This action can't be undone.</p>
				<Button label="OK" onClick={ this.deleteLayer.bind(this) } />
				<Button label="Cancel" onClick={ this.hideDialogue.bind(this) } />
			</Modal>
		</div>;
	}
}
