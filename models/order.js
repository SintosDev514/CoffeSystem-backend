import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "ready to serve", "served"], 
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  servedAt: { type: Date }, 
});

export default mongoose.model("Order", orderSchema);
