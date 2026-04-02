import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom baseQuery to handle FormData and error mapping
const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Headers will be set automatically, FormData requires Content-Type to be unset
    // so browser sets it with boundary
    return headers;
  },
});

// Error handler middleware
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    // Map error codes to user-friendly messages
    const error = result.error;
    const status = error.status;

    if (status === 400) {
      result.error.data = {
        ...error.data,
        message:
          error.data?.message || "Invalid data. Please check your input.",
      };
    } else if (status === 401) {
      result.error.data = {
        ...error.data,
        message: "Session expired. Please login again.",
      };
    } else if (status === 403) {
      result.error.data = {
        ...error.data,
        message: "You don't have permission to perform this action.",
      };
    } else if (status === 404) {
      result.error.data = {
        ...error.data,
        message: "Post not found.",
      };
    } else if (status >= 500) {
      result.error.data = {
        ...error.data,
        message: "Server error. Please try again later.",
      };
    } else if (status === "FETCH_ERROR") {
      result.error.data = {
        message: "Network error. Please check your connection.",
      };
    }
  }

  return result;
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Posts", "Post", "PostList"],
  endpoints: (builder) => ({
    // Get all posts with filters
    getPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/post/get-all-post",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["PostList", { type: "Posts", id: "LIST" }],
    }),

    // Get posts from following users
    getFollowingPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/post/get-following-post",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["PostList"],
    }),

    // Get single post
    getSinglePost: builder.query({
      query: (postId) => ({
        url: `/post/get-single-post/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    // Create post
    createPost: builder.mutation({
      query: (formData) => ({
        url: "/post/create-post",
        method: "POST",
        body: formData,
        // Don't set Content-Type header for FormData, let browser set it
        headers: {},
      }),
      invalidatesTags: ["PostList", { type: "Posts", id: "LIST" }],
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Invalidate single post tag if it exists
          if (data?.data?._id) {
            dispatch(
              postsApi.util.invalidateTags([
                { type: "Post", id: data.data._id },
              ]),
            );
          }
        } catch (err) {
          // Error handled by RTK Query
        }
      },
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({ postId, formData }) => ({
        url: `/post/update-post/${postId}`,
        method: "PATCH",
        body: formData,
        headers: {},
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
        "PostList",
      ],
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Refetch the post list to ensure UI matches server state
          dispatch(postsApi.util.invalidateTags(["PostList"]));
        } catch (err) {
          // Error handled by RTK Query
        }
      },
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/post/delete-post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
        "PostList",
      ],
    }),

    // Like/Unlike post
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/post/like-post/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
      ],
      // Optimistic update
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        // Get current posts from cache
        const patchResult = dispatch(
          postsApi.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft?.data?.find((p) => p._id === postId);
            if (post) {
              // Toggle like optimistically
              const isLiked = post.likes?.includes(getState().auth?.user?._id);
              if (isLiked) {
                post.likes = post.likes.filter(
                  (id) => id !== getState().auth?.user?._id,
                );
              } else {
                post.likes = [
                  ...(post.likes || []),
                  getState().auth?.user?._id,
                ];
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Bookmark/Unbookmark post
    bookmarkPost: builder.mutation({
      query: (postId) => ({
        url: `/post/bookmark-post/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),

    // Add comment
    addComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/post/add-comment/${postId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    // Delete comment
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/post/delete-comment/${postId}`,
        method: "DELETE",
        params: { commentId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetFollowingPostsQuery,
  useGetSinglePostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useBookmarkPostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = postsApi;
