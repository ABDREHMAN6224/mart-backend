import User from "../models/userMode.js";
import jwt from "jsonwebtoken"
export const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        const { user } = req.body

        if (token) {
            if (token.startsWith("Bearer")) {
                token = token.split(" ")[1]
            } else {
                throw new Error("not authorized")
            }
        }
        else {
            throw new Error("please login first")
        }
        const isVerified = jwt.sign(token, "mySecretKey")
        console.log(isVerified);
        if (isVerified) {
            const foundUser = await User.find({ _id: user })
            req.user = foundUser;
            console.log(req.user);
            console.log("going next");
            next()
        } else {
            throw new Error("Not verified..Please login again")
        }
    } catch (error) {
        res.status(404).json({ err: error.message })
    }

}