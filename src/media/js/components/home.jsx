
import React from "react";
import { Link } from "react-router-dom";
import Tabs from "./tabs.jsx";
import Button from "./button.jsx";
import Login from "./forms/login.jsx";
import Registration from "./forms/registration.jsx";
import { setSimpleState } from "../lib/utils";


export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tabIndex: 0
		};
	}

	viewEditor() {
		
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
					<Tabs index={ this.state.tabIndex } onTabChange={ setSimpleState.bind(this, "tabIndex") } centered large fullwidth>
						<Tabs.Tab label="Use" icon="palette">
							<p>Some using the app blurb</p>
							<Button label="Make your map" onClick={ this.viewEditor.bind(this) } />
							<Link to="/create">Create Map</Link>
						</Tabs.Tab>
						<Tabs.Tab label="Login" icon="sign-in-alt">
							<div className="columns">
								<div className="column">
									<Login />
								</div>
								<div className="column notification">
									Some text with instructions
								</div>
							</div>
						</Tabs.Tab>
						<Tabs.Tab label="Register" icon="user-plus">
							<div className="columns">
								<div className="column">
									<Registration />
								</div>
								<div className="column notification">
									Some text with instructions
								</div>
							</div>
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