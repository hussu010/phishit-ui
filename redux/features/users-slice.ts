"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: null,
  phoneNumber: null,
  googleId: null,
  username: null,
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
      state._id = null;
      state.phoneNumber = null;
      state.googleId = null;
      state.username = null;
      state.roles = [];
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
