
import React from "react";
import { TextInput } from "../input/text.jsx";
import Button from "../button.jsx";
import { setSimpleState } from "../../lib/utils";
import { USER_REGISTER } from "../../lib/action-keys";
import dispatcher from "../../lib/dispatcher";


export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			email: "",
			password: "",
			repeatPassword: ""
		};
	}

	submit() {
		if(this.state.username && this.state.email && this.state.password && this.state.password == this.state.repeatPassword) {
			dispatcher.dispatch(USER_REGISTER, this.state);
		}
	}

	hasError() {
		return this.state.username == "" || this.state.email == "" || this.state.password == "" || this.state.password != this.state.repeatPassword;
	}

	render() {
		return <div>
			<TextInput label="Username" leftIcon="user" value={ this.state.username } required onChange={ setSimpleState.bind(this, "username") } />
			<TextInput label="Email address" leftIcon="envelope" value={ this.state.email } required onChange={ setSimpleState.bind(this, "email") } />
			<TextInput label="Password" leftIcon="lock" value={ this.state.password } required onChange={ setSimpleState.bind(this, "password") }  />
			<TextInput label="Repeat Password" leftIcon="lock" value={ this.state.repeatPassword } required onChange={ setSimpleState.bind(this, "repeatPassword") }  />
			<div className="control">
				<Button label="Register" primary onClick={ this.submit.bind(this) } disabled={ this.hasError() } />
			</div>
		</div>;
	}
}
