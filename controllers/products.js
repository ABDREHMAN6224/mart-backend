import express from "express"
import Product from "../models/productModel.js"
import asyncHandler from "express-async-handler"


export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const allProducts = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json(allProducts)

    } catch (error) {
        res.status(404).json({ msg: "error occured while fetching data.." })
    }
})


export const getSingleProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    try {
        const foundProd = await Product.findById(productId);
        if (foundProd) {
            res.status(200).json(foundProd);
        }
        else {
            res.status(404).json({ msg: "no such product.." })
        }
    } catch (error) {
        res.status(404).json({ msg: "no such product.." })

    }
})

export const addProduct = asyncHandler(async (req, res) => {
    let images = []
    images = req.files.map(f => `http://localhost:4242/${f.filename}`)
    try {
        let { name, company, isSSD, ram, category, description, stock, shipping, featured, variants } = req.body;
        variants = JSON.parse(variants)
        const price = variants[0].price
        const createdProduct = await Product.create(
            { name, company, variants, isSSD, ram: Number(ram), category, description, stock: Number(stock), shipping, featured, images, price }
        )
        try {
            const found = await Product.findById(createdProduct._id)
            res.status(201).json(found)
        } catch (error) {
            throw new Error("failed to create product..")
        }
    } catch (error) {
        res.status(500).json({ err: error.message })
    }

})
export const updateSingleProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const found = await Product.findByIdAndUpdate(productId, { ...req.body }, { new: true });
        if (found) {
            res.status(200).json(found)
        }
        else {
            throw new Error("Failed to update product... try again")
        }

    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})
export const deleteSingleProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const found = await Product.findByIdAndDelete(productId);
        res.status(200).json(found)
    } catch (error) {
        res.status(500).json({ err: "cannot delete" })
    }
})