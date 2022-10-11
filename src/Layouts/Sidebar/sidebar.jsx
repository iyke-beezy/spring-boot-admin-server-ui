import React from "react";
import { Layout, Menu } from "antd";

import sideBarMenu from "../../utils/sidebarMenu";

const { Sider } = Layout;

const SideBar = ({ onClick }) => (
	<Sider
		style={{ position: "fixed", left: 0, top: 0, bottom: 0 }}
	>
		<Menu
			defaultSelectedKeys={["sub1"]}
			defaultOpenKeys={["1"]}
			mode="inline"
			items={sideBarMenu}
			onClick={onClick}
			style={{ marginTop: "10vh" }}
			theme="dark"
		/>
	</Sider>
);

export default SideBar;
