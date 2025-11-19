import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";
import { verifyAdminToken } from "../middleware/auth.js";

const router = express.Router();

// GET products → public (no token required)
router.get("", getProducts);

// POST, PUT, DELETE → admin only
router.post("", verifyAdminToken, createProduct);
router.put("/:id", verifyAdminToken, updateProduct);
router.delete("/:id", verifyAdminToken, deleteProduct);

export default router;
