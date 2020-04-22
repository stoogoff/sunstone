
import React from "react";
import { getClassList } from "../lib/utils";


export default class Message extends React.Component {
	constructor(props) {
		super(props);

		this.timer = null;
	}

	close() {
		if(this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null;
		}

		if(this.props.onClose) {
			this.props.onClose();
		}
	}

	render() {
		let classList = ["message", ...getClassList(this.props, true, true)];

		// the message is active and a timeout has been set, but a timer hasn't been started
		if(this.props.active && this.props.timeout && this.timer == null) {
			this.timer = window.setTimeout(this.close.bind(this), this.props.timeout);
		}

		return <div className={ "message-container" + (this.props.active ? " is-active" : "") }>
			<article className={ classList.join(" ") }>
				{ this.props.title ? <div className="message-header">
					<p>{ this.props.title }</p>
					<button className="delete" aria-label="delete" onClick={ this.close.bind(this) }></button>
				</div> : null }
				<div className="message-body">
					{ this.props.children }
				</div>
			</article>
		</div>;
	}
}
