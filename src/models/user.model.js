import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxLength: [25, "Name cannot exceed 25 characters"],
      index: true,
    },
    username: {
      type: String,
      required: [true, "Please enter a username"],
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscore",
      ],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [4, "Password must be at least 4 characters"],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    description: {
      about: {
        type: String,
        maxLength: [160, "Bio cannot exceed 160 characters"],
        default: "",
      },
      dob: {
        type: Date,
        default: null,
      },
      location: {
        type: String,
        maxLength: [30, "Location cannot exceed 30 characters"],
        default: "",
      },
      link: {
        type: String,
        match: [
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          "Please enter a valid URL",
        ],
        default: "",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    lastActive: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ name: "text", username: "text" }); // Enable text search
userSchema.index({ createdAt: -1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

userSchema.virtual("followerCount").get(function () {
  if (!this.followers) return 0;
  if (!Array.isArray(this.followers)) return 0;
  return this.followers.length;
});

userSchema.virtual("followingCount").get(function () {
  if (!this.following) return 0;
  if (!Array.isArray(this.following)) return 0;
  return this.following.length;
});

// Helper method to safely get followers
userSchema.methods.getFollowers = function () {
  return this.followers || [];
};

userSchema.methods.getFollowing = function () {
  return this.following || [];
};

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastActive timestamp on document update
userSchema.pre("save", function (next) {
  try {
    this.lastActive = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// JWT token generation
userSchema.methods.generateAccessToken = async function () {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({
    _id: this._id.toString(),
    name: this.name,
    email: this.email,
    username: this.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10h")
    .setIssuedAt()
    .sign(secret);

  return token;
};

// Method to safely return user data without sensitive fields
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.id;
  delete obj.__v;
  return obj;
};

let User;

try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", userSchema);
}

export { User };
