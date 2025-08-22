const router = require("express").Router()
const { handleRegister, handleLogin, handleUpdateUser } = require("../controllers/user.controller")
const {isLoggedIn} = require("../middleware/auth")


//Routes
router.post("/register", handleRegister)
router.post("/login", handleLogin)
router.patch("/user", isLoggedIn, handleUpdateUser)


module.exports = router