const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {
  // If the user is authenticated, skip anonymous ID
  if (req.user) {
    return next();
  }

  // Read anonymousId from cookies
  let cartId = req.cookies["anonymousId"];

  // If no cookie, create one
  if (!cartId) {
    cartId = uuidv4();
    res.cookie("anonymousId", cartId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });
  }

  // Attach to request
  req.cartId = cartId;

  next();
};
