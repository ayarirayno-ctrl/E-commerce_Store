import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Notification } from '../../types';

const initialState: UIState = {
  sidebarOpen: false,
  notifications: [],
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        requestId: action.payload.requestId,
        action: action.payload.action,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;




