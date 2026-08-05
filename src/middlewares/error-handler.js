const { now } = require('../utils/date');

const errorHandler = (error, _req, res, _next) => {
  const isInvalidJson = error instanceof SyntaxError && error.status === 400 && 'body' in error;
  const status = isInvalidJson ? 400 : error.status || 500;
  if (status === 500) console.error(error);
  res.status(status).json({ timestamp: now(), status, error: isInvalidJson ? 'Bad Request' : error.error || 'Internal Server Error', message: isInvalidJson ? 'JSON inválido.' : error.message || 'Erro interno do servidor.' });
};

module.exports = errorHandler;
