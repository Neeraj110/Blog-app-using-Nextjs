import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slices/authSlice";
import postReducer from "@/redux/slices/postSlice";

const store = configureStore({
  reducer: {
    auth: userReducer, // Use the correct reducer
    post: postReducer,
  },
});

export default store;
