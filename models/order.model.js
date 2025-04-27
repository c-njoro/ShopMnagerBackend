const mongoose = require("mongoose");
const User = require("./user.model");
const Product = require("./product.model");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtSale: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    seller: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model for your sellers
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // for createdAt and updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
