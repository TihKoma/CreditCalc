import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import style from "./toolTip.module.css";

interface IToolTipProps {
	text: string;
	style?: any;
}

class ToolTip extends React.Component<IToolTipProps> {
	constructor(props: IToolTipProps) {
		super(props);
	}
	render() {
		return (
			<div className={style.tooltip} style={this.props.style}>
				<span className={style.tooltiptext}>
					{this.props.text.split("<br>").map((item, i) => {
						return <div key={`tooltiptext-${i}`}>{item}</div>;
					})}
				</span>
			</div>
		);
	}
}

export default ToolTip;
