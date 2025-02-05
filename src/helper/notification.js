import axios from "axios";

const API_BASE_URL = "/api/notification";

// Fetch all notifications
export const fetchNotifications = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/get-notification`);
    return data.success
      ? { success: true, notifications: data.data.notifications || [] }
      : { success: false, error: "Failed to load notifications" };
  } catch (error) {
    return { success: false, error: "Failed to fetch notifications" };
  }
};

// Mark a notification as read
export const markAsRead = async (id) => {
  try {
    const { data } = await axios.patch(`${API_BASE_URL}/toggle-status/${id}`);
    return data.success
      ? { success: true }
      : { success: false, error: "Failed to mark as read" };
  } catch (error) {
    return { success: false, error: "Failed to mark notification as read" };
  }
};

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    const { data } = await axios.delete(
      `${API_BASE_URL}/delete-notification/${id}`
    );
    return data.success
      ? { success: true }
      : { success: false, error: "Failed to delete notification" };
  } catch (error) {
    return { success: false, error: "Failed to delete notification" };
  }
};
