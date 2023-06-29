const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const device = require("express-device");
const Cache = require("./config/redis");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scissors";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");
const userRoutes = require("./routes/user");
const visitRoutes = require("./routes/visitRoute");
const logger = require("./config/logger");

app.use(cors());
app.use(limiter);
app.use(logger);
app.use(express.json());
app.use(device.capture());
app.options('*', cors()) 
app.use("/", visitRoutes);
app.use("/auth", authRoutes);
app.use("/user", isAuth, userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || "Internal server error";
  const data = error.data || null;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
    Cache.connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
