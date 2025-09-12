import Books from "../models/booksSchema.js";

// Get all books
export const getAllBooks = async (req, res) => {
    try {
        const books = await Books.find();
        res.json(books)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// Get a single book
export const getBookById = async (req, res) => {
    try {
        const book = await Books.findById(req.params.id)
        res.json(book);
    } catch (error) {
        // if error is due to user's input of a non-existent book
        if (error.name === "CastError") {
            return res.status(404).json({message: "No book found with the given ID!"})
        }
        console.log(error.message)
        res.status(500).json({message: "Server Error"})
    }
};

// Create a new book
export const createBook = async (req, res) => {
    const   { 
                title, author, ISBN, publisher, publishedDate, edition, language, genres,
                description, pageCount, coverImage, price, currency, stock, ratings
    } = req.body;
    try {
        const newBook = new Books(
            { 
                title, author, ISBN, publisher, publishedDate, edition, language, genres,
                description, pageCount, coverImage, price, currency, stock, ratings
             });
        await newBook.save();
        res.status(201).json({
            "message": "Book Created successfully",
            "createdBook" : newBook
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({message: "Missing required fields or invalid Data"})
        }
        res.status(500).json({ message: error.message });
    }
};

// Update a book
export const updateBook = async (req, res) => {
    const proposedUpdate = req.body
    const { id } = req.params
    try {
        const updatedBook = await Books.findByIdAndUpdate(id, proposedUpdate, {new: true})
        if (!updatedBook) {
            throw new Error("Book not found!")
        }
        res.json({
            "message": "Book Updated successfully",
            "updatedBook": updatedBook});
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

//Delete a book
export const deleteBook = async (req, res) => {
    const { id } = req.params
    try {
        const book = await Books.findById(id)
        if (book) {
            const deletedBook = await Books.findByIdAndDelete(id)
            res.status(204).send();
        } else {throw new Error("Book not found!")}
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}
