
// react and react components
import React from "react";
import ReactDOM from "react-dom";
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


// Sunstone imports
import PaperView from "./components/PaperView.jsx";
import ColourPicker from "./components/ColourPicker.jsx";
import LayerPanel from "./components/LayerPanel.jsx";


// Sunstone tools
import Pen from "./tools/pen";
import Pan from "./tools/pan";
import Marker from "./tools/marker";
import Circle from "./tools/circle";
import Rectangle from "./tools/rectangle";
import Image from "./tools/image";
import { ZoomIn, ZoomOut, ZoomTo } from "./tools/zoom";

/*

selection tool
deleting of selected objects
editing of selected objects
editing of common state of multiple objects (maybe)

public state of objects for view version

image upload tool (how to save this?
move object tool)



*/



class App extends React.Component {
	constructor(props) {
		super(props);

		let database = firebase.database();

		this.ref = database.ref("/maps/map1")

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


			// text to firebase vars test
			text: "",
			value: "",

			// drawer state test
			expanded: false,

			// original example state
			drawerActive: false,
			drawerPinned: false,
			sidebarPinned: false
		}

		this.tools = [new Pan(), new Marker(), new Pen(), new Rectangle(), new Circle(), new Image()];
		this.zoom = [ZoomIn, ZoomOut];
	}

	componentDidMount() {
		this.ref.on("value", (snapshot) => {
			this.setState({
				value: snapshot.val()
			});
		});
	}

	componentWillUnmount() {
		this.ref.off();
	}

	toggleExpanded() {
		this.setState({ expanded: !this.state.expanded });
	}

	toggleSidebar() {
		this.setState({ sidebarPinned: !this.state.sidebarPinned });
	}

	changeHandler(value) {
		this.setState({
			text: value
		});
	}

	clickHandler() {
		this.ref.set(this.state.text);

		this.setState({
			text: ""
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

		// TODO what payload needs to be sent?
		// once a tool has finished its operation it MAY need to send data somewhere
		// should this be handled in APP or within the tool?
		let activated = active.activate(this.getToolParams());

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

	updateActiveTool() {
		if(this.state.activeTool && this.state.activeTool.update) {
			this.state.activeTool.update(this.getToolParams());
		}
	}

	// the parameters which are sent very tool
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
		return (
			<Layout>
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
								<ColourPicker caption="Foreground" onSelection={ this.setToolState.bind(this, "foreground") } colour={ this.state.foreground } />
								<ColourPicker caption="Background" onSelection={ this.setToolState.bind(this, "background") } colour={ this.state.background } />
							</List>
						</Tab>
						<Tab label="layers">
							<LayerPanel />
						</Tab>
					</Tabs>
				</NavDrawer>
				<Panel className="panel">
					<AppBar leftIcon='menu' onLeftIconClick={ this.toggleExpanded.bind(this) } title="Sunstone" />
					<PaperView canvasId="map" />
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
			</Layout>
		);
	}
}



/*


<ListSubHeader caption="Colours" />
							<ListItem caption="Foreground" onClick={ this.openColourPicker.bind(this, "foreground") } rightIcon={ this.state.colourPicker == "foreground" ? "check_box" : null } className={ this.state.colourPicker == "foreground" ? "active" : null }><span style={{ backgroundColor: this.state.foreground }} className="colour-display"></span></ListItem>
							{ this.state.colourPicker === "foreground" ? <ListItem><CirclePicker colors={ this.colours } onChangeComplete={ this.setColour.bind(this) } /></ListItem> : null }
							<ListItem caption="Background" onClick={ this.openColourPicker.bind(this, "background") } rightIcon={ this.state.colourPicker == "background" ? "check_box" : null } className={ this.state.colourPicker == "background" ? "active" : null }><span style={{ backgroundColor: this.state.background }} className="colour-display"></span></ListItem>
							{ this.state.colourPicker === "background" ? <ListItem><CirclePicker colors={ this.colours } onChangeComplete={ this.setColour.bind(this) } /></ListItem> : null }



<div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
						<Welcome message="Welcome Heading" />
						<Input type="text" value={ this.state.text } onChange={ this.changeHandler.bind(this) } />
						<Button raised primary icon="bookmark" onClick={ this.clickHandler.bind(this) }>Update</Button>
						<Value text={ this.state.value } />
					</div>

class App extends React.Component {
	constructor(props) {
		super(props);

		let database = firebase.database();

		this.ref = database.ref("/maps/map1")
		this.state = {
			text: "",
			value: "",
			open: false
		};
	}

	componentDidMount() {
		this.ref.on("value", (snapshot) => {
			this.setState({
				value: snapshot.val()
			});
		});
	}

	componentWillUnmount() {
		this.ref.off();
	}

	handleDrawerClose() {
		this.setState({
			open: false
		});
	}

	handleDrawerOpen() {
		this.setState({
			open: true
		});
	}

	changeHandler(value) {
		this.setState({
			text: value
		});
	}

	clickHandler() {
		this.ref.set(this.state.text);

		this.setState({
			text: ""
		});
	}

	render() {
		return <div>
			<AppBar title="Sunstone" leftIcon="menu" onLeftIconClick={ this.handleDrawerOpen.bind(this) } />
			<Drawer active={ this.state.open } onOverlayClick={ this.handleDrawerClose.bind(this) }>
				Left nav content
			</Drawer>

			<Welcome message="Welcome Heading" />
			<Input type="text" value={ this.state.text } onChange={ this.changeHandler.bind(this) } />
			<Button raised primary icon="bookmark" onClick={ this.clickHandler.bind(this) }>Update</Button>
			<Value text={ this.state.value } />
		</div>;
	}
}
*/


ReactDOM.render(
	<App />,
	document.getElementById("container")
);


