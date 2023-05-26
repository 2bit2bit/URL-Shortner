const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const device = require('express-device')

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scissors";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");
const userRoutes = require("./routes/user");
const visitRoutes = require("./routes/visitRoute");

app.use(cors());
app.use(express.json());
app.use(device.capture())

// app.use('/', (req, res, next) => {}); Redirect to front end
app.use("/", visitRoutes);
app.use("/auth", authRoutes);
app.use("/user", isAuth, userRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data || null;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
