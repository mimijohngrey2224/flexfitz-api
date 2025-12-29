// userRoute.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const User = require("../models/user");
const multer = require("multer");
const Wishlist = require("../models/wishlist");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/upload-avatar/:id", upload.single("img"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    user.img = req.file.path;
    await user.save();

    res.json({ message: "Profile image updated successfully", img: user.img });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Wishlist routes
router.get("/:id/wishlist", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.id });
    res.json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

router.post("/:id/wishlist", async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.params.id });
    if (!wishlist) wishlist = new Wishlist({ userId: req.params.id, products: [] });

    if (!wishlist.products.find((p) => p.productId === productId)) {
      wishlist.products.push({ productId, name, price, image });
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
});

module.exports = router;
