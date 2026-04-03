"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import PostCard from "@/components/PostCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, RefreshCw } from "lucide-react";
import EditPostModal from "@/components/EditPostModal";

function SinglePost() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getCommentTime = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return createdDate.toLocaleDateString();
  };

  const fetchSinglePost = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`/api/post/get-single-post/${id}`);
      setPost(response.data.data);
    } catch (error) {
      console.error("Error fetching single post:", error);
      setError(error?.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSinglePost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
          <div className="editorial-panel p-8 text-center">
            <h2 className="text-xl font-semibold">Post not found</h2>
            <p className="mt-2 text-on-surface-variant">
              {error ||
                "This post may have been deleted or is no longer available."}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="border-outline-variant/30 bg-transparent"
              >
                Go back
              </Button>
              <Button onClick={fetchSinglePost} className="gradient-primary">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-20 border-b border-outline-variant/20 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-surface-container"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-on-surface" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Post</h1>
            <p className="text-xs text-on-surface-variant">
              {post.comments?.length || 0}{" "}
              {post.comments?.length === 1 ? "reply" : "replies"}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6 md:py-6">
        <PostCard
          post={post}
          isSinglePost={true}
          fetchPosts={fetchSinglePost}
          setEditModalOpen={setEditModalOpen}
        />

        <section className="editorial-panel mt-4 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-outline-variant/20 px-5 py-4">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-on-surface-variant">
              Replies
            </h2>
          </div>

          {post.comments?.length > 0 ? (
            <div className="divide-y divide-outline-variant/15">
              {post.comments.map((comment) => (
                <article
                  key={comment._id}
                  className="px-5 py-4 hover:bg-surface-container/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          comment.user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.user.name || "User",
                          )}`
                        }
                        alt={comment.user.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {comment.user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-on-surface sm:text-base">
                          {comment.user.name}
                        </h4>
                        <span
                          className="text-xs text-on-surface-variant"
                          title={new Date(comment.createdAt).toLocaleString()}
                        >
                          {getCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-on-surface sm:text-base">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-on-surface-variant">
                No replies yet. Be the first to reply.
              </p>
            </div>
          )}
        </section>
      </div>

      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        post={post}
      />
    </div>
  );
}

export default SinglePost;
