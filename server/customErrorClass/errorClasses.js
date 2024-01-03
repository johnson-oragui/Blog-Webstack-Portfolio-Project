/**
 * Custom error class for representing a Not Found (404) error.
 */
export class NotFoundError extends Error {
  /**
   * Creates a new instance of NotFoundError.
   *
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Custom error class for representing an Unauthorized (401) error.
 */
export class UnauthorizedError extends Error {
  /**
   * Creates a new instance of UnauthorizedError.
   *
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}
