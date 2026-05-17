import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// import familyReducer from './FamilySlice';
import socketReducer from './slices/socketSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // family: familyReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

export default store;
