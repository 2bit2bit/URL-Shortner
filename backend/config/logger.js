const morgan = require("morgan");

// const loggingMiddleware = morgan('dev');
const loggingMiddleware = morgan(":method :url :status :response-time ms");

module.exports = loggingMiddleware;
