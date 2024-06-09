import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import ticketSlice from './features/ticket/ticketSlice';

export const store = configureStore({
  reducer: {
    userState: userReducer,
    ticketState: ticketSlice,
  },
});
