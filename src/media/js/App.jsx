
import React from "react";
import ReactDOM from "react-dom";

import Value from "./Value.jsx";


class App extends React.Component {
	render() {
		return <div>
			<h1>Firebase Test</h1>
			<input type="text" />
			<button>Add</button>
			<Value />
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);
