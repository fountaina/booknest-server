import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
import {generateTokens} from "../middleware/auth.js";
import env from "dotenv";

env.config()

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
            password: req.body.password,
            role: req.body.role
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
        // console.log("Username: " + user.username)
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
        
        // Updates the user's refresh token on database.
        user.refreshToken = tokens.refreshToken;
        await user.save();

        // save accesstoken and refreshToken to cookie
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,   // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
            secure: process.env.NODE_ENV === "production",  // Set to true in production for HTTPS-only cookies
            maxAge: 15 * 60 * 1000,  // 15 minutes in mileseconds
            sameSite: "strict"  // Ensures the cookie is sent only with requests from the same site
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,  // 24 hours is mileseconds
            sameSite: "strict"
        })

        return res.status(200).json(
            { 
                message: "User logged In successfully!",
                userINFO: user,
            }
        )
        // const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET)
        // return res.json({accessToken: accessToken});
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const user = await User.findOne({ refreshToken: req.cookies.refreshToken }).select("+refreshToken")
        const refreshToken = req.cookies.refreshToken;
        console.log("User: " + user);
        
        if (!user) {
            return res.status(401).json({message: "Refresh Token not found"})
        }

        // checks if refresh token matches the one in the database
        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({message: "Invalid Refresh token"})
        }

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"} 
        );

        // Send the new access token in the response
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,  // 15 minutes
            sameSite: "strict"
        });
        console.log("Token refreshed succesfully!")
        return res.status(200).json({message: "Token refreshed succesfully"})
    } catch (error) {
        console.error("Refresh token failed: " + error);
        res.status(500).json({error: "Failed to refresh token!"})
    }
}


