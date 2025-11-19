import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import forgotPasswordRouter from "../controllers/forgot-password.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in .env!");
  process.exit(1);
}

// =====================
// LOGIN ROUTE
// =====================
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (role === "admin") {
    try {
      const admin = await Admin.findOne({ email });
      if (!admin)
        return res
          .status(401)
          .json({ success: false, message: "Admin not found nganiiiiiii" });

      const isMatch = await admin.comparePassword(password);
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin._id, role: "admin", email: admin.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ success: true, role: "admin", token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  res.status(400).json({ success: false, message: "Invalid role" });
});

router.use(forgotPasswordRouter);

export default router;
