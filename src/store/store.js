import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// import userSessionReducer from './userSessionSlice';
// import sessionAuthReducer from './SessionAuth';
// import schoolReducer from './SchoolSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // userSessions: userSessionReducer,
    // sessionAuth: sessionAuthReducer,
    // school: schoolReducer,
  },
});

export default store;
