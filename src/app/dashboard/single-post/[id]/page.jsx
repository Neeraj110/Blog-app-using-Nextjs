"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import PostCard from "@/components/PostCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EditPostModal from "@/components/EditPostModal";

function SinglePost() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchSinglePost = async () => {
    try {
      const response = await axios.get(`/api/post/get-single-post/${id}`);
      setPost(response.data.data);
    } catch (error) {
      console.error("Error fetching single post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSinglePost();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!post) {
    return <div className="text-gray-500 text-center py-4">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-800 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Button>
        <h1 className="text-lg font-bold">Post</h1>
      </header>

      {/* Render the main post */}
      <div>
        <PostCard
          post={post}
          isSinglePost={true}
          fetchPosts={fetchSinglePost}
          setEditModalOpen={setEditModalOpen}
        />
      </div>

      {/* Comments Section */}
      <div className="py-6 px-4 border-t border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4">Replies</h2>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start space-x-4 py-4 border-b border-gray-800 last:border-b-0"
            >
              {/* Comment Author Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    comment.user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      comment.user.name || "User"
                    )}`
                  }
                  alt={comment.user.name || "User Avatar"}
                />
                <AvatarFallback>{comment.user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{comment.user.name}</h4>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mt-2 text-sm sm:text-base whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No replies yet</p>
        )}
      </div>

      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        post={post}
        fetchPosts={fetchSinglePost}
      />
    </div>
  );
}

export default SinglePost;
