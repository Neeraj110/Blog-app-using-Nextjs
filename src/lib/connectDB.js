import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
