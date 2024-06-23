const jwt = require('jsonwebtoken');
const config = require('../config/envConfig');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ "error": "Unauthorized" });

    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        config.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ "error": err.name, "message": err.message }); // Forbidden
            req.userId = decoded.UserInfo.id;
            req.email = decoded.UserInfo.email;
            next();
        }
    );
};

module.exports = verifyJWT;