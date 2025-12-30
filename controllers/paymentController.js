const Cart = require("../models/cart");
const Order = require("../models/orderModel");
const User = require("../models/user");

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

exports.initiatePayment = async (req, res) => {
  try {
    const jwtUser = req.user;
    if (!jwtUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(jwtUser.id || jwtUser._id);
    if (!user || !user.email) {
      return res.status(400).json({
        message: "User email missing. Please update profile.",
      });
    }

    const cart = await Cart.findOne({ user: user._id })
      .populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const amount = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const paymentData = {
      tx_ref: `gym-${Date.now()}`,
      amount,
      currency: "NGN",
      redirect_url: "https://flexfitz-mainfrontend.vercel.app//thanks",

      customer: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        phone_number: user.phone || "0000000000",
      },

      meta: {
        userId: user._id.toString(), // 🔑 REQUIRED
      },

      customizations: {
        title: "Flexfitz Purchase",
        description: "Payment for items in cart",
      },
    };

    console.log("Sending to Flutterwave:", paymentData);

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (data.status !== "success") {
      return res.status(400).json({
        message: "Payment initiation failed",
        flutterwave: data,
      });
    }

    return res.json({
      paymentLink: data.data.link,
    });

  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyPayment = async (req, res) => {
  console.log("🔹 VERIFY PAYMENT HIT");
  console.log("REQ.PARAMS:", req.params);
  console.log("REQ.USER:", req.user);

  const { transaction_id } = req.params;
  const user = req.user;

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const result = await response.json();

    if (result.status !== "success" || result.data.status !== "successful") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const cart = await Cart.findOne({ user: user._id }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart empty" });
    }

    const cartTotal = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    if (Number(result.data.amount) !== Number(cartTotal)) {
      return res.status(400).json({ message: "Amount mismatch" });
    }

    const orderItems = cart.products.map((item) => {
      console.log("PRODUCT IMG:", item.product.img);

      return {
        product: item.product._id.toString(),
        name: item.product.name,

        image: item.product.img, // ✅ CORRECT FIELD

        price: item.product.price.toString(),
        quantity: item.quantity.toString(),
      };
    });


    const order = await Order.create({
      user: user._id,
      items: orderItems,
      total: cartTotal.toFixed(2),
      status: "Paid",
      date: new Date(),
      transactionId: transaction_id, // <- match schema
    });

  console.log("ORDER ITEMS:", orderItems);
  console.log("CART TOTAL:", cartTotal.toFixed(2));


    console.log("ORDER CREATED:", order);

    await Cart.deleteOne({ user: user._id });

    console.log("Payment verified:", transaction_id); // ✅ move before return

    return res.json({
      message: "Payment verified & order created",
      order,
    });

  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

