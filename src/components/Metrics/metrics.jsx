import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, Select, Button, Tooltip } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import moment from "moment";

import "./metrics.scss";
import prettyBytes from "pretty-bytes";

const { Option } = Select;

const formatDuration = (value, baseUnit) => {
	const duration = moment.duration(toMillis(value, baseUnit));
	return `${Math.floor(
		duration.asDays()
	)}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
};

const formatMillis = (value, baseUnit) => {
	const duration = moment.duration(toMillis(value, baseUnit));
	return `${moment.duration(duration).asMilliseconds().toFixed(0)} ms`;
};

const toMillis = (value, baseUnit) => {
	switch (baseUnit) {
		case "nanoseconds":
			return value / 1000000;
		case "microseconds":
			return value / 1000;
		case "milliseconds":
			return value;
		case "seconds":
		default:
			return value * 1000;
	}
};

const Metric = (props) => {
	const format = ["-", "Integer", "Float", "Duration", "Milliseconds", "Bytes"];

	const { metrics, onDelete } = props;

	const [data, setData] = useState();
	const [keys, setKeys] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [main, setMain] = useState(null);
	const [formatValue, setFormatValue] = useState(null);
	const [element, setElement] = useState(null);

	useEffect(() => {
		let elems = new Map();
		[metrics].map((metric) => {
			let items = Object.keys(metric);
			items.map((item) => {
				if (!elems.has(item)) elems.set(item, metric[item]);
				// else elems.set(item, [...elems.get(item), metric[item]]);
			});
		});
		// let obskeys = [...elems.keys()];
		// obskeys.map((key) => elems.get(key).map((val) => console.log(val)));
		setKeys([...elems.keys()]);
		setData(elems);
		setMain(elems);
		setLoaded(true);
		if (formatValue) handleFormat(formatValue);
	}, [metrics]);

	const handleFormat = (value) => {
		let newData = new Map();
		[...main.keys()].map((item) => {
			switch (value) {
				case "Integer":
					newData.set(
						item,
						data.get(item).map((elem) => ({
							...elem,
							value: parseFloat(elem.value).toFixed(0),
						}))
					);
					break;
				case "Float":
					newData.set(
						item,
						data.get(item).map((elem) => ({
							...elem,
							value: parseFloat(elem.value).toFixed(4),
						}))
					);
					break;
				case "Duration":
					newData.set(
						item,
						data.get(item).map((elem) => ({
							...elem,
							value: formatDuration(parseFloat(elem.value), elem.baseUnit),
						}))
					);
					break;
				case "Milliseconds":
					newData.set(
						item,
						data.get(item).map((elem) => ({
							...elem,
							value: formatMillis(parseFloat(elem.value), elem.baseUnit),
						}))
					);
					break;
				case "Bytes":
					newData.set(
						item,
						data.get(item).map((elem) => ({
							...elem,
							value: prettyBytes(parseFloat(elem.value)),
						}))
					);
					break;
				default:
					newData.set(
						item,
						data.get(item).map((elem) => ({
							...elem,
						}))
					);
					break;
			}
		});
		setMain(newData);
		setFormatValue(value);
	};

	return (
		<div className="metric">
			{loaded &&
				keys.map((item, index) => (
					<table key={index} className="metric__table">
						<thead>
							<tr>
								<th>{item}</th>
								<th>Value</th>
								<th>
									<Select
										onChange={handleFormat}
										style={{ width: 100 }}
										defaultActiveFirstOption
										defaultValue="-"
									>
										{format.map((dat, index) => (
											<Option key={index} value={dat}>
												{dat}
											</Option>
										))}
									</Select>
								</th>
							</tr>
						</thead>
						<tbody>
							{main.get(item).map((val) => (
								<tr key={val.key}>
									<td>{val.tag}</td>
									<td>{val.value}</td>
									<td>
										<Tooltip title="delete">
											<Button
												data-id={val.key}
												shape="circle"
												icon={<AiOutlineDelete />}
												onClick={() => onDelete(item, val.key)}
											/>
										</Tooltip>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				))}
		</div>
	);
};

const Metrics = () => {
	const metrics = useSelector((state) => state.metrics.values);
	const [loaded, setLoaded] = useState(false);
	const [tableLoad, settableLoad] = useState(false);
	const [selectedMetric, setSelectedMetric] = useState(null);
	const [mainTags, setMainTags] = useState([]);
	const [selectedTag, setSelectedTag] = useState("no tags");
	const [tableData, setTableData] = useState({});
	const [counter, setCounter] = useState(0);

	const metricKeys = Object.keys(metrics).sort();

	useEffect(() => {
		setSelectedMetric("application.ready.time");
		if (Object.keys(metrics).length > 0 && metrics["application.ready.time"]) {
			setMainTags(metrics["application.ready.time"].availableTags);
			setLoaded(true);
		}
	}, [metrics]);

	const handleMetricChange = (value) => {
		setSelectedTag("no tags");
		setMainTags(metrics[value].availableTags);
		setSelectedMetric(value);
	};

	const handleTagChange = (value) => {
		setSelectedTag(value);
	};

	const getMetric = () => {
		setCounter(counter + 1);
		if (tableData[selectedMetric]) {
			setTableData((prev) => {
				const newData = [
					...prev[selectedMetric],
					{
						key: counter,
						baseUnit: metrics[selectedMetric].baseUnit,
						tag: selectedTag,
						value: metrics[selectedMetric].measurements[0].value,
					},
				];
				return {
					...prev,
					[selectedMetric]: newData,
				};
			});
		} else
			setTableData((prev) => ({
				...prev,
				[selectedMetric]: [
					{
						key: counter,
						tag: selectedTag,
						value: metrics[selectedMetric].measurements[0].value,
					},
				],
			}));

		settableLoad(true);
	};

	// delete value
	const onDelete = (metric, key) => {
		console.log(metric, key);
		let newData = tableData[metric].filter((el) => el.key !== key);
		setTableData((prev) => ({
			...prev,
			[metric]: newData,
		}));
	};

	/* Render table with useMemo to prevent rendering on every state change */
	const RenderTable = useMemo(
		() => (
			<>
				{Object.keys(tableData).map((data, index) => (
					<Metric
						key={index}
						onDelete={onDelete}
						metrics={{ [data]: tableData[data] }}
					/>
				))}
			</>
		),
		[tableData]
	);

	return (
		<div className="instance__metrics">
			<Card className="metrics__tags">
				<div className="metric">
					<Select
						style={{ width: 300 }}
						defaultActiveFirstOption
						onChange={handleMetricChange}
						defaultValue="application.ready.time"
					>
						{metricKeys.map((metric, index) => (
							<Option key={index} value={metric}>
								{metric}
							</Option>
						))}
					</Select>
				</div>
				<div className="metric__tags">
					{loaded && (
						<div className="tags__data">
							{mainTags.length > 0 &&
								mainTags.map((tag, index) => (
									<div key={index}>
										{tag.tag}
										<Select
											onChange={handleTagChange}
											style={{ width: 300 }}
											value={selectedTag}
											defaultValue="no tags"
											defaultActiveFirstOption
											key={index}
										>
											<Option value="no tags">-</Option>
											{tag.values.map((val, index) => (
												<Option key={index} value={val}>
													{val}
												</Option>
											))}
										</Select>
									</div>
								))}
						</div>
					)}
				</div>

				<div className="metric__btn">
					<button type="secondary" value="test" onClick={getMetric}>
						Add Metric
					</button>
				</div>
			</Card>

			<div className="metrics__data">{tableLoad && RenderTable}</div>
		</div>
	);
};

export default Metrics;
