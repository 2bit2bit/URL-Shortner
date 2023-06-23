const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const userController = require("../controllers/user");

//create shorturl
router.post(
  "/create",
  [
    body("redirectUrl")
      .trim()
      .escape()
      .isURL()
      .withMessage("Please enter a valid url"),
    body("customUrl")
      .optional({ checkFalsy: true })
      .trim()
      .escape()
      .isAlphanumeric()
      .withMessage("Please enter a valid custom url")
      .isLength({ min: 3, max: 10 })
      .withMessage("Custom url must be between 3 to 10 characters long"),
    body("label")
      .optional({ checkFalsy: true })
      .escape()
      .trim()
      .isAlphanumeric()
      .withMessage("Please enter a Label")
      .isLength({ min: 3, max: 10 })
      .withMessage("Label must be between 3 to 15 characters long"),
  ],
  userController.createUrl
);

router.get("/url", userController.getUrls);

router.get("/url/:urlId", userController.getUrl);

router.put(
  "/url/:urlId",
  [
    body("redirectUrl")
      .optional({ checkFalsy: true })
      .trim()
      .escape()
      .isURL()
      .withMessage("Please enter a valid url"),
    body("customUrl")
      .optional({ checkFalsy: true })
      .trim()
      .escape()
      .isAlphanumeric()
      .withMessage("Please enter a valid custom url")
      .isLength({ min: 3, max: 10 })
      .withMessage("Custom url must be between 3 to 10 characters long"),
    body("label")
      .optional({ checkFalsy: true })
      .escape()
      .trim()
      .isAlphanumeric()
      .withMessage("Please enter a Label")
      .isLength({ min: 3, max: 10 })
      .withMessage("Label must be between 3 to 15 characters long"),
  ],
  userController.modifyUrl
);

router.delete("/url/:urlId", userController.deleteUrl);

module.exports = router;
