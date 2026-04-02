import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slices/authSlice";
import postReducer from "@/redux/slices/postSlice";
import { postsApi } from "@/redux/api/postsApi";
import { userApi } from "@/redux/api/userApi";

const store = configureStore({
  reducer: {
    auth: userReducer,
    post: postReducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware, userApi.middleware),
});

export default store;
