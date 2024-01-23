"use client";

import { createSlice } from "@reduxjs/toolkit";

interface User {
  _id: string;
  phoneNumber: string;
  googleId: string;
  username: string;
  roles: string[];
}
const initialState: User = {
  _id: "",
  phoneNumber: "",
  googleId: "",
  username: "",
  roles: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.phoneNumber = action.payload.phoneNumber;
      state.googleId = action.payload.googleId;
      state.username = action.payload.username;
      state.roles = action.payload.roles;
    },
    removeUser: (state) => {
      state._id = "";
      state.phoneNumber = "";
      state.googleId = "";
      state.username = "";
      state.roles = [];
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
