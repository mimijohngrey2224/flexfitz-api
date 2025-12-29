const express = require("express");
const { addToCart, getCart, updateQuantity, removeItem } = require("../controllers/cartController");
const { optional } = require("../middleware/authMiddleware");
const anonymousCart = require("../middleware/anonymousCart");

const router = express.Router();

// Order is CRITICAL:
router.use(optional);
router.use(anonymousCart);

router.post("/add", addToCart);
router.get("/", getCart);
router.post("/update-quantity", updateQuantity);
router.post("/delete-item", removeItem);

module.exports = router;
