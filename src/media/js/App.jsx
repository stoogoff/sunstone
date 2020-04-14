
// react and react components
import React from "react";
import ReactDOM from "react-dom";
import { TwitterPicker } from "react-color";


// react toolbox ui imports
import AppBar from 'react-toolbox/lib/app_bar';
import Checkbox from 'react-toolbox/lib/checkbox';
import { IconButton, Button } from 'react-toolbox/lib/button';
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox/lib/layout';
import Input from 'react-toolbox/lib/input';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Chip from 'react-toolbox/lib/chip';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';


// Sunstone imports
import PaperView from "./components/PaperView.jsx"
import { Pen } from "./tools/pen";
import { Pan } from "./tools/pan";
import { ZoomIn, ZoomOut, ZoomTo } from "./tools/zoom";
import { Marker } from "./tools/marker";



/*import Button from 'react-toolbox/lib/button';
import Drawer from 'react-toolbox/lib/drawer';
import AppBar from 'react-toolbox/lib/app_bar';
*/

import Value from "./components/Value.jsx";
import Welcome from "./components/Welcome.jsx";


class App extends React.Component {
	constructor(props) {
		super(props);

		let database = firebase.database();

		this.ref = database.ref("/maps/map1")

		this.state = {
			activeTool: null,
			foreground: "black",
			background: "white",
			colourPicker: null,


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


		console.log(new Pen())

		this.tools = [Pan, Marker, new Pen()];
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

		// randomly set a colour for now
		let colours = ["red", "green", "blue", "orange"];
		let colour = colours[Math.floor(Math.random() * colours.length)];

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

	openColourPicker(type) {
		this.setState({
			colourPicker: type
		});
	}

	setColour(colour) {
		let type = this.state.colourPicker

		this.setState({
			colourPicker: null,
			[type]: colour.hex
		});

		if(this.state.activeTool && this.state.activeTool.update) {
			console.log(this.getToolParams())
			this.state.activeTool.update(this.getToolParams());
		}
	}

	getToolParams() {
		return {
			foreground: this.state.foreground,
			background: this.state.background
		};
	}

	render() {
		return (
			<Layout>
				<NavDrawer pinned={ true } className="drawer">
					<List selectable ripple>
						<ListItem rightIcon="chevron_left" onClick={ this.toggleExpanded.bind(this) } />
						<ListDivider />
						{ this.tools.map(t => <ListItem caption={ t.name } className={ t === this.state.activeTool ? "active" : "" } leftIcon={ t.icon } onClick={ this.activateTool.bind(this, t.name) }/>)}
					</List>
					<footer>
						<p>Custom tools depending on selected tool will need to be added here</p>

						<div>
							{ this.state.colourPicker === "foreground" ? <TwitterPicker onChangeComplete={ this.setColour.bind(this) } /> : null }
							<span onClick={ this.openColourPicker.bind(this, "foreground") }><span style={{ backgroundColor: this.state.foreground }} className="colour-display"></span>Foreground</span>
							{ this.state.colourPicker === "background" ? <TwitterPicker onChangeComplete={ this.setColour.bind(this) } /> : null }
							<span onClick={ this.openColourPicker.bind(this, "background") }><span style={{ backgroundColor: this.state.background }} className="colour-display"></span>Background</span>
						</div>
					</footer>
				</NavDrawer>
				<Panel className="panel">
					<AppBar leftIcon='menu' onLeftIconClick={ this.toggleExpanded.bind(this) } title="Sunstone" />
					<PaperView canvasId="map" />
				</Panel>
				<Sidebar pinned={ this.state.sidebarPinned } width={ 5 }>
					<div><IconButton icon='close' onClick={ this.toggleSidebar.bind(this) }/></div>
					<div style={{ flex: 1 }}>
						<p>Supplemental content goes here.</p>
					</div>
				</Sidebar>
				<Chip className="zoom">
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



/*


			<AppBar position="absolute">
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="open drawer" onClick={ this.handleDrawerOpen.bind(this) }>
						<Menu />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer open={ this.state.open }>
				<div>
					<IconButton onClick={ this.handleDrawerClose.bind(this) }>
						<ChevronLeft />
					</IconButton>
				</div>
				<Divider />
				<List>
				{ ['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
					<ListItem button key={ text }>
						<ListItemIcon><AccessAlarm /></ListItemIcon>
						<ListItemText primary={ text } />
					</ListItem>
				))}
				</List>
			</Drawer>



*/