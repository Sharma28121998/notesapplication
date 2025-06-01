import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import notesReducer from './slices/notesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 