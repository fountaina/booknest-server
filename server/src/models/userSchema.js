import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/.+\@.+\..+/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // exclude password from queries by default
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: "user",
        },
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },
    },
    { timestamps: true }
);

// Hash password before saving if password is changed or new account is created.
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Method on userSchema to compare inputed password and hashed password on database.
userSchema.methods.matchPassword = async function(enteredPassword) {
    // Check if password entered my client matches that saved on DB
    // If password doesn't match return false, otherwise true.
    try {
        const match = await bcrypt.compare(String(enteredPassword), this.password)
        console.log("Matched?...." + match)
        return match
    } catch (error) {
        console.log("Error Matching passwords")
        return false
    }
}

const User = mongoose.model("User", userSchema);

export default User;
