//14th december
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const header =
    req.headers["authorization"] ||
    req.headers["auth-token"];

  if (!header) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded._id || decoded.id).select("-password");

    // ✅ NORMALIZE USER OBJECT
    req.user = {
      _id: decoded.userId || decoded._id || decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

req.user = {
  _id: user._id,
  email: user.email,
  role: user.role,
};

    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * 👮 ADMIN MIDDLEWARE
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};

/**
 * 🔓 OPTIONAL AUTH MIDDLEWARE
 * Used for public routes that may have a user
 */
const optional = async (req, res, next) => {
  const header =
    req.headers["authorization"] ||
    req.headers["auth-token"];

  if (!header) return next();

  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // req.user = await User.findById(decoded.id || decoded._id)
    //   .select("-password");

      req.user = await User.findById(
  decoded.userId || decoded._id || decoded.id
).select("-password");

  } catch (error) {
    // ❌ Silent fail — optional means optional
    // console.error("Optional middleware error:", error.message);
  }

  next();
};

module.exports = { authMiddleware, admin, optional };

