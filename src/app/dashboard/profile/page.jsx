"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Link as LinkIcon, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import FollowModal from "@/components/FollowModal";
import EditProfileModal from "@/components/EditProfileModal";
import { setCredential } from "@/redux/slices/authSlice";
import { formatJoinDate } from "@/helper/dateUtils";
import PostCard from "@/components/PostCard";
import { useGetProfileQuery } from "@/redux/api/userApi";

const Profile = () => {
  const [followDialog, setFollowDialog] = useState(null);
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: profileData,
    isLoading: loading,
    isError,
    refetch,
  } = useGetProfileQuery();
  const user = profileData?.user;

  useEffect(() => {
    if (user) {
      dispatch(setCredential(user));
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

  if (!user || isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface text-on-surface">
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
              className="md:w-32 md:h-32 w-28 h-28 rounded-3xl border-4 border-surface bg-surface-container-lowest"
            />
          </div>

          {/* Edit Profile Button */}
          <div className="mt-4">
            <Button
              onClick={() => setEditProfileDialog(true)}
              variant="outline"
              className="rounded-full border-outline-variant/30 bg-surface-container-lowest"
            >
              Edit profile
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          </div>
          <p className="text-on-surface-variant text-sm">@{user.username}</p>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm leading-relaxed">{user.description.about}</p>

        {/* Details */}
        <div className="mt-4 flex flex-wrap flex-col space-y-1 gap-x-4 gap-y-2 text-sm text-on-surface-variant">
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
              className="flex items-center gap-1 text-primary hover:underline"
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
            className="hover:bg-surface-container rounded hover:text-on-surface bg-transparent"
          >
            <span className="font-bold">{user.following?.length || 0}</span>{" "}
            <span className="text-on-surface-variant">Following</span>
          </Button>
          <Button
            onClick={() => setFollowDialog("followers")}
            className="hover:bg-surface-container rounded hover:text-on-surface bg-transparent"
          >
            <span className="font-bold">{user.followers?.length || 0}</span>{" "}
            <span className="text-on-surface-variant">Followers</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="mt-4">
          <TabsList className="w-full justify-start border-b border-outline-variant/20 bg-transparent">
            <TabsTrigger
              value="posts"
              className="flex-1 text-on-surface-variant hover:text-on-surface data-[state=active]:text-on-surface data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="flex-1 text-on-surface-variant hover:text-on-surface data-[state=active]:text-on-surface data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              bookmarks
            </TabsTrigger>

            <TabsTrigger
              value="likes"
              className="flex-1 text-on-surface-variant hover:text-on-surface data-[state=active]:text-on-surface data-[state=active]:border-b-2 data-[state=active]:border-primary"
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
              <div className="text-on-surface-variant text-center py-8">
                No Post yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="min-h-[200px]">
            {userInfo.bookmarks?.length > 0 ? (
              userInfo.bookmarks.map((post) => (
                <PostCard key={post._id} post={post} fetchPosts={() => {}} />
              ))
            ) : (
              <div className="text-on-surface-variant text-center py-8">
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
              <div className="text-on-surface-variant text-center py-8">
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
          refetch();
        }}
        user={user}
      />

      <EditProfileModal
        isOpen={editProfileDialog}
        onClose={() => setEditProfileDialog(false)}
        user={user}
        refetchProfile={refetch}
      />
    </div>
  );
};

export default Profile;
