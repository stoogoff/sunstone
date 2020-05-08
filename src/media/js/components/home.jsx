
import React from "react";
import { Link, useHistory } from "react-router-dom";
import Tabs from "./tabs.jsx";
import Button from "./button.jsx";
import Login from "./forms/login.jsx";
import Registration from "./forms/registration.jsx";
import dispatcher from "../lib/dispatcher";
import router from "../lib/history";
import { MAP_CREATE } from "../lib/action-keys";


export default props => {
	console.log("Home", props.user)

	//const maps = props.maps ? props.maps.length : 0;

	const onClick = () => {
		console.log("Creating map")
		// potential race condition
		dispatcher.dispatch(MAP_CREATE);

		router.push("/create");
	};

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
				<Tabs.Stateful centered large fullwidth>
					<Tabs.Tab label="Use" icon="palette">
						<div className="columns">
							<div className="column">
								<p>Some using the app blurb</p>
							</div>
							<div className="column notification">
								{ props.map
									? <p>You have <strong>{ props.map.name }</strong> available. Press the continue button to continue working on it.</p>
									: <p>I don't think we've seen you before. Use the button below to create your first <strong>Sunstone</strong> project, or use the links above to login or register.</p> }

								{ props.map
									? <Button link to="/create" label="Continue" as={ Link } loading={ props.loading } />
									: <Button link label="Get Started" onClick={ onClick } />
								}
							</div>
						</div>
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
								<Registration error={ props.user && props.user.error ? props.user.error : null }/>
							</div>
							<div className="column notification">
								Some text with instructions
							</div>
						</div>
					</Tabs.Tab>
				</Tabs.Stateful>
			</div>
		</section>
		<footer className="footer">
			<div className="container">
				<p>Copyright &copy; 2020 we-evolve</p>
			</div>
		</footer>
	</div>
};