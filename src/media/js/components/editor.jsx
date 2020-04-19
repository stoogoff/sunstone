
// react and react components
import React from "react";
import { CirclePicker } from "react-color";

// react toolbox ui imports
import AppBar from 'react-toolbox/lib/app_bar';
import Checkbox from 'react-toolbox/lib/checkbox';
import { IconButton, Button } from 'react-toolbox/lib/button';
import { Layout, NavDrawer, Panel } from 'react-toolbox/lib/layout';
import Input from 'react-toolbox/lib/input';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Chip from 'react-toolbox/lib/chip';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import Slider from 'react-toolbox/lib/slider';
import Avatar from 'react-toolbox/lib/avatar';
import { Tab, Tabs } from 'react-toolbox/lib/tabs';
import { Snackbar } from 'react-toolbox/lib/snackbar';

// Sunstone components
import PaperView from "../components/paper-view.jsx";
import ColourPicker from "../components/colour-picker.jsx";
import LayerPanel from "../components/layer-panel.jsx";

// Sunstone tools
import Pen from "../tools/pen";
import Pan from "../tools/pan";
import Marker from "../tools/marker";
import Circle from "../tools/circle";
import Rectangle from "../tools/rectangle";
import Image from "../tools/image";
import { ZoomIn, ZoomOut, ZoomTo } from "../tools/zoom";

// Sunstone utils
import dispatcher  from "../lib/dispatcher";
import { MODE } from "../lib/config";
import { MAP_EDIT, NODE_CREATE } from "../lib/action-keys";

/*

selection tool
deleting of selected objects
editing of selected objects
editing of common state of multiple objects (maybe)

public state of objects for view version

image upload tool (how to save this?)
move object tool



*/






export default class Editor extends React.Component {
	constructor(props) {
		super(props);

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

			// original example state
			drawerActive: false,
			drawerPinned: false,
			sidebarPinned: false
		}

		this.tools = [new Pan()];

		// add extra tools if not in view mode
		if(this.props.mode == MODE.EDIT) {
			this.tools = this.tools.concat([new Marker(), new Pen(), new Rectangle(), new Circle(), new Image()]);
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

	// START probably not needed
	toggleExpanded() {
		this.setState({ expanded: !this.state.expanded });
	}
	// END

	copyURL() {
		navigator.clipboard.writeText(this.props.map.url).then(() => {
			this.setState({
				copyMessage: `Link ${this.props.map.url} copied to clipboard.`,
				copyActive: true
			})
		});
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

			dispatcher.dispatch(NODE_CREATE, payload);
		});

		if(activated) {
			this.setState({
				activeTool: active
			});
		}
	}

	setToolState(type, value) {
		this.setSimpleState(type, value);
		this.updateActiveTool();
	}

	setSimpleState(type, value) {
		this.setState({
			[type]: value
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
			console.log("Editor.render: no map, returning early")
			return null;
		}

		return (
			<Layout>
				{ this.props.mode == MODE.EDIT ?
					<NavDrawer pinned={ true } className="drawer">
						<List selectable>
							<ListItem rightIcon="chevron_left" onClick={ this.toggleExpanded.bind(this) } />
							<ListDivider />
							<ListSubHeader caption="Tools" />
							{ this.tools.map(t => <ListItem caption={ t.name } rightIcon={ t === this.state.activeTool ? "check_box" : null } className={ t === this.state.activeTool ? "active" : null } leftIcon={ t.icon } onClick={ this.activateTool.bind(this, t.name) }/>)}
						</List>
						<Tabs index={ this.state.tabIndex } onChange={ this.setSimpleState.bind(this, "tabIndex") }>
							<Tab label="Tools">
								<List selectable>
									<ListSubHeader caption="Opacity" />
									<li><Slider min={ 0 } max={ 1 } editable value={ this.state.opacity } onChange={ this.setToolState.bind(this, "opacity") } /></li>
									<ListDivider />
									<ListSubHeader caption="Line Width" />
									<li><Slider min={ 0 } max={ 5 } step={ 1 } editable value={ this.state.width } onChange={ this.setToolState.bind(this, "width") } /></li>
									<ListDivider />
									<ListSubHeader caption="Tool Colours" />
									<ColourPicker caption="Foreground / Border" onSelection={ this.setToolState.bind(this, "foreground") } colour={ this.state.foreground } />
									<ColourPicker caption="Background" onSelection={ this.setToolState.bind(this, "background") } colour={ this.state.background } />
								</List>
							</Tab>
							<Tab label="Layers">
								<LayerPanel map={ this.props.map } layers={ this.props.layers } />
							</Tab>
							<Tab label="Map">
								<section>
									<Input type="text" label="Name" value={ this.state.mapName } onChange={ this.setMapName.bind(this) } className="map-input" />
									<div onClick={ this.copyURL.bind(this) }><Input type="text" label="Public URL" icon="file_copy" value={ this.props.map.url } className="map-input icon-after readonly" /></div>
								</section>
							</Tab>
						</Tabs>
					</NavDrawer>
				: null }
				<Panel className="panel">
					<AppBar leftIcon='menu' onLeftIconClick={ this.toggleExpanded.bind(this) } title="Sunstone" fixed>
						{ this.state.mapName }
					</AppBar>
					<PaperView canvasId="map" layers={ this.props.layers } nodes={ this.props.nodes } />
				</Panel>
				<Chip className="zoom">
					<Avatar icon="zoom_in" />
					{ this.zoom.map(z => <IconButton icon={ z.icon } onClick={ z.activate.bind(z) } />)}
					<IconMenu icon="more_vert">
						<MenuItem caption="500%" onClick={ ZoomTo.activate.bind(ZoomTo, 5) } />
						<MenuItem caption="250%" onClick={ ZoomTo.activate.bind(ZoomTo, 2.5) } />
						<MenuItem caption="100%" onClick={ ZoomTo.activate.bind(ZoomTo, 1) } />
						<MenuItem caption="50%" onClick={ ZoomTo.activate.bind(ZoomTo, 0.5) } />
					</IconMenu>
				</Chip>
				<Snackbar
					action="Dismiss"
					label={ this.state.copyMessage }
					active={ this.state.copyActive }
					timeout={ 4000 }
					onTimeout={ this.setSimpleState.bind(this, "copyActive", false) }
					onClick={ this.setSimpleState.bind(this, "copyActive", false) }
					type="accept" />
			</Layout>
		);
	}
}
