export const isAdmin = (req, res, next) => {
    try {
        const { role } = req.user;
        if (role!=="admin") {
            return res.status(403).json({
                status: "fail",
                message: "Forbidden - only admins can access this resource.",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};