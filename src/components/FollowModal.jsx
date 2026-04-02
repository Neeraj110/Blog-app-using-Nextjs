import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { handleFollow } from "@/helper/followActions";
import { setCredential } from "@/redux/slices/authSlice";

const FollowModal = ({ type, isOpen, onClose, user }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleFollowClick = async (follower) => {
    const isCurrentlyFollowing = userInfo.following.some(
      (u) => u._id === follower._id,
    );

    await handleFollow(
      follower._id,
      isCurrentlyFollowing,
      dispatch,
      setCredential,
    );
  };

  const userList = type === "followers" ? user?.followers : user?.following;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[87%] md:w-[38%] w-[85%] overflow-y-auto rounded-3xl bg-surface-container-low text-on-surface shadow-xl border border-outline-variant/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
          <DialogDescription className="text-sm text-on-surface-variant">
            {type === "followers"
              ? "People who follow you."
              : "People you are following."}
          </DialogDescription>
          <DialogClose />
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {userList?.map((follower, index) => {
            const isCurrentlyFollowing = userInfo.following.some(
              (u) => u._id === follower._id,
            );

            return (
              <div
                key={follower._id || index}
                className="flex items-center justify-between p-4 hover:bg-surface-container cursor-pointer rounded-xl"
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      follower.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        follower.name,
                      )}`
                    }
                    alt={`${follower.name}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{follower.name}</p>
                    <p
                      className="text-sm text-on-surface-variant overflow-hidden whitespace-nowrap text-ellipsis"
                      title={`@${follower.username}`} // Shows full text on hover
                    >
                      @{follower.username}
                    </p>
                  </div>
                </div>
                {/* Follow/Unfollow Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFollowClick(follower)}
                  className={`${
                    isCurrentlyFollowing
                      ? "bg-surface-container text-primary border-outline-variant/20"
                      : "text-on-surface border-outline-variant/20"
                  }`}
                >
                  {isCurrentlyFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
