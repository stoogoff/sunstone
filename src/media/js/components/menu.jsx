
import React from "react";
import Button from "./button.jsx";
import { TYPES, SIZES, BUTTON } from "../lib/utils";


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
		const leftIcon = this.props.leftIcon ? this.props.leftIcon : null;
		const rightIcon = this.props.up ? "fas fa-angle-up" : "fas fa-angle-down";
		const classList = ["dropdown", ...(this.props.className || [])];

		if(this.state.active) {
			classList.push("is-active");
		}

		["up", "right"].forEach(prop => {
			if(prop in this.props) {
				classList.push("is-" + prop);
			}
		});

		const btnPropsList = [...TYPES, ...SIZES, ...BUTTON].filter(prop => "button-" + prop in this.props && this.props["button-" + prop]).reduce((a,b) => (a[b] = true, a), {});

		// TODO an invisible modal or something to close the menu when clicking away from it

		return <div className={ classList.join(" ") }>
			<div className="dropdown-trigger">
				<Button leftIcon={ leftIcon } rightIcon={ rightIcon } label={ this.props.label } onClick={ this.toggleActive.bind(this) } { ...btnPropsList } />
			</div>
			<div className="dropdown-menu" role="menu">
				<div className="dropdown-content">
					{ React.Children.map(this.props.children, child => {
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

Menu.Item = (props) => {
	const classList = ["dropdown-item"];

	if(props.active) {
		classList.push("is-active");
	}

	return <a className={ classList.join(" ") } onClick={ props.onClick }>{ props.children }</a>;
};

Menu.Divider = () => (
	<hr className="dropdown-divider" />
);
