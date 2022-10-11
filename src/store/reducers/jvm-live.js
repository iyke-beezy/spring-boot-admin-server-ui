import { createSlice } from '@reduxjs/toolkit'

const jvmLive = createSlice({
    name: 'jvmLive',
    initialState: {
        value : []
    },
    reducers: {
        setJvmlive: (state, value) => {
            // 
            state.value = value;
        }
    }
})