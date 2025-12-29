const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // ensure correct path
// const User = require("../models/userModel"); // Make sure this points to your User model

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json("exist");

    // Validate password
    if (password.length < 8) return res.json("invalid password");

    // Check password match
    if (password !== confirmPassword) return res.json("no match");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json("Invalid Email/Password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json("Invalid Email/Password");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey123",
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        img: user.img || null,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
