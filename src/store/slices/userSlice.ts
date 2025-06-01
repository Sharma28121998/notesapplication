import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  email: string;
  password: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  username: '',
  email: '',
  password: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string; email: string; password: string }>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.username = '';
      state.email = '';
      state.password = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 