const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  urls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Url" }],
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password") || user.isNew) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

module.exports = mongoose.model("User", userSchema);
