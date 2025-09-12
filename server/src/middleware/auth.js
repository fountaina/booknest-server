export const authorizeRoles = (...roles) => {
    // midddle ware for role-based access control (RBAC)
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message: "Not authorized for this action"})
        }
        next();
    };
};