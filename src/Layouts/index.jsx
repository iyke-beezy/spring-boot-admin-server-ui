import React from "react";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
import AppHeader from "./Header/Header";
import SideBar from "./Sidebar/sidebar";
import "./layout.scss";

const { Content } = Layout;
const AppLayout = ({ children }) => {
	const navigate = useNavigate();
	const onClick = (e) => {
		const { item } = e;
		const { link } = item.props;
		// console.log(link);
		navigate(link)
	};
	return (
		<>
			<Layout hasSider>
				<SideBar onClick={onClick} />
				<Layout style={{ marginLeft: 200 }}>
					<AppHeader />
					<Content style={{ marginTop: 20 }}>{children}</Content>
				</Layout>
			</Layout>
		</>
	);
};

export default AppLayout;
