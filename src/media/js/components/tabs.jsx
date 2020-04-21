
import React from "react";

export default class Tabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			index: props.index || 0
		};
	}

	setTab(index) {
		this.setState({
			index
		});
	}

	render() {
		return <div className="tabs-container">
			<div className="tabs is-boxed">
				<ul>
					{ this.props.children.map((tab, index) => <li
						onClick={ this.setTab.bind(this, index) }
						className={ this.state.index == index ? "is-active" : null  }>
							<a>{ tab.props.label }</a>
					</li>)}
				</ul>
			</div>
			{ this.props.children.filter((child, index) => this.state.index == index) }
		</div>;
	}
}

Tabs.Tab = (props) => (
	<div className="tab-panel">{ props.children }</div>
);
