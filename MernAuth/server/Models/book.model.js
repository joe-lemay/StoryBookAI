import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required:[true,"No title was found"]
    },
    pages:
    {
        type: Array,
        data:[
            {
                text:{
                    type: String,
                },
                imgBlob:{
                    type: String
                }
            }
        ]
    },
    userId:{
        type: mongoose.Types.ObjectId,
        required: [true, "No user id found"],
        ref: "User"
    }
});

BookSchema.methods.getAssociatedUser = async function () {
    await this.populate('userId');
    return this.userId;
};

const Book = mongoose.model("Book", BookSchema);
export default Book;