"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TabButton from "@/components/TabButton";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { ImagePlus, List, Smile, Bot } from "lucide-react";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "@/redux/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";

function Content() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [fetchStatus, setFetchStatus] = useState({
    forYou: { fetched: false, hasMore: true },
    following: { fetched: false, hasMore: true },
  });
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.auth);

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
          }),
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
            err.response?.data?.message || "Failed to fetch posts",
          ),
        );
        // Prevent further fetches on error
        setFetchStatus((prev) => ({
          ...prev,
          [tab]: { ...prev[tab], hasMore: false },
        }));
      }
    },
    [dispatch, loading, fetchStatus],
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
        <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
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
      <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
        <p className="text-xl">
          {activeTab === "following"
            ? "Follow some accounts to see their posts"
            : "No posts available"}
        </p>
      </div>
    );
  }, [loading, error, posts, activeTab, fetchPosts]);

  return (
    <main className="min-h-screen bg-surface">
      <div className="sticky top-0 z-20 glass-surface border-b border-outline-variant/10">
        <div className="flex px-2 md:px-5 pt-2">
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

      <div className="space-y-6 px-2 md:px-5 py-5">
        <section className="bg-surface-container-low rounded-2xl p-5 md:p-6">
          <div className="flex gap-4">
            <img
              suppressHydrationWarning
              className="w-11 h-11 rounded-xl object-cover"
              src={
                userInfo?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userInfo?.name || "User",
                )}`
              }
              alt={userInfo?.name || "User"}
            />
            <div className="flex-1">
              <textarea
                className="w-full bg-surface-container-lowest border-none focus:ring-0 focus:border-b-2 focus:border-primary text-on-surface placeholder:text-on-surface-variant/60 rounded-lg p-4 resize-none h-24 transition-all"
                placeholder="What's brewing in your code today?"
                readOnly
                onClick={() => setIsPostModalOpen(true)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div className="flex gap-2 text-primary">
              <button
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                onClick={() => setIsPostModalOpen(true)}
                aria-label="Add image"
              >
                <ImagePlus size={20} />
              </button>
              <button
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                onClick={() => setIsPostModalOpen(true)}
                aria-label="Post options"
              >
                <List size={20} />
              </button>
              <button
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                onClick={() => setIsPostModalOpen(true)}
                aria-label="Mood"
              >
                <Smile size={20} />
              </button>
            </div>
            <button
              className="px-6 py-2.5 gradient-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-90 active:scale-95 transition-all"
              onClick={() => setIsPostModalOpen(true)}
            >
              Post
            </button>
          </div>
        </section>

        <section className="space-y-6">{renderedPosts()}</section>
      </div>

      {isPostModalOpen && (
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          user={userInfo}
        />
      )}
    </main>
  );
}

export default Content;
