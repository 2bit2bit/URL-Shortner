const { validationResult } = require("express-validator");
const random = require("random-string-alphanumeric-generator");
const dns = require("node:dns");
const QRCode = require("qrcode");
const cloudinary = require("cloudinary").v2;
let streamifier = require("streamifier");
const Cache = require("../config/redis");

const Url = require("../models/url");
const User = require("../models/user");

let uploadFromBuffer = (qr) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "URL-Shortner",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier
      .createReadStream(Buffer.from(qr.split(",")[1], "base64"))
      .pipe(cld_upload_stream);
  });
};

exports.createUrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.userId;
    const { redirectUrl, customUrl, generateQR, label } = req.body;

    // if user already created a short url for this redirect url return that
    const user = await User.findById(userId).populate("urls");

    const urlExist = user.urls.find((url) => url.redirectUrl === redirectUrl);

    if (urlExist) {
      return res.json({
        message: "URL already exist",
        urlId: urlExist._id,
        shortId: urlExist.shortId,
        qrCode: urlExist.qrCode,
        redirectUrl: urlExist.redirectUrl,
        label: urlExist.label,
      });
    }

    await dns.promises.lookup(redirectUrl, { all: true }); //validate url

    const url = new Url({
      redirectUrl: redirectUrl,
      userId: userId,
      label: label,
    });
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

    //generate qr code and upload it to cloudinary
    if (generateQR) {
      const qr = await QRCode.toDataURL(req.get("host") + "/" + url.shortId);
      const result = await uploadFromBuffer(qr);
      url.qrCode = result.url;
    }
    await url.save();
    user.urls.push(url);
    await user.save();

    res.json({
      message: "Url created",
      urlId: url._id,
      label: url.label,
      shortId: url.shortId,
      qrCode: url.qrCode,
      redirectUrl: url.redirectUrl,
    });
  } catch (err) {
    if (err.code == "ENOTFOUND") {
      err.data = [{ msg: "please enter a invalid url" }];
      err.statusCode = 404;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUrls = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { query } = req;

    const {
      created_at,
      label,
      order = "asc",
      order_by = "created_at",
      page = 0,
      per_page = 10,
    } = query;

    const cacheKey = `Urls:${userId}:${created_at}:${label}:${order}:${order_by}:${page}:${per_page}`;

    const cachedUrls = await Cache.redis.get(cacheKey);

    if (cachedUrls) {
      // Cache hit
      return res.json({ Urls: JSON.parse(cachedUrls) });
    }

    const findQuery = { userId: userId };

    if (created_at) {
      findQuery.created_at = {
        $gt: moment(created_at).startOf("day").toDate(),
        $lt: moment(created_at).endOf("day").toDate(),
      };
    }

    if (label) {
      findQuery.label = label;
    }

    const sortQuery = {};

    const sortAttributes = order_by.split(",");

    for (const attribute of sortAttributes) {
      if (order === "asc" && order_by) {
        sortQuery[attribute] = 1;
      }

      if (order === "desc" && order_by) {
        sortQuery[attribute] = -1;
      }
    }

    const urls = await Url.find(findQuery)
      .sort(sortQuery)
      .skip(page)
      .limit(per_page);

    Cache.redis.setEx(cacheKey, 5 * 60, JSON.stringify(urls));
    res.json({ Urls: urls });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUrl = async (req, res, next) => {
  const userId = req.userId;
  const urlId = req.params.urlId;
  try {
    const cacheKey = `Url:${userId}:${urlId}`;
    const cachedUrl = await Cache.redis.get(cacheKey);

    if (cachedUrl) {
      return res.json({ url: JSON.parse(cachedUrl) });
    }

    const url = await Url.findOne({ _id: urlId, userId: userId });
    if (!url) {
      return res.json({ message: "Url not found" });
    }

    Cache.redis.setEx(cacheKey, 3 * 60, JSON.stringify(url));

    res.json({ url: url });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.modifyUrl = async (req, res, next) => {
  const userId = req.userId;
  const urlId = req.params.urlId;
  try {
    const url = await Url.findOne({ _id: urlId, userId: userId });
    if (!url) {
      return res.json({ message: "Url not found" });
    }

    const { redirectUrl, customUrl, generateQR, label } = req.body;

    if (redirectUrl) {
      await dns.promises.lookup(redirectUrl, { all: true }); //validate url
      url.redirectUrl = redirectUrl;
    }

    if (customUrl) {
      const customUrlExist = await Url.findOne({ shortId: customUrl });
      if (customUrlExist && customUrlExist._id.toString() !== urlId) {
        return res.json({ message: "Custom url already exists" });
      }
      url.shortId = customUrl;

      if (url.qrCode) {
        await cloudinary.uploader.destroy(
          "URL-Shortner/" + url.qrCode.split("/")[8].split(".")[0]
        );

        url.qrCode = "";
      }
      if (generateQR) {
        const qr = await QRCode.toDataURL(req.get("host") + "/" + url.shortId);
        const result = await uploadFromBuffer(qr);
        url.qrCode = result.url;
      }
    }

    if (label) {
      url.label = label;
    }

    await url.save();
    res.json({
      message: "Url Updated",
      urlId: url._id,
      shortId: url.shortId,
      label: url.label,
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

exports.deleteUrl = async (req, res, next) => {
  const userId = req.userId;
  const urlId = req.params.urlId;
  try {
    const url = await Url.findOneAndDelete({ _id: urlId, userId: userId });
    if (!url) {
      return res.json({ message: "Url not found" });
    }

    const user = await User.findById(userId);
    user.urls.pull(urlId);

    if (url.qrCode) {
      await cloudinary.uploader.destroy(
        "URL-Shortner/" + url.qrCode.split("/")[8].split(".")[0]
      );
    }
    await user.save();
    res.json({ message: "Url deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
