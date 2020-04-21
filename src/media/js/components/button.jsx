
import React from "react";

export default (props) => {
	let tag = props.as ? props.as : "div";
	let classList = ["button"];

	["white", "light", "dark", "black", "text", "primary", "link", "info", "success", "warning", "danger", "small"].forEach(prop => {
		if(prop in props) {
			classList.push("is-" + prop);
		}
	});

	return <button className={ classList.join(" ") } onClick={ props.onClick }>
		{ props.label ? <span>{ props.label }</span> : null }
		{ props.icon ? <span className="icon is-small"><i className={ `fas fa-${props.icon}` }></i></span> : null }
	</button>
};