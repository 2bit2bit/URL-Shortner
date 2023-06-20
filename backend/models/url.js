const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: String,
    redirectUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
    },
    qrCode: String,
    clicks: { type: Number, default: 0, required: true },
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
