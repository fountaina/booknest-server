import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
import bcrypt from "bcryptjs";


//config env
env.config();

// Generate access token and refresh token
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"} 
    );

    const refreshToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"}
    );

    return {accessToken, refreshToken};
}

// In production store in DB
let refreshTokens = [];

// Register a user
export const registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exits" })
        }

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        await newUser.save();

        const tokens = generateTokens(newUser);
        res.status(201).json(
            { 
                message: "User registered successfully!",
                accessToken: tokens.accessToken
            })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// login a user
export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select("+password");
        // console.log("User: " + user)
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        //Check if entered password matches hashed passoword of user using
        // matchPassword method of the userSchema and store it as boolean in userValidated
        const userValidated = await user.matchPassword(req.body.password)

        if (!userValidated) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Serializes the user with JWT
        const tokens = generateTokens(user);

        return res.status(200).json(
            { 
                message: "User logged In successfully!",
                accessToken: tokens.accessToken
            }
        )
        // const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET)
        // return res.json({accessToken: accessToken});
    } catch (error) {

    }
};

