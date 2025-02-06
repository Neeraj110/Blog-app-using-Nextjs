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
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";

const EditPostModal = ({ isOpen, onClose, post, fetchPosts }) => {
  const [content, setContent] = useState(post?.content || "");
  const [media, setMedia] = useState([]);
  const [existingMedia, setExistingMedia] = useState(post?.media || []);
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [visibility, setVisibility] = useState(post?.visibility || "public");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    setContent(post?.content || "");
    setExistingMedia(post?.media || []);
    setTags(post?.tags?.join(", ") || "");
    setVisibility(post?.visibility || "public");
  }, [post]);

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
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("visibility", visibility);
      formData.append("tags", tags);
      formData.append("existingMedia", JSON.stringify(existingMedia)); // Add this line

      media.forEach((file) => {
        formData.append("media", file);
      });

      const { data } = await axios.patch(
        `/api/post/update-post/${post._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await fetchPosts();
      toast.success("Post updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("An error occurred while updating the post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]  w-[95%] rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 h-[85vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Edit Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-6">
          <div className="space-y-3">
            <Label htmlFor="content" className="text-gray-200">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px] bg-gray-800/50 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <div className="text-sm text-gray-400">
              {content.length}/500 characters
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="media" className="text-gray-200">
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
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-800/30 transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="tags" className="text-gray-200">
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags, separated by commas"
              className="bg-gray-800/50 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="visibility" className="text-gray-200">
              Visibility
            </Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
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
              className="bg-transparent border-gray-600 hover:bg-gray-800 text-gray-200"
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
