//new 23 december
const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { authMiddleware } = require("../middleware/authMiddleware");

// GET logged-in user's wishlist
router.get("/", authMiddleware, getWishlist);

// ADD to wishlist
router.post("/", authMiddleware, addToWishlist);

// REMOVE from wishlist
router.delete("/:productId", authMiddleware, removeFromWishlist);

module.exports = router;
