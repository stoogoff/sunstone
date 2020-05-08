
import React from "react";
import { TextInput } from "../input/text.jsx";
import Button from "../button.jsx";
import { setSimpleState } from "../../lib/utils";
import { USER_LOGIN } from "../../lib/action-keys";
import dispatcher from "../../lib/dispatcher";


export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: ""
		};
	}

	submit() {
		if(this.state.email && this.state.password) {
			dispatcher.dispatch(USER_LOGIN, this.state);
		}
	}

	hasError() {
		return this.state.email == "" || this.state.password == "";
	}

	render() {
		return <div>
			<TextInput label="Email address" leftIcon="envelope" value={ this.state.email } required onChange={ setSimpleState.bind(this, "email") } />
			<TextInput label="Password" type="password" leftIcon="lock" value={ this.state.password } required onChange={ setSimpleState.bind(this, "password") }  />
			<div className="control">
				<Button label="Login" link onClick={ this.submit.bind(this) } disabled={ this.hasError() } />
			</div>
		</div>;
	}
}
