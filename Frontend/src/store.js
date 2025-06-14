import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  theme: 'light',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setState } = appSlice.actions;

const store = configureStore({
  reducer: appSlice.reducer,
});

export default store;
