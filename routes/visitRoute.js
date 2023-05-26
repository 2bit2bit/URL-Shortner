const express = require("express");
const router = express.Router();
const Url = require("../models/url");
const { IPinfoWrapper } = require("node-ipinfo");
const IP = require("ip");
require("dotenv").config();

const ipinfo = new IPinfoWrapper(process.env.IPINFO_API_KEY);

router.get("/", async (req, res, next) => {
  res.send("redirect to front end home page");
});

router.get("/:shortId", async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    const url = await Url.findOne({ shortId: shortId });
    if (!url) {
      return res.json({ message: "url not found" });
    }

    const analytics = {};

    const ipAddress = IP.address(); //update this to use actual ip address
    analytics.country = (await ipinfo.lookupIp("102.91.47.115")).country;
    analytics.userAgent = req.headers["user-agent"];
    analytics.referrer = req.get("Referrer");
    analytics.device = req.device.type;
    url.clicks++;
    url.analytics.push(analytics);
    url.save();

    res.redirect("https:" + url.redirectUrl);
  } catch (err) {
    console.log(err);
    const error = new Error("Something went wrong");
    next(error);
  }
});

module.exports = router;