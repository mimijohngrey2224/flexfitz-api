//new 29/oct/2025

const Cart = require("../models/cart");
const Product = require("../models/product"); //this import was reading error 27 december
const mongoose = require("mongoose");

// Calculate Amount
const calculateAmount = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  return product.price * quantity;
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user.id : null;
  const cartId = req.cartId;

  try {
    let cart = userId
      ? (await Cart.findOne({ user: userId })) || (await Cart.findOne({ anonymousId: cartId }))
      : await Cart.findOne({ anonymousId: cartId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        anonymousId: userId ? null : cartId,
        products: [],
      });
    }

    const productExist = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (productExist) {
      productExist.quantity += quantity;
      productExist.amount = await calculateAmount(productId, productExist.quantity);
    } else {
      const amount = await calculateAmount(productId, quantity);
      cart.products.push({ product: productId, quantity, amount });
    }

    await cart.save();
    await cart.populate("products.product"); // ✅ populate before sending
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
};

//new 6th december
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const anonymousId = req.cartId;

    let cart;

    if (userId) {
      cart = await Cart.findOne({ user: userId })
        .populate("products.product");

      // If user has no cart, create new one
      if (!cart) {
        cart = await Cart.create({
          user: userId,
          products: []
        });
      }
    } else {
      cart = await Cart.findOne({ anonymousId })
        .populate("products.product");

      if (!cart) {
        cart = await Cart.create({
          anonymousId,
          products: []
        });
      }
    }

    res.json({
      products: cart.products.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        img: item.product.img,
        price: item.product.price,
        quantity: item.quantity,
        amount: item.amount,
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


//new 4th december

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    const rawUserId = req.user?.id;      // string from JWT
    const cartId = req.cartId;           // anonymous ID cookie

    console.log("DEBUG - req.user:", req.user);
    console.log("DEBUG - req.cartId:", cartId);

    let cart = null;

    if (rawUserId) {
      // 🔥 FIX: Cast string to ObjectId
      const userId = new mongoose.Types.ObjectId(rawUserId);

      cart = await Cart.findOne({ user: userId });

      console.log("DEBUG - Cart found for user:", !!cart);
    }

    // Fallback: check anonymous cart
    if (!cart) {
      cart = await Cart.findOne({ anonymousId: cartId });
      console.log("DEBUG - Anonymous cart found:", !!cart);
    }

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find item
    const cartItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Update quantity
    cartItem.quantity = quantity;

    // Recalculate amount
    const product = await Product.findById(productId);
    cartItem.amount = product.price * quantity;

    await cart.save();
    await cart.populate("products.product");

    return res.json({
      products: cart.products.map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        img: item.product.img,
        price: item.product.price,
        quantity: item.quantity,
        amount: item.amount,
        size: item.size,
        color: item.color,
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


//new 9 decembee
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user ? req.user.id : null;
    const cartId = req.cartId;

    let cart = userId
      ? (await Cart.findOne({ user: userId })) || (await Cart.findOne({ anonymousId: cartId }))
      : await Cart.findOne({ anonymousId: cartId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // FIND ITEM BEFORE REMOVING
    const removedItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    let removedName = null;
    if (removedItem) {
      const product = await Product.findById(productId);
      removedName = product?.name || null;
    }

    // REMOVE ITEM
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("products.product");

    return res.json({
      message: "Item removed",
      removedName,   // ⬅ IMPORTANT
      products: cart.products.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        img: item.product.img,
        price: item.product.price,
        quantity: item.quantity,
        amount: item.amount,
        size: item.size,
        color: item.color,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

