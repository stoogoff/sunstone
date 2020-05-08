
import React from "react";
import { TextInput } from "../input/text.jsx";
import Button from "../button.jsx";
import { setSimpleState } from "../../lib/utils";
import { AUTH_ERRORS } from "../../lib/config";
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
		if(!this.hasError()) {
			dispatcher.dispatch(USER_REGISTER, this.state);
		}
	}

	hasError() {
		return this.state.username == "" || this.state.email == "" || this.state.password == "" || this.state.password != this.state.repeatPassword;
	}

	render() {
		const [code, message] = this.props.error ? [this.props.error.code, this.props.error.message] : [];

		const passwordError = code == AUTH_ERRORS.PASSWORD_WEAK;
		const emailError = code == AUTH_ERRORS.EMAIL_IN_USE || code == AUTH_ERRORS.EMAIL_INVALID;
		const confirmPasswordError = this.state.repeatPassword != "" && this.state.repeatPassword != this.state.password

console.log("this.props.error=", this.props.error)
console.log("code=", code)
console.log("message=", message)


		return <div>
			<TextInput label="Username" leftIcon="user" value={ this.state.username } onChange={ setSimpleState.bind(this, "username") } required />
			<TextInput
				label="Email address"
				leftIcon="envelope"
				value={ this.state.email }
				onChange={ setSimpleState.bind(this, "email") }
				danger={ emailError }
				note={ emailError ? message : null }
				required
			/>
			<TextInput
				label="Password"
				type="password"
				leftIcon="lock"
				value={ this.state.password }
				onChange={ setSimpleState.bind(this, "password") }
				danger={ passwordError }
				note={ passwordError ? message : null }
				required
			/>
			<TextInput
				label="Confirm Password"
				type="password"
				leftIcon="lock"
				value={ this.state.repeatPassword }
				onChange={ setSimpleState.bind(this, "repeatPassword") }
				danger={ confirmPasswordError }
				note={ confirmPasswordError ? "Password and confirm password don't match." : null }
				required
			/>
			<div className="control">
				<Button label="Register" link onClick={ this.submit.bind(this) } disabled={ this.hasError() } />
			</div>
		</div>;
	}
}
