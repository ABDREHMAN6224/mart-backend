import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: []
    }],
    token: {
        type: String,
    },
    picturePath: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.generateToken = async function () {
    console.log("token");
    this.token = jwt.sign({ id: this._id }, "mySecretKey", { expiresIn: "30d" })
    await this.save()
}
userSchema.methods.comparePassword = async function (password) {
    const correct = await bcrypt.compare(password, this.password)
    return correct;
}
const User = new mongoose.model("User", userSchema)
export default User