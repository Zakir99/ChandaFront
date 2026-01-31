import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Config from '../Components/Js/Config';

const initialState = {
    userSessions: {},
    loading: false,
    error: null
};

const userSessionSlice = createSlice({
    name: 'userSessions',
    initialState,
    reducers: {
        setUserSessions(state, action) {
            const payload = typeof action.payload === 'string'
                ? JSON.parse(action.payload)
                : action.payload;
            state.userSessions = action.payload;
        },
        clearUserSessions(state) {
            state.userSessions = {};
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    }
});


export const saveUserSession = (userId, branchId, sessionId) => async (dispatch) => {
    const url = Config.apiUrl;
    const axiosConfig = Config.getConfig();
    dispatch(clearUserSessions());
    try {
        dispatch(setLoading(true));

        const sessionData = {
            user_id: userId,
            branch_id: branchId,
            session_id: sessionId
        };

        const response = await axios.post(`${url}UserSession`, sessionData, axiosConfig);

        dispatch(setUserSessions(response.data.userSession));
        dispatch(setError(null));

        return response.data.userSession; // <-- return something so caller can await it
    } catch (err) {
        dispatch(setError(err.message));
        throw err;
    } finally {
        dispatch(setLoading(false));
    }
};


// export const DeleteUserSession = (userId) => async (dispatch) => {
//     const url = Config.apiUrl;
//     const axiosConfig2 = Config.getConfig();
//     console.log('Config',axiosConfig2);
//     try {
//         dispatch(setLoading(true));
//         await axios.delete(`${url}UserSession/${userId}`, axiosConfig2).then(response => {
//             dispatch(clearUserSessions());
//             dispatch(setError(null));
//         }).catch(err => {
//             dispatch(setError(err.message));
//             throw err;
//         }).finally(() => {
//             dispatch(setLoading(false));
//         });
//     } catch (err) {
//         dispatch(setError(err.message));
//         throw err;
//     } finally {
//         dispatch(setLoading(false));
//     }
// };


export const { setUserSessions, setLoading, setError, clearUserSessions } = userSessionSlice.actions;
export default userSessionSlice.reducer;