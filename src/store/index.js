import { configureStore } from "@reduxjs/toolkit";
import metricsReducer from "./reducers/metrics";
import instanceReducer from "./reducers/app-instance";

export default configureStore({
	reducer: {
		metrics: metricsReducer,
		instance: instanceReducer,
	},
});
