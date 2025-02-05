// lib/upload.js
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Failed to upload file");
    return await res.json();
  };
  