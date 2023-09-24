import express from "express"
import { getAllProducts, getSingleProduct, addProduct, updateSingleProduct, deleteSingleProduct } from "../controllers/products.js"

const router = express.Router()

router.route("/").get(getAllProducts)
// router.route("/addProduct").post(addProduct)
router.route("/findProducts/:productId").get(getSingleProduct).put(updateSingleProduct).post(deleteSingleProduct)


export default router