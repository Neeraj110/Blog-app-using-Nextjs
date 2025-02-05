"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TabButton from "@/components/TabButton";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PostCard from "@/components/PostCard";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "@/redux/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";

function Content() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [fetchStatus, setFetchStatus] = useState({
    forYou: { fetched: false, hasMore: true },
    following: { fetched: false, hasMore: true },
  });
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);

  const fetchPosts = useCallback(
    async (tab) => {
      if (!fetchStatus[tab].hasMore || loading) return;

      dispatch(fetchPostsStart());
      try {
        const endpoint =
          tab === "forYou"
            ? "/api/post/get-all-post"
            : "/api/post/get-following-post";

        const { data } = await axios.get(endpoint);
        const fetchedPosts = data.data || [];

        dispatch(
          fetchPostsSuccess({
            tab,
            posts: fetchedPosts,
          })
        );

        // Update fetch status
        setFetchStatus((prev) => ({
          ...prev,
          [tab]: {
            fetched: true,
            hasMore: fetchedPosts.length > 0,
          },
        }));
      } catch (err) {
        dispatch(
          fetchPostsFailure(
            err.response?.data?.message || "Failed to fetch posts"
          )
        );
        // Prevent further fetches on error
        setFetchStatus((prev) => ({
          ...prev,
          [tab]: { ...prev[tab], hasMore: false },
        }));
      }
    },
    [dispatch, loading, fetchStatus]
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Only fetch if not already fetched and potentially has more posts
    if (!fetchStatus[tab].fetched && fetchStatus[tab].hasMore) {
      fetchPosts(tab);
    }
  };

  useEffect(() => {
    // Initial fetch for forYou tab
    if (!fetchStatus.forYou.fetched) {
      fetchPosts("forYou");
    }
  }, []);

  const renderedPosts = useCallback(() => {
    if (loading) {
      return Array(8)
        .fill(0)
        .map((_, i) => <LoadingSkeleton key={i} />);
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <p className="text-xl">Error: {error}</p>
        </div>
      );
    }

    if (posts[activeTab]?.length > 0) {
      return posts[activeTab].map((post) => (
        <PostCard
          key={post._id}
          post={post}
          fetchPosts={() => fetchPosts(activeTab)}
        />
      ));
    }

    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <p className="text-xl">
          {activeTab === "following"
            ? "Follow some accounts to see their posts"
            : "No posts available"}
        </p>
      </div>
    );
  }, [loading, error, posts, activeTab, fetchPosts]);

  return (
    <main className="min-h-screen border-gray-800">
      <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-md">
        <div className="flex border-b border-gray-800">
          <TabButton
            active={activeTab === "forYou"}
            onClick={() => handleTabChange("forYou")}
            className="flex-1"
          >
            For you
          </TabButton>
          <TabButton
            active={activeTab === "following"}
            onClick={() => handleTabChange("following")}
            className="flex-1"
          >
            Following
          </TabButton>
        </div>
      </div>
      <div className="divide-y divide-gray-800">{renderedPosts()}</div>
    </main>
  );
}

export default Content;
