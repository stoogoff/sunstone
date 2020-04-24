
// react and react components
import React from "react";
import { CirclePicker } from "react-color";

// Sunstone components
import Menu from "./menu.jsx";
import Button from "./button.jsx";
import Icon from "./icon.jsx";
import Tabs from "./tabs.jsx";
import Message from "./message.jsx";
import PaperView from "./paper-view.jsx";
import ColourPicker from "./colour-picker.jsx";
import LayerPanel from "./layer-panel.jsx";
import { TextInput } from "./input/text.jsx";
import RangeInput from "./input/range.jsx";

// Sunstone tools
import Pen from "../tools/pen";
import Pan from "../tools/pan";
import Marker from "../tools/marker";
import Circle from "../tools/circle";
import Rectangle from "../tools/rectangle";
import Image from "../tools/image";
import Delete from "../tools/delete";
import { ZoomIn, ZoomOut, ZoomTo } from "../tools/zoom";

// Sunstone utils
import dispatcher  from "../lib/dispatcher";
import { MODE, COLOURS } from "../lib/config";
import { MAP_EDIT, NODE_CREATE, NODE_DELETE, LAYER_ACTIVATE } from "../lib/action-keys";
import { findByProperty } from "../lib/list";


/*

selection tool
DONE deleting of selected objects
editing of selected objects
editing of common state of multiple objects (maybe)

public state of objects for view version

image upload tool (how to save this?)
move object tool

*/
export default class Editor extends React.Component {
	constructor(props) {
		super(props);

		// should the active drawing tool be updated?
		this.toolNeedsUpdate = false;

		this.state = {
			// tool states
			activeTool: null,
			colourPicker: null,
			tabIndex: 0,

			// parameters to tools
			foreground: "black",
			background: "white",
			opacity: 1,
			width: 1,

			// map properties
			mapName: this.props.map ? this.props.map.name : "",

			// copy URL snackbar and message
			copyMessage: "",
			copyActive: false,

			// drawer state test
			expanded: false,
		}

		this.tools = [new Pan()];

		// add extra tools if not in view mode
		if(this.props.mode == MODE.EDIT) {
			this.tools = this.tools.concat([new Marker(), new Pen(), new Rectangle(), new Circle(), new Image(), new Delete()]);
		}

		this.zoom = [ZoomIn, ZoomOut];
	}

	componentDidMount() {
		let active = this.tools[0].activate();

		if(active) {
			this.setState({
				activeTool: this.tools[0]
			});
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.map != this.props.map) {
			this.setState({
				mapName: nextProps.map ? nextProps.map.name : ""
			});
		}
	}

	copyURL() {
		navigator.clipboard.writeText(this.props.map.url).then(() => {
			this.setState({
				copyMessage: `Link ${this.props.map.url} copied to clipboard.`,
				copyActive: true
			})
		});
	}

	activateLayer(layer) {
		dispatcher.dispatch(LAYER_ACTIVATE, layer.id);
	}

	activateTool(key) {
		let active = this.tools.find(f => f.name == key);

		if(this.state.activeTool === active) {
			return;
		}

		if(this.state.activeTool && this.state.activeTool.deactivate) {
			this.state.activeTool.deactivate();
		}

		// once a tool has finished its operation it MAY need to send data somewhere
		let activated = active.activate(this.getToolParams(), (payload) => {
			payload.map = this.props.map.id;

			if(payload.type == NODE_DELETE) {
				dispatcher.dispatch(NODE_DELETE, payload);
			}
			else {
				dispatcher.dispatch(NODE_CREATE, payload);
			}
		});

		if(activated) {
			this.setState({
				activeTool: active
			});
		}
	}

	setToolState(type, value) {
		this.setSimpleState(type, value);
		this.toolNeedsUpdate = true;
	}

	setSimpleState(type, value) {
		this.setState({
			[type]: value
		});
	}

	toggleSimpleState(type) {
		let currentState = this.state[type];

		this.setState({
			[type]: !currentState
		});
	}

	setMapName(name) {
		this.setSimpleState("mapName", name);

		dispatcher.dispatch(MAP_EDIT, { id: this.props.map.id, name: name });
	}

	updateActiveTool() {
		if(this.state.activeTool && this.state.activeTool.update) {
			this.state.activeTool.update(this.getToolParams());
		}

		this.toolNeedsUpdate = false;
	}

