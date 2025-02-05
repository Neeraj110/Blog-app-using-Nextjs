"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import FollowModal from "@/components/FollowModal";
import EditProfileModal from "@/components/EditProfileModal";
import { setCredential } from "@/redux/slices/authSlice";
import { formatJoinDate } from "@/helper/dateUtils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { handleFollow } from "@/helper/followActions";
import PostCard from "@/components/PostCard";

const UserProfile = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followDialog, setFollowDialog] = useState(null);
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!user || !userInfo) return; // Ensure user and userInfo are available
    const following = userInfo.following?.some(
      (followedUser) => followedUser._id === user._id
    );
    setIsFollowing(following || false);
  }, [userInfo, user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/user-profile/${id}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id, userInfo]);

  const handleFollowBtn = async () => {
    const newStatus = await handleFollow(
      user._id,
      isFollowing,
      dispatch,
      setCredential
    );
    setIsFollowing(newStatus);
  };

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

  const isOwner = userInfo?._id === user._id;

  return (
    <div className="w-full text-white">
      {/* Cover Image */}
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
            {user.isVerified && (
              <span className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-4">
            {isOwner ? (
              <Button
                onClick={() => setEditProfileDialog(true)}
                variant="outline"
                className="rounded-full"
              >
                Edit profile
              </Button>
            ) : (
              <Button
                onClick={handleFollowBtn}
                variant="outline"
                className={`rounded-full ${isFollowing ? "text-blue-500" : ""}`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{user.name}</h1>
          </div>
          <p className="text-gray-500 text-sm">@{user.username}</p>
          {user.status === "active" && (
            <span className="inline-block bg-green-500 rounded-full px-2 py-0.5 text-xs text-white mt-1">
              Active now
            </span>
          )}
        </div>

        {/* Bio */}
        {user.description?.about && (
          <p className="mt-4 text-sm">{user.description.about}</p>
        )}

        {/* Details */}
        <div className="mt-4 flex flex-wrap flex-col space-y-1 gap-x-4 gap-y-2 text-sm text-gray-500">
          {user.description?.location && (
            <span className="flex items-center gap-1">
              <MapPin size={16} />
              {user.description.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            Joined {formatJoinDate(user.createdAt)}
          </span>
          {user.description?.link && (
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
              Posts ({user.posts?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="flex-1 text-gray-500 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Bookmarks ({user.bookmarks?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex-1 text-gray-500 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              Likes ({user.likedPosts?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="min-h-[200px]">
            {user.posts?.length > 0 ? (
              user.posts.map((post) => (
                <PostCard key={post._id} post={post} fetchPosts={() => {}} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">No Post yet</div>
            )}
          </TabsContent>
          <TabsContent value="bookmarks" className="min-h-[200px]">
            {user.bookmarks?.length > 0 ? (
              user.bookmarks.map((post) => (
                <PostCard key={post._id} post={post} fetchPosts={() => {}} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">No Post yet</div>
            )}
          </TabsContent>
          <TabsContent value="likes" className="min-h-[200px]">
            {user.likedPosts?.length > 0 ? (
              user.likedPosts.map((post) => (
                <PostCard key={post._id} post={post} fetchPosts={() => {}} />
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">No Post yet</div>
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
          fetchUserProfile();
        }}
        user={user}
      />

      <EditProfileModal
        isOpen={editProfileDialog}
        onClose={() => setEditProfileDialog(false)}
        user={user}
        refetchProfile={fetchUserProfile}
      />
    </div>
  );
};

export default UserProfile;
