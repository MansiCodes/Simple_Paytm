const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({message: "Authorization header missing or incorrect format"});
    }

    const token = authHeader.split(' ')[1];
    console.log("Received token:", token); 

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Invalid or expired token", error: err.message});
    }
};

module.exports = {
    authMiddleware
};