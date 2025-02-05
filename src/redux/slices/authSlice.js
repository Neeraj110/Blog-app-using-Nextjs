import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

const initialState = {
  userInfo:
    isBrowser && sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo"))
      : null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.userInfo = action.payload;
      if (isBrowser) {
        sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    logoutUser: (state) => {
      state.userInfo = null;
      if (isBrowser) {
        sessionStorage.removeItem("userInfo");
      }
    },
    toggleBookmark: (state, action) => {
      if (!state.userInfo) return;

      const postId = action.payload;
      const bookmarks = state.userInfo.bookmarks || [];
      const isBookmarked = bookmarks.includes(postId);

      const updatedUserInfo = {
        ...state.userInfo,
        bookmarks: isBookmarked
          ? bookmarks.filter((id) => id !== postId)
          : [...bookmarks, postId],
      };

      state.userInfo = updatedUserInfo;

      if (isBrowser) {
        sessionStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      }
    },
  },
});

export const { setCredential, logoutUser, toggleBookmark } = userSlice.actions;
export default userSlice.reducer;
