
import React from "react";
import ReactDOM from "react-dom";

// react toolbox componemts
import Dialog from 'react-toolbox/lib/dialog';
import ProgressBar from 'react-toolbox/lib/progress_bar';

// base component
import Editor from "./components/editor.jsx";

// various utils
import dispatcher from "./lib/dispatcher";
import { local } from "./lib/local-store";
import { MODE, STORAGE_KEYS, DEFAULT_MAP, DEFAULT_LAYER } from "./lib/config";

import { MAP_CREATE, MAP_LOAD, NODE_LOAD_COMPLETE, LAYER_LOAD_COMPLETE, LAYER_CREATE } from "./lib/action-keys";

import { createId } from "./lib/utils";

import mapHandler from "./handlers/maps";
import layerHandler from "./handlers/layers";
import nodeHandler from "./handlers/nodes";


// TODO there should be a facility for creating a new ID
// TODO there should be a facility to ensure created map ids don't clash - so there needs to be a user prefix or something
// TODO facility for multiple maps


class App extends React.Component {
	constructor(props) {
		super(props);

		// load the default map
		this.state = {
			map: null,
			layers: null,
			nodes: null
		};

		this.ref;
	}

	componentDidMount() {
		this.ref = dispatcher.subscribe((action, state) => {
			console.log("subscribe", action)
			console.log(state)

			// it would be great if this could just update the component state with the provided state and do nothig else

			// if layers have loaded and the array is empty, create a new one
			// otherwise, loading is complete and state should be set
			if(action == LAYER_LOAD_COMPLETE && state.layers.length == 0) {
				if(state.layers.length == 0) {
					console.log("App.componentDidMount: no layers, creating empty layer")
					dispatcher.dispatch(LAYER_CREATE, {
						id: createId(),
						name: DEFAULT_LAYER,
						map: this.state.map.id,
						visible: true
					});
				}
			}
			else {
				this.setState({
					map: state.maps ? state.maps[0] : null,
					nodes: state.nodes,
					layers: state.layers
				});
			}
		});

		dispatcher.register("maps", mapHandler);
		dispatcher.register("layers", layerHandler);
		dispatcher.register("nodes", nodeHandler);
		/*dispatcher.register("mapIndex", (state = -1, action, payload) => {
			if(action == MAP_SELECT) {
				console.log("selecting map", payload)
				return payload;
			}
		})*/

/*

process when first visiting

- create default map (MAP_CREATE name: Default Map)
- send data to firebase (How?)
	- firebase returns with a unique map id
- MAP_SELECT is called
- save to local

second visit

- load map from local storage
- get the full data from firebase

*/


		// if there is a map in the local store, select it
		if(local.has(STORAGE_KEYS.MAP_LOCAL)) {
			console.log("a map exists in local storage")
			//dispatcher.dispatch(MAP_SELECT, 0);
			console.log("from store", local.get(STORAGE_KEYS.MAP_LOCAL))
			dispatcher.dispatch(MAP_LOAD, local.get(STORAGE_KEYS.MAP_LOCAL));
		}
		else {
			console.log("no stored map so creating a new one")
			dispatcher.dispatch(MAP_CREATE, {
				name: DEFAULT_MAP
			});
		}
	}

	componentWillUnmount() {
		if(this.ref) {
			dispatcher.unsubscribe(this.ref);
		}
	}

	render() {
		console.log("App.render")
		console.log("map", this.state.map)
		console.log("layers", this.state.layers)
		console.log("nodes", this.state.nodes)

		let mapName = this.state.map ? this.state.map.name : null;
		let dialogueIsActive = this.state.layers == null || this.state.layers.length == 0;

		return <div>
			<Editor map={ this.state.map } nodes={ this.state.nodes } layers={ this.state.layers } mode={ MODE.EDIT } />
			<Dialog title="Loading map" active={ dialogueIsActive }>
				<ProgressBar type="linear" mode="indeterminate" />
				{ mapName ? <p>Loading map data for <strong>{ mapName }</strong>.</p> : <p>Loading map data.</p>}
			</Dialog>
		</div>;
	}
}

