import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../app/store";

interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { displayName: "", photoUrl: "", uid: "" },
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = { displayName: "", photoUrl: "", uid: "" };
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.photoUrl = action.payload.photoUrl;
      state.user.displayName = action.payload.displayName;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
