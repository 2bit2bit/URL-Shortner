const express = require("express");
const router = express.Router();
const Url = require("../models/url");

router.get("/:shortId", async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    const url = await Url.findOne({ shortId: shortId });
    if (!url) {
      return res.json({ message: "url not found" });
    }
    //add analytics here
    res.redirect("https:" + url.redirectUrl);
    
  } catch (err) {
    console.log(err);
    const error = new Error("Something went wrong");
    next(error);
  }
});

module.exports = router;
