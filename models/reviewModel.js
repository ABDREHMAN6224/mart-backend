import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    stars: {
        type: Number,
    }

}, {
    timestamps: true
})
const Review = new mongoose.model("Review", reviewSchema)
export default Review