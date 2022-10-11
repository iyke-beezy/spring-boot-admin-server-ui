import React from "react";
import "./instance.scss";

const InstanceTest = ({ timer, name, number, onNavigate }) => {
	return (
		<>
			<div className="hexagon" onClick={onNavigate}>
				<p className="instanceTimer">{timer}</p>
				<div className="instanceName">
					<h1>{name}</h1>
					<p>{number} instance</p>
				</div>
			</div>
		</>
	);
};

export default InstanceTest;
