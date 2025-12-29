const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getAllProducts,
  getMenProducts,
  getMenSecondProducts,
  getWomenDataProducts,
  getShoesProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { authMiddleware, admin } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();

// ✅ Create product (admin only)
router.post(
  "/",
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  authMiddleware,
  admin,
  createProduct
);

// ✅ Get routes
router.get("/", getAllProducts);
router.get("/men", getMenProducts);
router.get("/menSecond", getMenSecondProducts);
router.get("/WomenData", getWomenDataProducts);
router.get("/shoes", getShoesProducts);

// ✅ Update & Delete
router.put("/:id", authMiddleware, admin, updateProduct);
router.delete("/:id", authMiddleware, admin, deleteProduct);

module.exports = router;

