const { AppError } = require('../utils/app-error');

const notFound = (req, _res, next) => next(new AppError(404, `Rota ${req.method} ${req.originalUrl} não encontrada.`, 'Not Found'));

module.exports = notFound;
