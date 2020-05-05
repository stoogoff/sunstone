
import React from "react";
import Tabs from "./tabs.jsx";
import Button from "./button.jsx";
import Login from "./forms/login.jsx";
import Registration from "./forms/registration.jsx";
import dispatcher from "../lib/dispatcher";
import { setSimpleState } from "../lib/utils";


export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tabIndex: 0
		};
	}

	viewEditor() {
		dispatcher.dispatch();
	}

	render() {
		return <div className="full-screen">
			<section className="hero is-warning is-bold is-medium">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">Sunstone</h1>
						<h2 className="subtitle">Some random blurb...</h2>
					</div>
				</div>
			</section>
			<section className="section">
				<div className="container">
					<Tabs index={ this.state.tabIndex } onTabChange={ setSimpleState.bind(this, "tabIndex") } centered>
						<Tabs.Tab label="Use">
							<p>Some using the app blurb</p>
							<Button label="Make your map" onClick={ this.viewEditor.bind(this) } />
						</Tabs.Tab>
						<Tabs.Tab label="Login">
							<Login />
						</Tabs.Tab>
						<Tabs.Tab label="Register">
							<Registration />
						</Tabs.Tab>
					</Tabs>
				</div>
			</section>
			<footer className="footer">
				<div className="container">
					<p>Copyright &copy; 2020 we-evolve</p>
				</div>
			</footer>
		</div>
	}
}