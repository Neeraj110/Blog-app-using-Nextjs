import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Loader2, Image as ImageIcon, X as XIcon } from "lucide-react";
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
import { addPost, fetchPostsSuccess } from "@/redux/slices/postSlice";
import { handlefetchProfile } from "@/helper/followActions";
import { setCredential } from "@/redux/slices/authSlice";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  const dispatch = useDispatch();

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
      toast.error("Post content is required");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("content", postContent.trim());
    formData.append("tags", tags.trim());
    formData.append("visibility", visibility);
    mediaFiles.forEach((file) => formData.append("media", file));

    try {
      await axios.post("/api/post/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const response = await axios.get("/api/post/get-all-post");
      dispatch(
        fetchPostsSuccess({
          tab: "forYou",
          posts: response.data.data || [],
        })
      );
      // dispatch(addPost(data.post));
      handlefetchProfile(dispatch, setCredential);
      toast.success("Post created successfully");
      handleReset();
      onClose();
    } catch (error) {
      console.error("Post creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPostContent("");
    setMediaFiles([]);
    setTags("");
    setVisibility("public");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:w-full w-[80%] max-w-lg mx-auto rounded-3xl md:rounded-3xl bg-gradient-to-br from-gray-900 to-black text-white shadow-xl border border-gray-800 p-4 sm:p-6 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-auto max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader className="relative">
          <div className="absolute -top-2 -left-2 w-16 h-16 bg-blue-500/10 rounded-full blur-xl" />
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent md:block hidden">
            Create Post
          </DialogTitle>
          <DialogClose className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors" />
        </DialogHeader>

        <div className="space-y-4 relative">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/10 blur-xl" />

          <div className="relative">
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's happening?"
              maxLength={500}
              className="md:min-h-[150px] min-h-[80px] bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
              {postContent.length}/500
            </span>
          </div>

          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
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
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
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
              className="text-sm font-medium mb-2 text-gray-300"
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
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:text-blue-300 hover:file:bg-blue-500/30 transition-colors cursor-pointer rounded bg-gray-800/50 backdrop-blur-sm border-gray-700"
            />
          </div>

          <div className="flex gap-4 flex-row">
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="tagsInput"
                className="text-sm font-medium text-gray-300"
              >
                Tags
              </Label>
              <Input
                id="tagsInput"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="nature, travel"
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="visibility"
                className="text-sm font-medium text-gray-300"
              >
                Visibility
              </Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleCreatePost}
            disabled={isSubmitting || !postContent.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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
