
import React from "react";
import { getClassList } from "../lib/utils";

export default (props) => {
	let classList = ["message", ...getClassList(props, true, true)];

	return <article className={ classList.join(" ") }>
		{ props.title ? <div className="message-header">
			<p>{ props.title }</p>
			<button className="delete" aria-label="delete"></button>
		</div> : null }
		<div className="message-body">
			{ props.children }
		</div>
	</article>
};
