import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Your username is required"],
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    books:[
        {
            type: mongoose.Types.ObjectId,
            ref:"Book"
        }
    ]
},
{ timestamps: true }
);

// Add a method to retrieve all books associated with the user
UserSchema.methods.populateAllBooks = async function () {
    await this.populate('books');
    return this.books;
};

const User = mongoose.model("User", UserSchema);
export default User;