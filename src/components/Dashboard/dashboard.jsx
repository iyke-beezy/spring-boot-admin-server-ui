import React from "react";

import Details from "../../pages/Details/details";

const header = {
	title: "spring-boot-admin-sample-servlet",
	id: "f1c24069374f",
	links: [
		"http://localhost:8080/",
		"http://localhost:8080/actuator",
		"http://localhost:8080/actuator/health",
	],
};

const meta = [
	{
		key: "1",
		name: "user.name",
		value: "user",
	},
	{
		key: "2",
		name: "user.password",
		value: "******",
	},
	{
		key: "3",
		name: "startup",
		value: Date.now(),
	},
	{
		key: "4",
		name: "tags.environment",
		value: "test",
	},
];

const Dashboard = () => {

	return (
		<div>
			<div className="App">
				<header className="App-header">
					<Details header={header} details={{ info: "None", meta }} />
				</header>
			</div>
		</div>
	);
};

export default Dashboard;
