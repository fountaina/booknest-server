import express from "express";
import User from "../models/userSchema.js";
// import {authorizeRoles} from "../middleware/auth.js";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

//Default route for user, route for registering user if user doesn't already exist
router.post("/register", registerUser);

// Route for Loging In user if they already exist on database.
router.post("/login", loginUser);

router.get("/login", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


export default router;
