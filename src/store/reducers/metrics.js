import { createSlice } from "@reduxjs/toolkit";

export const metrics = createSlice({
	name: "metrics",
	initialState: {
		values: {},
	},
	reducers: {
		setMetrics: (state, action) => {
			let metric = action.payload;
			state.values[metric.name] = metric.values;
		},
	},
});

export const { setMetrics } = metrics.actions;
export default metrics.reducer;
