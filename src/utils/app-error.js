class AppError extends Error {
  constructor(status, message, error, code) {
    super(message);
    this.status = status;
    this.error = error || (status === 400 ? 'Bad Request' : 'Internal Server Error');
    this.code = code;
  }
}

class NotFoundError extends AppError {
  constructor(message) { super(404, message, 'Not Found', 'RESOURCE_NOT_FOUND'); }
}

class ConflictError extends AppError {
  constructor(message) { super(409, message, 'Conflict', 'RESOURCE_CONFLICT'); }
}

class PersistenceError extends AppError {
  constructor(message) { super(500, message, 'Internal Server Error', 'PERSISTENCE_ERROR'); }
}

module.exports = { AppError, NotFoundError, ConflictError, PersistenceError };
