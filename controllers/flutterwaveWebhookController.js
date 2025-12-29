const Cart = require("../models/cart");
const Order = require("../models/orderModel");

exports.handleFlutterwaveWebhook = async (req, res) => {
  try {
    const signature = req.headers["verif-hash"];

    if (signature !== process.env.FLW_WEBHOOK_HASH) {
      return res.status(401).send("Unauthorized");
    }

    const payload = req.body;

    if (payload.event !== "charge.completed") {
      return res.sendStatus(200);
    }

    const payment = payload.data;

    if (payment.status !== "successful") {
      return res.sendStatus(200);
    }

    const userId = payment.meta?.userId;
    if (!userId) return res.sendStatus(200);

    const cart = await Cart.findOne({ user: userId })
      .populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.sendStatus(200);
    }

    const total = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const items = cart.products.map((item) => ({
      name: item.product.name,
      image: item.product.images?.[0] || "",
    }));

    await Order.create({
      user: userId,
      items,
      total: total.toString(),
      status: "Pending",
      date: new Date().toISOString(),
    });

    cart.products = [];
    await cart.save();

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(200);
  }
};
