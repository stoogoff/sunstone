
// react and react components
import React from "react";
import { CirclePicker } from "react-color";

// Sunstone components
import Menu from "./menu.jsx";
import Button from "./button.jsx";
import Icon from "./icon.jsx";
import Tabs from "./tabs.jsx";
import Notification from "./notification.jsx";
import PaperView from "./paper-view.jsx";
import ColourPicker from "./colour-picker.jsx";
import LayerPanel from "./layer-panel.jsx";
import ImagePanel from "./image-panel.jsx";
import ZoomPanel from "./zoom-panel.jsx";
import { TextInput } from "./input/text.jsx";
import RangeInput from "./input/range.jsx";

// Sunstone tools
import Circle from "../tools/circle";
import Delete from "../tools/delete";
import Marker from "../tools/marker";
import Move from "../tools/move";
import Pan from "../tools/pan";
import Pen from "../tools/pen";
import Raster from "../tools/raster";
import Rectangle from "../tools/rectangle";
import Shape from "../tools/shape";

// Sunstone utils
import dispatcher  from "../lib/dispatcher";
import { MODE, COLOURS, ICON } from "../lib/config";
import { MAP_EDIT, NODE_CREATE, NODE_DELETE, LAYER_ACTIVATE, MAP_ZOOM, USER_LOGIN, USER_REGISTER } from "../lib/action-keys";
import { findByProperty } from "../lib/list";
import { setSimpleState, copy } from "../lib/utils";
import getLogger from "../lib/logger";

const logger = getLogger("editor");



/*

selection tool
editing of selected objects
editing of common state of multiple objects (maybe)

DONE public state of objects for view version

DONE deleting of selected objects
DONE image upload tool (how to save this?)
DONE move object tool

*/


const TAB_DEFAULT = 1;


export default class Editor extends React.Component {
	constructor(props) {
		super(props);

		// should the active drawing tool be updated?
		this.toolNeedsUpdate = false;

		this.state = {
			// tool states
			activeTool: null,
			colourPicker: null,
			tabIndex: TAB_DEFAULT,

			// parameters to tools
			foreground: "black",
			background: "white",
			opacity: 1,
			width: 1,
			image: null,

			// map properties
			mapName: this.props.map ? this.props.map.name : "",

			// copy URL snackbar and message
			copyMessage: "",
			copyActive: false,

			// drawer state test
			expanded: false,
		}

		this.tools = [
			new Pan(),
			new Move(),
			new Marker(),
			new Pen(),
			new Rectangle(),
			new Circle(),
			new Shape(),
			new Raster(),
			new Delete()
		];

		this.setSimpleState = setSimpleState.bind(this);
	}

	componentDidMount() {
		logger.warn("componentDidMount")
		logger.info("activating tool[0]")

		let active = this.tools[0].activate();

		if(active) {
			this.setState({
				activeTool: this.tools[0]
			});
		}
	}

	componentWillUpdate(nextProps, nextState) {
		logger.warn("componentWillUpdate")
		logger.log(nextProps, nextState)

		if(nextProps.map != this.props.map) {
			this.setState({
				mapName: nextProps.map ? nextProps.map.name : ""
			});
		}
	}

	copyURL() {
		copy(this.props.map.url, () => {
			this.setState({
				copyMessage: `Link ${this.props.map.url} copied to clipboard.`,
				copyActive: true
			})
		});
	}

	activateLayer(layer) {
		this.toolNeedsUpdate = true;

		dispatcher.dispatch(LAYER_ACTIVATE, layer.id);
	}

	activateTool(key) {
		const active = this.tools.find(f => f.name == key);

		if(this.state.activeTool === active) {
			return;
		}

		if(this.state.activeTool && this.state.activeTool.deactivate) {
			this.state.activeTool.deactivate();
		}

		// once a tool has finished its operation it MAY need to send data somewhere
		const activated = active.activate(this.getToolParams(), (payload) => {
			payload.map = this.props.map.id;

			dispatcher.dispatch(payload.action || NODE_CREATE, payload);
		});

		if(activated) {
			const updatedState = {
				activeTool: active
			};

			if(active.name == Raster.NAME) {
				updatedState.tabIndex = 3;
			}

			this.setState(updatedState);
		}
	}

	setToolState(type, value) {
		this.setSimpleState(type, value);
		this.toolNeedsUpdate = true;
	}

	setZoomLevel(level) {
		dispatcher.dispatch(MAP_ZOOM, {
			id: this.props.map.id,
			zoom: level
		});
	}

