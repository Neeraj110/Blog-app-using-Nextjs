import NodeCache from "node-cache";

// Initialize cache with configuration
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
  deleteOnExpire: true,
  maxKeys: 2000,
});

// Cache key generators
const generateUserCacheKey = (type, id = "") => `user:${type}:${id}`;
const generatePostCacheKey = (type, id = "", visibility = "public") =>
  `post:${type}:${visibility}:${id || "anonymous"}`;
const generateSearchCacheKey = (searchTerm, userId) =>
  `user:search:${searchTerm}:${userId}`;

// Set up cache event handlers
cache.on("expired", (key, value) => {
  console.log(`Cache expired for key: ${key}`);
});

cache.on("flush", () => {
  console.log("Cache has been flushed");
});

export const cacheService = {
  // Generic methods
  get: (key) => cache.get(key),
  set: (key, value, ttl = 300) => cache.set(key, value, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll(),

  // User methods
  getUserProfile: (userId) =>
    cache.get(generateUserCacheKey("profile", userId)),
  setUserProfile: (userId, data) =>
    cache.set(generateUserCacheKey("profile", userId), data, 300),
  getUsersList: () => cache.get(generateUserCacheKey("list")),
  setUsersList: (data) => cache.set(generateUserCacheKey("list"), data, 300),

  // Post methods
  getAllPosts: (userId, visibility) =>
    cache.get(generatePostCacheKey("all", userId, visibility)),
  setAllPosts: (userId, visibility, data, ttl = 300) =>
    cache.set(generatePostCacheKey("all", userId, visibility), data, ttl),
  getPost: (postId) => cache.get(generatePostCacheKey("single", postId)),
  setPost: (postId, data) =>
    cache.set(generatePostCacheKey("single", postId), data, 300),
  getFollowingPosts: (userId) =>
    cache.get(generatePostCacheKey("following", userId)),
  setFollowingPosts: (userId, data) =>
    cache.set(generatePostCacheKey("following", userId), data, 180),

  // Search methods
  getSearchResults: (searchTerm, userId) =>
    cache.get(generateSearchCacheKey(searchTerm, userId)),
  setSearchResults: (searchTerm, userId, data) =>
    cache.set(generateSearchCacheKey(searchTerm, userId), data, 180),
  // Cache invalidation
  invalidateUserCache: (userId) => {
    const keys = [
      generateUserCacheKey("profile", userId),
      generateUserCacheKey("list"),
      generatePostCacheKey("following", userId),
    ];
    keys.forEach((key) => cache.del(key));
  },

  invalidatePostCache: (postId) => {
    cache.del(generatePostCacheKey("single", postId));
    cache.keys().forEach((key) => {
      if (key.startsWith("post:")) {
        cache.del(key);
      }
    });
  },

  invalidateSearchCache: () => {
    cache.keys().forEach(key => {
      if (key.startsWith("user:search:")) {
        cache.del(key);
      }
    });
  }
};
