const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    redirectUrl: String,
    shortId: String,
    qrCode: String,
    clicks: { type: Number, default: 0 },
    analytics: [
      {
        country: String,
        device: String,
        referrer: String,
        time: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
