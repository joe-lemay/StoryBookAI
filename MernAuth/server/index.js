import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import cookieParser from "cookie-parser";
import authRouter from "./Routes/auth.routes.js";
import bookRouter from "./Routes/book.routes.js"


const app = express();
app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);


dotenv.config();
const PORT = process.env.PORT;

dbConnect();

app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`)
);

app.use(cookieParser());

app.use(express.json());

app.use("/book", bookRouter)
app.use("/user", authRouter);