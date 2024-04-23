import User from "../Models/user.model.js";
import createSecretToken from "../utils/SecretToken.js";
import bcrypt from "bcrypt";
const SignUp = async (req, res) => {
    console.log("signing up")
    try {
        const { email, password, username } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await User.create({ email, password:passwordHash, username });
        console.log(user)
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user });
    } catch (error) {
        console.error(error);
    }
};
const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: 'All fields are required' })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect password or email' })
        }
        // const auth = await bcrypt.compare(password, user.password)
        // if (!auth) {
        //     return res.json({ message: 'Incorrect password or email' })
        // }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: "User logged in successfully", success: true });
        next()
    } catch (error) {
        console.error(error);
    }
};
const getOneUser = async(req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        await user.populateAllBooks()
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
export {SignUp, Login, getOneUser};