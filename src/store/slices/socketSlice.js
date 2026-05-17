// store/slices/socketSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  communityUuid: null
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      
      // Add to notifications
      state.notifications.unshift({
        ...action.payload,
        id: Date.now(),
        read: false,
        type: 'message'
      });
      
      state.unreadCount += 1;
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },
    
    addNotification: (state, action) => {
      state.notifications.unshift({
        ...action.payload,
        id: Date.now(),
        read: false
      });
      state.unreadCount += 1;
      
      // Keep only last 50 notifications
      if (state.notifications.length > 10) {
        state.notifications.pop();
      }
    },
    
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    
    markAllAsRead: (state) => {
      state.notifications.forEach(n => { n.read = true; });
      state.unreadCount = 0;
    },
    
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    
    setCommunityUuid: (state, action) => {
      state.communityUuid = action.payload;
    },
    
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

// Selectors
export const selectMessages = (state) => state.socket.messages;
export const selectNotifications = (state) => state.socket.notifications;
export const selectUnreadCount = (state) => state.socket.unreadCount;
export const selectIsConnected = (state) => state.socket.isConnected;

// Memoized selector for unread notifications only
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => !n.read)
);

export const {
  addMessage,
  addNotification,
  markNotificationAsRead,
  markAllAsRead,
  setConnectionStatus,
  setCommunityUuid,
  clearMessages
} = socketSlice.actions;

export default socketSlice.reducer;