//new 20th december
const express = require("express");
const router = express.Router();

const {
  initiatePayment,
  verifyPayment,
} = require("../controllers/paymentController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Initiate Flutterwave payment
router.post("/initiate", authMiddleware, initiatePayment);

// Verify payment & create order
router.get("/verify/:transaction_id", authMiddleware, verifyPayment);

module.exports = router;
