// import { createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import Config from '../Js/Config';
// // import { verifyCaptcha } from '../../../Backend/src/controllers/authentication.controller';

// const initialState = {
//     token: localStorage.getItem('familyToken') || null,
//     user: null,
//     isLoading: false, // Change to false initially
//     loaded: false,
//     error: null,
//     theme: localStorage.getItem("theme") === "true" ?? false,
//     isAuthenticated: !!localStorage.getItem('familyToken'), // Set based on token existence
// };

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         setToken(state, action) {
//             state.token = action.payload;
//             state.isAuthenticated = true;
//             localStorage.setItem('familyToken', action.payload);
//         },
//         setUser(state, action) {
//             let userData = action.payload;
//             if (typeof userData === 'string') {
//                 try {
//                     userData = JSON.parse(userData);
//                 } catch (error) {
//                     console.error("Failed to parse user payload:", error);
//                     userData = null;
//                 }
//             }
//             state.loaded = true;
//             state.isLoading = false;
//             state.user = userData;
//             state.isAuthenticated = true;
//         },
//         clearAuth(state) {
//             state.token = null;
//             state.user = null;
//             state.isAuthenticated = false;
//             state.isLoading = false; // Reset loading state
//             localStorage.removeItem('familyToken');
//         },
//         setLoading(state, action) {
//             state.isLoading = action.payload;
//         },
//         markLoaded(state) {
//             state.loaded = true;
//         },
//         setTheme(state, action) {
//             state.theme = action.payload;
//         },
//         setError(state, action) {
//             state.error = action.payload;
//         },
//         // Add this new reducer for initialization
//         authInitComplete(state) {
//             state.isLoading = false;
//             state.loaded = true;
//         },
//     },
// });

// // Export all actions
// export const {
//     setToken,
//     setUser,
//     clearAuth,
//     setLoading,
//     markLoaded,
//     setTheme,
//     setError,
//     authInitComplete
// } = authSlice.actions;

// // Async thunks
// export const saveAllData = (token) => async (dispatch) => {
//     const url = Config.apiUrl;

//     try {
//         dispatch(setLoading(true));

//         const res = await axios.get(url + "family/user", {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         // Node.js response - adjust based on your API structure
//         dispatch(setUser(res.data)); // User data comes directly in res.data

//         return res.data;
//     } catch (err) {
//         console.error("Error in saveAllData:", err);
//         dispatch(setError(err.response?.data?.error || "Failed to fetch user data"));
//         dispatch(clearAuth()); // Clear auth on error
//         throw err;
//     } finally {
//         dispatch(setLoading(false));
//     }
// };

// export const fetchToken = (login_phone, password, captchaToken) => async (dispatch) => {
//     const url = Config.apiUrl;
//     const axiosConfig = Config.getConfig();

//     try {
//         dispatch(setLoading(true));
//         dispatch(setError(null));
//         const response = await axios.post(`${url}family/login`, { login_phone, password, captchaToken }, axiosConfig);

//         // Node.js JWT typically returns token in different formats
//         const token = response.data.token || response.data.access_token;

//         dispatch(setToken(token));
//         const userData = await dispatch(saveAllData(token));

//         return userData;
//     } catch (err) {
//         console.error("Login error:", err);
//         const errorMessage = err.response?.data?.error || "Login failed";
//         dispatch(setError(errorMessage));
//         throw err;
//     } finally {
//         dispatch(setLoading(false));
//     }
// };

// export const logout = () => async (dispatch, getState) => {
//     const url = Config.apiUrl;
//     const { token } = getState().auth;

//     try {
//         if (token) {
//             // Optional: Call logout endpoint if your Node.js API has one
//             await axios.post(`${url}family/logout`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//         }
//     } catch (err) {
//         console.error("Logout error:", err);
//     } finally {
//         dispatch(clearAuth());
//     }
// };

// export const setThemeAction = (theme) => (dispatch) => {
//     localStorage.setItem("theme", theme.toString());
//     dispatch(setTheme(theme));
// };

// export const initializeAuth = () => async (dispatch) => {
//     const token = localStorage.getItem('familyToken');

//     if (token) {
//         try {
//             await dispatch(saveAllData(token));
//         } catch (error) {
//             console.error("Auth initialization failed:", error);
//             // Clear invalid token
//             localStorage.removeItem('familyToken');
//             dispatch(clearAuth());
//         }
//     } else {
//         // No token, mark initialization as complete
//         dispatch(authInitComplete());
//     }
// };

// export default authSlice.reducer;