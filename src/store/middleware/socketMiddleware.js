// store/middleware/socketMiddleware.js
import io from 'socket.io-client';
import { addMessage, addNotification, setConnectionStatus } from '../slices/socketSlice';

let socket = null;

export const socketMiddleware = (store) => (next) => (action) => {
  // Handle setting up socket when user logs in
  if (action.type === 'auth/setUser' && action.payload?.community_uuid) {
    const communityUuid = action.payload.community_uuid;
    
    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
    }
    
    // console.log("Joining group with community UUID:", communityUuid);
    // Connect to socket
    socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      store.dispatch(setConnectionStatus(true));
      socket.emit('join_group', communityUuid);
    });
    
    socket.on('disconnect', () => {
      store.dispatch(setConnectionStatus(false));
    });
    
    socket.on('receive_message', (msg) => {
      console.log('Received message:', msg);
      store.dispatch(addMessage(msg));
    });
    
    socket.on('notification', (notification) => {
      store.dispatch(addNotification(notification));
    });
  }
  
  // Handle sending messages
  if (action.type === 'socket/sendMessage' && socket) {
    socket.emit('send_message', action.payload);
  }
  
  // Handle logout
  if (action.type === 'auth/logout' && socket) {
    socket.disconnect();
    socket = null;
  }
  
  return next(action);
};

// Action creator for sending messages
export const sendMessage = (messageData) => ({
  type: 'socket/sendMessage',
  payload: messageData
});