import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const items = [
	{
		key: 1,
		label: "Wallboard",
		location: "/wallboard",
	},
	{
		key: 2,
		label: "Applications",
		location: "/applications",
	},
	{
		key: 3,
		label: "About",
		location: "/about",
	},
];

const AppHeader = () => {
	const navigate = useNavigate();
	return (
		<Header
			style={{ position: "fixed", zIndex: 1, width: "100%" }}
			className="layout__header"
		>
			<div className="logo" />
			<Menu theme="dark" mode="horizontal">
				{items.map((item) => (
					<Menu.Item
						key={item.key}
						onClick={() => navigate(`${item.location}`)}
					>
						{item.label}
					</Menu.Item>
				))}
			</Menu>
		</Header>
	);
};

export default AppHeader;
