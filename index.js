require("dotenv").config();
const express = require("express");
const mongoose = require ("mongoose");
const cors = require ("cors");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 6000;
const userRouter = require("./routes/user.route");
const propertyRouter = require("./routes/property.route");


// Initialize express
const app = express();

// MIDDLEWARE
//middleware
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);
app.use(cors());
app.use(express.json());

// home routes
app.get("/", (req, res)=>{
    res.status(200).json({success: true, message: "BetaHouse Server"})
})

// page routes
app.use("/api/v1", userRouter)
app.use("/api/v1", propertyRouter); 

// Test route
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ status: "success", message: "API is working!" });
});

// Health check
app.get("/", (req, res) => {
  res.send("Server is running. Use Postman to test endpoints.");
});

// DATABASE & SERVER START
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME || "BetaHouse",
    });
    console.log("MongoDatabase connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
