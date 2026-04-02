import { toast } from "react-toastify";
import { userApi } from "@/redux/api/userApi";

export const handleFollow = async (
  userId,
  currentStatus,
  dispatch,
  setCredential,
) => {
  try {
    const followResult = await dispatch(
      userApi.endpoints.followUser.initiate(userId),
    ).unwrap();
    const profileRequest = dispatch(
      userApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }),
    );
    const updatedUser = await profileRequest.unwrap();
    profileRequest.unsubscribe?.();

    dispatch(setCredential(updatedUser.user));

    return typeof followResult?.isFollowing === "boolean"
      ? followResult.isFollowing
      : !currentStatus;
  } catch (error) {
    console.error("Error following user:", error);
    toast.error("Failed to update follow status");
    return currentStatus;
  }
};

export const handlefetchProfile = async (dispatch, setCredential) => {
  try {
    const profileRequest = dispatch(
      userApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }),
    );
    const response = await profileRequest.unwrap();
    profileRequest.unsubscribe?.();

    dispatch(setCredential(response.user));
  } catch (error) {
    console.log("Error fetching profile:", error);
  }
};
