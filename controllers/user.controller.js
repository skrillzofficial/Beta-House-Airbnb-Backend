const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// function to register
const handleRegister = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { firstName, lastName, email, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await USER.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // protect user password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save to database
    const user = await USER.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate a token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
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
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function to handle update User
const handleUpdateUser = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { userId } = req.user;
  
  try {
    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate input
    if (req.body.firstName && req.body.firstName.trim() === '') {
      return res.status(400).json({ message: "First name cannot be empty" });
    }
    if (req.body.lastName && req.body.lastName.trim() === '') {
      return res.status(400).json({ message: "Last name cannot be empty" });
    }

    // update fields if provided
    if (req.body.firstName) {
      user.firstName = req.body.firstName.trim();
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName.trim();
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleUpdateUser,
};