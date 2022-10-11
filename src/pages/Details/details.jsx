import React from "react";
import { useSelector } from "react-redux";
import { AiFillHome } from "react-icons/ai";
import { TiSpanner, TiRefresh } from "react-icons/ti";
import { FaHeartbeat } from "react-icons/fa";
import { Card, Table } from "antd";

import { RenderTable } from "../../components";
import "./details.scss";
import DetailsProcess from "./details-process";
import ThreadsChart from "./details-threads";
import MemoryChart from "./details-memory";

const instance = {
	status: "UP",
	components: {
		db: {
			status: "UP",
			details: {
				database: "HSQL Database Engine",
				validationQuery: "isValid()",
			},
		},
		discoveryComposite: {
			description: "Discovery Client not initialized",
			status: "UNKNOWN",
			components: {
				discoveryClient: {
					description: "Discovery Client not initialized",
					status: "UNKNOWN",
				},
			},
		},
		diskSpace: {
			status: "UP",
			details: {
				total: 511818330112,
				free: 272574586880,
				threshold: 10485760,
				exists: true,
			},
		},
		ping: { status: "UP" },
		reactiveDiscoveryClients: {
			description: "Discovery Client not initialized",
			status: "UNKNOWN",
			components: {
				"Simple Reactive Discovery Client": {
					description: "Discovery Client not initialized",
					status: "UNKNOWN",
				},
			},
		},
		refreshScope: { status: "UP" },
	},
};
const { components } = instance;
let headers = Object.keys(components);

// reformat data for table
const getData = (obj) => {
	let newData = [];
	let data = Object.keys(obj);
	data.map((item, id) => {
		newData.push({
			key: id + 1,
			name: item,
			value: obj[item],
		});
	});
	return newData;
};

for (const item in instance) {
	if (typeof instance[item] == "object") {
	}
}

const metaColumns = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Value",
		dataIndex: "value",
		key: "value",
	},
];

const Details = (props) => {
	const { header, details } = props;
	// header content
	const { title, id, links } = header;

	// details contente
	const { info, meta } = details;
	const instanceId = useSelector((state) => state.instance.value);

	// health content

	return (
		<div className="instance_details">
			{/* header */}
			<div className="details__header">
				<div className="header__info">
					<span className="header__title">{title}</span>
					<span>Id: {id}</span>
				</div>
				<div className="header__links">
					{links.map((link, id) => (
						<div className="link__item" key={id}>
							{id === 0 && (
								<span>
									<AiFillHome />
								</span>
							)}
							{id === 1 && (
								<span>
									<TiSpanner />
								</span>
							)}
							{id === 2 && (
								<span>
									<FaHeartbeat />
								</span>
							)}
							<p>{link}</p>
						</div>
					))}
				</div>
			</div>
			<hr />
			{/* details */}
			<div className="details__info">
				<div className="row">
					<div className="col-1">
						{/* info */}
						<div className="instance__info">
							<Card title="Info">
								<p>{info}</p>
							</Card>
						</div>

						{/* Meta */}
						<div className="instance__metadata">
							<Card title="Metadata">
								<Table
									showHeader={false}
									columns={metaColumns}
									dataSource={meta}
									pagination={false}
								/>
							</Card>
						</div>
					</div>
					<div className="col-2">
						{/* Health */}
						<Card
							title="Health"
							extra={
								<a href="#">
									<TiRefresh />
								</a>
							}
						>
							<Card
								title="Instance"
								extra={<p className="status">{instance.status}</p>}
							>
								{headers.map((item, index) => (
									<Card
										key={index}
										title={item}
										extra={<p className="status">{components[item].status}</p>}
									>
										{Object.keys(components[item]).map((key, index) =>
											typeof components[item][key] === "object" &&
											key === "details" ? (
												<RenderTable
													key={index}
													columns={metaColumns}
													data={getData(components[item][key])}
												/>
											) : (
												typeof components[item][key] === "object" &&
												key === "components" && (
													<Card
														key={index}
														title={Object.keys(components[item][key])[0]}
														extra={
															<p className="status">
																{
																	components[item][key][
																		Object.keys(components[item][key])[0]
																	].status
																}
															</p>
														}
													></Card>
												)
											)
										)}
									</Card>
								))}
							</Card>
						</Card>
					</div>
				</div>
				<div className="row">
					<div className="col-1">
						<div className="details_process">
							<DetailsProcess instanceId={instanceId} />
						</div>
					</div>
					<div className="col-2">
						<ThreadsChart instanceId={instanceId} />
					</div>
				</div>
				<div className="row">
					<div className="col-1">
						<MemoryChart instanceId={instanceId} type="heap" />
					</div>
					<div className="col-2">
						<MemoryChart instanceId={instanceId} type="nonheap" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Details;
