# 🚀 Social Next App

A full-stack social media application built with Next.js 15, MongoDB, and modern web technologies. This application provides a complete social networking experience with features like posts, comments, likes, follows, notifications, bookmarks, and AI chat integration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Authentication Flow](#authentication-flow)
- [Database Models](#database-models)
- [Features in Detail](#features-in-detail)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication & Authorization

- **Email-based registration** with OTP verification (6-digit code)
- **JWT token authentication** with HTTP-only cookies
- **Secure password hashing** using bcryptjs
- **Auto-expiring OTPs** (5 minutes) using MongoDB TTL indexes
- **Protected routes** with middleware authentication
- **Email verification** before account activation

### 👤 User Management

- **User profiles** with avatar and cover images
- **Profile customization** (bio, location, date of birth, links)
- **Follow/Unfollow** functionality
- **User search** with real-time results
- **View followers and following lists**
- **User activity tracking** (last active status)

### 📝 Post Management

- **Create posts** with text content (up to 500 characters)
- **Multiple media uploads** (images and videos) - up to 10 files per post
- **Post visibility controls** (public, followers only, private)
- **Edit and delete posts**
- **Post tags** (up to 5 tags per post)
- **Rich media support** with Cloudinary integration
- **Video thumbnails** auto-generated
- **Post engagement metrics** (likes, comments, shares)

### 💬 Engagement Features

- **Like/Unlike posts**
- **Comment on posts** with nested replies
- **Bookmark posts** for later viewing
- **Share posts** via native share API or copy link
- **Comment likes and replies**
- **Real-time engagement counts**

### 🔔 Notifications

- **Follow notifications** when someone follows you
- **Like notifications** when someone likes your post
- **Comment notifications** when someone comments on your post
- **Mark as read/unread** functionality
- **Delete notifications**
- **Unread notification badges**

### 🤖 AI Integration

- **Google Gemini AI** chat integration
- **XAI (Grok)** chat support
- **Conversation history**
- **Smart content generation**

### 🎨 UI/UX Features

- **Responsive design** with Tailwind CSS
- **Dark/Light theme** support
- **Loading skeletons** for better UX
- **Toast notifications** for user feedback
- **Modal dialogs** for actions
- **Mobile-responsive navigation**
- **Infinite scroll** for posts
- **Image/Video preview** before upload

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI component library
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library
- **date-fns** - Date formatting

### Backend

- **Next.js API Routes** - RESTful API
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Jose** - JWT handling
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Cloudinary** - Media storage and optimization
- **Node-Cache** - Server-side caching

### AI Integration

- **Google Gemini API** - AI chat functionality
- **XAI (Grok) API** - Alternative AI chat

## 📁 Project Structure

```
social-next-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── notification/     # Notification endpoints
│   │   │   ├── post/             # Post CRUD operations
│   │   │   └── user/             # User authentication & profile
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify-page/
│   │   ├── dashboard/            # Protected dashboard pages
│   │   │   ├── ai/               # AI chat page
│   │   │   ├── content/          # User's posts
│   │   │   ├── notifications/    # Notifications page
│   │   │   ├── profile/          # User profile
│   │   │   ├── single-post/      # Individual post view
│   │   │   └── userProfile/      # Other user profiles
│   │   ├── globals.css           # Global styles
│   │   ├── layout.jsx            # Root layout
│   │   └── page.jsx              # Home page
│   ├── components/               # Reusable React components
│   │   ├── ui/                   # Shadcn UI components
│   │   ├── CreatePostModal.jsx
│   │   ├── EditPostModal.jsx
│   │   ├── EditProfileModal.jsx
│   │   ├── FollowModal.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── MobileNavigation.jsx
│   │   ├── PostCard.jsx
│   │   ├── PostMedia.jsx
│   │   ├── ReplyModal.jsx
│   │   ├── RightBar.jsx
│   │   ├── SearchModal.jsx
│   │   ├── SideBar.jsx
│   │   ├── TabButton.jsx
│   │   └── userCard.jsx
│   ├── helper/                   # Helper functions
│   │   ├── Ai.js                 # AI API handlers
│   │   ├── cacheData.js          # Cache utilities
│   │   ├── dateUtils.js          # Date formatting
│   │   ├── followActions.js      # Follow/unfollow logic
│   │   ├── notification.js       # Notification helpers
│   │   ├── postHelpers.js        # Post action helpers
│   │   ├── upload.js             # File upload utilities
│   │   ├── useDebounced.js       # Debounce hook
│   │   ├── userHelpers.js        # User action helpers
│   │   └── validateUser.js       # User validation
│   ├── lib/                      # Core libraries
│   │   ├── cloudinary.js         # Cloudinary configuration
│   │   ├── connectDB.js          # MongoDB connection
│   │   ├── sendEmails.js         # Email service
│   │   └── utils.js              # Utility functions
│   ├── models/                   # Mongoose models
│   │   ├── conversation.model.js # (Future feature)
│   │   ├── notification.model.js
│   │   ├── otp.Model.js
│   │   ├── post.model.js
│   │   └── user.model.js
│   ├── redux/                    # Redux state management
│   │   ├── slices/
│   │   │   ├── authSlice.js      # Authentication state
│   │   │   └── postSlice.js      # Post state
│   │   ├── store/
│   │   │   └── store.js          # Redux store
│   │   └── clientProvider.js     # Redux provider wrapper
│   └── middleware.js             # Next.js middleware for auth
├── public/                       # Static assets
├── components.json               # Shadcn UI config
├── eslint.config.mjs            # ESLint configuration
├── jsconfig.json                # JavaScript config
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS config
├── tailwind.config.mjs          # Tailwind CSS config
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Cloudinary account for media storage
- Email service credentials (Gmail, etc.)
- Google Gemini API key (optional, for AI features)
- XAI API key (optional, for AI features)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Neeraj110/Blog-app-using-Nextjs.git
cd social-next-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment variables file**

```bash
# Create a .env.local file in the root directory
touch .env.local
```

4. **Configure environment variables** (see below)

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (for OTP verification)
EMAIL_SERVICE=gmail
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# AI API Keys (Optional)
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_XAI_API_KEY=your_xai_grok_api_key
```

### Setting up Email Service (Gmail)

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

## 🛣️ API Routes

### User Authentication

| Method | Endpoint                     | Description                   | Auth Required |
| ------ | ---------------------------- | ----------------------------- | ------------- |
| POST   | `/api/user/register`         | Register new user with OTP    | ❌            |
| POST   | `/api/user/verifyUser`       | Verify OTP and create account | ❌            |
| POST   | `/api/user/login`            | Login user                    | ❌            |
| POST   | `/api/user/logout`           | Logout user                   | ✅            |
| GET    | `/api/user/profile`          | Get current user profile      | ✅            |
| GET    | `/api/user/user-profile/:id` | Get user profile by ID        | ✅            |
| PUT    | `/api/user/update-user`      | Update user profile           | ✅            |
| PUT    | `/api/user/update-avatar`    | Update user avatar            | ✅            |
| PUT    | `/api/user/update-coverImg`  | Update cover image            | ✅            |
| GET    | `/api/user/fetch-alluser`    | Fetch all users               | ✅            |
| GET    | `/api/user/search-user`      | Search users                  | ✅            |
| POST   | `/api/user/follow/:id`       | Follow/unfollow user          | ✅            |

### Post Management

| Method | Endpoint                                      | Description                   | Auth Required |
| ------ | --------------------------------------------- | ----------------------------- | ------------- |
| POST   | `/api/post/create-post`                       | Create new post               | ✅            |
| GET    | `/api/post/get-all-post`                      | Get all posts                 | ✅            |
| GET    | `/api/post/get-following-post`                | Get posts from followed users | ✅            |
| GET    | `/api/post/get-single-post/:id`               | Get single post by ID         | ✅            |
| PUT    | `/api/post/update-post/:id`                   | Update post                   | ✅            |
| DELETE | `/api/post/delete-post/:id`                   | Delete post                   | ✅            |
| PUT    | `/api/post/like-post/:id`                     | Like/unlike post              | ✅            |
| POST   | `/api/post/add-comment/:id`                   | Add comment to post           | ✅            |
| DELETE | `/api/post/delete-comment/:postId/:commentId` | Delete comment                | ✅            |
| PATCH  | `/api/post/bookmark-post/:id`                 | Bookmark/unbookmark post      | ✅            |

### Notifications

| Method | Endpoint                                    | Description                      | Auth Required |
| ------ | ------------------------------------------- | -------------------------------- | ------------- |
| GET    | `/api/notification/get-notification`        | Get user notifications           | ✅            |
| PUT    | `/api/notification/toggle-status/:id`       | Mark notification as read/unread | ✅            |
| DELETE | `/api/notification/delete-notification/:id` | Delete notification              | ✅            |

## 🔒 Authentication Flow

### Registration Process

1. **User submits registration form** with name, email, password
2. **System generates username** from name and email
3. **System checks** if email/username already exists
4. **6-digit OTP is generated** and stored in database
5. **OTP expires after 5 minutes** (MongoDB TTL index)
6. **Email sent** with verification code
7. **User verifies OTP** on verification page
8. **Account is created** with `isVerified: true`
9. **OTP is deleted** from database

### Login Process

1. **User submits** email and password
2. **System verifies** credentials
3. **Checks** if user is verified
4. **JWT token generated** with user info
5. **Token stored** in HTTP-only cookie (10 hours expiry)
6. **User profile fetched** with aggregated data (posts, bookmarks, followers)
7. **Redirected** to dashboard

### Protected Routes

- Middleware checks for valid JWT token
- API routes verify token and extract user ID
- Frontend pages redirect to login if unauthenticated
- Token refresh not implemented (consider adding)

## 🗄️ Database Models

### User Model

```javascript
{
  name: String,
  username: String (unique, lowercase),
  email: String (unique, lowercase),
  password: String (hashed),
  avatar: String (Cloudinary URL),
  coverImg: String (Cloudinary URL),
  description: {
    about: String,
    dob: Date,
    location: String,
    link: String
  },
  isVerified: Boolean,
  followers: [ObjectId],
  following: [ObjectId],
  posts: [ObjectId],
  bookmarks: [ObjectId],
  lastActive: Date,
  status: String (active/suspended/deactivated),
  timestamps: true
}
```

### Post Model

```javascript
{
  content: String (max 500 chars),
  media: [{
    type: String (image/video),
    url: String,
    thumbnail: String,
    aspectRatio: Number
  }],
  owner: ObjectId (ref: User),
  likes: [ObjectId],
  comments: [{
    user: ObjectId,
    comment: String,
    likes: [ObjectId],
    replies: [{
      user: ObjectId,
      reply: String,
      createdAt: Date
    }],
    timestamps: true
  }],
  tags: [String],
  visibility: String (public/followers/private),
  engagement: {
    likeCount: Number,
    commentCount: Number,
    shareCount: Number
  },
  timestamps: true
}
```

### OTP Model

```javascript
{
  email: String (required),
  otp: String (required),
  name: String (required),
  username: String (required),
  password: String (required, hashed),
  expiresAt: Date (default: Date.now),
  // Auto-deletes after 300 seconds (5 minutes)
  indexes: { expiresAt: 1 } with expireAfterSeconds: 300
}
```

### Notification Model

```javascript
{
  receiver: ObjectId (ref: User),
  sender: ObjectId (ref: User),
  refPost: ObjectId (ref: Post),
  message: String,
  tag: String (follow/like/comment),
  unread: Boolean,
  createdAt: Date,
  timestamps: true
}
```

## 🎯 Features in Detail

### Post Creation

- **Multi-file upload** with drag & drop
- **File validation** (type, size)
- **Image optimization** via Cloudinary
- **Video processing** with thumbnail generation
- **Preview** before posting
- **Tag suggestions** while typing
- **Visibility controls** for privacy

### Media Handling

- **Cloudinary integration** for CDN delivery
- **Automatic image optimization** (quality, format)
- **Responsive images** with different sizes
- **Video streaming** with adaptive bitrate
- **Thumbnail generation** for videos
- **File size limits**: Images (5MB), Videos (50MB)

### Caching Strategy

- **Server-side caching** with node-cache
- **Post cache invalidation** on create/update/delete
- **User profile caching**
- **Reduced database queries**

### Real-time Features

- **Toast notifications** for instant feedback
- **Optimistic UI updates** for better UX
- **Auto-refresh** on post actions

### Security Features

- **HTTP-only cookies** for JWT tokens
- **Password hashing** with bcrypt (12 rounds)
- **Input validation** with Zod schemas
- **SQL injection prevention** via Mongoose
- **XSS protection** via React
- **CSRF protection** (consider adding)
- **Rate limiting** (consider adding)

## 🎨 UI Components

### Custom Components

- **PostCard** - Display post with all interactions
- **CreatePostModal** - Modal for creating posts
- **EditPostModal** - Modal for editing posts
- **EditProfileModal** - Modal for profile editing
- **FollowModal** - Display followers/following lists
- **ReplyModal** - Modal for commenting
- **SearchModal** - Search users with autocomplete
- **LoadingSkeleton** - Skeleton loaders
- **MobileNavigation** - Responsive mobile nav
- **SideBar** - Dashboard navigation
- **RightBar** - Suggestions and trends

### Shadcn UI Components

- Avatar, Button, Card, Dialog, Drawer
- Dropdown Menu, Form, Input, Label
- Select, Sheet, Skeleton, Tabs, Textarea

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** UI elements
- **Optimized images** for mobile
- **Adaptive navigation** (hamburger menu on mobile)

## 🔮 Future Enhancements

- [ ] **Real-time chat** with Socket.io
- [ ] **Direct messaging** between users
- [ ] **Story/Status** feature (24-hour posts)
- [ ] **Video calls** integration
- [ ] **Hashtag** system
- [ ] **Trending posts** algorithm
- [ ] **Post scheduling**
- [ ] **Analytics dashboard**
- [ ] **Admin panel**
- [ ] **Report/Block** functionality
- [ ] **Two-factor authentication**
- [ ] **OAuth login** (Google, GitHub)
- [ ] **Progressive Web App** (PWA)
- [ ] **Push notifications**
- [ ] **Email digests**
- [ ] **Dark mode** improvements

## 🐛 Known Issues

1. **OTP Schema Caching** - Sometimes requires server restart after schema changes
2. **Image Upload Size** - Large images may timeout on slow connections
3. **Token Refresh** - No automatic token refresh implemented
4. **Session Management** - Consider implementing refresh tokens

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Neeraj Kumar**

- GitHub: [@Neeraj110](https://github.com/Neeraj110)
- Repository: [Blog-app-using-Nextjs](https://github.com/Neeraj110/Blog-app-using-Nextjs)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Shadcn for the beautiful UI components
- Cloudinary for media management
- MongoDB for the database solution

---

**Note**: This is a learning project and may not be production-ready. Use at your own risk and ensure proper security measures before deploying to production.

For issues, questions, or suggestions, please open an issue on GitHub.
