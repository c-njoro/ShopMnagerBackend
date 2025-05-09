// updateUserOrders.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Order = require("./models/order.model");
const User = require("./models/user.model");

dotenv.config();

const MONGO_URI = process.env.LOCAL_KEY;

async function updateUserOrders() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const orders = await Order.find({});
    console.log(`📦 Found ${orders.length} orders`);

    for (const order of orders) {
      const sellerId = order?.seller?.id;
      if (!sellerId) {
        console.warn(`⚠️  Order ${order._id} missing seller.id`);
        continue;
      }

      const user = await User.findById(sellerId);
      if (!user) {
        console.warn(`❌ No user found with id ${sellerId}`);
        continue;
      }

      user.orders = user.orders || [];

      if (!user.orders.includes(order._id)) {
        user.orders.push(order._id);
        await user.save();
        console.log(`✅ Linked order ${order._id} to seller ${user.name}`);
      } else {
        console.log(
          `ℹ️  Order ${order._id} already linked to seller ${user.name}`
        );
      }
    }

    console.log("🎉 Done linking all orders.");
    await mongoose.disconnect();
  } catch (err) {
    console.error("🔥 Error updating user orders:", err);
    process.exit(1);
  }
}

updateUserOrders();
