import express from "express";
import {authorizeRoles} from "../middleware/auth.js";
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from "../controllers/bookController.js";

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books
// @access  Public (everyone can view)
router.get("/", getAllBooks);

// @route   GET /api/books/:id
// @desc    Get a single book by ID
// @access  Public
router.get("/:id", getBookById);

// @route   POST /api/books
// @desc    Add a new book
// @access  only an admin is authorized to access
router.post("/", authorizeRoles("admin"), createBook);

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  only an admin is authorized to access
router.patch("/:id", authorizeRoles("admin"), updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  only an admin is authorized to access
router.delete("/:id", authorizeRoles("admin"), deleteBook);

export default router;
