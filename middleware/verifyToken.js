import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Not authorized. Admin only." });

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired token. Please login again." });
  }
};
