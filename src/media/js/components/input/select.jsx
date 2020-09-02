
import React from "react";
import { id } from "../../lib/string";
import { sortByProperty } from "../../lib/list";

export default props => {
	const handleChange = (evt) => {
		if(props.onChange) {
			props.onChange(evt.target.value);
		}
	}

	const inputId = props.label ? "input_" + id(props.label) : null;

	return <div className="field">
		<div className="select">
			{ props.label ? <label htmlFor={ inputId } className="label">{ props.label } { props.required ? <span className="required">*</span> : null }</label> : null }
			<div className="control">
				<select id={ inputId } type="text" value={ props.value } onChange={ handleChange }>
					{ props.values.map(v => <option>{ v }</option>) }
				</select>
			</div>
		</div>
	</div>;
}