// //new 23 december
const Wishlist = require("../models/wishlist");

// controllers/wishlistController.js
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.user._id, // ✅ FIXED
    });

    res.json(wishlist || { products: [] });
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user._id,
        products: [],
      });
    }

    const exists = wishlist.products.find(
      (p) => p.productId === productId
    );

    // if (!exists) {
    //   wishlist.products.push({ productId, name, price, image });
    // }

      if (!exists) {
    wishlist.products.push({
      productId,
      
      name,
      price,
      image: image || "", // ✅ ensure field exists
    });
  }


    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      userId: req.user._id, // ✅ FIXED
    });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.productId !== productId
    );

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
};


module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

