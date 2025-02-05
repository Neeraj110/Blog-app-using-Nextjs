import axios from "axios";
import { toast } from "react-toastify";

export const handleFollow = async (
  userId,
  currentStatus,
  dispatch,
  setCredential
) => {
  try {
    const newStatus = !currentStatus;
    await axios.post(`/api/user/follow/${userId}`);
    const updatedUser = await axios.get("/api/user/profile");
    dispatch(setCredential(updatedUser.data.user));

    return newStatus;
  } catch (error) {
    console.error("Error following user:", error);
    toast.error("Failed to update follow status");
    return currentStatus;
  }
};

export const handlefetchProfile = async (dispatch, setCredential) => {
  try {
    const response = await axios.get("/api/user/profile");
    dispatch(setCredential(response.data.user));
  } catch (error) {
    console.log("Error fetching profile:", error);
  }
};
