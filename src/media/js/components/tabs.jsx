
import React from "react";
import { getClassList } from "../lib/utils";


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
						<a>{ tab.props.label }</a>
				</li>)}
			</ul>
		</div>
		{ props.children.filter((child, index) => props.index == index) }
	</div>;
}

Tabs.Tab = (props) => (
	<div className="tab-panel">{ props.children }</div>
);

export default Tabs;
