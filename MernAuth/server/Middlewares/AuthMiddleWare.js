import User from "../Models/user.model.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
dotenv.config();

const userVerification = (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false })
        } else {
            const user = await User.findById(data.id)
            if (user) return res.json({ status: true, user: user.username, id: user._id })
            else return res.json({ status: false })
        }
    })
}

export default userVerification;