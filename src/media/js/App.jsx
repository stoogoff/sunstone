
import React from "react";
import ReactDOM from "react-dom";

import Value from "./components/Value.jsx";
import Welcome from "./components/Welcome.jsx";


class App extends React.Component {
	constructor(props) {
		super(props);

		let database = firebase.database();

		this.ref = database.ref("/maps/map1")
		this.state = {
			text: "",
			value: ""
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

	changeHandler(evt) {
		this.setState({
			text: evt.target.value
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
			<Welcome message="Welcome Heading" />
			<input type="text" value={ this.state.text } onChange={ this.changeHandler.bind(this) } />
			<button onClick={ this.clickHandler.bind(this) }>Update</button>
			<Value text={ this.state.value } />
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);
