const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is Required"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is Required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            minlength: [6, "Minimum password length is 6"],
            required: [true, "Password is required"]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: String,
        verificationTokenExpires: Date,
        resetPasswordToken: String,
        resetPasswordTokenExpires: Date,
    },
    {timestamps: true}
)


// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const USER = mongoose.model("user", userSchema)
module.exports = USER