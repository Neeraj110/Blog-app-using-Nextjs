import React, { useState } from "react";
import axios from "axios";
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

const EditProfileModal = ({ isOpen, onClose, user, refetchProfile }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
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

      await axios.patch("/api/user/update-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      refetchProfile();
      onClose();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w w-[89%] h-[90vh] overflow-y-auto rounded-3xl md:rounded-3xl bg-gradient-to-br from-gray-900 to-black text-white shadow-xl border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
          <DialogClose className="text-white hover:text-gray-300" />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              className="rounded-[10px] bg-gray-800 text-white border-gray-700 focus:border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about" className="text-white">
              About
            </Label>
            <Input
              id="about"
              name="about"
              value={formState.about}
              onChange={handleInputChange}
              className="rounded-[10px] bg-gray-800 text-white border-gray-700 focus:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formState.location}
              onChange={handleInputChange}
              className="rounded-[10px] bg-gray-800 text-white border-gray-700 focus:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-white">
              Website
            </Label>
            <Input
              id="link"
              name="link"
              value={formState.link}
              onChange={handleInputChange}
              className="rounded-[10px] bg-gray-800 text-white border-gray-700 focus:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-white">
              Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              name="avatar"
              onChange={handleInputChange}
              accept="image/*"
              className="rounded-[10px] bg-gray-800 text-white border-gray-700 focus:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImg" className="text-white">
              Cover Image
            </Label>
            <Input
              id="coverImg"
              type="file"
              name="coverImg"
              onChange={handleInputChange}
              accept="image/*"
              className="rounded-[10px] bg-gray-800 text-white border-gray-700 focus:border-gray-600"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-[10px] bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-[10px] bg-blue-600 text-white hover:bg-blue-700"
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
