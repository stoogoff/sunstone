
import React from "react";
import Icon from "./icon.jsx";
import { getClassList, setSimpleState } from "../lib/utils";


// stateless tab component where control of the active tab must be provided by the parent component
const Tabs = (props) => {
	const setTab = (index) => {
		if(props.onTabChange) {
			props.onTabChange(index);
		}
	};

	const classList = ["tabs", ...getClassList(props, false, true, true)];

	if(props.className) {
		classList.push(props.className);
	}

	return <div className="tabs-container">
		<div className={ classList.join(" ") }>
			<ul>
				{ props.children.map((tab, index) => <li
					onClick={ setTab.bind(null, index) }
					className={ props.index == index ? "is-active" : null  }>
						<a>{ tab.props.icon ? <Icon icon={ tab.props.icon } /> : null }{ tab.props.label }</a>
				</li>)}
			</ul>
		</div>
		{ props.children.filter((child, index) => props.index == index) }
	</div>;
}


// tab content
Tabs.Tab = (props) => (
	<div className="tab-panel">{ props.children }</div>
);


// stateful component wrapper which manages the tab state
// useful if the parent component doesn't care which tab is displayed
class Stateful extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tabIndex: props.startIndex || 0
		};
	}

	render() {
		return <Tabs index={ this.state.tabIndex } onTabChange={ setSimpleState.bind(this, "tabIndex") } { ...this.props }>
			{ this.props.children }
		</Tabs>;
	}
}

Tabs.Stateful = Stateful;


export default Tabs;
