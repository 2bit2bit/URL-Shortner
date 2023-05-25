const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    redirectUrl: String,
    shortId: String,
    qrCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
