"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCredential } from "@/redux/slices/authSlice";
import { handleFollow } from "@/helper/followActions";
import { useRouter } from "next/navigation";

function UserCard({ user, mobile, onClose }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [imgError, setImgError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const following = userInfo?.following?.some(
      (followedUser) => followedUser._id === user._id
    );
    setIsFollowing(following || false);
  }, [userInfo, user]);

  const followBtn = async () => {
    const newStatus = await handleFollow(
      user._id,
      isFollowing,
      dispatch,
      setCredential
    );
    setIsFollowing(newStatus);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    router.push(`/dashboard/userProfile/${user._id}`);
    if (onClose) onClose();
  };

  const renderAvatar = () => {
    if (user.avatar) {
      return (
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          sizes="40px"
          className="rounded-full object-cover"
          onError={() => setImgError(true)}
        />
      );
    }

    // Fallback to initials when no avatar or error
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
        {getInitials(user.name)}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-800/50 hover:rounded transition-colors">
      <div
        onClick={handleProfileClick}
        className="relative w-10 h-10 flex-shrink-0 cursor-pointer"
      >
        {imgError ? (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            {getInitials(user.name)}
          </div>
        ) : (
          renderAvatar()
        )}
      </div>
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={handleProfileClick}
      >
        <p className="text-white font-medium truncate">{user.name}</p>
        {user.username && (
          <p className="text-gray-400 text-sm truncate">@{user.username}</p>
        )}
      </div>
      {!mobile && (
        <Button
          onClick={followBtn}
          variant="outline"
          className={`rounded-full bg-white border border-white hover:bg-blue-500/10 ${
            isFollowing ? "bg-black text-blue-500" : "text-black"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
}

export default UserCard;
