// // postHelpers.js
// import { toast } from "react-toastify";
// import axios from "axios";

// // Common error handling function
// export const handleApiError = (error, defaultMessage) => {
//   console.error(defaultMessage, error);
//   toast.error(error.response?.data?.message || defaultMessage);
// };

// // Generic link sharing function
// export const shareOrCopyLink = (post) => {
//   const shareUrl = `${window.location.origin}/post/${post._id}`;

//   if (navigator.share) {
//     navigator.share({
//       title: `Post by ${post.owner.name}`,
//       text: post.content,
//       url: shareUrl,
//     });
//   } else {
//     navigator.clipboard.writeText(shareUrl);
//     toast.success("Link copied!");
//   }
// };

// // Generic like handler
// export const handlePostLike = async (
//   postId,
//   userInfo,
//   currentLikeState,
//   updateLikeState,
//   updatePostState
// ) => {
//   if (!userInfo) {
//     toast.error("Please login to like the post");
//     return;
//   }

//   try {
//     await axios.post(`/api/post/like/${postId}`);

//     updateLikeState(!currentLikeState);
//     updatePostState((prevPost) => ({
//       ...prevPost,
//       likes: currentLikeState
//         ? prevPost.likes.filter((userId) => userId !== userInfo._id)
//         : [...prevPost.likes, userInfo._id],
//     }));
//   } catch (error) {
//     handleApiError(error, "Failed to like post");
//   }
// };

// // Generic post deletion handler
// export const handlePostDeletion = async (
//   postId,
//   router,
//   redirectPath = "/dashboard"
// ) => {
//   try {
//     await axios.delete(`/api/post/delete-post/${postId}`);
//     toast.success("Post deleted successfully");
//     router.push(redirectPath);
//   } catch (error) {
//     handleApiError(error, "Failed to delete post");
//   }
// };

import { toast } from "react-toastify";
import axios from "axios";

/**
 * Handle API Errors with Toast
 * @param {Object} error - Axios error object
 * @param {string} defaultMessage - Default error message
 */
export const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || defaultMessage;
  toast.error(message);
};

/**
 * Share or Copy Post Link
 * @param {Object} post - Post object
 */
export const sharePostLink = async (post) => {
  const shareUrl = `${window.location.origin}/post/${post._id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: `Post by ${post.owner.name}`,
        text: post.content,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  } catch (error) {
    toast.error("Failed to share the post");
    console.error("Error sharing post:", error);
  }
};

/**
 * Handle Post Like Toggle
 * @param {string} postId - ID of the post
 * @param {boolean} isLiked - Current like state
 * @returns {Object} Updated like count and success flag
 */
export const toggleLikePost = async (postId, isLiked) => {
  try {
    const response = await axios.put(`/api/post/like-post/${postId}`, {
      isLiked,
    });
    return { likeCount: response.data.likeCount, success: true };
  } catch (error) {
    handleApiError(error, "Failed to like post");
    return { success: false };
  }
};

/**
 * Bookmark or Remove Bookmark from a Post
 * @param {string} postId - ID of the post
 * @param {boolean} isBookmarked - Current bookmark state
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} setCredential - Redux action to update user state
 */
export const toggleBookmarkPost = async (
  postId,
  isBookmarked,
  dispatch,
  setCredential
) => {
  try {
    const action = isBookmarked ? "remove" : "add";
    await axios.patch(`/api/post/bookmark-post/${postId}`);
    const response = await axios.get("/api/user/profile");

    dispatch(setCredential(response.data.user));
    toast.success(
      isBookmarked
        ? "Post removed from bookmarks"
        : "Post bookmarked successfully"
    );
  } catch (error) {
    handleApiError(error, "Failed to toggle bookmark");
  }
};

/**
 * Delete Post
 * @param {string} postId - ID of the post
 * @param {Function} fetchPosts - Function to refresh the posts list
 * @param {Function} router - Next.js router instance
 * @param {string} redirectPath - Path to redirect after deletion
 */
export const deletePost = async (
  postId,
  fetchPosts,
  router,
  redirectPath = "/dashboard"
) => {
  try {
     await axios.delete(`/api/post/delete-post/${postId}`);
    toast.success("Post deleted successfully");
    fetchPosts();
    router.push(redirectPath);
  } catch (error) {
    handleApiError(error, "Failed to delete post");
    
  }
};
