import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB for documents (e.g., PDFs)

export const uploadMessageFile = async (file, folder = "message_uploads") => {
  try {
    if (!file) throw new Error("No file provided");

    // Check file type
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    const isDocument = file.type === "application/pdf"; // Extend for other document types if needed

    let maxSize;
    let allowedFormats;

    // Set max size and allowed formats based on file type
    if (isVideo) {
      maxSize = MAX_VIDEO_SIZE;
      allowedFormats = ["mp4", "mov", "avi", "webm"];
    } else if (isImage) {
      maxSize = MAX_IMAGE_SIZE;
      allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
    } else if (isDocument) {
      maxSize = MAX_DOC_SIZE;
      allowedFormats = ["pdf"];
    } else {
      throw new Error("Invalid file type");
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(
        `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
      );
    }

    // Convert the file buffer to base64
    const buffer = await file.arrayBuffer();
    const fileBase64 = `data:${file.type};base64,${Buffer.from(buffer).toString(
      "base64"
    )}`;

    // Define upload options
    const uploadOptions = {
      folder,
      resource_type: isVideo || isImage ? "auto" : "raw", // Use raw for PDFs and documents
      allowedFormats,
    };

    if (isVideo) {
      // Add video-specific transformations
      uploadOptions.transformation = [
        {
          quality: "auto",
          fetch_format: "auto",
          width: 1920,
          crop: "limit",
          bitrate: "2000k",
        },
      ];
      uploadOptions.eager = [
        {
          width: 320,
          height: 180,
          crop: "fill",
          format: "jpg",
        },
      ];
    } else if (isImage) {
      // Add image-specific transformations
      uploadOptions.transformation = [
        {
          quality: "auto",
          fetch_format: "auto",
          width: 1920,
          crop: "limit",
        },
      ];
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      width: result.width || null,
      height: result.height || null,
      duration: result.duration || null, // Video duration
      thumbnail: result.eager?.[0]?.secure_url || null, // Video thumbnail
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const uploadToCloudinary = async (file, folder = "uploads") => {
  try {
    if (!file) throw new Error("No file provided");

    // Check file size based on type
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.buffer.length > maxSize) {
      throw new Error(
        `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
      );
    }

    // Convert the buffer to base64
    const fileBase64 = `data:${file.type};base64,${file.buffer.toString(
      "base64"
    )}`;

    // Define upload options based on file type and folder
    const uploadOptions = {
      folder,
      resource_type: "auto",
      allowed_formats: isVideo
        ? ["mp4", "mov", "avi", "webm"]
        : ["jpg", "jpeg", "png", "gif", "webp"],
    };

    // Add specific transformations based on file type and folder
    if (isVideo) {
      uploadOptions.transformation = [
        {
          quality: "auto",
          fetch_format: "auto",
          width: 1920,
          crop: "limit",
          bitrate: "2000k",
        },
      ];

      // Generate thumbnail for videos
      uploadOptions.eager = [
        {
          width: 320,
          height: 180,
          crop: "fill",
          format: "jpg",
        },
      ];
    } else {
      // Image transformations based on folder
      switch (folder) {
        case "avatars":
          uploadOptions.transformation = [
            {
              quality: "auto",
              fetch_format: "auto",
              width: 400,
              height: 400,
              crop: "fill",
              gravity: "face",
            },
          ];
          break;
        case "covers":
          uploadOptions.transformation = [
            {
              quality: "auto",
              fetch_format: "auto",
              width: 1200,
              height: 400,
              crop: "fill",
            },
          ];
          break;
        default:
          uploadOptions.transformation = [
            {
              quality: "auto",
              fetch_format: "auto",
              width: 1920,
              crop: "limit",
            },
          ];
      }
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      duration: result.duration || null, // Video duration in seconds
      thumbnail: result.eager?.[0]?.secure_url || null, // Video thumbnail URL
      aspectRatio: result.width / result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteFromCloudinary = async (url) => {
  try {
    if (!url) return null;

    const public_id = url.split("/").slice(7, 9).join("/").split(".")[0];

    let resource_type = "image"; // default to image

    if (url.includes("/video/")) {
      resource_type = "video";
    } else if (url.includes("/raw/")) {
      resource_type = "raw";
    }

    const data = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });
    console.log(data);

    return data;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw error;
  }
};

export const getVideoPlayerUrl = (publicId, options = {}) => {
  const defaultOptions = {
    controls: true,
    autoplay: false,
    loop: false,
    muted: false,
    preload: "auto",
  };

  const finalOptions = { ...defaultOptions, ...options };

  return cloudinary.video(publicId, {
    transformation: [
      { streaming_profile: "auto" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
    ...finalOptions,
  });
};
