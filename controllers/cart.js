import Cart from "../models/cart.js";
import asyncHandler from "express-async-handler";

export const getCartItems = asyncHandler(async (req, res) => {
    try {
        const user = req.user._id;
        let found = await Cart.find({ owner: user })
        if (found) {
            found = await found.populate("owner").populate({
                path: "products.mainProd"
            })
            res.status(200).json(found)
        } else {
            throw new Error("Cart does not exists")
        }
    } catch (error) {
        res.status(404).json({ err: error.message })
    }
})

export const addToCart = asyncHandler(async (req, res) => {
    try {
        const { variant } = req.body
        console.log(variant);
        const { productId } = req.params
        console.log(productId);
        const user = req.user[0]._id;
        console.log(user);
        const cartExists = await Cart.find({ owner: user })
        if (cartExists.length >= 1) {
            const data = {
                variant: variant, mainProd: productId
            }
            const found = await Cart.findOne({ owner: user, "products.variant": variant, "products.mainProd": productId })
                .populate({
                    path: "products.mainProd"
                }).populate("owner", "-password")
            if (found) {
                res.status(200).json(found)
            } else {
                let created = await Cart.findOneAndUpdate({ owner: user }, { $addToSet: { products: data } }, { new: true }).populate({
                    path: "products.mainProd"
                }).populate("owner", "-password")
                res.status(200).json(created)
            }

        } else {
            console.log(variant);
            const data = {
                variant: variant, mainProd: productId, amount: 1
            }

            console.log(data);
            let newCart = await Cart.create({ owner: user, products: [data] })
            newCart = await Cart.findOne({ _id: newCart._id }).populate({
                path: "products.mainProd"
            }).populate("owner", "-password")

            res.status(201).json(newCart)
        }
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

export const removeFromCart = asyncHandler(async (req, res) => {
    try {
        const { variant } = req.body
        const { productId } = req.params
        const user = req.user._id;
        const cartExists = await Cart.find({ owner: user })
        if (cartExists.length >= 1) {
            console.log("updating");
            const created = await Cart.findOneAndUpdate({ owner: user }, { $pull: { products: { variant, mainProd: productId } } }, { new: true })
                .populate({
                    path: "products.mainProd"
                }).populate("owner", "-password")
            console.log(created);
            res.status(200).json(created)
        } else {
            throw new Error("Cannot remove item..")
        }
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

