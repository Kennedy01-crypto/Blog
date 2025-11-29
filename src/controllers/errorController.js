import AppError from "../config/appError.js";

/**
 * @description Handles database cast errors, which occur when a query expects a certain data type but receives another.
 * @param {Error} err - The error object.
 * @returns {AppError} - A new AppError instance with a user-friendly message and a 400 status code.
 * @error CastError
 */
const handleCastErrorDB = (err) => {
  const message = `Cast Error: Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * @description Handles database validation errors, which occur when a field fails a validation rule defined in the schema.
 * @param {Error} err - The error object.
 * @returns {AppError} - A new AppError instance with a consolidated message of all validation errors and a 404 status code.
 * @error Validation error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data; ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * @description Handles duplicate field errors from the database, which occur when a unique constraint is violated.
 * @param {Error} err - The error object.
 * @returns {AppError} - A new AppError instance with a message indicating the duplicate field and a 400 status code.
 * @error Duplicate Feild Error
 * @model Unique: is set to true
 */
const handleDuplicateFields = (err) => {
  const value = err.keyValue[Object.keys(err.keyvalue)[0]];
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

/**
 * @description Sends detailed error information, including the error stack, for debugging purposes in the development environment.
 * @param {Error} err - The error object.
 * @param {Response} res - The Express response object.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * @description Sends a generic error message in production to avoid leaking sensitive information. Differentiates between operational errors (expected) and programming errors (bugs).
 * @param {Error} err - The error object.
 * @param {Response} res - The Express response object.
 */
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or other unknown error: don't leak error details
    console.log(`Error 💥`, err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

/**
 * @description Global error handling middleware. It catches all errors passed to next() and sends an appropriate response based on the environment (development or production).
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    let error = {
      ...err,
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {
      ...err,
      name: err.name,
      message: err.message,
    };
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
