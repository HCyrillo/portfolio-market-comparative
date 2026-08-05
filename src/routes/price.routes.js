const { body, query, param, checkExact } = require('express-validator');
const createController = require('../controllers/price.controller');
const validate = require('../middlewares/validate-request');
const asyncHandler = require('../middlewares/async-handler');
const { isValidMoney } = require('../utils/money');
const idQuery = (field) => query(field).optional().isInt({ min: 1 }).withMessage(`${field} deve ser numérico.`);
const numericId = (field) => body(field).isInt({ min: 1 }).custom((value) => typeof value === 'number').withMessage(`${field} deve ser um ID numérico válido.`);
const validPrice = body('price').custom((value) => isValidMoney(value)).withMessage('Preço deve ser positivo, numérico e possuir no máximo duas casas decimais.');
module.exports = (priceService) => {
  const router = require('express').Router();
  const controller = createController(priceService);
  router.post('/', [numericId('marketId'), numericId('productId'), validPrice, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(controller.create));
  router.patch('/:id', [param('id').isInt({ min: 1 }).withMessage('ID do preço deve ser numérico.'), validPrice, checkExact([], { message: 'Body contém campos não permitidos.' })], validate, asyncHandler(controller.update));
  router.get('/', [idQuery('marketId'), idQuery('productId')], validate, asyncHandler(controller.list));
  return router;
};
