import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true, // Index for faster querying
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true, // Index for faster querying
    },
    refPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      index: true, // Index for faster querying
    },
    message: {
      type: String,
      trim: true, // Trim to remove unnecessary whitespace
    },
    tag: {
      type: String,
      trim: true, // Trim to remove unnecessary whitespace
    },
    unread: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

notificationSchema.index({ receiver: 1, createdAt: -1 }); // Compound index for faster querying

let Notification;

try {
  Notification = mongoose.model("Notification");
} catch (error) {
  Notification = mongoose.model("Notification", notificationSchema);
}

export { Notification };
