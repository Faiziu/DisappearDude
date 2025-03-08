const errorHandler = (res, err, statusCode = 500, message = "Server Error") => {
  console.error(err);
  res.status(statusCode).json({ message, error: err.message });
};

module.exports = errorHandler;
