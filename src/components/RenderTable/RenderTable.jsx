import React from "react";
import { Table } from "antd";

const RenderTable = ({ columns, data }) => {
	return (
		<Table
			columns={columns}
			dataSource={data}
			showHeader={false}
			pagination={false}
		/>
	);
};

export default RenderTable;
