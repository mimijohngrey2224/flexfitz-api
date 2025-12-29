const Product = require("../models/product") //same reading error 27th december changing small p to capital P, then no red underline
const {validateProduct} = require("../validator")


const fs = require("fs");
const path = require("path");



//now to check videopath
exports.createProduct = async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const imgPath = req.files?.img ? req.files.img[0].path : undefined;
    const videoPath = req.files?.video ? req.files.video[0].path : undefined;

    const product = new Product({
      category: req.body.category,
      name: req.body.name,
      img: imgPath,       // ✅ Save the uploaded image path
      video: videoPath,   // ✅ Save the uploaded video path
      price: req.body.price,
      men: req.body.men,
      menSecond: req.body.menSecond,
      WomenData: req.body.WomenData,
      shoes: req.body.shoes,
    });

    const productItem = await product.save();
    res.status(201).json(productItem); // ✅ Proper status code
  } catch (error) {
    console.log({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};


exports.getAllProducts = async(req, res)=>{
    try {
        const product = await Product.find().populate("category")
        res.json(product)
    } catch (error) {
        res.json({message: error.message})
        
    }
}

exports.getMenProducts = async(req, res)=>{
    try {
        const men = await Product.find({men: true}).populate("category")
        res.json(men)
    } catch (error) {
        res.json({message: error.message})
    }
}

exports.getMenSecondProducts = async(req, res)=>{
    try {
        const menSecond = await Product.find({menSecond: true}).populate("category")
        res.json(menSecond)
    } catch (error) {
        res.json({message: error.message})
    }
}

exports.getWomenDataProducts = async(req, res)=>{
    try {
const WomenData = await Product.find({WomenData: true}).populate("category")
        res.json(WomenData)
    } catch (error) {
        res.json({message: error.message})
    }
}

exports.getShoesProducts = async(req, res)=>{
    try {
        const shoes = await Product.find({shoes: true}).populate("category")
        res.json(shoes)
    } catch (error) {
        res.json({message: error.message})
    }
}


exports.updateProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields only if values are provided
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;

    await product.save();

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    // ✅ Check for admin access
    if (!req.user) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Remove image file
    const imagePath = path.join(__dirname, "..", product.img);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // ✅ Remove from DB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

