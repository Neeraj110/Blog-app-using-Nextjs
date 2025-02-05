"use client";
import {
  formatDistanceToNowStrict,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import PostMedia from "./PostMedia";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  Bookmark,
  EllipsisVertical,
  Share2,
  Heart,
  MessageCircle,
  Trash2,
  Edit,
  Flag,
  User2,
} from "lucide-react";
import axios from "axios";
import { useState, useCallback, memo } from "react";
import ReplyModal from "./ReplyModal";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/helper/dateUtils";
import { setCredential } from "@/redux/slices/authSlice";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import {
  sharePostLink,
  toggleLikePost,
  toggleBookmarkPost,
  deletePost,
} from "@/helper/postHelpers";
import SinglePost from "@/app/dashboard/single-post/[id]/page";
import { handlefetchProfile } from "@/helper/followActions";

const PostCard = memo(
  ({ post, isPriority = false, fetchPosts, isSinglePost }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [likeCount, setLikeCount] = useState(
      post?.engagement?.likeCount || 0
    );
    const [isLiked, setIsLiked] = useState(post.likes?.includes(userInfo?._id));
    const [isBookmarked, setIsBookmarked] = useState(
      userInfo?.bookmarks.map((bookmark) => bookmark._id).includes(post._id)
    );

    const handleLikePost = async () => {
      const { likeCount: updatedCount, success } = await toggleLikePost(
        post._id,
        isLiked
      );
      handlefetchProfile(dispatch, setCredential);
      if (success) {
        setLikeCount(updatedCount);
        setIsLiked((prev) => !prev);
      }
    };

    const handleBookmarkPost = async () => {
      await toggleBookmarkPost(post._id, isBookmarked, dispatch, setCredential);
      setIsBookmarked((prev) => !prev);
    };

    const handleSharePost = () => {
      sharePostLink(post);
    };

    const handleDeletePost = () => {
      if (isSinglePost) {
        router.push("/dashboard");
      }
      deletePost(post._id, fetchPosts, router);
    };

    const handleEditPost = () => {
      router.push(`/post/edit/${post._id}`);
    };
    const isPostOwner = userInfo?._id === post.owner._id;

    return (
      <article
        className="p-4 sm:p-6 border-b border-gray-800 hover:bg-gray-900/40 transition-colors"
        aria-label={`Post by ${post.owner.name}`}
      >
        <div className="flex space-x-3 sm:space-x-5 mb-[3rem] md:mb-0">
          <Link
            href={`/dashboard/userProfile/${post.owner._id}`}
            passHref
            prefetch={true}
          >
            <div className="flex-shrink-0 cursor-pointer">
              <Avatar className="w-9 h-9 sm:w-12 sm:h-12">
                <AvatarImage
                  src={
                    post.owner.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      post.owner.name || "User"
                    )}`
                  }
                  alt={post?.owner?.name || "User Avatar"}
                />
                <AvatarFallback>{post?.owner?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <Link
                href={`/dashboard/userProfile/${post.owner._id}`}
                passHref
                prefetch={true}
              >
                <div className="flex items-center space-x-1 flex-wrap">
                  <span className="font-bold text-white hover:underline text-sm sm:text-base">
                    {post.owner.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    @{post.owner.username}
                  </span>
                  <span className="text-gray-500 text-sm">·</span>
                  <time
                    className="text-gray-500 hover:underline text-sm"
                    dateTime={post.createdAt}
                    title={format(new Date(post.createdAt), "PPP p")}
                  >
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical className="text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[8rem] z-40 bg-gray-950 rounded-md shadow-lg p-2 gap-4 cursor-pointer"
                  aria-label="Post Options"
                >
                  {isPostOwner ? (
                    <>
                      <DropdownMenuItem
                        onSelect={handleEditPost}
                        className="flex items-center justify-evenly"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeletePost(post._id)}
                        className="flex items-center justify-evenly"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                        Delete Post
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onSelect={() =>
                          toast.info("Report functionality coming soon")
                        }
                        className="flex items-center justify-evenly"
                      >
                        <Flag className="mr-2 h-4 w-4 text-yellow-500" />
                        Report
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          router.push(
                            `/dashboard/userProfile/${post.owner._id}`
                          );
                        }}
                        className="flex items-center justify-evenly"
                      >
                        <User2 className="mr-2 h-4 w-4 text-gray-500" />
                        View Profile
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link
              href={`/dashboard/single-post/${post._id}`}
              passHref
              prefetch={true}
              className="cursor-pointer"
            >
              <p className="text-white mt-2 text-sm sm:text-base whitespace-pre-wrap">
                {post.content}
              </p>

              <PostMedia media={post.media} isPriority={isPriority} lazy />
            </Link>
            <div className="flex items-center justify-between mt-4 text-gray-500 max-w-md text-sm sm:text-base">
              <Button
                onClick={handleLikePost}
                className={`flex items-center space-x-2 ${
                  isLiked ? "text-pink-500" : "text-gray-500"
                } hover:text-pink-500 group`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isLiked ? "fill-pink-500" : "fill-none"
                  }`}
                />

                <span>{likeCount}</span>
              </Button>

              <Button
                onClick={() => setReplyModalOpen(true)}
                className="flex items-center space-x-2 hover:text-green-500 group"
                aria-label="Reply to post"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{post?.engagement?.commentCount || 0}</span>
              </Button>

              <Button
                onClick={handleSharePost}
                className="flex items-center space-x-2 hover:text-blue-500 group"
                aria-label="Share post"
              >
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>

              <Button
                onClick={() => handleBookmarkPost(post._id)}
                className={` flex items-center space-x-2 hover:text-yellow-500 group `}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
              >
                <Bookmark
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isBookmarked ? "fill-yellow-500" : "fill-none"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>

        <ReplyModal
          isOpen={replyModalOpen}
          onClose={() => setReplyModalOpen(false)}
          post={post}
          fetchPosts={fetchPosts}
        />
      </article>
    );
  }
);

export default PostCard;
