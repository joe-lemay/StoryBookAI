import { Router } from "express";
import BookController from "../Controllers/book.controller.js";

const bookRouter = Router();

bookRouter.route("/new")
.post(BookController.createBook)
bookRouter.route("/generate")
.post(BookController.generateBook)
bookRouter.route("/:id")
.get(BookController.getOneBook)


export default bookRouter