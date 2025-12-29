//new 16th december

const Order = require("../models/orderModel");

// 🧾 Get all orders for a user (by param — keep)
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Failed to get orders", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    console.log("USER:", req.user);

    const orders = await Order.find({
      user: req.user._id, // ✅ MUST match schema
    }).sort({ createdAt: -1 });

    console.log("ORDERS FOUND:", orders.length);

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 🛒 Create new order
const createOrder = async (req, res) => {
  try {
    const { items, total, status } = req.body;
    const { userId } = req.params;

    const order = new Order({
      user: userId,
      items,
      total,
      status: status || "Pending",
      date: new Date().toISOString(),
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id, // 🔒 security: only owner
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order by id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getOrdersByUser,
  getMyOrders,
  createOrder,
  getOrderById
};




