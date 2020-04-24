
import React from "react";
import { getClassList } from "../lib/utils";


export default (props) => {
	const classList = ["icon", ...getClassList(props, true, true, true)];
	const iconClassList = ["fas", `fa-${props.icon}`];

	const colour = props.colour ? { color: props.colour } : null;
	const onClick = (evt) => {
		if(props.onClick) {
			props.onClick(evt);
		}
	};

	if(props.medium) {
		iconClassList.push("fa-lg");
	}
	else if(props.large) {
		iconClassList.push("fa-2x");
	}
	else if(props.huge) {
		iconClassList.push("fa-3x");
	}

	if(props.animated) {
		iconClassList.push("fa-spin");
	}

	return <span className={ classList.join(" ") } onClick={ onClick }><i className={ iconClassList.join(" ") } style={ colour }></i></span>;
};
