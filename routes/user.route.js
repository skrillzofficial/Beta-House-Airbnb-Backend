const router = require("express").Router()
const { handleRegister, handleVerifyEmail, handleLogin, handleForgotPassword, handleResetPassword, handleUpdateUser } = require("../controllers/user.controller")
const {isLoggedIn} = require("../middleware/auth")


//Routes
router.post("/register", handleRegister)
router.post("/verify-email/:token", handleVerifyEmail)
router.post("/login", handleLogin)
router.post("/forgot-password", handleForgotPassword)
router.post("/reset-password", handleResetPassword)
router.patch("/user", isLoggedIn, handleUpdateUser)


module.exports = router