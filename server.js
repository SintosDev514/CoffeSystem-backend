import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch"; 
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.js";
import Order from "./models/order.js"; 

dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const MONGO_URI = process.env.MONGO_URL;
/*
if (!JWT_SECRET || !PAYMONGO_SECRET_KEY || !MONGO_URI) {
  console.error("❌ Missing required .env keys (JWT_SECRET, PAYMONGO_SECRET_KEY, MONGO_URL)!");
  process.exit(1);
}*/

const app = express();
app.use(cors());
app.use(express.json());


connectDB(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });


app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);


app.post("/create-checkout", async (req, res) => {
  const { lineItems, customerId } = req.body;

  if (!lineItems || lineItems.length === 0 || !customerId) {
    return res.status(400).json({ error: "Missing lineItems or customerId" });
  }

  try {
    const amount = lineItems.reduce(
      (sum, item) => sum + item.price * item.quantity * 100,
      0
    );

    const response = await fetch("https://api.paymongo.com/v1/links", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount,
            currency: "PHP",
            description: `Order for customer ${customerId}`,
            metadata: {
              customerId,
              cart: JSON.stringify(lineItems),
            },
            redirect: {
              success: "http://localhost:3000/success",
              failed: "http://localhost:3000/failed",
            },
          },
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ PayMongo API Error:", result);
      return res.status(500).json({
        error: result.errors?.[0]?.detail || "PayMongo API error",
      });
    }

    const checkoutUrl = result?.data?.attributes?.checkout_url;
    if (!checkoutUrl) {
      return res.status(400).json({
        error: "No checkout URL returned from PayMongo",
        details: result,
      });
    }

   
    const newOrder = new Order({
      customerId,
      items: lineItems,
      total: amount / 100,
      paymentStatus: "pending",
    });
    await newOrder.save();

    console.log("🕓 Pending order saved:", newOrder);
    res.json({ checkoutUrl });
  } catch (err) {
    console.error("❌ PayMongo Error:", err);
    res.status(500).json({ error: "Failed to create checkout" });
  }
});


app.post("/webhook/paymongo", express.json(), async (req, res) => {
  try {
    const event = req.body;
    const eventType = event?.data?.attributes?.type;

    console.log("📦 PayMongo Event:", eventType);

    if (eventType === "payment.paid") {
      const payment = event.data.attributes.data;
      const attributes = payment?.attributes;
      const metadata = attributes?.metadata || {};
      const customerId = metadata.customerId || "unknown";
      const amount = attributes.amount / 100;

      let items = [];
      try {
        items = metadata.cart ? JSON.parse(metadata.cart) : [];
      } catch {
        console.error("❌ Error parsing cart");
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { customerId, total: amount, paymentStatus: "pending" },
        {
          paymentStatus: "paid",
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (updatedOrder) {
        console.log("✅ Order marked as paid:", updatedOrder._id);
      } else {
        const newOrder = new Order({
          customerId,
          items,
          total: amount,
          paymentStatus: "paid",
        });
        await newOrder.save();
        console.log("✅ Created new paid order:", newOrder._id);
      }
    }

    res.status(200).send({ received: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    res.status(500).send({ error: "Webhook failed" });
  }
});


app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    console.log(`✅ Order ${id} updated to ${paymentStatus}`);
    res.json(updatedOrder);
  } catch (err) {
    console.error("❌ Failed to update order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export { JWT_SECRET };
