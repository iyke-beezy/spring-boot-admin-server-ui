import { createSlice } from "@reduxjs/toolkit";

const instanceReducer = createSlice({
    name: 'instanceId',
    initialState: {
        value: 0
    },
    reducers : {
        setId : (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setId } = instanceReducer.actions;

export default instanceReducer.reducer;
