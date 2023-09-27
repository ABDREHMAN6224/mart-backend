import express from "express"
import { addToCart, getCartItems } from "../controllers/cart.js"
import { isAuthenticated } from "../middleware/auth.js"
const router = express.Router()

router.get("/getCartItems", isAuthenticated, getCartItems)
router.post("/addCartItems/:productId", isAuthenticated, addToCart)
router.post("/removeCartItems/:productId", isAuthenticated, addToCart)
export default router