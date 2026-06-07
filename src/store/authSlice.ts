import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  dob: string;
  idCard: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Default user for public access
const defaultUser: User = {
  id: 'guest_user',
  email: 'thi_sinh@example.com',
  fullName: 'Thí sinh khách',
  phone: '0987654321',
  dob: '2005-01-01',
  idCard: '001205001234',
};

const initial: AuthState = {
  user: defaultUser,
  token: 'guest_token',
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      // Logic for logout if needed, but we probably don't need it now
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;