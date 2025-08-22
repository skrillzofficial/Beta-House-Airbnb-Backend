const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    
    // Check if token exists after split
    if (!token) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Validate payload structure
        if (!payload || !payload.userId || !payload.email) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = {
            email: payload.email,
            userId: payload.userId
        };
        
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        
        // More specific error handling
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        return res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = { isLoggedIn };