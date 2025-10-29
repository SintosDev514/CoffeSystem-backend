import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controllers.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET products → public (no token required)
router.get("", getProducts);

// POST, PUT, DELETE → admin only
router.post("", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
