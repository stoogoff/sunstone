
import React, { useRef } from "react";

export default (props) => {
	const expander = useRef(null);

	if(expander.current) {
		expander.current.style.maxHeight = props.open ? expander.current.scrollHeight + "px" : null;
	}

	return <div className="expander" ref={ expander }>
		<div className="expander-container">
			{ props.children }
		</div>
	</div>;
};
