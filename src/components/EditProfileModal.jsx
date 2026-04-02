import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "@/redux/api/userApi";

const EditProfileModal = ({ isOpen, onClose, user, refetchProfile }) => {
  const [updateUser, { isLoading: isSubmitting }] = useUpdateUserMutation();
  const [formState, setFormState] = useState({
    name: user?.name || "",
    about: user?.description?.about || "",
    location: user?.description?.location || "",
    link: user?.description?.link || "",
    avatar: null,
    coverImg: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("about", formState.about);
      formData.append("location", formState.location);
      formData.append("link", formState.link);

      if (formState.avatar) {
        formData.append("avatar", formState.avatar);
      }

      if (formState.coverImg) {
        formData.append("coverImg", formState.coverImg);
      }

      await updateUser(formData).unwrap();
      refetchProfile();
      onClose();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.data?.error || "Failed to update profile");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w w-[89%] h-[90vh] overflow-y-auto rounded-3xl bg-surface-container-low text-on-surface shadow-xl border border-outline-variant/20">
        <DialogHeader>
          <DialogTitle className="text-on-surface">Edit Profile</DialogTitle>
          <DialogClose className="text-on-surface-variant hover:text-on-surface" />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-on-surface-variant">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              className="rounded-[10px] bg-surface-container-lowest text-on-surface border-outline-variant/20 focus:border-primary/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="text-on-surface-variant">
              About
            </Label>
            <Input
              id="about"
              name="about"
              value={formState.about}
              onChange={handleInputChange}
              className="rounded-[10px] bg-surface-container-lowest text-on-surface border-outline-variant/20 focus:border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-on-surface-variant">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formState.location}
              onChange={handleInputChange}
              className="rounded-[10px] bg-surface-container-lowest text-on-surface border-outline-variant/20 focus:border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-on-surface-variant">
              Website
            </Label>
            <Input
              id="link"
              name="link"
              value={formState.link}
              onChange={handleInputChange}
              className="rounded-[10px] bg-surface-container-lowest text-on-surface border-outline-variant/20 focus:border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-on-surface-variant">
              Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              name="avatar"
              onChange={handleInputChange}
              accept="image/*"
              className="rounded-[10px] bg-surface-container-lowest text-on-surface border-outline-variant/20 focus:border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImg" className="text-on-surface-variant">
              Cover Image
            </Label>
            <Input
              id="coverImg"
              type="file"
              name="coverImg"
              onChange={handleInputChange}
              accept="image/*"
              className="rounded-[10px] bg-surface-container-lowest text-on-surface border-outline-variant/20 focus:border-primary/30"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-[10px] bg-surface-container-low text-on-surface border-outline-variant/20 hover:bg-surface-container"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-[10px] gradient-primary text-primary-foreground hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
