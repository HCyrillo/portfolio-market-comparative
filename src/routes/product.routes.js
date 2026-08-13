const { body, param, query, checkExact } = require('express-validator');
const validate = require('../middlewares/validate-request');
const asyncHandler = require('../middlewares/async-handler');
const { success } = require('../utils/response');

module.exports = (productService) => {
  const router = require('express').Router();
  const available = body('available').custom((value) => typeof value === 'boolean').withMessage('Available deve ser booleano.');
  router.post('/', [body('name').isString().withMessage('Nome é obrigatório.').bail().trim().notEmpty().withMessage('Nome é obrigatório.'), body('category').isString().withMessage('Categoria é obrigatória.').bail().trim().notEmpty().withMessage('Categoria é obrigatória.'), available, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(async (req, res) => success(res, await productService.create(req.body), 201)));
  router.get('/', [query('search').optional().trim().notEmpty().withMessage('Busca não pode ser vazia.')], validate, asyncHandler(async (req, res) => success(res, await productService.list(req.query.search))));
  router.patch('/:id/availability', [param('id').isInt({ min: 1 }).withMessage('ID do produto deve ser numérico.'), available, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(async (req, res) => success(res, await productService.updateAvailability(Number(req.params.id), req.body.available))));
  return router;
};
