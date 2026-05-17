import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Config from '../Js/Config';

const initialState = {
  token: localStorage.getItem('authToken') || null,
  user: null,
  isLoading: false, // Change to false initially
  loaded: false,
  error: null,
  theme: localStorage.getItem("theme") === "true" ?? false,
  isAuthenticated: !!localStorage.getItem('authToken'), // Set based on token existence
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload);
    },
    setUser(state, action) {
      let userData = action.payload;

      if (typeof userData === 'string') {
        try {
          userData = JSON.parse(userData);
        } catch (error) {
          console.error("Failed to parse user payload:", error);
          userData = null;
        }
      }
      state.loaded = true;
      state.isLoading = false;
      state.user = userData;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false; // Reset loading state
      localStorage.removeItem('authToken');
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    markLoaded(state) {
      state.loaded = true;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    // Add this new reducer for initialization
    authInitComplete(state) {
      state.isLoading = false;
      state.loaded = true;
    },
  },
});

// Export all actions
export const {
  setToken,
  setUser,
  clearAuth,
  setLoading,
  markLoaded,
  setTheme,
  setError,
  authInitComplete
} = authSlice.actions;

// Async thunks
export const saveAllData = (token) => async (dispatch) => {
  const url = Config.apiUrl;

  try {
    dispatch(setLoading(true));

    const res = await axios.get(url + "auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Node.js response - adjust based on your API structure
    dispatch(setUser(res.data)); // User data comes directly in res.data

    return res.data;
  } catch (err) {
    console.error("Error in saveAllData:", err);
    dispatch(setError(err.response?.data?.error || "Failed to fetch user data"));
    dispatch(clearAuth()); // Clear auth on error
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchToken = (email, password, captcha) => async (dispatch) => {
  const url = Config.apiUrl;
  const axiosConfig = Config.getConfig();
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await axios.post(`${url}auth/login`, { email, password, captcha }, axiosConfig);

    // Node.js JWT typically returns token in different formats
    const token = response.data.token || response.data.access_token;

    dispatch(setToken(token));
    const userData = await dispatch(saveAllData(token));

    return userData;
  } catch (err) {
    console.error("Error in fetchToken:", err);

    // Extract meaningful error message based on status code
    let errorMessage = "Login failed";

    if (err.response) {
      // Server responded with an error status
      const status = err.response.status;
      const data = err.response.data;

      switch (status) {
        case 404:
          errorMessage = "User not found. Please check your credentials.";
          break;
        case 401:
          errorMessage = data.message || "Incorrect password. Please try again.";
          break;
        case 400:
          errorMessage = data.message || "Invalid request. Please check your input.";
          break;
        case 403:
          errorMessage = "Access denied. Your account may be locked.";
          break;
        case 429:
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = data.message || data.error || `Error: ${status}`;
      }
    } else if (err.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your internet connection.";
    } else {
      // Something else happened
      errorMessage = err.message || "An unexpected error occurred";
    }

    dispatch(setError(errorMessage));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export const saveAllDataFamily = (token) => async (dispatch) => {
  const url = Config.apiUrl;

  try {
    dispatch(setLoading(true));

    const res = await axios.get(url + "family/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Node.js response - adjust based on your API structure
    dispatch(setUser(res.data)); // User data comes directly in res.data

    return res.data;
  } catch (err) {
    console.error("Error in saveAllData:", err);
    dispatch(setError(err.response?.data?.error || "Failed to fetch user data"));
    dispatch(clearAuth()); // Clear auth on error
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};
export const fetchTokenFamily = (login_phone, password, captcha) => async (dispatch) => {
  const url = Config.apiUrl;
  const axiosConfig = Config.getConfig();
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await axios.post(`${url}family/login`,
      { login_phone, password, captcha },
      axiosConfig
    );

    const token = response.data.token || response.data.access_token;
    dispatch(setToken(token));
    const userData = await dispatch(saveAllDataFamily(token));

    return userData;
  } catch (err) {
    console.error("Error in fetchToken:", err);

    // Extract meaningful error message based on status code
    let errorMessage = "Login failed";

    if (err.response) {
      // Server responded with an error status
      const status = err.response.status;
      const data = err.response.data;

      switch (status) {
        case 404:
          errorMessage = "User not found. Please check your credentials.";
          break;
        case 401:
          errorMessage = data.message || "Incorrect password. Please try again.";
          break;
        case 400:
          errorMessage = data.message || "Invalid request. Please check your input.";
          break;
        case 403:
          errorMessage = "Access denied. Your account may be locked.";
          break;
        case 429:
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage = data.message || data.error || `Error: ${status}`;
      }
    } else if (err.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your internet connection.";
    } else {
      // Something else happened
      errorMessage = err.message || "An unexpected error occurred";
    }

    dispatch(setError(errorMessage));
    throw new Error(errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch, getState) => {
  const url = Config.apiUrl;
  const { token } = getState().auth;

  try {
    if (token) {
      // Optional: Call logout endpoint if your Node.js API has one
      await axios.post(`${url}auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    dispatch(clearAuth());
  }
};

export const setThemeAction = (theme) => (dispatch) => {
  localStorage.setItem("theme", theme.toString());
  dispatch(setTheme(theme));
};

export const initializeAuthFamily = () => async (dispatch) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    try {
      await dispatch(saveAllDataFamily(token));
    } catch (error) {
      console.error("Auth initialization failed:", error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      dispatch(clearAuth());
    }
  } else {
    // No token, mark initialization as complete
    dispatch(authInitComplete());
  }
};

export const initializeAuth = () => async (dispatch) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    try {
      await dispatch(saveAllData(token));
    } catch (error) {
      console.error("Auth initialization failed:", error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      dispatch(clearAuth());
    }
  } else {
    // No token, mark initialization as complete
    dispatch(authInitComplete());
  }
};

export default authSlice.reducer;