	toggleSidebar() {
		let updatedState = {
			"expanded": !this.state.expanded
		};

		if(!updatedState.expanded) {
			updatedState.tabIndex = TAB_DEFAULT;
		}

		this.setState(updatedState);
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
			image: this.state.image,
			layer: this.getActiveLayer(),
		};
	}

	getActiveLayer() {
		return this.props.layers ? this.props.layers.find(findByProperty("active", true)) :null;
	}

	// these actions might need to change to VIEW_USER_*/DISPLAY_USER_* as this isn't doing the action, just displaying the form

	login() {
		dispatcher.dispatch(USER_LOGIN);
	}

	register() {
		dispatcher.dispatch(USER_REGISTER);
	}

	render() {
		logger.warn("render")
		logger.log(this.props.map)

		if(!this.props.map) {
			return null;
		}

		// update the active drawing tool
		if(this.toolNeedsUpdate) {
			this.updateActiveTool();
		}

		let activeLayer = this.getActiveLayer();

		return <div className="full-screen">
			<header id="navbar" className="has-background-dark has-text-light level">
				<div className="level-left">
					<h1 className="has-text-light title is-4">Sunstone</h1>
				</div>
				<div id="menu" className="level-right">
					{ this.state.activeTool ? <Icon icon={ this.state.activeTool.icon } /> : null }
					{ activeLayer ? <Menu label={ activeLayer.name } button-dark>
						{ this.props.layers.map(layer => <Menu.Item onClick={ this.activateLayer.bind(this, layer) } active={ layer.id == activeLayer.id } label={ layer.name } icon={ layer.visible ? ICON.VISIBLE : ICON.HIDDEN } />)}
					</Menu> : null }
					{ this.state.foreground == "transparent" ? <Icon icon="slash" className="colour-picker transparent" /> : <Icon icon="square" className="colour-picker" colour={ this.state.foreground } /> }
					{ this.state.background == "transparent" ? <Icon icon="slash" className="colour-picker transparent" /> : <Icon icon="square" className="colour-picker" colour={ this.state.background } /> }
					<Menu label={ this.state.mapName } right button-dark>
						{ (this.props.maps || []).map(m => <Menu.Item active={ m.id == this.props.map.id } label={ m.name } />) }
						<Menu.Divider />
						<Menu.Item label="Login" onClick={ this.login.bind(this) } />
						<Menu.Item label="Register" onClick={ this.register.bind(this) } />
					</Menu>
				</div>
			</header>
			<nav id="tools" className={ "has-background-light " + (this.state.expanded ? "is-open" : "is-closed") }>
				<ul className="menu">
					<Button as="li"
						onClick={ this.toggleSidebar.bind(this, "expanded") }
						rightIcon={ this.state.expanded ? "angle-double-left" : "angle-double-right" } />
					{ this.tools.map(t => <Button as="li"
						rightIcon={ t.icon }
						warning={ t === this.state.activeTool }
						label={ t.name }
						onClick={ this.activateTool.bind(this, t.name) } />)}
				</ul>
				<Tabs index={ this.state.tabIndex } onTabChange={ this.setSimpleState.bind(this, "tabIndex") } boxed>
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
						<LayerPanel map={ this.props.map } layers={ this.props.layers } onSelect={ this.activateLayer.bind(this) } />
					</Tabs.Tab>
					<Tabs.Tab label="Map">
						<section>
							<TextInput label="Name" value={ this.state.mapName } onChange={ this.setMapName.bind(this) } />
							<TextInput label="Public URL" value={ this.props.map.url } onClick={ this.copyURL.bind(this) } rightIcon="copy" readOnly note="Click to copy public URL." />
						</section>
					</Tabs.Tab>
					<Tabs.Tab label="Images">
						<ImagePanel map={ this.props.map } images={ this.props.images } activeImage={ this.state.image ? this.state.image.path : null } onSelect={ this.setToolState.bind(this, "image") } />
					</Tabs.Tab>
				</Tabs>
			</nav>
			<PaperView canvasId="map" map={ this.props.map } layers={ this.props.layers } nodes={ this.props.nodes } mode={ MODE.EDIT } />
			<ZoomPanel onZoom={ this.setZoomLevel.bind(this) } />
			<Notification active={ this.state.copyActive } primary
				timeout={ 4000 }
				onClose={ this.setSimpleState.bind(this, "copyActive", false) }>
					{ this.state.copyMessage }
			</Notification>
		</div>;
	}
}
