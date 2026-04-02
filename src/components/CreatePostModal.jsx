import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { handlefetchProfile } from "@/helper/followActions";
import { setCredential } from "@/redux/slices/authSlice";
import { useCreatePostMutation } from "@/redux/api/postsApi";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [postContent, setPostContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [validationErrors, setValidationErrors] = useState(null);
  const dispatch = useDispatch();

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValid =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isUnderSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      if (!isValid)
        toast.error(`${file.name} is not a valid image or video file`);
      if (!isUnderSize) toast.error(`${file.name} exceeds 10MB size limit`);
      return isValid && isUnderSize;
    });

    setMediaFiles((prev) => [...prev, ...validFiles].slice(0, 4)); // Limit to 4 files
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      setValidationErrors("Post content is required");
      toast.error("Post content is required");
      return;
    }

    if (postContent.length > 500) {
      setValidationErrors("Post content cannot exceed 500 characters");
      toast.error("Post content cannot exceed 500 characters");
      return;
    }

    setValidationErrors(null);
    const formData = new FormData();
    formData.append("content", postContent.trim());
    formData.append("tags", tags.trim());
    formData.append("visibility", visibility);
    mediaFiles.forEach((file) => formData.append("media", file));

    try {
      await createPost(formData).unwrap();
      handlefetchProfile(dispatch, setCredential);
      toast.success("Post created successfully");
      handleReset();
      onClose();
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to create post. Please try again.";
      setValidationErrors(errorMessage);
      toast.error(errorMessage);
      console.error("Post creation error:", error);
    }
  };

  const handleReset = () => {
    setPostContent("");
    setMediaFiles([]);
    setTags("");
    setVisibility("public");
    setValidationErrors(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:w-full w-[90%] max-w-lg mx-auto rounded-3xl bg-surface-container-low text-on-surface shadow-xl border border-outline-variant/20 p-4 sm:p-6 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-auto max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold text-on-surface md:block hidden">
            Create Post
          </DialogTitle>
          <DialogClose className="absolute top-0 right-0 text-on-surface-variant hover:text-on-surface transition-colors" />
        </DialogHeader>

        <div className="space-y-4 relative">
          {validationErrors && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 p-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{validationErrors}</p>
            </div>
          )}

          <div className="relative">
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's happening?"
              maxLength={500}
              className="md:min-h-[150px] min-h-[80px] bg-surface-container-lowest border border-outline-variant/20 text-on-surface p-4 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none"
            />
            <span className="absolute bottom-2 right-2 text-xs text-on-surface-variant">
              {postContent.length}/500
            </span>
          </div>

          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-lowest">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 p-1 bg-surface-container-high/80 rounded-full hover:bg-surface-container-high transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Label
              htmlFor="mediaUpload"
              className="text-sm font-medium mb-2 text-on-surface-variant"
            >
              Upload Media (Max 4 files, 10MB each)
            </Label>
            <Input
              id="mediaUpload"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              disabled={mediaFiles.length >= 4}
              className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer rounded bg-surface-container-lowest border-outline-variant/20"
            />
          </div>

          <div className="flex gap-4 flex-row">
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="tagsInput"
                className="text-sm font-medium text-on-surface-variant"
              >
                Tags
              </Label>
              <Input
                id="tagsInput"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="nature, travel"
                className="w-full bg-surface-container-lowest border border-outline-variant/20 text-on-surface p-3 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="visibility"
                className="text-sm font-medium text-on-surface-variant"
              >
                Visibility
              </Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-full bg-surface-container-lowest border border-outline-variant/20 text-on-surface rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent className="bg-surface-container border border-outline-variant/20 text-on-surface">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleCreatePost}
            disabled={isLoading || !postContent.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Posting...
              </div>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
