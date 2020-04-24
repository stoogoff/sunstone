
import React from "react";

const Tabs = (props) => {
	const setTab = (index) => {
		if(props.onTabChange) {
			props.onTabChange(index);
		}
	};

	return <div className="tabs-container">
		<div className="tabs is-boxed">
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
