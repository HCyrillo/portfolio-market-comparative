class AppError extends Error {
  constructor(status, message, error) {
    super(message);
    this.status = status;
    this.error = error || (status === 400 ? 'Bad Request' : 'Internal Server Error');
  }
}

class NotFoundError extends AppError {
  constructor(message) { super(404, message, 'Not Found'); }
}

class ConflictError extends AppError {
  constructor(message) { super(409, message, 'Conflict'); }
}

class PersistenceError extends AppError {
  constructor(message) { super(500, message, 'Internal Server Error'); }
}

module.exports = { AppError, NotFoundError, ConflictError, PersistenceError };
