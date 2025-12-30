//new
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Import routes
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const wishlistRoute = require("./routes/wishlistRoute"); // ✅ Now safe
const userRoute = require("./routes/userRoute");
const { registerUser, loginUser } = require("./controllers/userController");
const app = express();
const path = require("path");
const paymentRoute = require("./routes/paymentRoute");
const flutterwaveWebhookRoute = require("./routes/flutterwaveWebhookRoute");

connectDB();

app.use(cors({
  origin: "https://flexfitz-mainfrontend.vercel.app/",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use("/api/webhooks", flutterwaveWebhookRoute);
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/", authRoute);
app.use("/api/payment", paymentRoute);

app.post("/register", registerUser);
app.post("/login", loginUser);

// ✅ Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`You are listening on port ${port}`));
