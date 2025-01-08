import { createSlice } from '@reduxjs/toolkit';

let timeoutId;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'This is the initial notification message',
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  },
});

export const showNotification = (message, duration = 5000) => {
    return (dispatch) => {
      dispatch(setNotification(message));
  
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
  
      timeoutId = setTimeout(() => {
        dispatch(clearNotification());
      }, duration);
    };
  };

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
