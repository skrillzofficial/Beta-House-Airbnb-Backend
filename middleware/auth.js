const jwt = require("jsonwebtoken")

const isLoggedIn = async (req, res, next) =>{
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({message: "Unauthorized, Invalid token"})
    }
    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        if (!payload) {
            return res.status(401).json({message: "Unauthorized to perform action"})
        }
        req.user = {
            email: payload.email,
            userId: payload.userId
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "Authentication Failed"})
    }
}
module.exports = {isLoggedIn}