import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    sessionDate: null,
    user: null,
    loading: false,
    error: null
};


const sessionAuthSlice = createSlice({
    name: "sessionAuth",
    initialState,
    reducers: {
        setSessionDate(state, action) {
            state.sessionDate = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    }
});

export const { setSessionDate, setUser, setLoading, setError } = sessionAuthSlice.actions;
export default sessionAuthSlice.reducer;