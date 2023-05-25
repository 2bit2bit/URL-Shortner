const { validationResult } = require("express-validator");
const random = require("random-string-alphanumeric-generator");
const dns = require("node:dns");

const Url = require("../models/url");
const User = require("../models/user");

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.userId;
    const { redirectUrl, customUrl, generateQR } = req.body;

    // if user already created a short url for this redirect url return that
    const user = await User.findById(userId).populate("urls");
    const urlExist = user.urls.find((url) => url.redirectUrl === redirectUrl);
    if (urlExist) {
      return res.json({
        message: "Url already exists",
        urlId: urlExist._id,
        shortId: urlExist.shortId,
        qrCode: urlExist.qrCode,
        redirectUrl: urlExist.redirectUrl,
      });
    }

    await dns.promises.lookup(redirectUrl, { all: true }); //validate url

    const url = new Url({ redirectUrl: redirectUrl, userId: userId });
    //if custom url is provided check if it exists in db and if it does throw error else add it to db
    if (customUrl) {
      if (await Url.findOne({ shortId: customUrl })) {
        return res.json({ message: "Custom url already exists" });
      }
      url.shortId = customUrl;
    } else {
      //if custom url is not provided generate random string and add it to db
      do {
        url.shortId = random.randomAlphanumeric(6);
      } while (await Url.findOne({ shortId: url.shortId }));
    }

    if (generateQR) {
      //generate qr code
      //add qr code to db
      //return short url and qr code?
      url.qrCode = "qr code";
    }

    await url.save();
    user.urls.push(url);
    await user.save();
    res.json({
      message: "Url created",
      urlId: url._id,
      shortId: url.shortId,
      qrCode: url.qrCode,
      redirectUrl: url.redirectUrl,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
