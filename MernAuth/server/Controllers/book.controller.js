import Book from "../Models/book.model.js";
import User from "../Models/user.model.js";
import generateBook from "../utils/GenerateBook.js"

const BookController = {
    createBook: async (req, res) => {
        try {
            const {
                title,
                pages,
                userId
            } = req.body;
            const bookInfo = {
                title: title,
                pages: pages,
                userId: userId
            }
            const book = await Book.create(bookInfo);
            const user = await User.findById(userId);
            user.books.push(book._id);
            await user.save();
            res.json(book)
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    },
    getOneBook: async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            await book.getAssociatedUser();
            res.json(book);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    },
    generateBook: async (req,res) => {
        try{
            const storyInfo = {
                userPrompt: req.body.userPrompt,
                artStyle: req.body.artStyle,
                userId: req.body.userId
            }
            let story = await generateBook(storyInfo)
            console.log(story)
            const book = await Book.create(story);
            const user = await User.findById(storyInfo.userId);
            user.books.push(book._id);
            await user.save();
            res.json(book)
        }
        catch(error){
        console.log(error);
        res.status(400).json(error);
        }
    }
}

export default BookController;