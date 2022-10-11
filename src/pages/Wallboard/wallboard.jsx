import React from "react";
import { useNavigate } from "react-router-dom";

import "./wallboard.scss";
import { InstanceTest } from "../../components";

const Wallboard = () => {
	const navigate = useNavigate();
	const onNavigate = () => {
		navigate("/instance");
	};

	return (
		<div className="flex">
			<InstanceTest
				timer={1}
				name="Spring Boot Admin"
				number="1"
				onNavigate={onNavigate}
			/>
		</div>
	);
};

export default Wallboard;
