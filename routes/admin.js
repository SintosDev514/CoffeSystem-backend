import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import Admin from "../models/admin.model.js";

const router = express.Router();

router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);
    if (!admin)
      return res.status(404).json({ message: "Admin not found haaa!" });

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
