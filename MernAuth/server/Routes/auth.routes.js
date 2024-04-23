import {SignUp, Login, getOneUser} from "../Controllers/user.controller.js";
import {Router} from "express";
import userVerification from "../Middlewares/AuthMiddleWare.js";

const authRouter = Router()

authRouter.post("/signup", SignUp);
authRouter.post("/login", Login)
authRouter.route("/:id")
.get(getOneUser)
authRouter.post('/',userVerification)

export default authRouter