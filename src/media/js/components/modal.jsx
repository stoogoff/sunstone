
import React from "react";
import ReactDOM from "react-dom";
import { getClassList } from "../lib/utils";


export default (props) => {
	const classList = ["modal"];

	if(props.active) {
		classList.push("is-active");
	}

	const onClose = () => {
		if(props.close) {
			props.close();
		}
	};

	return ReactDOM.createPortal(<div className={ classList.join(" ") }>
		<div className="modal-background"></div>
		<div className="modal-card">
			<header className="modal-card-head">
				<h2 class="modal-card-title">{ props.title }</h2>
				{ props.closable ? <button class="delete" aria-label="close" onClick={ onClose }></button> : null }
			</header>
			<section className="modal-card-body">{ props.children }</section>
			<footer className="modal-card-foot"></footer>
		</div>
		{ props.closable ? <button className="modal-close is-large" aria-label="close" onClick={ onClose }></button> : null }
	</div>, document.getElementById("modal"));
};
