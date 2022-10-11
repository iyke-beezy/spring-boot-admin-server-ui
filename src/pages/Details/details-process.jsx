import React, { Component } from "react";
import Instance from "../../Apis/instances";
import { pollTimer } from "../../constants/uiconfig";
import { timer, concatMap, delay, take, retry } from "rxjs";
import { Card } from "antd";
import { formatDuration } from "../../constants";

export default class DetailsProcess extends Component {
	constructor(props) {
		super(props);
		this.hasLoaded = false;
		this.error = null;
		this.pid = null;
		this.subscription = null;
		this.uptime = { value: null, baseUnit: null };
		this.state = {
			systemCpuLoad: null,
			processCpuLoad: null,
		};

		this.systemCpuCount = null;
		this.instance = new Instance();
	}

	fetchCpuLoadMetrics = async () => {
		const fetchProcessCpuLoad = await this.fetchMetric("process.cpu.usage");
		const fetchSystemCpuLoad = await this.fetchMetric("system.cpu.usage");
		let processCpuLoad;
		let systemCpuLoad;
		try {
			processCpuLoad = fetchProcessCpuLoad.measurements[0].value;
		} catch (error) {
			console.warn("Fetching Process CPU Load failed:", error);
		}
		try {
			systemCpuLoad = fetchSystemCpuLoad.measurements[0].value;
		} catch (error) {
			console.warn("Fetching Sytem CPU Load failed:", error);
		}
		return {
			processCpuLoad,
			systemCpuLoad,
		};
	};

	fetchMetric = async (name) => {
		const response = await this.instance.fetchMetric(name);
		return response.data;
	};

	fetchUptime = async () => {
		try {
			const response = await this.fetchMetric("process.uptime");
			this.uptime = {
				value: response.measurements[0].value,
				baseUnit: response.baseUnit,
			};
		} catch (error) {
			this.error = error;
			console.warn("Fetching Uptime failed:", error);
		}
		this.hasLoaded = true;
	};

	fetchPid = async () => {
		if (!this.instance.hasEndpoint("env")) {
			try {
				const response = await this.instance.fetchEnv("PID");
				this.pid = response.data.property.value;
			} catch (error) {
				console.warn("Fetching PID failed:", error);
			}
			this.hasLoaded = true;
		}
	};

	fetchCpuCount = async () => {
		try {
			this.systemCpuCount = (
				await this.fetchMetric("system.cpu.count")
			).measurements[0].value;
		} catch (error) {
			console.warn("Fetching Cpu Count failed:", error);
		}
		this.hasLoaded = true;
	};

	withLoad = () => {
		this.subscription = timer(0, pollTimer.process)
			.pipe(concatMap(this.fetchCpuLoadMetrics), retry(5), delay(1000))
			.subscribe({
				next: (data) => {
					this.hasLoaded = true;
					this.setState({
						processCpuLoad: data.processCpuLoad,
						systemCpuLoad: data.systemCpuLoad,
					});
				},
				error: (error) => {
					this.hasLoaded = true;
					console.warn("Fetching CPU Usage metrics failed:", error);
					this.error = error;
				},
			});
	};

	componentDidMount() {
		this.withLoad();
		this.fetchPid();
		this.fetchUptime();
		this.fetchCpuCount();
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	render() {
		const { systemCpuLoad, processCpuLoad } = this.state;
		return (
			this.hasLoaded && (
				<>
					<Card title="Process">
						<div className="process">
							{/* pid */}
							<div className="process__item">
								<p className="item__head">PID</p>
								<p className="item__data">{this.pid}</p>
							</div>
							{/* uptime */}
							<div className="process__item">
								<p className="item__head">uptime</p>
								<p className="item__data">
									{formatDuration(this.uptime.value, this.uptime.baseUnit)}
								</p>
							</div>
							{/* process cpu usage */}
							<div className="process__item">
								<p className="item__head"> PROCESS CPU USAGE</p>
								<p className="item__data">{processCpuLoad.toFixed(2)}</p>
							</div>
							<div className="process__item">
								<p className="item__head">SYSTEM CPU USAGE</p>
								<p className="item__data">{systemCpuLoad.toFixed(2)}</p>
							</div>
							<div className="process__item">
								<p className="item__head">CPUs</p>
								<p className="item__data">{this.systemCpuCount}</p>
							</div>
						</div>
					</Card>
				</>
			)
		);
	}
}
