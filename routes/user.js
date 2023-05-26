const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const userController = require("../controllers/user");

//create shorturl
router.post(
  "/create",
  [body("redirectUrl").trim().escape().isURL().withMessage("Please enter a valid url"),
   body("customUrl").optional().trim().escape().isAlphanumeric().withMessage("Please enter a valid custom url")
   .isLength({min: 3, max: 10}).withMessage("Custom url must be between 3 and 10 characters long")],
  userController.create
);

router.get("/url", userController.getUrls);

router.get("/url/:urlId", userController.getUrl);

//modify shorturl
router.put("/url/:urlId", userController.modifyUrl); 

//delete shorturl
router.delete("/url/:urlId", userController.deleteUrl);

module.exports = router;