/*
import {

Menu,
Container,
Header,
Grid,
Sidebar,
Icon,
Segment

} from 'semantic-ui-react';


let App2 = () => (
	<div>
		<Menu fixed="top" inverted borderless>
			<Menu.Header>
				<Icon name="bars" />
				Sunstone
			</Menu.Header>
			<Menu.Item name="login">Login</Menu.Item>
			<Menu.Item name="register">Register</Menu.Item>
		</Menu>
		<Container>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget libero sit amet orci iaculis feugiat. Cras luctus ut urna non mollis. Morbi faucibus ipsum sem, sit amet aliquam lorem luctus eu. Nunc tempus nulla eu consequat pretium. Phasellus luctus sem in enim elementum placerat. Suspendisse pulvinar dignissim fermentum. Suspendisse porta gravida est, sit amet lobortis massa commodo nec. Praesent commodo ligula nunc, sit amet dictum nunc suscipit sed. Vivamus rhoncus quam nec consectetur condimentum. In aliquet dolor justo, ut placerat nunc faucibus non. Vivamus in volutpat tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ornare felis et ultrices vestibulum. Donec sed maximus nisi, a hendrerit urna. Phasellus sed dignissim nunc. Sed eu felis non enim pellentesque dignissim.</p>
			<p>Pellentesque tincidunt interdum dui et elementum. Suspendisse potenti. Praesent quam lacus, interdum at tristique vel, mollis tristique tortor. Quisque id libero vitae tortor porttitor pulvinar id vitae risus. Aenean molestie, velit non molestie maximus, dui nunc consequat lorem, a blandit nunc magna quis turpis. Duis sed leo a lacus commodo ultrices. Cras ut eros elementum, tincidunt arcu sagittis, consectetur est. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris auctor massa leo. Quisque sollicitudin placerat dolor vitae ultrices. Donec est purus, congue non imperdiet bibendum, elementum a mi. Praesent sagittis erat nec mauris tincidunt, nec molestie tellus egestas. Cras neque tellus, volutpat ac luctus ac, vulputate sit amet elit.</p>
			<p>Morbi varius lectus nec iaculis blandit. Aliquam ut lacus iaculis, varius orci in, molestie augue. Fusce pretium tincidunt massa, id placerat sapien commodo non. Nulla varius ornare elit, in tincidunt purus malesuada vel. Suspendisse potenti. Nulla facilisi. Phasellus dignissim dapibus enim quis ullamcorper. Nunc felis turpis, blandit non rutrum a, hendrerit eu ligula.</p>
			<p>Fusce hendrerit libero sed elit pulvinar bibendum. Donec aliquam arcu nunc, sit amet vulputate ante luctus lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae semper nibh, eu vehicula nibh. In quis aliquet lectus. Fusce at elit quam. Vestibulum pulvinar varius tellus id bibendum. Sed ultricies, augue in mattis malesuada, velit mauris viverra enim, vitae hendrerit nunc quam sed dui. Praesent lacus erat, feugiat imperdiet bibendum eu, aliquet eu diam. Donec iaculis fringilla libero eu dapibus. Nam ornare ex et lectus tincidunt molestie. Ut nulla mi, ultricies at elit sit amet, tempor volutpat augue. Nam luctus, nibh ac sodales tincidunt, purus lorem dignissim metus, a molestie ante lacus ut urna. Mauris eget nisi lacus. Sed euismod mauris ex, finibus volutpat neque sodales mollis.</p>
			<p>Pellentesque malesuada ex nisi, a ullamcorper tortor lacinia vitae. Duis commodo congue lorem in dignissim. Suspendisse orci velit, placerat id odio et, egestas posuere lacus. Sed nec nisi enim. Proin sed diam in tellus lobortis pellentesque quis sit amet nulla. Morbi fringilla elementum rhoncus. Ut id purus a diam tincidunt dignissim sodales ut purus. Sed sollicitudin augue id erat iaculis mattis. Vestibulum sodales justo mauris, vitae sodales erat tincidunt in. Vivamus porttitor, velit eu auctor euismod, mi metus tempor felis, ut feugiat nulla enim ut sem. Praesent consequat interdum elit varius facilisis.</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget libero sit amet orci iaculis feugiat. Cras luctus ut urna non mollis. Morbi faucibus ipsum sem, sit amet aliquam lorem luctus eu. Nunc tempus nulla eu consequat pretium. Phasellus luctus sem in enim elementum placerat. Suspendisse pulvinar dignissim fermentum. Suspendisse porta gravida est, sit amet lobortis massa commodo nec. Praesent commodo ligula nunc, sit amet dictum nunc suscipit sed. Vivamus rhoncus quam nec consectetur condimentum. In aliquet dolor justo, ut placerat nunc faucibus non. Vivamus in volutpat tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ornare felis et ultrices vestibulum. Donec sed maximus nisi, a hendrerit urna. Phasellus sed dignissim nunc. Sed eu felis non enim pellentesque dignissim.</p>
			<p>Pellentesque tincidunt interdum dui et elementum. Suspendisse potenti. Praesent quam lacus, interdum at tristique vel, mollis tristique tortor. Quisque id libero vitae tortor porttitor pulvinar id vitae risus. Aenean molestie, velit non molestie maximus, dui nunc consequat lorem, a blandit nunc magna quis turpis. Duis sed leo a lacus commodo ultrices. Cras ut eros elementum, tincidunt arcu sagittis, consectetur est. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris auctor massa leo. Quisque sollicitudin placerat dolor vitae ultrices. Donec est purus, congue non imperdiet bibendum, elementum a mi. Praesent sagittis erat nec mauris tincidunt, nec molestie tellus egestas. Cras neque tellus, volutpat ac luctus ac, vulputate sit amet elit.</p>
			<p>Morbi varius lectus nec iaculis blandit. Aliquam ut lacus iaculis, varius orci in, molestie augue. Fusce pretium tincidunt massa, id placerat sapien commodo non. Nulla varius ornare elit, in tincidunt purus malesuada vel. Suspendisse potenti. Nulla facilisi. Phasellus dignissim dapibus enim quis ullamcorper. Nunc felis turpis, blandit non rutrum a, hendrerit eu ligula.</p>
			<p>Fusce hendrerit libero sed elit pulvinar bibendum. Donec aliquam arcu nunc, sit amet vulputate ante luctus lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae semper nibh, eu vehicula nibh. In quis aliquet lectus. Fusce at elit quam. Vestibulum pulvinar varius tellus id bibendum. Sed ultricies, augue in mattis malesuada, velit mauris viverra enim, vitae hendrerit nunc quam sed dui. Praesent lacus erat, feugiat imperdiet bibendum eu, aliquet eu diam. Donec iaculis fringilla libero eu dapibus. Nam ornare ex et lectus tincidunt molestie. Ut nulla mi, ultricies at elit sit amet, tempor volutpat augue. Nam luctus, nibh ac sodales tincidunt, purus lorem dignissim metus, a molestie ante lacus ut urna. Mauris eget nisi lacus. Sed euismod mauris ex, finibus volutpat neque sodales mollis.</p>
			<p>Pellentesque malesuada ex nisi, a ullamcorper tortor lacinia vitae. Duis commodo congue lorem in dignissim. Suspendisse orci velit, placerat id odio et, egestas posuere lacus. Sed nec nisi enim. Proin sed diam in tellus lobortis pellentesque quis sit amet nulla. Morbi fringilla elementum rhoncus. Ut id purus a diam tincidunt dignissim sodales ut purus. Sed sollicitudin augue id erat iaculis mattis. Vestibulum sodales justo mauris, vitae sodales erat tincidunt in. Vivamus porttitor, velit eu auctor euismod, mi metus tempor felis, ut feugiat nulla enim ut sem. Praesent consequat interdum elit varius facilisis.</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget libero sit amet orci iaculis feugiat. Cras luctus ut urna non mollis. Morbi faucibus ipsum sem, sit amet aliquam lorem luctus eu. Nunc tempus nulla eu consequat pretium. Phasellus luctus sem in enim elementum placerat. Suspendisse pulvinar dignissim fermentum. Suspendisse porta gravida est, sit amet lobortis massa commodo nec. Praesent commodo ligula nunc, sit amet dictum nunc suscipit sed. Vivamus rhoncus quam nec consectetur condimentum. In aliquet dolor justo, ut placerat nunc faucibus non. Vivamus in volutpat tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ornare felis et ultrices vestibulum. Donec sed maximus nisi, a hendrerit urna. Phasellus sed dignissim nunc. Sed eu felis non enim pellentesque dignissim.</p>
			<p>Pellentesque tincidunt interdum dui et elementum. Suspendisse potenti. Praesent quam lacus, interdum at tristique vel, mollis tristique tortor. Quisque id libero vitae tortor porttitor pulvinar id vitae risus. Aenean molestie, velit non molestie maximus, dui nunc consequat lorem, a blandit nunc magna quis turpis. Duis sed leo a lacus commodo ultrices. Cras ut eros elementum, tincidunt arcu sagittis, consectetur est. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris auctor massa leo. Quisque sollicitudin placerat dolor vitae ultrices. Donec est purus, congue non imperdiet bibendum, elementum a mi. Praesent sagittis erat nec mauris tincidunt, nec molestie tellus egestas. Cras neque tellus, volutpat ac luctus ac, vulputate sit amet elit.</p>
			<p>Morbi varius lectus nec iaculis blandit. Aliquam ut lacus iaculis, varius orci in, molestie augue. Fusce pretium tincidunt massa, id placerat sapien commodo non. Nulla varius ornare elit, in tincidunt purus malesuada vel. Suspendisse potenti. Nulla facilisi. Phasellus dignissim dapibus enim quis ullamcorper. Nunc felis turpis, blandit non rutrum a, hendrerit eu ligula.</p>
			<p>Fusce hendrerit libero sed elit pulvinar bibendum. Donec aliquam arcu nunc, sit amet vulputate ante luctus lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae semper nibh, eu vehicula nibh. In quis aliquet lectus. Fusce at elit quam. Vestibulum pulvinar varius tellus id bibendum. Sed ultricies, augue in mattis malesuada, velit mauris viverra enim, vitae hendrerit nunc quam sed dui. Praesent lacus erat, feugiat imperdiet bibendum eu, aliquet eu diam. Donec iaculis fringilla libero eu dapibus. Nam ornare ex et lectus tincidunt molestie. Ut nulla mi, ultricies at elit sit amet, tempor volutpat augue. Nam luctus, nibh ac sodales tincidunt, purus lorem dignissim metus, a molestie ante lacus ut urna. Mauris eget nisi lacus. Sed euismod mauris ex, finibus volutpat neque sodales mollis.</p>
			<p>Pellentesque malesuada ex nisi, a ullamcorper tortor lacinia vitae. Duis commodo congue lorem in dignissim. Suspendisse orci velit, placerat id odio et, egestas posuere lacus. Sed nec nisi enim. Proin sed diam in tellus lobortis pellentesque quis sit amet nulla. Morbi fringilla elementum rhoncus. Ut id purus a diam tincidunt dignissim sodales ut purus. Sed sollicitudin augue id erat iaculis mattis. Vestibulum sodales justo mauris, vitae sodales erat tincidunt in. Vivamus porttitor, velit eu auctor euismod, mi metus tempor felis, ut feugiat nulla enim ut sem. Praesent consequat interdum elit varius facilisis.</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget libero sit amet orci iaculis feugiat. Cras luctus ut urna non mollis. Morbi faucibus ipsum sem, sit amet aliquam lorem luctus eu. Nunc tempus nulla eu consequat pretium. Phasellus luctus sem in enim elementum placerat. Suspendisse pulvinar dignissim fermentum. Suspendisse porta gravida est, sit amet lobortis massa commodo nec. Praesent commodo ligula nunc, sit amet dictum nunc suscipit sed. Vivamus rhoncus quam nec consectetur condimentum. In aliquet dolor justo, ut placerat nunc faucibus non. Vivamus in volutpat tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ornare felis et ultrices vestibulum. Donec sed maximus nisi, a hendrerit urna. Phasellus sed dignissim nunc. Sed eu felis non enim pellentesque dignissim.</p>
			<p>Pellentesque tincidunt interdum dui et elementum. Suspendisse potenti. Praesent quam lacus, interdum at tristique vel, mollis tristique tortor. Quisque id libero vitae tortor porttitor pulvinar id vitae risus. Aenean molestie, velit non molestie maximus, dui nunc consequat lorem, a blandit nunc magna quis turpis. Duis sed leo a lacus commodo ultrices. Cras ut eros elementum, tincidunt arcu sagittis, consectetur est. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris auctor massa leo. Quisque sollicitudin placerat dolor vitae ultrices. Donec est purus, congue non imperdiet bibendum, elementum a mi. Praesent sagittis erat nec mauris tincidunt, nec molestie tellus egestas. Cras neque tellus, volutpat ac luctus ac, vulputate sit amet elit.</p>
			<p>Morbi varius lectus nec iaculis blandit. Aliquam ut lacus iaculis, varius orci in, molestie augue. Fusce pretium tincidunt massa, id placerat sapien commodo non. Nulla varius ornare elit, in tincidunt purus malesuada vel. Suspendisse potenti. Nulla facilisi. Phasellus dignissim dapibus enim quis ullamcorper. Nunc felis turpis, blandit non rutrum a, hendrerit eu ligula.</p>
			<p>Fusce hendrerit libero sed elit pulvinar bibendum. Donec aliquam arcu nunc, sit amet vulputate ante luctus lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae semper nibh, eu vehicula nibh. In quis aliquet lectus. Fusce at elit quam. Vestibulum pulvinar varius tellus id bibendum. Sed ultricies, augue in mattis malesuada, velit mauris viverra enim, vitae hendrerit nunc quam sed dui. Praesent lacus erat, feugiat imperdiet bibendum eu, aliquet eu diam. Donec iaculis fringilla libero eu dapibus. Nam ornare ex et lectus tincidunt molestie. Ut nulla mi, ultricies at elit sit amet, tempor volutpat augue. Nam luctus, nibh ac sodales tincidunt, purus lorem dignissim metus, a molestie ante lacus ut urna. Mauris eget nisi lacus. Sed euismod mauris ex, finibus volutpat neque sodales mollis.</p>
			<p>Pellentesque malesuada ex nisi, a ullamcorper tortor lacinia vitae. Duis commodo congue lorem in dignissim. Suspendisse orci velit, placerat id odio et, egestas posuere lacus. Sed nec nisi enim. Proin sed diam in tellus lobortis pellentesque quis sit amet nulla. Morbi fringilla elementum rhoncus. Ut id purus a diam tincidunt dignissim sodales ut purus. Sed sollicitudin augue id erat iaculis mattis. Vestibulum sodales justo mauris, vitae sodales erat tincidunt in. Vivamus porttitor, velit eu auctor euismod, mi metus tempor felis, ut feugiat nulla enim ut sem. Praesent consequat interdum elit varius facilisis.</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget libero sit amet orci iaculis feugiat. Cras luctus ut urna non mollis. Morbi faucibus ipsum sem, sit amet aliquam lorem luctus eu. Nunc tempus nulla eu consequat pretium. Phasellus luctus sem in enim elementum placerat. Suspendisse pulvinar dignissim fermentum. Suspendisse porta gravida est, sit amet lobortis massa commodo nec. Praesent commodo ligula nunc, sit amet dictum nunc suscipit sed. Vivamus rhoncus quam nec consectetur condimentum. In aliquet dolor justo, ut placerat nunc faucibus non. Vivamus in volutpat tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ornare felis et ultrices vestibulum. Donec sed maximus nisi, a hendrerit urna. Phasellus sed dignissim nunc. Sed eu felis non enim pellentesque dignissim.</p>
			<p>Pellentesque tincidunt interdum dui et elementum. Suspendisse potenti. Praesent quam lacus, interdum at tristique vel, mollis tristique tortor. Quisque id libero vitae tortor porttitor pulvinar id vitae risus. Aenean molestie, velit non molestie maximus, dui nunc consequat lorem, a blandit nunc magna quis turpis. Duis sed leo a lacus commodo ultrices. Cras ut eros elementum, tincidunt arcu sagittis, consectetur est. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris auctor massa leo. Quisque sollicitudin placerat dolor vitae ultrices. Donec est purus, congue non imperdiet bibendum, elementum a mi. Praesent sagittis erat nec mauris tincidunt, nec molestie tellus egestas. Cras neque tellus, volutpat ac luctus ac, vulputate sit amet elit.</p>
			<p>Morbi varius lectus nec iaculis blandit. Aliquam ut lacus iaculis, varius orci in, molestie augue. Fusce pretium tincidunt massa, id placerat sapien commodo non. Nulla varius ornare elit, in tincidunt purus malesuada vel. Suspendisse potenti. Nulla facilisi. Phasellus dignissim dapibus enim quis ullamcorper. Nunc felis turpis, blandit non rutrum a, hendrerit eu ligula.</p>
			<p>Fusce hendrerit libero sed elit pulvinar bibendum. Donec aliquam arcu nunc, sit amet vulputate ante luctus lobortis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque vitae semper nibh, eu vehicula nibh. In quis aliquet lectus. Fusce at elit quam. Vestibulum pulvinar varius tellus id bibendum. Sed ultricies, augue in mattis malesuada, velit mauris viverra enim, vitae hendrerit nunc quam sed dui. Praesent lacus erat, feugiat imperdiet bibendum eu, aliquet eu diam. Donec iaculis fringilla libero eu dapibus. Nam ornare ex et lectus tincidunt molestie. Ut nulla mi, ultricies at elit sit amet, tempor volutpat augue. Nam luctus, nibh ac sodales tincidunt, purus lorem dignissim metus, a molestie ante lacus ut urna. Mauris eget nisi lacus. Sed euismod mauris ex, finibus volutpat neque sodales mollis.</p>
			<p>Pellentesque malesuada ex nisi, a ullamcorper tortor lacinia vitae. Duis commodo congue lorem in dignissim. Suspendisse orci velit, placerat id odio et, egestas posuere lacus. Sed nec nisi enim. Proin sed diam in tellus lobortis pellentesque quis sit amet nulla. Morbi fringilla elementum rhoncus. Ut id purus a diam tincidunt dignissim sodales ut purus. Sed sollicitudin augue id erat iaculis mattis. Vestibulum sodales justo mauris, vitae sodales erat tincidunt in. Vivamus porttitor, velit eu auctor euismod, mi metus tempor felis, ut feugiat nulla enim ut sem. Praesent consequat interdum elit varius facilisis.</p>
		</Container>
	</div>
)*/



