/**
 * @description Custom error class to create operational errors that can be handled gracefully.
 * @extends Error
 */
class AppError extends Error {
  /**
   * @description Creates an instance of AppError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? "Client Fail"
      : "Server Error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
