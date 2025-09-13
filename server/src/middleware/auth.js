import jwt from "jsonwebtoken";
import env from "dotenv";

env.config()

export const authorizeRoles = (...roles) => {
    // midddle ware for role-based access control (RBAC)
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: "Not authorized for this action"})
        }
        next();
    };
};

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] // Get the header from the reqest
        const token = authHeader && authHeader.split(" ")[1] // Gets the token from the gotten header
        if (token == null) {return res.sendStatus(401).json({message: "Access token required!"})}

        // jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        //     if (err) {return res.sendStatus(401)}
        //     req.user = user
        //     next()
        // })
        const decodedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
        
        // Add decode user data to request object
        req.user = decodedData
        next()

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: "Token expired" });
        }
        res.status(500).json({ message: error.message });
    }
}