// utils/dateUtils.js
import {
    formatDistanceToNowStrict,
    format,
    isToday,
    isYesterday,
  } from "date-fns";
  
  export const formatDate = (date) => {
    if (!date) return "";
    
    const postDate = new Date(date);
    const timeAgo = formatDistanceToNowStrict(postDate, { addSuffix: false });
  
    // Handle recent times
    if (timeAgo.match(/second|minute|hour/)) {
      return timeAgo
        .replace(/ seconds?/, "s")
        .replace(/ minutes?/, "m")
        .replace(/ hours?/, "h");
    }
  
    // Handle special cases
    if (isToday(postDate)) return `Today at ${format(postDate, "HH:mm")}`;
    if (isYesterday(postDate)) return `Yesterday at ${format(postDate, "HH:mm")}`;
  
    // Handle dates in current year vs other years
    return postDate.getFullYear() === new Date().getFullYear()
      ? format(postDate, "MMM d")
      : format(postDate, "MMM d, yyyy");
  };
  
  export const formatJoinDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMMM yyyy");
  };