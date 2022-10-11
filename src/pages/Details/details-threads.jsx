import React, { Component, createRef } from "react";
import { pollTimer } from "../../constants/uiconfig";
import { timer, concatMap, delay, retryWhen, take } from "rxjs";
import * as d3 from "d3";
import moment from "moment";
import { Card } from "antd";

import Instance from "../../Apis/instances";

class ThreadsChart extends Component {
	constructor(props) {
		super(props);
		this.chartLayer = null;
		this.areas = null;
		this.width = null;
		this.xAxis = null;
		this.yAxis = null;
		this.newRef = null;
		this.current = {
			live: 0,
			peak: 0,
			daemon: 0,
		};
		this.chartData = [];
		this.state = {
			data: [],
		};

		this.myRef = createRef();
		this.margin = {
			top: 5,
			right: 5,
			bottom: 30,
			left: 50,
		};
		this.hasLoaded = false;
		this.instance = new Instance();
		this.subscription = null;
	}

	fetchMetrics = async () => {
		const responseLive = await this.instance.fetchMetric("jvm.threads.live");
		const responsePeak = await this.instance.fetchMetric("jvm.threads.peak");
		const responseDaemon = await this.instance.fetchMetric(
			"jvm.threads.daemon"
		);

		return {
			live: responseLive.data.measurements[0].value,
			peak: responsePeak.data.measurements[0].value,
			daemon: responseDaemon.data.measurements[0].value,
		};
	};

	prepareData = () => {
		this.newRef = d3.select(this.myRef.current);

		this.width =
			this.myRef.current.getBoundingClientRect().width -
			this.margin.left -
			this.margin.right;

		this.height =
			this.myRef.current.getBoundingClientRect().height -
			this.margin.top -
			this.margin.bottom;

		this.chartLayer = this.newRef
			.append("g")
			.attr("transform", `translate(${this.margin.left},${this.margin.top})`);

		this.xAxis = this.chartLayer
			.append("g")
			.attr("class", "threads-chart__axis-x")
			.attr("transform", `translate(0,${this.height})`);

		this.yAxis = this.chartLayer
			.append("g")
			.attr("class", "threads-chart__axis-y")
			.attr("stroke", null);

		this.areas = this.chartLayer.append("g");

		this.subscription = timer(0, pollTimer.threads)
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
					this.setState({
						data: [...this.state.data, newData],
					});
					this.drawChart(this.state.data);
				},
				error: (error) => {
					this.hasLoaded = true;
					console.warn("Fetching threads metrics failed:", error);
					this.error = error;
				},
			});
	};

	componentDidMount() {
		this.prepareData();
	}

	componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	drawChart = (data) => {
		// setting up the x and y scale
		const extent = d3.extent(data, (d) => d.timestamp); //return the minimum and maximum time
		const x = d3.scaleTime().range([0, this.width]).domain(extent);

		const y = d3
			.scaleLinear()
			.range([this.height, 0])
			.domain([0, d3.max(data, (d) => d.live) * 1.05]);

		// draw max
		const live = this.areas
			.selectAll(".threads-chart__area--live")
			.data([data]);
		live
			.enter()
			.append("path")
			.merge(live)
			.attr("class", "threads-chart__area--live")
			.attr(
				"d",
				d3
					.area()
					.x((d) => x(d.timestamp))
					.y0((d) => y(d.daemon))
					.y1((d) => y(d.live))
			);
		live.exit().remove();

		// draw areas
		const daemon = this.areas
			.selectAll(".threads-chart__area--daemon")
			.data([data]);
		daemon
			.enter()
			.append("path")
			.merge(daemon)
			.attr("class", ".threads-chart__area--daemon")
			.style("fill", "hsl(207deg, 61%, 53%)")
			.style("opacity", "0.8")
			.attr(
				"d",
				d3
					.area()
					.x((d) => x(d.timestamp))
					.y0(y(0))
					.y1((d) => y(d.daemon))
			);
		daemon.exit().remove();

		// draw axis
		this.xAxis.call(
			d3
				.axisBottom(x)
				.ticks(5)
				.tickFormat((d) => moment(d).format("HH:mm:ss"))
		);

		this.yAxis.call(d3.axisLeft(y).ticks(5));
	};

	render() {
		// console.log(this.state.data);
		return (
			<Card title="Threads">
				<div className="threadData">
					<div className="data_item">
						<p>Live</p>
						<p>{this.current.live}</p>
					</div>{" "}
					<div className="data_item">
						<p>Daemon</p>
						<p>{this.current.daemon}</p>
					</div>{" "}
					<div className="data_item">
						<p>Peak Live</p>
						<p>{this.current.peak}</p>
					</div>
				</div>
				<div className="threads-chart">
					<svg ref={this.myRef} className="threads-chart__svg" />
				</div>
			</Card>
		);
	}
}

export default ThreadsChart;
