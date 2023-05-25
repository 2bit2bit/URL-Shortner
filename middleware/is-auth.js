const jsonwebtoken = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (!req.get("Authorization")) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }
    const token = req.get("Authorization").split(" ")[1];

    let decodedToken = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          err.statusCode = 500;
          throw err;
        }
        return decodedToken;
      }
    );

    console.log(decodedToken);
    if (!decodedToken) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
