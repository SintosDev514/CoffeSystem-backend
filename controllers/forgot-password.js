import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../server.js";
import Admin from "../models/admin.model.js";
import { sendMail } from "../mailer.js";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetToken = jwt.sign({ email, role: "admin" }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendMail(
      email,
      "BrewFlow Password Reset",
      `Click the link to reset your password: ${resetLink}`
    );
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      message: "Password reset email sent. Check your inbox!",
      resetToken,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
});

router.post("/update-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res
      .status(400)
      .json({ success: false, message: "Token and new password required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.password = newPassword;
    await admin.save();

    return res.json({
      success: true,
      message: "Admin password updated successfully.",
    });
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token." });
  }
});

export default router;
