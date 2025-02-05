import mongoose from "mongoose";

// Message Model
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Message cannot be empty"],
      maxLength: [2000, "Message cannot exceed 2000 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    video: {
      type: String,
      default: null,
    },
    file: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

// Indexes for conversations
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

// Method to get messages for a conversation
conversationSchema.methods.getMessages = async function (
  limit = 20,
  offset = 0
) {
  const messages = await Message.find({
    $or: [
      { senderId: this.participants[0], receiverId: this.participants[1] },
      { senderId: this.participants[1], receiverId: this.participants[0] },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return messages;
};

// Method to mark messages as read
conversationSchema.methods.markMessagesRead = async function (senderId, receiverId) {
  await Message.updateMany(
    {
      senderId: senderId,
      receiverId: receiverId,
      isRead: false,
    },
    { isRead: true, readAt: Date.now() }
  );
};

let Message;
let Conversation;

try {
  Message = mongoose.model("Message");
} catch (error) {
  Message = mongoose.model("Message", messageSchema);
}

try {
  Conversation = mongoose.model("Conversation");
} catch (error) {
  Conversation = mongoose.model("Conversation", conversationSchema);
}

export { Message, Conversation };
