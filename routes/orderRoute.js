//new 20th december
const express = require("express");
const router = express.Router();
const { getMyOrders, getOrderById } = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

// router.get("/my-orders", authMiddleware, getMyOrders);
router.get(
  "/my-orders",
  authMiddleware, // ✅ REQUIRED
  getMyOrders
);
// 🆕 Order details
router.get("/:id", authMiddleware, getOrderById) //this is were i stop and the server begin crasing

module.exports = router;
