import express from "express";
import Order from "../models/order";

const router = express.Router();


router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error while updating order" });
  }
});

export default router;
