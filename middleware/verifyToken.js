import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../server.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1]; 
  if (!token) return res.status(401).json({ success: false, message: "Token malformed" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized. Admin only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token. Please login again." });
  }
};
