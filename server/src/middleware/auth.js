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

// Generate access token and refresh token
export const generateTokens = (user) => {
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
    // refreshTokens.push(tokens.refreshToken)
    return {accessToken, refreshToken};
}

export const activateRefreshToken = (req, res) => {
    jwt.verify(req.heanders["authorization"], process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {res.status(400).json({message: "Invalid Refresh token"})}

        generateTokens(user);
    })
}

export const authenticateUser = (req, res, next) => {
    try {
        // const authHeader = req.headers["authorization"] // Get the header from the reqest
        // const token = authHeader && authHeader.split(" ")[1] // Gets the token from the gotten header
        // if (token == null) {return res.sendStatus(401).json({message: "Access token required!"})}

        const token = req.cookies.accessToken; // get access token from cookies
        if (token == null) {return res.sendStatus(401).json({message: "Access token required!"})}

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