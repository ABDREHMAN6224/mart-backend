import User from "../models/userMode.js";
import asyncHandler from "express-async-handler"

export const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, password, email, picturePath, role } = req.body;
        const alreadyExists = await User.findOne({ email: email })
        if (alreadyExists) {
            throw new Error("alreday exists")
        }
        const user = await User.create({ name, password, picturePath, email, role });
        if (user) {
            res.status(201).json(user)
        } else {
            throw new Error("cannot create a user... please try again")
        }
    } catch (error) {
        res.status(503).json({ msg: error.message })
    }


})
export const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const found = await User.findOne({ email })
        if (found) {
            if (found.comparePassword(password)) {
                found.generateToken()
                res.status(200).json(found)
            } else {
                throw new Error("Invalid Password")
            }
        }
        else {
            throw new Error("No such user... please register first")
        }

    } catch (error) {
        res.status(404).json({ msg: error.message })

    }

})
