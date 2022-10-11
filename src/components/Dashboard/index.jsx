import React, { useEffect } from "react";
import Dashboard from "./dashboard";
import AppLayout from "../../Layouts";
import { Routes, Route } from "react-router-dom";
import Metrics from "../Metrics/metrics";
import Instance from "../../Apis/instances";
import { useDispatch } from "react-redux";

import { setMetrics } from "../../store/reducers/metrics";

const instance = new Instance();

const DashboardSetup = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		getData();
	});
	async function getData() {
		try {
			const { data } = await instance.fetchMetrics();
			if (data.names) {
				const { names } = data;
				names.map(async (metric) => {
					try {
						let {data} = await instance.fetchMetric(metric);
						if (data) {
							const { name } = data;
							delete data.name;
							const newdata = {
								name,
								values: data,
							};
							updateMetrics(newdata);
						}
					} catch (err) {
						console.log(err.message);
					}
				});
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	const updateMetrics = (metric) => {
		dispatch(setMetrics(metric));
	};
	return (
		<AppLayout>
			<Routes>
				<Route index element={<Dashboard />} />
				<Route path="metrics" element={<Metrics />} />
			</Routes>
		</AppLayout>
	);
};

export default DashboardSetup;
