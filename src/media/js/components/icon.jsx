
import React from "react";
import { getClassList } from "../lib/utils";


export default (props) => {
	const classList = ["icon", ...getClassList(props, true, true, true)];
	const colour = props.colour ? { color: props.colour } : null;
	const onClick = (evt) => {
		if(props.onClick) {
			props.onClick(evt);
		}
	};

	return <span className={ classList.join(" ") } onClick={ onClick }><i className={ `fas fa-${props.icon}` } style={ colour }></i></span>;
};
