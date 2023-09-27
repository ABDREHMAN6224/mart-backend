import mongoose from "mongoose"
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    variants: [{
        name: {
            type: String,
        },
        price: {
            type: Number
        }
    }
    ],
    isSSD: {
        type: Boolean,
        default: false
    },
    ram: {
        type: Number,
        required: true
    },
    category: String,

    stars: Number,
    description: {
        type: String,
        trim: true
    },
    stock: Number,
    featured: {
        type: Boolean,
        default: false
    },
    images: [{ type: String }],
    price: Number
}, {
    timestamps: true
})
const Product = mongoose.model("Product", productSchema)
export default Product