const express = require("express");
const router = express.Router();
const { handleFlutterwaveWebhook } = require("../controllers/flutterwaveWebhookController");

router.post(
  "/flutterwave",
  express.raw({ type: "application/json" }),
  handleFlutterwaveWebhook
);

module.exports = router;