	// the parameters which are sent to every tool
	// what the tool does with the parameters is entirely up to it
	getToolParams() {
		return {
			foreground: this.state.foreground,
			background: this.state.background,
			opacity: this.state.opacity,
			width: this.state.width,
		};
	}

	render() {
		if(!this.props.map) {
			return null;
		}

		// update the active drawing tool
		if(this.toolNeedsUpdate) {
			this.updateActiveTool();
		}

		let activeLayer = this.props.layers ? this.props.layers.find(findByProperty("active", true)) :null;

		return <div>
			<header id="navbar" className="has-background-dark has-text-light level">
				<div className="level-left">
					<h1 className="has-text-light title is-4">Sunstone</h1>
				</div>
				<div id="menu" className="level-right">
					{ this.state.activeTool ? <Icon icon={ this.state.activeTool.icon } /> : null }
					{ activeLayer ? <Menu label={ activeLayer.name } button-dark>
						{ this.props.layers.map(layer => <Menu.Item onClick={ this.activateLayer.bind(this, layer) } active={ layer.id == activeLayer.id }>{ layer.name }</Menu.Item>)}
					</Menu> : null }
					<Button label="Foreground" leftIcon="square" dark leftIconColour={ this.state.foreground } />
					<Button label="Background" leftIcon="square" dark leftIconColour={ this.state.background } />
					<Menu label={ this.state.mapName } button-dark>
						<Menu.Item>Second Map Name</Menu.Item>
						<Menu.Item>Other dropdown item</Menu.Item>
						<Menu.Divider />
						<Menu.Item>With a divider</Menu.Item>
					</Menu>
				</div>
			</header>
			{ this.props.mode == MODE.EDIT ?
				<nav id="tools" className={ "has-background-light " + (this.state.expanded ? "is-open" : "is-closed") }>
					<ul className="menu">
						<Button as="li"
							onClick={ this.toggleSimpleState.bind(this, "expanded") }
							rightIcon={ this.state.expanded ? "angle-double-left" : "angle-double-right" } />
						{ this.tools.map(t => <Button as="li"
							rightIcon={ t.icon }
							warning={ t === this.state.activeTool }
							label={ t.name }
							onClick={ this.activateTool.bind(this, t.name) } />)}
					</ul>
					<Tabs index={ 1 }>
						<Tabs.Tab label="Tools">
							<section>
								<RangeInput label="Opacity" min={ 0 } max={ 1 } value={ this.state.opacity } onChange={ this.setToolState.bind(this, "opacity") } />
								<RangeInput label="Line Width" min={ 0 } max={ 5 } steps={ 5 } value={ this.state.width } onChange={ this.setToolState.bind(this, "width") } />
								<h3 className="label">Tool Colours</h3>
								<ColourPicker caption="Foreground / Border" onSelection={ this.setToolState.bind(this, "foreground") } colour={ this.state.foreground } />
								<ColourPicker caption="Background" onSelection={ this.setToolState.bind(this, "background") } colour={ this.state.background } />
							</section>
						</Tabs.Tab>
						<Tabs.Tab label="Layers">
							<LayerPanel map={ this.props.map } layers={ this.props.layers } />
						</Tabs.Tab>
						<Tabs.Tab label="Map">
							<section>
								<TextInput label="Name" value={ this.state.mapName } onChange={ this.setMapName.bind(this) } />
								<TextInput label="Public URL" value={ this.props.map.url } onClick={ this.copyURL.bind(this) } rightIcon="copy" readOnly note="Click to copy public URL." />
							</section>
						</Tabs.Tab>
					</Tabs>
				</nav>
				: null }
			<PaperView canvasId="map" layers={ this.props.layers } nodes={ this.props.nodes } mode={ this.props.mode } />
			<span id="zoom" className="tag is-medium" >
				<span className="icon is-large"><i className="fas fa-2x fa-search-plus"></i></span>
				{ this.zoom.map(z => <Button text small rightIcon={ z.icon } onClick={ z.activate.bind(z) } />)}
				<Menu up right button-text>
					<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 5) }>500%</Menu.Item>
					<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 2.5) }>250%</Menu.Item>
					<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 1) }>100%</Menu.Item>
					<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 0.5) }>50%</Menu.Item>
				</Menu>
			</span>
			<Message active={ this.state.copyActive } primary
				timeout={ 4000 }
				onClose={ this.setSimpleState.bind(this, "copyActive", false) }>
					{ this.state.copyMessage }
			</Message>
		</div>;
	}
}
