import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};
//by using slice, we create reducer and actions at the same time;
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //create 3 actions below
    signStart: (state) => {
      state.loading = true;
    },
    signSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    signFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { signStart, signSuccess, signFailure } = userSlice.actions;
export default userSlice.reducer;
