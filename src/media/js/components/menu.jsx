
import React from "react";
import Button from "./button.jsx";
import Icon from "./icon.jsx";
import { TYPES, SIZES, BUTTON } from "../lib/utils";
import { next } from "../lib/timer";


export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.listener = null;
		this.state = {
			active: false
		};
	}

	componentDidMount() {
		this.listener = document.addEventListener("click", (evt) => {
			this.setState({
				active: false
			});
		}, false);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.listener);
	}

	toggleActive() {
		const newState = {
			active: !this.state.active
		};

		if(this.state.active) {
			this.setState(newState);
		}
		else {
			next(() => this.setState(newState));
		}
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

	const icon = props.icon ? <Icon icon={ props.icon } pulled-right /> : null;

	return <a className={ classList.join(" ") } onClick={ props.onClick }>{ props.label }{ icon }</a>;
};

Menu.Divider = () => (
	<hr className="dropdown-divider" />
);
