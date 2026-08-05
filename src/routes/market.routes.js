const createController = require('../controllers/market.controller');
const asyncHandler = require('../middlewares/async-handler');
module.exports = (marketService) => {
  const router = require('express').Router();
  router.get('/', asyncHandler(createController(marketService).list));
  return router;
};
