const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail, sendResetEmail } = require("../emails/sendEmail");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToken");
const fs = require("fs");

// function to register
const handleRegister = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await USER.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // protect user password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // verify process
    const verificationToken = generateToken();
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    // save to database
    const user = await USER.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });
    const clientUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendWelcomeEmail({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      clientUrl,
    });
    return res
      .status(201)
      .json({ success: true, message: "User Registered successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// function to verify email
const handleVerifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await USER.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }
    if (user.verificationTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "verification token has expired", email: user.email });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }
    // mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// function to login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Account Not found, Please Register" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Email not verified, Check your mail" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate a token
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );
    return res.status(200).json({
      success: true,
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// function to handle forgotten password
const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    // send mail
    const clientUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetEmail({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      clientUrl,
    });
    res.status(200).json({
      success: true,
      token,
      message: "Password reset link has been sent to your mail",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// function to handle reset password
const handleResetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Provide token and new password" });
  }
  try {
    const user = await USER.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid or expired link, try again" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfull" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// function to handle update User
const handleUpdateUser = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // update first name if provided
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    // update last name if provided
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    // update bio if provided
    if (req.body.bio) {
      user.bio = req.body.bio;
    }
    // update profile picture if provided
    if (req.files && req.files.profilePicture) {
      const profilePicture = req.files.profilePicture;
      const result = await cloudinary.uploader.upload(
        profilePicture.tempFilePath,
        {
          folder: "inklune/profilePicture",
          use_filename: true,
          unique_filename: false,
          resource_type: "image",
        }
      );
      user.profilePicture = result.secure_url;
      // delete temp file after upload
      fs.unlink(profilePicture.tempFilePath, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleRegister,
  handleVerifyEmail,
  handleLogin,
  handleForgotPassword,
  handleResetPassword,
  handleUpdateUser,
};
