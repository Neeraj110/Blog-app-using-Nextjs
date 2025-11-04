import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes
  },
});

// Clear any existing model to ensure fresh schema
if (mongoose.models.Otp) {
  delete mongoose.models.Otp;
}

const OTP = mongoose.model("Otp", otpSchema);

export { OTP };
