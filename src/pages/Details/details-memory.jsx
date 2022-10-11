import React, {
	useState,
	createRef,
	useEffect,
	useMemo,
	useLayoutEffect,
} from "react";
import * as d3 from "d3";
import moment from "moment";
import prettyBytes from "pretty-bytes";
import { Card } from "antd";
import { timer, concatMap, delay, retryWhen, take, retry } from "rxjs";

import { pollTimer } from "../../constants/uiconfig";
import Instance from "../../Apis/instances";

const MemoryThreads = ({ data }) => {
	const dataRef = createRef();

	const margin = {
		top: 5,
		right: 5,
		bottom: 30,
		left: 50,
	};

	// let areas = myRef.append();
	const [dataPrep, setDataPrep] = useState({});
	const [loaded, setLoaded] = useState(false);

	const prepareData = () => {
		const myRef = d3.select(dataRef.current);
		// set height and widths of view port
		const width =
			dataRef.current.getBoundingClientRect().width -
			margin.left -
			margin.right;

		const height =
			dataRef.current.getBoundingClientRect().height -
			margin.top -
			margin.bottom;

		const chartLayer = myRef
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const xAxis = chartLayer
			.append("g")
			.attr("class", "mem-chart__axis-x")
			.attr("transform", `translate(0,${height})`);

		const yAxis = chartLayer
			.append("g")
			.attr("class", "mem-chart__axis-y")
			.attr("stroke", null);

		const areas = chartLayer.append("g");
		setDataPrep({ areas, xAxis, yAxis, width, height });
		setLoaded(true);
		// console.log(data);
	};

	useEffect(() => {
		prepareData();
	}, []);

	useEffect(() => drawChart(data), [data]);

	const drawChart = (data) => {
		if (loaded) {
			const { areas, xAxis, yAxis, width, height } = dataPrep;
			// setting up the x and y scale
			const extent = d3.extent(data, (d) => d.timestamp); //return the minimum and maximum time
			const x = d3.scaleTime().range([0, width]).domain(extent);

			const y = d3
				.scaleLinear()
				.range([height, 0])
				.domain([0, d3.max(data, (d) => d.committed) * 1.05]);

			//draw max
			const max = areas.selectAll(".mem-chart__line--max").data([data]);
			max
				.enter()
				.append("path")
				.merge(max)
				.attr("class", "mem-chart__line--max")
				.attr(
					"d",
					d3
						.line()
						.x((d) => x(d.timestamp))
						.y((d) => y(d.max))
				);
			max.exit().remove();

			const committed = areas
				.selectAll(".mem-chart__area--committed")
				.data([data]);
			committed
				.enter()
				.append("path")
				.merge(committed)
				.attr("class", "mem-chart__area--committed")
				.attr(
					"d",
					d3
						.area()
						.x((d) => x(d.timestamp))
						.y0((d) => y(d.used))
						.y1((d) => y(d.committed))
				);
			committed.exit().remove();

			const used = areas.selectAll(".mem-chart__area--used").data([data]);
			used
				.enter()
				.append("path")
				.merge(used)
				.attr("class", "mem-chart__area--used")
				.attr(
					"d",
					d3
						.area()
						.x((d) => x(d.timestamp))
						.y0((d) => y(d.metaspace || 0))
						.y1((d) => y(d.used))
				);
			used.exit().remove();

			const metaspace = areas
				.selectAll(".mem-chart__area--metaspace")
				.data([data]);
			metaspace
				.enter()
				.append("path")
				.merge(metaspace)
				.attr("class", "mem-chart__area--metaspace")
				.attr(
					"d",
					d3
						.area()
						.x((d) => x(d.timestamp))
						.y0(y(0))
						.y1((d) => y(d.metaspace || 0))
				);
			metaspace.exit().remove();

			//draw axis
			xAxis.call(
				d3
					.axisBottom(x)
					.ticks(5)
					.tickFormat((d) => moment(d).format("HH:mm:ss"))
			);

			yAxis.call(d3.axisLeft(y).ticks(5).tickFormat(prettyBytes));
		}
	};

	return (
		<div className="mem-chart">
			<svg ref={dataRef} className="mem-chart__svg" />
		</div>
	);
};

const MemoryChart = ({ type, instanceId }) => {
	const instance = new Instance();

	const [loaded, setLoaded] = useState(false);
	const [current, setCurrent] = useState();
	const [data, setData] = useState([]);

	const fetchMetrics = async () => {
		const responseMax = await instance.fetchMetric("jvm.memory.max", {
			area: type,
		});
		const responseUsed = await instance.fetchMetric("jvm.memory.used", {
			area: type,
		});

		const hasMetaspace = responseUsed.data.availableTags.some(
			(tag) => tag.tag === "id" && tag.values.includes("Metaspace")
		);
		const responseMetaspace =
			type === "nonheap" && hasMetaspace
				? await instance.fetchMetric("jvm.memory.used", {
						area: type,
						id: "Metaspace",
				  })
				: null;
		const responseCommitted = await instance.fetchMetric(
			"jvm.memory.committed",
			{
				area: type,
			}
		);
		return {
			max: responseMax.data.measurements[0].value,
			used: responseUsed.data.measurements[0].value,
			metaspace: responseMetaspace
				? responseMetaspace.data.measurements[0].value
				: null,
			committed: responseCommitted.data.measurements[0].value,
		};
	};

	const createSubscription = () => {
		return timer(0, pollTimer.memory)
			.pipe(concatMap(fetchMetrics), retry(5), delay(1000))
			.subscribe({
				next: (newData) => {
					setCurrent(newData);
					// console.log(newData)
					newData = { ...newData, timestamp: moment().valueOf() };
					setData((prevData) => [...prevData, newData]);
					setLoaded(true);
				},
				error: (error) => {
					setLoaded(true);
					console.warn("Fetching memory metrics failed: ", error);
				},
			});
	};

	const subscription = useMemo(() => createSubscription(), [instanceId]);
	useEffect(() => {
		// console.log(data);
	}, [data]);
	return (
		loaded && (
			<Card title={`Memory: ${type}`}>
				<div className="threadData">
					{current.metaspace && (
						<div className="data_item">
							<p>Metaspace</p>
							<p>{prettyBytes(current.metaspace)}</p>
						</div>
					)}
					<div className="data_item">
						<p>Used</p>
						<p>{prettyBytes(current.used)}</p>
					</div>{" "}
					<div className="data_item">
						<p>Size</p>
						<p>{prettyBytes(current.committed)}</p>
					</div>{" "}
					<div className="data_item">
						<p>Max</p>
						<p>{prettyBytes(current.max)}</p>
					</div>
				</div>
				<MemoryThreads data={data} />
			</Card>
		)
	);
};
export default MemoryChart;
