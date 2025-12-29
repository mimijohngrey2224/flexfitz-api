// old 
const mongoose = require("mongoose")
// const product = require("./product")
// const { required } = require("joi")

const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    anonymousId: {type: String},
    products: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            quantity: {type: Number, required: true, min: 1},
            amount: {type: Number, required: true},
             size: { type: String, default: null },
            color: { type: String, default: null }
        }
    ]
})

module.exports = mongoose.model("Cart", cartSchema)
