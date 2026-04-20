import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  avatarColor: string | null;
  jwt: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  displayName: null,
  avatarColor: null,
  jwt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        userId: string;
        email: string;
        displayName: string;
        avatarColor: string;
        jwt: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.avatarColor = action.payload.avatarColor;
      state.jwt = action.payload.jwt;
    },
    clearAuth: state => {
      state.isAuthenticated = false;
      state.userId = null;
      state.email = null;
      state.displayName = null;
      state.avatarColor = null;
      state.jwt = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
