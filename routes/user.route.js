const router = require("express").Router()
const { handleRegister, handleLogin, handleGetUser, handleUpdateUser } = require("../controllers/user.controller")
const {isLoggedIn,} = require("../middleware/auth")


//Routes
router.post("/register", handleRegister)
router.post("/login", handleLogin)
router.get('/profile', isLoggedIn, handleGetUser);
router.patch("/user", isLoggedIn, handleUpdateUser)


module.exports = router