import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "antd/dist/antd.css";
import "./App.css";
import { Dashboard, Login } from "./components";
import Wallboard from "./pages/Wallboard/wallboard";
import useToken from "./components/useToken";
import { Layout } from "antd";
import AppHeader from "./Layouts/Header/Header";

function App() {
	const { token, setToken } = useToken();

	if (!token) {
		return <Login setToken={setToken} />;
	}
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<Layout style={{}}>
								<AppHeader />
								<Routes>
									<Route index element={<Wallboard />} />
								</Routes>
							</Layout>
						}
					/>
					<Route path="instance/*" element={<Dashboard />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
