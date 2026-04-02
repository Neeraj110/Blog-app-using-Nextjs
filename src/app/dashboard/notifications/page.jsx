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

  const handleMarkAllAsRead = async () => {
    const unreadItems = notifications.filter((n) => n.unread);
    await Promise.all(unreadItems.map((item) => markAsRead(item._id)));
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl min-h-screen bg-surface text-on-surface">
      <div className="flex items-center justify-between gap-3 mb-6 px-2 md:px-0">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-on-surface-variant">Your recent interactions and updates</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary"
          onClick={handleMarkAllAsRead}
          disabled={!notifications.some((n) => n.unread)}
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6 px-2 md:px-0">
        <Button size="sm" className="rounded-lg gradient-primary text-primary-foreground">All</Button>
        <Button size="sm" variant="outline" className="rounded-lg border-outline-variant/30 text-on-surface-variant">Mentions</Button>
        <Button size="sm" variant="outline" className="rounded-lg border-outline-variant/30 text-on-surface-variant">Follows</Button>
        <Button size="sm" variant="outline" className="rounded-lg border-outline-variant/30 text-on-surface-variant">Likes</Button>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="mb-4"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="bg-surface-container-low border-outline-variant/20 rounded-3xl">
          <CardContent className="p-6 text-center text-on-surface-variant">
            No notifications to display
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={`${
                notification.unread
                  ? "bg-surface-container"
                  : "bg-surface-container-low"
              } border-outline-variant/20 rounded-3xl transition-colors duration-200`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {notification.sender?.avatar && (
                        <img
                          src={notification.sender.avatar}
                          alt={notification.sender.name}
                          className="w-8 h-8 rounded-full bg-surface-container-high"
                        />
                      )}
                      <span className="font-medium text-on-surface">
                        {notification.sender?.name}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm md:text-base">
                      {notification.message}
                    </p>
                    <div className="text-xs text-on-surface-variant mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    {notification.unread && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="flex items-center gap-1 bg-transparent border-outline-variant/30 hover:bg-surface-container-high text-on-surface w-full md:w-auto justify-center"
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
