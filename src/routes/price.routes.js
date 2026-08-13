const { body, query, param, checkExact } = require('express-validator');
const validate = require('../middlewares/validate-request');
const asyncHandler = require('../middlewares/async-handler');
const { isValidMoney } = require('../utils/money');
const { success } = require('../utils/response');
const idQuery = (field) => query(field).optional().isInt({ min: 1 }).withMessage(`${field} deve ser numérico.`);
const numericId = (field) => body(field).isInt({ min: 1 }).custom((value) => typeof value === 'number').withMessage(`${field} deve ser um ID numérico válido.`);
const validPrice = body('price').custom((value) => isValidMoney(value)).withMessage('Preço deve ser positivo, numérico e possuir no máximo duas casas decimais.');
module.exports = (priceService) => {
  const router = require('express').Router();
  router.post('/', [numericId('marketId'), numericId('productId'), validPrice, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(async (req, res) => success(res, await priceService.create(req.body), 201)));
  router.patch('/:id', [param('id').isInt({ min: 1 }).withMessage('ID do preço deve ser numérico.'), validPrice, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(async (req, res) => success(res, await priceService.update(Number(req.params.id), req.body.price))));
  router.get('/', [idQuery('marketId'), idQuery('productId')], validate, asyncHandler(async (req, res) => success(res, await priceService.list({ marketId: req.query.marketId ? Number(req.query.marketId) : undefined, productId: req.query.productId ? Number(req.query.productId) : undefined }))));
  return router;
};
