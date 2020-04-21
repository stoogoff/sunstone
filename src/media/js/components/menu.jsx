
import React from "react";


export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false
		};
	}

	toggleActive() {
		this.setState({
			active: !this.state.active
		});
	}

	render() {
		let icon = this.props.up ? "fas fa-angle-up" : "fas fa-angle-down";
		let classList = ["dropdown"];
		let btnClassList = ["button"];

		if(this.state.active) {
			classList.push("is-active");
		}

		["up", "right"].forEach(prop => {
			if(prop in this.props) {
				classList.push("is-" + prop);
			}
		});

		["white", "light", "dark", "black", "text", "primary", "link", "info", "success", "warning", "danger", "small"].forEach(prop => {
			if("button-" + prop in this.props) {
				btnClassList.push("is-" + prop);
			}
		});

		return <div className={ classList.join(" ") }>
			<div className="dropdown-trigger">
				<button className={ btnClassList.join(" ") } aria-haspopup="true" aria-controls="dropdown-menu" onClick={ this.toggleActive.bind(this) }>
					{ this.props.label ? <span>{ this.props.label }</span> : null }
					<span className="icon is-small"><i className={ icon }></i></span>
				</button>
			</div>
			<div className="dropdown-menu" role="menu">
				<div className="dropdown-content">
					{ this.props.children.map(child => {
						return React.cloneElement(child, {
							onClick: () => {
								this.toggleActive();

								if(child.props.onClick) {
									child.props.onClick();
								}
							}
						})
					}) }
				</div>
			</div>
		</div>
	}
}

Menu.Item = (props) => (
	<a className="dropdown-item" onClick={ props.onClick }>{ props.children }</a>
);

Menu.Divider = () => (
	<hr className="dropdown-divider" />
);
