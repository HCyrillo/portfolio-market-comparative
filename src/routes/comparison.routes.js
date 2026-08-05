const { query } = require('express-validator');
const createController = require('../controllers/comparison.controller');
const validate = require('../middlewares/validate-request');
const asyncHandler = require('../middlewares/async-handler');
const requiredId = (field) => query(field).isInt({ min: 1 }).withMessage(`${field} deve ser um ID numérico válido.`);
module.exports = (comparisonService) => {
  const router = require('express').Router();
  router.get('/', [requiredId('originMarketId'), requiredId('targetMarketId'), requiredId('productId')], validate, asyncHandler(createController(comparisonService).compare));
  return router;
};
