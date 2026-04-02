import { toast } from "react-toastify";

/**
 * Handle API Errors with Toast
 * @param {Object} error - Error object
 * @param {string} defaultMessage - Default error message
 */
export const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message =
    error?.data?.message || error?.response?.data?.message || defaultMessage;
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
 * NOTE: The following functions have been migrated to RTK Query mutations:
 * - toggleLikePost → useLikePostMutation() in postsApi
 * - toggleBookmarkPost → useBookmarkPostMutation() in postsApi
 * - deletePost → useDeletePostMutation() in postsApi
 *
 * Use the RTK Query hooks directly in components instead of these helper functions.
 * This provides automatic cache management and proper error handling.
 */
