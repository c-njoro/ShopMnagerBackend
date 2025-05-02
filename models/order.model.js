const mongoose = require("mongoose");
const User = require("./user.model");
const Product = require("./product.model");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,

          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      min: 0,
    },
    seller: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
    customer: {
      phone: {
        type: Number,
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
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  let totalAmount = 0;

  this.products.forEach((product) => {
    product.totalPrice = product.unitPrice * product.quantity;
    totalAmount += product.totalPrice;
  });

  this.totalAmount = totalAmount;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
