const mongoose = require("mongoose")

const productShema = new mongoose.Schema({
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    name: {type: String, required: true},
    img: {type: String, required: true},
    video: { type: String }, 
    price: {type: Number, required: true},
    men: {type: Boolean, default: false},
    menSecond: {type: Boolean, default: false},
    WomenData: {type: Boolean, default: false},
    shoes: {type: Boolean, default: false},
}, {timestamps: true})


module.exports = mongoose.model("Product", productShema)