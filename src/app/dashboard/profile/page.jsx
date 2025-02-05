"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Link as LinkIcon, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import FollowModal from "@/components/FollowModal";
import EditProfileModal from "@/components/EditProfileModal";
import { setCredential } from "@/redux/slices/authSlice";
import { formatJoinDate } from "@/helper/dateUtils";
import PostCard from "@/components/PostCard";

const Profile = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followDialog, setFollowDialog] = useState(null);
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/user/profile");
      setUser(response.data.user);
      dispatch(setCredential(response.data.user));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white">
      <div className="relative h-[10rem] sm:h-[16rem]">
        {user.coverImg ? (
          <img
            src={user.coverImg}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
      </div>

      {/* Profile Section */}
      <div className="px-4 relative">
        <div className="flex justify-between items-start">
          {/* Profile Image */}
          <div className="relative -mt-16 sm:-mt-20">
            <img
              src={
                user.avatar || `https://ui-avatars.com/api/?name=${user.name}`
              }
              alt={user.name}
              className="md:w-32 md:h-32 w-28 h-28 rounded-full border-4 border-black bg-white"
            />
          </div>

          {/* Edit Profile Button */}
          <div className="mt-4">
            <Button
              onClick={() => setEditProfileDialog(true)}
              variant="outline"
              className="rounded-full"
            >
              Edit profile
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{user.name}</h1>
          </div>
          <p className="text-gray-500 text-sm">@{user.username}</p>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm">{user.description.about}</p>

        {/* Details */}
        <div className="mt-4 flex flex-wrap  flex-col space-y-1 gap-x-4 gap-y-2 text-sm text-gray-500">
          {user.description.location && (
            <span className="flex items-center gap-1">
              <MapPin size={16} />
              {user.description.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            Joined {formatJoinDate(user?.createdAt)}
          </span>
          {user.description.link && (
            <a
              href={user.description.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:underline"
            >
              <LinkIcon size={16} />
              {user.description.link.replace(/(^\w+:|^)\/\//, "")}
            </a>
          )}
        </div>

        {/* Following/Followers */}
        <div className="mt-4 flex gap-4 text-sm">
          <Button
            onClick={() => setFollowDialog("following")}
            className="hover:bg-gray-800 rounded hover:text-white"
          >
            <span className="font-bold">{user.following?.length || 0}</span>{" "}
            <span className="text-gray-500">Following</span>
          </Button>
          <Button
            onClick={() => setFollowDialog("followers")}
            className="hover:bg-gray-800 rounded hover:text-white"
          >
            <span className="font-bold">{user.followers?.length || 0}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="mt-4">
          <TabsList className="w-full justify-start border-b border-gray-800 bg-transparent">
            <TabsTrigger
              value="posts"
              className="flex-1 text-gray-500 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="flex-1 text-gray-500 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              bookmarks
            </TabsTrigger>

            <TabsTrigger
              value="likes"
              className="flex-1 text-gray-500 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="min-h-[200px]">
            {userInfo.posts?.length > 0 ? (
              userInfo.posts.map((post) => (
                <PostCard key={post._id} post={post} fetchPosts={() => {}} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">No Post yet</div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="min-h-[200px]">
            {userInfo.bookmarks?.length > 0 ? (
              userInfo.bookmarks.map((post) => (
                <PostCard key={post._id} post={post} fetchPosts={() => {}} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                No bookmarks yet
              </div>
            )}
          </TabsContent>
          <TabsContent value="likes" className="min-h-[200px]">
            {userInfo.likedPosts?.length > 0 ? (
              userInfo.likedPosts.map((post) => (
                <PostCard key={post._id} post={post} fetchPosts={() => {}} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                No bookmarks yet
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <FollowModal
        type={followDialog}
        isOpen={!!followDialog}
        onClose={() => {
          setFollowDialog(null);
          fetchProfile();
        }}
        user={user}
      />

      <EditProfileModal
        isOpen={editProfileDialog}
        onClose={() => setEditProfileDialog(false)}
        user={user}
        refetchProfile={fetchProfile}
      />
    </div>
  );
};

export default Profile;
