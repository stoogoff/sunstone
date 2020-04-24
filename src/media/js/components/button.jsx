
import React from "react";
import Icon from "./icon.jsx";
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

	return <Tag className={ classList.join(" ") } onClick={ onClick } { ...props }>
		{ props.leftIcon ? <Icon small onClick={ onLeftIconClick } icon={ props.leftIcon } colour={ props.leftIconColour } /> : null }
		{ props.label ? <span>{ props.label }</span> : null }
		{ props.rightIcon ? <Icon small pulled-right onClick={ onRightIconClick } icon={ props.rightIcon } colour={ props.rightIconColour } /> : null }
	</Tag>
};
