const { success } = require('./response');
module.exports = (priceService) => ({
  create: async (req, res) => success(res, await priceService.create(req.body), 201),
  update: async (req, res) => success(res, await priceService.update(Number(req.params.id), req.body.price)),
  list: async (req, res) => success(res, await priceService.list({ marketId: req.query.marketId ? Number(req.query.marketId) : undefined, productId: req.query.productId ? Number(req.query.productId) : undefined }))
});
