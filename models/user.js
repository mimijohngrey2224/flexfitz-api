// with dashboad

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  img: { type: String, default: "uploads/avatar.png" },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "client"], default: "client" },

  // 🧍 Optional dashboard additions:
  wishlist: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      image: String,
    },
  ],
  orders: [
    {
      orderId: String,
      total: Number,
      status: { type: String, default: "Pending" },
      date: { type: Date, default: Date.now },
    },
  ],
});

// JWT method (keep this)
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
