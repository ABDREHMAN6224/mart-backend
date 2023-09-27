import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [{
        variant: {
            type: Number
        },
        mainProd: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },

    }],

})

const Cart = new mongoose.model("Cart", cartSchema)
export default Cart