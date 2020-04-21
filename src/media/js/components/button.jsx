
import React from "react";
import { getClassList } from "../lib/utils";


export default (props) => {
	const Tag = props.as ? props.as : "div";
	const classList = ["button", ...(props.className || []), ...getClassList(props, true, true, true)];

	const onClick = (evt) => {
		if(props.onClick) {
			props.onClick(evt);
		}
	};

	const onLeftIconClick = (evt) => {
		if(props.onLeftIconClick) {
			props.onLeftIconClick(evt);

			evt.stopPropagation();
		}
	}

	const onRightIconClick = (evt) => {
		if(props.onRightIconClick) {
			props.onRightIconClick(evt);

			evt.stopPropagation();
		}
	}

	return <Tag className={ classList.join(" ") } onClick={ onClick }>
		{ props.leftIcon ? <span className="icon is-small" onClick={ onLeftIconClick }><i className={ `fas fa-${props.leftIcon}` }></i></span> : null }
		{ props.label ? <span>{ props.label }</span> : null }
		{ props.rightIcon ? <span className="icon is-small is-pulled-right" onClick={ onRightIconClick }><i className={ `fas fa-${props.rightIcon}` }></i></span> : null }
	</Tag>
};