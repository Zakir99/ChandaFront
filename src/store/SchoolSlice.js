import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    school: {},
};

const schoolSlice = createSlice({
    name: "school",
    initialState,
    reducers: {
        setSchool: (state, action) => {
            let schoolData = action.payload;

            if (typeof schoolData === 'string') {
                try {
                    schoolData = JSON.parse(schoolData);
                } catch (error) {
                    console.error("Failed to parse school payload:", error);
                    schoolData = null;
                }
            }

            if (schoolData) {
                state.school = schoolData;
            }
        },
    },
});

export const { setSchool } = schoolSlice.actions;
export default schoolSlice.reducer;
