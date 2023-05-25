const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  urls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Url" }],
});

userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema);
