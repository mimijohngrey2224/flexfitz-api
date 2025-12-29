//21 december

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    product: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true },
  },
  { _id: false } // prevents Mongoose from creating an _id for each item
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    total: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Paid", "Shipped", "Delivered"],
      default: "Pending",
    },

    date: { type: Date, required: true },

    transactionId: { type: String, index: true, sparse: true },

    tx_ref: { type: String },

    paymentStatus: {
      type: String,
      enum: ["paid", "failed"],
      default: "paid",
    },

    currency: { type: String, default: "NGN" },

    paymentMethod: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
