const asyncHandler = require('../middlewares/async-handler');
const { success } = require('../utils/response');
module.exports = (marketRepository) => {
  const router = require('express').Router();
  router.get('/', asyncHandler(async (_req, res) => success(res, await marketRepository.findAll())));
  return router;
};
