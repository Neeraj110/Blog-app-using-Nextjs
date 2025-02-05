"use client";
import React, { useEffect, useState } from "react";
import { Bell, Trash2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  deleteNotification,
  fetchNotifications,
  markAsRead,
} from "@/helper/notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      const result = await fetchNotifications();
      if (result.success) {
        setNotifications(result.notifications);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    getNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    const result = await markAsRead(id);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, unread: false }
            : notification
        )
      );
    } else {
      setError(result.error);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteNotification(id);
    if (result.success) {
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl min-h-screen bg-black text-white">
      <div className="flex items-center gap-3 mb-6 px-2 md:px-0">
        <Bell className="h-6 w-6 text-white" />
        <h1 className="text-xl md:text-2xl font-bold">Notifications</h1>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="mb-4 bg-red-900 border-red-700 text-white"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center text-zinc-400">
            No notifications to display
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`${
                notification.unread ? "bg-zinc-800" : "bg-zinc-900"
              } border-zinc-700 transition-colors duration-200`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {notification.sender?.avatar && (
                        <img
                          src={notification.sender.avatar}
                          alt={notification.sender.name}
                          className="w-8 h-8 rounded-full bg-zinc-700"
                        />
                      )}
                      <span className="font-medium text-white">
                        {notification.sender?.name}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-sm md:text-base">
                      {notification.message}
                    </p>
                    <div className="text-xs text-zinc-500 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    {notification.unread && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="flex items-center gap-1 bg-transparent border-zinc-700 hover:bg-zinc-800 text-white w-full md:w-auto justify-center"
                      >
                        <Check className="h-4 w-4" />
                        <span className="hidden md:inline">Mark as read</span>
                        <span className="md:hidden">Read</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(notification?._id)}
                      className="flex items-center gap-1 bg-red-900 hover:bg-red-800 w-full md:w-auto justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden md:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
