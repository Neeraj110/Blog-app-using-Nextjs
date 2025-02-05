import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Comment text is required"],
      maxLength: [300, "Comment cannot exceed 300 characters"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reply: {
          type: String,
          required: true,
          trim: true,
          maxLength: [300, "Reply cannot exceed 300 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      maxLength: [500, "Post content cannot exceed 500 characters"],
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        thumbnail: String, // For videos
        aspectRatio: Number,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post owner is required"],
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public",
    },
    engagement: {
      likeCount: {
        type: Number,
        default: 0,
      },
      commentCount: {
        type: Number,
        default: 0,
      },
      shareCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
postSchema.index({ owner: 1, createdAt: -1 });
postSchema.index({ "comments.user": 1 });
postSchema.index({ tags: 1 });
postSchema.index({ content: "text" });

// Update engagement counts middleware
postSchema.pre("save", function (next) {
  if (this.isModified("likes")) {
    this.engagement.likeCount = this.likes.length;
  }
  if (this.isModified("comments")) {
    this.engagement.commentCount = this.comments.length;
  }
  next();
});

// Virtual for total engagement
postSchema.virtual("totalEngagement").get(function () {
  return (
    this.engagement.likeCount +
    this.engagement.commentCount +
    this.engagement.shareCount
  );
});

// Method to check if user has liked post
postSchema.methods.isLikedByUser = function (userId) {
  return this.likes.includes(userId);
};

let Post;
try {
  Post = mongoose.model("Post");
} catch (error) {
  Post = mongoose.model("Post", postSchema);
}

export { Post };
