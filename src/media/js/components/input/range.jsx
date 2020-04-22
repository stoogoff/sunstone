
import React from "react";
import { id } from "../../lib/string";

export default (props) => {
	const onChange = (evt) => {
		if(props.onChange) {
			props.onChange(evt.target.value);
		}
	};

	const inputId = props.label ? "input_" + id(props.label) : null;
	const step = (props.max - props.min) / (props.steps || 100);

	return <div className="field">
		{ props.label ? <label htmlFor={ inputId } className="label">{ props.label } </label> : null }
		<div className="control">
			<input id={ inputId }
				type="range"
				value={ props.value }
				min={ props.min }
				max={ props.max }
				step={ step }
				onChange={ onChange }
				readOnly={ props.readOnly }
				disabled={ props.disabled } />
			<span className="icon">{ props.value }</span>
		</div>
		{ props.note ? <div className="help">{ props.note }</div> : null }
	</div>;
};