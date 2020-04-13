
import React from "react";
import ReactDOM from "react-dom";

import AppBar from 'react-toolbox/lib/app_bar';
import Checkbox from 'react-toolbox/lib/checkbox';
import { IconButton, Button } from 'react-toolbox/lib/button';
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox/lib/layout';
import Input from 'react-toolbox/lib/input';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';


import PaperView from "./components/PaperView.jsx"
import { Pen1, Pen2 } from "./tools/pen";



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
			// text to firebase vars
			text: "",
			value: "",

			// drawer state
			expanded: false,

			// old state vars
			drawerActive: false,
			drawerPinned: false,
			sidebarPinned: false
		}


	}

	componentDidMount() {
		this.ref.on("value", (snapshot) => {
			this.setState({
				value: snapshot.val()
			});
		});

		this.tools = {
			"pen1": Pen1,
			"pen2": Pen2
		}
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

	activateTool(type) {
		console.log("activating", type)

		let active = this.tools[type].activate();

		console.log("activated?", active)

		console.log(this.tools[type])
	}

	render() {
		return (
			<Layout>
				<NavDrawer pinned={ true } className="drawer">
					<List selectable ripple>
						<ListItem rightIcon="chevron_left" onClick={ this.toggleExpanded.bind(this) } />
						<ListDivider />
						<ListItem caption='Pen 1' leftIcon='send' onClick={ this.activateTool.bind(this, "pen1") }/>
						<ListItem caption='Pen 2' leftIcon='delete' onClick={ this.activateTool.bind(this, "pen2") }/>
					</List>
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
		</Layout>);
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