const { query } = require('express-validator');
const validate = require('../middlewares/validate-request');
const asyncHandler = require('../middlewares/async-handler');
const { success } = require('../utils/response');
const requiredId = (field) => query(field).isInt({ min: 1 }).withMessage(`${field} deve ser um ID numérico válido.`);
module.exports = (comparisonService) => {
  const router = require('express').Router();
  router.get('/', [requiredId('originMarketId'), requiredId('targetMarketId'), requiredId('productId')], validate, asyncHandler(async (req, res) => success(res, await comparisonService.compare({ originMarketId: Number(req.query.originMarketId), targetMarketId: Number(req.query.targetMarketId), productId: Number(req.query.productId) }))));
  return router;
};
