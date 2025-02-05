import nodemailer from "nodemailer";

export const sendVerificationEmail = async ({ email, name, otp }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome to Social App! ${name} Verify your email`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Welcome to Social App!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. To verify your email address, please use the following verification code:</p>
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #1f2937;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes.
        </p>
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this verification code, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: " + info.response);
    return {
      success: true,
      messageId: info.messageId,
      error: null,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      messageId: null,
      error: error.message || "Failed to send verification email",
    };
  }
};
