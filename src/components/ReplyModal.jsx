import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ReplyModal = ({ isOpen, onClose, post, fetchPosts }) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 300;
  const TRUNCATE_LENGTH = 100; // Limit for truncating post content
  const router = useRouter();

  // Handle reply input change
  const handleReplyChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setReply(text);
      setCharCount(text.length);
    }
  };

  // Handle posting reply
  const handlePostReply = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/post/add-comment/${post._id}`, {
        comment: reply,
      });
      setReply("");
      fetchPosts();
      onClose();
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigating to the full post page
  const handleShowMore = () => {
    router.push(`/dashboard/single-post/${post._id}`);
  };

  // Truncate post content if it's too long
  const isContentTruncated = post.content.length > TRUNCATE_LENGTH;
  const truncatedContent = isContentTruncated
    ? `${post.content.slice(0, TRUNCATE_LENGTH)}...`
    : post.content;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
      <Card className="md:w-full w-[85%] max-w-lg bg-surface-container-low text-on-surface border border-outline-variant/20 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="w-8" />
          <X
            className="w-5 h-5 cursor-pointer text-on-surface-variant hover:text-on-surface"
            onClick={onClose}
          />
        </div>

        <div className="flex space-x-4">
          {/* Avatar and vertical divider */}
          <div className="flex flex-col items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={
                  post.owner.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    post.owner.name || "User",
                  )}`
                }
                alt={post.owner.name || "User Avatar"}
              />
              <AvatarFallback>{post.owner.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="w-0.5 flex-1 bg-outline-variant/30 my-2" />
          </div>

          {/* Post content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold">{post.owner.name}</span>
              <span className="text-on-surface-variant">
                @{post.owner.username}
              </span>
            </div>
            <p className="text-on-surface mt-2 text-sm sm:text-base whitespace-pre-wrap">
              {truncatedContent}
              {isContentTruncated && (
                <button
                  onClick={handleShowMore}
                  className="ml-2 text-primary underline hover:opacity-90"
                >
                  Show More
                </button>
              )}
            </p>

            <div className="text-on-surface-variant text-sm mt-2">
              Replying to{" "}
              <span className="text-primary">@{post.owner.username}</span>
            </div>
          </div>
        </div>

        {/* Reply textarea */}
        <div className="ml-14 mt-4">
          <textarea
            value={reply}
            onChange={handleReplyChange}
            placeholder="Post your reply"
            className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[120px]"
            rows={4}
          />

          <div className="flex items-center justify-between mt-4 border-t border-outline-variant/20 pt-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span
                  className={
                    charCount > MAX_CHARS - 20
                      ? "text-yellow-500"
                      : "text-on-surface-variant"
                  }
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
              <Button
                onClick={handlePostReply}
                disabled={loading || charCount > MAX_CHARS}
                className="gradient-primary hover:opacity-90 text-primary-foreground rounded-full px-6 py-2 font-bold disabled:opacity-50"
              >
                {loading ? "Posting..." : "Reply"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReplyModal;
