import React, { Component } from "react";
import { timer, concatMap, delay, retryWhen, take } from "rxjs";
import moment from "moment";
import { pollTimer } from "./constants/uiconfig";
import Chart3 from "./pages/Details/details-threads";

class Testing extends Component {
	constructor() {
		super();
		this.hasLoaded = false;
		this.error = null;
		this.current = null;
		this.chartData = [];
		this.count = 0;
	}

	fetchMetrics = async () => {
		return {
			live: Math.floor(Math.random() * 55 + 40),
			peak: Math.floor(Math.random() * 60 + 55),
			daemon: Math.floor(Math.random() * 50 + 40),
		};
	};

	componentDidMount() {
		timer(0, pollTimer.threads)
			.pipe(
				concatMap(this.fetchMetrics),
				retryWhen((err) => {
					return err.pipe(delay(1000), take(5));
				})
			)
			.subscribe({
				next: (data) => {
					this.hasLoaded = true;
					this.current = data;
					let newData = { ...data, timestamp: moment().valueOf() };
					this.chartData.push(newData);
				},
				error: (error) => {
					this.hasLoaded = true;
					console.warn("Fetching threads metrics failed:", error);
					this.error = error;
				},
			});
	}

	render() {
		this.error && console.log(this.error);
		return <Chart3 />;
	}
}

// console.log(testCase.testing());
// testCase.displayData('chartData');

export default Testing;