ReactDOM.render(
	<App />,
	document.getElementById("container")
);

/*

		<Sidebar.Pushable>
			<Sidebar visible={ true }>
				<Menu vertical>
					<Menu.Header>Tools</Menu.Header>
					<Menu.Item active={ true }>
						<Icon name="brush" />
						Pen
					</Menu.Item>
					<Menu.Item active={ false }>
						<Icon name="erase" />
						Erase
					</Menu.Item>
				</Menu>
			</Sidebar>
			<Sidebar.Pusher>
				<Segment>The drawing pane</Segment>
			</Sidebar.Pusher>
		</Sidebar.Pushable>

// "redux" example code

import { local } from "./lib/local-store"
import dispatcher from "./lib/dispatcher";
import layers from "./handlers/layers";
import maps from "./handlers/maps";
import { create, deleteById, editById } from "./handlers/base";
import {
	MAP_CREATE, MAP_EDIT, MAP_DELETE,
	LAYER_CREATE, LAYER_EDIT, LAYER_DELETE, LAYER_MOVE_UP, LAYER_MOVE_DOWN
} from "./lib/action-keys";

// custom functionality, with inline action keys and a counter handler
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";

function counter(state = 0, action) {
	switch (action) {
		case INCREMENT:
			return state + 1;

		case DECREMENT:
			return state - 1;
		default:
			return state;
	}
}

function counterReset(state = 0, action) {
	switch(action) {
		case RESET:
			return 0;

		default:
			return state
	}
}


// register handler functions
dispatcher.register("layers", layers);
//dispatcher.register("counter", counter);
//let counterRef = dispatcher.register("counter", counterReset);



// the problem with this is order of registration matters...

dispatcher.register("maps", maps);
//dispatcher.register("maps", mapLocal); // this should be solely a consequence of the map being created





// subscribe to all updates
let myRef = dispatcher.subscribe((action, state) => console.log(`state: (${action})`, state));

console.log("Got ref", myRef)



dispatcher.dispatch(MAP_CREATE, { name: "New Map 1", id: 1})
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(MAP_CREATE, { name: "New Map 2", id: 1})
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(DECREMENT);
dispatcher.dispatch(MAP_CREATE, { name: "New Map 2", id: 2})
//dispatcher.dispatch(MAP_CREATE, { name: "New Map 2", id: 2})
//dispatcher.dispatch(MAP_EDIT, { name: "Updated Map 2", id: 2})
//dispatcher.dispatch(MAP_DELETE, 2)




/*

dispatcher.dispatch(RESET);
dispatcher.dispatch(DECREMENT);
dispatcher.dispatch(DECREMENT);

console.log("unregister counter reset")
dispatcher.unregister("counter", counterRef);

dispatcher.dispatch(RESET);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(RESET);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(RESET);
dispatcher.dispatch(INCREMENT);






// dispatch some events
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(INCREMENT);
dispatcher.dispatch(LAYER_CREATE, {
	name: "Layer 1",
	id: 1
});

dispatcher.dispatch(LAYER_CREATE, {
	name: "Layer 2",
	id: 2
});

dispatcher.dispatch(LAYER_CREATE, {
	name: "Shouldn't Work",
	id: 2
});

dispatcher.dispatch(LAYER_CREATE, {
	name: "Layer 3",
	id: 3
});
dispatcher.dispatch(LAYER_EDIT, {
	name: "New Layer Name",
	id: 2
});
//dispatcher.dispatch(DECREMENT);
dispatcher.dispatch(LAYER_MOVE_UP, 2);

// unsubscribe from updates
//dispatcher.unsubscribe(myRef);

dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);
dispatcher.dispatch(LAYER_MOVE_DOWN, 2);

dispatcher.dispatch(LAYER_DELETE, 2);*/
