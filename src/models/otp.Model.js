import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Expires in 10 minutes
});

let OTP;
try {
  OTP = mongoose.model("Otp");
} catch (error) {
  OTP = mongoose.model("Otp", otpSchema);
}

export { OTP };
