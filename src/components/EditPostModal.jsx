"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useUpdatePostMutation } from "@/redux/api/postsApi";

const EditPostModal = ({ isOpen, onClose, post }) => {
  const [content, setContent] = useState(post?.content || "");
  const [media, setMedia] = useState([]);
  const [existingMedia, setExistingMedia] = useState(post?.media || []);
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [visibility, setVisibility] = useState(post?.visibility || "public");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [validationErrors, setValidationErrors] = useState(null);

  const [updatePost, { isLoading, error }] = useUpdatePostMutation();

  useEffect(() => {
    setContent(post?.content || "");
    setExistingMedia(post?.media || []);
    setTags(post?.tags?.join(", ") || "");
    setVisibility(post?.visibility || "public");
    setValidationErrors(null);
    setMedia([]);
    setPreviewUrls([]);
  }, [post, isOpen]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingMedia.length > 3) {
      toast.error("Maximum 3 media files allowed");
      return;
    }

    const validFiles = files.filter((file) => {
      const isValid =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      if (!isValid) {
        toast.error(`Invalid file type: ${file.name}`);
      }
      return isValid;
    });

    setMedia((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index, isExisting = false) => {
    if (isExisting) {
      setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    } else {
      setMedia((prev) => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors(null);

    // Validation
    if (!content.trim()) {
      setValidationErrors("Content cannot be empty");
      toast.error("Content cannot be empty");
      return;
    }

    if (content.length > 500) {
      setValidationErrors("Content cannot exceed 500 characters");
      toast.error("Content cannot exceed 500 characters");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("visibility", visibility);
      formData.append("tags", tags);
      formData.append("existingMedia", JSON.stringify(existingMedia));

      media.forEach((file) => {
        formData.append("media", file);
      });

      // RTK Query mutation - returns a Promise
      await updatePost({
        postId: post._id,
        formData,
      }).unwrap();

      // Clear form and close on success
      setContent("");
      setMedia([]);
      setExistingMedia([]);
      setTags("");
      setVisibility("public");
      setPreviewUrls([]);
      toast.success("Post updated successfully");
      onClose();
    } catch (err) {
      // Error is handled by RTK Query and error state
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "An error occurred while updating the post. Please try again.";
      setValidationErrors(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating post:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[95%] rounded-2xl bg-surface-container-low border border-outline-variant/20 h-[85vh] overflow-y-auto text-on-surface">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-bold text-on-surface">
            Edit Post
          </DialogTitle>
        </DialogHeader>

        {(validationErrors || error) && (
          <div className="px-6 py-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-400">
                {validationErrors ||
                  error?.data?.message ||
                  "An error occurred"}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 px-6">
          <div className="space-y-3">
            <Label htmlFor="content" className="text-on-surface-variant">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px] bg-surface-container-lowest border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
              maxLength={500}
            />
            <div className="text-sm text-on-surface-variant">
              {content.length}/500 characters
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="media" className="text-on-surface-variant">
              Media
            </Label>
            <div className="flex flex-wrap gap-3">
              {existingMedia.map((item, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-lg overflow-hidden group"
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      alt="Post media"
                      className="rounded-lg object-cover transition-transform group-hover:scale-105"
                      fill
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full shadow-lg opacity-90 hover:opacity-100"
                    onClick={() => removeFile(index, true)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {previewUrls.map((url, index) => (
                <div
                  key={`preview-${index}`}
                  className="relative w-24 h-24 rounded-lg overflow-hidden group"
                >
                  <Image
                    src={url}
                    alt="Preview"
                    className="rounded-lg object-cover transition-transform group-hover:scale-105"
                    fill
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full shadow-lg opacity-90 hover:opacity-100"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {existingMedia.length + media.length < 3 && (
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-lg cursor-pointer hover:border-primary/40 hover:bg-surface-container-lowest transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <ImagePlus className="w-8 h-8 text-on-surface-variant" />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tags" className="text-on-surface-variant">
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags, separated by commas"
              className="bg-surface-container-lowest border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="visibility" className="text-on-surface-variant">
              Visibility
            </Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="bg-surface-container-lowest border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-container border-outline-variant/20 text-on-surface">
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-transparent border-outline-variant/30 hover:bg-surface-container text-on-surface"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostModal;
