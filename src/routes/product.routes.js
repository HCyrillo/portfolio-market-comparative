const { body, param, query, checkExact } = require('express-validator');
const createController = require('../controllers/product.controller');
const validate = require('../middlewares/validate-request');
const asyncHandler = require('../middlewares/async-handler');

module.exports = (productService) => {
  const router = require('express').Router();
  const controller = createController(productService);
  const available = body('available').custom((value) => typeof value === 'boolean').withMessage('Available deve ser booleano.');
  router.post('/', [body('name').isString().trim().notEmpty().withMessage('Nome é obrigatório.'), body('category').isString().trim().notEmpty().withMessage('Categoria é obrigatória.'), available, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(controller.create));
  router.get('/', [query('search').optional().trim().notEmpty().withMessage('Busca não pode ser vazia.')], validate, asyncHandler(controller.list));
  router.patch('/:id/availability', [param('id').isInt({ min: 1 }).withMessage('ID do produto deve ser numérico.'), available, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(controller.updateAvailability));
  return router;
};
