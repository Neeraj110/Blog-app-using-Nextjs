// Redux Slice
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {
    forYou: [],
    following: [],
  },
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    fetchPostsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess(state, action) {
      const { tab, posts } = action.payload;
      state.loading = false;
      state.posts[tab] = posts;
    },
    fetchPostsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addPost(state, action) {
      // Add new post to the 'forYou' tab
      state.posts.forYou.unshift(action.payload);
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
} = postSlice.actions;

export default postSlice.reducer;
