const express = require("express");
const router = express.Router();
const Url = require("../models/url");
const { IPinfoWrapper } = require("node-ipinfo");
const IP = require("ip");
const Cache = require("../config/redis");
require("dotenv").config();

const ipinfo = new IPinfoWrapper(process.env.IPINFO_API_KEY);

router.get("/", async (req, res, next) => {
  res.redirect("https://url-frontend-xfel.onrender.com");
});

router.get("/:shortId", async (req, res, next) => {
  try {
    const shortId = req.params.shortId;

    const cacheKey = `Url:${shortId}`;
    const cachedUrl = await Cache.redis.get(cacheKey);

    if (cachedUrl) {
      console.log("https:" + JSON.parse(cachedUrl));
      res.redirect("https:" + JSON.parse(cachedUrl));
    }

    const url = await Url.findOne({ shortId: shortId });

    if (!url) {
      const error = new Error("url not found");
      error.statusCode = 401;
      throw error;
    }

    if (!cachedUrl) {
      console.log(url.redirectUrl);
      res.redirect("https:" + url.redirectUrl);
      Cache.redis.setEx(cacheKey, 3 * 60, JSON.stringify(url.redirectUrl));
    }

    const analytics = {};
    const ipAddress = IP.address();
    analytics.country = (await ipinfo.lookupIp(ipAddress)).country;
    analytics.userAgent = req.headers["user-agent"];
    analytics.referrer = req.get("Referrer");
    analytics.device = req.device.type;
    url.clicks++;
    url.analytics.push(analytics);
    url.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

module.exports = router;
