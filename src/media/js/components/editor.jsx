
// react and react components
import React from "react";
import { CirclePicker } from "react-color";

// react toolbox ui imports
//import AppBar from 'react-toolbox/lib/app_bar';
//import Checkbox from 'react-toolbox/lib/checkbox';
//import { IconButton } from 'react-toolbox/lib/button';
//import { Layout, NavDrawer, Panel } from 'react-toolbox/lib/layout';
//import Input from 'react-toolbox/lib/input';
//import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
//import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
//import Slider from 'react-toolbox/lib/slider';
//import Avatar from 'react-toolbox/lib/avatar';
//import { Tab, Tabs } from 'react-toolbox/lib/tabs';
//import { Snackbar } from 'react-toolbox/lib/snackbar';
//import Navigation from 'react-toolbox/lib/navigation';
//import FontIcon from 'react-toolbox/lib/font_icon';
//import Chip from 'react-toolbox/lib/chip';


// semantic-ui imports
// TODO switch everything over to this
//import { Chip } from '@material-ui/core'
//import { Button, Menu, Grid, Icon, Sidebar, Tab } from 'semantic-ui-react';


import Menu from "./menu.jsx";
import Button from "./button.jsx";

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
import Delete from "../tools/delete";
import { ZoomIn, ZoomOut, ZoomTo } from "../tools/zoom";

// Sunstone utils
import dispatcher  from "../lib/dispatcher";
import { MODE } from "../lib/config";
import { MAP_EDIT, NODE_CREATE, NODE_DELETE } from "../lib/action-keys";
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
		this.updateActiveTool();
	}

	setSimpleState(type, value) {
		this.setState({
			[type]: value
		});
	}

	toggleSimpleState(type) {
		let currentState = this.state[type];

		console.log("toggleSimpleState: " + currentState)


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

		let activeLayer = this.props.layers ? this.props.layers.find(findByProperty("active", true)) :null;

		return (
			<div>
				<header id="navbar" className="has-background-dark has-text-light level">
					<div className="level-left">
						<h1 className="has-text-light title is-4">
							Sunstone
						</h1>
					</div>
					<div id="menu" className="level-right">
						{ activeLayer ? <div className="is-dark">
							<span className="icon"><i className="fas fa-layer-group"></i></span>
							{ activeLayer.name }
						</div> : null }
						<div className="button is-dark">
							<span className="icon"><i className="fas fa-square" style={ {color: this.state.foreground} }></i></span>
							<span>Foreground</span>
						</div>
						<Button label="Background" icon="square" dark />
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
							<li className="button is-fullwidth is-outlined">
								<span className="icon is-large" onClick={ this.toggleSimpleState.bind(this, "expanded") }><i className="fas fa-chevron-left"></i></span>
							</li>
							{ this.tools.map(t => {
								let cls = "button is-fullwidth " + (t === this.state.activeTool ? "is-warning" : "is-outlined");

								return <li className={ cls } onClick={ this.activateTool.bind(this, t.name) }>
									<span>{ t.name }</span>
									<span className="icon"><i className={ `fas fa-${t.icon}` }></i></span>
								</li>
							})}
						</ul>
					</nav>
					: null }
				<PaperView canvasId="map" layers={ this.props.layers } nodes={ this.props.nodes } mode={ this.props.mode } />
				<span id="zoom" className="tag is-medium" >
					<span className="icon is-large"><i className="fas fa-2x fa-search-plus"></i></span>
					{ this.zoom.map(z => <Button text small icon={ z.icon } onClick={ z.activate.bind(z) } />)}
					<Menu up right button-text>
						<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 5) }>500%</Menu.Item>
						<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 2.5) }>250%</Menu.Item>
						<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 1) }>100%</Menu.Item>
						<Menu.Item onClick={ ZoomTo.activate.bind(ZoomTo, 0.5) }>50%</Menu.Item>
					</Menu>
				</span>
			</div>
		);
	}
}


/*


					{ this.zoom.map(z => <button className="button is-small is-text" onClick={ z.activate.bind(z) }>
						<span className="icon is-small"><i className={ `fas fa-${z.icon}` }></i></span>
					</button>)}


					<div className="dropdown is-active is-up is-right">
						<div className="dropdown-trigger">
							<button className="button is-small is-text" aria-haspopup="true" aria-controls="dropdown-menu">
								<span className="icon is-small"><i className="fas fa-chevron-up"></i></span>
							</button>
						</div>
						<div className="dropdown-menu" role="menu">
							<div className="dropdown-content">
								<a className="dropdown-item" onClick={ ZoomTo.activate.bind(ZoomTo, 5) }>500%</a>
								<a className="dropdown-item" onClick={ ZoomTo.activate.bind(ZoomTo, 2.5) }>250%</a>
								<a className="dropdown-item" onClick={ ZoomTo.activate.bind(ZoomTo, 1) }>100%</a>
								<a className="dropdown-item" onClick={ ZoomTo.activate.bind(ZoomTo, 0.5) }>50%</a>
							</div>
						</div>
					</div>


							<Tab index={ this.state.tabIndex } onChange={ this.setSimpleState.bind(this, "tabIndex") }>
								<Tab.Pane menuItem="Tools">
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
								</Tab.Pane>
								<Tab.Pane menuItem="Layers">
									<LayerPanel map={ this.props.map } layers={ this.props.layers } />
								</Tab.Pane>
								<Tab.Pane menuItem="Map">
									<section>
										<Input type="text" label="Name" value={ this.state.mapName } onChange={ this.setMapName.bind(this) } className="map-input" />
										<div onClick={ this.copyURL.bind(this) }><Input type="text" label="Public URL" icon="file_copy" value={ this.props.map.url } className="map-input icon-after readonly" /></div>
									</section>
								</Tab.Pane>
							</Tab>


	<nav id="tools" class="has-background-light">
		<ul class="menu">
			<li class="button is-fullwidth is-outlined">
				<span class="icon is-large" onclick="toggle()"><i class="fas fa-chevron-left"></i></span>
			</li>
			<li class="button is-fullwidth is-outlined">
				<span>Pen</span>
				<span class="icon"><i class="fas fa-paint-brush"></i></span>
			</li>
			<li class="button is-fullwidth is-warning"><!-- use is-primary variant for active state -->
				<span>Marker</span>
				<span class="icon"><i class="fas fa-brush"></i></span>
			</li>
		</ul>
	</nav>
	<canvas id="map"></canvas>
	<span id="zoom" class="tag is-medium" >
		<span class="icon is-large"><i class="fas fa-2x fa-search-plus"></i></span>
		<button class="button is-small is-text">
			<span class="icon is-small"><i class="fas fa-plus"></i></span>
		</button>
		<button class="button is-small is-text">
			<span class="icon is-small"><i class="fas fa-minus"></i></span>
		</button>
		<div class="dropdown">
			<div class="dropdown-trigger">
				<button class="button is-small is-text" aria-haspopup="true" aria-controls="dropdown-menu">
					<span class="icon is-small"><i class="fas fa-chevron-up"></i></span>
				</button>
			</div>
		</div>
	</span>




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

*/