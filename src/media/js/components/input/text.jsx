
import React from "react";
import { id, isNumeric } from "../../lib/string";


class BaseText extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: false
		};
	}

	handleChange(evt) {
		let value = evt.target.value;

		this.setState({
			error: this.hasError(value)
		});

		if(this.props.onChange) {
			this.props.onChange(value);
		}
	}

	handleBlur() {
		this.setState({
			error: this.hasError(this.props.value)
		});
	}

	handleClick(value) {
		if(this.props.onClick) {
			this.props.onClick(value);
		}
	}

	hasError(value) {
		value = value || "";

		let requiredError = this.props.required && value == "";
		let formatError = this.props.numeric && value != "" ? !isNumeric(value) : false;

		return requiredError || formatError;
	}

	getClassName(base) {
		return base + (this.state.error ? " is-danger" : "");
	}
}

export class TextInput extends BaseText {
	render() {
		const inputId = this.props.label ? "input_" + id(this.props.label) : null;
		let classList = ["control"];
		let inputClassList = ["input"];
		let helpClassList = ["help"];

		if("rightIcon" in this.props) {
			classList.push("has-icons-right");
		}

		if("leftIcon" in this.props) {
			classList.push("has-icons-left");
		}

		if(this.state.error || this.props.danger) {
			inputClassList.push("is-danger");
			helpClassList.push("is-danger");
		}

		return <div className="field">
			{ this.props.label ? <label htmlFor={ inputId } className="label">{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label> : null }
			<div className={ classList.join(" ") } onClick={ this.handleClick.bind(this, this.props.value) }>
				<input id={ inputId } className={ inputClassList.join(" ") }
					type={ this.props.type || "text" }
					value={ this.props.value }
					onChange={ this.handleChange.bind(this) }
					onBlur={ this.handleBlur.bind(this) }
					readOnly={ this.props.readOnly }
					disabled={ this.props.disabled } />
				{ this.props.leftIcon ? <span className="icon is-small is-left"><i className={ `fas fa-${this.props.leftIcon}` }></i></span> : null }
				{ this.props.rightIcon ? <span className="icon is-small is-right"><i className={ `fas fa-${this.props.rightIcon}` }></i></span> : null }
			</div>
			{ this.props.note ? <div className={ helpClassList.join(" ") }>{ this.props.note }</div> : null }
		</div>;
	}
}

export class TextArea extends BaseText {
	render() {
		let inputId = "input_" + id(this.props.label);

		return <div className="field">
			<label htmlFor={ inputId } className="label">{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<textarea id={ inputId } className={ this.getClassName("textarea") } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } />
		</div>;
	}
}