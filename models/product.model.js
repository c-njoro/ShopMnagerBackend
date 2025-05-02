const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Utensil", "Plastic", "Clothing", "Shoe", "Stationery", "Other"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "pieces",
    },
    size: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: String,
      trim: true,
      default: null,
    },
    color: {
      type: String,
      trim: true,
      default: null,
    },
    material: {
      type: String,
      trim: true,
      default: null,
    },
    brand: {
      type: String,
      trim: true,
      default: null,
    },
    customAttributes: {
      type: Map,
      of: String,
      default: {},
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("Product", productSchema);
