import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  id: string | null;
  name: string | null;
  email: string | null;
  pic: string | null;
  isAdmin: boolean;
  token: string | null;
  isLoading: boolean;
};

export const initialState: IUserState = {
  id: null,
  name: null,
  email: null,
  pic: null,
  isAdmin: false,
  token: null,
  isLoading: true
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, { payload }: PayloadAction<IUserState>) {
      const { token } = payload;
      state.token = token;
    },
    setIsloading(state, { payload }: PayloadAction<boolean>) {
      state.isLoading = payload; // true or false
    }
  }
});

export const { setUserData, setIsloading } = userSlice.actions; // Actions

export default userSlice.reducer; // Reducer