
import React from "react";
import { getClassList } from "../lib/utils";


export default (props) => {
	const Tag = props.as ? props.as : "div";
	const classList = ["button", ...(props.className || []), ...getClassList(props, true, true, true)];
	const disabled = props.disabled || false;

	const onClick = (evt) => {
		if(!disabled && props.onClick) {
			props.onClick(evt);
		}
	};

	const onLeftIconClick = (evt) => {
		if(!disabled && props.onLeftIconClick) {
			props.onLeftIconClick(evt);

			evt.stopPropagation();
		}
	};

	const onRightIconClick = (evt) => {
		if(!disabled && props.onRightIconClick) {
			props.onRightIconClick(evt);

			evt.stopPropagation();
		}
	};

	const leftIconColour = props.leftIconColour ? { color: props.leftIconColour} : null;
	const rightIconColour = props.rightIconColour ? { color: props.rightIconColour} : null;

	return <Tag className={ classList.join(" ") } onClick={ onClick } { ...props }>
		{ props.leftIcon ? <span className="icon is-small" onClick={ onLeftIconClick }><i className={ `fas fa-${props.leftIcon}` } style={ leftIconColour }></i></span> : null }
		{ props.label ? <span>{ props.label }</span> : null }
		{ props.rightIcon ? <span className="icon is-small is-pulled-right" onClick={ onRightIconClick }><i className={ `fas fa-${props.rightIcon}` } style={ rightIconColour }></i></span> : null }
	</Tag>
};
