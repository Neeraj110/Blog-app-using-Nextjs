import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["UserProfile", "UserList", "PublicProfile", "FollowStatus"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
    }),

    verifyUser: builder.mutation({
      query: (body) => ({
        url: "/user/verifyUser",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: [
        "UserProfile",
        "UserList",
        "PublicProfile",
        "FollowStatus",
      ],
    }),

    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    getUserProfile: builder.query({
      query: (id) => ({
        url: `/user/user-profile/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PublicProfile", id }],
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "/user/fetch-alluser",
        method: "GET",
      }),
      providesTags: ["UserList"],
    }),

    searchUsers: builder.query({
      query: (name) => ({
        url: `/user/search-user/${encodeURIComponent(name)}`,
        method: "GET",
      }),
      providesTags: ["UserList"],
    }),

    followUser: builder.mutation({
      query: (id) => ({
        url: `/user/follow/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "UserProfile",
        "UserList",
        { type: "PublicProfile", id },
        { type: "FollowStatus", id },
      ],
    }),

    getFollowStatus: builder.query({
      query: (id) => ({
        url: `/user/follow/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "FollowStatus", id }],
    }),

    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/user/update-user",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["UserProfile", "UserList"],
    }),

    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/user/update-avatar",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["UserProfile", "UserList"],
    }),

    updateCoverImg: builder.mutation({
      query: (formData) => ({
        url: "/user/update-coverImg",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["UserProfile", "UserList"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyUserMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useGetAllUsersQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useFollowUserMutation,
  useGetFollowStatusQuery,
  useUpdateUserMutation,
  useUpdateAvatarMutation,
  useUpdateCoverImgMutation,
} = userApi;
